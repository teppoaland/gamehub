# 🕹️ GAME HUB

GAME HUB on itsenäinen pelihubi (versiosarja **v10.x**, hub-haara).
Viisi itsenäistä peliä samassa CRT-retrovalikossa:

| Peli | Kansio | Kuvaus |
|------|--------|--------|
| ✈️ Blue Mäx | `bm/` | Isometrinen lentopeli |
| ⛏️ Dig Game | `digGame1/` | Yksi suuri kaivumaailma |
| 💎 Dig Däsh | `digGame2/` | Neljä tasoa, timanttitavoitteet |
| 🚢 Battleship | `sinkship/` | Laivanupotus |
| 🍒 Fruit Machine | `fruitgame/` | Hedelmäpeli |

Lisäksi **JUKEBOX / MUSIC SETUP**: vapaa musiikkivalinta ilman kolikoita.
Valittu jono soi myös pelien aikana; `SKIP ▶▶` vaihtaa raitaa ja
`REPEAT [X]` (oletuksena päällä) toistaa jonon.

## Mikä tämä repo on

- `origin` = `teppoaland/gamehub` – tämä hub-haara, versiot `10.x`.
- Tässä ei ole street-osaa: ei katua, kaaosta, nälkää, BAR:ia,
  makuuhuonetta eikä hampurilais- tai talouslukkoa.
- AI CHAOS STREET (`11.x`) on vain pelien ja CRT-teeman **historia**;
  se ei ole ajonaikainen riippuvuus eikä osa tätä sivustoa.
- CSS/DOM:n `chaos-*`-nimet (esim. `#chaos-menu`) ovat historiallisia
  nimiä – eivät merkki katu- tai kaaosominaisuudesta.

## Rakenne

```
index.html          GAME HUB -gate, valikko, ohjeet, jukebox, iframe-overlay
style.css           Hubin oma CRT-teema
hub.css             Hubin omat lisäykset (linkit, top-up, jukebox)
gamehub.js          Valikko, pelien käynnistys, kukkaro, postMessage, jukebox
audio.js            Menu-musiikki (MrClaps, kerran, 1 s viive) + jukebox-jono
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
Hub tulkitsee viestin “palaa pelivalintaan”. Nimi on **historiallinen**:
se on pelien ja hubin välinen rajapinta, eikä se tarkoita, että hubissa
olisi katu tai street-osaa. Nimeä ei muuteta, koska pelit käyttävät sitä.

## Uusien biisien lisääminen

1. Lisää `.mp3` (ja halutessasi kansi `covers/`) tämän repon
   `jukebox/`-kansioon.
2. Lisää rivi `jukebox/tracks.js`:ään. Se on myös offline-fallback.
3. Hub hakee lisäraidat tämän repon `jukebox/`-kansiosta GitHub API:sta
   (1 h välimuisti), joten pelkkä tiedoston lisääminen riittää
   julkaistussa versiossa.

## Kukkaro

- Alku 20 kolikkoa (`gamehub_state`).
- `COIN_COLLECTED` +1, `fruitBet` −1, `fruitWin` +n.
- Fruit Machine alkaa aina vähintään 20 kolikolla; jos saldo on tyhjentynyt,
  pelin avaaminen nollaa sen takaisin 20:een.
- Saldoriviä ei näytetä valikossa. Kun saldo on 0, valikkoon ilmestyy
  **TOP UP +20**.
- Kukkaro on hubin oma kevyt pelikrediitti – ei AI CHAOS STREETin
  talous-, nälkä- eikä hampurilaisjärjestelmä.

## Versio

`v10.03` – näkyy vain päävalikossa. Jokainen koodimuutos nostaa +0.01 ja
päivittää kaikki `?v=`-leimat. GAME HUB käyttää `10.x`-sarjaa;
AI CHAOS STREETin `11.x`-numerot eivät liity tähän repoon.

## Lisenssi

Copyright (c) 2024–2026 Teppo Ålander. Ks. `LICENSE`.
Kolmannen osapuolen musiikki: ks. `jukebox/` (tiedostot ja kannet).
