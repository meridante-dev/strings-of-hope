/* ============================================================
   CHEN — חֵן — "Musical Symmetry & Grace"
   The teachings of Ariel Cohen Alloro, adapted & abridged in our
   own words for the lever harp. Music theory (the octatonic /
   symmetrical scale, retrograde) is standard & public; the
   spiritual framework and its physics parallels are Alloro's
   teaching — presented AS his teaching, not as established science.
   ============================================================ */

const CHEN_SOURCE = 'Adapted and abridged from the teachings of Ariel Cohen Alloro, in our own words. The symmetrical (octatonic) scale and retrograde are standard, public music theory; the Kabbalistic framework and its physics parallels are Alloro’s spiritual teaching — presented as such, never as established science.';

const CHEN_INTRO = {
  heb:'חֵן',
  title:'Chen',
  sub:'Musical Symmetry & Grace',
  teacher:'The teachings of Ariel Cohen Alloro',
  lead:'A journey into music that can be played forward and backward — and be beautiful both ways. Alloro calls this <b>Chen</b>: grace, the beauty that can hold its own opposite.',
};

/* The signature toys */
const CHEN_OCTATONIC = {
  name:'C · whole–half symmetrical scale',
  degrees:['C','D','E♭','F','G♭','A♭','A','B','C'],
  notes:[60,62,63,65,66,68,69,71,72],
};
const CHEN_RETRO = {
  label:'A phrase on the symmetrical scale',
  melody:[60,63,66,69,71,68,65,63],   // forward; its reverse is its own "answer"
};

