/* ═══════════════════════════════════════════════════════════
   audio.js – GAME HUB

   1) menu-musiikki: satunnainen raita 1–3:sta, loopissa
   2) jukebox-jono: vapaasti valitut raidat, soi myös pelien aikana

   EI taustasynthiä, ei kaaos-introa eikä musiikkisykliä.
   ═══════════════════════════════════════════════════════════ */
const GameHubAudio = (() => {
    const MENU_VOLUME = 0.05;
    const JUKEBOX_VOLUME = 0.10;

    let ctx = null;

    let menuEl = null;
    let menuActive = false;
    let menuPick = null;
    let menuFadeTimer = null;

    let jukeEl = null;
    let jukeQueue = [];
    let jukePos = -1;
    let jukePlaying = false;

    function init() {
        if (!ctx) {
            try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
        }
        if (ctx && ctx.state === 'suspended') {
            try { ctx.resume(); } catch (e) {}
        }
    }

    /* Pieni retro-klikki ohjeikkunalle (ei musiikkia). */
    function tone(freq, dur, type, gain, slideTo) {
        init();
        if (!ctx) return;
        try {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = type || 'square';
            osc.frequency.setValueAtTime(freq, now);
            if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + dur);
            g.gain.setValueAtTime(gain || 0.015, now);
            g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
            osc.connect(g).connect(ctx.destination);
            osc.start(now);
            osc.stop(now + dur + 0.02);
        } catch (e) {}
    }
    function playPanelOn() { tone(420, 0.07, 'square', 0.018, 660); }
    function playPanelOff() { tone(320, 0.09, 'square', 0.018, 140); }
    function playTypeClick() { tone(680 + Math.random() * 180, 0.012, 'square', 0.006); }

    /* Alkumusiikki arvotaan kerran per sivulataus raidoista 1–3. */
    function pickMenuTrack() {
        if (menuPick) return menuPick;
        const all = window.GAMEHUB_TRACKS || [];
        const ids = window.GAMEHUB_MENU_TRACK_IDS || [1, 2, 3];
        const pool = all.filter((t) => ids.indexOf(t.id) !== -1);
        menuPick = pool.length ? pool[Math.floor(Math.random() * pool.length)] : (all[0] || null);
        return menuPick;
    }

    function startMenuMusic() {
        if (jukePlaying) return;
        init();
        if (menuActive && menuEl && !menuEl.paused) return;
        const t = pickMenuTrack();
        if (!t) return;
        if (!menuEl) {
            try {
                menuEl = new Audio(t.url);
                menuEl.loop = true;
                menuEl.preload = 'auto';
            } catch (e) { return; }
        }
        try { menuEl.volume = MENU_VOLUME; } catch (e) {}
        menuActive = true;
        try {
            const p = menuEl.play();
            if (p && typeof p.catch === 'function') p.catch(() => { menuActive = false; });
        } catch (e) { menuActive = false; }
    }

    function stopMenuMusic() {
        menuActive = false;
        if (menuFadeTimer) { clearInterval(menuFadeTimer); menuFadeTimer = null; }
        if (menuEl) {
            try { menuEl.pause(); } catch (e) {}
            try { menuEl.currentTime = 0; } catch (e) {}
            try { menuEl.volume = MENU_VOLUME; } catch (e) {}
        }
    }

    function fadeOutMenuMusic(ms) {
        if (!menuEl) { menuActive = false; return; }
        if (menuFadeTimer) { clearInterval(menuFadeTimer); menuFadeTimer = null; }
        const dur = Math.max(0, ms | 0);
        if (!dur) { stopMenuMusic(); return; }
        const stepMs = 50;
        const steps = Math.max(1, Math.round(dur / stepMs));
        let i = 0;
        menuActive = false;
        menuFadeTimer = setInterval(() => {
            i++;
            try { menuEl.volume = MENU_VOLUME * Math.max(0, 1 - i / steps); } catch (e) {}
            if (i >= steps) {
                clearInterval(menuFadeTimer);
                menuFadeTimer = null;
                stopMenuMusic();
            }
        }, stepMs);
    }

    function setMenuActive(on) {
        if (on) startMenuMusic();
        else stopMenuMusic();
    }

    /* ── Jukebox ───────────────────────────────────────── */
    function startJukeTrack() {
        if (!jukeEl) return false;
        const url = jukeQueue[jukePos];
        if (!url) return false;
        try {
            jukeEl.src = url;
            jukeEl.volume = JUKEBOX_VOLUME;
            const p = jukeEl.play();
            if (p && typeof p.catch === 'function') {
                p.catch(() => { jukePlaying = false; });
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    function onJukeEnded() {
        if (jukePos + 1 < jukeQueue.length) {
            jukePos++;
            startJukeTrack();
            return;
        }
        stopJukebox();
    }

    function ensureJukeEl() {
        if (jukeEl) return true;
        try {
            jukeEl = new Audio();
            jukeEl.preload = 'auto';
            jukeEl.addEventListener('ended', onJukeEnded);
            jukeEl.addEventListener('error', () => { stopJukebox(); });
            return true;
        } catch (e) {
            jukeEl = null;
            return false;
        }
    }

    /* Soittaa valitun jonon alusta (tai startPosista). */
    function playJukeboxQueue(urls, startPos = 0) {
        if (!urls || !urls.length) return false;
        init();
        if (!ensureJukeEl()) return false;
        stopMenuMusic();
        jukeQueue = urls.slice();
        jukePos = Math.max(0, Math.min(startPos, urls.length - 1));
        jukePlaying = true;
        if (!startJukeTrack()) {
            stopJukebox();
            return false;
        }
        return true;
    }

    /* Lisää raidat nykyisen jonon perään (soivan raidan jälkeen). */
    function appendJukeboxQueue(urls) {
        if (!urls || !urls.length) return false;
        if (!jukePlaying) return playJukeboxQueue(urls);
        jukeQueue = jukeQueue.concat(urls);
        return true;
    }

    function stopJukebox() {
        jukePlaying = false;
        jukeQueue = [];
        jukePos = -1;
        if (jukeEl) {
            try { jukeEl.pause(); } catch (e) {}
            try { jukeEl.currentTime = 0; } catch (e) {}
        }
    }

    function isJukeboxPlaying() { return jukePlaying; }
    function getJukeboxQueuePos() { return jukePos; }
    function getJukeboxQueueLength() { return jukeQueue.length; }
    function getCurrentJukeboxUrl() { return jukeQueue[jukePos] || null; }

    return {
        init,
        setMenuActive,
        startMenuMusic,
        stopMenuMusic,
        fadeOutMenuMusic,
        playPanelOn,
        playPanelOff,
        playTypeClick,
        playJukeboxQueue,
        appendJukeboxQueue,
        stopJukebox,
        isJukeboxPlaying,
        getJukeboxQueuePos,
        getJukeboxQueueLength,
        getCurrentJukeboxUrl
    };
})();
