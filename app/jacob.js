/* ============================================================
   Jacob's Universe — harmony the Jacob Collier way, mapped to the lever harp.
   Concepts distilled (in our own words) from Jacob Collier's public
   masterclasses & interviews; we link out to watch the source.
   Data only — rendering + the interactive toy live in app.js.
   ============================================================ */
const JACOB_SOURCE = 'Concepts distilled from Jacob Collier’s masterclasses & interviews — taught in our own words, with links to watch the source. Not affiliated with Jacob Collier.';

/* The flagship interactive toy: one held note, many chords beneath it.
   held note sounds on top (C5); each chord recolours it. midi = note numbers. */
const JU_ONE_NOTE = {
  held:{ name:'C', midi:72 },                 // the note that never changes (C5, on top)
  chords:[
    { name:'C major',    feel:'Home',            role:'C is the root — fully at rest, you’ve arrived.',          notes:[48,52,55] },   // C E G
    { name:'F major',    feel:'Open & restful',  role:'C is the 5th — settled and spacious, a gentle lean.',     notes:[53,57,60] },   // F A C
    { name:'A minor',    feel:'Wistful',         role:'C is the ♭3 — the same note turns tender and shadowed.',  notes:[45,48,52] },   // A C E
    { name:'A♭ major',   feel:'Warm, far-off',   role:'C is the 3rd — a distant sun, bittersweet and glowing.',  notes:[44,48,51] },   // Ab C Eb
    { name:'D♭ maj7',    feel:'Yearning, lush',  role:'C is the major 7th — floating, aching to resolve.',       notes:[49,53,56,60] },// Db F Ab C
    { name:'D7',         feel:'Bright pull',     role:'C is the ♭7 — restless, it wants to move somewhere new.', notes:[50,54,57,60] },// D F# A C
  ]
};

/* Negative-Harmony Mirror toy (in C · axis C–G, the mirror sits between E♭ and E).
   Reflection: m(pitch-class) = (7 − pc) mod 12. o = original midi, m = mirrored midi. */
const JU_MIRROR = {
  axis:'C major · mirrored around the C–G axis — the plane sits between E♭ and E',
  pads:[
    { label:'I → i',        name:'C major → C minor', feel:'home, reflected into shadow',            o:[48,52,55],    m:[48,51,55] },
    { label:'V7 → iv6',     name:'G7 → Fm6',          feel:'the perfect cadence becomes a minor hug', o:[55,59,62,65], m:[53,56,60,62] },
    { label:'V → iv',       name:'G → F minor',       feel:'arrival becomes sinking',                 o:[55,59,62],    m:[53,56,60] },
    { label:'IV → v',       name:'F → G minor',       feel:'the amen turns wistful',                  o:[53,57,60],    m:[55,58,62] },
    { label:'ii → ♭VII',    name:'Dm → B♭ major',     feel:'sorrow flips to warm light',              o:[50,53,57],    m:[46,50,53] },
    { label:'vi → ♭III',    name:'Am → E♭ major',     feel:'the minor gains a golden twin',           o:[57,60,64],    m:[51,55,58] },
  ]
};

