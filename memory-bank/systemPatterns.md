# 🧩 Järjestelmän arkkitehtuuri – GAME HUB

> **Tarkoitus:** Cline:n referenssi GAME HUBin (v10.x, hub-haara)
> rakenteesta ja siitä, mitä ei saa rikkoa.
> **Rajaus:** tässä repossa ei ole street-osaa (katu, kaaos, nälkä, BAR,
> makuuhuone) eikä hampurilais-/talouslukkoa. AI CHAOS STREET (`11.x`)
> on vain pelien ja CRT-teeman historia, ei ajonaikainen riippuvuus.

## ⭐ Yleisarkkitehtuuri

- **Hub (juuri):** `index.html`, `style.css`, `hub.css`, `gamehub.js`, `audio.js`.
  Ei `js/`-kansiota. `style.css` on hubin oma CRT-teema (ei synkronoida
  upstreamista); `hub.css` sisältää vain hubin omat lisäykset. `chaos-*`-
  luokat ovat historiallisia nimiä, eivät katu-/kaaosominaisuus.
- **Pelit:** `bm/`, `digGame1/`, `digGame2/`, `fruitgame/`, `sinkship/`.
  Jokainen on itsenäinen `game_main.html`-kokonaisuus, joka ladataan
  hubin `#game-iframe-overlay`-iframeen.
- **Jukebox:** `jukebox/tracks.js` (manifesti) + `jukebox/*.mp3` + `covers/`.
  `audio.js` soittaa menu-musiikin ja jukebox-jonon. GitHub-haku kohdistuu
  tämän repon `jukebox/`-kansioon (1 h välimuisti); fallback on manifesti.
  Kansikuvissa on cache-bustaus (`?v=` + `COVER_CACHE_VERSION`) ja
  virhefallback, ettei vanha/valkoinen kuva jää näkyviin.
- **Julkaisu:** GitHub Pages **LIVE** 17.10.2026 –
  `https://teppoaland.github.io/gamehub/` (`main` / root).
- **Paluu:** peli lähettää `postMessage('RETURN_TO_STREET')` → hub sulkee
  iframen ja näyttää pelivalinnan. Nimi on historiallinen, ei viittaus
  katuun; sitä ei muuteta, koska pelit lähettävät sen.
- **Git:** `origin` = `teppoaland/gamehub` (totuus). `upstream` =
  `teppoaland/aistreet` vain git-historiaa varten.
- **Versiot:** GAME HUB = `10.x`, AI CHAOS STREET = `11.x`. Älä sekoita.

## 🎮 Valikon rakenne

1. `#start-gate`: `GAME HUB` + `CLICK / PRESS ANY KEY TO BEGIN`.
2. `#chaos-menu` (historiallinen CSS-nimi): `GAME HUB` / `CHOOSE YOUR GAME`,
   viisi `data-game`-nappia:
   `bm`, `digGame1`, `digGame2`, `sinkship`, `fruitgame` (Fruit viimeisenä).
   Tausta tummansininen (`#081a30` + sininen hehku), kuten gatessa.
3. `INSTRUCTIONS` → `#instructions-overlay` (CRT + kirjoitusanimaatio).
4. `JUKEBOX / MUSIC SETUP` → `#jukebox-overlay`.
5. `#topup-btn` (`TOP UP +20`) vain kun saldo on 0. Erillistä
   `#hub-wallet`-saldoriviä ei ole.
6. `#version-tag` vain valikon sisällä (v10.03).

### Auto-hover

- Kierros 10 s välein, alkaa 5 s gaten napautuksesta.
- Askel 173 ms; viimeinen nappi (BATTLESHIP) jää päälle 2 s ja
  `#chaos-menu.shaking` tärisee (CSS `chaos-shake`).
- Oikea hiiri/täppäys voittaa aina. `?autohover=0` pois.
- Ei reduce-motion-porttia (linjaus pidetty ennallaan).

## 🔊 Äänet

- **Menu-musiikki:** MrClaps – This Heavy Metal (`GAMEHUB_MENU_TRACK_IDS`
  = [6]), soitetaan kerran ilman autolooppia, `MENU_VOLUME 0.05`.
  Alkaa 1 s viiveellä gaten klikistä (`MENU_MUSIC_DELAY_MS`).
- **Jukebox:** vapaasti valitut raidat, `JUKEBOX_VOLUME 0.10`, soi myös
  pelien aikana. Ei kolikoita. `SKIP ▶▶` vaihtaa raitaa; `REPEAT [X]`
  (oletus päällä) toistaa jonon, `[ ]` pysäyttää loppuun.
- **Ei taustasynthiä** eikä introa.
- Pienet CRT-klikit ohjeikkunalle (`playPanelOn/Off/TypeClick`).

## 💾 Tallennus

- `gamehub_state` – `{ wallet, jukeboxSelected, jukeboxRepeat }`.
- `gamehub_fruit_free` – Fruit Machinen ilmaisen pyöräytyksen aikaleima.
- `gamehub_tracks_cache` – GitHub API -haun 1 h välimuisti.
- Vain `gamehub_*`-avaimet. `pimeakatu_*` kuuluu AI CHAOS STREETiin,
  ei tähän repoon.

## 💰 Kukkaro

- Kevyt pelikrediitti – ei AI CHAOS STREETin talous-, nälkä- eikä
  hampurilaisjärjestelmä.
- Alku 20; `COIN_COLLECTED` +1; `fruitBet` −1; `fruitWin` +n.
- Fruit Machine alkaa aina vähintään 20 kolikolla; avaaminen nollaa
  tyhjentyneen saldon 20:een.
- Top-up +20 vain kun saldo on 0; tallennus `gamehub_state`.
- Saldoa ei näytetä valikossa; 0-tilassa näkyy `TOP UP +20`.
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
