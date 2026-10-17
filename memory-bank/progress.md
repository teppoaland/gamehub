# 📊 Projektin edistyminen – GAME HUB

## v10.01 – Hub-only-rajaus (17.10.2026)

**Tavoite:** poistaa forkin jäänteet, jotka viittasivat AI CHAOS STREETiin,
`pimeakatu_*`-avaimiin, katuun, kaaokseen, nälkään, hampurilaisiin tai
talouslukkoon. Perussäännöt (arkkitehtuuri, versiointi, kevyt polku,
ei dialogeja) säilyivät.

### Muutokset

- Dokumentit ja `.clinerules` rajattu hub-haaraan: GAME HUB = `10.x`,
  AI CHAOS STREET = `11.x` (vain historia).
- `pimeakatu_*` merkitty AI CHAOS STREETin avaimiksi; hub käyttää vain
  `gamehub_*`-avaimia. Hampurilais- ja talouslukkoa ei ole.
- Jukeboxin GitHub-haku osoittaa nyt tämän repon `jukebox/`-kansioon.
- Poistettu kuollut burger- ja BAD CHAOS -CSS sekä vanhentuneet
  `street.js`-viittaukset (`style.css`, `hub.css`, `index.html`, `audio.js`).
- `RETURN_TO_STREET` dokumentoitu historialliseksi viestinimeksi, joka
  tarkoittaa “palaa pelivalintaan”.
- `check-hub.cjs`: yleinen invariantti “localStorage-avaimet vain
  `gamehub_*`” (ei enää avainkohtaisia pimeakatu-tarkistuksia).
- Versio `v10.01` `#version-tagissa` ja kaikissa `?v=`-leimoissa.

### Testit

- `node tools/check-hub.cjs` – **67 OK / 0 löydöstä**
- `node tools/tests/hub-logic-test.cjs` – **24 OK / 0 löydöstä**
- `node --check gamehub.js`, `audio.js`, `tracks.js`, testiskriptit – OK

## v10.00 – Ensimmäinen GAME HUB (17.10.2026)

> **Historia:** alla kuvataan v10.00:n lähtötilanne. AI CHAOS STREET
> -viittaukset ovat historiallisia; v10.01 siivosi ne hub-only-muotoon.

**Lähtö:** AI CHAOS STREET v11.72 (`D:\AI\AI_street`), 77 committia.
v11.72 on AI CHAOS STREETin versio, ei GAME HUBin.
**Toteutus:** kloonattu historia `D:\AI\gamehub`iin; `origin` = gamehub,
`upstream` = aistreet. Working treeen jäivät vain pelit, jukebox ja LICENSE;
street-osat poistettiin.

### Valmis

- `index.html`: gate, valikko, INSTRUCTIONS, jukebox-overlay, iframe-overlay.
- `style.css`: CRT-teema (valikko, gate, ohjeet, iframe).
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
- **GitHub Pages aktivoitu 17.10.2026:** `https://teppoaland.github.io/gamehub/`
  (HTTP 200: index, hub.css, gamehub.js, tracks.js, pelit ja mp3).

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
