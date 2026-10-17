# 📜 CHANGELOG – GAME HUB

> GAME HUB käyttää `10.x`-versiosarjaa. AI CHAOS STREET käyttää `11.x`-
> sarjaa; sen numerot eivät ole tämän repon versioita. `11.x`-viittaukset
> alla ovat vain forkin historiaa.

## v10.05 – 17.10.2026

Jukebox-listojen kansikuvien renderöinti.

- Listan pienet kansikuvat vaihdettu `<img>`-elementeistä
  `.juke-thumb`-diviin, jossa kuva on `background-image` + `cover`.
  Tämä väistää pienten `<img>`-kuvien valkoiseksi jäävän
  downscale-/compositing-ongelman.
- Iso “now playing” -kansi (`#juke-cover`) on edelleen `<img>`.
- `COVER_CACHE_VERSION = '10.05'` ja versio `v10.05`.
- Testit: `check-hub.cjs` 71/0, `hub-logic-test.cjs` 37/0, `node --check` OK.

## v10.04 – 17.10.2026

Jukeboxin kansikuvien varmistus.

- Kansikuvat 1–3 (Knived) ja 5 (Alec Koff – In Heavy Metal) tallennettu
  uusilla nimillä JPEG-muotoon: `knived-our-song.jpg`,
  `knived-unafraid.jpg`, `knived-unafraid-inst.jpg`,
  `alec-koff-in-heavy-metal.jpg`.
- Uudet nimet ohittavat selaimen/service workerin vanhan valkoisen
  välimuistin; JPEG poistaa myös PNG-alpha/dekoodausriskin.
- `COVER_CACHE_VERSION = '10.04'` ja versio `v10.04`.
- Testit: `check-hub.cjs` 70/0, `hub-logic-test.cjs` 37/0, `node --check` OK.

## v10.03 – 17.10.2026

Menu- ja käynnistysviilaukset.

- Alkunäyttö 1 (gate) ja pelivalikko 2 saivat tummansinisen taustan.
  Pelit ovat omissa iframeissaan eivätkä muuttuneet.
- FRUIT MACHINE siirretty listan ja ohjeiden viimeiseksi.
- `INSTRUCTIONS`- ja `JUKEBOX / MUSIC SETUP` -rivien väli korjattu
  vahvemmalla selektorilla (16 px).
- Alkumusiikki alkaa 1 s viiveellä gaten klikistä, ettei klikki säräytä
  biisin alkua.
- Versio `v10.03` ja kansikuvien cache-versio `10.03`.
- Testit: `check-hub.cjs` 70/0, `hub-logic-test.cjs` 37/0, `node --check` OK.

## v10.02 – 17.10.2026

UI- ja jukebox-parannukset.

- Selaimen tabista poistettu toinen joystick: `#version-tag`-sivun title on
  nyt `GAME HUB` (favicon säilyy).
- Valikosta poistettu `BALANCE`-saldorivi; `INSTRUCTIONS`- ja
  `JUKEBOX / MUSIC SETUP` -rivien välissä on yksi tyhjä riviväli.
- Fruit Machine alkaa aina vähintään 20 kolikolla; tyhjentynyt saldo
  nollautuu 20:een pelin avaamisessa.
- Menu-musiikki: MrClaps – This Heavy Metal, soitetaan kerran ilman
  autolooppia (`GAMEHUB_MENU_TRACK_IDS = [6]`).
- Jukeboxista poistettu `FREE – PICK AS MANY TRACKS AS YOU LIKE` -rivi.
- Kansikuville cache-bustaus (`?v=10.02`) ja virhefallback; korjaa
  valkoisina näkyvät listakuvat 1–3 ja 5.
- Jukebox: uusi `SKIP ▶▶` ja `REPEAT [X]` (oletuksena päällä, tila
  tallentuu `gamehub_state`-avaimeen).
- Testit: `check-hub.cjs` 70/0, `hub-logic-test.cjs` 37/0, `node --check` OK.

## v10.01 – 17.10.2026

Hub-only-rajaus: kaikki viittaukset koskevat nyt tätä `10.x`-hub-haaraa.

- Dokumentit, `.clinerules` ja memory-bank rajattu hub-haaraan:
  AI CHAOS STREET = historia, ei ajonaikainen riippuvuus.
- `pimeakatu_*` merkitty AI CHAOS STREETin avaimiksi; hub käyttää vain
  `gamehub_*`-avaimia. Ei street-osaa, kaaosta, nälkää, BAR:ia,
  makuuhuonetta eikä hampurilais-/talouslukkoa.
- Jukeboxin GitHub-haku osoittaa tämän repon `jukebox/`-kansioon.
- Poistettu kuollut burger- ja BAD CHAOS -CSS sekä vanhentuneet
  `street.js`-viittaukset (`style.css`, `hub.css`, `index.html`, `audio.js`).
- `RETURN_TO_STREET` dokumentoitu historialliseksi viestinimeksi
  (“palaa pelivalintaan”).
- `check-hub.cjs`: yleinen invariantti “localStorage-avaimet vain
  `gamehub_*`”.
- Versio `v10.01` `#version-tagissa` ja kaikissa `?v=`-leimoissa.
- Testit: `check-hub.cjs` 67/0, `hub-logic-test.cjs` 24/0, `node --check` OK.

## v10.00 – 17.10.2026

Ensimmäinen GAME HUB -versio. Historiallinen lähtö: AI CHAOS STREET
v11.72 (ei tämän repon versio).

- Uusi pelihubi `D:\AI\gamehub` / `teppoaland/gamehub`.
- Säilytetty pelit: Blue Mäx, Dig Game, Dig Däsh, Fruit Machine, Battleship.
- Poistettu street-osat (`street.js`, katu-canvas, kaaos, nälkä, BAR,
  majoitus). Tähän repoon ei jäänyt street-osaa.
- Uusi valikko: GAME HUB → CHOOSE YOUR GAME, viisi pelinappia.
- INSTRUCTIONS: CRT-ikkuna + kirjoitusanimaatio + lyhyet pelikuvaukset.
- Auto-hover + näytön tärinä viimeisellä napilla (historiallinen lähtö).
- Menu-musiikki arvotaan raidoista 1–3.
- JUKEBOX / MUSIC SETUP: 9 raitaa, vapaa monivalinta, ei kolikoita.
  Jono soi myös pelien aikana. Uudet raidat haettiin tuolloin aistreen
  `jukebox/`-kansiosta GitHub API:lla (1 h välimuisti); v10.01:ssä haku
  kohdistuu tämän repon `jukebox/`-kansioon.
- Kukkaro: 20 kolikkoa, `COIN_COLLECTED` +1, `fruitBet` −1, `fruitWin` +n,
  `TOP UP BALANCE +20` kun saldo on 0.
- Uniikit localStorage-avaimet: `gamehub_state`, `gamehub_fruit_free`.
- Pelimuutokset: street-tekstit hubiksi, fonttilinkit, standalone-paluu
  Fruit Machinessa ja Battleshipissa.
- Testit: `node tools/check-hub.cjs` 68/0, `node tools/tests/hub-logic-test.cjs` 24/0.
- GitHub Pages aktivoitu 17.10.2026: `https://teppoaland.github.io/gamehub/`.