/* The 11-module spine. n:0 is the intro. Modules 1 & 3 carry toys. links = watch-on-YouTube (timestamped). */
const JACOB_MODULES = [
  { n:0, title:'Feeling First', kicker:'Start here',
    idea:'Jacob’s whole approach turns the usual order around: <b>feel the sound first, name the theory second</b>. What you’re drawn to is your compass, and creativity is mostly <b>recombining</b> what you love — not inventing from nothing. Everything here is harmony as <i>emotion</i>.',
    harp:'Throughout this universe, trust your ear at the harp before the labels. If a sound moves you, that’s reason enough to chase it.',
    links:[ {label:'WIRED · 5 Levels of Harmony', url:'https://youtu.be/eRkgK4jfi6M'} ] },

  { n:1, title:'One Note, Many Chords', kicker:'Interactive', toy:'oneNote',
    idea:'A single note has <b>no fixed feeling</b>. The chord underneath decides whether it’s home, tender, warm or restless. Hold one note steady, change the harmony beneath it, and the very same note <b>changes colour</b>. This is the heart of Jacob’s harmony.',
    harp:'Hold one string ringing and move the chord beneath it — the note recolours without you replaying it. Try it below.',
    links:[ {label:'Mexico City · “same note, different chord” (8:10)', url:'https://youtu.be/eVkaNI17ZoI?t=490'},
            {label:'Emotional Playground · “the many D’s” (5:47)', url:'https://youtu.be/KTHrECsMm2w?t=347'} ] },

  { n:2, title:'Light & Dark', kicker:'Brightness', toy:'arrivals',
    idea:'The circle of fifths is a <b>brightness dial</b>: step toward the sharps and “the sun comes out”; toward the flats and it goes in. And where you <b>arrive from</b> colours the feeling as much as where you land — F major after C feels bright, after D it feels like a cloud.',
    harp:'Brightness is how many levers you’ve raised — the sharp-side keys literally sound brighter. Explore it on the Circle of Fifths tool.',
    links:[ {label:'GRAMMY U · context flips the feeling (57:30)', url:'https://youtu.be/VUmLhOXUcqU?t=3450'} ] },

  { n:3, title:'Major = 5ths, Minor = 4ths', kicker:'Negative harmony', toy:'mirror',
    idea:'Jacob’s pet duality: stack <b>fifths</b> and a chord opens and brightens (major); stack <b>fourths</b> and it sinks and deepens (minor). Minor is major <b>reflected</b> — this is <b>negative harmony</b> (from Ernst Levy’s book, which Jacob made famous): mirror every note around the axis <b>between the tonic and dominant</b>, and every chord gains a twin with equal gravity — “it converts everything perfect to plagal.” The leading tone that rises becomes a ♭6 that sinks.',
    harp:'Try the mirror below — each chord plays, then its reflection. On your E♭-tuned harp every one of these mirrors is reachable without a single retune.',
    note:'The lineage: Hugo Riemann’s harmonic <b>dualism</b> (1893) → Ernst Levy’s <b>polarity</b> → Steve Coleman, who <b>coined “negative harmony”</b> → Barak Schmool, who taught it to Jacob at the Royal Academy. Read the roots in <i>Deeper study</i> below.',
    lessons:[
      { kick:'Learn', h:'Two families, one mirror',
        body:'Major and minor aren’t opposites by accident — they’re <b>reflections</b>. Stack pure <b>fifths</b> upward (C–G–D–A…) and the sound opens and brightens: the major, “overtone” world nature hands you in every ringing string. Stack <b>fourths</b> the other way (C–F–B♭…) and it sinks and darkens: the minor, “undertone” world. In 1893 Hugo Riemann called this <b>dualism</b> — minor is major turned upside-down.',
        harp:'Walk C–G–D–A up the strings, then C–F–B♭ down. Same harp, two gravities — you can feel the opening and the sinking under your fingers before you name either one.' },
      { kick:'Learn', h:'Where the mirror stands',
        body:'To reflect a chord you need an <b>axis</b> — and it does <i>not</i> sit on the tonic. It sits <b>halfway between the tonic and its dominant</b>. In C (tonic C, dominant G) the mirror line runs between <b>E♭ and E</b>. Every note flips to its partner across that line: C↔G, D↔F, E↔E♭, B↔A♭, and so on. A note a certain distance <i>above</i> the axis lands the same distance <i>below</i> it.',
        harp:'Find the pair on your strings: put a finger on E, another on E♭ — the mirror sits between them. Now C reflects to G, D reflects to F. Seeing the axis on the strings is half of understanding it.' },
      { kick:'Learn', h:'Every chord gets a twin',
        body:'Reflect a whole chord and you get its <b>negative</b> — a twin with equal gravity but the opposite light. C major (C–E–G) mirrors to F–A♭–C, an <b>F minor</b> chord. The dominant <b>G7</b> becomes <b>Fm6</b>; the bright <b>perfect cadence</b> V→I becomes a shadowy <b>plagal</b> one — as Jacob says, negative harmony “converts everything perfect to plagal.” The leading tone that used to <b>rise</b> into the tonic becomes a ♭6 that <b>sinks</b> into it.',
        harp:'This is where the Mirror toy comes in — each cadence plays, then its reflection. On an E♭-tuned harp every mirror here is reachable with no retune.' },
      { kick:'Roots', h:'How it reached Jacob',
        body:'None of this is new — it’s a 130-year-old idea, rediscovered. Riemann formalised the dualism; <b>Ernst Levy</b> built a whole <i>Theory of Harmony</i> on the axis (its full text is free in <i>Deeper study</i>); <b>Steve Coleman</b> coined the actual phrase “negative harmony”; and <b>Barak Schmool</b> taught it to a teenaged Jacob at the Royal Academy. Jacob’s gift was to make it <b>audible — and emotional</b> — to millions.',
        harp:'When you play a negative twin, chase the <b>feeling</b>, not the label — that’s Jacob’s whole point. The theory is only the map; your ear is the territory.' },
    ],
    links:[ {label:'June Lee · negative harmony, the famous passage (1:36)', url:'https://youtu.be/DnBr070vcNE?t=96'},
            {label:'Qwest · major=5ths, minor=4ths (4:05)', url:'https://youtu.be/mLJVvjqMjbo?t=245'} ] },

  { n:4, title:'Give Every Note Somewhere to Go', kicker:'Tendency',
    idea:'There are <b>no wrong notes</b> — only notes that haven’t found their resolution yet. Any “illegal” note works if it <b>leans somewhere</b>. And sometimes the most beautiful move is the opposite: <b>leaving notes out</b> until only the skeleton glows.',
    harp:'Add a spicy string only when the next chord gives it an exit; and remember sus / open voicings ring gorgeously on the harp.',
    links:[ {label:'Qwest · “every note has a place to go” (5:48)', url:'https://youtu.be/mLJVvjqMjbo?t=348'},
            {label:'Mexico City · “you can add that note” (12:50)', url:'https://youtu.be/eVkaNI17ZoI?t=770'} ] },

  { n:5, title:'Voicings & Inversions', kicker:'Same notes, new world',
    idea:'Same notes, different <b>order</b>, different world. An inversion, a wider spread, or a single <b>minor-9th rub</b> turns a plain chord into something that shimmers. You can even stack a bright triad over a dominant — two gravities at once.',
    harp:'Re-stack the same strings — root, 1st, 2nd inversion — and hear the feeling flip; the 6/4 sounds “at home, but not home”.',
    links:[ {label:'Emotional Playground · voicing order (38:50)', url:'https://youtu.be/KTHrECsMm2w?t=2330'},
            {label:'Qwest · inversions as emotion (1:11)', url:'https://youtu.be/mLJVvjqMjbo?t=71'} ] },

  { n:6, title:'Reharmonization', kicker:'Recolour a song', toy:'reharm',
    idea:'Take a song you know and <b>“destruction-test”</b> it: a strong tune survives being completely rebuilt. Pivot on a shared note, <b>change the context instead of the chord</b>, and find a dozen new emotional routes home.',
    harp:'Reharmonise a simple tune (Amazing Grace, Happy Birthday) with lever flips while the melody string stays put.',
    links:[ {label:'GRAMMY U · reharmonising Happy Birthday (6:00)', url:'https://youtu.be/VUmLhOXUcqU?t=360'},
            {label:'Mexico City · “change the context, not the chord”', url:'https://youtu.be/eVkaNI17ZoI?t=4020'} ] },

  { n:7, title:'Harmony from Nature', kicker:'The overtone series',
    idea:'Harmony isn’t invented — it’s <b>discovered</b> in the overtone series hiding inside every note. A pure fifth sits low in that series, which is why it sounds so stable. “In tune” (just) and the piano’s tempered tuning are subtly different worlds.',
    harp:'Sound a string’s natural harmonics and you’ll hear the chord nature already put there — this deepens our Science of Sound unit.',
    note:'This is old, deep ground: Riemann derived minor from an <b>undertone</b> series, Partch rebuilt music on the pure ratios of the harmonic series. Both are free to read in <i>Deeper study</i>.',
    links:[ {label:'Qwest · harmonics & temperament (17:48)', url:'https://youtu.be/mLJVvjqMjbo?t=1068'},
            {label:'Whitacre · “Cloudburst = the overtone series” (43:56)', url:'https://youtu.be/sNCNFm17McA?t=2636'} ] },

  { n:8, title:'Beyond the 12 Notes', kicker:'Microtonality · candid',
    idea:'Jacob’s signature move is the note <b>between</b> the notes — modulating to a key a <b>quarter-tone</b> away (his Moon River does exactly this). Honestly: a lever harp lives in 12 notes and <b>can’t bend pitch</b> there. So this one is for your <b>ear and your voice</b>.',
    harp:'Candid truth: the diatonic harp can’t play these in-between notes. Train your ear to hear them, and sing them — that’s where they live.',
    note:'Want the real theory? The <b>cents</b>, the pure ratios, the quarter- and eighth-tones are laid out in an openly-licensed chapter (CC BY, Justin Rubin) linked in <i>Go deeper</i> — legal to learn from, in plain language.',
    links:[ {label:'Mexico City · Moon River half-sharp key (~1:29)', url:'https://youtu.be/eVkaNI17ZoI?t=5340'},
            {label:'GRAMMY U · the key “between” the piano (38:08)', url:'https://youtu.be/VUmLhOXUcqU?t=2288'} ] },

  { n:9, title:'Groove & the Pocket', kicker:'Time as feel',
    idea:'Feel beats time. Jacob points to <b>J Dilla turning quantise OFF</b> — the tiny human imperfections, the notes pushed and dragged, are where the <b>soul</b> lives. A grid-perfect groove can feel dead.',
    harp:'Play a repeating pattern slightly off the grid and let it breathe — use the Rhythm engine to find the pocket, then loosen it.',
    links:[ {label:'Qwest · J Dilla & quantise off (22:31)', url:'https://youtu.be/mLJVvjqMjbo?t=1351'} ] },

  { n:10, title:'The Audience Choir & Mindset', kicker:'Play & courage',
    idea:'Jacob conducts a whole crowd into rich, chromatic chords with nothing but <b>gestures</b> — harmony as a social act. And he treats creativity as <b>play</b>: start from a “golden brick” of two chords, fail faster, and try to write something <b>dishonest</b> — you’ll end up honest anyway.',
    harp:'Start a piece from a tiny “golden brick” (two chords you love) and let it grow; play with a friend and trade the lead.',
    links:[ {label:'GRAMMY U · conducting the audience choir (19:43)', url:'https://youtu.be/VUmLhOXUcqU?t=1183'},
            {label:'Whitacre · the “golden brick” seed (9:11)', url:'https://youtu.be/sNCNFm17McA?t=551'} ] },
];

