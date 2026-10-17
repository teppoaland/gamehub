/* ═══════════════════════════════════════════════════════════
   gamehub.js – GAME HUB

   Valikko, pelien iframe-käynnistys, kukkaro ja jukebox.
   Pelit ovat omia kokonaisuuksiaan; hub kuuntelee niiden
   postMessage-viestejä (RETURN_TO_STREET, fruitBet, fruitWin,
   COIN_COLLECTED) ja palaa aina pelivalintaan.
   ═══════════════════════════════════════════════════════════ */
const GameHub = (() => {
    const GAMES = [
        { id: 'bm',        label: 'BLUE MÄX',      path: 'bm/game_main.html' },
        { id: 'digGame1',  label: 'DIG GAME',      path: 'digGame1/game_main.html' },
        { id: 'digGame2',  label: 'DIG DÄSH',      path: 'digGame2/game_main.html' },
        { id: 'fruitgame', label: 'FRUIT MACHINE', path: 'fruitgame/game_main.html' },
        { id: 'sinkship',  label: 'BATTLESHIP',    path: 'sinkship/game_main.html' }
    ];

    const STORAGE_KEY = 'gamehub_state';
    const DEFAULT_WALLET = 20;
    const TOPUP_AMOUNT = 20;

    const GATE_MENU_DELAY_MS = 2000;
    const AUTO_HOVER_ON = (new URLSearchParams(window.location.search)).get('autohover') !== '0';
    const AUTO_HOVER_START_MS = 5000;
    const AUTO_HOVER_RETRY_MS = 500;
    const AUTO_HOVER_REPEAT_MS = 10000;
    const AUTO_HOVER_STEP_MS = 173;
    const AUTO_HOVER_HOLD_MS = 2000;
    const AUTO_HOVER_SHAKE_CLASS = 'shaking';

    let state = loadState();
    let iframeOpen = false;
    let jukeOpen = false;
    let currentGameId = null;
    let menuBusy = false;

    let menu = null;
    let gate = null;
    let iframeOverlay = null;
    let iframe = null;

    /* ── Tila ───────────────────────────────────────────── */
    function loadState() {
        const out = { wallet: DEFAULT_WALLET, jukeboxSelected: [] };
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const p = JSON.parse(raw);
                if (p && typeof p.wallet === 'number' && isFinite(p.wallet)) {
                    out.wallet = Math.max(0, Math.floor(p.wallet));
                }
                if (p && Array.isArray(p.jukeboxSelected)) {
                    out.jukeboxSelected = p.jukeboxSelected.slice();
                }
            }
        } catch (e) {}
        return out;
    }
    function saveState() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    }
    function wallet() { return state.wallet; }
    function addCoins(n) {
        const d = Math.floor(Number(n) || 0);
        if (!d) return;
        state.wallet = Math.max(0, Math.floor(state.wallet + d));
        saveState();
        updateWalletUI();
    }
    function updateWalletUI() {
        const el = document.getElementById('hub-wallet');
        if (el) {
            el.textContent = 'BALANCE ' + state.wallet;
            el.classList.toggle('empty', state.wallet <= 0);
        }
        const top = document.getElementById('topup-btn');
        if (top) top.classList.toggle('hidden', state.wallet > 0);
    }
    function topUp() {
        if (state.wallet > 0) return;
        state.wallet = TOPUP_AMOUNT;
        saveState();
        updateWalletUI();
        if (currentGameId === 'fruitgame') syncFruit();
        if (GameHubAudio.playPanelOn) GameHubAudio.playPanelOn();
    }

    /* ── Käynnistys ─────────────────────────────────────── */
    function init() {
        menu = document.getElementById('chaos-menu');
        gate = document.getElementById('start-gate');
        if (!menu) return;

        iframeOverlay = document.getElementById('game-iframe-overlay');
        iframe = iframeOverlay ? iframeOverlay.querySelector('iframe') : null;

        bindMenu();
        bindInstructions();
        bindJukebox();
        bindGameOverlay();
        window.addEventListener('message', onGameMessage);
        updateWalletUI();
        renderJukebox();
        beginGate();
        startUiTicker();

        /* Uudet raidat aistreen jukebox-kansiosta – ei estä käynnistystä. */
        refreshTracksFromGitHub();
    }

    function beginGate() {
        if (!gate) { showMenu(); return; }
        gate.classList.remove('hidden');
        let unlocked = false;

        const unlock = (e) => {
            if (unlocked) return;
            unlocked = true;
            if (e && e.cancelable) e.preventDefault();
            GameHubAudio.init();
            GameHubAudio.startMenuMusic();
            gate.classList.add('faded');
            startAutoHover();       // kello käy gaten napautuksesta, kuten AI-pelissä
            window.removeEventListener('keydown', onGateKey);
            setTimeout(() => {
                gate.classList.add('hidden');
                showMenu();
            }, GATE_MENU_DELAY_MS);
        };
        const onGateKey = (e) => {
            if (e.key === 'Escape') return;
            unlock(e);
        };
        gate.addEventListener('click', unlock);
        gate.addEventListener('touchend', (e) => {
            if (e.cancelable) e.preventDefault();
            unlock(e);
        }, { passive: false });
        window.addEventListener('keydown', onGateKey);
    }

    function showMenu() {
        if (!menu) return;
        menu.classList.remove('hidden');
        menu.classList.remove('faded');
        updateWalletUI();
        updateJukeboxStatus();
        if (!GameHubAudio.isJukeboxPlaying()) GameHubAudio.startMenuMusic();
        startAutoHover();
    }

    function menuVisible() {
        return !!menu && !menu.classList.contains('hidden');
    }

    /* ── Pelivalinta ────────────────────────────────────── */
    function bindMenu() {
        menu.querySelectorAll('[data-game]').forEach((btn) => {
            const fn = () => startGame(btn.getAttribute('data-game'));
            btn.addEventListener('click', fn);
            btn.addEventListener('touchend', (e) => {
                if (e.cancelable) e.preventDefault();
                fn();
            }, { passive: false });
            btn.addEventListener('touchstart', stopAutoHover, { passive: true });
        });
        const top = document.getElementById('topup-btn');
        if (top) {
            top.addEventListener('click', topUp);
            top.addEventListener('touchend', (e) => {
                if (e.cancelable) e.preventDefault();
                topUp();
            }, { passive: false });
        }
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) startAutoHover();
        });
    }

    function startGame(id) {
        if (menuBusy || iframeOpen) return;
        const game = GAMES.filter((g) => g.id === id)[0];
        if (!game) return;
        menuBusy = true;
        stopAutoHover();
        menu.classList.add('faded');
        GameHubAudio.fadeOutMenuMusic(350);
        setTimeout(() => {
            menu.classList.add('hidden');
            menu.classList.remove('faded');
            openGame(game);
            menuBusy = false;
        }, 300);
    }

    function openGame(game) {
        if (!iframeOverlay || !iframe) return;
        currentGameId = game.id;
        iframeOverlay.classList.add('active');
        iframeOpen = true;
        iframe.onload = () => {
            try { iframe.contentWindow.focus(); } catch (e) {}
            if (game.id === 'fruitgame') syncFruit();
        };
        iframe.src = game.path;
    }

    function closeGame() {
        if (!iframeOverlay || !iframeOverlay.classList.contains('active')) return false;
        if (!iframe) return false;
        try { if (iframe.contentWindow) iframe.contentWindow.blur(); } catch (e) {}
        try { iframe.blur(); } catch (e) {}
        iframeOverlay.classList.remove('active');
        iframe.src = '';
        iframeOpen = false;
        currentGameId = null;
        updateWalletUI();
        showMenu();
        window.focus();
        return true;
    }

    /* ── Pelin viestit ──────────────────────────────────── */
    function syncFruit() {
        if (!iframeOpen || !iframe || !iframe.contentWindow) return;
        try {
            iframe.contentWindow.postMessage({ type: 'fruitSync', coins: state.wallet }, '*');
        } catch (e) {}
    }

    function onGameMessage(e) {
        /* Vastaanota viestit vain, kun peli-iframe on auki. */
        if (!iframeOpen) return;
        const d = e.data;
        if (d === 'RETURN_TO_STREET' || d === 'RETURN_TO_HUB') {
            closeGame();
            return;
        }
        if (d === 'COIN_COLLECTED') {
            addCoins(1);
            return;
        }
        if (d && d.type === 'fruitBet') {
            addCoins(-1);
            syncFruit();
            return;
        }
        if (d && d.type === 'fruitWin' && typeof d.coins === 'number') {
            addCoins(Math.max(0, Math.floor(d.coins)));
            syncFruit();
            return;
        }
        /* KEY_COLLECTED / BM_KEY_COLLECTED / BOULDER_KEY_COLLECTED
           eivät kuulu hubiin – jätetään huomiotta. */
    }

    function bindGameOverlay() {
        const btn = document.getElementById('iframe-close-btn');
        if (!btn) return;
        let lastCloseAt = 0;
        const fn = () => {
            const now = Date.now();
            if (now - lastCloseAt < 600) return;
            lastCloseAt = now;
            closeGame();
        };
        btn.addEventListener('click', fn);
        btn.addEventListener('touchend', (e) => {
            if (e.cancelable) e.preventDefault();
            fn();
        }, { passive: false });
    }

    /* ── INSTRUCTIONS (sama CRT-kirjoitus kuin AI-pelissä) ── */
    let insLink = null;
    let insOverlay = null;
    let insPanel = null;
    let insBody = null;
    let insSource = null;
    let insTimer = null;
    let insCloseTimer = null;
    let insOpen = false;
    let insClosing = false;
    let insLines = null;

    const INS_OPEN_MS = 1000;
    const INS_CLOSE_MS = 2000;
    const INS_TYPE_BASE_MS = 18;
    const INS_TYPE_COMMA_MS = 120;
    const INS_TYPE_SENTENCE_MS = 260;
    const INS_TYPE_LINE_MS = 320;
    const INS_TYPE_CLICK_EVERY = 3;

    function insReducedMotion() {
        return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    function readInstructions() {
        if (insLines || !insSource) return insLines;
        insLines = [];
        insSource.querySelectorAll('h2, p').forEach((el) => {
            insLines.push({ tag: el.tagName.toLowerCase(), text: el.textContent.trim() });
        });
        return insLines;
    }

    function bindInstructions() {
        insLink = document.getElementById('instructions-link');
        insOverlay = document.getElementById('instructions-overlay');
        insPanel = document.getElementById('instructions-panel');
        insBody = document.getElementById('instructions-body');
        insSource = document.getElementById('instructions-source');
        bindInsTap(insLink, openInstructions);
        bindInsTap(insOverlay, closeInstructions);
    }

    function bindInsTap(el, fn) {
        if (!el) return;
        el.addEventListener('click', fn);
        el.addEventListener('touchend', (e) => {
            if (e.cancelable) e.preventDefault();
            fn();
        }, { passive: false });
    }

    function typeInstructions() {
        const lines = readInstructions();
        if (!lines || !lines.length || !insBody) return;
        let li = 0, ci = 0, clicks = 0, lineEl = null, node = null, caret = null;

        function finishTyping() {
            blinkFinalWords();
            insBody.classList.add('ins-done');
        }

        function step() {
            insTimer = null;
            if (insClosing) return;
            if (li >= lines.length) { finishTyping(); return; }

            if (!lineEl) {
                lineEl = document.createElement(lines[li].tag);
                lineEl.className = lines[li].text ? 'ins-line' : 'ins-line ins-gap';
                node = document.createTextNode('');
                caret = document.createElement('span');
                caret.className = 'ins-caret';
                caret.textContent = '▮';
                lineEl.appendChild(node);
                lineEl.appendChild(caret);
                insBody.appendChild(lineEl);
                insTimer = setTimeout(step, INS_TYPE_LINE_MS);
                return;
            }

            const text = lines[li].text;
            const ch = text.charAt(ci++);
            node.textContent += ch;
            if (insPanel) insPanel.scrollTop = insPanel.scrollHeight;
            if (ch && ++clicks % INS_TYPE_CLICK_EVERY === 0) GameHubAudio.playTypeClick();

            if (ci >= text.length) {
                if (caret && caret.parentNode) caret.parentNode.removeChild(caret);
                li++; ci = 0; lineEl = null; node = null; caret = null;
                insTimer = setTimeout(step, INS_TYPE_LINE_MS);
                return;
            }
            let pause = INS_TYPE_BASE_MS;
            if (ch === ',' || ch === ';' || ch === ':') pause += INS_TYPE_COMMA_MS;
            else if (ch === '.' || ch === '!' || ch === '?') pause += INS_TYPE_SENTENCE_MS;
            insTimer = setTimeout(step, pause);
        }
        step();
    }

    function blinkFinalWords() {
        const last = insBody && insBody.lastElementChild;
        const node = last && last.firstChild;
        if (!node || !node.textContent) return;
        const m = /(HAVE\s+FUN!?)\s*$/i.exec(node.textContent);
        if (!m) return;
        const span = document.createElement('span');
        span.className = 'ins-fun ins-blink';
        span.textContent = m[1];
        node.textContent = node.textContent.slice(0, m.index);
        last.appendChild(span);
    }

    function openInstructions() {
        if (!insOverlay || iframeOpen || jukeOpen || insOpen || insClosing) return;
        insOpen = true;
        stopAutoHover();
        if (insBody) { insBody.innerHTML = ''; insBody.classList.remove('ins-done'); }
        if (insPanel) insPanel.scrollTop = 0;
        insOverlay.classList.remove('hidden');
        if (GameHubAudio.playPanelOn) GameHubAudio.playPanelOn();
        window.addEventListener('keydown', onInsKey);
        insTimer = setTimeout(typeInstructions, insReducedMotion() ? 0 : INS_OPEN_MS);
    }

    function closeInstructions() {
        if (!insOverlay || !insOpen || insClosing) return;
        insClosing = true;
        if (insTimer) { clearTimeout(insTimer); insTimer = null; }
        window.removeEventListener('keydown', onInsKey);
        if (GameHubAudio.playPanelOff) GameHubAudio.playPanelOff();
        insOverlay.classList.add('ins-closing');
        insOverlay.addEventListener('animationend', onInsClosed);
        insCloseTimer = setTimeout(onInsClosed, insReducedMotion() ? 0 : INS_CLOSE_MS);
    }

    function onInsClosed(e) {
        if (e && e.target !== insOverlay) return;
        if (insCloseTimer) { clearTimeout(insCloseTimer); insCloseTimer = null; }
        insOverlay.removeEventListener('animationend', onInsClosed);
        insOverlay.classList.remove('ins-closing');
        insOverlay.classList.add('hidden');
        insOpen = false;
        insClosing = false;
        if (menuVisible() && !iframeOpen && !jukeOpen) startAutoHover();
    }

    function onInsKey(e) {
        if (e.key === 'Escape') { e.preventDefault(); closeInstructions(); }
    }

    /* ── Auto-hover + näytön tärinä (AI-pelistä) ────────── */
    let autoHoverNext = null;
    let autoHoverTimers = [];

    function autoHoverBtns() {
        return Array.prototype.slice.call(menu.querySelectorAll('.chaos-buttons button'));
    }
    function clearAutoHover() {
        autoHoverTimers.forEach((t) => clearTimeout(t));
        autoHoverTimers = [];
        autoHoverBtns().forEach((b) => b.classList.remove('auto-hover'));
        if (menu) menu.classList.remove(AUTO_HOVER_SHAKE_CLASS);
    }
    function stopAutoHover() {
        if (autoHoverNext) { clearTimeout(autoHoverNext); autoHoverNext = null; }
        clearAutoHover();
    }
    function canAutoHover() {
        return AUTO_HOVER_ON && menuVisible() && !menu.classList.contains('faded') &&
               !iframeOpen && !jukeOpen && !insOpen && !insClosing && !document.hidden;
    }
    function autoHoverSweep() {
        if (!canAutoHover()) return false;
        clearAutoHover();
        const btns = autoHoverBtns();
        if (!btns.length) return true;
        const under = menu.querySelector('.chaos-buttons button:hover');
        const last = btns.length - 1;
        btns.forEach((btn, i) => {
            const hovered = (btn === under);
            const hold = (i === last) ? AUTO_HOVER_HOLD_MS : 0;
            if (!hovered) {
                autoHoverTimers.push(setTimeout(() => btn.classList.add('auto-hover'), i * AUTO_HOVER_STEP_MS));
                autoHoverTimers.push(setTimeout(() => btn.classList.remove('auto-hover'),
                    i * AUTO_HOVER_STEP_MS + (hold || AUTO_HOVER_STEP_MS)));
            }
            if (hold) {
                autoHoverTimers.push(setTimeout(() => menu.classList.add(AUTO_HOVER_SHAKE_CLASS), i * AUTO_HOVER_STEP_MS));
                autoHoverTimers.push(setTimeout(() => menu.classList.remove(AUTO_HOVER_SHAKE_CLASS), i * AUTO_HOVER_STEP_MS + hold));
            }
        });
        return true;
    }
    function scheduleAutoHover(delay) {
        autoHoverNext = setTimeout(() => {
            autoHoverNext = null;
            if (!AUTO_HOVER_ON) return;
            if (!canAutoHover()) return;
            const ran = autoHoverSweep();
            scheduleAutoHover(ran ? AUTO_HOVER_REPEAT_MS : AUTO_HOVER_RETRY_MS);
        }, delay);
    }
    function startAutoHover() {
        if (!AUTO_HOVER_ON || autoHoverNext) return;
        scheduleAutoHover(AUTO_HOVER_START_MS);
    }

    /* ── Jukebox ────────────────────────────────────────── */
    let tracks = (window.GAMEHUB_TRACKS || []).slice();
    let selected = new Set(state.jukeboxSelected || []);
    let jukeOverlay = null;
    let jukeListEl = null;
    let jukeNowEl = null;
    let jukePosEl = null;
    let jukeCoverEl = null;
    let lastJukePlaying = false;

    function bindJukebox() {
        jukeOverlay = document.getElementById('jukebox-overlay');
        jukeListEl = document.getElementById('jukebox-list');
        jukeNowEl = document.getElementById('juke-now');
        jukePosEl = document.getElementById('juke-pos');
        jukeCoverEl = document.getElementById('juke-cover');

        bindInsTap(document.getElementById('jukebox-link'), openJukebox);
        bindInsTap(document.getElementById('juke-play'), playSelectedTracks);
        bindInsTap(document.getElementById('juke-stop'), stopJukebox);
        bindInsTap(document.getElementById('juke-close'), closeJukebox);
    }

    function openJukebox() {
        if (!jukeOverlay || iframeOpen || insOpen || insClosing) return;
        jukeOpen = true;
        stopAutoHover();
        renderJukebox();
        updateJukeboxStatus();
        jukeOverlay.classList.remove('hidden');
        if (GameHubAudio.playPanelOn) GameHubAudio.playPanelOn();
    }

    function closeJukebox() {
        if (!jukeOverlay || !jukeOpen) return;
        jukeOpen = false;
        jukeOverlay.classList.add('hidden');
        if (GameHubAudio.playPanelOff) GameHubAudio.playPanelOff();
        if (!GameHubAudio.isJukeboxPlaying() && menuVisible()) GameHubAudio.startMenuMusic();
        startAutoHover();
    }

    function onToggleTrack(id, on) {
        if (on) selected.add(id);
        else selected.delete(id);
        state.jukeboxSelected = Array.from(selected);
        saveState();
        const row = jukeListEl ? jukeListEl.querySelector('[data-track-id="' + id + '"]') : null;
        if (row) row.classList.toggle('selected', on);
    }

    function renderJukebox() {
        if (!jukeListEl) return;
        jukeListEl.innerHTML = '';
        if (!tracks.length) {
            const empty = document.createElement('div');
            empty.className = 'juke-empty';
            empty.textContent = 'No tracks found.';
            jukeListEl.appendChild(empty);
            return;
        }
        tracks.forEach((track) => {
            const row = document.createElement('div');
            row.className = 'juke-row' + (selected.has(track.id) ? ' selected' : '');
            row.setAttribute('data-track-id', String(track.id));

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = selected.has(track.id);
            cb.setAttribute('aria-label', track.title);
            cb.addEventListener('change', () => onToggleTrack(track.id, cb.checked));

            const img = document.createElement('img');
            img.alt = '';
            img.draggable = false;
            if (track.cover) img.src = track.cover;
            else img.style.visibility = 'hidden';

            const title = document.createElement('div');
            title.className = 'juke-title';
            title.textContent = track.title;

            const dur = document.createElement('div');
            dur.className = 'juke-dur';
            dur.textContent = track.duration || '';

            row.appendChild(cb);
            row.appendChild(img);
            row.appendChild(title);
            row.appendChild(dur);
            row.addEventListener('click', (e) => {
                if (e.target === cb) return;
                cb.checked = !cb.checked;
                onToggleTrack(track.id, cb.checked);
            });
            jukeListEl.appendChild(row);
        });
    }

    function playSelectedTracks() {
        const urls = tracks.filter((t) => selected.has(t.id)).map((t) => t.url);
        if (!urls.length) {
            if (jukeNowEl) jukeNowEl.textContent = 'Select at least one track.';
            if (GameHubAudio.playPanelOff) GameHubAudio.playPanelOff();
            return;
        }
        const ok = GameHubAudio.playJukeboxQueue(urls, 0);
        if (!ok) {
            if (jukeNowEl) jukeNowEl.textContent = 'Audio blocked – tap PLAY again.';
            return;
        }
        if (GameHubAudio.playPanelOn) GameHubAudio.playPanelOn();
        updateJukeboxStatus();
    }

    function stopJukebox() {
        GameHubAudio.stopJukebox();
        updateJukeboxStatus();
        if (!jukeOpen && menuVisible()) GameHubAudio.startMenuMusic();
    }

    function updateJukeboxStatus() {
        const playing = GameHubAudio.isJukeboxPlaying();
        const pos = GameHubAudio.getJukeboxQueuePos();
        const len = GameHubAudio.getJukeboxQueueLength();
        const url = GameHubAudio.getCurrentJukeboxUrl();
        const track = url ? tracks.filter((t) => t.url === url)[0] : null;

        if (jukeNowEl) jukeNowEl.textContent = (playing && track) ? '♪ ' + track.title : 'Nothing playing';
        if (jukePosEl) jukePosEl.textContent = playing && len ? (pos + 1) + ' / ' + len : '';
        if (jukeCoverEl) {
            const has = !!(track && track.cover);
            jukeCoverEl.style.visibility = has ? 'visible' : 'hidden';
            if (has) jukeCoverEl.src = track.cover;
        }
    }

    function startUiTicker() {
        setInterval(() => {
            updateJukeboxStatus();
            const playing = GameHubAudio.isJukeboxPlaying();
            if (lastJukePlaying && !playing) {
                /* Jono päättyi: menu-musiikki takaisin vain, jos ollaan
                   valikossa eikä jukebox-overlay ole auki. */
                if (menuVisible() && !jukeOpen && !iframeOpen) GameHubAudio.startMenuMusic();
            }
            lastJukePlaying = playing;
        }, 500);
    }

    /* ── Uusien biisien haku aistreen jukebox-kansiosta ─────
       GitHub API + 1 h välimuisti. Jos verkko ei toimi, käytetään
       bundlattua tracks.js-listaa. Ei koskaan estä hubin käynnistystä. */
    function prettifyTrackName(name) {
        return String(name || '')
            .replace(/\.mp3$/i, '')
            .replace(/^\d+[_-]+/, '')
            .replace(/[_-]+/g, ' ')
            .trim();
    }

    function applyRemoteTracks(list) {
        if (!Array.isArray(list) || !list.length) return;
        const base = (window.GAMEHUB_TRACKS || []).slice();
        const merged = base.slice();
        let nextId = 100;
        list.forEach((t) => {
            if (!t || !t.url) return;
            const file = t.url.split('/').pop();
            const exists = merged.some((b) => b.url === t.url || (b.url && b.url.split('/').pop() === file));
            if (!exists) {
                merged.push({
                    id: t.id || nextId++,
                    url: t.url,
                    title: t.title || prettifyTrackName(file),
                    duration: t.duration || '',
                    cover: t.cover || ''
                });
            }
        });
        if (merged.length > base.length) {
            tracks = merged;
            renderJukebox();
            updateJukeboxStatus();
        }
    }

    function refreshTracksFromGitHub() {
        const CACHE_KEY = 'gamehub_tracks_cache';
        const MAX_AGE = 60 * 60 * 1000;   // 1 h välimuisti (2 API-kutsua / lataus)
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (raw) {
                const c = JSON.parse(raw);
                if (c && c.at && (Date.now() - c.at) < MAX_AGE && Array.isArray(c.tracks)) {
                    applyRemoteTracks(c.tracks);
                    return;
                }
            }
        } catch (e) {}
        if (typeof fetch !== 'function') return;

        const REPO = 'https://api.github.com/repos/teppoaland/aistreet/contents/';
        fetch(REPO + 'jukebox?ref=main')
            .then((r) => r.ok ? r.json() : null)
            .then((files) => {
                if (!Array.isArray(files)) return;
                return fetch(REPO + 'jukebox/covers?ref=main')
                    .then((r) => r.ok ? r.json() : [])
                    .catch(() => [])
                    .then((covers) => {
                        const coverMap = {};
                        (Array.isArray(covers) ? covers : []).forEach((f) => {
                            if (f && f.name && f.download_url) coverMap[f.name] = f.download_url;
                        });
                        let nextId = 100;
                        const remote = [];
                        files.forEach((f) => {
                            if (!f || f.type !== 'file' || !/\.mp3$/i.test(f.name)) return;
                            const base = f.name.replace(/\.mp3$/i, '');
                            const cover = coverMap[base + '.png'] || coverMap[base + '.jpg'] ||
                                          coverMap[base + '.jpeg'] || '';
                            remote.push({
                                id: nextId++,
                                url: f.download_url,
                                title: prettifyTrackName(f.name),
                                duration: '',
                                cover: cover
                            });
                        });
                        if (!remote.length) return;
                        try {
                            localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), tracks: remote }));
                        } catch (e) {}
                        applyRemoteTracks(remote);
                    });
            })
            .catch(() => {});
    }

    function openGameById(id) {
        const g = GAMES.filter((x) => x.id === id)[0];
        if (g) openGame(g);
    }

    return {
        init,
        GAMES,
        openGame: openGameById,
        closeGame,
        openJukebox,
        closeJukebox,
        topUp,
        getWallet: wallet,
        addCoins,
        __t: {
            getTracks: () => tracks.slice(),
            getSelected: () => Array.from(selected),
            toggleTrack: onToggleTrack,
            updateJukeboxStatus,
            onGameMessage,
            getState: () => state,
            isIframeOpen: () => iframeOpen,
            setIframeOpen: (v) => { iframeOpen = !!v; },
            isJukeboxOpen: () => jukeOpen
        }
    };
})();

window.addEventListener('DOMContentLoaded', () => { GameHub.init(); });
