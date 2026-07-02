/* ============================================================
   Strings of Hope · Modes — data model
   Distilled from the "What is a Mode" + "Theory 101" sheets.
   ============================================================ */

const MODE_NAMES = ["Ionian","Dorian","Phrygian","Lydian","Mixolydian","Aeolian","Locrian"];
const ROMAN      = ["I","ii","iii","IV","V","vi","vii°"];
const QUALITY    = ["major","minor","minor","major","major","minor","dim"];
const SUFFIX     = ["","m","m","","","m","°"];
/* CSS custom-property name per scale degree — also the colour of the mode that starts there */
const VAR = ['--m1','--m2','--m3','--m4','--m5','--m6','--m7'];

/* the fixed C-major "mother scale" ring (clockwise from 12 o'clock) */
const RING_NOTES = ["C","D","E","F","G","A","B"];

/* ---------- the 7 modes, shown in C ----------
   wheelFlavor = the note that glows on the clock (null = none)
   wheelHint   = a soft secondary note for the no-flavor modes
   ringPos of each mode's root == its index (Ionian→C … Locrian→B) */
const MODES = [
  {n:1,name:"Ionian",greek:"the major",q:"major",flavor:"none",flavorTxt:"home",root:"C",
   notes:["C","D","E","F","G","A","B"],flav:-1,chord:"C",chordNotes:"C E G",feel:"Bright, settled,\ncomplete.",
   wheelFlavor:null, wheelFlavorTxt:null, wheelHint:"E", wheelLine:"no flavor note · E makes it major"},
  {n:2,name:"Dorian",greek:"minor · lifted 6th",q:"minor",flavor:"♮6",flavorTxt:"♮6",root:"D",
   notes:["D","E","F","G","A","B","C"],flav:5,chord:"Dm",chordNotes:"D F A",feel:"Minor, yet\nhopeful.",
   wheelFlavor:"B", wheelFlavorTxt:"♮6 (B)", wheelHint:null, wheelLine:"flavor · ♮6 — the B"},
  {n:3,name:"Phrygian",greek:"minor · lowered 2nd",q:"minor",flavor:"♭2",flavorTxt:"♭2",root:"E",
   notes:["E","F","G","A","B","C","D"],flav:1,chord:"Em",chordNotes:"E G B",feel:"Dark, ancient,\nmysterious.",
   wheelFlavor:"F", wheelFlavorTxt:"♭2 (F)", wheelHint:null, wheelLine:"flavor · ♭2 — the F"},
  {n:4,name:"Lydian",greek:"major · raised 4th",q:"major",flavor:"♯4",flavorTxt:"♯4",root:"F",
   notes:["F","G","A","B","C","D","E"],flav:3,chord:"F",chordNotes:"F A C",feel:"Dreamy,\nfloating.",
   wheelFlavor:"B", wheelFlavorTxt:"♯4 (B)", wheelHint:null, wheelLine:"flavor · ♯4 — the B"},
  {n:5,name:"Mixolydian",greek:"major · lowered 7th",q:"major",flavor:"♭7",flavorTxt:"♭7",root:"G",
   notes:["G","A","B","C","D","E","F"],flav:6,chord:"G",chordNotes:"G B D",feel:"Joyful with\na bluesy edge.",
   wheelFlavor:"F", wheelFlavorTxt:"♭7 (F)", wheelHint:null, wheelLine:"flavor · ♭7 — the F"},
  {n:6,name:"Aeolian",greek:"the natural minor",q:"minor",flavor:"none",flavorTxt:"the minor",root:"A",
   notes:["A","B","C","D","E","F","G"],flav:-1,chord:"Am",chordNotes:"A C E",feel:"Tender,\nreflective.",
   wheelFlavor:null, wheelFlavorTxt:null, wheelHint:"C", wheelLine:"no flavor note · C is its minor heart"},
  {n:7,name:"Locrian",greek:"diminished · lowered 5th",q:"dim",flavor:"♭5",flavorTxt:"♭5",root:"B",
   notes:["B","C","D","E","F","G","A"],flav:4,chord:"B°",chordNotes:"B D F",feel:"Restless,\nunresolved.",
   wheelFlavor:"F", wheelFlavorTxt:"♭5 (F)", wheelHint:null, wheelLine:"flavor · ♭5 — the F"},
];