/* Toy: Arrivals — the same chord feels different depending on where you arrive FROM (GRAMMY U, 57:30) */
const JU_ARRIVALS = {
  pads:[
    { label:'F, from C',   name:'C → F',    feel:'☀ The sun comes out',   role:'Arriving from the bright side — F opens like a window.',      a:[48,52,55],    b:[53,57,60] },
    { label:'F, from Dm',  name:'Dm → F',   feel:'☁ The sun goes in',     role:'The very same F — but from D minor it clouds over.',          a:[50,53,57],    b:[53,57,60] },
    { label:'C, from G7',  name:'G7 → C',   feel:'Firm arrival',          role:'The perfect cadence — you walk in the front door.',           a:[55,59,62,65], b:[48,52,55,60] },
    { label:'C, from Fm6', name:'Fm6 → C',  feel:'The mirror hug',        role:'The negative-harmony arrival — home reached by moonlight.',   a:[53,56,60,62], b:[48,52,55,60] },
  ]
};

/* Toy: Reharm Lab — Amazing Grace, recoloured in three escalating levels (destruction-test a strong tune) */
const JU_REHARM = {
  melody:'Amazing Grace — the opening phrase, in C',
  levels:[
    { label:'Level 1 · Home', desc:'Plain truth: I and IV and V. The tune stands on solid ground.',
      steps:[ {mel:67,ch:[48,52,55]}, {mel:72,ch:[48,52,55]}, {mel:76,ch:[53,57,60]}, {mel:74,ch:[55,59,62]}, {mel:72,ch:[48,52,55]} ] },
    { label:'Level 2 · Colour', desc:'Inversions and sevenths — the bass starts to sing its own line.',
      steps:[ {mel:67,ch:[52,55,60]}, {mel:72,ch:[45,52,55,60]}, {mel:76,ch:[53,57,60,64]}, {mel:74,ch:[55,59,62,65]}, {mel:72,ch:[48,52,55,62]} ] },
    { label:'Level 3 · Jacob', desc:'“Illegal” beauty — lush extensions, a borrowed chord, the far side of the circle.',
      steps:[ {mel:67,ch:[48,52,59,62]}, {mel:72,ch:[45,55,60,64]}, {mel:76,ch:[41,48,57,59]}, {mel:74,ch:[44,51,56,62]}, {mel:72,ch:[48,55,62,64]} ] },
  ]
};

