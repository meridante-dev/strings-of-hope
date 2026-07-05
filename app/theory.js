/* ============================================================
   Strings of Hope — Music Theory course
   A six-unit curriculum adapted from
   "Music Theory for the 21st-Century Classroom" by Robert Hutchinson
   (University of Puget Sound, GFDL), "Understanding Basic Music Theory" by
   Catherine Schmidt-Jones (CC BY-SA 4.0), and "Open Music Theory," v.2
   (ed. Gotham, Gullings, Hamm, Hughes, Jarvis, Lavengood & Peterson; CC BY-SA 4.0).

   Every lesson carries a `harp` note mapping the concept to the LEVER HARP.
   Every chapter carries a `quiz` (check-your-understanding Q&A).
   Foundational lessons carry a `staff` (VexFlow EasyScore notation).
   ============================================================ */

const THEORY_SOURCE = 'Adapted from “Music Theory for the 21st-Century Classroom” by Robert Hutchinson (GFDL) and “Understanding Basic Music Theory” by Catherine Schmidt-Jones (CC BY-SA 4.0).';

/* visual:'keyboard' draws a one-octave keyboard. staff:{clef,key,notes} draws notation.
   harp: the lever-harp mapping. action:{label,view} links to a tool. quiz:[{q,a}] per chapter. */
