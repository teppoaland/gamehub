# 📜 CHANGELOG – GAME HUB

## v10.00 – 17.10.2026

Ensimmäinen GAME HUB -versio, fork AI CHAOS STREET v11.72:sta.

- Uusi pelihubi `D:\AI\gamehub` / `teppoaland/gamehub`.
- Säilytetty pelit: Blue Mäx, Dig Game, Dig Däsh, Fruit Machine, Battleship.
- Poistettu street-osat (`street.js`, katu-canvas, kaaos, nälkä, BAR, majoitus).
- Uusi valikko: GAME HUB → CHOOSE YOUR GAME, viisi pelinappia.
- INSTRUCTIONS: CRT-ikkuna + kirjoitusanimaatio + lyhyet pelikuvaukset.
- Auto-hover + näytön tärinä viimeisellä napilla (AI CHAOS STREETista).
- Menu-musiikki arvotaan raidoista 1–3.
- JUKEBOX / MUSIC SETUP: 9 raitaa, vapaa monivalinta, ei kolikoita.
  Jono soi myös pelien aikana. Uudet raidat haetaan aistreen `jukebox/`-
  kansiosta GitHub API:lla (1 h välimuisti).
- Kukkaro: 20 kolikkoa, `COIN_COLLECTED` +1, `fruitBet` −1, `fruitWin` +n,
  `TOP UP BALANCE +20` kun saldo on 0.
- Uniikit localStorage-avaimet: `gamehub_state`, `gamehub_fruit_free`.
- Pelimuutokset: street-tekstit hubiksi, fonttilinkit, standalone-paluu
  Fruit Machinessa ja Battleshipissa.
- Testit: `node tools/check-hub.cjs` 68/0, `node tools/tests/hub-logic-test.cjs` 24/0.
