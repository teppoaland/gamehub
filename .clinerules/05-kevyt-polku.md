# 🪶 Kevyt polku

## Staattinen muutos → ei testejä

Kun muutos koskee vain yhtä näkymää tai staattista asiaa (kuva, väri,
teksti, koko, sijainti, fontti, ääni), riittää:

1. lue vain se tiedosto, jota muutos koskee
2. tee muutos
3. raportoi 1–3 riviä

Käyttäjä testaa itse silmällä.

## Toiminnallisuus muuttuu → testaa

Testit ajetaan, kun muuttuu logiikka, pelimekaniikka, fysiikka,
törmäykset, reitit, talous, invariantit, portit, tilakoneet tai tallennus.

Komennot:

```
node tools/check-hub.cjs
node tools/tests/hub-logic-test.cjs
```

## Muistipankki ja dokumentit

- Muistipankkia ei päivitetä, ellei käyttäjä pyydä.
- Uusia memoja ei tehdä ilman pyyntöä.
- Versiorivi nostetaan koodimuutoksesta (sääntö 03).