const THEORY_COURSE = [
  /* ===================== SEMESTER 1 — FUNDAMENTALS ===================== */
  { sem:1, title:'Fundamentals', sub:'Reading & writing music', chapters:[
    { n:1, title:'Basic Concepts', quiz:[
        {q:'How many letter names does the musical alphabet use before repeating?', a:'Seven — A B C D E F G — then it starts again an octave higher.'},
        {q:'What does a sharp (♯) do to a pitch, and how does a lever harp produce one?', a:'It raises the pitch a half step. On a lever harp you engage that string’s lever, which shortens it a half step.'},
        {q:'Name the two names for the black key between C and D.', a:'C♯ and D♭ — they are enharmonic (same sound, different spelling).'},
      ], lessons:[
      { h:'Pitch & the keyboard', body:'<b>Pitch</b> is how high or low a note sounds. On a piano’s 88 keys, notes to the right sound higher, notes to the left lower. The note names use only seven letters — <b>A B C D E F G</b> — then repeat. That repeating set is the “musical alphabet.”', visual:'keyboard',
        harp:'On your harp the same seven letters climb string by string — longest strings lowest, shortest highest. Most lever harps colour <b>C strings red</b> and <b>F strings blue/black</b> so your eye finds its place instantly, the way a pianist uses the groups of black keys.',
        action:{label:'Tune your harp →', view:'tuner'} },
      { h:'The staff & clefs', body:'Notes are written on a five-line <b>staff</b>. A <b>clef</b> fixes the lines to pitches. <b>Treble clef</b> lines are E-G-B-D-F, spaces F-A-C-E. <b>Bass clef</b> lines are G-B-D-F-A, spaces A-C-E-G. Joined by a brace they make the <b>grand staff</b> of piano music.',
        harp:'Harp music is written on the <b>same grand staff</b> as piano — right hand reads treble, left hand reads bass. Middle C (the red string nearest the middle) is your anchor between the two staves, exactly as it is for a pianist.' },
      { h:'Octave registers', body:'The same letter repeats in higher and lower <b>octaves</b>. We number them: <b>C4</b> is “middle C,” the reference point. The register number changes after B (B4 is followed by C5). On the harp this is your map up and down the strings.',
        harp:'Count octaves by the <b>red C strings</b>: each red string starts a new register. A 34-string lever harp spans about <b>C1 to A6</b> — roughly five octaves — so finding “C4” means finding the right red string, not just any C.' },
      { h:'Accidentals', body:'<b>Accidentals</b> raise or lower a note. <b>♯ sharp</b> raises a half step; <b>♭ flat</b> lowers a half step; <b>𝄪 / 𝄫</b> move a whole step; <b>♮ natural</b> cancels them. Raising a string a half step is exactly what a harp lever does.',
        harp:'This is the <b>defining fact of the lever harp</b>: a lever only ever <b>raises</b> its string a half step. So if a string is tuned to E♭, its lever gives you E♮; tuned to E♮, the lever gives E♯ (=F). You get sharps by flipping up — you never get a flat below the string’s tuned pitch without retuning.',
        action:{label:'See your levers →', view:'levers'} },
      { h:'Enharmonic notes', body:'C♯ and D♭ sound identical but are spelled differently — these are <b>enharmonic</b> notes. Every black key has two names (C♯=D♭, F♯=G♭…), and even white keys can be respelled. Spelling depends on the key you’re in.',
        harp:'A lever gives you the <b>raised</b> spelling. Engaging the F lever physically produces F♯ — but if the music asks for G♭, that very same string and sound is your only option. On a lever harp you choose the <b>pitch</b>; the page chooses the <b>spelling</b>.' },
    ]},
    { n:2, title:'Major Scales & Keys', quiz:[
        {q:'Spell the step pattern of a major scale.', a:'W–W–H–W–W–W–H (whole, whole, half, whole, whole, whole, half).'},
        {q:'In what order are sharps added to key signatures?', a:'F–C–G–D–A–E–B (flats are the reverse: B–E–A–D–G–C–F).'},
        {q:'If your harp is tuned to E♭ major (all levers down), how do you get to B♭ major?', a:'Raise the A strings (engage the A levers). E♭ major has B♭, E♭, A♭; B♭ major has only B♭, E♭ — so you naturalise the A♭→A♮. One lever bank and you’re in B♭, the next key clockwise on the circle of fifths.'},
      ], lessons:[
      { h:'Half steps & whole steps', body:'A <b>half step</b> is the distance to the very next key. A <b>whole step</b> is two half steps. These two distances are the building blocks of every scale.', visual:'keyboard',
        harp:'On the harp a half step isn’t an adjacent string — it’s <b>one string with its lever engaged</b>. Adjacent strings are already a whole or half step apart depending on where you are in the scale, because the strings are tuned diatonically, not chromatically like piano keys.' },
      { h:'The major scale', body:'A <b>major scale</b> is a fixed pattern of steps: <b>W–W–H–W–W–W–H</b>. Think of it as two matching four-note halves (tetrachords) joined by a whole step. Every major scale uses each letter once, in order — so D major is D-E-F♯-G-A-B-C♯.',
        staff:{clef:'treble', key:'C', notes:'C4/8, D4, E4, F4, G4, A4, B4, C5'},
        harp:'Set the right levers and a major scale becomes a <b>glissando</b> — sweep your fingernail across the open strings and the scale rings out. That single gesture is the lever harp’s signature sound, and it only works because you pre-set the key with the levers.' },
      { h:'Major key signatures', body:'Rather than write the same sharps or flats repeatedly, we collect them into a <b>key signature</b>. Sharps are added F-C-G-D-A-E-B; flats in reverse. The <b>circle of fifths</b> orders the keys: clockwise adds a sharp, counter-clockwise adds a flat.',
        harp:'A key signature is a <b>lever recipe</b>. Tuned to E♭ (3 flats), all-levers-down already gives you E♭ major. Each clockwise key on the circle just adds one more lever to engage. Pre-set that recipe before you play and the whole piece sits under your hands.',
        action:{label:'Open the Modes wheel →', view:'modes'} },
    ]},
    { n:3, title:'Minor Scales & Keys', quiz:[
        {q:'What note does harmonic minor raise compared with natural minor, and why?', a:'The 7th — to create a leading tone that pulls strongly up to the tonic for a stronger cadence.'},
        {q:'What is the relative minor of C major?', a:'A minor — it shares the same key signature (no sharps or flats), starting a minor third lower.'},
        {q:'Why is the raised 7th of harmonic minor awkward on a lever harp in a fast passage?', a:'It needs a lever flipped mid-piece by a free hand; many harpists pre-set it or rework the passage, since you can’t change it instantly like a pedal.'},
      ], lessons:[
      { h:'The three minor scales', body:'Minor comes in three flavours. <b>Natural minor</b>: W-H-W-W-H-W-W (the Aeolian sound). <b>Harmonic minor</b> raises the 7th for a stronger pull home (and a dramatic 1½-step leap). <b>Melodic minor</b> raises the 6th and 7th going up, and lowers them coming down.',
        harp:'Natural minor is the harpist’s friend — set the levers once and the whole scale glissandos freely. Harmonic and melodic minor need a <b>lever change mid-scale</b> for that raised 7th (and 6th), so harpists often pre-engage them or choose passages that don’t fight the open strings.' },
      { h:'Relative & parallel minor', body:'Every major key shares its key signature with a <b>relative minor</b> a minor third below (C major ↔ A minor). A <b>parallel minor</b> starts on the same note (C major ↔ C minor) but has its own signature. Relative = same notes, different home; parallel = same home, different notes.',
        harp:'Relative minor is <b>free</b> on the harp — C major and A minor use the identical lever setting, so you can drift between them with no lever changes at all. Switching to the parallel minor (C major → C minor) means re-flatting three strings: a deliberate lever reset, not a casual move.' },
      { h:'Scale-degree names', body:'Each step has a name and a job: 1 <b>tonic</b> (home), 2 supertonic, 3 mediant, 4 <b>subdominant</b>, 5 <b>dominant</b> (the pull home), 6 submediant, 7 <b>leading tone</b> (leans up to tonic). These names drive every chord you build.',
        harp:'Learn to feel these by string colour: your <b>tonic</b> is wherever you call home, the <b>dominant</b> a fifth above (a comfortable hand-span), and the <b>leading tone</b> is usually the string you’ll engage a lever on to sharpen in minor keys.' },
    ]},
    { n:4, title:'Rhythm', quiz:[
        {q:'How many eighth notes equal one whole note?', a:'Eight. (Whole = 2 halves = 4 quarters = 8 eighths = 16 sixteenths.)'},
        {q:'What does the lower number of a time signature tell you?', a:'Which note value gets one beat (4 = quarter note, 8 = eighth note).'},
        {q:'Why must a harpist plan damping into a rhythm?', a:'Strings keep ringing after they’re plucked, so a written rest only becomes silence if you place fingers/palm back on the strings to stop them.'},
      ], lessons:[
      { h:'Durations & the beat', body:'Note values divide time: a <b>whole note</b> = 2 halves = 4 quarters = 8 eighths = 16 sixteenths. A <b>dot</b> adds half of a note’s value. A <b>tie</b> joins two notes into one sustained sound; a <b>rest</b> is measured silence.',
        harp:'A harp string sustains on its own, so a <b>tie</b> is effortless — just don’t replay the string. A <b>rest</b> is the hard part: silence only happens when you <b>damp</b> (touch the ringing strings to stop them). On the harp, rhythm is as much about stopping notes as starting them.' },
      { h:'Time signatures & meter', body:'The <b>time signature</b> tells you beats per measure and which note gets the beat. <b>Simple meters</b> divide the beat in two (4/4); <b>compound meters</b> divide it in three (6/8, felt as two big beats of three). <b>Tuplets</b> like triplets borrow a different division.',
        harp:'Compound meters (6/8, 9/8) and rolling triplets are deeply harp-idiomatic — the lilting arpeggio patterns harps are loved for live naturally in those meters. Use the app’s rhythm engine to internalise the pulse before adding the notes.',
        action:{label:'Feel it with the Rhythm engine →', view:'rhythm'} },
    ]},
    { n:5, title:'Intervals', quiz:[
        {q:'How do you find the numeric size of an interval?', a:'Count letter names inclusively from the lower to the upper note (C up to G = 1-2-3-4-5 = a fifth).'},
        {q:'Which intervals come in “perfect” quality?', a:'Unisons, fourths, fifths, and octaves.'},
        {q:'How comfortably does a perfect fifth sit under one harp hand?', a:'Very comfortably — root and fifth are a natural hand-span apart, the basis of harp “open fifth” accompaniments and rolled chords.'},
      ], lessons:[
      { h:'What is an interval?', body:'An <b>interval</b> is the distance between two notes. Name it by counting letter names inclusively (C up to G = a 5th: C-D-E-F-G), then add a quality.',
        harp:'On the harp you can literally <b>see</b> intervals as string gaps. A third skips one string, a fifth skips three. Harpists learn to “read the gap” with their fingers as much as with their eyes.' },
      { h:'Quality: perfect, major, minor', body:'Unisons, 4ths, 5ths and octaves come as <b>perfect</b>. 2nds, 3rds, 6ths and 7ths come as <b>major</b> or <b>minor</b> (minor is a half step smaller). Build from the major scale of the lower note and every interval up to a scale degree is major or perfect.',
        staff:{clef:'treble', key:'C', notes:'(C4 E4)/h, (C4 G4)/h'},
        harp:'Because your strings are pre-tuned to a key, a “third” on the harp is automatically major or minor depending on <b>where</b> in the scale you play it — no lever needed. The instrument hands you the diatonic qualities for free.' },
      { h:'Augmented, diminished & inversion', body:'Widen a perfect/major interval by a half step → <b>augmented</b>; shrink it → <b>diminished</b>. <b>Inversion</b> flips the two notes: a 3rd inverts to a 6th, perfect stays perfect, major↔minor, aug↔dim (numbers add to 9).',
        harp:'Augmented and diminished intervals usually require a <b>lever</b> to bend one note out of the key — which is why chromatic harmony asks more of a lever harpist than diatonic music. Inversions, by contrast, are free: just move the lower note up an octave to the next same-letter string.' },
    ]},
    { n:6, title:'Triads', quiz:[
        {q:'What two intervals stack to make a major triad? A minor triad?', a:'Major = major 3rd + minor 3rd. Minor = minor 3rd + major 3rd.'},
        {q:'What is a slash chord like C/E?', a:'A C major triad with E (its third) in the bass — i.e. first inversion.'},
        {q:'Why are rolled (arpeggiated) triads so natural on the harp?', a:'The fingers fall on consecutive available strings; rolling them root-up is the harp’s most idiomatic way to voice a chord.'},
      ], lessons:[
      { h:'Building triads', body:'A <b>triad</b> stacks two thirds: root, third, fifth. Four qualities: <b>major</b> (M3+m3), <b>minor</b> (m3+M3), <b>diminished</b> (m3+m3), <b>augmented</b> (M3+M3). These are the harmonic colours under almost every song.',
        staff:{clef:'treble', key:'C', notes:'(C4 E4 G4)/q, (C4 Eb4 G4), (C4 Eb4 Gb4), (C4 E4 G#4)'},
        harp:'A triad is three strings with one skipped between each — a shape your hand memorises. Major and minor triads in your set key need <b>no levers</b>; the diminished and augmented colours usually need one lever to bend the 3rd or 5th.' },
      { h:'Lead-sheet symbols & inversions', body:'Pop and jazz name chords with <b>lead-sheet symbols</b>: C, Cm, C°, C+. When a note other than the root is in the bass it’s <b>inverted</b> — a slash chord (C/E). “Sus” chords replace the third for an open colour.',
        harp:'Inversions are a harpist’s secret to smooth playing: choosing C/E or C/G keeps your hand in one comfortable region instead of leaping. Sus chords (no third) are pure open strings — wonderfully resonant and lever-free.',
        action:{label:'Build chords in Scales →', view:'scales'} },
    ]},
    { n:7, title:'Roman Numerals & Cadences', quiz:[
        {q:'In a major key, which diatonic triads are minor?', a:'ii, iii, and vi (I, IV, V are major; vii° is diminished).'},
        {q:'What two chords make an authentic cadence, and which is the strongest form?', a:'V→I; the Perfect Authentic Cadence (PAC), with both chords in root position and the tonic on top.'},
        {q:'Which cadence is the “amen,” and why does it suit the harp?', a:'The plagal cadence IV→I — both chords usually sit in the open key, so it rings out with no lever changes.'},
      ], lessons:[
      { h:'Diatonic chords & Roman numerals', body:'Build a triad on each scale degree → the key’s seven <b>diatonic chords</b>. Label them with <b>Roman numerals</b> — uppercase major (I, IV, V), lowercase minor (ii, iii, vi), ° diminished (vii°). In major: I ii iii IV V vi vii°.',
        harp:'Once your levers set a key, all seven diatonic chords are available with <b>no further lever changes</b> — you just move your triad shape to different strings. This is why playing “in key” feels effortless on a lever harp and why modulating feels like work.' },
      { h:'Cadences', body:'A <b>cadence</b> is musical punctuation. <b>Authentic</b> (V→I) is a full stop; a <b>PAC</b> is strongest. <b>Half cadence</b> (…→V) is a comma. <b>Plagal</b> (IV→I) is the “amen.” <b>Deceptive</b> (V→vi) surprises. Cadences shape phrases.',
        staff:{clef:'treble', key:'C', notes:'(B3 D4 G4)/h, (C4 E4 G4)/h'},
        harp:'Practise V→I as a <b>rolled</b> cadence: arpeggiate the dominant, then settle into a fuller, lower tonic. The harp’s long sustain makes plagal and authentic cadences glow — let the final tonic ring rather than damping it.' },
    ]},
    { n:8, title:'Seventh Chords', quiz:[
        {q:'What makes the dominant seventh (V7) want to resolve?', a:'Its tritone — between the leading tone and the 7th — pulls inward: leading tone up to tonic, 7th down a step.'},
        {q:'Spell the diatonic seventh chords of C major in order.', a:'Cmaj7, Dm7, Em7, Fmaj7, G7, Am7, Bø7.'},
        {q:'How does a harpist usually voice a four-note seventh chord?', a:'Often by rolling it, or by splitting it between hands (root in the left, the upper three in the right) to keep it playable with four fingers.'},
      ], lessons:[
      { h:'Adding the seventh', body:'Stack one more third on a triad → a <b>seventh chord</b>: richer, more restless. Key types: <b>major 7th</b> (lush), <b>dominant 7th</b> (V7, wants to resolve), <b>minor 7th</b>, <b>half-diminished</b> (ø7), <b>fully diminished</b> (°7). The V7’s tritone drives music home.',
        staff:{clef:'treble', key:'C', notes:'(G3 B3 D4 F4)/w'},
        harp:'Four notes can crowd four fingers, so harpists love to <b>roll</b> seventh chords or omit the fifth (root–3rd–7th still says everything). The half- and fully-diminished sevenths almost always need a lever, since they bend notes outside your set key.' },
      { h:'Diatonic seventh chords', body:'Built on each degree of a major key: Imaj7 ii7 iii7 IVmaj7 V7 vi7 viiø7. The <b>V7</b> is the workhorse — its 3rd is the leading tone and its 7th leans down a step, both resolving into the tonic chord.',
        harp:'In your set key, all seven seventh-chords are lever-free — a whole jazz-coloured palette with no lever changes. Try a <b>ii7–V7–Imaj7</b> entirely on open strings to feel how much colour the harp gives you for free.' },
    ]},
  ]},

  /* ===================== SEMESTER 2 — HARMONY, MELODY & FORM ===================== */
  { sem:2, title:'Harmony, Melody & Form', sub:'How music moves & is shaped', chapters:[
    { n:9, title:'Harmonic Progression & Function', quiz:[
        {q:'Spell the full circle-of-fifths progression in major.', a:'I–IV–vii°–iii–vi–ii–V–I — the bass descends a fifth (or rises a fourth) each step.'},
        {q:'Name Hutchinson’s four harmonic functions.', a:'Tonic, Tonic-prolongation, Pre-dominant, and Dominant.'},
        {q:'Why does the circle-of-fifths progression feel “inevitable” on the harp?', a:'Each chord’s root is a fifth/fourth away — a fixed hand-span — so the left hand walks a repeating, predictable shape down the strings.'},
      ], lessons:[
      { h:'The circle-of-fifths progression', body:'The grand progression of tonal music moves by descending fifths: <b>I–IV–vii°–iii–vi–ii–V–I</b>. A Baroque stalwart (Bach, Handel, Vivaldi), it has a <b>feeling of inevitability</b> because the bass falls a fifth each chord — a <b>harmonic sequence</b>. You hear pieces of it everywhere, from “Fly Me to the Moon” to “I Will Survive.”',
        harp:'This is pure muscle memory on the harp: the left-hand root jumps a fixed <b>fifth-down / fourth-up</b> shape over and over. Set your key with the levers and the whole circle plays without a single lever change — a perfect harp étude.' },
      { h:'Harmonic rhythm', body:'<b>Harmonic rhythm</b> is how long each chord lasts. One chord per bar (whole-note harmonic rhythm) feels spacious; two per bar feels driving. Composers speed it up to build energy, slow it down to settle.',
        harp:'Slow harmonic rhythm is the harp’s natural home — one rich, rolled chord can ring for a whole bar while the melody floats above. When you want momentum, change the chord more often or break it into a faster arpeggiated pattern.' },
      { h:'Shorter progressions: ii–V–I & its cousins', body:'Slices of the circle run countless songs. <b>ii–V–I</b> is the heart of jazz. The four-chord <b>vi–ii–V–I</b> rotates into <b>I–vi–ii–V</b> (the “1950s progression”) and <b>ii–V–I–vi</b> (a jazz “turnaround”). Add iii → iii–vi–ii–V.',
        harp:'These four-chord loops are ideal harp practice: pick one set key, learn the four left-hand root positions, and improvise melodies on the open strings above. No levers, endless music.' },
      { h:'Harmonic function: the four families', body:'Chords sort into <b>functions</b>. <b>Tonic</b> (I): home. <b>Tonic-prolongation</b> (iii, vi): extends the tonic. <b>Pre-dominant</b> (IV, ii): builds tension. <b>Dominant</b> (V, vii°): demands resolution to I. In minor, the <b>subtonic VII</b> has one job — lead to III.',
        harp:'Hear functions as <b>distances from home</b> under your hands: tonic where you rest, pre-dominant a step of departure, dominant the leaning chord that wants to fall back. Try it over a drone in the meditation tool to feel each function’s pull.' },
      { h:'The harmonic flowchart', body:'Hutchinson’s map of motion: <b>Tonic → Tonic-Prolongation → Pre-Dominant → Dominant → Tonic</b>. The simplest journeys are <b>I–V–I</b> (the most elemental of all) and <b>I–ii–V–I / I–IV–V–I</b>. Almost every progression is a path through this flowchart.',
        harp:'Map the flowchart onto string regions once and you can <b>compose at the harp</b> without reading: leave home (pre-dominant), lean (dominant), return (tonic). The instrument becomes a map of harmonic function.' },
      { h:'The famous loops', body:'Two four-chord loops power much of popular music. The <b>“best-seller” progression</b> <b>I–V–vi–IV</b> underlies hundreds of hits. The <b>i–VII–VI–VII</b> loop gives a darker, modal, anthemic feel.',
        harp:'Both loops are lever-free in the right key and gorgeous when rolled. Set E♭ or C, learn the four roots, and you can busk almost any pop song. The i–VII–VI–VII loop is especially harp-friendly in natural-minor tunings.',
        action:{label:'Hear functions over a drone →', view:'meditation'} },
    ]},
    { n:10, title:'Non-Chord Tones', quiz:[
        {q:'How is a passing tone approached and left?', a:'By step in the same direction — it fills the gap between two chord tones.'},
        {q:'How does a suspension differ from a retardation?', a:'Both hold a note over a chord change; a suspension resolves down by step, a retardation resolves up.'},
        {q:'Why are passing and neighbor tones so natural on the harp?', a:'They’re stepwise — adjacent open strings — so they flow without any lever change.'},
      ], lessons:[
      { h:'Notes outside the chord', body:'<b>Non-chord tones</b> (NCTs) are melody notes not in the chord underneath — they create motion and beauty. Each is defined by how you <b>approach</b> and <b>leave</b> it (by step or leap).',
        harp:'On a diatonic harp, most NCTs are simply <b>the next string over</b> — they live inside your set key, so you decorate a melody freely without touching a lever.' },
      { h:'The stepwise family', body:'<b>Passing tones</b> step between two chord tones; <b>neighbor tones</b> step away and back; the <b>double neighbor</b> circles a note from both sides; the <b>incomplete neighbor</b> only steps away or only returns.',
        harp:'These are the building blocks of harp ornamentation — and of glissando runs, which are nothing but a cascade of passing tones across the open strings. Master them and your melodies stop sounding “blocky.”' },
      { h:'Suspensions, leaps & pedals', body:'A <b>suspension</b> holds a note over a chord change, then resolves down (a <b>retardation</b> up). The <b>appoggiatura</b> leaps in and steps out; the <b>escape tone</b> steps in and leaps out; the <b>anticipation</b> arrives early. A <b>pedal point</b> sustains one note while harmony changes around it.',
        harp:'<b>Pedal points are a harp superpower</b>: because strings sustain, you can let a low tonic ring (or repeat a bass string) while the harmony shifts above — a built-in drone. Suspensions, too, exploit the harp’s sustain beautifully: let the held note linger, then resolve.' },
    ]},
    { n:11, title:'Melodic Analysis', quiz:[
        {q:'What is a motive?', a:'The smallest memorable musical idea — a short fingerprint a composer reuses and transforms.'},
        {q:'Name three ways to transform a motive.', a:'Any of: inversion, retrograde, augmentation, diminution, intervallic change, ornamentation, extension, fragmentation.'},
        {q:'How can a harpist transform a motive without any lever changes?', a:'By inversion, retrograde, augmentation/diminution, or moving it to a new octave/string region — all stay within the set key.'},
      ], lessons:[
      { h:'The motive', body:'The <b>motive</b> is the smallest memorable musical idea — a fingerprint a composer reuses and transforms (Beethoven’s four-note “fate” motive). Great melodies are usually one or two motives, varied with imagination.',
        harp:'Find a two- or three-string shape you love and treat it as your motive. Because the harp lays the scale out visually, you can <b>see</b> where to move it next — the instrument is a melody-composition tool.' },
      { h:'Transforming a motive', body:'A motive can be altered by <b>inversion</b> (upside-down), <b>retrograde</b> (backwards), <b>augmentation/diminution</b> (slower/faster), <b>intervallic change</b>, <b>ornamentation</b>, <b>extension</b> and <b>fragmentation</b>.',
        harp:'Inversion on the harp is literally mirroring your finger pattern up the strings instead of down. Augmentation just means letting each string ring longer — effortless given the harp’s sustain.' },
      { h:'Subphrase & phrase', body:'Motives combine into a <b>subphrase</b> (phrase member), and subphrases into a <b>phrase</b> — a complete musical thought ending in a cadence. Hearing this layered structure is the secret to whole-feeling melodies.',
        harp:'Shape phrases with <b>dynamics and damping</b>: let a phrase grow as you climb the strings, then gently damp the bass at the cadence so the next phrase breathes. The harp rewards this kind of shaping.',
        action:{label:'Hear it in the Modes journey →', view:'learn'} },
    ]},
    { n:12, title:'Form in Popular Music', quiz:[
        {q:'What does AABA describe?', a:'A 32-bar song form — two A sections, a contrasting B (the “bridge”), then a return of A.'},
        {q:'Spell the basic 12-bar blues progression.', a:'I–I–I–I / IV–IV–I–I / V–IV–I–I (with variants).'},
        {q:'What does it mean for a section to be harmonically “open,” and how can a harp signal it?', a:'It ends on a dominant, leaning forward; a harpist can leave that V chord ringing undamped to pull the ear into the next section.'},
      ], lessons:[
      { h:'Section-based song forms', body:'Popular songs are built from labelled sections: <b>verse–chorus</b> (the modern default), the 32-bar <b>AABA</b> (the Great American Songbook), and <b>ABAC</b>. Letters mark which music returns and which is new.',
        harp:'Plan your <b>lever setting around the whole form</b>: if the bridge briefly needs an accidental, decide now whether to pre-tune it in, flip a lever between sections, or arrange around it. Form drives your lever strategy.' },
      { h:'The 12-bar blues & open/closed sections', body:'The <b>12-bar blues</b> (I–IV–I–V–IV–I) is one of the most influential forms in all of music. Sections can be harmonically <b>closed</b> (cadence home, settled) or <b>open</b> (end on a dominant, leaning forward) — how a song builds momentum.',
        harp:'The blues’ dominant-seventh colours often need a lever for the bluesy ♭7, but a plain I–IV–V blues sits comfortably on open strings. Use the harp’s sustain on the IV and V to give that lazy, rolling blues feel.' },
    ]},
    { n:13, title:'Phrases in Combination', quiz:[
        {q:'Describe the proportions of a sentence.', a:'Short basic idea, its repetition/variation, then a longer continuation to a cadence — a 1+1+2 feeling of acceleration.'},
        {q:'What two cadences typically end the antecedent and consequent of a period?', a:'Antecedent ends weakly (often a half cadence — the “question”); consequent ends strongly (a PAC — the “answer”).'},
        {q:'What is an elision?', a:'An overlap where the cadence that ends one phrase is also the downbeat that begins the next.'},
      ], lessons:[
      { h:'The sentence', body:'A <b>sentence</b> states a short <b>basic idea</b>, repeats or varies it, then drives through a longer <b>continuation</b> to a cadence. Its 1+1+2 proportion gives a feeling of acceleration toward the goal.',
        harp:'Voice the basic idea sparely (single notes or open fifths), then thicken the continuation with rolled chords and a rising line — the harp’s dynamic and textural range makes that acceleration vivid.' },
      { h:'The period', body:'A <b>period</b> is a question-and-answer pair: an <b>antecedent</b> ending weakly (a half cadence — the “question”), answered by a <b>consequent</b> ending strongly (a PAC). It’s the most balanced shape in tonal music.',
        harp:'Mark the “question” by leaving the dominant <b>ringing, undamped</b>; answer it by settling firmly home and letting the tonic resonate. The harp’s sustain makes the antecedent/consequent dialogue audible.' },
      { h:'Larger combinations', body:'Phrases combine into <b>double periods</b>, <b>asymmetrical periods</b>, <b>phrase groups</b> and <b>phrase chains</b>. An <b>elision</b> overlaps two phrases — one phrase’s cadence is the next phrase’s downbeat — propelling the music forward.',
        harp:'Elisions are thrilling on the harp: don’t damp the cadence — let it become the launch of the next phrase, so the sound never stops flowing. The instrument’s ring is built for this seamless momentum.' },
    ]},
    { n:14, title:'Accompanimental Textures', quiz:[
        {q:'Define homophonic and polyphonic texture.', a:'Homophonic = melody plus chordal accompaniment; polyphonic = independent melodic lines woven together.'},
        {q:'Name two accompaniment patterns.', a:'Any of: chorale/block chords, arpeggiated (broken chords), afterbeats/offbeats, walking bass.'},
        {q:'Which accompaniment texture is most idiomatic to the harp, and why?', a:'Arpeggiated (broken-chord) texture — the fingers naturally roll across consecutive strings, the harp’s signature sound.'},
      ], lessons:[
      { h:'What is texture?', body:'<b>Texture</b> is how the musical lines combine. <b>Monophonic</b> = one line alone; <b>homophonic</b> = melody plus chordal accompaniment; <b>polyphonic</b> = independent melodies woven together (counterpoint).',
        harp:'A harpist can sustain three or four textures at once — bass drone, broken-chord middle, melody on top — because the strings keep ringing. Few instruments do homophony this richly with just two hands.' },
      { h:'Accompaniment patterns', body:'Core patterns: <b>chorale</b> (block chords, hymn-like), <b>arpeggiated</b> (broken chords), <b>block chords</b>, and <b>afterbeats/offbeats</b> (the “oom-pah” lift). Each gives the same harmony a different feel.',
        harp:'<b>Arpeggiated patterns are the harp’s mother tongue.</b> Learn a handful of left-hand broken-chord shapes (root–fifth–octave–third…) and you can accompany any progression. Try them over a drone in the meditation tool.',
        action:{label:'Try patterns over a drone →', view:'meditation'} },
      { h:'Grooves & bass lines', body:'Rhythm-driven textures like the Latin <b>3-2 clave</b> and <b>distinctive bass lines</b> (walking bass, riffs, pedals) can define a song as much as its melody. The bass carries both roots and groove.',
        harp:'Your <b>left hand on the long low strings</b> is the groove. A repeating bass riff or walking line gives a harp arrangement spine; let those low strings ring for depth, or damp them for a tighter, rhythmic pulse.' },
    ]},
    { n:15, title:'Creating Contrast Between Sections', quiz:[
        {q:'Name four “elements of music” you can change to create contrast.', a:'Any of: melody, harmony, rhythm, texture, register, dynamics, articulation, timbre, tempo.'},
        {q:'How does a chorus often contrast with a verse?', a:'Frequently by rising in register and dynamics, and thickening the texture.'},
        {q:'Give two harp-specific ways to create contrast between sections.', a:'Shift register (move the same idea up/down the strings) and change timbre — e.g. play près de la table near the soundboard, or use harmonics, versus open ringing strings.'},
      ], lessons:[
      { h:'The elements of music', body:'To make a new section feel new, change one or more <b>elements</b>: melody, harmony, rhythm, <b>texture</b>, <b>register</b>, <b>dynamics</b>, articulation, timbre, tempo. A chorus that gets louder and higher than its verse is using register and dynamics.',
        harp:'The harp has its own timbral palette for contrast: play near the soundboard (<i>près de la table</i>) for a guitar-like buzz, use harmonics for a glassy shimmer, or sweep glissandi to flood a new section with colour.' },
      { h:'Contrast in practice', body:'Studying how a Mozart movement and a pop song shift these elements teaches you to shape an <b>arc</b> — tension and release across a whole piece, not just within a phrase. Contrast keeps a listener leaning in.',
        harp:'Plan one big contrast device per arrangement — a register jump, a glissando, a sudden bare-fifths texture — and save it for the moment of greatest lift. On the harp, restraint then release is everything.' },
    ]},
    { n:16, title:'Figured Bass', quiz:[
        {q:'What does a “6” under a bass note indicate?', a:'A first-inversion triad (the chord’s third is in the bass).'},
        {q:'What is a cadential six-four?', a:'A I⁶⁴ that decorates and delays the V at a cadence — its upper notes lean down into the dominant.'},
        {q:'How does inversion help a harpist realise a figured bass smoothly?', a:'Choosing inversions keeps the hands in one string region and avoids leaps, so the realisation flows.'},
      ], lessons:[
      { h:'Reading the figures', body:'<b>Figured bass</b> is a Baroque shorthand: numbers under a bass note show the intervals above it, encoding the chord and its inversion. Root position needs no figure; <b>6</b> = first inversion; <b>6/4</b> = second inversion. Performers “realized” the figures by improvising the harmony.',
        harp:'Realising figured bass is a wonderful harp skill — your right hand fills in the chord shapes the figures imply while the left plays the bass. Because the harp sustains, your realisations can be sparse and still sound full.' },
      { h:'The cadential six-four', body:'The most important figured-bass idiom is the <b>cadential six-four</b> — a I⁶⁴ that decorates and delays the V at a cadence, its two upper notes leaning down into the dominant before it resolves home.',
        harp:'Roll the cadential six-four for maximum effect: arpeggiate up to the suspended tonic chord over the dominant bass, then let the upper voices fall into the V. The harp’s ring makes that delicious delay shimmer.' },
    ]},
  ]},

  /* ===================== SEMESTER 3 — CHROMATIC HARMONY & FORM ===================== */
  { sem:3, title:'Chromatic Harmony', sub:'Colour beyond the key', chapters:[
    { n:17, title:'Secondary Dominants', quiz:[
        {q:'What is a secondary dominant?', a:'The V (or V7) of a chord other than the tonic — e.g. V/V or V7/vi — borrowing a leading tone from outside the key.'},
        {q:'What is tonicization?', a:'Briefly making a non-tonic chord feel like a temporary home, without truly changing key.'},
        {q:'What does a secondary dominant demand of a lever harpist?', a:'A lever flip to create the borrowed leading tone (a sharp outside the key) — often pre-set or flipped just before the chord.'},
      ], lessons:[
      { h:'Borrowing a dominant', body:'A <b>secondary dominant</b> is the V (or V7) of a chord other than the tonic — written “V/V,” “V7/vi.” It borrows a leading tone from outside the key to point strongly at its target chord. The most common way tonal music adds chromatic colour.',
        harp:'Here the levers earn their keep. To play V/V you must <b>raise one string</b> (the new leading tone) with its lever — often flipped a beat early with a free finger, then flipped back. Secondary dominants are where harpists plan their lever choreography.',
        action:{label:'See your levers →', view:'levers'} },
      { h:'Tonicization', body:'When a secondary dominant resolves to its target, it briefly makes that chord feel like a temporary “home” — <b>tonicization</b>. A momentary spotlight, not a true change of key.',
        harp:'Because tonicization is brief, harpists often flip <b>one lever in and straight back out</b> — a quick gesture rather than a full key reset. Choose targets whose leading tone is easy to reach.' },
      { h:'Writing & resolving them', body:'To build V/x, find the dominant of the target chord and add its leading tone. They usually resolve normally (leading tone up, 7th down) — but composers love <b>irregular resolutions</b> that surprise the ear.',
        harp:'When you arrange chromatic harmony, mark every lever change in your score with an up/down arrow. A clean secondary-dominant passage on the harp is as much about <b>lever timing</b> as about the notes.' },
    ]},
    { n:18, title:'Secondary Diminished Chords', quiz:[
        {q:'What does a vii°7/x do?', a:'It tonicizes a chord using its diminished leading-tone seventh instead of its dominant — a more chromatic, yearning approach.'},
        {q:'Why is the fully-diminished seventh so flexible?', a:'It’s symmetrical (stacked minor thirds), so it can slip toward many chords and be respelled for modulation.'},
        {q:'Why are fully-diminished sevenths demanding on a lever harp?', a:'They stack notes outside the set key, often needing two or more levers engaged at once.'},
      ], lessons:[
      { h:'Borrowing a leading-tone chord', body:'Like secondary dominants, a <b>secondary diminished</b> (vii°/x, often vii°7/x) tonicizes a chord — but using its diminished leading-tone chord instead of its dominant. The effect is more chromatic and yearning.',
        harp:'These chords usually need <b>multiple levers</b> engaged, so plan them where you have a moment to set them. The reward is one of the most expressive sounds the harp can make — a tense, glassy shimmer.' },
      { h:'A pivot in disguise', body:'Because the fully-diminished seventh is symmetrical (stacked minor thirds), it can slip toward almost any harmony — making it a slippery, powerful tool for chromatic motion and, later, for modulation.',
        harp:'On the harp this symmetry is a gift and a puzzle: the same four strings (with levers) can lead four different directions. Learn one diminished-seventh hand shape and lever set, and you can pivot almost anywhere.' },
    ]},
    { n:19, title:'Mode Mixture', quiz:[
        {q:'What is mode mixture?', a:'Borrowing chords or scale degrees from the parallel minor into a major key (or vice versa) — e.g. ♭VI, minor iv.'},
        {q:'What is a Picardy third?', a:'Ending a minor-key piece on a major tonic chord (raising the third) — a sudden brightening.'},
        {q:'How does a harpist get a Picardy third?', a:'Engage the lever on the third of the tonic chord to raise it from minor to major for that final chord.'},
      ], lessons:[
      { h:'Borrowing from the parallel minor', body:'<b>Mode mixture</b> (borrowed chords) imports chords or scale degrees from the parallel minor into a major key — or vice versa. The bittersweet <b>♭VI</b>, the minor <b>iv</b>, the <b>♭III</b> and <b>♭VII</b> darken or warm the harmony while keeping the key.',
        harp:'Borrowed <b>flats</b> are the tricky direction on a lever harp, because levers only raise. To get a lowered scale degree you must have tuned that string flat to begin with, or be in a key where that note is already lower. Plan borrowed chords into your tuning.' },
      { h:'Two famous mixtures', body:'The <b>deceptive cadence to ♭VI</b> (V→♭VI) is a goose-bump surprise. The <b>Picardy 3rd</b> ends a minor piece on a major tonic chord — a sudden sunrise after a sad journey, beloved by Bach.',
        harp:'The Picardy third is pure lever magic: minor all the way through, then at the final chord you <b>flip one lever up</b> to raise the third and the room fills with light. Practise that single, well-timed flip until it’s silent and smooth.' },
    ]},
    { n:20, title:'The Neapolitan Chord', quiz:[
        {q:'What is the Neapolitan chord?', a:'A major triad built on the lowered second scale degree (♭II), almost always in first inversion (N⁶).'},
        {q:'What function does it serve?', a:'A dramatic pre-dominant — it leans strongly toward the dominant.'},
        {q:'What makes the Neapolitan awkward on a lever harp?', a:'Its root is a lowered scale degree (♭2), a flat that levers can’t produce unless the string is tuned/reset down — so it usually requires pre-planning the tuning.'},
      ], lessons:[
      { h:'The ♭II chord', body:'The <b>Neapolitan</b> is a major chord built on the lowered second degree (♭II), almost always in first inversion (<b>N⁶</b>, with the 4th degree in the bass). A dramatic, yearning pre-dominant that leans hard toward the dominant — opera and film love its tragic colour.',
        harp:'Because the Neapolitan needs a <b>lowered</b> 2nd, lever harpists usually engineer it through key choice or tuning rather than a quick flip. When you can set it up, roll it richly in first inversion — it’s one of the most beautiful chords on the instrument.' },
    ]},
    { n:21, title:'Augmented Sixth Chords', quiz:[
        {q:'What defines an augmented-sixth chord?', a:'An augmented-sixth interval whose two notes resolve outward by half step onto the dominant.'},
        {q:'Name the three types.', a:'Italian, French, and German augmented sixths.'},
        {q:'Why does the German augmented sixth interest a modulating harpist?', a:'It sounds identical to a dominant seventh, so with the right lever respelling it can pivot to a distant key.'},
      ], lessons:[
      { h:'The augmented-sixth interval', body:'These chords are built around a striking <b>augmented sixth</b> interval (e.g. A♭ up to F♯), whose two notes pull powerfully <b>outward</b> by half step onto the dominant. Among the most intense chromatic pre-dominants in tonal music.',
        harp:'The augmented sixth combines a <b>raised</b> note (lever up) with a <b>lowered</b> note (tuned/reset down) — so it tests a lever harp the most. They reward careful tuning planning with an almost vocal, aching pull to the dominant.' },
      { h:'Italian, French & German', body:'Three flavours add a different note inside the augmented sixth: the <b>Italian</b> (sparest), the <b>French</b> (whole-tone shimmer), and the <b>German</b> (sounds exactly like a dominant 7th). They often arrive over a <b>descending chromatic bass line</b>.',
        harp:'A descending chromatic bass means a run of <b>lever flips</b> on consecutive low strings — slow, dramatic, and very playable if you choreograph it. The German type’s dominant-seventh sound makes it a favourite harp pivot for surprise key changes.' },
    ]},
    { n:22, title:'Modulation', quiz:[
        {q:'How does modulation differ from tonicization?', a:'Modulation moves the tonal home to a new key and confirms it with a cadence; tonicization is only a brief spotlight.'},
        {q:'What is a pivot chord?', a:'A chord belonging to both keys, reinterpreted to ease the ear from the old key into the new one.'},
        {q:'Why is modulation more effortful on a lever harp than a pedal harp?', a:'Each new key needs manual lever changes (no pedals), so harpists plan modulations around moments when a hand is free.'},
      ], lessons:[
      { h:'Changing key', body:'<b>Modulation</b> is moving the tonal home to a new key — deeper than a brief tonicization, and confirmed by a cadence. The most natural targets are <b>closely-related keys</b>, just one accidental away (relative minor, dominant, subdominant).',
        harp:'Closely-related keys are the harpist’s friends: they differ by just <b>one lever</b>. Modulating to the dominant or relative minor can be as simple as engaging a single string — which is why so much harp repertoire visits exactly those keys.',
        action:{label:'Explore keys on the Modes wheel →', view:'modes'} },
      { h:'The pivot chord', body:'The smoothest modulations use a <b>pivot chord</b> belonging to both keys: heard one way in the old key, reinterpreted in the new, easing the ear across the seam. Pivots can be diatonic or chromatic.',
        harp:'A pivot chord is the perfect cover for a lever change: while the shared chord rings, your free hand <b>flips the lever</b> that defines the new key. The audience hears one smooth chord; you’ve quietly retuned.' },
      { h:'Hearing a new key', body:'After a modulation your ear re-orients around a new tonic. Recognizing it — by its leading tone and cadence — is a core skill. Some modulations skip the pivot and shift by direct chromatic motion or a common tone.',
        harp:'Train your ear at the harp by modulating with deliberate lever flips and listening for the new “home” string. The physical act of changing the lever cements the new key in your ear.' },
    ]},
    { n:23, title:'Enharmonic Modulation', quiz:[
        {q:'Which two chords sound identical and let you pivot to a remote key?', a:'The dominant seventh and the German augmented sixth.'},
        {q:'Why can a fully-diminished seventh modulate four ways?', a:'It’s symmetrical, so it can be respelled with any of its notes as the leading tone of a new key.'},
        {q:'How does a harpist execute an enharmonic pivot?', a:'By respelling the chord with levers — the same strings, re-engaged differently, become the leading-tone of the new key.'},
      ], lessons:[
      { h:'Pivoting by respelling', body:'Some chords are sonic chameleons. A <b>V7 and a German augmented sixth</b> sound identical; respelling one as the other pivots to a remote key. The <b>fully-diminished seventh</b> is symmetrical — respellable four ways, opening a door to almost any key. These sudden shifts of light are the height of Romantic harmony.',
        harp:'On the harp, enharmonic modulation is a <b>lever sleight-of-hand</b>: hold a ringing diminished or dominant chord, flip the levers that re-spell it, and resolve into a key the listener never saw coming. It’s the most dramatic trick in the lever harpist’s book.' },
    ]},
    { n:24, title:'Binary & Ternary Forms', quiz:[
        {q:'How does sectional binary differ from continuous binary?', a:'Sectional binary cadences home at the end of A; continuous binary ends A in a new key, leaning forward.'},
        {q:'What defines rounded binary?', a:'The opening A material returns partway through the B section (a→b→a′).'},
        {q:'How does form guide a harpist’s lever plan in a binary dance?', a:'If section B modulates, you decide where (often at the double bar/repeat) to flip the lever(s) for the new key, then flip back for the return.'},
      ], lessons:[
      { h:'Two-part (binary) form', body:'<b>Binary</b> form has two sections, often each repeated (‖: A :‖: B :‖). <b>Sectional</b> binary cadences home at the end of A; <b>continuous</b> binary ends A in a new key, leaning forward. <b>Balanced binary</b> echoes A’s ending at the close of B.',
        harp:'The double bar between A and B is your natural <b>lever-change window</b> — if B visits a new key, flip there. Many Baroque dances harpists love (minuets, gavottes) are binary, with the repeat giving you time to reset.' },
      { h:'Rounded binary & ternary', body:'<b>Rounded binary</b> brings the opening A back partway through B (a → b → a′, tightly knit). True <b>ternary</b> (ABA) is bigger: a complete idea, a real contrasting middle, then a full return.',
        harp:'In ternary form, contrast the middle section with a harp-specific colour change — switch register, add harmonics, or move <i>près de la table</i> — then return to the open, ringing A. The form practically asks for the harp’s timbral palette.' },
    ]},
    { n:25, title:'Sonata & Rondo Forms', quiz:[
        {q:'Name the three main sections of sonata form.', a:'Exposition, development, and recapitulation.'},
        {q:'What is the key drama of sonata form?', a:'A conflict of keys: two themes in two keys in the exposition, resolved into the home key in the recapitulation.'},
        {q:'What is the shape of a rondo?', a:'A recurring refrain alternating with contrasting episodes (ABACA…).'},
      ], lessons:[
      { h:'Sonata form', body:'<b>Sonata form</b> dramatizes a conflict of keys. The <b>exposition</b> presents two theme-groups in two different keys; the <b>development</b> destabilizes and explores them; the <b>recapitulation</b> resolves everything by bringing both themes back in the home key. The grand narrative arch of the Classical era.',
        harp:'Sonata form’s key contrasts mean <b>planned lever changes</b> at each major seam. Harpists arranging Classical sonatas map every modulation in advance — the development section, full of remote keys, is where the lever choreography gets most intricate.' },
      { h:'Rondo & structural functions', body:'<b>Rondo</b> alternates a recurring refrain with contrasting episodes (ABACA…), like a chorus that keeps returning. Both forms rest on four <b>structural functions</b> — opening, transition, development and closing — the deep grammar of large pieces.',
        harp:'Each return of the rondo refrain is a chance to <b>re-orchestrate</b> on the harp — first plain, then with a richer bass, then in harmonics. The recurring tune over a fixed lever setting makes rondo a satisfying form to arrange.' },
    ]},
  ]},

  /* ===================== SEMESTER 4 — COUNTERPOINT & THE 20TH CENTURY ===================== */
  { sem:4, title:'Counterpoint & the 20th Century', sub:'Lines, jazz & new sound-worlds', chapters:[
    { n:26, title:'Voice Leading: Triads', quiz:[
        {q:'What are the two forbidden parallels?', a:'Parallel perfect fifths and parallel perfect octaves.'},
        {q:'Name two principles of smooth voice leading.', a:'Keep common tones; move other voices by the smallest step; give each voice a singable line.'},
        {q:'How does voice leading translate to harp playing?', a:'Choosing inversions that keep common tones lets your hands stay in one string region and move minimally between chords.'},
      ], lessons:[
      { h:'The art of voice leading', body:'<b>Voice leading</b> is moving each of four voices (S-A-T-B) smoothly from chord to chord: keep common tones, move others by step, give each voice a singable line, respect its range. Smooth voice leading makes a progression sound finished, not blocky.',
        harp:'Good voice leading is good harp technique: when chords share tones, your fingers can <b>stay on those strings</b> while only one or two move. Smooth voice leading literally means less hand travel and cleaner playing.' },
      { h:'The forbidden parallels', body:'The cardinal rule: avoid <b>parallel fifths</b> and <b>parallel octaves</b> — two voices moving in the same perfect interval rob them of independence and sound “empty.” Contrary and oblique motion keep the four voices alive.',
        harp:'Interestingly, parallel fifths and octaves are also a beloved <b>harp colour</b> (think Celtic and medieval styles) — the very “emptiness” classical writing avoids can sound gorgeous and ancient on the harp. Know the rule, then break it on purpose.' },
    ]},
    { n:27, title:'Voice Leading: Seventh Chords', quiz:[
        {q:'Which way does the chordal seventh almost always resolve?', a:'Down by step.'},
        {q:'In a V7→I, what do the leading tone and the seventh do?', a:'The leading tone rises to the tonic; the seventh falls a step — two tensions resolving at once.'},
        {q:'Why might a harpist omit a note from a seventh chord?', a:'To keep it to four fingers and let each remaining voice — especially the resolving seventh — lead cleanly.'},
      ], lessons:[
      { h:'Resolving the seventh', body:'The added 7th is a <b>tendency tone</b>: it almost always resolves <b>down by step</b> into the next chord. In a V7→I the leading tone rises to the tonic while the seventh falls — two tensions resolving at once, the most satisfying motion in tonal music.',
        harp:'On the harp you can <b>watch</b> the resolution: the seventh is a string that drops to its neighbor, the leading tone a string that rises. Voicing V7 as root–3rd–7th (drop the 5th) gives a clean, three-finger resolution.' },
      { h:'Chains of sevenths', body:'When seventh chords follow one another around the circle of fifths, voices alternate between <b>complete</b> and <b>incomplete</b> chord forms so every seventh can resolve down. The vii°7 has its own special resolution worth memorizing.',
        harp:'A circle-of-fifths chain of sevenths is a superb harp exercise in <b>economical motion</b> — alternating full and reduced voicings keeps your hand compact while every seventh slips down a string.' },
    ]},
    { n:28, title:'Voice Leading with Non-Chord Tones', quiz:[
        {q:'Why decorate four-part writing with non-chord tones?', a:'They add melodic life and motion to otherwise static chords.'},
        {q:'What must you watch for when adding NCTs to counterpoint?', a:'That they don’t create hidden parallel fifths or octaves.'},
        {q:'Which NCT is most idiomatic to let ring on the harp?', a:'The suspension (and pedal point) — the harp’s sustain makes the held dissonance and its resolution especially expressive.'},
      ], lessons:[
      { h:'Decorating the counterpoint', body:'Passing tones, neighbors and suspensions bring four-part writing to life — but they must never create hidden parallel fifths or octaves. This is where harmony, melody and counterpoint meet on the page, and where careful craft shows.',
        harp:'Decorated counterpoint suits the harp perfectly: stepwise NCTs are adjacent strings, and the instrument’s sustain lets suspensions hang in the air before they resolve. Add them by ear — your fingers already know the neighboring strings.' },
    ]},
    { n:29, title:'Voice Leading Chromatic Harmonies', quiz:[
        {q:'Which way do augmented-sixth notes resolve?', a:'Outward by half step onto the dominant.'},
        {q:'Where does the Neapolitan’s root tend to move?', a:'Down to the dominant (often via the leading tone).'},
        {q:'Why is idiomatic resolution of chromatic chords vital on the harp?', a:'Each chromatic note is a lever flip; resolving it correctly means flipping the lever back at the right instant so the line sounds inevitable, not clashing.'},
      ], lessons:[
      { h:'Leading the chromatic chords', body:'Every chromatic chord has tendency tones that must move correctly to sound inevitable: secondary-dominant leading tones rise, the Neapolitan’s root falls to the dominant, augmented-sixth notes spread outward, borrowed degrees resolve like their minor-key originals. Idiomatic resolution makes chromatic harmony sing.',
        harp:'On the lever harp, “resolving correctly” is also “flipping the lever back at the right moment.” Score your chromatic passages with lever arrows in and out; the music’s voice leading and your lever choreography are the same thing.',
        action:{label:'See your levers →', view:'levers'} },
    ]},
    { n:30, title:'Introduction to Counterpoint', quiz:[
        {q:'What does species counterpoint teach, step by step?', a:'Consonance, dissonance and independent motion — from note-against-note (first species) up to florid fifth species.'},
        {q:'What is a fugue subject?', a:'The main theme of a fugue, announced alone, then answered at the fifth and woven through every voice.'},
        {q:'Why is two-voice counterpoint well suited to the harp?', a:'The two hands can each carry an independent line, and the sustaining strings keep both lines audible at once.'},
      ], lessons:[
      { h:'Species counterpoint', body:'<b>Counterpoint</b> is the art of combining independent melodic lines. <b>Species counterpoint</b> trains it in five graded steps — from note-against-note (first species) up to florid, rhythmically free fifth species — teaching consonance, dissonance and independent motion one layer at a time.',
        harp:'Two-part counterpoint is a beautiful harp study: left hand one voice, right hand another, each singing on its own. Because the strings ring, both lines stay alive — you hear the conversation between the hands.' },
      { h:'Invention & fugue', body:'These skills build toward the <b>invention</b> (two interweaving voices) and the <b>fugue</b> — a single <b>subject</b> announced, answered at the fifth, woven through every voice with dazzling craft. The fugue is the summit of contrapuntal art, Bach its supreme master.',
        harp:'Bach’s two-part inventions transfer wonderfully to harp and are a rite of passage. Fugues are harder — keeping three or four independent voices clear means careful <b>damping</b> so the lines don’t blur into one ringing wash.' },
    ]},
    { n:31, title:'Introduction to Jazz Theory', quiz:[
        {q:'What is the central chord cell of jazz?', a:'The ii–V–I progression.'},
        {q:'Name two altered-dominant tensions.', a:'Any of: ♭9, ♯9, ♯11 (♭5), ♭13 (♯5).'},
        {q:'What is a chord–scale relationship? Give one example.', a:'The scale that colours a given chord — e.g. Mixolydian over a dominant 7th, Dorian over a minor ii, Lydian over a major 7th.'},
      ], lessons:[
      { h:'Jazz chords & symbols', body:'Jazz extends triads into 7ths, 9ths, 11ths and 13ths, plus <b>altered dominants</b> (♭9, ♯9, ♯11, ♭13), all named with rich chord symbols (Cmaj9, F7♯11, Dm7♭5…). The harmony is denser and more colourful than common-practice chords.',
        harp:'Extended chords are a harp gift: a rolled 9th or 13th chord uses strings you already have in the key — lush, ringing colour with no levers. For altered dominants, one lever adds the spice (a ♯11 or ♭9) to an otherwise open chord.' },
      { h:'ii–V–I, voicings & turnarounds', body:'The <b>ii–V–I</b> is the central cell of jazz. Pianists use <b>rootless voicings</b> and <b>shells</b> so harmony moves smoothly; <b>turnarounds</b> loop the end of a tune back to the top. Master ii–V–I and you hold the key to the standards.',
        harp:'Try a ii–V–I with <b>left-hand roots and right-hand shells</b> (3rd + 7th) — the harp version of rootless voicings. In one set key you can comp through a whole jazz standard, lever-free, letting the strings ring like a vibraphone.' },
      { h:'Chord–scale & bebop', body:'<b>Chord–scale relationships</b> tell you which scale colours each chord (Dorian over a ii, Mixolydian over a V, Lydian over a maj7…). The <b>bebop scales</b> add a chromatic passing tone so chord tones land on the beat — the secret to smooth, swinging lines.',
        harp:'Chord-scales connect straight to the Modes wheel: each mode is a lever setting, and improvising the right mode over each chord is pure open-string playing. The bebop passing tone is the one spot you’ll flip a lever mid-line.',
        action:{label:'Explore the modes →', view:'modes'} },
    ]},
    { n:32, title:'Impressionism & Extended Tonality', quiz:[
        {q:'How did Impressionist composers treat harmony?', a:'As colour rather than function — chords valued for their sound, not their pull to resolve.'},
        {q:'Name a non-traditional chord-building method from this era.', a:'Quartal (in fourths), quintal (in fifths), secundal (in seconds), or polychords.'},
        {q:'Why is Impressionist harmony so idiomatic to the harp?', a:'Whole-tone and pentatonic scales and quartal chords lie under the open strings and glissando beautifully — Debussy and Ravel wrote landmark harp works for exactly this reason.'},
      ], lessons:[
      { h:'New colours around 1900', body:'Debussy and his peers loosened tonality, treating harmony as <b>colour</b> rather than function. <b>Pandiatonicism</b> uses a scale’s notes freely without traditional progressions; whole-tone and pentatonic scales create a floating, weightless light.',
        harp:'This is the harp’s golden age — Debussy and Ravel prized the instrument for exactly these floating colours. A pentatonic or whole-tone <b>glissando</b> across set strings is the sound of Impressionism, and it’s yours with one lever recipe.' },
      { h:'Stacking new intervals', body:'Instead of stacking thirds, composers built chords in <b>fourths (quartal)</b>, <b>fifths (quintal)</b> and <b>seconds (secundal)</b>, and combined two chords into shimmering <b>polychords</b>. These open, ringing sonorities are wonderfully harp-friendly.',
        harp:'Quartal and quintal chords are simply a different <b>string-skipping shape</b> — skip two strings instead of one. They ring with an open, modern resonance that suits the harp’s sustain perfectly. Experiment: your hands already know the gaps.' },
    ]},
    { n:33, title:'Set Theory', quiz:[
        {q:'What is a pitch-class set?', a:'An unordered collection of pitch-classes analysed without reference to a key — the tool for atonal music.'},
        {q:'What does prime form give you?', a:'A set’s most basic, compact, comparable shape — so different-looking chords can be recognised as the same set class.'},
        {q:'What two operations relate pitch-class sets?', a:'Transposition (Tₙ) and inversion (TₙI).'},
      ], lessons:[
      { h:'Music as pitch-class sets', body:'For atonal music we drop keys and analyze collections of <b>pitch-classes</b> as <b>sets</b>. <b>Normal form</b> packs a set into its most compact ordering; <b>prime form</b> finds its most basic, comparable shape — letting us see that two different-looking chords are the same set.',
        harp:'Atonal set-theory music demands <b>many levers engaged at once</b> and frequent changes — the lever harp’s real frontier. Composers writing atonal harp music plan the lever map as carefully as the pitches; some passages are simply unplayable without retuning.' },
      { h:'Fingerprints & operations', body:'The <b>interval vector</b> counts every interval in a set — a fingerprint explaining its sound. <b>Forte numbers</b> catalogue every set class. The two operations relating sets are <b>transposition</b> (Tₙ, moving by n half steps) and <b>inversion</b> (TₙI, flipping around an axis).',
        harp:'Transposition by a half step is the hardest move on a lever harp (it can mean re-levering every string), while transposition by an octave is free — just shift to the same strings higher or lower. Set theory throws the harp’s strengths and limits into sharp relief.' },
    ]},
    { n:34, title:'Serialism', quiz:[
        {q:'What is a tone row?', a:'An ordering of all twelve pitch-classes that gives each equal weight, the basis of a twelve-tone work.'},
        {q:'Name the four basic row forms.', a:'Prime, inversion, retrograde, and retrograde-inversion (each transposable to twelve levels).'},
        {q:'What does a 12×12 matrix show?', a:'Every row form at a glance — primes across, inversions down, retrogrades read backward.'},
      ], lessons:[
      { h:'Twelve-tone technique', body:'Schoenberg’s method gives all twelve pitch-classes equal weight by ordering them into a <b>tone row</b>. From the original (<b>prime</b>) row he derives its <b>inversion</b>, <b>retrograde</b> and <b>retrograde-inversion</b>, each transposable to twelve levels — 48 forms in all.',
        harp:'Twelve-tone music uses all twelve pitches equally — the opposite of the diatonic lever harp. Playing it means levers in constant motion or strings pre-tuned chromatically; it’s where harpists most feel the instrument’s diatonic nature. Composers often give the harp only fragments of the row for this reason.' },
      { h:'The matrix', body:'A 12×12 <b>matrix</b> lays out every row form at a glance: read across for primes, down for inversions, backwards for retrogrades. Composers present these forms in melody and harmony to build a piece with no tonal center.',
        harp:'For the harpist, the matrix is also a <b>lever map</b>: each row form implies which strings must be raised when. Analysing the matrix tells you where the unplayable spots are — and where clever lever choreography makes the impossible possible.' },
    ]},
    { n:35, title:'Minimalism', quiz:[
        {q:'What is additive process?', a:'Growing a repeating pattern one note (or beat) at a time.'},
        {q:'What is phase shifting?', a:'Starting two identical loops together and letting one slide gradually out of sync (Steve Reich).'},
        {q:'Why is minimalism beautifully suited to the harp?', a:'Repeating diatonic cells sit on open strings with no lever changes, and the harp’s ring builds the hypnotic, shimmering texture minimalism seeks.'},
      ], lessons:[
      { h:'Process music', body:'<b>Minimalism</b> builds large, hypnotic works from tiny repeating cells. <b>Additive</b> process grows a pattern one note at a time; <b>phase shifting</b> (Steve Reich) starts two identical loops together and lets one slide slowly out of sync, generating ever-changing patterns from the same material — a meditative, mesmerizing close to the journey.',
        harp:'Minimalism may be the harp’s most natural modern home: a single set key, a small repeating cell on open strings, and the instrument’s long sustain layering the pattern into a shimmer. No levers, no key changes — just flow. Sit with a drone and build your own repeating cell.',
        action:{label:'Sit with a drone →', view:'meditation'} },
    ]},
  ]},

  /* ===================== FOUNDATIONS — THE SCIENCE OF SOUND (Schmidt-Jones) ===================== */
  { sem:5, kicker:'Foundations', title:'The Science of Sound', sub:'Why your harp sounds the way it does',
    src:'From “Understanding Basic Music Theory” by Catherine Schmidt-Jones (CC BY-SA 4.0).', chapters:[
    { n:36, title:'Sound, Pitch & Loudness', quiz:[
        {q:'What is the difference between noise and a musical tone?', a:'Noise is a random jumble of sound waves; a tone is a regular, evenly-spaced wave — which the ear hears as a definite pitch.'},
        {q:'What two physical properties correspond to loudness and to pitch?', a:'Amplitude (the size of the wave) = loudness; frequency / wavelength = pitch.'},
        {q:'Where does a harp’s loudness come from, physically?', a:'The size of the pluck — a bigger displacement of the string makes a larger-amplitude wave, which we hear as louder.'},
      ], lessons:[
      { h:'Music is organized sound waves', body:'At its most basic, music is <b>organized sound waves</b>. A random jumble of waves is heard as <b>noise</b>; a regular, evenly-spaced wave is heard as a <b>tone</b> — a sound with a clear pitch. Sound itself is a <b>longitudinal wave</b>: a vibrating object squeezes the air into evenly-spaced ripples that travel to your ear.',
        harp:'Pluck a string and it vibrates back and forth in a steady, regular rhythm — so you hear a clean <b>tone</b>. Knock the soundboard and you get an irregular jumble — <b>noise</b>. Everything musical the harp does begins with setting a string into that regular vibration.' },
      { h:'Loudness — amplitude & dynamics', body:'The <b>amplitude</b> of a wave is how big it is — how far the air is displaced. Bigger amplitude = louder. Scientists measure it in <b>decibels</b>; musicians call loudness the <b>dynamic level</b> — <i>forte</i> (loud), <i>piano</i> (soft), and everything between.',
        harp:'Your dynamics live entirely in <b>how you pluck</b>. A firm pluck near the middle of the string moves it further — bigger amplitude, louder note. A gentle pluck high up gives a soft, sweet <i>piano</i>. No pedals or breath — just the size and place of the pluck.' },
      { h:'Pitch — wavelength & frequency', body:'The spacing of the waves sets the <b>pitch</b>. Closer-together waves (shorter <b>wavelength</b>) reach your ear more often — a higher <b>frequency</b>, measured in <b>hertz</b> (Hz) — and sound higher. The tuning reference is <b>A = 440 Hz</b>; humans hear roughly 20 to 17,000 Hz.',
        harp:'Look at your harp: the <b>short, thin treble strings</b> vibrate fast — high frequency, high pitch. The <b>long, thick bass strings</b> vibrate slowly — low pitch. The instrument is a frequency ladder you can see, longest-and-lowest to shortest-and-highest.',
        action:{label:'Tune to A440 →', view:'tuner'} },
    ]},
    { n:37, title:'Standing Waves on a String', quiz:[
        {q:'What is a standing wave, and why do instruments use them?', a:'A wave “trapped” bouncing back and forth in a container of just the right size, so it reinforces itself into a steady tone instead of spreading out and fading.'},
        {q:'What are nodes and antinodes?', a:'Nodes are points of no motion; antinodes are the points of greatest motion. A string fixed at both ends must have a node at each end.'},
        {q:'Name the three things that set a harp string’s pitch.', a:'Its length, its tension, and its thickness (mass) — long, loose, thick strings sound low; short, tight, thin strings sound high.'},
      ], lessons:[
      { h:'Trapped waves & standing waves', body:'A wave normally spreads out and fades. But trap it bouncing between two fixed ends of just the right length and it reinforces itself into a steady <b>standing wave</b> — the basis of every musical tone. The longest wave that fits is the <b>fundamental</b> (the <b>first harmonic</b>); it gives the note its pitch.',
        harp:'A harp string is a textbook standing-wave container — a thin string held tight at both ends. Pluck it and a standing wave springs up between the two anchor points. Instruments that make sound this way are called <b>chordophones</b>; your harp is one.' },
      { h:'Nodes, antinodes & what sets the pitch', body:'A standing wave has <b>nodes</b> (points that don’t move) and <b>antinodes</b> (points of biggest motion). A string fixed at both ends must have a node at each end. Its pitch depends on <b>length, tension and thickness</b>: shorten the vibrating length, tighten it, or thin it, and the pitch rises.',
        harp:'This is why your bass strings are <b>long and thick</b> and your treble strings <b>short and thin</b> — the maker is tuning the physics. When you turn a tuning pin you change the <b>tension</b> to raise or lower the pitch; a lever shortens the vibrating length a touch to raise it a half step.' },
    ]},
    { n:38, title:'The Harmonic Series & Timbre', quiz:[
        {q:'Where does an instrument’s timbre (tone colour) come from?', a:'From its harmonics — a string vibrates as a whole AND in halves, thirds, fourths… all at once; the blend of those overtones gives the note its colour.'},
        {q:'What is the frequency ratio of an octave?', a:'2 : 1 — the second harmonic has exactly twice the frequency (and half the wavelength) of the fundamental.'},
        {q:'Why does a harp sound different from a flute playing the same note?', a:'They share the same harmonic series but emphasise different harmonics, so the tone colour differs.'},
      ], lessons:[
      { h:'Harmonics — why a harp sounds like a harp', body:'A plucked string vibrates as a whole (the fundamental) <b>and</b>, at the same time, in halves, thirds, fourths and beyond. Each fraction adds a higher <b>harmonic</b> (overtone). You don’t hear them as separate notes — blended, they give the note its <b>timbre</b>, its colour. A single pure frequency, by contrast, sounds dull and mechanical, like an alarm.',
        harp:'Those overtones, amplified by the soundboard, are the harp’s shimmering, bell-like <b>colour</b>. A flute and a harp can play the very same pitch yet sound utterly different because each emphasises a different mix of harmonics — the harp leaning on the bright, ringing ones.' },
      { h:'The harmonic series', body:'The harmonics line up in a fixed pattern called the <b>harmonic series</b>. The 2nd harmonic has <b>twice</b> the frequency of the fundamental — exactly one <b>octave</b> higher (a 2:1 ratio). The 3rd is three times (an octave + a fifth), the 4th four times (two octaves), and so on. These simple whole-number ratios are the physical root of octaves, fifths, and all of consonance.',
        staff:{clef:'treble', key:'C', notes:'C4/h, C5/h'},
        harp:'Every octave on your harp is that pure 2:1 — the C5 string vibrates exactly twice as fast as the C4 string. The whole layout of strings is the harmonic series made visible, which is why octaves and fifths feel so settled and “at home” under your hands.' },
    ]},
    { n:39, title:'Harp Harmonics', quiz:[
        {q:'How do you sound a harmonic an octave above a string’s pitch?', a:'Lightly touch the string at its exact midpoint (forcing a node there) and pluck — the fundamental is silenced and the 2nd harmonic, an octave higher, rings out.'},
        {q:'Why does touching the midpoint give the octave specifically?', a:'It forces a node in the middle, which only the even harmonics (starting with the 2nd = the octave) allow; the fundamental, which needs motion there, is cancelled.'},
        {q:'What does a harp harmonic sound like?', a:'Pure, soft, glassy and flute-like — fewer overtones than a normal pluck, like a bell.'},
      ], lessons:[
      { h:'Playing the octave harmonic', body:'Because a string can only make standing waves with a node at certain points, lightly touching it at a chosen spot lets only the harmonics that already have a node there survive. Touch the <b>exact midpoint</b> and pluck: the fundamental (which needs to move there) is silenced, and you hear the <b>2nd harmonic — an octave higher</b>, pure and flute-like.',
        harp:'This is the harp’s beloved <b>harmonics</b> technique. Rest the side of your palm or a knuckle lightly at the string’s centre, pluck below it with the thumb, then release — out floats a soft, glassy octave. It’s the same physics, made into one of the harp’s most magical sounds.' },
      { h:'Other harmonics & the bell tones', body:'Touch the string a <b>third</b> of the way along and you get the 3rd harmonic — an octave plus a fifth above. Quarters give two octaves up, and so on. Each spot reveals a different member of the harmonic series, with fewer overtones than a full pluck — which is exactly why harmonics ring so pure and bell-clear.',
        harp:'Composers prize harp harmonics for that crystalline, music-box colour — Debussy and Ravel especially. Used sparingly over a soft chord, a few harmonics turn the harp into something otherworldly. Try the midpoint first; it’s the easiest and sweetest.' },
    ]},
    { n:40, title:'Tuning Systems & Beats', quiz:[
        {q:'In equal temperament, how is the octave divided, and which interval is the only pure one?', a:'Into twelve equal half steps (each the 12th root of 2); only the octave is a pure ratio (2:1).'},
        {q:'What is a “beat” in tuning?', a:'A regular pulsing in the sound when two notes are slightly off a pure interval — their waves drift in and out of step. Tuners listen for the beats to slow and stop.'},
        {q:'Why do harps use equal temperament rather than just intonation?', a:'Just intonation needs tiny retunings for every key; a harp (like a piano) can’t adjust pitch on the fly, so equal temperament lets it play in many keys without retuning.'},
      ], lessons:[
      { h:'Why tuning is a choice', body:'Before musicians can play together they must agree on exactly which frequency is an “A.” Every tuning system is built from the physics of the <b>harmonic series</b> — the <b>pure intervals</b> with simple ratios: the octave (2:1), the perfect fifth (3:2), the major third (5:4). The catch: you cannot make all of them pure at once.',
        harp:'Tuning isn’t just a chore before you play — it’s a tiny act of music theory. The “A” you tune to and the system you use shape how every chord on the harp will sound.' },
      { h:'The historical systems', body:'<b>Pythagorean</b> tuning stacks pure fifths — glorious fifths, but thirds come out too wide, and the fifths never quite close the octave (the leftover “wolf” fifth). <b>Mean-tone</b> flips this, making the thirds pure for sweet Renaissance harmony. <b>Just intonation</b> makes both thirds and fifths pure and sounds gorgeous — but you must <b>retune for every key</b>.',
        harp:'That last point is the harpist’s reality: just intonation is, in the book’s words, “unworkable for pianos, harps, and other instruments that cannot make small tuning adjustments quickly.” You can’t nudge a harp string mid-phrase, so a fixed, flexible system wins.' },
      { h:'Equal temperament & beats', body:'Modern <b>equal temperament</b> divides the octave into <b>twelve identical half steps</b> (each the 12th root of 2). Only the octave stays pure; every other interval is nudged slightly, so you can play in <b>any key without retuning</b>. Fine differences are measured in <b>cents</b> (1/100 of a half step). When two notes are slightly off, their waves create audible <b>beats</b> — a steady pulsing.',
        harp:'This is exactly how you tune your harp by ear: play two strings and listen for the <b>beats</b> — a wah-wah-wah pulse — then adjust the pin until the beating <b>slows and disappears</b>. No beats = in tune. Piano and harp tuners tune by timing those beats, not by hearing pure intervals.',
        action:{label:'Tune by ear →', view:'tuner'} },
    ]},
    { n:41, title:'Beyond Major & Minor', quiz:[
        {q:'How many notes are in a pentatonic scale, and what does it avoid?', a:'Five — and it avoids half steps, so no two notes clash; that’s why it sounds open and consonant.'},
        {q:'Why are pentatonic scales perfect for the harp?', a:'Set the levers for a pentatonic and every glissando sweeps only consonant notes — so any sweep across the open strings sounds beautiful.'},
        {q:'Name two ways music divides the octave other than major and minor.', a:'Any of: pentatonic scales, the blues scale, the modes, ragas, whole-tone, or other “exotic” scales.'},
      ], lessons:[
      { h:'Pentatonic & blues scales', body:'Major and minor are only two of countless ways to carve up the octave. The <b>pentatonic</b> scale uses just five notes and contains <b>no half steps</b>, so nothing clashes — it appears in folk music the world over. Add one chromatic “blue note” and you get the soulful <b>blues scale</b>.',
        staff:{clef:'treble', key:'C', notes:'C4/8, D4, E4, G4, A4, C5, D5, E5'},
        harp:'The pentatonic is the <b>harp’s glissando scale</b>. Set your levers so the open strings spell a pentatonic and every sweep of your hand — up or down — pours out only consonant notes. This is the secret behind those cascading, dreamlike harp glissandi.' },
      { h:'Modes & the world’s scales', body:'Beyond pentatonic lie the <b>modes</b> (Dorian, Phrygian, Lydian…), the <b>ragas</b> of Indian classical music, whole-tone scales, and many “exotic” scales. Each divides the octave its own way and carries its own mood — proof that the major/minor system is one tradition among many.',
        harp:'Each mode is simply a different <b>lever recipe</b> on your harp — set the levers, and the open strings sing in that mode. Explore them on the Modes wheel: the harp makes modal playing as easy as changing a few levers.',
        action:{label:'Explore the modes →', view:'modes'} },
    ]},
    { n:42, title:'Transposition — Changing Key', quiz:[
        {q:'Name the four steps of transposing music.', a:'1) Choose your transposition; 2) write the new key signature; 3) move every note the same interval; 4) take care with accidentals.'},
        {q:'On the circle of fifths, which way do you move to transpose higher?', a:'Clockwise (toward more sharps) raises the key; counter-clockwise (toward more flats) lowers it.'},
        {q:'Why does a lever harpist most often transpose?', a:'To move a piece into a key the levers can actually reach (the E♭-tuning arc E♭–B♭–F–C–G–D–A–E) — or to suit a singer’s range.'},
      ], lessons:[
      { h:'Why transpose, and the four steps', body:'<b>Transposing</b> means moving a whole piece to a new key — it then sounds higher or lower, but every relationship between the notes stays the same. Musicians transpose to fit a <b>singer’s range</b>, to land in a <b>key that’s easier to play</b>, or to write for transposing instruments. The method has four steps: <b>1)</b> choose your transposition, <b>2)</b> write the new key signature, <b>3)</b> move every note the same interval, <b>4)</b> mind the accidentals.',
        harp:'For a lever harpist, transposing is mostly about reaching a <b>playable key</b>. A piece written in A♭ or D♭ sits outside the E♭-tuning lever range — transpose it into C, G, or E♭ and suddenly the whole thing falls under your hands with no retuning.' },
      { h:'Finding the new key', body:'Step two and three are pure circle-of-fifths thinking. To transpose <b>up</b>, move <b>clockwise</b> (toward sharps); to transpose <b>down</b>, move <b>counter-clockwise</b> (toward flats). Change the key signature by the chosen interval, then shift <b>every note</b> the same number of lines and spaces. Do that consistently and the melody arrives intact in its new home.',
        staff:{clef:'treble', key:'C', notes:'(D4 F#4 A4)/h, (E4 G#4 B4)/h'},
        harp:'Use the app’s Circle of Fifths as your transposing map: pick your starting key, count round to the new one, and read off the new lever recipe. The same tool that shows you the key shows you exactly which levers the transposed key needs.',
        action:{label:'Open the Circle of Fifths →', view:'circle'} },
      { h:'Choosing a harp-friendly key', body:'Before transposing, decide <b>which</b> new key. For a singer, find the one that fits their range. For yourself, choose a key your instrument plays well — and, the book notes, harpists (like pianists) “cannot make small tuning adjustments quickly,” so the key must be one your <b>levers can set</b>. Watch accidentals too: a borrowed sharp or flat may need re-spelling in the new key.',
        harp:'Your safe harbour is the eight-key arc from the Circle of Fifths — <b>E♭ B♭ F C G D A E</b>. If a piece lives outside it, transpose into the nearest key on the arc. You keep the music and gain a setting your levers can actually play.',
        action:{label:'Train your ear →', view:'eartraining'} },
    ]},
  ]},

  /* ===================== THEORY IN THE REAL WORLD (Open Music Theory v.2) ===================== */
  { sem:6, kicker:'Real-world', title:'Theory in the Real World', sub:'Pop, groove, blues & the living tradition',
    src:'Adapted from “Open Music Theory,” v.2 — ed. Mark Gotham, Kyle Gullings, Chelsey Hamm, Bryn Hughes, Brian Jarvis, Megan Lavengood & John Peterson (CC BY-SA 4.0). Pop chapters draw on Drew Nobile’s work; galant schemas follow Robert Gjerdingen; the Tonnetz chapter follows neo-Riemannian theory.', chapters:[
    { n:43, title:'The Pop Loops & Schemas', quiz:[
        {q:'Name the four chords of the “Axis” progression.', a:'I–V–vi–IV — the “four chords” behind hundreds of hits. Its rotations vi–IV–I–V and IV–I–V–vi are just the same loop started in a different place.'},
        {q:'What makes the doo-wop (’50s) progression I–vi–IV–V feel nostalgic?', a:'The vi and IV cushion the trip from home to the dominant, giving a gentle, rocking descent that a generation of ballads made iconic.'},
        {q:'Why are these loops a lever-harpist’s dream?', a:'A loop stays in one key, so once the levers are set you never touch them again — you just cycle four left-hand root shapes and improvise above.'},
      ], lessons:[
      { h:'Why loops rule pop', body:'Where classical music <b>modulates and develops</b>, most popular music <b>loops</b>: a short chord cycle repeats under changing melody and lyrics. The loop is a <b>schema</b> — a stock pattern listeners already know in their bones. Master a handful and you can play along with an enormous slice of recorded music.',
        harp:'A loop is the harp’s natural habitat. Because it never leaves the key, you set your levers once and the whole song plays lever-free. Learn the four root positions as <b>hand-spans</b> and the loop becomes muscle memory.' },
      { h:'The famous four', body:'The <b>Axis</b> loop <b>I–V–vi–IV</b> (and its rotations) underpins hundreds of songs. The <b>doo-wop / ’50s</b> loop <b>I–vi–IV–V</b> rocks nostalgically. The <b>lament / Andalusian</b> descent <b>i–VII–VI–V</b> falls darkly step by step. The <b>plagal “Puff” loop</b> and the <b>“stepwise-down” pop-Romanesca</b> round out the core vocabulary.',
        harp:'Set C or G and try the Axis loop rolled: <b>C–G–Am–F</b>, each chord a warm broken arpeggio. Then switch to the Andalusian in A minor — <b>Am–G–F–E</b> — and feel how the same instrument turns from sunlight to shadow with no lever change.' },
      { h:'Rotations & the “sensitive” loop', body:'Because a loop has no beginning, <b>where you start it</b> changes its colour. Start the Axis on vi (<b>vi–IV–I–V</b>) and you get the “sensitive female” loop — the same four chords heard as yearning rather than triumphant. This is why one progression can feel like ten different songs.',
        harp:'Experiment: play the same four strings-worth of chords but <b>begin the phrase on a different one</b>. Damp the bass to reset the ear each time. You’ll hear the “home” shift under your hands — a free composition lesson built into the loop.',
        action:{label:'Hear functions over a drone →', view:'meditation'} },
    ]},
    { n:44, title:'Fragile, Absent & Emergent Tonics', quiz:[
        {q:'What is a “fragile” tonic?', a:'A tonic that IS present but weakened — never in root position, never on a downbeat, or passed through so quickly the ear never fully rests on it.'},
        {q:'How can a song have an “absent” tonic?', a:'The loop circles the key but never actually sounds the I chord — the tonic is implied by the other chords yet never arrives, keeping the music suspended.'},
        {q:'What is an “emergent” tonic?', a:'A tonic withheld through the verse and only revealed at the chorus or drop — the arrival of home becomes the song’s big payoff.'},
      ], lessons:[
      { h:'When home won’t sit still', body:'Classical theory assumes a strong, obvious tonic. Modern pop often <b>destabilises</b> it on purpose (an idea from Drew Nobile’s work in OMT). A <b>fragile tonic</b> is there but weak — always inverted, always off the beat. The song has a home, but you’re never quite allowed to rest in it.',
        harp:'To voice a fragile tonic, <b>avoid the low root</b>. Play the I chord in first inversion (third in the bass) or let it ring only briefly before moving on. The harp’s sustain makes this delicious — the home chord glows, then slips away.' },
      { h:'The absent tonic', body:'Some loops <b>never play the tonic at all</b>. A progression like <b>IV–V–vi</b> repeated implies a key of I, yet I is never sounded — the ear leans toward a home that never comes. The effect is floating, restless, endlessly “about to arrive.”',
        harp:'You can <b>hint</b> at the absent tonic with a <b>pedal string</b>: let the low tonic ring quietly underneath while the chords above avoid it. The harp lets you imply the home key with a drone even as your hands refuse to land there.' },
      { h:'The emergent tonic', body:'The most dramatic option: <b>withhold the tonic until the chorus</b>. The verse wanders through pre-dominants and dominants; then the chorus finally <b>lands on I</b> and the whole song blooms. The tonic “emerges” as the emotional peak.',
        harp:'Arrange this with <b>texture</b>: keep the verse thin and high, deliberately dodging the low tonic string. When the chorus hits, <b>roll a full low tonic chord</b> — the sudden weight of home under your hands is the payoff the whole verse set up.',
        action:{label:'Feel the pull of home →', view:'meditation'} },
    ]},
    { n:45, title:'Pop Song Form', quiz:[
        {q:'What do the letters SRDC stand for?', a:'Statement, Restatement, Departure, Conclusion — a four-part phrase model that shapes countless verses and choruses.'},
        {q:'What is the job of a pre-chorus?', a:'To build tension and momentum between verse and chorus — often by rising, thinning the texture, or leaning on the dominant so the chorus lands harder.'},
        {q:'What is a “terminal climax”?', a:'A final section (often a last chorus, lifted or re-textured) that tops everything before it — the song’s highest emotional point saved for the end.'},
      ], lessons:[
      { h:'The building blocks', body:'Pop songs are assembled from labelled <b>sections</b>: <b>intro, verse, pre-chorus, chorus, bridge, outro</b>. The <b>verse</b> tells the story (new lyrics each time); the <b>chorus</b> is the fixed emotional centre; the <b>bridge</b> provides contrast before the last chorus. Recognising sections is the first step to arranging any song.',
        harp:'Give each section its own <b>harp texture</b>: sparse single notes for the verse, fuller rolled chords for the chorus, a change of register for the bridge. The listener feels the form even without the lyrics.' },
      { h:'SRDC — the shape inside a section', body:'Many verses and choruses follow <b>SRDC</b>: a <b>Statement</b>, a <b>Restatement</b> (often varied), a <b>Departure</b> (new material, rising tension), and a <b>Conclusion</b> (cadence home). It’s the pop cousin of the classical <b>sentence</b> — a satisfying miniature journey.',
        harp:'Play SRDC as a dynamic arc: state gently, restate a touch fuller, <b>build through the departure</b> (climb the strings, quicken the arpeggio), then settle at the conclusion. Your hands trace the emotional shape of the phrase.' },
      { h:'Tension architecture', body:'Great pop <b>engineers arrival</b>. The <b>pre-chorus</b> lifts you; the <b>chorus</b> pays off; the <b>bridge</b> resets so the final chorus feels new; a <b>terminal climax</b> — a lifted last chorus, key change, or thickened texture — saves the biggest moment for last.',
        harp:'For a terminal climax, <b>transpose the last chorus up</b> (Circle of Fifths thinking) or move it an octave higher on the harp and roll every chord. Even a solo harp can deliver that “final-chorus lift” that makes a room hold its breath.',
        action:{label:'Plan a key-lift on the circle →', view:'circle'} },
    ]},
    { n:46, title:'The Galant Schemas', quiz:[
        {q:'What is the “Rule of the Octave”?', a:'A stock harmonisation of the ascending and descending scale in the bass — each scale degree gets its conventional chord, giving a ready-made way to harmonise any bass line.'},
        {q:'What does a Prinner schema do?', a:'It answers an opening phrase with a stepwise descent (scale degrees 6–5–4–3 in the melody over a falling bass) — the classic “response” gesture of galant music.'},
        {q:'Why are schemas useful to a harpist?', a:'They’re pre-built two-hand patterns: learn the shape once and you can harmonise, improvise, or ornament in period style without working out every chord from scratch.'},
      ], lessons:[
      { h:'Music’s stock phrases', body:'Eighteenth-century composers built music from shared <b>schemas</b> — conventional voice-leading patterns (catalogued by Robert Gjerdingen). They’re the “stock phrases” of galant style: an opening gambit, a response, a cadence. Knowing them lets you hear Mozart’s grammar and improvise in it.',
        harp:'Schemas are gifts to the harpist because each is a <b>fixed shape</b> for two hands. Learn the pattern in one key and, with your levers set, the same finger-shape works — you’re improvising in Classical style by muscle memory.' },
      { h:'The core cast', body:'The <b>Romanesca</b> opens with a descending-bass pattern (think Pachelbel). The <b>Prinner</b> answers it with a 6–5–4–3 descent. The <b>Fonte</b> sinks by step (a “falling” sequence), the <b>Monte</b> climbs, and the <b>Ponte</b> holds on the dominant as a “bridge.” Chained together they build whole phrases.',
        harp:'Try a <b>Romanesca</b> in C: a stepwise-descending bass — <b>C–B–A–G–F–E–D–G</b> — with triads above. It’s the same descent behind “Canon in D” and a hundred pop ballads; on the harp it’s a gorgeous, lever-free walking bass.' },
      { h:'The Rule of the Octave', body:'The <b>Rule of the Octave</b> gives every bass scale-degree its default chord, so you can harmonise <b>any</b> rising or falling bass line instantly. It’s the practical engine behind figured-bass playing — a look-up table for “what chord goes here.”',
        harp:'Internalise the Rule and you can <b>harmonise a bass line on sight</b>: walk the low strings up or down and let your right hand place the conventional chord over each. It turns the harp into a continuo instrument.',
        action:{label:'Review figured bass →', view:'learn'} },
    ]},
    { n:47, title:'The Tonnetz & Smooth Chord Moves', quiz:[
        {q:'What are the three neo-Riemannian moves P, L, and R?', a:'P (Parallel): major↔minor on the same root. L (Leading-tone exchange): move one voice a semitone to swap e.g. C major↔E minor. R (Relative): major↔its relative minor (C↔Am).'},
        {q:'What do P, L, and R all have in common?', a:'Each changes only ONE note (by a semitone or a whole tone) and keeps the other two — maximally smooth voice leading between triads.'},
        {q:'Why does minimal voice-leading matter on a lever harp?', a:'The fewer notes that change, the fewer strings and levers you disturb — smooth voice leading literally means an easier, quieter hand.'},
      ], lessons:[
      { h:'A map made of thirds', body:'The <b>Tonnetz</b> (“tone-network”) is a lattice where notes are connected by thirds and fifths, and every triangle is a triad. It reveals relationships the circle of fifths hides — especially how <b>chromatic</b> chords far apart in key can sit right next to each other.',
        harp:'Think of the Tonnetz as a <b>map of nearby chords</b>. When you want a surprising but smooth change, look for the triad that shares two strings with your current one — it’s the neighbouring triangle on the map.' },
      { h:'P, L, and R', body:'<b>Neo-Riemannian</b> theory names three tiny moves. <b>P</b> (parallel) flips major↔minor on the same root (C↔Cm). <b>L</b> (leading-tone exchange) slides one voice a semitone (C↔Em). <b>R</b> (relative) swaps a chord for its relative (C↔Am). Each changes <b>only one note</b> — the smoothest possible chord change.',
        harp:'These are the harpist’s secret to <b>lush changes with lazy hands</b>. To go C→Am (an R move), you keep C and E ringing and just move G→A — one string. Chain P, L, R and you glide through far-flung chords barely moving your fingers.' },
      { h:'Chromatic magic', body:'Composers from Wagner to film scorers use PLR chains to <b>drift through distant keys</b> without a jolt, because each step is nearly motionless. The music feels like it’s <b>floating</b> between tonal centres — the sound of wonder and mystery.',
        harp:'For a cinematic drift, pick a triad and apply <b>L then R then L…</b>, moving one string at a time. On the harp this becomes a slow, glowing progression where each chord melts into the next — ideal for meditative or “space” textures.',
        action:{label:'Explore the Circle of Fifths →', view:'circle'} },
    ]},
    { n:48, title:'Groove, the Backbeat & the Drum Kit', quiz:[
        {q:'Where does the “backbeat” fall in 4/4?', a:'On beats 2 and 4 — usually the snare drum. The kick anchors 1 (and often 3); the backbeat on 2 and 4 gives rock and pop their drive.'},
        {q:'On a drum-set staff, roughly where do kick, snare, and hi-hat sit?', a:'Kick (bass drum) in the lowest space, snare in the middle, and hi-hat/cymbals as x-noteheads up top — a three-layer picture of the groove.'},
        {q:'How can a solo harp imply a drum groove?', a:'Put the bass note on 1 and 3, a chord “stab” on 2 and 4, and use palm-damping for a percussive, snare-like attack — the harp becomes its own rhythm section.'},
      ], lessons:[
      { h:'Feel is theory too', body:'Harmony gets the glory, but <b>groove</b> carries popular music. A groove is a repeating pattern of <b>kick, snare, and hi-hat</b> that defines the feel. Reading and feeling it is as much “theory” as any chord — and it’s where a lot of harpists are weakest.',
        harp:'The harp is secretly percussive. Every pluck has an <b>attack</b> you can sharpen or soften, and your palm can <b>damp</b> instantly. Treat the low strings as your kick and a mid chord as your snare, and you’ll groove without a drummer.' },
      { h:'Reading the kit', body:'Drum-set notation stacks the kit on one staff: <b>bass drum</b> low, <b>snare</b> middle, <b>hi-hat/cymbals</b> as ✗ noteheads on top. The classic “money beat” is <b>kick on 1 & 3, snare on 2 & 4, hats on every eighth</b>. Once you see that picture you can read most pop grooves.',
        harp:'Map the kit onto the harp: a <b>low string on 1 and 3</b> (kick), a <b>bright chord-stab on 2 and 4</b> (snare), and a light, steady <b>eighth-note arpeggio</b> up top (hi-hat). Three simple layers and the groove appears.' },
      { h:'The backbeat & the pocket', body:'The <b>backbeat</b> — emphasis on 2 and 4 — is the engine of rock, pop, gospel and soul. Sitting exactly in time (or a hair behind) is playing “in the <b>pocket</b>.” The pocket is felt, not calculated: it’s the difference between correct and <b>alive</b>.',
        harp:'Practise the pocket with the app’s rhythm tool: lock a bass-and-backbeat pattern, then let it <b>breathe</b> a touch behind the click. A harp that grooves is rare and unforgettable — this is how you get there.',
        action:{label:'Train your timing →', view:'eartraining'} },
    ]},
    { n:49, title:'The Blues', quiz:[
        {q:'Give the chords of a standard 12-bar blues in I.', a:'I–I–I–I · IV–IV–I–I · V–IV–I–V — twelve bars of I, IV and V, the backbone of blues, rock and roll, and jazz.'},
        {q:'What are the “blue notes”?', a:'Lowered/bent versions of the 3rd, 5th, and 7th scale degrees — pitches that live between the piano’s keys and give the blues its ache.'},
        {q:'How does a lever harpist reach blue notes?', a:'By flipping a lever mid-piece to lower a note (e.g. ♮→♭ for a flat 7th), or by voicing the blues/minor-pentatonic scale that the current lever setting already provides.'},
      ], lessons:[
      { h:'Twelve bars that built modern music', body:'The <b>12-bar blues</b> is a fixed 12-measure loop of <b>I, IV, and V</b> that underlies blues, R&B, rock and roll, and much of jazz. Over it, a singer or soloist uses <b>call and response</b> — a phrase, then an answer. It is arguably the most influential form of the last century.',
        harp:'Set the harp to a blues-friendly key and the whole 12-bar loop plays with three left-hand roots. Roll each chord or “walk” the bass; the harp gives the blues a shimmering, unexpected voice.' },
      { h:'Blue notes & the blues scale', body:'The soul of the blues is its <b>blue notes</b> — the flattened 3rd, 5th, and 7th, often <b>bent</b> between pitches. The <b>blues scale</b> (minor pentatonic plus the flat-5 “blue note”) is your improvising palette: 1–♭3–4–♭5–5–♭7.',
        harp:'A diatonic harp can’t bend, but the <b>levers</b> can give you the flats. Set a minor-pentatonic-friendly tuning and the blue notes are already under your fingers; flip a single lever mid-tune to darken a 7th on cue.' },
      { h:'Call, response & repetition', body:'Blues lyrics famously follow <b>AAB</b>: a line, the same line repeated, then a rhyming punchline — mirrored by the music’s call-and-response. This <b>repetition-with-variation</b> is the emotional engine, wringing meaning from a tiny amount of material.',
        harp:'Play call-and-response with <b>yourself</b>: a melodic “call” high on the strings, a chordal “response” low. The harp’s two registers let one player be both voices — a whole blues conversation from a single instrument.',
        action:{label:'Hear it over a drone →', view:'meditation'} },
    ]},
    { n:50, title:'Orchestration & Arranging for Harp', quiz:[
        {q:'What is “orchestration”?', a:'The art of choosing which instruments play what — assigning register, doubling, and texture so each line sits in its ideal colour and range.'},
        {q:'Name three idioms only the harp does well.', a:'Any of: sweeping glissandos, ringing harmonics, rolled (arpeggiated) chords, près-de-la-table metallic tones, and long natural sustain/pedal points.'},
        {q:'When arranging a lead sheet for solo harp, how do you split the hands?', a:'Bass and harmony in the left hand (root plus chord tones), melody in the right — leaving strings ringing to fill the texture between.'},
      ], lessons:[
      { h:'The right colour for each line', body:'<b>Orchestration</b> is deciding <b>who plays what</b>. Every instrument has a <b>range</b> and changing <b>timbre</b> across it (dark and rich low, bright and thin high). Good arranging places each line in its sweet spot and uses <b>doubling</b> and <b>register</b> to build a texture that breathes.',
        harp:'Know your harp’s zones: the <b>low strings</b> are warm and slow to speak, the <b>middle</b> sings, the <b>top</b> sparkles and decays fast. Put the melody where it glows and the bass where it grounds — that’s orchestration on one instrument.' },
      { h:'What only the harp can do', body:'Arrange <b>to the instrument’s strengths</b>. The harp owns effects no piano or guitar can match: the <b>glissando</b> sweep, ringing <b>harmonics</b>, the <b>rolled chord</b>, the metallic <b>près de la table</b>, and endless <b>sustain</b>. A great harp arrangement isn’t a piano part — it’s written for these idioms.',
        harp:'When you arrange a song, ask “where does a <b>gliss</b> belong? where a <b>harmonic</b>? where should I let a chord <b>ring untouched</b>?” Build the arrangement around those signature gestures and it will sound native to the harp.' },
      { h:'From lead sheet to harp arrangement', body:'A <b>lead sheet</b> gives melody + chord symbols. To arrange it: put the <b>bass and harmony in the left hand</b>, the <b>melody in the right</b>, and let the harp’s sustain fill the middle. Choose a <b>texture</b> (block chords, arpeggios, alternating bass) that fits the song’s feel.',
        harp:'Start simple: <b>left-hand root on the beat, right-hand melody</b>, and one broken-chord pattern for the whole verse. Add rolls and a gliss at the chorus. This four-step recipe turns any lead sheet into a playable, beautiful harp piece.',
        action:{label:'Find a song’s chords first →', view:'circle'} },
    ]},
    { n:51, title:'Sight-Singing & Solfège', quiz:[
        {q:'In moveable-do solfège, what syllable is always the tonic?', a:'Do — moveable-do assigns Do to the key’s tonic, so the same syllables map onto scale degrees in any key (Do-Re-Mi-Fa-Sol-La-Ti-Do).'},
        {q:'What is “audiation”?', a:'Hearing music in your mind before (or without) playing it — the inner ear. It’s the skill sight-singing trains, and the foundation of playing by ear.'},
        {q:'How does the harp help sight-singing?', a:'Its strings are a visible solfège ladder — you can see the scale degrees, sing a line, then check yourself instantly by plucking the string.'},
      ], lessons:[
      { h:'The inner ear', body:'<b>Sight-singing</b> means singing music you’ve never heard, from the page. It trains <b>audiation</b> — hearing music in your mind — which is the real engine behind <b>playing by ear</b>, improvising, and memorising. Even if you never “sing well,” the skill transforms your musicianship.',
        harp:'The harp is the perfect sight-singing partner: <b>sing a note, then pluck the string to check</b>. Because the strings are laid out like a ladder, you can <b>see</b> the interval you’re about to sing — the instrument makes the abstract visible.' },
      { h:'Solfège & scale degrees', body:'<b>Moveable-do solfège</b> gives each scale degree a syllable — <b>Do-Re-Mi-Fa-Sol-La-Ti</b> — with <b>Do always the tonic</b>. Learn how each degree <b>feels</b> (Ti aches up to Do; Fa leans to Mi; Sol is stable) and you can name and sing any melody by ear, in any key.',
        harp:'Set your levers, then label the strings <b>Do-Re-Mi…</b> from the tonic. Play and sing the syllables together. Soon you’ll <b>hear a melody and know its solfège</b> — which means you can find it on the strings without sheet music.' },
      { h:'A daily practice', body:'Build the ear with a simple routine: sing <b>scales</b> in solfège, then <b>arpeggios</b> (Do-Mi-Sol), then short <b>stepwise melodies</b>, always checking against the instrument. A few minutes a day compounds into the ability to <b>play what you hear</b> — the goal behind every other chapter in this course.',
        harp:'Use the app’s ear-training tool as your check: sing an interval, name it in solfège, then confirm. Pair it with the harp and you close the loop — <b>ear, voice, and hand all speaking the same language</b>.',
        action:{label:'Open ear training →', view:'eartraining'} },
    ]},
  ]},
];