/* block kinds: lead · prose · teaching · quote{text,by} · scripture{ref,heb,text} · harp · science{h,text,src} · toy(octatonic|retro) · resonance */
const CHEN_MODULES = [
  {
    n:0, title:'The Secret of Chen', kicker:'Grace = symmetry',
    blocks:[
      {k:'lead', text:'“Nobody taught me this. In classical music, reverse exists — but composers used it as an <i>effect</i>. In my music, it <i>is</i> the music. This is the secret of Chen.”'},
      {k:'quote', text:'The clean idea: symmetrical harmony is the musical expression of Chen. The music has grace because forward and backward are reconciled — the reverse is not chaos; it becomes beauty.', by:'after Ariel Cohen Alloro'},
      {k:'prose', text:'Alloro — a musician before he was a teacher — draws a line between two kinds of beauty. <b>Yofi</b>, classical beauty, is rational and certain: ordered, limited, “two plus two is four.” <b>Chen</b>, the beauty of grace, is something else — the power to <b>bear opposites</b>, to embrace paradox, to hold two opposing forces in balance without breaking.'},
      {k:'teaching', text:'Chen contains an infinite power because it can embrace even the “lie” or the “curse” and find the hidden truth within it. In music, that means: a line and its reversal are not enemies. They belong together.'},
      {k:'prose', text:'Even the Hebrew hides it. <b>חֵן</b> (Chen) reversed spells <b>נֹחַ</b> (Noah) — the one who “found grace (chen) in the eyes of God.” To find grace, Alloro teaches, is to look and see yourself reflected, reversed, and reconciled.'},
      {k:'resonance', text:'This whole section is one idea, turned in the light: when something is perfectly balanced, you can play it in reverse and still meet perfect, harmonious beauty.'},
    ],
  },
  {
    n:1, title:'The Architecture of Reality', kicker:'Physics & Kabbalah',
    blocks:[
      {k:'lead', text:'Alloro builds his music on a picture of reality where the physical and spiritual worlds run perfectly parallel — a fractal, holographic structure repeating the same pattern at every scale.'},
      {k:'prose', text:'He describes three fundamental dimensions: <b>Time</b>, <b>Space</b>, and <b>Soul</b> (the moral dimension — nearness to the Divine). Wisdom (light, time) and Understanding (space) are its poles; at the speed of light, he teaches, time stops and enters a kind of eternity.'},
      {k:'prose', text:'He maps the <b>wave–particle</b> duality onto ancient archetypes: the <b>particle</b> — matter, the body, the countable — to Abraham; the <b>wave</b> — <i>gal</i>, emptiness, boundless frequency — to Isaac. Music, for Alloro, is where wave and particle meet: physical vibration you can count, carrying infinite frequency you can’t.'},
      {k:'science', h:'Reading this honestly', text:'These are <b>Alloro’s symbolic correspondences</b> between Kabbalah and physics — a framework for meaning, not claims of established science. (For example, the number 248 he uses is the traditional count of the positive commandments and the body’s limbs — and, strikingly, the dimension of the E₈ symmetry group in mathematics — not a count of “elementary particles.”) We hold the poetry and the honesty together, exactly as in Shamayim Harp.', src:'Presented as Ariel Cohen Alloro’s teaching, distinct from established physics.'},
    ],
  },
  {
    n:2, title:'The Technology of Chen', kicker:'Symmetry & paradox',
    blocks:[
      {k:'lead', text:'The goal, in the language of Chassidut, is a single formula: <i>Orot d’tohu b’chelim d’tikun</i> — “Lights of Chaos in Vessels of Rectification.”'},
      {k:'prose', text:'It means taking wild, infinite, uncontained energy and safely housing it inside a structure that can hold it. Raw chaotic light (Esau, the untamed body) poured into a clear, ordered vessel (Jacob, the Torah, structured form) — without shattering.'},
      {k:'teaching', text:'To hold such opposites you need <b>Chen</b> — absolute symmetry, the capacity to bear paradox. Alloro’s image: a cup of perfectly refined material can hold boiling and freezing water at once and never crack. A mind conditioned by Chen can hold opposing truths — wave and particle, mercy and judgment — in perfect balance.'},
      {k:'harp', text:'In music this is the whole craft: catch a wild, chaotic emotion and pour it into a <b>structured, symmetrical</b> form the ear can hold. On the harp, an arpeggio that climbs and then descends the very same way is a tiny vessel of Chen — chaos made graceful.'},
    ],
  },
  {
    n:3, title:'The 8-Stringed Violin', kicker:'The symmetrical scale', toy:'octatonic',
    blocks:[
      {k:'lead', text:'A teaching says the violin of the Mashiach will have <b>eight strings</b>. Alloro hears in that an <b>8-note symmetrical scale</b> — built by alternating whole steps and half steps, on and on.'},
      {k:'prose', text:'In standard music theory this is the well-known <b>octatonic</b> (or “diminished”) scale — used by Rimsky-Korsakov, by Messiaen (his second “mode of limited transposition”), and all over jazz. Because it simply alternates <b>whole–half–whole–half…</b>, it is <b>perfectly symmetrical</b>: it has no true beginning or end, and repeats every minor third.'},
      {k:'toy', toy:'octatonic'},
      {k:'teaching', text:'Here is the grace of it: because the scale is symmetrical, a melody written on it can be played <b>entirely in reverse</b> and still work — the reverse becomes its own perfect harmonic answer. Forward and backward are reconciled. That is Chen, made of notes.'},
      {k:'harp', text:'On a lever harp you can set this scale as a fixed tuning (for C whole–half: C · D · E♭ · F · G♭ · A♭ · A · B). Some strings sit as flats, some as naturals — a deliberate lever setting rather than a live change. Once set, the whole symmetrical world is under your hands.'},
    ],
  },
  {
    n:4, title:'Softening the Ground', kicker:'Psycho-acoustics',
    blocks:[
      {k:'lead', text:'Why use this music at all? Alloro gives it a job: to prepare the soul to receive.'},
      {k:'prose', text:'He compares the rigid, rational mind to <b>hard, dry ground</b>. Try to plant a seed — a deep, paradoxical truth — in ground that hard, and nothing grows. So first you soften it. Loud, complex, or symmetrical music, he teaches, temporarily <b>“deafens” the intellect</b> and opens the subconscious, like a plough breaking the soil.'},
      {k:'teaching', text:'Once the music has bypassed the mind’s defences and made a natural, emotional connection, the ground is ready — and only then can the deeper words, the real seeds, be planted and take root.'},
      {k:'science', h:'Reading this honestly', text:'There is real ground beneath the metaphor: music genuinely lowers the body’s guard — easing the stress response, shifting brain-states, opening us emotionally (the music-therapy findings from Shamayim Harp). Alloro’s specific spiritual mechanism is his teaching, not a lab result; the general power of music to open a closed heart is very well attested.', src:'Music’s calming/opening effects are established; the “planting seeds” mechanism is Alloro’s teaching.'},
    ],
  },
  {
    n:5, title:'The Masterpiece', kicker:'Forward & reverse, reconciled', toy:'retro',
    blocks:[
      {k:'lead', text:'Everything meets here: a melody on the symmetrical scale that answers itself when reversed.'},
      {k:'prose', text:'This is the practical heart of Chen. Compose a phrase on the 8-note scale, then play it <b>backward</b> — its <b>retrograde</b>. On a symmetrical scale the reverse doesn’t fight the original; it completes it, like a reflection completing a face.'},
      {k:'toy', toy:'retro'},
      {k:'prose', text:'Alloro adds the fractal touch: let the small mirror the large — the way individual notes are reversed, let whole sections mirror one another, so the piece reflects the holographic pattern he sees in creation itself: micro echoing macro, the part singing the whole.'},
      {k:'harp', text:'Try it on your harp: play a short line on the symmetrical setting above, then play it from the last note back to the first. Listen for the moment the two directions recognise each other — that recognition is Chen.'},
      {k:'resonance', text:'When forward and backward are reconciled, the reverse is no longer a curse to be feared. It becomes grace. That, in the end, is the whole teaching — and it fits in your two hands.'},
    ],
  },
];

const CHEN_SOURCES = {
  intro:'The spiritual teaching here is Ariel Cohen Alloro’s, adapted in our own words. The underlying music theory is standard and public. Every link goes to its source.',
  groups:[
    { t:'The teacher', items:[
      {k:'watch', label:'Ariel Cohen Alloro — teachings', by:'search his talks', url:'https://www.youtube.com/results?search_query=Ariel+Cohen+Alloro'},
    ]},
    { t:'The music theory (standard & public)', items:[
      {k:'read', label:'Octatonic scale — the 8-note symmetrical scale', by:'overview', url:'https://en.wikipedia.org/wiki/Octatonic_scale'},
      {k:'read', label:'Modes of limited transposition (Messiaen)', by:'overview', url:'https://en.wikipedia.org/wiki/Mode_of_limited_transposition'},
      {k:'read', label:'Retrograde — melody in reverse', by:'overview', url:'https://en.wikipedia.org/wiki/Retrograde_(music)'},
    ]},
  ]
};
