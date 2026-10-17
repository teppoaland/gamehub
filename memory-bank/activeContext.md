# 🎯 Aktiivinen konteksti – GAME HUB

> **Versio:** `v10.05` (17.10.2026), hub-haara `10.x`.
> **Git:** `origin` = `teppoaland/gamehub`; `upstream` = `teppoaland/aistreet`
> vain git-historiaa varten.
> **Live:** **https://teppoaland.github.io/gamehub/** – GitHub Pages.

## 📍 Nyt

- `D:\AI\gamehub` on itsenäinen pelihubi: viisi peliä + jukebox + valikko.
- Tässä ei ole street-osaa: ei `street.js`, katu-canvas, kaaos, nälkä,
  BAR, makuuhuone eikä hampurilais-/talouslukkoa.
- AI CHAOS STREET (`11.x`) on vain pelien ja CRT-teeman historia; ei
  ajonaikainen riippuvuus. CSS/DOM:n `chaos-*`-nimet ovat historiallisia.
- Alkunäyttö 1 ja pelivalikko 2: tummansininen tausta (pelit ennallaan).
- Valikko: GAME HUB → CHOOSE YOUR GAME. Saldoriviä ei näytetä;
  `INSTRUCTIONS`- ja `JUKEBOX / MUSIC SETUP` -rivien välissä on selkeä
  16 px riviväli.
- Pelijärjestys: BLUE MÄX, DIG GAME, DIG DÄSH, BATTLESHIP,
  FRUIT MACHINE (viimeisenä myös ohjeissa).
- Auto-hover + tärinä, INSTRUCTIONS-kirjoitus.
- Menu-musiikki: MrClaps – This Heavy Metal, kerran ilman autolooppia;
  alkaa 1 s viiveellä gaten klikistä.
- Jukebox: 9 raitaa, vapaa valinta, soi pelien aikana; `SKIP ▶▶` ja
  `REPEAT [X]` (oletuksena päällä, tila tallentuu).
- Kukkaro: 20 kolikkoa + top-up `TOP UP +20` vain 0-tilassa. Fruit
  Machine alkaa aina vähintään 20 kolikolla (0 → 20 avattaessa).
- Jukebox hakee lisäraidat tämän repon `jukebox/`-kansiosta
  (GitHub API, 1 h välimuisti). Kansikuvissa cache-bustaus (`?v=10.05`).
  Kansikuvat 1–3 ja 5 ovat uudet JPEG-tiedostot
  (`knived-*.jpg`, `alec-koff-in-heavy-metal.jpg`). Listan thumbnailit
  ovat `.juke-thumb`-div + `background-image` – pieni `<img>` jäi
  joidenkin selainten downscalessa valkoiseksi. Iso `#juke-cover` on
  edelleen `<img>`.
- Uniikit avaimet: `gamehub_state`, `gamehub_fruit_free`,
  `gamehub_tracks_cache`.
- `RETURN_TO_STREET` on historiallinen viestinimi → “palaa pelivalintaan”.

## ✅ Vahvistettu

- **17.10.2026:** käyttäjä vahvisti v10.05:n toimivan (“Homma ok”).
  Jukebox-listojen kansikuvat 1–3 ja 5 näkyvät nyt oikein;
  `.juke-thumb` + `background-image` ratkaisi valkoiset thumbnailit.

## 🧪 Testit

```
node tools/check-hub.cjs                 # 71 OK / 0
node tools/tests/hub-logic-test.cjs      # 37 OK / 0
node --check gamehub.js
node --check audio.js
```

Manuaalitestit: `docs/testilista.md`.

Selain-smoke (v10.00, Edge headless): 20/0 `file://`-polulla ja 26/0
paikallisella HTTP-palvelimella – kaikki 5 peliä, `RETURN_TO_STREET`,
fruit-sync.

## 🔜 Seuraavaksi

1. Live-sivuston ja puhelimen viimeistely: gate → menu, auto-hover,
   ohjeet, jukebox (covers, skip, repeat), jokainen peli, Fruitin
   20 kolikkoa, ✕-paluu.
2. Mahdolliset viilaukset: menu-musiikin voimakkuus, jukebox-rivien
   fonttikoko, top-up-teksti.
3. Tulevat pelit: lisää `GAMES`-rekisteriin ja oma kansio.

## ⚠️ Huomiot

- Vain `gamehub_*`-avaimet. `pimeakatu_*` kuuluu AI CHAOS STREETiin.
- `RETURN_TO_STREET` nimi säilyy, koska pelit lähettävät sen.
- Jukeboxin GitHub API -haku ei ole pakollinen; fallback on bundlattu
  `jukebox/tracks.js`.
- `gamehub_state` sisältää nyt myös `jukeboxRepeat`-tilan.
- Push on sallittu aina, kun työpuu on siisti eikä mitään ole kesken.
- GAME HUB = `10.x`; AI CHAOS STREET = `11.x` – älä sekoita sarjoja.
- Pelien omat versiotagit (`dev`, `v1.2`, `v0.11`) säilyvät ennallaan.