/* ============================================================
   INTERACTIVE CIRCLE OF FIFTHS — built for the lever harp
   Adapted from "The Lever Harp: Key Signatures" & "Chords on the Scale".
   An E♭-tuned harp (B♭ E♭ A♭, all levers down) reaches a continuous
   arc of eight keys — E♭ B♭ F C G D A E — one lever bank at a time.
   ============================================================ */
const CIRCLE_INTRO = 'Built for a harp tuned to E♭ (B♭, E♭, A♭ — all levers down). From there you reach a continuous arc of eight keys, one lever bank at a time. Tap any key.';

/* pos 0 = top (C major), clockwise. accN = +sharps / −flats. lever = absolute setting from E♭ tuning. */
const CIRCLE_KEYS = [
  { pos:0,  maj:'C',  min:'Am',  acc:'no sharps or flats',     accN:0,  reach:true,  lever:'Raise the A, E and B levers — every string is now a natural.' },
  { pos:1,  maj:'G',  min:'Em',  acc:'1 sharp · F♯',           accN:1,  reach:true,  lever:'Raise A, E, B and the F levers (F♯).' },
  { pos:2,  maj:'D',  min:'Bm',  acc:'2 sharps · F♯ C♯',       accN:2,  reach:true,  lever:'Raise A, E, B, F and the C levers (F♯ C♯).' },
  { pos:3,  maj:'A',  min:'F♯m', acc:'3 sharps · F♯ C♯ G♯',    accN:3,  reach:true,  lever:'Raise A, E, B, F, C and the G levers (F♯ C♯ G♯).' },
  { pos:4,  maj:'E',  min:'C♯m', acc:'4 sharps · F♯ C♯ G♯ D♯', accN:4,  reach:true, edge:true, lever:'Raise A, E, B, F, C, G and the D levers (F♯ C♯ G♯ D♯). The far edge of the E♭ range — used sparingly.' },
  { pos:5,  maj:'B',  min:'G♯m', acc:'5 sharps · F♯ C♯ G♯ D♯ A♯',    accN:5,  reach:false, enh:'C♭', lever:'Beyond the E♭ lever range — would need retuning.' },
  { pos:6,  maj:'F♯', min:'D♯m', acc:'6 sharps · F♯ C♯ G♯ D♯ A♯ E♯', accN:6,  reach:false, enh:'G♭', lever:'Beyond the E♭ lever range — would need retuning.' },
  { pos:7,  maj:'D♭', min:'B♭m', acc:'5 flats · B♭ E♭ A♭ D♭ G♭',     accN:-5, reach:false, enh:'C♯', lever:'Beyond the E♭ lever range — would need retuning.' },
  { pos:8,  maj:'A♭', min:'Fm',  acc:'4 flats · B♭ E♭ A♭ D♭',        accN:-4, reach:false, lever:'Needs a 4-flat (A♭) tuning. Many UK harpers tune here, trading the key of E for A♭ and D♭.' },
  { pos:9,  maj:'E♭', min:'Cm',  acc:'3 flats · B♭ E♭ A♭',     accN:-3, reach:true, home:true, lever:'Home tuning — all levers down. This is where the harp rests.' },
  { pos:10, maj:'B♭', min:'Gm',  acc:'2 flats · B♭ E♭',        accN:-2, reach:true,  lever:'From E♭, raise just the A levers (A♭→A). Two flats remain: B♭, E♭.' },
  { pos:11, maj:'F',  min:'Dm',  acc:'1 flat · B♭',            accN:-1, reach:true,  lever:'Raise the A and E levers. One flat remains: B♭.' },
];