/* ---------- Verse of the day (starter set — expandable to 365) ----------
   Brand thread: "a threefold cord" (Ecclesiastes 4:12) → Strings of Hope. */
/* he = consonantal Hebrew (Torah-script / STA"M style, no nikud); heref = Hebrew Tanakh reference; tr = simple transliteration */
const VERSES = [
  {ref:'Ecclesiastes 4:12', heref:'קהלת ד:יב', he:'והחוט המשלש לא במהרה ינתק', tr:'V’ha’chut ha’meshulash lo bimherah yinatek.', text:'A threefold cord is not quickly broken.'},
  {ref:'Psalm 33:2',  heref:'תהילים לג:ב', he:'הודו ליהוה בכנור בנבל עשור זמרו לו', tr:'Hodu la’Adonai b’chinor, b’nevel asor zamru lo.', text:'Praise the LORD with the harp; sing to Him with the ten‑stringed lyre.'},
  {ref:'Psalm 150:4', heref:'תהילים קנ:ד', he:'הללוהו בתף ומחול הללוהו במנים ועגב', tr:'Hal’luhu b’tof u’machol, hal’luhu b’minim v’ugav.', text:'Praise Him with timbrel and dance; praise Him with strings and pipe.'},
  {ref:'Psalm 57:8',  heref:'תהילים נז:ח', he:'עורה כבודי עורה הנבל וכנור אעירה שחר', tr:'Urah k’vodi, urah ha’nevel v’chinor, a’irah shachar.', text:'Awake, my soul! Awake, harp and lyre! I will awaken the dawn.'},
  {ref:'Psalm 92:1‑3',heref:'תהילים צב:א-ג', he:'טוב להדות ליהוה ולזמר לשמך עליון', tr:'Tov l’hodot la’Adonai, u’lzamer l’shimcha Elyon.', text:'It is good to praise the LORD… to the music of the ten‑stringed lyre and the harp.'},
  {ref:'Psalm 30:11', heref:'תהילים ל:יא', he:'הפכת מספדי למחול לי פתחת שקי ותאזרני שמחה', tr:'Hafachta mispdi l’machol li, pitachta saki vat’azreni simcha.', text:'You turned my mourning into dancing; You loosed my sackcloth and clothed me with joy.'},
  {ref:'Psalm 27:1',  heref:'תהילים כז:א', he:'יהוה אורי וישעי ממי אירא', tr:'Adonai ori v’yish’i, mimi ira.', text:'The LORD is my light and my salvation; whom shall I fear?'},
  {ref:'Psalm 118:24',heref:'תהילים קיח:כד', he:'זה היום עשה יהוה נגילה ונשמחה בו', tr:'Zeh ha’yom asah Adonai, nagilah v’nismecha vo.', text:'This is the day the LORD has made; let us rejoice and be glad in it.'},
  {ref:'Psalm 16:11', heref:'תהילים טז:יא', he:'תודיעני ארח חיים שבע שמחות את פניך', tr:'Todi’eni orach chayim, sova s’machot et panecha.', text:'You make known to me the path of life; in Your presence is fullness of joy.'},
  {ref:'Psalm 119:105',heref:'תהילים קיט:קה', he:'נר לרגלי דברך ואור לנתיבתי', tr:'Ner l’ragli d’varecha, v’or lin’tivati.', text:'Your word is a lamp to my feet and a light to my path.'},
  {ref:'Psalm 23:4', heref:'תהילים כג:ד', he:'גם כי אלך בגיא צלמות לא אירא רע כי אתה עמדי', tr:'Gam ki elech b’gei tzalmavet, lo ira ra, ki Atah imadi.', text:'Even though I walk through the valley of the shadow of death, I will fear no evil.'},
  {ref:'Psalm 34:8', heref:'תהילים לד:ח', he:'טעמו וראו כי טוב יהוה אשרי הגבר יחסה בו', tr:'Ta’amu u’r’u ki tov Adonai, ashrei ha’gever yecheseh bo.', text:'Taste and see that the LORD is good; blessed is the one who takes refuge in Him.'},
  {ref:'Psalm 37:4', heref:'תהילים לז:ד', he:'והתענג על יהוה ויתן לך משאלת לבך', tr:'V’hit’anag al Adonai, v’yiten l’cha mish’alot libecha.', text:'Delight yourself in the LORD, and He will give you the desires of your heart.'},
  {ref:'Psalm 46:10',heref:'תהילים מו:י', he:'הרפו ודעו כי אנכי אלהים', tr:'Harpu u’d’u ki Anochi Elohim.', text:'Be still, and know that I am God.'},
  {ref:'Psalm 121:1',heref:'תהילים קכא:א', he:'אשא עיני אל ההרים מאין יבא עזרי', tr:'Esa einai el he’harim, me’ayin yavo ezri.', text:'I lift up my eyes to the hills — where does my help come from?'},
  {ref:'Psalm 126:5',heref:'תהילים קכו:ה', he:'הזרעים בדמעה ברנה יקצרו', tr:'Ha’zor’im b’dim’ah b’rinah yiktzoru.', text:'Those who sow in tears shall reap with songs of joy.'},
  {ref:'Psalm 147:3',heref:'תהילים קמז:ג', he:'הרפא לשבורי לב ומחבש לעצבותם', tr:'Ha’rofei lish’vurei lev, u’mchabesh l’atzvotam.', text:'He heals the brokenhearted and binds up their wounds.'},
  {ref:'Isaiah 40:31', heref:'ישעיהו מ:לא', he:'וקוי יהוה יחליפו כח יעלו אבר כנשרים', tr:'V’kovei Adonai yachalifu cho’ach, ya’alu ever ka’n’sharim.', text:'Those who hope in the LORD will renew their strength; they will soar on wings like eagles.'},
  {ref:'Isaiah 12:2',  heref:'ישעיהו יב:ב', he:'כי עזי וזמרת יה יהוה ויהי לי לישועה', tr:'Ki ozi v’zimrat Yah Adonai, vay’hi li li’shuah.', text:'The LORD is my strength and my song; He has become my salvation.'},
  {ref:'Isaiah 41:10', heref:'ישעיהו מא:י', he:'אל תירא כי עמך אני אל תשתע כי אני אלהיך', tr:'Al tira ki im’cha Ani, al tishta ki Ani Elohecha.', text:'Do not fear, for I am with you; do not be dismayed, for I am your God.'},
  {ref:'Jeremiah 29:11',heref:'ירמיהו כט:יא', he:'כי אנכי ידעתי את המחשבת אשר אנכי חשב עליכם', tr:'Ki Anochi yadati et ha’machashavot asher Anochi choshev aleichem.', text:'For I know the plans I have for you — plans to give you hope and a future.'},
  {ref:'Zephaniah 3:17',heref:'צפניה ג:יז', he:'ישיש עליך בשמחה יחריש באהבתו יגיל עליך ברנה', tr:'Yasis alayich b’simcha, yacharish b’ahavato, yagil alayich b’rinah.', text:'He will rejoice over you with gladness; He will quiet you with His love, and exult over you with singing.'},
  {ref:'Lamentations 3:22‑23',heref:'איכה ג:כב-כג', he:'חדשים לבקרים רבה אמונתך', tr:'Chadashim la’b’karim, rabah emunatecha.', text:'His mercies are new every morning; great is Your faithfulness.'},
  {ref:'Proverbs 3:5',  heref:'משלי ג:ה', he:'בטח אל יהוה בכל לבך ואל בינתך אל תשען', tr:'B’tach el Adonai b’chol libecha, v’el binat’cha al tisha’en.', text:'Trust in the LORD with all your heart, and lean not on your own understanding.'},
  {ref:'Deuteronomy 31:6',heref:'דברים לא:ו', he:'חזקו ואמצו אל תיראו כי יהוה אלהיך הוא ההלך עמך', tr:'Chizku v’imtzu, al tir’u, ki Adonai Elohecha Hu ha’holech imach.', text:'Be strong and courageous… for the LORD your God goes with you.'},
  {ref:'Exodus 15:2',   heref:'שמות טו:ב', he:'עזי וזמרת יה ויהי לי לישועה', tr:'Ozi v’zimrat Yah, vay’hi li li’shuah.', text:'The LORD is my strength and my song, and He has become my salvation.'},
  {ref:'Numbers 6:24‑26',heref:'במדבר ו:כד-כו', he:'יברכך יהוה וישמרך יאר יהוה פניו אליך ויחנך', tr:'Y’varech’cha Adonai v’yishmerecha, ya’er Adonai panav elecha vichuneka.', text:'The LORD bless you and keep you; the LORD make His face shine upon you.'},
  {ref:'1 Samuel 16:23',heref:'שמואל א טז:כג', he:'ולקח דוד את הכנור ונגן בידו ורוח לשאול וטוב לו וסרה מעליו רוח הרעה', tr:'V’lakach David et ha’kinor v’nigen b’yado, v’ravach l’Shaul v’tov lo, v’sarah me’alav ru’ach ha’ra’ah.', text:'David would take up his harp and play; relief would come and the distress would leave.'},
  {ref:'Nehemiah 8:10', heref:'נחמיה ח:י', he:'כי חדות יהוה היא מעזכם', tr:'Ki chedvat Adonai hi ma’uzchem.', text:'The joy of the LORD is your strength.'},
  {ref:'Song of Songs 2:12',heref:'שיר השירים ב:יב', he:'הנצנים נראו בארץ עת הזמיר הגיע', tr:'Ha’nitzanim nir’u va’aretz, et ha’zamir higia.', text:'Flowers appear on the earth; the season of singing has come.'},
  {ref:'Habakkuk 3:19', heref:'חבקוק ג:יט', he:'יהוה אדני חילי וישם רגלי כאילות', tr:'Adonai Adonai cheili, vay’sem raglai ka’ayalot.', text:'The Sovereign LORD is my strength; He makes my feet like the feet of a deer.'},
  {ref:'Psalm 108:1',heref:'תהילים קח:א', he:'נכון לבי אלהים אשירה ואזמרה אף כבודי', tr:'Nachon libi Elohim, ashirah va’azamrah af k’vodi.', text:'My heart is steadfast, O God; I will sing and make music with all my soul.'},
];

