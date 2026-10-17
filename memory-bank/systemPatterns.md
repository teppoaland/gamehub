# 🧩 Järjestelmän arkkitehtuuri – GAME HUB

> **Tarkoitus:** Cline:n referenssi GAME HUBin rakenteesta ja siitä,
> mitä ei saa rikkoa. Fork AI CHAOS STREET v11.72:sta 17.10.2026.

## ⭐ Yleisarkkitehtuuri

- **Hub (juuri):** `index.html`, `style.css`, `hub.css`, `gamehub.js`, `audio.js`.
  Ei `js/`-kansiota. `style.css` on kopio AI CHAOS STREETin CRT-teemasta;
  `hub.css` sisältää vain hubin omat lisäykset.
- **Pelit:** `bm/`, `digGame1/`, `digGame2/`, `fruitgame/`, `sinkship/`.
  Jokainen on itsenäinen `game_main.html`-kokonaisuus, joka ladataan
  hubin `#game-iframe-overlay`-iframeen.
- **Jukebox:** `jukebox/tracks.js` (manifesti) + `jukebox/*.mp3` + `covers/`.
  `audio.js` soittaa menu-musiikin ja jukebox-jonon.
- **Paluu:** peli lähettää `postMessage('RETURN_TO_STREET')` → hub sulkee
  iframen ja näyttää pelivalinnan. Sama viesti toimii AI CHAOS STREETissa.
- **Git:** `origin` = `teppoaland/gamehub`, `upstream` = AI CHAOS STREET.

## 🎮 Valikon rakenne

1. `#start-gate`: `GAME HUB` + `CLICK / PRESS ANY KEY TO BEGIN`.
2. `#chaos-menu` (nimi peritty CSS:stä): `GAME HUB` / `CHOOSE YOUR GAME`,
   viisi `data-game`-nappia:
   `bm`, `digGame1`, `digGame2`, `fruitgame`, `sinkship`.
3. `INSTRUCTIONS` → `#instructions-overlay` (CRT + kirjoitusanimaatio).
4. `JUKEBOX / MUSIC SETUP` → `#jukebox-overlay`.
5. `#hub-wallet` + `#topup-btn`.
6. `#version-tag` vain valikon sisällä (v10.00).

### Auto-hover

- Kierros 10 s välein, alkaa 5 s gaten napautuksesta.
- Askel 173 ms; viimeinen nappi (BATTLESHIP) jää päälle 2 s ja
  `#chaos-menu.shaking` tärisee (CSS `chaos-shake`).
- Oikea hiiri/täppäys voittaa aina. `?autohover=0` pois.
- Ei reduce-motion-porttia – sama linjaus kuin AI CHAOS STREETissa.

## 🔊 Äänet

- **Menu-musiikki:** satunnainen raita `GAMEHUB_MENU_TRACK_IDS` = [1,2,3],
  loopissa, `MENU_VOLUME 0.05`.
- **Jukebox:** vapaasti valitut raidat, `JUKEBOX_VOLUME 0.10`, soi myös
  pelien aikana. Ei kolikoita.
- **Ei taustasynthiä** eikä kaaos-introa.
- Pienet CRT-klikit ohjeikkunalle (`playPanelOn/Off/TypeClick`).

## 💾 Tallennus

- `gamehub_state` – `{ wallet, jukeboxSelected }`.
- `gamehub_fruit_free` – Fruit Machinen ilmaisen pyöräytyksen aikaleima.
- `gamehub_tracks_cache` – GitHub API -haun 1 h välimuisti.
- **Ei** `pimeakatu_*`-avaimia. Hub ei saa sotkea AI CHAOS STREETin tilaa.

## 💰 Kukkaro

- Alku 20; `COIN_COLLECTED` +1; `fruitBet` −1; `fruitWin` +n.
- Top-up +20 vain kun saldo on 0; tallennus `gamehub_state`.
- `fruitSync` lähetetään fruitgameen iframen latautuessa ja aina
  saldon muuttuessa.

## 🚫 Mitä ei saa rikkoa

| Alue | Suojaustaso |
|------|-------------|
| Hubin valikko/gate/iframe-logiikka | 🔴 KRIITTINEN |
| `postMessage`-protokolla (`RETURN_TO_STREET`, `fruit*`) | 🔴 KRIITTINEN |
| localStorage-avaimet (`gamehub_*`) | 🔴 KRIITTINEN |
| Pelien fysiikka / AI / kenttäformaatit | 🟠 KORKEA |
| Fruit Machinen RTP/painot/maksut | 🟠 KORKEA |
| Ulkoasu, tekstit, äänet | 🟡 NORMAALI |

## 🏷️ Nimeämiskäytännöt

- Tiedostot camelCase (JS), kebab-case (HTML/CSS).
- Vakiot UPPER_SNAKE_CASE, funktiot camelCase, luokat PascalCase.
- Kommentit ja dokumentit suomeksi; pelaajalle näkyvät tekstit englanniksi.