/* Diatonic triads per major key (root names). Qualities & Roman numerals are constant. */
const CIRCLE_DIATONIC = {
  'C':  ['C','Dm','Em','F','G','Am','B°'],
  'G':  ['G','Am','Bm','C','D','Em','F♯°'],
  'D':  ['D','Em','F♯m','G','A','Bm','C♯°'],
  'A':  ['A','Bm','C♯m','D','E','F♯m','G♯°'],
  'E':  ['E','F♯m','G♯m','A','B','C♯m','D♯°'],
  'B':  ['B','C♯m','D♯m','E','F♯','G♯m','A♯°'],
  'F♯': ['F♯','G♯m','A♯m','B','C♯','D♯m','E♯°'],
  'D♭': ['D♭','E♭m','Fm','G♭','A♭','B♭m','C°'],
  'A♭': ['A♭','B♭m','Cm','D♭','E♭','Fm','G°'],
  'E♭': ['E♭','Fm','Gm','A♭','B♭','Cm','D°'],
  'B♭': ['B♭','Cm','Dm','E♭','F','Gm','A°'],
  'F':  ['F','Gm','Am','B♭','C','Dm','E°'],
};
const CIRCLE_RN_MAJOR = ['I','ii','iii','IV','V','vi','vii°'];
const CIRCLE_RN_MINOR = ['i','ii°','III','iv','v','VI','VII'];

/* Music-theory lessons to link from the circle (chapter numbers in THEORY_COURSE). */
const CIRCLE_LINKS = [
  { n:2,  label:'Major scales & key signatures' },
  { n:7,  label:'Diatonic chords & Roman numerals' },
  { n:9,  label:'The circle-of-fifths progression' },
  { n:22, label:'Modulation — changing key' },
];
