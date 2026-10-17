# 📋 Versionhallinta

## Nykyinen versio

`v10.00` – `index.html`:n `#version-tag` ja kaikki `?v=`-leimat.

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
4. **Push = julkaisu** GitHub Pagesiin. Vain kun käyttäjä sanoo
   “push”/“julkaise”. Ei koskaan osana committia.
5. Raportoi lyhyesti: mitä muuttui + versionumero.

## Testit ennen committia

```
node tools/check-hub.cjs
node tools/tests/hub-logic-test.cjs
node --check gamehub.js
node --check audio.js
```
