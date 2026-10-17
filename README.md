# 🕹️ GAME HUB

AI CHAOS STREETin pelit omana pelihubinaan. Viisi itsenäistä peliä samassa
CRT-retrovalikossa:

| Peli | Kansio | Kuvaus |
|------|--------|--------|
| ✈️ Blue Mäx | `bm/` | Isometrinen lentopeli |
| ⛏️ Dig Game | `digGame1/` | Yksi suuri kaivumaailma |
| 💎 Dig Däsh | `digGame2/` | Neljä tasoa, timanttitavoitteet |
| 🍒 Fruit Machine | `fruitgame/` | Hedelmäpeli |
| 🚢 Battleship | `sinkship/` | Laivanupotus |

Lisäksi **JUKEBOX / MUSIC SETUP**: vapaa musiikkivalinta ilman kolikoita.
Valittu jono soi myös pelien aikana.

## Rakenne

```
index.html          GAME HUB -gate, valikko, ohjeet, jukebox, iframe-overlay
style.css           CRT-teema (AI CHAOS STREETista)
hub.css             Hubin omat lisäykset (linkit, kukkaro, jukebox)
gamehub.js          Valikko, pelien käynnistys, kukkaro, postMessage, jukebox
audio.js            Menu-musiikki (raita 1–3) + jukebox-jono
jukebox/            tracks.js + mp3 + covers
bm/ digGame1/ digGame2/ fruitgame/ sinkship/
tools/              check-hub.cjs + tests/hub-logic-test.cjs
docs/               memo + manuaalinen testilista
memory-bank/        Istuntojen välinen muisti
.clinerules/        Projektin säännöt
```

## Ajaminen

- **Local:** avaa `index.html` selaimessa (`file:///D:/AI/gamehub/index.html`).
  Iframe-pelit toimivat yleensä myös suoraan, mutta paikallinen serveri on
  vakain: `python -m http.server` tai `start_server.bat` (jos lisäät).
- **GitHub Pages:** **LIVE** – `https://teppoaland.github.io/gamehub/`
  (aktivoitu 17.10.2026, `main` / root).

## Pelien paluu

Pelit lähettävät `postMessage('RETURN_TO_STREET')`, kun ne lopetetaan.
Hub tulkitsee viestin “palaa pelivalintaan”. Sama viesti toimii myös
AI CHAOS STREETissa, joten pelien välistä rajapintaa ei ole rikottu.

## Uusien biisien lisääminen

1. Lisää `.mp3` (ja halutessasi kansi `covers/`) **AI CHAOS STREETin**
   `jukebox/`-kansioon.
2. Hub hakee uudet raidat automaattisesti GitHub API:sta (1 h välimuisti).
3. Jos haluat biisit myös offline-käyttöön, kopioi ne tähän repoon
   `jukebox/`-kansioon ja lisää rivi `jukebox/tracks.js`:ään.

## Kukkaro

- Alku 20 kolikkoa (`gamehub_state`).
- `COIN_COLLECTED` +1, `fruitBet` −1, `fruitWin` +n.
- Kun saldo on 0, valikkoon ilmestyy **TOP UP BALANCE +20**.

## Versio

`v10.00` – näkyy vain päävalikossa. Jokainen koodimuutos nostaa +0.01 ja
päivittää kaikki `?v=`-leimat.

## Lisenssi

Copyright (c) 2024–2026 Teppo Ålander. Ks. `LICENSE`.
Kolmannen osapuolen musiikki: ks. `jukebox/` ja AI CHAOS STREET -repon
`docs/jukebox-memo.md`.