/* Check-your-understanding — two questions per module (rendered under each module) */
const JACOB_QUIZ = {
  0:[ {q:'What comes first in Jacob’s approach — the feeling or the theory label?', a:'The feeling. Name what a sound does to you first; the label is just an interface for your own brain.'},
      {q:'Where does originality come from, in his view?', a:'Recombining what you love — “you don’t reinvent, you recombine.”'} ],
  1:[ {q:'Why does the same note feel different over different chords?', a:'Its role changes — root, 3rd, 7th — and with it the tension. Harmonic context, not the note, carries the feeling.'},
      {q:'What is the harp version of this experiment?', a:'Hold one string ringing and change the chord beneath it — the note recolours without being replayed.'} ],
  2:[ {q:'Which way is “brighter” on the circle of fifths?', a:'Toward the sharps (clockwise). Toward the flats, the sun goes in.'},
      {q:'Why can the SAME chord feel sunny once and clouded another time?', a:'Because of where you arrive from — the approach chord sets the light.'} ],
  3:[ {q:'Where does the negative-harmony mirror axis sit?', a:'Midway between the tonic and dominant — in C, between E♭ and E.'},
      {q:'What does G7 become when mirrored in C — and what happens to the cadence?', a:'Fm6 — the perfect cadence becomes a minor-plagal one with equal gravity.'} ],
  4:[ {q:'When is a “wrong” note right?', a:'When it has somewhere to go — any tension works if it resolves.'},
      {q:'What did Herbie Hancock learn from “butter notes”?', a:'To leave out the obvious notes (3rd and 7th) — space itself becomes the colour.'} ],
  5:[ {q:'Same notes, different order — what changes?', a:'Everything: register and spacing decide the emotion. A minor 9th placed on purpose is “longing”.'},
      {q:'What is a stacked tonality?', a:'A bright triad floated over another root (E over G7) — two gravities heard at once.'} ],
  6:[ {q:'What is the “destruction test”?', a:'A strong song survives being completely reharmonised — rebuild it and it still sings.'},
      {q:'What is Jacob’s favourite reharm secret?', a:'Change the context, not the chord — keep the note, recolour everything beneath it.'} ],
  7:[ {q:'Why does a fifth sound so stable?', a:'It sits low in the overtone series — nature tuned it into every string.'},
      {q:'What is “just” intonation?', a:'Tuning to the pure ratios of the harmonic series — beatless thirds ~14 cents from the piano’s.'} ],
  8:[ {q:'Can a lever harp play Jacob’s in-between notes?', a:'No — levers move in half steps. These notes live in your voice and your ear; train them by listening.'},
      {q:'What happens in his Moon River?', a:'The whole song lifts into a key a quarter-tone away — a place “between the piano keys”.'} ],
  9:[ {q:'Why did J Dilla turn quantise OFF?', a:'The grid kills soul — the push and drag of human timing IS the groove.'},
      {q:'How do you practise the pocket on a harp?', a:'Loop a small pattern with the rhythm engine, then let it breathe slightly off the grid.'} ],
  10:[ {q:'What is a “golden brick”?', a:'A tiny seed — a couple of chords — that carries the DNA of a whole piece.'},
       {q:'What happens when you try to write something dishonest?', a:'You fail — “you end up being honest, you can’t help it.” So start anywhere.'} ],
};

