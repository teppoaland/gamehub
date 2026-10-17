# 🧪 GAME HUB – manuaalinen testilista (v10.01)

> Testaa `file:///D:/AI/gamehub/index.html` (Ctrl+Shift+R jos epäilet
> välimuistia). Kirjaa havainnot lyhyesti.

## 0) Käynnistys

- [ ] Sivu avautuu: musta tausta + `GAME HUB` + `CLICK / PRESS ANY KEY TO BEGIN`.
- [ ] Klikkaus/näppäin → teksti himmenee, noin 2 s → valikko.
- [ ] Valikossa `GAME HUB` / `CHOOSE YOUR GAME` + 5 nappia.
- [ ] Oikeassa alakulmassa `v10.01` (vain valikossa).

## 1) Valikko ja detailit

- [ ] Auto-hover käy 5 napin yli 10 s välein; viimeinen (BATTLESHIP) jää
      päälle 2 s ja koko ruutu tärisee.
- [ ] Oma hiiri/täppäys keskeyttää auto-hoverin.
- [ ] `INSTRUCTIONS` avaa CRT-ikkunan, teksti kirjoittuu merkki kerrallaan,
      `TAP SCREEN OR PRESS ESC TO CLOSE` toimii.
- [ ] `HAVE FUN!` vilkahtaa lopuksi.
- [ ] `JUKEBOX / MUSIC SETUP` avaa jukebox-overlayn.

## 2) Jukebox

- [ ] Listassa 9 raitaa + kannet + kestot.
- [ ] Monta raitaa voi valita yhtä aikaa; valinta muistuu sivun reloadin yli.
- [ ] `PLAY SELECTED` soittaa valitut järjestyksessä; `NOW PLAYING` ja
      `n / N` päivittyvät.
- [ ] `STOP` pysäyttää; `BACK` sulkee overlayn.
- [ ] Musiikki jatkuu, kun avaat pelin; ✕ palatessa jukebox soi edelleen.
- [ ] Kun jono loppuu valikossa, menu-musiikki palaa (ei jukebox-overlayn
      ollessa auki).
- [ ] Ei kolikkovaatimuksia missään vaiheessa.

## 3) Pelit

Jokaiselle pelille:

- [ ] BLUE MÄX käynnistyy ja ✕ palaa valikkoon.
- [ ] DIG GAME käynnistyy ja ✕ palaa valikkoon.
- [ ] DIG DÄSH käynnistyy ja ✕ palaa valikkoon.
- [ ] FRUIT MACHINE käynnistyy, saldo tulee hubista, ✕ palaa valikkoon.
- [ ] BATTLESHIP käynnistyy ja ✕ palaa valikkoon.
- [ ] Pelin oma voitto/loppu → `RETURN_TO_STREET` → valikko.
- [ ] Pelin oma ESC/EXIT (Fruit, Battleship) → valikko.

## 4) Kukkaro

- [ ] Valikossa `🪙 20`.
- [ ] Dig Game / Battleship -kolikko kasvattaa saldoa (+1).
- [ ] Fruit Machinen pyöräytys vähentää (−1); voitto lisää (+n).
- [ ] Kun saldo on 0, `TOP UP BALANCE +20` ilmestyy; klikkaus → 20.
- [ ] Top-up ei toimi, kun saldo > 0.
- [ ] Saldo säilyy reloadin yli (`gamehub_state`).

## 5) Puhelin (5" pystynäyttö)

- [ ] Gate ja valikko mahtuvat ilman vieritystä.
- [ ] Nappien tekstit ovat luettavissa.
- [ ] Ohjeikkuna vierittyy; Esc/täppäys sulkee.
- [ ] Jukebox-lista vierittyy; PLAY/STOP/BACK ovat tavoitetavissa.
- [ ] Pelien kosketusohjaimet toimivat (AI-streetistä peritty).

## 6) Regression tarkistukset

- [ ] Hubin localStorage-avaimet alkavat `gamehub_`-etuliitteellä
      (`gamehub_state`, `gamehub_fruit_free`, `gamehub_tracks_cache`).
- [ ] `v10.01` ja kaikki `?v=10.01`-leimat täsmäävät.
- [ ] Repossa ei ole street-osaa (`street.js`, katu, kaaos, nälkä, BAR,
      makuuhuone) eikä burger-/talouslukkoa.
- [ ] `node tools/check-hub.cjs` → 0 löydöstä.
- [ ] `node tools/tests/hub-logic-test.cjs` → 0 löydöstä.
