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

`RETURN_TO_STREET` on **historiallinen viestinimi**. Pelit lähettävät sen
yhä, ja hubi tulkitsee sen “palaa pelivalintaan”. Nimeä ei muuteta, koska
se on pelien ja hubin välinen rajapinta. Nimi ei tarkoita, että hubissa
olisi katu – tässä repossa ei ole street-osaa.

## Peliarvot ja kukkaro

Fruit Machinen RTP, painot, maksut ja ilmainen pyöräytys ovat pelin
testattuja arvoja – ei muuteta ilman erillistä pyyntöä. Hubin kukkaro on
kevyt pelikrediitti (sääntö 04), ei AI CHAOS STREETin talous- tai
nälkäjärjestelmä. Hubissa ei ole hampurilais- eikä talouslukkoa.
