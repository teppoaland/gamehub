# 💰 Kukkaro ja jukebox

Kukkaro on hubin **oma kevyt pelikrediitti**. Se ei ole AI CHAOS STREETin
talous-, nälkä- eikä hampurilaisjärjestelmä: hubissa ei ole kaaosta,
nälkää, BAR:ia eikä hampurilaisvaroituksia. Kolikko- ja
hampurilaislogiikkaa ei ole lukittu tähän repoon.

## Hubin kukkaro (v10.x toteutus)

| Asia | Arvo |
|------|------|
| Alkusaldo | **20** kolikkoa |
| `COIN_COLLECTED` | **+1** |
| `fruitBet` | **−1** |
| `fruitWin` | **+n** (ei negatiivisia) |
| Top-up | **+20**, vain kun saldo on **0** |
| Tallennus | `gamehub_state` |

Top-up on rajattu nykyisessä toteutuksessa: sitä ei voi käyttää täyden
saldon kasvattamiseen. Kun saldo on 0, valikkoon ilmestyy
`TOP UP BALANCE +20`. Arvot kuvaavat hubin omaa toteutusta – ne eivät
tule AI CHAOS STREETista eikä niitä tarvitse sovittaa sen talouteen.

## Jukebox

- **Ei kolikoita, ei rajaa** valittujen kappaleiden määrälle.
- Raidat tulevat tämän repon `jukebox/tracks.js`-manifestista ja
  `jukebox/`-kansiosta (GitHub API, 1 h välimuisti).
- Jono soi myös pelien aikana.
- Menu-musiikki arvotaan raidoista 1–3 ja soi vain valikossa.

## Fruit Machine

Pelin RTP, symbolipainot, maksut ja ilmainen pyöräytys (1 / 120 s) ovat
pelin omia testattuja arvoja. Älä muuta niitä ilman erillistä pyyntöä.

## Avaimet

- `gamehub_state` – kukkaro + jukebox-valinnat
- `gamehub_fruit_free` – ilmaisen pyöräytyksen aikaleima
- `gamehub_tracks_cache` – GitHub-haun 1 h välimuisti
- Vain `gamehub_*`-avaimet. `pimeakatu_*` kuuluu AI CHAOS STREETiin,
  ei tähän repoon.
