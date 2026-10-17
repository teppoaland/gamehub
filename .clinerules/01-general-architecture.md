# 🏗️ GAME HUB – arkkitehtuuri

## Projektin luonne

GAME HUB on **itsenäinen pelihubi** (versiosarja `10.x`, hub-haara).
Repo sisältää vain hubin ja viisi peliä. Tässä ei ole katua, kaaosta,
nälkää, BAR:ia, makuuhuonetta eikä hampurilais- tai talouslukkoa.

AI CHAOS STREET (`11.x`) on ainoastaan pelien ja CRT-teeman
**historiallinen lähtö**. Se ei ole ajonaikainen riippuvuus: hubi ei
lataa eikä kutsu sen tiedostoja. `upstream`-remote säilyy vain
git-historiaa varten.

Jokainen peli on oma kokonaisuutensa omassa kansiossaan.

## Suojatut hub-tiedostot

> ⚠️ Älä muuta ilman erillistä pyyntöä.

- `index.html` – valikon, gaten, ohjeiden, jukeboxin ja iframe-overlayn rakenne
- `style.css` – hubin oma CRT-teema (ei synkronoida upstreamista)
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
5. `origin` = `teppoaland/gamehub` on totuus. `upstream` = `teppoaland/aistreet`
   on vain git-historiaa – älä hae sieltä koodia äläkä kuvaa sitä
   dokumenteissa hubin nykytilana.
6. Versiot: GAME HUB = `10.x`, AI CHAOS STREET = `11.x`. Älä merkitse
   hubin versioksi `11.x`:ää äläkä päinvastoin.
7. CSS/DOM käyttää historiallisia `chaos-*`-nimiä (esim. `#chaos-menu`).
   Ne ovat vain nimiä, eivät viittaus AI CHAOS STREETiin eikä merkki
   katu-/kaaosominaisuudesta.
