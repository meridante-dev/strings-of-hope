/* ============================================================
   SHAMAYIM HARP — שָׁמַיִם — "The Heavenly Harp"
   A contemplative journey through the five worlds of the soul,
   where the harp is followed from the physical string to the
   cosmic vibration. Educative + contemplative — not a theory drill.

   The Harp Project · Edenrise.
   Content adapted from the user's own writing, enriched with
   scripture, Jewish mystical tradition, and HONEST science
   (real, cited findings kept distinct from poetic parallel).
   ============================================================ */

const SHAMAYIM_SOURCE = 'A contemplative journey · The Harp Project, Edenrise. Science is cited from established research; where a parallel between tradition and physics is poetic rather than proven, it is marked as such.';

const SHAMAYIM_INTRO = {
  heb:'שָׁמַיִם',
  title:'Shamayim Harp',
  sub:'The Heavenly Harp',
  lead:'A journey up through the five worlds of the soul — following the harp from the plucked string in your hands to the vibration behind all things.',
  note:'Five ascents: <b>Nefesh</b> · <b>Ruach</b> · <b>Neshama</b> · <b>Chaya</b> · <b>Yechida</b> — body, feeling, spirit, radiance, oneness.',
};

/* block kinds: lead · prose · scripture{ref,heb,text} · science{h,text,src} · tradition{h,text} · resonance(text) · quote{text,by} */
const SHAMAYIM_LEVELS = [
  {
    n:1, heb:'נֶפֶשׁ', tr:'Nefesh', world:'The Living World', sub:'The harp in the physical world',
    kicker:'Body',
    blocks:[
      {k:'lead', text:'In the physical world, the harp is a beautiful instrument — loved by peoples and cultures across many thousands of years.'},
      {k:'prose', text:'From the earliest civilisations it has accompanied humanity: sounding in royal palaces, carried to the sick, cradled in solitude. It has always been an instrument of <b>healing and contemplation</b> — perhaps because, of all instruments, its ringing strings sit closest to the human voice and the human breath.'},
      {k:'prose', text:'In Biblical times the harp — the <b>kinnor</b> — was the instrument of prophets and of worship. A band of prophets came down "with a lute, a timbrel, a pipe, and a harp before them" (1 Samuel 10:5). And in the Holy Temple, the <b>Levites</b> stood with harps and lyres, their music woven into the daily service of God.'},
      {k:'scripture', ref:'Psalm 150:3–4', heb:'הַלְלוּהוּ בְּתֵקַע שׁוֹפָר · הַלְלוּהוּ בְּנֵבֶל וְכִנּוֹר', text:'Praise Him with the blast of the horn; praise Him with the harp and lyre… praise Him with strings and pipe.'},
      {k:'science', h:'What the physical world shows', text:'The harp is among the <b>oldest instruments humanity has made</b>: the Lyres of Ur, unearthed in Mesopotamia, are roughly 4,500 years old. And every string obeys the same physics your own harp does — pluck it and it forms a <b>standing wave</b>, sounding a fundamental pitch plus a whole ladder of quieter <b>harmonics</b> above it. The chord hidden inside a single string is not mysticism; it is measurable acoustics — the subject of our Science of Sound unit.', src:'Archaeology: Lyres of Ur, ~2500 BCE. Acoustics: the harmonic series.'},
      {k:'tradition', h:'Nefesh — the living soul', text:'<b>Nefesh</b> is the soul bound to the body and the blood — the vital, animating life. It is fitting that the journey begins here, with a real instrument of wood and string in real hands. Everything that follows grows from this first, physical touch.'},
    ],
  },
  {
    n:2, heb:'רוּחַ', tr:'Ruach', world:'The World of Feeling', sub:'The harp and the emotions',
    kicker:'Feeling',
    blocks:[
      {k:'lead', text:'The harp helps to balance our unbalanced emotions — our restless desires and appetites — and to reconnect us to our true state of being.'},
      {k:'prose', text:'We rarely arrive at the harp in perfect balance. We come carrying the day: its tension, its grief, its noise. Something happens as the strings begin to ring. The breathing slows. The scattered mind gathers. Slowly we are returned to ourselves — not to a performance, but to a <b>truer emotional centre</b> beneath the turbulence.'},
      {k:'science', h:'What research shows', text:'This is not only poetry — it is one of the best-studied effects in medicine. <b>Music therapy</b> is a peer-reviewed clinical field: listening to and making music measurably lowers <b>anxiety</b>, eases <b>pain</b>, and shifts the body toward calm — slowing heart rate, raising <b>heart-rate variability</b>, and lowering the stress hormone <b>cortisol</b>. Live, resonant, low-frequency instruments (harp among them) are used in <b>vibroacoustic therapy</b> for exactly this settling of the nervous system.', src:'Cochrane reviews on music for anxiety & pain; research on music, HRV & cortisol.'},
      {k:'tradition', h:'Ruach — spirit, wind, breath', text:'<b>Ruach</b> is the emotional soul — the same word means "spirit," "wind," and "breath." Feeling moves through us like weather. The harp is a way of tending that inner weather: of letting a storm resolve, gently, into calm.'},
      {k:'resonance', text:'When the harmony of the strings meets the disharmony inside us, it is the strings that win — slowly, kindly. The instrument tunes the player.'},
    ],
  },
  {
    n:3, heb:'נְשָׁמָה', tr:'Neshama', world:'The Breath of the Divine', sub:'The harp as healing and deliverance',
    kicker:'Spirit',
    blocks:[
      {k:'lead', text:'On the spiritual level, the harp is an instrument of healing and of deliverance.'},
      {k:'prose', text:'The Bible tells it plainly. King Saul is tormented by an evil spirit, and his servants send for a young shepherd known to be skilful with the harp. <b>David</b> takes up the kinnor and plays — and the darkness lifts.'},
      {k:'scripture', ref:'1 Samuel 16:23', heb:'וְלָקַח דָּוִד אֶת־הַכִּנּוֹר וְנִגֵּן בְּיָדוֹ', text:'And David took the harp and played with his hand; so Saul was refreshed, and was well, and the evil spirit departed from him.'},
      {k:'prose', text:'The harp has long been felt to carry a <b>spiritually healing power</b> — to steady the frightened, to lift the oppressed, to re-tune a person to a truer, more organic frequency of being.'},
      {k:'science', h:'What science shows — and what it doesn’t', text:'Vibration genuinely organises matter: draw a bow across a metal plate scattered with sand and the grains leap into exact geometric patterns — the <b>Chladni figures</b> first shown in 1787, the field later named <b>cymatics</b>. Sympathetic resonance is real: one ringing string sets another, tuned alike, trembling untouched. <b>Honest caveat:</b> the popular idea that one specific tuning (such as 432 Hz) is uniquely "healing" or "natural" is <b>not supported by solid evidence</b> — it belongs to tradition and personal experience, not established physics. We hold the wonder and the honesty together.', src:'Chladni (1787); Jenny, "Cymatics" (1967). 432 Hz claims: no robust scientific support.'},
      {k:'tradition', h:'Neshama — the divine breath', text:'<b>Neshama</b> is the breath God breathed into the human being at creation (Genesis 2:7). It is the soul that reaches upward. When David played and the spirit departed, the harp became a channel for that higher breath — sound as deliverance.'},
    ],
  },
  {
    n:4, heb:'חַיָּה', tr:'Chaya', world:'The Living Radiance', sub:'Where the self opens beyond itself',
    kicker:'Radiance',
    blocks:[
      {k:'lead', text:'Higher still, the harp becomes a doorway — a place where the small, separate self begins to open into something vast.'},
      {k:'prose', text:'Musicians know this threshold. There are moments at the instrument when the effort falls away, when player and playing become one motion, when time loosens its grip. The music seems to arrive <b>through</b> you rather than <b>from</b> you. This is the transpersonal country — the edge of awe.'},
      {k:'scripture', ref:'Psalm 42:7', heb:'תְּהוֹם אֶל־תְּהוֹם קוֹרֵא לְקוֹל צִנּוֹרֶיךָ', text:'Deep calls unto deep at the sound of Your waterfalls; all Your waves and billows have gone over me.'},
      {k:'science', h:'What research shows', text:'These states are real and increasingly studied. The spine-tingling "chill" of a transcendent musical moment — <b>frisson</b> — is accompanied by a measurable release of <b>dopamine</b> at the brain’s peak of anticipation and resolution (Salimpoor et al., 2011). And <b>awe</b> — the felt sense of vastness that rewrites your scale — is a documented emotion that quiets the self-focused mind, dissolves the boundary of the ego, and binds us to something larger (Keltner & Haidt).', src:'Salimpoor et al., Nature Neuroscience (2011); Keltner & Haidt on awe.'},
      {k:'tradition', h:'Chaya — living essence', text:'<b>Chaya</b> is the soul-level of pure life-force and will — the aspect that already reaches beyond individual identity. Here the harp is no longer only <i>yours</i>. It is a thread you are following out of yourself, toward the source of all threads.'},
      {k:'resonance', text:'We are leaving the cycles of seven — the week, the octave, the worlds we live within — and beginning to feel the pull of ten: a higher order, a wider connection.'},
    ],
  },
  {
    n:5, heb:'יְחִידָה', tr:'Yechida', world:'The One', sub:'The Cosmic Harp — mystical symbol & quantum science',
    kicker:'Oneness',
    blocks:[
      {k:'lead', text:'We have come far. Through history, feeling, and the science of sound, we have followed the thread of vibration across every layer of the harp. Now the threads begin to weave together.'},
      {k:'prose', text:'Here we no longer study sound as something outside us. We listen differently — beneath music, beneath words, even beneath thought — for the <b>sound behind the sound</b>. The harp becomes the awareness that all things are connected: that reality itself vibrates, not as metaphor but truly. Every human, every plant, every stone, every star, every breath.'},
      {k:'prose', text:'Ancient voices spoke of a <b>ten-stringed harp yet to come</b> — a harp for the days when the world is made whole. They did not mean strings of wood and gut, but something deeper: the great vibrational structure of life itself, restored.'},
      {k:'scripture', ref:'Psalm 19:1–4', heb:'הַשָּׁמַיִם מְסַפְּרִים כְּבוֹד־אֵל · וּמַעֲשֵׂה יָדָיו מַגִּיד הָרָקִיעַ', text:'The heavens declare the glory of God, and the firmament shows His handiwork. Day unto day utters speech, and night unto night reveals knowledge. There is no speech nor language where their voice is not heard. Their line has gone out through all the earth, and their words to the end of the world.'},
      {k:'prose', text:'The heavens vibrate. They sing. Day after day, night after night, the silent music of existence resounds, carrying the glory of its Source. And in the language of scripture this was revealed long before physics: <b>"And God said, Let there be light" — and there was light.</b> Creation begins with a Voice. Sound, vibration, light — not metaphor, but the fundamental mechanism of existence. At the deepest level, the universe itself is a sound.'},
      {k:'science', h:'What physics now proposes', text:'Modern physics arrives, strikingly, at a similar image. In <b>string theory</b>, the smallest building blocks of reality are not point-like dots but tiny vibrating <b>strings</b> — and, exactly as on a harp, <b>how a string vibrates decides what it becomes</b>: this note is light, that note is matter. These theories require not three dimensions but <b>ten or eleven</b>. And <b>superstring theory</b> traces every vibration back to a single origin — a <b>primordial vibration</b> at the beginning of the universe, from which all strings extend. Physicists still search for one "final theory": a single, unified vibration behind all things.', src:'String / superstring / M-theory (Green–Schwarz–Witten). Presented as physics’ leading framework — a resonance with tradition, not a proof of it.'},
      {k:'tradition', h:'The ten strings & the Kinnor HaGadol', text:'The Midrash Tehillim on Psalm 92 teaches: <i>"The harp of the future will have ten strings"</i> — "upon an instrument of ten strings… and upon the harp" (Psalm 92:4). Ten is the number of the sayings by which the world was created, the reflections of the Tree of Life — a higher order beyond the cycles of seven we live within. Just as the earthly shofar reflects the <b>Shofar HaGadol</b> in the heavens, so the physical harp reflects the <b>Kinnor HaGadol</b>, the Great Heavenly Harp: not an object, but the infinite network of divine light through which the Creator’s resonance flows — the matrix that projects the universe into being, like a hologram from underlying vibration.'},
      {k:'resonance', text:'The harp reminds us that we are not outside the song. You are within it. You are of it. Every beat of your heart, every word you speak, every step you take — you are a note in the great harp’s song. The music of David was seen as an instrument of Tikkun Olam — the restoration of the world: the earthly harp of the Tabernacle of David, restored, reflecting the broken strings of reality re-tuned, re-woven, re-unified into the One from which they came. And somewhere, beyond time, the ancient harp of ten strings is already playing.'},
    ],
  },
];

