/* ═══════════════════════════════════════════════════════════
   check-hub.cjs – GAME HUB: kevyt asset-/versio-/invarianttitarkistus

   Aja: node tools/check-hub.cjs
   ═══════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));
let pass = 0, fail = 0;
function ok(msg, cond) {
    if (cond) { pass++; console.log('OK   ' + msg); }
    else { fail++; console.log('FAIL ' + msg); }
}

/* ── 1. Pakolliset tiedostot ─────────────────────────────── */
const files = [
    'index.html', 'style.css', 'hub.css', 'gamehub.js', 'audio.js',
    'jukebox/tracks.js',
    'bm/game_main.html', 'digGame1/game_main.html', 'digGame2/game_main.html',
    'fruitgame/game_main.html', 'sinkship/game_main.html'
];
files.forEach((f) => ok('tiedosto: ' + f, exists(f)));
ok('ei street-osaa (street.js)', !exists('street.js'));
ok('ei gameState.js-tiedostoa', !exists('gameState.js'));

/* ── 2. Versioleimat ─────────────────────────────────────── */
const index = read('index.html');
const m = /id="version-tag">v([\d.]+)</.exec(index);
ok('index.html: #version-tag löytyy', !!m);
const VERSION = m ? m[1] : '';
ok('versio on v10.01', VERSION === '10.01');
const stamped = [
    'style.css', 'hub.css', 'jukebox/tracks.js', 'audio.js', 'gamehub.js'
];
stamped.forEach((f) => {
    ok(f + ': ?v=' + VERSION, index.indexOf(f + '?v=' + VERSION) !== -1);
});

/* ── 3. Pelirekisteri ja napit ───────────────────────────── */
const gamehub = read('gamehub.js');
const expected = [
    ['bm', 'bm/game_main.html'],
    ['digGame1', 'digGame1/game_main.html'],
    ['digGame2', 'digGame2/game_main.html'],
    ['fruitgame', 'fruitgame/game_main.html'],
    ['sinkship', 'sinkship/game_main.html']
];
expected.forEach(([id, p]) => {
    ok('GAMES: ' + id + ' → ' + p,
        gamehub.indexOf("id: '" + id + "'") !== -1 && gamehub.indexOf("path: '" + p + "'") !== -1);
    ok('valikkonappi data-game=' + id, index.indexOf('data-game="' + id + '"') !== -1);
});
ok('valikkonappeja on 5', (index.match(/data-game="/g) || []).length === 5);

/* ── 4. Jukebox-raidat ───────────────────────────────────── */
const tracksSrc = read('jukebox/tracks.js');
const urls = Array.from(tracksSrc.matchAll(/url:\s*'([^']+)'/g)).map((x) => x[1]);
const covers = Array.from(tracksSrc.matchAll(/cover:\s*'([^']+)'/g)).map((x) => x[1]);
ok('jukebox: 9 raitaa', urls.length === 9);
ok('jukebox: 9 kantta', covers.length === 9);
urls.forEach((u) => ok('raita löytyy: ' + u, exists(u)));
covers.forEach((c) => ok('kansi löytyy: ' + c, exists(c)));
ok('menu-pooli 1–3', /GAMEHUB_MENU_TRACK_IDS\s*=\s*\[1,\s*2,\s*3\]/.test(tracksSrc));

/* ── 5. Vain gamehub_*-localStorage-avaimet ──────────────── */
const textFiles = [];
(function walk(dir) {
    fs.readdirSync(dir).forEach((name) => {
        if (name === '.git' || name === 'jukebox' || name === 'tools') return;
        const full = path.join(dir, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) walk(full);
        else if (/\.(js|html|css)$/i.test(name)) textFiles.push(full);
    });
})(ROOT);
const allText = textFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
ok('gamehub_state käytössä', allText.indexOf('gamehub_state') !== -1);
ok('gamehub_fruit_free käytössä', allText.indexOf('gamehub_fruit_free') !== -1);
const keyValues = [
    ...Array.from(allText.matchAll(/(?:STORAGE_KEY|CACHE_KEY|FREE_SPIN_KEY)\s*=\s*'([^']+)'/g)),
    ...Array.from(allText.matchAll(/localStorage\.(?:getItem|setItem)\(\s*'([^']+)'/g))
].map((m) => m[1]);
const uniqueKeys = Array.from(new Set(keyValues));
ok('localStorage-avaimet vain gamehub_*',
    uniqueKeys.length > 0 && uniqueKeys.every((k) => k.indexOf('gamehub_') === 0),
    uniqueKeys.join(', '));

/* ── 6. Hubin kriittiset kytkennät ───────────────────────── */
ok('iframe-close-btn', index.indexOf('id="iframe-close-btn"') !== -1);
ok('RETURN_TO_STREET-vastaanotto', gamehub.indexOf("'RETURN_TO_STREET'") !== -1);
ok('fruitSync-lähetys', gamehub.indexOf("type: 'fruitSync'") !== -1);
ok('fruitBet-käsittely', gamehub.indexOf("'fruitBet'") !== -1);
ok('fruitWin-käsittely', gamehub.indexOf("'fruitWin'") !== -1);
ok('COIN_COLLECTED-käsittely', gamehub.indexOf("'COIN_COLLECTED'") !== -1);
ok('top-up', index.indexOf('id="topup-btn"') !== -1 && gamehub.indexOf('function topUp') !== -1);

/* ── 7. Paikalliset script/link-viittaukset ──────────────── */
const refs = Array.from(index.matchAll(/(?:src|href)="([^"]+)"/g))
    .map((x) => x[1])
    .filter((u) => !/^(https?:|#|data:)/.test(u))
    .map((u) => u.split('?')[0]);
refs.forEach((u) => ok('viitattu tiedosto: ' + u, exists(u)));

console.log('\nTulos: ' + pass + ' OK, ' + fail + ' löydöstä');
process.exit(fail ? 1 : 0);
