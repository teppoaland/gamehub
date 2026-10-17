# 📊 Projektin edistyminen – GAME HUB

## v10.04 – Kansikuvien varmistus (17.10.2026)

### Muutokset

- Kansikuvat 1–3 ja 5: uudet nimet ja JPEG-muoto
  (`knived-our-song.jpg`, `knived-unafraid.jpg`,
  `knived-unafraid-inst.jpg`, `alec-koff-in-heavy-metal.jpg`).
- Uudet nimet ohittavat vanhan valkoisen selain-/service worker
  -välimuistin; JPEG poistaa PNG-alpha/dekoodausriskin.
- `COVER_CACHE_VERSION = '10.04'`; versio `v10.04`.

### Testit

- `check-hub.cjs` 70/0, `hub-logic-test.cjs` 37/0, `node --check` OK.
- Kaikki 9 kantta löytyvät ja renderöityvät headless-selaimessa.

## v10.03 – Menu- ja käynnistysviilaukset (17.10.2026)

### Muutokset

- Alkunäyttö 1 ja pelivalikko 2: tummansininen tausta; pelit ennallaan.
- FRUIT MACHINE siirretty listan ja ohjeiden viimeiseksi.
- `INSTRUCTIONS` / `JUKEBOX` -riviväli korjattu vahvemmalla selektorilla
  (16 px).
- Alkumusiikki alkaa 1 s viiveellä gaten klikistä.
- Versio `v10.03` ja `COVER_CACHE_VERSION = '10.03'`.

### Testit

- `check-hub.cjs` 70/0, `hub-logic-test.cjs` 37/0, `node --check` OK.
- Selain: sininen gate/menu, linkkiväli ja jukebox-näkymä tarkistettu.

## v10.02 – UI- ja jukebox-parannukset (17.10.2026)

**Tavoite:** selkeyttää valikkoa ja parantaa jukebox/Fruit-käyttöä.

### Muutokset

- Selaimen tabissa yksi joystick: `<title>GAME HUB</title>` (favicon
  säilyy).
- Valikosta poistettu `BALANCE`-saldorivi; `INSTRUCTIONS`- ja
  `JUKEBOX / MUSIC SETUP` -rivien välissä yksi tyhjä riviväli.
- Top-up-teksti `TOP UP +20` (vain 0-tilassa).
- Fruit Machine alkaa aina vähintään 20 kolikolla; 0-saldo nollautuu
  20:een pelin avaamisessa.
- Menu-musiikki: MrClaps – This Heavy Metal (`GAMEHUB_MENU_TRACK_IDS`
  = [6]), kerran ilman autolooppia.
- Jukeboxista poistettu `FREE – PICK AS MANY TRACKS AS YOU LIKE` -rivi.
- Kansikuville cache-bustaus (`?v=10.02`) ja virhefallback.
- Jukebox: `SKIP ▶▶` ja `REPEAT [X]` (oletuksena päällä, tila
  `gamehub_state`-avaimessa).
- Testit: `check-hub.cjs` 70/0, `hub-logic-test.cjs` 37/0,
  `node --check` OK. Selain: menu/jukebox-screenshotit ja Fruitin
  0 → 20 -tarkistus.

### Päätökset

- Fruit alkaa vähintään 20 kolikolla; isompi saldo säilyy.
- Repeat oletuksena päällä; käyttäjän valinta muistetaan.
- Saldoa ei näytetä valikossa.

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