/* Foundations & sources shelf for the journey (public-domain + honest science + scholarship) */
const SHAMAYIM_SOURCES = {
  intro:'This journey stands on real ground — scripture, the Jewish musical tradition, and established science. These are the foundations; each link goes to its source, taught here in our own words.',
  groups:[
    { t:'Scripture & tradition', items:[
      {k:'book', label:'Jewish Music in Its Historical Development (1929)', by:'A.Z. Idelsohn — public domain', url:'https://archive.org/details/jewishmusicinits00idel'},
      {k:'read', label:'Music, Synagogal', by:'Jewish Encyclopedia (1906) — public domain', url:'https://www.jewishencyclopedia.com/articles/11241-music-synagogal'},
      {k:'read', label:'The Tanakh, with cantillation', by:'Sefaria', url:'https://www.sefaria.org'},
    ]},
    { t:'The science of sound & the body', items:[
      {k:'read', label:'Cymatics — vibration made visible', by:'Chladni (1787) / Jenny (1967)', url:'https://en.wikipedia.org/wiki/Cymatics'},
      {k:'read', label:'Anatomically distinct dopamine release & music', by:'Salimpoor et al., Nature Neuroscience (2011)', url:'https://www.nature.com/articles/nn.2726'},
      {k:'read', label:'Music interventions for anxiety (evidence)', by:'Cochrane review', url:'https://www.cochrane.org/CD006908/'},
    ]},
    { t:'The vibrating universe', items:[
      {k:'read', label:'String theory — matter as vibration', by:'overview', url:'https://en.wikipedia.org/wiki/String_theory'},
      {k:'read', label:'Superstring theory & extra dimensions', by:'overview', url:'https://en.wikipedia.org/wiki/Superstring_theory'},
    ]},
    { t:'Deeper — Jewish musical tradition', items:[
      {k:'read', label:'Jewish Music Research Centre (Hebrew University)', by:'free scholarship & recordings', url:'https://jewish-music.huji.ac.il/en'},
      {k:'read', label:'Adonai Malach as a case study (open access)', by:'Boaz Tarsi, AAWM 8.2 (2021)', url:'https://aawmjournal.com'},
    ]},
  ]
};
