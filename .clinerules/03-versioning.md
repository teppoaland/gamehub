# 📋 Versionhallinta

## Versiosarjat – älä sekoita

- **GAME HUB = `10.x`** (tämä repo, hub-haara). `#version-tag` ja kaikki
  `?v=`-leimat käyttävät tätä sarjaa.
- **AI CHAOS STREET = `11.x`** (upstream, vain pelien ja teeman historia).
  Sen versionumerot eivät ole tämän repon versioita.
- `pimeakatu_*`-avaimet ja AI CHAOS STREETin talous/nälkä eivät kuulu
  hubiin. Hub käyttää vain `gamehub_*`-avaimia.

## Nykyinen versio

`v10.02` – `index.html`:n `#version-tag` ja kaikki `?v=`-leimat.

## Milloin +0.01

Nosta versiota **aina kun ajettava koodi muuttuu**:

- `index.html`, `style.css`, `hub.css`, `gamehub.js`, `audio.js`
- `jukebox/tracks.js` (uusi raita = koodimuutos)
- pelien JS/HTML/CSS
- rakenteellinen refaktorointi, vaikka toiminta pysyisi samana

## Milloin ei

- vain dokumentti, README, CHANGELOG tai muistipankki
- pelkkä tekstin/parametrin säätö ilman koodimuutosta
- buildatut tiedostot

## Työnkulku

1. Tee muutokset ja jätä ne työpuuhun.
2. Jos koodi muuttui: `#version-tag` + kaikki `?v=`-leimat samaan numeroon.
3. **Commit = paikallinen tallennus**, sallittu aina:
   `git add -A && git commit -m "vNN.NN: …"`.
4. **Push = julkaisu** GitHub Pagesiin. Sallittu aina, kun työpuu on
   siisti eikä mitään ole kesken. Älä pushaa keskeneräistä työtä.
   Push tehdään omana vaiheenaan, ei osana committia.
5. Raportoi lyhyesti: mitä muuttui + versionumero.

## Testit ennen committia

```
node tools/check-hub.cjs
node tools/tests/hub-logic-test.cjs
node --check gamehub.js
node --check audio.js
```
