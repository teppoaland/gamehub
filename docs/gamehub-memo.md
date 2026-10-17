# 🕹️ GAME HUB – memo

## Tarkoitus

GAME HUB on AI CHAOS STREETin pelien oma pelihubi. Se ei sisällä katua,
kaaosta, nälkää eikä talouslukkoa – vain pelivalikon, pelit ja jukeboxin.

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
hub tekee saman.

## Kukkaro

- Alku 20 kolikkoa.
- `COIN_COLLECTED` +1 (Dig Game, Dig Däsh, Battleship).
- `fruitBet` −1, `fruitWin` +n.
- Kun saldo on 0, valikkoon tulee `TOP UP BALANCE +20`.
- Tallennus `gamehub_state`; Fruit Machinen ilmaisen pyöräytyksen avain
  on `gamehub_fruit_free`.

## Jukebox

- 9 valmista raitaa (`jukebox/tracks.js`).
- Vapaa monivalinta, ei kolikoita.
- Menu-musiikki arvotaan raidoista 1–3.
- Jono soi myös pelien aikana.
- Uudet raidat: lisää tiedosto AI CHAOS STREETin `jukebox/`-kansioon.
  Hub hakee ne GitHub API:lla (1 h välimuisti). Offline-fallback on
  bundlattu manifesti.

## PostMessage-protokolla

| Suunta | Viesti | Merkitys |
|--------|--------|----------|
| peli → hub | `RETURN_TO_STREET` | sulje peli, palaa valikkoon |
| peli → hub | `COIN_COLLECTED` | +1 kolikko |
| peli → hub | `{type:'fruitBet'}` | −1 kolikko |
| peli → hub | `{type:'fruitWin', coins:n}` | +n kolikkoa |
| hub → peli | `{type:'fruitSync', coins:n}` | saldo |

## Git

- `origin` = `https://github.com/teppoaland/gamehub.git`
- `upstream` = `https://github.com/teppoaland/aistreet.git`
- **Live:** `https://teppoaland.github.io/gamehub/` (Pages aktivoitu 17.10.2026)
- Versio `v10.00`; jokainen koodimuutos +0.01.
- Push vain erikseen pyydettäessä (julkaisu GitHub Pagesiin).

## Testit

```
node tools/check-hub.cjs
node tools/tests/hub-logic-test.cjs
```

Manuaaliset: `docs/testilista.md`.
