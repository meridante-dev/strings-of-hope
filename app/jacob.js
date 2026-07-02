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

/* The 11-module spine. n:0 is the intro. Module 1 carries the toy. links = watch-on-YouTube (timestamped). */
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

  { n:2, title:'Light & Dark', kicker:'Brightness',
    idea:'The circle of fifths is a <b>brightness dial</b>: step toward the sharps and “the sun comes out”; toward the flats and it goes in. And where you <b>arrive from</b> colours the feeling as much as where you land — F major after C feels bright, after D it feels like a cloud.',
    harp:'Brightness is how many levers you’ve raised — the sharp-side keys literally sound brighter. Explore it on the Circle of Fifths tool.',
    links:[ {label:'GRAMMY U · context flips the feeling (57:30)', url:'https://youtu.be/VUmLhOXUcqU?t=3450'} ] },

  { n:3, title:'Major = 5ths, Minor = 4ths', kicker:'Negative harmony',
    idea:'Jacob’s pet duality: stack <b>fifths</b> and a chord opens and brightens (major); stack <b>fourths</b> and it sinks and deepens (minor). Minor is major <b>reflected</b> — the seed of <b>negative harmony</b>, where you mirror a progression around its centre.',
    harp:'Walk a run in stacked fifths, then in stacked fourths, and feel the mirror flip from sunlight to shadow.',
    links:[ {label:'Qwest · major=5ths, minor=4ths (4:05)', url:'https://youtu.be/mLJVvjqMjbo?t=245'},
            {label:'“Super-ultra-hyper-mega-meta” brightness', url:'https://youtu.be/MLunr5WL0kc'} ] },

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

  { n:6, title:'Reharmonization', kicker:'Recolour a song',
    idea:'Take a song you know and <b>“destruction-test”</b> it: a strong tune survives being completely rebuilt. Pivot on a shared note, <b>change the context instead of the chord</b>, and find a dozen new emotional routes home.',
    harp:'Reharmonise a simple tune (Amazing Grace, Happy Birthday) with lever flips while the melody string stays put.',
    links:[ {label:'GRAMMY U · reharmonising Happy Birthday (6:00)', url:'https://youtu.be/VUmLhOXUcqU?t=360'},
            {label:'Mexico City · “change the context, not the chord”', url:'https://youtu.be/eVkaNI17ZoI?t=4020'} ] },

  { n:7, title:'Harmony from Nature', kicker:'The overtone series',
    idea:'Harmony isn’t invented — it’s <b>discovered</b> in the overtone series hiding inside every note. A pure fifth sits low in that series, which is why it sounds so stable. “In tune” (just) and the piano’s tempered tuning are subtly different worlds.',
    harp:'Sound a string’s natural harmonics and you’ll hear the chord nature already put there — this deepens our Science of Sound unit.',
    links:[ {label:'Qwest · harmonics & temperament (17:48)', url:'https://youtu.be/mLJVvjqMjbo?t=1068'},
            {label:'Whitacre · “Cloudburst = the overtone series” (43:56)', url:'https://youtu.be/sNCNFm17McA?t=2636'} ] },

  { n:8, title:'Beyond the 12 Notes', kicker:'Microtonality · candid',
    idea:'Jacob’s signature move is the note <b>between</b> the notes — modulating to a key a <b>quarter-tone</b> away (his Moon River does exactly this). Honestly: a lever harp lives in 12 notes and <b>can’t bend pitch</b> there. So this one is for your <b>ear and your voice</b>.',
    harp:'Candid truth: the diatonic harp can’t play these in-between notes. Train your ear to hear them, and sing them — that’s where they live.',
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
