# 📊 Projektin edistyminen – GAME HUB

## v10.00 – Ensimmäinen GAME HUB (17.10.2026)

**Lähtö:** AI CHAOS STREET v11.72 (`D:\AI\AI_street`), 77 committia.
**Toteutus:** kloonattu historia `D:\AI\gamehub`iin; `origin` = gamehub,
`upstream` = aistreet. Working treeen jäivät vain pelit, jukebox ja LICENSE;
street-osat poistettiin.

### Valmis

- `index.html`: gate, valikko, INSTRUCTIONS, jukebox-overlay, iframe-overlay.
- `style.css`: AI CHAOS STREETin CRT-teema (valikko, gate, ohjeet, iframe).
- `hub.css`: hubin linkit, kukkaro, top-up, jukebox.
- `gamehub.js`: GAMES-rekisteri, iframe-käynnistys, `postMessage`-silta,
  kukkaro, top-up, auto-hover + tärinä, ohjeanimaatio, jukebox, GitHub-haku.
- `audio.js`: menu-musiikki (raita 1–3) + jukebox-jono; ei synthiä.
- `jukebox/tracks.js`: 9 raitaa + kannet; menu-pooli 1–3.
- Pelimuutokset:
  - fonttilinkit `bm`, `digGame1`, `digGame2`, `sinkship`
  - Dig Game: “next game in the GAME HUB”
  - Fruit Machine: “Top up in the GAME HUB”, “BACK TO GAME HUB”,
    `gamehub_fruit_free`, standalone-paluu `../index.html`
  - Battleship: standalone-paluu `../index.html`
  - Blue Mäx: `gamehub_state`-avain
- Dokumentit: README, CHANGELOG, `.clinerules/01–06`, memory-bank,
  `docs/gamehub-memo.md`, `docs/testilista.md`.

### Testit

- `node tools/check-hub.cjs` – **68 OK / 0 löydöstä**
- `node tools/tests/hub-logic-test.cjs` – **24 OK / 0 löydöstä**
- `node --check gamehub.js`, `audio.js`, `tracks.js` – OK
- Selain-smoke (Edge headless): **20/0** `file://`-polulla ja **26/0**
  paikallisella HTTP-palvelimella (kaikki 5 peliä + `RETURN_TO_STREET` +
  `fruitSync`/`fruitBet`/`fruitWin`).

### Päätökset

- Kukkaro 20 + top-up vain 0-tilassa.
- Jukebox vapaa, ei kolikoita; soi pelien aikana.
- Menu-musiikki arvotaan raidoista 1–3 (Alec Koff liian räväkkä).
- Auto-hover ja tärinä säilytetään.
- Uniikit localStorage-avaimet.
- `RETURN_TO_STREET`-protokolla säilyy.

### Seuraavaksi

- Käyttäjän selaintesti + GitHub Pages -aktivointi.
- Mahdolliset ulkoasuvilaukset (puhelin).
- Uusien pelien lisäys `GAMES`-rekisteriin.
