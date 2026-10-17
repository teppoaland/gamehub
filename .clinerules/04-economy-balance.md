# 💰 Kukkaro ja jukebox

## Hubin kukkaro

| Asia | Arvo |
|------|------|
| Alkusaldo | **20** kolikkoa |
| `COIN_COLLECTED` | **+1** |
| `fruitBet` | **−1** |
| `fruitWin` | **+n** (ei negatiivisia) |
| Top-up | **+20**, vain kun saldo on **0** |
| Tallennus | `gamehub_state` |

Top-up on tarkoituksella rajattu: sitä ei voi käyttää täyden saldon
kasvattamiseen. Kun saldo on 0, valikkoon ilmestyy
`TOP UP BALANCE +20`.

## Jukebox

- **Ei kolikoita, ei rajaa** valittujen kappaleiden määrälle.
- Raidat tulevat `jukebox/tracks.js`-manifestista ja/tai aistreen
  `jukebox/`-kansiosta (GitHub API, 1 h välimuisti).
- Jono soi myös pelien aikana.
- Menu-musiikki arvotaan raidoista 1–3 ja soi vain valikossa.

## Fruit Machine

Pelin RTP, symbolipainot, maksut ja ilmainen pyöräytys (1 / 120 s) ovat
pelin omia testattuja arvoja. Älä muuta niitä ilman erillistä pyyntöä.

## Avaimet

- `gamehub_state` – kukkaro + jukebox-valinnat
- `gamehub_fruit_free` – ilmaisen pyöräytyksen aikaleima
- **Ei** `pimeakatu_*`-avaimia: hub ei saa sotkea AI CHAOS STREETin tilaa.
