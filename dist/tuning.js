/* ============================================================
   Lever Harp Tuning Explorer — engine + scale database
   Computed (not transcribed) from base tuning + interval formulas.
   A lever raises a string one semitone. A scale is "clean" only if
   every note lands on a distinct string as either its down or up pitch.
   ============================================================ */

const TPC = {C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const TLETTERS = ['C','D','E','F','G','A','B'];
/* set by Harp Profile: strings (by letter) that have NO lever — can't be raised. null = all have levers */
let HARP_NO_LEVERS = null;

/* base tunings: per string, the DOWN pitch class (UP = down+1) */
const TBASES = {
  'E♭': { key:'E♭', label:'E♭ Major Base', down:{C:0,D:2,E:3,F:5,G:7,A:8,B:10},
    blurb:'Tuned to three flats (E♭ A♭ B♭). The most flexible base — levers reach a huge range of flat, natural and modal worlds.' },
  'C':  { key:'C', label:'C Major Base', down:{C:0,D:2,E:4,F:5,G:7,A:9,B:11},
    blurb:'All naturals. Simplest for beginners and bright sharp-side keys; flat-heavy worlds aren’t reachable without retuning.' },
};
const TCANDIDATES = {
  'E♭': ['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'],
  'C':  ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'],
};

const TACC = {'':0,'♯':1,'♭':-1,'♯♯':2,'♭♭':-2};
function tRootPC(name){ return ((TPC[name[0]] + (TACC[name.slice(1)]||0)) % 12 + 12) % 12; }
function tSpell(letter, pc){
  const nat = TPC[letter];
  let d = (pc - nat + 12) % 12; if(d > 6) d -= 12;
  const acc = d===0?'':d===1?'♯':d===-1?'♭':d===2?'♯♯':d===-2?'♭♭':(d>0?'+'+d:''+d);
  return letter + acc;
}

const MODE_SEQ = ['Ionian','Dorian','Phrygian','Lydian','Mixolydian','Aeolian','Locrian'];
const MODE_QUALITY = ['major','minor','minor','major','major','minor','dim'];

/* scale families: interval formula + character metadata */
const TFAMILIES = [
  {key:'major', name:'Major', cat:'major', formula:[0,2,4,5,7,9,11], modal:true,
   related:'Major — with its relative minor & 7 modes',
   mood:'clear, warm, grounded', good:['worship','folk','classical','meditative']},
  {key:'harmonic-minor', name:'Harmonic Minor', cat:'harmonic-minor', formula:[0,2,3,5,7,8,11],
   related:'Harmonic minor (raised 7th)',
   mood:'dark, classical, dramatic, prayerful', good:['classical','cinematic','Hebraic']},
  {key:'melodic-minor', name:'Melodic Minor', cat:'melodic-minor', formula:[0,2,3,5,7,9,11],
   related:'Melodic minor (ascending)',
   mood:'smooth, bittersweet, jazzy', good:['jazz','cinematic','classical']},
  {key:'phrygian-dominant', name:'Phrygian Dominant · Hijaz', cat:'hijaz', formula:[0,1,4,5,7,8,10],
   related:'5th mode of harmonic minor',
   mood:'Middle Eastern, Sephardic, desert, mystical', good:['Hebraic','Middle Eastern','Sephardic','improvisational']},
  {key:'double-harmonic', name:'Double Harmonic · Byzantine', cat:'byzantine', formula:[0,1,4,5,7,8,11],
   related:'Double harmonic major (Byzantine / Arabic)',
   mood:'Byzantine, sacred, ancient, exotic', good:['Middle Eastern','sacred','cinematic']},
  {key:'harmonic-major', name:'Harmonic Major', cat:'harmonic-major', formula:[0,2,4,5,7,8,11],
   related:'Harmonic major (♭6)',
   mood:'major yet mysterious, bittersweet', good:['classical','cinematic']},
  {key:'ukrainian-dorian', name:'Ukrainian Dorian · Romanian Minor', cat:'romanian', formula:[0,2,3,6,7,9,10],
   related:'Ukrainian Dorian / Romanian minor (♯4)',
   mood:'Eastern European, mysterious, wandering', good:['folk','cinematic']},
  {key:'hungarian-minor', name:'Hungarian Minor', cat:'hungarian', formula:[0,2,3,6,7,8,11],
   related:'Hungarian / double harmonic minor',
   mood:'dark, mystical, dramatic', good:['cinematic','Middle Eastern']},
];

const TCATEGORIES = [
  {key:'all', label:'All'},
  {key:'major', label:'Major & Modes'},
  {key:'harmonic-minor', label:'Harmonic Minor'},
  {key:'melodic-minor', label:'Melodic Minor'},
  {key:'hijaz', label:'Hijaz'},
  {key:'byzantine', label:'Byzantine'},
  {key:'harmonic-major', label:'Harmonic Major'},
  {key:'romanian', label:'Romanian'},
  {key:'hungarian', label:'Hungarian'},
  {key:'lab', label:'Lever Lab'},
];

/* compute one scale on a base; returns null if not cleanly playable */
function computeScale(baseKey, rootName, fam){
  const base = TBASES[baseKey].down, rL = rootName[0], rpc = tRootPC(rootName), s = TLETTERS.indexOf(rL);
  const levers = {}, notes = []; let clean = true;
  for(let i=0;i<7;i++){
    const L = TLETTERS[(s+i)%7], pc = (rpc + fam.formula[i]) % 12, down = base[L], up = (down+1)%12;
    notes.push(tSpell(L, pc));
    if(pc===down) levers[L]='down';
    else if(pc===up && !(HARP_NO_LEVERS && HARP_NO_LEVERS.has(L))) levers[L]='up';
    else { levers[L]=null; clean=false; }
  }
  if(!clean) return null;
  const leversUp = TLETTERS.filter(l=>levers[l]==='up');
  const n = leversUp.length;
  const exotic = ['hijaz','byzantine','hungarian','romanian','harmonic-major'].includes(fam.cat);
  let lvl = n<=1?1 : n===2?2 : n===3?3 : n<=4?4 : 5;
  if(exotic) lvl = Math.min(5, lvl+1);
  const diff = ['Beginner','Beginner','Beginner–Intermediate','Intermediate','Advanced','Advanced'][lvl];
  const out = {
    famKey:fam.key, famName:fam.name, cat:fam.cat, root:rootName, notes, levers, leversUp,
    leverCount:n, related:fam.related, mood:fam.mood, good:fam.good, difficulty:diff, lvl,
    sig: leversUp.join(''),
  };
  if(fam.modal){
    out.relMinor = notes[5];                 // 6th degree = relative natural minor
    out.modes = notes.map((nt,i)=>({deg:i+1, root:nt, name:MODE_SEQ[i], quality:MODE_QUALITY[i]}));
    out.name = `${rootName} Major`;
  } else {
    out.name = `${rootName} ${fam.name.split(' · ')[0]}`;
  }
  return out;
}

/* generate every clean scale for a base, across all families */
function generateScales(baseKey){
  const out = [];
  const seen = new Set();
  for(const fam of TFAMILIES){
    for(const root of TCANDIDATES[baseKey]){
      const sc = computeScale(baseKey, root, fam);
      if(!sc) continue;
      const id = fam.key + '|' + sc.leversUp.join('') + '|' + tRootPC(root);
      if(seen.has(id)) continue; seen.add(id);
      out.push(sc);
    }
  }
  // order: by family order, then by lever count, then root pitch
  const famOrder = {}; TFAMILIES.forEach((f,i)=>famOrder[f.key]=i);
  out.sort((a,b)=> famOrder[a.famKey]-famOrder[b.famKey] || a.leverCount-b.leverCount || tRootPC(a.root)-tRootPC(b.root));
  return out;
}

/* Lever Lab: given which strings are up, what notes & which scales? */
function leverLab(baseKey, upSet){
  const base = TBASES[baseKey].down;
  const notes = TLETTERS.map(L=>{
    const down = base[L], pc = upSet.has(L) ? (down+1)%12 : down;
    return tSpell(L, pc);
  });
  const sig = TLETTERS.filter(L=>upSet.has(L)).join('');
  const all = generateScales(baseKey);
  const matches = all.filter(sc=>sc.leversUp.join('')===sig);
  return {notes, matches, sig};
}
