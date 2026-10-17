# 🧪 GAME HUB – manuaalinen testilista (v10.05)

> Testaa `file:///D:/AI/gamehub/index.html` (Ctrl+Shift+R jos epäilet
> välimuistia). Kirjaa havainnot lyhyesti.

## 0) Käynnistys

- [ ] Sivu avautuu: tummansininen tausta + `GAME HUB` +
      `CLICK / PRESS ANY KEY TO BEGIN`.
- [ ] Klikkaus/näppäin → teksti himmenee, noin 2 s → valikko.
- [ ] Alkumusiikki alkaa vasta noin 1 s klikin jälkeen (ei särähdä).
- [ ] Valikossa `GAME HUB` / `CHOOSE YOUR GAME` + 5 nappia.
- [ ] Valikon tausta on tummansininen; pelien taustat ennallaan.
- [ ] Oikeassa alakulmassa `v10.05` (vain valikossa).

## 1) Valikko ja detailit

- [ ] Auto-hover käy 5 napin yli 10 s välein; viimeinen (FRUIT MACHINE)
      jää päälle 2 s ja koko ruutu tärisee.
- [ ] Oma hiiri/täppäys keskeyttää auto-hoverin.
- [ ] `INSTRUCTIONS` avaa CRT-ikkunan, teksti kirjoittuu merkki kerrallaan,
      `TAP SCREEN OR PRESS ESC TO CLOSE` toimii.
- [ ] `HAVE FUN!` vilkahtaa lopuksi.
- [ ] `INSTRUCTIONS` ja `JUKEBOX / MUSIC SETUP` -rivien välissä on selkeä
      yhden rivin väli (eivät ole kiinni toisissaan).
- [ ] Valikossa ei näy saldoriviä (ei `BALANCE`-tekstiä).
- [ ] Menu-musiikki on MrClaps – This Heavy Metal ja soi vain kerran
      (ei ala uudelleen, ei looppia).
- [ ] `JUKEBOX / MUSIC SETUP` avaa jukebox-overlayn.

## 2) Jukebox

- [ ] Listassa 9 raitaa + kannet + kestot; kaikki kannet näkyvät
      (myös 1–3 ja 5), ei valkoisia laatikoita. 1–3 ja 5 käyttävät
      uusia JPEG-kansia; listan thumbnailit ovat background-image-divejä.
- [ ] `FREE – PICK AS MANY TRACKS AS YOU LIKE` -riviä ei ole.
- [ ] Monta raitaa voi valita yhtä aikaa; valinta muistuu sivun reloadin yli.
- [ ] `PLAY SELECTED` soittaa valitut järjestyksessä; `NOW PLAYING` ja
      `n / N` päivittyvät.
- [ ] `SKIP ▶▶` siirtää seuraavaan raitaan (viimeisestä takaisin alkuun,
      jos repeat on päällä).
- [ ] `REPEAT [X]` on oletuksena päällä; klikkaus vaihtaa `[ ]`:ksi ja
      jono pysähtyy viimeisen raidan jälkeen. Tila muistuu reloadin yli.
- [ ] `STOP` pysäyttää; `BACK` sulkee overlayn.
- [ ] Musiikki jatkuu, kun avaat pelin; ✕ palatessa jukebox soi edelleen.
- [ ] Kun jono loppuu repeat pois päältä, menu-musiikki ei ala uudelleen
      (aloitusraita soi vain kerran).
- [ ] Ei kolikkovaatimuksia missään vaiheessa.

## 3) Pelit

Jokaiselle pelille:

- [ ] BLUE MÄX käynnistyy ja ✕ palaa valikkoon.
- [ ] DIG GAME käynnistyy ja ✕ palaa valikkoon.
- [ ] DIG DÄSH käynnistyy ja ✕ palaa valikkoon.
- [ ] BATTLESHIP käynnistyy ja ✕ palaa valikkoon.
- [ ] FRUIT MACHINE on listan ja ohjeiden viimeisenä; se käynnistyy aina
      vähintään 20 kolikolla (myös silloin, kun hubin saldo oli 0),
      ✕ palaa valikkoon.
- [ ] Pelin oma voitto/loppu → `RETURN_TO_STREET` → valikko.
- [ ] Pelin oma ESC/EXIT (Fruit, Battleship) → valikko.

## 4) Kukkaro

- [ ] Valikossa ei näy saldoriviä.
- [ ] Dig Game / Battleship -kolikko kasvattaa saldoa (+1).
- [ ] Fruit Machinen pyöräytys vähentää (−1); voitto lisää (+n).
- [ ] Kun saldo on 0, `TOP UP +20` ilmestyy; klikkaus → 20.
- [ ] Top-up ei toimi, kun saldo > 0.
- [ ] Fruit Machinen uudelleenavaaminen 0-saldolla antaa 20 kolikkoa.
- [ ] Saldo säilyy reloadin yli (`gamehub_state`).

## 5) Puhelin (5" pystynäyttö)

- [ ] Gate ja valikko mahtuvat ilman vieritystä.
- [ ] Nappien tekstit ovat luettavissa.
- [ ] Ohjeikkuna vierittyy; Esc/täppäys sulkee.
- [ ] Jukebox-lista vierittyy; PLAY/SKIP/STOP/REPEAT/BACK ovat
      tavoitetavissa.
- [ ] Pelien kosketusohjaimet toimivat.

## 6) Regression tarkistukset

- [ ] Hubin localStorage-avaimet alkavat `gamehub_`-etuliitteellä
      (`gamehub_state`, `gamehub_fruit_free`, `gamehub_tracks_cache`).
- [ ] `v10.05` ja kaikki `?v=10.05`-leimat täsmäävät.
- [ ] Repossa ei ole street-osaa (`street.js`, katu, kaaos, nälkä, BAR,
      makuuhuone) eikä burger-/talouslukkoa.
- [ ] `node tools/check-hub.cjs` → 0 löydöstä.
- [ ] `node tools/tests/hub-logic-test.cjs` → 0 löydöstä.
