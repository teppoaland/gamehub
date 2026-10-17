# 🎮 Pelilogiikan säännöt

## Suojatut pelitiedostot

Jokaisessa pelissä ydintiedostot, joihin ei kosketa ilman suoraa pyyntöä:

- `physics.js` – painovoima, putoaminen, törmäykset
- `constants.js` – TILE-vakiot, nopeudet, pisteet, maailman mitat
- `game.js` – pääsilmukka, tilat, HUD
- `levels.js` – kenttädata ja parseri
- `enemies.js` – vihollisten tekoäly
- `input.js` – näppäimistö ja kosketus

## Suojatut mekaniikat

- painovoima ja putoaminen
- törmäystarkistukset
- vihollisten tekoäly
- pisteytys ja elämät
- kenttien rakenne

## Hubin rajapinta

Pelit ja hubi kommunikoivat `postMessage`-viesteillä:

| Viesti | Merkitys |
|--------|----------|
| `RETURN_TO_STREET` | peli lopetettu → hub näyttää pelivalinnan |
| `COIN_COLLECTED` | +1 kolikko hubin kukkaro |
| `{type:'fruitBet'}` | −1 kolikko |
| `{type:'fruitWin', coins:n}` | +n kolikkoa |
| `{type:'fruitSync', coins:n}` | hub → peli: saldo |

`RETURN_TO_STREET`-nimeä ei muuteta: se on yhteinen rajapinta AI CHAOS
STREETin kanssa. Hub tulkitsee sen “palaa pelivalintaan”.

## Talous

Fruit Machinen RTP, painot, maksut ja ilmainen pyöräytys ovat pelin
testattuja arvoja – ei muuteta ilman erillistä pyyntöä. Hubin kukkaro on
kuvattu säännössä 04.
