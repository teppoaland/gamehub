/* ═══════════════════════════════════════════════════════════
   tracks.js – GAME HUB: jukebox-track manifest

   Lähde: tämän repon `jukebox/`-kansio. Tähän listaan lisätään uudet
   raidat; sama lista toimii offline-fallbackina, kun GitHub-haku ei
   onnistu. Hubi hakee lisäraidat saman repon jukebox-kansiosta.

   id 1–3 = menu-musiikin pooli (alkumusiikki arvotaan näistä).
   Kaikki raidat ovat jukeboxissa vapaasti valittavissa.
   ═══════════════════════════════════════════════════════════ */
window.GAMEHUB_TRACKS = [
    { id: 1, url: 'jukebox/Knived_Our_song.mp3',
      title: 'Knived - Our Song', duration: '4:24',
      cover: 'jukebox/covers/1.png' },
    { id: 2, url: 'jukebox/Knived_Unafraid.mp3',
      title: 'Knived - Unafraid', duration: '4:43',
      cover: 'jukebox/covers/2.png' },
    { id: 3, url: 'jukebox/Knived_Unafraid_instrumental.mp3',
      title: 'Knived - Unafraid (inst.)', duration: '2:08',
      cover: 'jukebox/covers/3.png' },
    { id: 4, url: 'jukebox/alec_koff-heavy-doom-dark-metal-493397.mp3',
      title: 'Alec Koff - Heavy Doom', duration: '1:53',
      cover: 'jukebox/covers/4.png' },
    { id: 5, url: 'jukebox/alec_koff-in-heavy-metal-492175.mp3',
      title: 'Alec Koff - In Heavy Metal', duration: '2:45',
      cover: 'jukebox/covers/5.png' },
    { id: 6, url: 'jukebox/mrclaps-this-heavy-metal-492569.mp3',
      title: 'MrClaps - This Heavy Metal', duration: '2:09',
      cover: 'jukebox/covers/6.png' },
    { id: 7, url: 'jukebox/7_alex-morgan-thrash-metal-591343.mp3',
      title: 'Alex Morgan - Thrash Metal', duration: '3:02',
      cover: 'jukebox/covers/7_alex-morgan-thrash-metal-591343.png' },
    { id: 8, url: 'jukebox/8_nickpanek-coffee-first-heavy-grunge-metal-instrumental-391308.mp3',
      title: 'NickPanek - Coffee First Heavy Grunge Metal (inst.)', duration: '3:04',
      cover: 'jukebox/covers/8_nickpanek-coffee-first-heavy-grunge-metal-instrumental-391308.png' },
    { id: 9, url: 'jukebox/9_nickpanek-heavy-doom-metal-instrumental-288971.mp3',
      title: 'NickPanek - Heavy Doom Metal (inst.)', duration: '3:02',
      cover: 'jukebox/covers/9_nickpanek-heavy-doom-metal-instrumental-288971.png' }
];

/* Menu-musiikki arvotaan näistä (ei räväkkä Alec Koff heti taustaksi). */
window.GAMEHUB_MENU_TRACK_IDS = [1, 2, 3];