/* ============================================================
   GO DEEPER — curated per-module resources (2nd web scan).
   Everything is a LINK-OUT to the original author, with attribution.
   k: watch (video) · read (article/essay) · book (free/public-domain text) · tool (free interactive)
   ============================================================ */
const JACOB_DEEPER = {
  0:[ {k:'watch', label:'WIRED · Jacob answers music-theory questions from Twitter', by:'WIRED', url:'https://www.youtube.com/watch?v=hyXCWYqpId4'},
      {k:'read',  label:'The Language of Harmony', by:'NPR · TED Radio Hour', url:'https://www.npr.org/programs/ted-radio-hour/1105496499/jacob-collier-the-language-of-harmony'} ],
  3:[ {k:'watch', label:'The Music Theory of Jacob Collier', by:'Adam Neely', url:'https://www.youtube.com/watch?v=TYuTE_1jvvE'},
      {k:'watch', label:'Negative Harmony: Riemann, Geometry & Jacob Collier', by:'Adam Neely', url:'https://www.youtube.com/watch?v=q1t173iSqMk'},
      {k:'book',  label:'A Theory of Harmony (the book Jacob revived) — full text', by:'Ernst Levy · Internet Archive', url:'https://archive.org/details/ErnstLevySiegmundLevarieATheoryOfHarmony'},
      {k:'read',  label:'Symmetrical Movement Concept — where the term was coined', by:'Steve Coleman · m-base.com', url:'http://m-base.com/essays/symmetrical-movement-concept/'},
      {k:'read',  label:'Negative harmony: the Levy legacy (myth-busting)', by:'Jazzmodes', url:'https://jazzmodes.wordpress.com/2017/09/20/negative-harmony-part-3-the-levy-legacy/'},
      {k:'tool',  label:'Mirror any chord — Negative Harmony Calculator', by:'Forrest Balman', url:'https://forrestbalman.github.io/negative-harmony-calculator/'},
      {k:'tool',  label:'Harmopark — generate the negative of a progression', by:'harmopark.app', url:'https://www.harmopark.app/'} ],
  5:[ {k:'watch', label:'Why does this voicing feel so good?', by:'June Lee', url:'https://www.youtube.com/watch?v=MmI1Bfxr_vA'} ],
  6:[ {k:'watch', label:'Reharmonizing hacks using EASY chords', by:'Aimee Nolte', url:'https://www.youtube.com/watch?v=w82U_vkBN-4'},
      {k:'read',  label:'A Study in Reharmonization (Collier PhD, 2025)', by:'Chris Bandy · OhioLINK', url:'https://etd.ohiolink.edu/acprod/odb_etd/r/etd/search/10?p10_accession_num=kent1743091156028498'} ],
  7:[ {k:'book',  label:'Harmonic dualism & the undertone series (1893)', by:'Hugo Riemann · IMSLP (public domain)', url:'https://imslp.org/wiki/Vereinfachte_Harmonielehre_(Riemann,_Hugo)'},
      {k:'book',  label:'Genesis of a Music — just intonation, from the ground up', by:'Harry Partch · Internet Archive', url:'https://archive.org/details/genesisofmusicac0000part'} ],
  8:[ {k:'watch', label:'How Jacob Collier uses microtonality & temperament', by:'Nahre Sol', url:'https://www.youtube.com/watch?v=NHC2XNGerW4'},
      {k:'read',  label:'Jacob Collier’s four magical chords (the G½♯ modulation)', by:'Ethan Hein', url:'https://www.ethanhein.com/wp/2019/jacob-colliers-four-magical-chords/'},
      {k:'read',  label:'Microtonality — the theory, adaptable & free (CC BY)', by:'Justin Rubin · UMN Open', url:'https://open.lib.umn.edu/musiccomposition/chapter/microtonality/'},
      {k:'read',  label:'“A deliberate effort to break my perfect pitch open”', by:'Jacob Collier · MusicTech', url:'https://musictech.com/news/music/jacob-collier-microtonality-deliberate-effort-break-perfect-pitch-open/'} ],
  10:[ {k:'tool', label:'Jacob Collier Audience Choir — free instrument', by:'Native Instruments', url:'https://www.native-instruments.com/en/products/komplete/vocal/jacob-collier-audience-choir/'} ],
};

