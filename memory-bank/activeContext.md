# 🎯 Aktiivinen konteksti – GAME HUB

> **Versio:** `v10.00` (17.10.2026). Fork AI CHAOS STREET v11.72:sta.
> **Git:** `origin` = `teppoaland/gamehub`, `upstream` = `teppoaland/aistreet`.
> **Tila:** ensimmäinen hub-versio valmis ja pushattu (`origin/main`;
> v10.00-koodi `c0aed73`).
> **Live:** **https://teppoaland.github.io/gamehub/** – GitHub Pages
> aktivoitu ja toiminnassa 17.10.2026.

## 📍 Nyt

- `D:\AI\gamehub` sisältää viisi peliä + jukebox + hub-valikon.
- `street.js`, katu-canvas, kaaos, nälkä, BAR ja makuuhuone on poistettu.
- Valikko: GAME HUB → CHOOSE YOUR GAME.
- Auto-hover + tärinä, INSTRUCTIONS-kirjoitus, menu-musiikki (raita 1–3),
  jukebox (9 raitaa, vapaa valinta, soi pelien aikana).
- Kukkaro: 20 kolikkoa + top-up 0-tilassa.
- Uniikit avaimet: `gamehub_state`, `gamehub_fruit_free`.
- Pelimuutokset: street-tekstit hubiksi, fonttilinkit, standalone-paluu
  Fruit Machinessa ja Battleshipissa.

## 🧪 Testit

```
node tools/check-hub.cjs                 # 68 OK / 0
node tools/tests/hub-logic-test.cjs      # 24 OK / 0
node --check gamehub.js
node --check audio.js
```

Manuaalitestit: `docs/testilista.md`.

Selain-smoke (Edge headless): 20/0 `file://`-polulla ja 26/0 paikallisella
HTTP-palvelimella – kaikki 5 peliä, `RETURN_TO_STREET`, fruit-sync.

## 🔜 Seuraavaksi

1. Käyttäjän selaintesti live-sivustolla `https://teppoaland.github.io/gamehub/`
   ja tarvittaessa `file:///D:/AI/gamehub/index.html`: gate → menu,
   auto-hover, ohjeet, jukebox, jokainen peli, ✕-paluu, kukkaro/top-up,
   puhelin.
2. Mahdolliset viilaukset: menu-musiikin voimakkuus, jukebox-rivien
   fonttikoko, top-up-teksti.
3. Tulevat pelit: lisää `GAMES`-rekisteriin ja oma kansio.

## ⚠️ Huomiot

- Älä käytä `pimeakatu_*`-avaimia: sama origin GitHub Pagesilla.
- `RETURN_TO_STREET` on jaettu rajapinta – älä nimeä uudelleen.
- Jukeboxin GitHub API -haku ei ole pakollinen; fallback on bundlattu
  `jukebox/tracks.js`.
- Pelien omat versiotagit (`dev`, `v1.2`, `v0.11`) säilyvät ennallaan.
