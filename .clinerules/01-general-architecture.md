# 🏗️ GAME HUB – arkkitehtuuri

## Projektin luonne

GAME HUB on itsenäinen pelihubi, joka kokoaa AI CHAOS STREETin pelit.
Jokainen peli on oma kokonaisuutensa omassa kansiossaan.

## Suojatut hub-tiedostot

> ⚠️ Älä muuta ilman erillistä pyyntöä.

- `index.html` – valikon, gaten, ohjeiden, jukeboxin ja iframe-overlayn rakenne
- `style.css` – CRT-teema (kopio AI CHAOS STREETista)
- `hub.css` – hubin omat tyylit
- `gamehub.js` – valikko, pelien käynnistys, kukkaro, postMessage, jukebox
- `audio.js` – menu-musiikki + jukebox-jono
- `jukebox/tracks.js` – raitalista

## Pelit

| Kansio | Peli |
|--------|------|
| `bm/` | Blue Mäx |
| `digGame1/` | Dig Game |
| `digGame2/` | Dig Däsh |
| `fruitgame/` | Fruit Machine |
| `sinkship/` | Battleship |

Pelit ovat itsenäisiä: älä sekoita niiden koodia toisiinsa. Jokainen käyttää
vain oman kansionsa tiedostoja.

## Rakennemalli

```
gamehub/
├── index.html · style.css · hub.css · gamehub.js · audio.js
├── jukebox/ (tracks.js + mp3 + covers)
├── bm/ digGame1/ digGame2/ fruitgame/ sinkship/
├── docs/ memory-bank/ tools/ .clinerules/
└── README.md · CHANGELOG.md · LICENSE
```

## Käytännöt

1. Kunnioita olemassa olevaa koodia – älä refaktoroi ilman pyyntöä.
2. Pidä muutokset kohdistettuina.
3. Ei npm-riippuvuuksia: vanilla JS/CSS/HTML.
4. Pelien kehitysversio on `game_main.html` (ei buildattua HTML:ää).
5. `upstream` = AI CHAOS STREET (pelien historia), `origin` = gamehub.