/* ============================================================
   DEEPER STUDY — the library behind Jacob's Universe.
   Public-domain & free-to-read roots + the best breakdowns & tools.
   Shown on the hub. Distilled in our own words; links go to the source.
   ============================================================ */
const JACOB_LIBRARY = {
  intro:'The roots of Jacob’s thinking — free, public-domain and openly-licensed sources you can read, watch and play with. We teach these ideas in our own words; every link goes to its original author.',
  groups:[
    { t:'Foundational texts · free to read', items:[
      {k:'book', label:'A Theory of Harmony', by:'Ernst Levy — full text on Internet Archive', url:'https://archive.org/details/ErnstLevySiegmundLevarieATheoryOfHarmony'},
      {k:'read', label:'Symmetrical Movement Concept', by:'Steve Coleman — who coined “negative harmony”', url:'http://m-base.com/essays/symmetrical-movement-concept/'},
      {k:'book', label:'Harmonic dualism (1893)', by:'Hugo Riemann — public domain, IMSLP', url:'https://imslp.org/wiki/Vereinfachte_Harmonielehre_(Riemann,_Hugo)'},
      {k:'book', label:'Genesis of a Music', by:'Harry Partch — just intonation', url:'https://archive.org/details/genesisofmusicac0000part'} ]},
    { t:'Learn the theory · video', items:[
      {k:'watch', label:'The Music Theory of Jacob Collier', by:'Adam Neely', url:'https://www.youtube.com/watch?v=TYuTE_1jvvE'},
      {k:'watch', label:'Negative Harmony: Riemann, Geometry & Collier', by:'Adam Neely', url:'https://www.youtube.com/watch?v=q1t173iSqMk'},
      {k:'watch', label:'Microtonality & temperament', by:'Nahre Sol', url:'https://www.youtube.com/watch?v=NHC2XNGerW4'},
      {k:'watch', label:'Reharmonizing hacks using easy chords', by:'Aimee Nolte', url:'https://www.youtube.com/watch?v=w82U_vkBN-4'} ]},
    { t:'Read deeper · articles', items:[
      {k:'read', label:'Negative harmony: the Levy legacy', by:'Jazzmodes — myth-busting', url:'https://jazzmodes.wordpress.com/2017/09/20/negative-harmony-part-3-the-levy-legacy/'},
      {k:'read', label:'Jacob Collier’s four magical chords', by:'Ethan Hein', url:'https://www.ethanhein.com/wp/2019/jacob-colliers-four-magical-chords/'},
      {k:'read', label:'The Master of Microtones', by:'Jamie Xu', url:'https://jamiesxu.medium.com/jacob-collier-the-master-of-microtones-e0680fb1589a'},
      {k:'read', label:'Microtonality (openly licensed, CC BY)', by:'Justin Rubin · UMN Open', url:'https://open.lib.umn.edu/musiccomposition/chapter/microtonality/'} ]},
    { t:'Play with it · free tools', items:[
      {k:'tool', label:'Negative Harmony Calculator', by:'Forrest Balman', url:'https://forrestbalman.github.io/negative-harmony-calculator/'},
      {k:'tool', label:'Harmopark — harmonic-table playground', by:'harmopark.app', url:'https://www.harmopark.app/'},
      {k:'tool', label:'Audience Choir — free instrument', by:'Native Instruments', url:'https://www.native-instruments.com/en/products/komplete/vocal/jacob-collier-audience-choir/'} ]},
  ]
};