/* ---------- Modal Universe: any key × four parent worlds, all their named modes ---------- */
const KEYS12 = ['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];

const PARENT_WORLDS = [
  {key:'major', name:'Major', tone:'--m1', formula:[0,2,4,5,7,9,11], blurb:'The seven classic modes — the foundation of Western melody.',
   modes:[
    {name:'Ionian',        mood:'bright, complete — the major'},
    {name:'Dorian',        mood:'minor, yet hopeful'},
    {name:'Phrygian',      mood:'dark, ancient, Spanish'},
    {name:'Lydian',        mood:'dreamy, floating'},
    {name:'Mixolydian',    mood:'joyful with a bluesy edge'},
    {name:'Aeolian',       mood:'the natural minor — tender'},
    {name:'Locrian',       mood:'unstable, restless'},
  ]},
  {key:'harmonic-minor', name:'Harmonic Minor', tone:'--m3', formula:[0,2,3,5,7,8,11], blurb:'The dramatic minor with a raised 7th — home of Hijaz & the desert colours.',
   modes:[
    {name:'Harmonic Minor',     mood:'dark, classical, dramatic'},
    {name:'Locrian ♮6',         mood:'tense, half-lit'},
    {name:'Ionian ♯5',          mood:'augmented, mysterious major'},
    {name:'Ukrainian Dorian',   mood:'Eastern European, wandering'},
    {name:'Phrygian Dominant',  mood:'Middle Eastern, Hijaz, sacred'},
    {name:'Lydian ♯2',          mood:'exotic, shimmering'},
    {name:'Super Locrian ♭♭7',  mood:'the darkest, fully altered'},
  ]},
  {key:'melodic-minor', name:'Melodic Minor', tone:'--m2', formula:[0,2,3,5,7,9,11], blurb:'The smooth jazz/cinematic minor and its luminous modes.',
   modes:[
    {name:'Melodic Minor',      mood:'smooth minor, jazzy'},
    {name:'Dorian ♭2',          mood:'soft, exotic minor'},
    {name:'Lydian Augmented',   mood:'bright, weightless'},
    {name:'Lydian Dominant',    mood:'overtone, bluesy-bright'},
    {name:'Mixolydian ♭6',      mood:'bittersweet, Hindu'},
    {name:'Aeolian ♭5',         mood:'half-diminished, melancholic'},
    {name:'Altered',            mood:'tense, jazz, fully altered'},
  ]},
  {key:'double-harmonic', name:'Double Harmonic · Byzantine', tone:'--m4', formula:[0,1,4,5,7,8,11], blurb:'The Byzantine / Arabic world — sacred, ancient, and its Hungarian & Oriental modes.',
   modes:[
    {name:'Double Harmonic Major', mood:'Byzantine, sacred, ancient'},
    {name:'Lydian ♯2 ♯6',          mood:'radiant, exotic'},
    {name:'Ultraphrygian',         mood:'dark, mysterious'},
    {name:'Hungarian Minor',       mood:'dramatic, mystical'},
    {name:'Oriental',              mood:'Arabic, vivid, desert'},
    {name:'Ionian ♯2 ♯5',          mood:'strange, augmented'},
    {name:'Locrian ♭♭3 ♭♭7',       mood:'the deepest, most altered'},
  ]},
];

/* ---------- guided "Journey Through the Modes" lesson copy (replicates the teaching video) ---------- */
const JOURNEY_LEAD = {
  Ionian:"Meet the mother scale — C major. Play it from C up to C and you're in Ionian: the bright, settled major sound. Every other mode hides inside these same seven notes.",
  Dorian:"Keep the very same notes, but make D your home. That's Dorian — minor, yet hopeful. Its colour is the natural 6th: the B.",
  Phrygian:"Now begin on E. Phrygian — dark and ancient. Its flavor is the lowered 2nd, the F sitting right against the root.",
  Lydian:"Begin on F. Lydian — dreamy and floating, a major scale with stars in it. Its flavor is the raised 4th: the B.",
  Mixolydian:"Begin on G. Mixolydian — joyful with a bluesy edge. Its flavor is the lowered 7th: the F.",
  Aeolian:"Begin on A. Aeolian — the natural minor: tender and reflective. It has no single flavor note; it simply is the minor.",
  Locrian:"Begin on B. Locrian — restless and unresolved. Its flavor is the lowered 5th: the F. Rare, but haunting in the right moment.",
};

/* ---------- per-mode "Find the Difference": each mode vs its PARALLEL major/minor ----------
   diff = index (0-6) of the single degree that differs (the flavor); -1 = identical */
const PARALLELS = {
  Ionian:     {label:"C major", quality:"major", notes:["C","D","E","F","G","A","B"], diff:-1},
  Dorian:     {label:"D minor", quality:"minor", notes:["D","E","F","G","A","B♭","C"], diff:5},
  Phrygian:   {label:"E minor", quality:"minor", notes:["E","F♯","G","A","B","C","D"], diff:1},
  Lydian:     {label:"F major", quality:"major", notes:["F","G","A","B♭","C","D","E"], diff:3},
  Mixolydian: {label:"G major", quality:"major", notes:["G","A","B","C","D","E","F♯"], diff:6},
  Aeolian:    {label:"A minor", quality:"minor", notes:["A","B","C","D","E","F","G"], diff:-1},
  Locrian:    {label:"B minor", quality:"minor", notes:["B","C♯","D","E","F♯","G","A"], diff:4},
};

/* ---------- major keys (harp-friendly), correctly spelled ---------- */
const KEYS = [
  {tonic:"C",  notes:["C","D","E","F","G","A","B"]},
  {tonic:"G",  notes:["G","A","B","C","D","E","F♯"]},
  {tonic:"D",  notes:["D","E","F♯","G","A","B","C♯"]},
  {tonic:"A",  notes:["A","B","C♯","D","E","F♯","G♯"]},
  {tonic:"E",  notes:["E","F♯","G♯","A","B","C♯","D♯"]},
  {tonic:"F",  notes:["F","G","A","B♭","C","D","E"]},
  {tonic:"B♭",notes:["B♭","C","D","E♭","F","G","A"]},
  {tonic:"E♭",notes:["E♭","F","G","A♭","B♭","C","D"]},
];

/* build the 7 diatonic triads of a major key by stacking thirds within the scale */
function diatonicChords(key){
  const s = key.notes;
  return s.map((root,i)=>{
    const third = s[(i+2)%7], fifth = s[(i+4)%7];
    return {
      degree:i,
      roman:ROMAN[i],
      name: root + SUFFIX[i],
      notes:[root,third,fifth].join(" "),
      quality:QUALITY[i],
      mode:MODE_NAMES[i],
      is145:(i===0||i===3||i===4),
    };
  });
}

function relativeMinorName(key){
  return diatonicChords(key)[5].name; // the vi chord
}

/* ---------- lever harp (tuned in 3 flats: E♭ A♭ B♭) ----------
   Lever DOWN = base tuning; lever UP raises that string a semitone. */
const BASE_TUNING = {C:"C", D:"D", E:"E♭", F:"F", G:"G", A:"A♭", B:"B♭"};

/* for a major key, work out each string's lever state (up/down) and what it sounds */
function leverStates(key){
  const byLetter = {};
  key.notes.forEach(n => { byLetter[n[0]] = n; });   // each letter appears once in a major scale
  return ["C","D","E","F","G","A","B"].map(L => {
    const sounds = byLetter[L];
    return { letter:L, sounds, base:BASE_TUNING[L], up: sounds !== BASE_TUNING[L] };
  });
}

/* ============================================================
   Simcha's "A Journey Through the Modes" — teaching per mode.
   Distilled from the workshop transcript: the character note, the
   CHARACTER CHORD (a chord holding that note, which sings the mode),
   his left-hand pattern, a song example, and a contemplative prompt.
   ============================================================ */
const MODE_TEACHING = {
  Ionian:    { framing:'Bright, settled, complete — the major we all know.',
    char:'No single flavour note — it simply IS the major; the E (its 3rd) makes it major.',
    chord:'C major · C major 7th (add the B on top) to sweeten it',
    pattern:'C in the bass, left hand C·E·G, a steady 1-2-3-4; let the right hand wander the scale.',
    song:'“Concerning Hobbits” — the classic, contented major.',
    reflect:'Rest here. What in your life is already whole, already home?', psalm:'Psalms 100' },
  Dorian:    { framing:'Minor, yet hopeful — the sorrow that still believes.',
    char:'The natural 6th — the B. Until you touch it, it’s just a minor.',
    chord:'G major — the B lives in its middle. In plain D-minor that chord would be G-minor; the natural B makes it major, and that sings Dorian.',
    pattern:'D in the bass, a 6/8 ostinato (1-2-3, third-finger & thumb); let the right hand dance around the B.',
    song:'“Scarborough Fair” — it only touches the B once, and that’s enough.',
    reflect:'Hold sorrow and hope in the same hand. What hope lives inside your ache?', psalm:'Psalms 30' },
  Phrygian:  { framing:'Dark, ancient, Spanish — the depths.',
    char:'The lowered 2nd — the F sitting right against the root E.',
    chord:'F major — built on that ♭2; play E in the bass beneath it.',
    pattern:'E in the bass, dance the right hand around the F just above the root.',
    song:'“Set the Controls for the Heart of the Sun” — Pink Floyd.',
    reflect:'Sit with what is ancient in you. What longing has been there a long time?', psalm:'Psalms 130' },
  Lydian:    { framing:'Dreamy, searching, reaching for the unknown — it never quite resolves.',
    char:'The raised 4th — the B floating over the F. It is the magnet; touch it, don’t land on it.',
    chord:'G major to “bloom” upward, E minor to let the sorrow back in — both shift because of that natural B.',
    pattern:'F in the bass; circle the B. Bring in G major to open the light, drop to E minor to feel the depth, return to F.',
    song:'A bridge to the unknown — “sometimes it’s okay to let the unresolved be.”',
    reflect:'What unresolved question can you let simply be, without rushing to answer it?', psalm:'Psalms 27' },
  Mixolydian:{ framing:'Joyful with a bluesy edge.',
    char:'The lowered 7th — the F.',
    chord:'F major — a chord holding that F is what makes the mode sing.',
    pattern:'G in the bass, left hand G·B·D, a 1-2-3 groove; the right hand circles the F.',
    song:'“Dark Star” — Grateful Dead.',
    reflect:'Let joy have its rough edge. Where can you celebrate without needing it perfect?', psalm:'Psalms 150' },
  Aeolian:   { framing:'Tender, yearning — the natural minor.',
    char:'No single flavour note; let its ♭3 (the C) carry the story.',
    chord:'A minor — and the move A-minor → E-minor is heavy and beautiful in this world.',
    pattern:'A in the bass; a rolling bisbigliando A·C·E in both hands; let the thumb lift a melody out.',
    song:'“Shine On You Crazy Diamond” — Pink Floyd.',
    reflect:'Let yearning be prayer. What is your heart reaching toward?', psalm:'Psalms 42' },
  Locrian:   { framing:'Restless, unresolved — it wants to fall home to C.',
    char:'The lowered 5th — the most dissonant of the modes.',
    chord:'Diminished — soften it by adding the 7th (B·D·F·A); then let it resolve.',
    pattern:'Use the tension on purpose, then release it down to C — let the dissonance be felt, and healed.',
    song:'“Black Sabbath” — Black Sabbath (the sound of unease).',
    reflect:'Some things stay unresolved. Can you let the tension be held, and trust the resolve to come?', psalm:'Psalms 13' },
};
/* Simcha's deeper world — beyond the seven major modes */
const MODE_TEACHING_EXTRA = [
  { name:'Phrygian Dominant · Hijaz', from:'the 5th mode of the harmonic minor',
    note:'Raise the 7th of A-minor (the G→G♯), then start on the E: this is the Hijaz — “welcome to the Middle East.” Chords E·F·D·E.' },
  { name:'Hijaz Zirguleli · Double Harmonic', from:'raise the D as well',
    note:'From Hijaz, sharpen the D too — two harmonic-minor intervals in one scale. Simcha calls it “the Aladdin scale.”' },
  { name:'The Major 7th',
    note:'A C-major 7th holds an A-minor inside it (¾ of its notes). Adding the root “hugs” the sorrow and sweetens it — the same magic as changing the tonic. It pairs beautifully with Lydian.' },
  { name:'Split the harp',
    note:'Tune your low + high octaves to D-minor (B♭) and the middle to Dorian (B♮): now one harp holds two modes, and you can travel between worlds mid-piece.' },
];

/* ============================================================
   Simcha's Modes Course — a pure music teaching pathway.
   Six chapters distilled from "A Journey Through the Modes" Pts 1 & 2.
   No scripture here: this is purely the music teaching.
   (Chapter 'seven' expands the 7 modes from MODES + MODE_TEACHING.)
   ============================================================ */
const SIMCHA_COURSE = [
  { key:'found', title:'Foundations', sub:'Key · scale · mode', lessons:[
    { h:'What is a key?', body:'The key is the tonal centre — where a piece feels like home, where it begins and where it resolves back to. It tells you which notes you’ll be using.', harp:'For a harpist the key is your lever tuning. To play in C major, set your levers to C — if you’re tuned to E♭, raise the E, A and B.' },
    { h:'What is a scale?', body:'A scale is a set of notes in order, one after the other, built from a specific pattern of whole and half steps — the intervals, the spaces between the notes. C D E F G A B C is the major scale.' },
    { h:'What is a mode?', body:'A mode is a scale with its own pattern of whole and half steps, made by starting on a different note of a scale. Each mode has its own sound and character. The two we know best are the major (Ionian) and the natural minor (Aeolian).' },
    { h:'Whole steps & half steps', body:'Major: whole · whole · half · whole · whole · whole · half. Natural minor: whole · half · whole · whole · half · whole · whole. The very same white keys — only where you begin changes everything.', harp:'On the harp you can’t see the half-steps the way you can on a piano. So we’ll find the modes a harpist’s way.' },
  ]},
  { key:'seven', title:'The Seven Modes', sub:'Seven colours, one scale', lessons:[
    { h:'Seven hidden in one', body:'Tune your harp to all the white keys — C major. Now where you <b>start</b> defines the mode: begin on C and you’re in Ionian; on D, Dorian; E, Phrygian; F, Lydian; G, Mixolydian; A, Aeolian; B, Locrian.', harp:'Stay in C major the whole time. You don’t move a single lever — you only choose where to begin.' },
    { h:'Major & minor modes', body:'The seven fall into two families. Major-sounding: Ionian, Lydian, Mixolydian. Minor-sounding: Dorian, Phrygian, Aeolian — and Locrian, which is diminished.' },
    { gen:'modes' },
    { h:'Explore them yourself', body:'You’ve met all seven. Now spin the wheel and wander them at your own pace — each one a world.', action:{ label:'Open the Wheel →', view:'modes' } },
  ]},
  { key:'finding', title:'Finding Modes', sub:'Two ways in, on the harp', lessons:[
    { h:'The parent key', body:'Every mode lives inside a “parent” major scale. To play G Lydian: Lydian is the 4th mode, so count back four from G — G, F, E, D — the parent is D major. Tune to D major, start on G, and you’re in Lydian.', harp:'Find the parent key, set its levers, then start on your mode’s note. (The key & levers chart shows every tuning.)' },
    { h:'Find the difference', body:'Simcha’s favourite way: compare the mode to the plain major or minor you already know. D Dorian is a <em>minor</em> mode — so play D minor, then change the one note that differs: raise its flat 6th. That single changed note is the mode’s colour.', harp:'Ask: is this mode major or minor? Play that scale, then move only the one character note.' },
    { h:'The power of the tonic', body:'What truly brings out a mode is its root, held low in the left hand. Play just a B and a C with no levers changed: put a D beneath them and it’s Dorian, put an F beneath them and it’s Lydian. The bass note decides the whole world.', harp:'Always anchor the mode with its root in your left hand.' },
  ]},
  { key:'colour', title:'Character & Colour', sub:'What makes a mode sing', lessons:[
    { h:'The character note', body:'Each mode has one note that gives it its flavour — the note that differs from the plain major or minor. In Dorian it’s the natural 6th (the B); in Mixolydian, the flat 7th (the F). Dance around it; don’t over-stay it.' },
    { h:'The character chord', body:'Find a chord that holds the character note, and the mode sings. In Dorian the natural B is the colour — so the G-major chord (B in its middle) brings it out. In plain D minor that chord would be G <em>minor</em>; the natural B makes it major, and that is Dorian.', harp:'For any mode, build a chord around its character note.' },
    { h:'The two with no flavour', body:'Ionian and Aeolian have no single character note — our ears already know them as “the major” and “the minor.” You can lean on the 3rd to colour them, but they simply are what they are.' },
  ]},
  { key:'journey', title:'The Journey', sub:'Play the modes as a flow', lessons:[
    { h:'Tune to all white keys', body:'For the journey, leave your harp in C major and never touch a lever. You’ll travel through all seven modes just by moving where you begin — and listening for each one’s character note.' },
    { h:'An ostinato for Dorian', body:'Simcha’s Dorian groove is a gentle 6/8: with the left hand play 1-2-3, 1-2-3 (third finger and thumb), bass on D; let the right hand dance the “2-and-3” around the B.', harp:'Left hand 1-2-3 on D; right hand circles the B; throw in a G-major chord.' },
    { h:'Aeolian — the rolling hands', body:'For Aeolian, a rolling bisbigliando: three fingers in each hand, A-C-E and A-C-E, the hands alternating; then lift a melody out with the thumb. Let the ♭3 (the C) carry the yearning.' },
    { h:'Sink into a drone', body:'A drone holding the mode’s root sets you free to explore — there’s nowhere to go. Settle into it, then take a little walk with the right hand, returning always to the character note.', action:{ label:'Open the Meditation →', view:'meditation' } },
    { h:'Let it flow', body:'Now move from mode to mode in a single breath — up to the next note, find a melody, dance the character note, travel on. There is no wrong note: you are already tuned to the world you are in.', action:{ label:'Play the guided journey →', view:'journey' } },
  ]},
  { key:'beyond', title:'Beyond the Seven', sub:'Harmonic minor, Hijaz & more', lessons:[
    { h:'The harmonic minor', body:'Take A minor and raise the 7th (G → G♯). Glissando it and you hear it at once — “welcome to the Middle East.” The 1½-step leap between the 6th and 7th is the desert colour.', harp:'In C-major tuning, raise the G’s to G♯ and play from A.' },
    { h:'Hijaz — Phrygian dominant', body:'Start that harmonic minor on its 5th note (E) and a whole new world opens: the Hijaz, the Phrygian dominant — the heart of Sephardic and Middle-Eastern sound. Chords E · F · D · E.' },
    { h:'The “Aladdin” scale', body:'From Hijaz, sharpen the D as well — now there are two 1½-step leaps in one scale: the double-harmonic, the Hijaz Zirguleli. Glissando it and you’re inside a tale of a thousand nights.' },
    { h:'The major 7th', body:'A C-major 7th holds an A minor inside it — three of its four notes. Adding the root “hugs” the sorrow and sweetens it: the same magic as changing the tonic. It pairs beautifully with Lydian.' },
    { h:'Split the harp', body:'Tune your low and high octaves to D minor (B♭), and keep the middle in Dorian (B♮). Now one harp holds two modes — and you can travel between worlds within a single piece.' },
  ]},
];
