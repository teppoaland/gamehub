# 🕹️ GAME HUB – memo (v10.x, hub-haara)

## Tarkoitus

GAME HUB on **itsenäinen pelihubi**: pelivalikko, viisi peliä ja jukebox.
Tässä repossa ei ole katua, kaaosta, nälkää, BAR:ia, makuuhuonetta eikä
hampurilais- tai talouslukkoa.

AI CHAOS STREET (`11.x`) on vain pelien ja CRT-teeman **historiaa**. Se ei
ole ajonaikainen riippuvuus eikä osa tätä sivustoa. CSS/DOM:n `chaos-*`-
nimet ovat historiallisia nimiä, eivät katu-/kaaosominaisuus.

## Pelit

| Nappi | Kansio | Peli |
|-------|--------|------|
| BLUE MÄX | `bm/` | isometrinen lentopeli |
| DIG GAME | `digGame1/` | yksi suuri kaivumaailma |
| DIG DÄSH | `digGame2/` | 4 tasoa |
| FRUIT MACHINE | `fruitgame/` | hedelmäpeli |
| BATTLESHIP | `sinkship/` | laivanupotus |

Pelit avataan `game_main.html`-iframessa. ✕ sulkee pelin ja palaa
valintalistaan. Peli voi myös itse lähettää `RETURN_TO_STREET`, jolloin
hub tekee saman. Viestinimi on historiallinen: se tarkoittaa “palaa
pelivalintaan”, ei katua.

## Kukkaro

- Alku 20 kolikkoa.
- `COIN_COLLECTED` +1 (Dig Game, Dig Däsh, Battleship).
- `fruitBet` −1, `fruitWin` +n.
- Kun saldo on 0, valikkoon tulee `TOP UP BALANCE +20`.
- Tallennus `gamehub_state`; Fruit Machinen ilmaisen pyöräytyksen avain
  on `gamehub_fruit_free`.
- Kukkaro on hubin oma kevyt pelikrediitti – ei AI CHAOS STREETin
  talous-, nälkä- eikä hampurilaisjärjestelmä.

## Jukebox

- 9 valmista raitaa (`jukebox/tracks.js`).
- Vapaa monivalinta, ei kolikoita.
- Menu-musiikki arvotaan raidoista 1–3.
- Jono soi myös pelien aikana.
- Uudet raidat: lisää tiedosto **tämän repon** `jukebox/`-kansioon ja
  rivi `tracks.js`:ään. Hub hakee lisäraidat saman repon `jukebox/`-
  kansiosta GitHub API:lla (1 h välimuisti). Offline-fallback on
  bundlattu manifesti.

## PostMessage-protokolla

| Suunta | Viesti | Merkitys |
|--------|--------|----------|
| peli → hub | `RETURN_TO_STREET` | sulje peli, palaa valikkoon (historiallinen nimi) |
| peli → hub | `COIN_COLLECTED` | +1 kolikko |
| peli → hub | `{type:'fruitBet'}` | −1 kolikko |
| peli → hub | `{type:'fruitWin', coins:n}` | +n kolikkoa |
| hub → peli | `{type:'fruitSync', coins:n}` | saldo |

## Git

- `origin` = `https://github.com/teppoaland/gamehub.git` – tämä hub-haara.
- `upstream` = `https://github.com/teppoaland/aistreet.git` – vain
  git-historiaa varten, ei ajonaikainen riippuvuus.
- **Live:** `https://teppoaland.github.io/gamehub/` (Pages aktivoitu 17.10.2026)
- Versiosarja: GAME HUB `10.x` (nyt `v10.01`), AI CHAOS STREET `11.x`.
  Älä sekoita sarjoja.
- Push vain erikseen pyydettäessä (julkaisu GitHub Pagesiin).

## Testit

```
node tools/check-hub.cjs
node tools/tests/hub-logic-test.cjs
```

Manuaaliset: `docs/testilista.md`.
