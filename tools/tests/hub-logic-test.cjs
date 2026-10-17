/* ═══════════════════════════════════════════════════════════
   hub-logic-test.cjs – GAME HUB: kukkaro + viestit + jukebox-valinnat

   Aja: node tools/tests/hub-logic-test.cjs
   ═══════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..', '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

let pass = 0, fail = 0;
function ok(msg, cond, extra) {
    if (cond) { pass++; console.log('OK   ' + msg); }
    else { fail++; console.log('FAIL ' + msg + (extra !== undefined ? ' (' + extra + ')' : '')); }
}

const store = {};
const localStorage = {
    getItem: (k) => (Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
};

const noop = () => {};
const documentStub = {
    hidden: false,
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: noop,
    createElement: () => ({ style: {}, classList: { add: noop, remove: noop, toggle: noop }, appendChild: noop, setAttribute: noop, addEventListener: noop }),
    body: { appendChild: noop }
};
const windowStub = {
    location: { search: '' },
    addEventListener: noop,
    removeEventListener: noop
};

const sandbox = {
    window: windowStub,
    document: documentStub,
    localStorage,
    console,
    setTimeout, clearTimeout, setInterval, clearInterval,
    URLSearchParams,
    fetch: () => Promise.reject(new Error('offline test')),
    GameHubAudio: {
        init: noop, startMenuMusic: noop, stopMenuMusic: noop, setMenuActive: noop,
        fadeOutMenuMusic: noop, playPanelOn: noop, playPanelOff: noop, playTypeClick: noop,
        playJukeboxQueue: () => true, appendJukeboxQueue: () => true, stopJukebox: noop,
        isJukeboxPlaying: () => false, getJukeboxQueuePos: () => -1,
        getJukeboxQueueLength: () => 0, getCurrentJukeboxUrl: () => null
    }
};
windowStub.document = documentStub;
vm.createContext(sandbox);

try {
    vm.runInContext(read('jukebox/tracks.js'), sandbox, { filename: 'jukebox/tracks.js' });
    vm.runInContext(read('gamehub.js'), sandbox, { filename: 'gamehub.js' });
    ok('tracks.js + gamehub.js latautuivat', true);
} catch (err) {
    console.error('FAIL lataus: ' + err.message);
    process.exit(1);
}

const H = vm.runInContext('GameHub', sandbox);
ok('GameHub on määritelty', !!H);
ok('5 peliä', H.GAMES.length === 5, H.GAMES.length);
ok('pelien järjestys', H.GAMES.map((g) => g.id).join(',') === 'bm,digGame1,digGame2,fruitgame,sinkship');
ok('alkusaldo 20', H.getWallet() === 20, H.getWallet());
ok('9 jukebox-raitaa', H.__t.getTracks().length === 9, H.__t.getTracks().length);

H.addCoins(-5);
ok('addCoins(-5) → 15', H.getWallet() === 15, H.getWallet());
H.addCoins(2);
ok('addCoins(2) → 17', H.getWallet() === 17, H.getWallet());
H.addCoins(-100);
ok('saldo ei mene negatiiviseksi', H.getWallet() === 0, H.getWallet());
H.topUp();
ok('topUp 0 → 20', H.getWallet() === 20, H.getWallet());
H.topUp();
ok('topUp ei lisää kun saldo > 0', H.getWallet() === 20, H.getWallet());

H.__t.toggleTrack(1, true);
ok('raita 1 valittu', H.__t.getSelected().indexOf(1) !== -1);
ok('valinta tallentui', JSON.parse(store.gamehub_state).jukeboxSelected.indexOf(1) !== -1);

H.__t.setIframeOpen(true);
H.__t.onGameMessage({ data: 'COIN_COLLECTED' });
ok('COIN_COLLECTED +1', H.getWallet() === 21, H.getWallet());
H.__t.onGameMessage({ data: { type: 'fruitBet' } });
ok('fruitBet −1', H.getWallet() === 20, H.getWallet());
H.__t.onGameMessage({ data: { type: 'fruitWin', coins: 3 } });
ok('fruitWin +3', H.getWallet() === 23, H.getWallet());
H.__t.onGameMessage({ data: { type: 'fruitWin', coins: -5 } });
ok('negatiivinen fruitWin ei muuta', H.getWallet() === 23, H.getWallet());
H.__t.onGameMessage({ data: 'KEY_COLLECTED' });
ok('KEY_COLLECTED ei muuta saldoa', H.getWallet() === 23, H.getWallet());
H.__t.onGameMessage({ data: 'RETURN_TO_STREET' });
ok('RETURN_TO_STREET ei kaada hubia', true);
H.__t.setIframeOpen(false);
H.__t.onGameMessage({ data: 'COIN_COLLECTED' });
ok('viesti ilman avointa peliä ignoroidaan', H.getWallet() === 23, H.getWallet());

const saved = JSON.parse(store.gamehub_state);
ok('tallennettu saldo 23', saved.wallet === 23, saved.wallet);
ok('tallennettu valinta [1]', JSON.stringify(saved.jukeboxSelected) === '[1]', JSON.stringify(saved.jukeboxSelected));

H.__t.getState().wallet = 0;
H.topUp();
ok('topUp 0 → 20 (uudelleen)', H.getWallet() === 20, H.getWallet());

Object.keys(store).forEach((k) => {
    ok('ei aistreen avainta: ' + k, k.indexOf('pimeakatu') !== 0);
});

console.log('\nTulos: ' + pass + ' OK, ' + fail + ' löydöstä');
process.exit(fail ? 1 : 0);
