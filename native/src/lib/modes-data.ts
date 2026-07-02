/* ============================================================
   Strings of Hope — data model + modal universe.
   Ported from the web app's data.js + buildScaleContext (app.js).
   ============================================================ */
import { tRootPC, tSpell, TLETTERS } from '@/lib/music';

export const MODE_NAMES = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];
export const ROMAN = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
export const QUALITY = ['major', 'minor', 'minor', 'major', 'major', 'minor', 'dim'];
export const SUFFIX = ['', 'm', 'm', '', '', 'm', '°'];

/* the 7 modes, shown in C — used by the guided Journey */
export interface ModeRow {
  n: number;
  name: string;
  greek: string;
  q: string;
  flavor: string;
  flavorTxt: string;
  root: string;
  notes: string[];
  flav: number;
  chord: string;
  chordNotes: string;
  feel: string;
  wheelFlavor: string | null;
  wheelFlavorTxt: string | null;
  wheelHint: string | null;
  wheelLine: string;
}

export const MODES: ModeRow[] = [
  { n: 1, name: 'Ionian', greek: 'the major', q: 'major', flavor: 'none', flavorTxt: 'home', root: 'C',
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], flav: -1, chord: 'C', chordNotes: 'C E G', feel: 'Bright, settled, complete.',
    wheelFlavor: null, wheelFlavorTxt: null, wheelHint: 'E', wheelLine: 'no flavor note · E makes it major' },
  { n: 2, name: 'Dorian', greek: 'minor · lifted 6th', q: 'minor', flavor: '♮6', flavorTxt: '♮6', root: 'D',
    notes: ['D', 'E', 'F', 'G', 'A', 'B', 'C'], flav: 5, chord: 'Dm', chordNotes: 'D F A', feel: 'Minor, yet hopeful.',
    wheelFlavor: 'B', wheelFlavorTxt: '♮6 (B)', wheelHint: null, wheelLine: 'flavor · ♮6 — the B' },
  { n: 3, name: 'Phrygian', greek: 'minor · lowered 2nd', q: 'minor', flavor: '♭2', flavorTxt: '♭2', root: 'E',
    notes: ['E', 'F', 'G', 'A', 'B', 'C', 'D'], flav: 1, chord: 'Em', chordNotes: 'E G B', feel: 'Dark, ancient, mysterious.',
    wheelFlavor: 'F', wheelFlavorTxt: '♭2 (F)', wheelHint: null, wheelLine: 'flavor · ♭2 — the F' },
  { n: 4, name: 'Lydian', greek: 'major · raised 4th', q: 'major', flavor: '♯4', flavorTxt: '♯4', root: 'F',
    notes: ['F', 'G', 'A', 'B', 'C', 'D', 'E'], flav: 3, chord: 'F', chordNotes: 'F A C', feel: 'Dreamy, floating.',
    wheelFlavor: 'B', wheelFlavorTxt: '♯4 (B)', wheelHint: null, wheelLine: 'flavor · ♯4 — the B' },
  { n: 5, name: 'Mixolydian', greek: 'major · lowered 7th', q: 'major', flavor: '♭7', flavorTxt: '♭7', root: 'G',
    notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F'], flav: 6, chord: 'G', chordNotes: 'G B D', feel: 'Joyful with a bluesy edge.',
    wheelFlavor: 'F', wheelFlavorTxt: '♭7 (F)', wheelHint: null, wheelLine: 'flavor · ♭7 — the F' },
  { n: 6, name: 'Aeolian', greek: 'the natural minor', q: 'minor', flavor: 'none', flavorTxt: 'the minor', root: 'A',
    notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], flav: -1, chord: 'Am', chordNotes: 'A C E', feel: 'Tender, reflective.',
    wheelFlavor: null, wheelFlavorTxt: null, wheelHint: 'C', wheelLine: 'no flavor note · C is its minor heart' },
  { n: 7, name: 'Locrian', greek: 'diminished · lowered 5th', q: 'dim', flavor: '♭5', flavorTxt: '♭5', root: 'B',
    notes: ['B', 'C', 'D', 'E', 'F', 'G', 'A'], flav: 4, chord: 'B°', chordNotes: 'B D F', feel: 'Restless, unresolved.',
    wheelFlavor: 'F', wheelFlavorTxt: '♭5 (F)', wheelHint: null, wheelLine: 'flavor · ♭5 — the F' },
];

export interface Verse {
  ref: string;
  text: string;
}

export const VERSES: Verse[] = [
  { ref: 'Ecclesiastes 4:12', text: 'A threefold cord is not quickly broken.' },
  { ref: 'Psalm 33:2', text: 'Praise the LORD with the harp; sing to Him with the ten‑stringed lyre.' },
  { ref: 'Psalm 150:4', text: 'Praise Him with timbrel and dance; praise Him with strings and pipe.' },
  { ref: 'Psalm 57:8', text: 'Awake, my soul! Awake, harp and lyre! I will awaken the dawn.' },
  { ref: 'Psalm 92:1‑3', text: 'It is good to praise the LORD… to the music of the ten‑stringed lyre and the harp.' },
  { ref: 'Psalm 30:11', text: 'You turned my mourning into dancing; You loosed my sackcloth and clothed me with joy.' },
  { ref: 'Psalm 27:1', text: 'The LORD is my light and my salvation; whom shall I fear?' },
  { ref: 'Psalm 118:24', text: 'This is the day the LORD has made; let us rejoice and be glad in it.' },
  { ref: 'Psalm 16:11', text: 'You make known to me the path of life; in Your presence is fullness of joy.' },
  { ref: 'Psalm 119:105', text: 'Your word is a lamp to my feet and a light to my path.' },
  { ref: 'Psalm 23:4', text: 'Even though I walk through the valley of the shadow of death, I will fear no evil.' },
  { ref: 'Psalm 34:8', text: 'Taste and see that the LORD is good; blessed is the one who takes refuge in Him.' },
  { ref: 'Psalm 37:4', text: 'Delight yourself in the LORD, and He will give you the desires of your heart.' },
  { ref: 'Psalm 46:10', text: 'Be still, and know that I am God.' },
  { ref: 'Psalm 121:1', text: 'I lift up my eyes to the hills — where does my help come from?' },
  { ref: 'Psalm 126:5', text: 'Those who sow in tears shall reap with songs of joy.' },
  { ref: 'Psalm 147:3', text: 'He heals the brokenhearted and binds up their wounds.' },
  { ref: 'Isaiah 40:31', text: 'Those who hope in the LORD will renew their strength; they will soar on wings like eagles.' },
  { ref: 'Isaiah 12:2', text: 'The LORD is my strength and my song; He has become my salvation.' },
  { ref: 'Isaiah 41:10', text: 'Do not fear, for I am with you; do not be dismayed, for I am your God.' },
  { ref: 'Jeremiah 29:11', text: 'For I know the plans I have for you — plans to give you hope and a future.' },
  { ref: 'Zephaniah 3:17', text: 'He will rejoice over you with gladness; He will quiet you with His love, and exult over you with singing.' },
  { ref: 'Lamentations 3:22‑23', text: 'His mercies are new every morning; great is Your faithfulness.' },
  { ref: 'Proverbs 3:5', text: 'Trust in the LORD with all your heart, and lean not on your own understanding.' },
  { ref: 'Deuteronomy 31:6', text: 'Be strong and courageous… for the LORD your God goes with you.' },
  { ref: 'Exodus 15:2', text: 'The LORD is my strength and my song, and He has become my salvation.' },
  { ref: 'Numbers 6:24‑26', text: 'The LORD bless you and keep you; the LORD make His face shine upon you.' },
  { ref: '1 Samuel 16:23', text: 'David would take up his harp and play; relief would come and the distress would leave.' },
  { ref: 'Nehemiah 8:10', text: 'The joy of the LORD is your strength.' },
  { ref: 'Song of Songs 2:12', text: 'Flowers appear on the earth; the season of singing has come.' },
  { ref: 'Habakkuk 3:19', text: 'The Sovereign LORD is my strength; He makes my feet like the feet of a deer.' },
  { ref: 'Psalm 108:1', text: 'My heart is steadfast, O God; I will sing and make music with all my soul.' },
];

/* ---------- Modal Universe: any key × four parent worlds ---------- */
export const KEYS12 = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];

export interface WorldMode {
  name: string;
  mood: string;
}
export interface ParentWorld {
  key: string;
  name: string;
  toneIndex: number; // index into palette.m
  formula: number[];
  blurb: string;
  modes: WorldMode[];
}

export const PARENT_WORLDS: ParentWorld[] = [
  { key: 'major', name: 'Major', toneIndex: 0, formula: [0, 2, 4, 5, 7, 9, 11],
    blurb: 'The seven classic modes — the foundation of Western melody.',
    modes: [
      { name: 'Ionian', mood: 'bright, complete — the major' },
      { name: 'Dorian', mood: 'minor, yet hopeful' },
      { name: 'Phrygian', mood: 'dark, ancient, Spanish' },
      { name: 'Lydian', mood: 'dreamy, floating' },
      { name: 'Mixolydian', mood: 'joyful with a bluesy edge' },
      { name: 'Aeolian', mood: 'the natural minor — tender' },
      { name: 'Locrian', mood: 'unstable, restless' },
    ] },
  { key: 'harmonic-minor', name: 'Harmonic Minor', toneIndex: 2, formula: [0, 2, 3, 5, 7, 8, 11],
    blurb: 'The dramatic minor with a raised 7th — home of Hijaz & the desert colours.',
    modes: [
      { name: 'Harmonic Minor', mood: 'dark, classical, dramatic' },
      { name: 'Locrian ♮6', mood: 'tense, half-lit' },
      { name: 'Ionian ♯5', mood: 'augmented, mysterious major' },
      { name: 'Ukrainian Dorian', mood: 'Eastern European, wandering' },
      { name: 'Phrygian Dominant', mood: 'Middle Eastern, Hijaz, sacred' },
      { name: 'Lydian ♯2', mood: 'exotic, shimmering' },
      { name: 'Super Locrian ♭♭7', mood: 'the darkest, fully altered' },
    ] },
  { key: 'melodic-minor', name: 'Melodic Minor', toneIndex: 1, formula: [0, 2, 3, 5, 7, 9, 11],
    blurb: 'The smooth jazz/cinematic minor and its luminous modes.',
    modes: [
      { name: 'Melodic Minor', mood: 'smooth minor, jazzy' },
      { name: 'Dorian ♭2', mood: 'soft, exotic minor' },
      { name: 'Lydian Augmented', mood: 'bright, weightless' },
      { name: 'Lydian Dominant', mood: 'overtone, bluesy-bright' },
      { name: 'Mixolydian ♭6', mood: 'bittersweet, Hindu' },
      { name: 'Aeolian ♭5', mood: 'half-diminished, melancholic' },
      { name: 'Altered', mood: 'tense, jazz, fully altered' },
    ] },
  { key: 'double-harmonic', name: 'Double Harmonic · Byzantine', toneIndex: 3, formula: [0, 1, 4, 5, 7, 8, 11],
    blurb: 'The Byzantine / Arabic world — sacred, ancient, and its Hungarian & Oriental modes.',
    modes: [
      { name: 'Double Harmonic Major', mood: 'Byzantine, sacred, ancient' },
      { name: 'Lydian ♯2 ♯6', mood: 'radiant, exotic' },
      { name: 'Ultraphrygian', mood: 'dark, mysterious' },
      { name: 'Hungarian Minor', mood: 'dramatic, mystical' },
      { name: 'Oriental', mood: 'Arabic, vivid, desert' },
      { name: 'Ionian ♯2 ♯5', mood: 'strange, augmented' },
      { name: 'Locrian ♭♭3 ♭♭7', mood: 'the deepest, most altered' },
    ] },
];

export const JOURNEY_LEAD: Record<string, string> = {
  Ionian: "Meet the mother scale — C major. Play it from C up to C and you're in Ionian: the bright, settled major sound. Every other mode hides inside these same seven notes.",
  Dorian: "Keep the very same notes, but make D your home. That's Dorian — minor, yet hopeful. Its colour is the natural 6th: the B.",
  Phrygian: 'Now begin on E. Phrygian — dark and ancient. Its flavor is the lowered 2nd, the F sitting right against the root.',
  Lydian: 'Begin on F. Lydian — dreamy and floating, a major scale with stars in it. Its flavor is the raised 4th: the B.',
  Mixolydian: 'Begin on G. Mixolydian — joyful with a bluesy edge. Its flavor is the lowered 7th: the F.',
  Aeolian: 'Begin on A. Aeolian — the natural minor: tender and reflective. It has no single flavor note; it simply is the minor.',
  Locrian: 'Begin on B. Locrian — restless and unresolved. Its flavor is the lowered 5th: the F. Rare, but haunting in the right moment.',
};

/* ---------- harp-friendly major keys ---------- */
export interface Key {
  tonic: string;
  notes: string[];
}
export const KEYS: Key[] = [
  { tonic: 'C', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  { tonic: 'G', notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F♯'] },
  { tonic: 'D', notes: ['D', 'E', 'F♯', 'G', 'A', 'B', 'C♯'] },
  { tonic: 'A', notes: ['A', 'B', 'C♯', 'D', 'E', 'F♯', 'G♯'] },
  { tonic: 'E', notes: ['E', 'F♯', 'G♯', 'A', 'B', 'C♯', 'D♯'] },
  { tonic: 'F', notes: ['F', 'G', 'A', 'B♭', 'C', 'D', 'E'] },
  { tonic: 'B♭', notes: ['B♭', 'C', 'D', 'E♭', 'F', 'G', 'A'] },
  { tonic: 'E♭', notes: ['E♭', 'F', 'G', 'A♭', 'B♭', 'C', 'D'] },
];

export function diatonicChords(key: Key) {
  const s = key.notes;
  return s.map((root, i) => {
    const third = s[(i + 2) % 7];
    const fifth = s[(i + 4) % 7];
    return {
      degree: i,
      roman: ROMAN[i],
      name: root + SUFFIX[i],
      notes: [root, third, fifth].join(' '),
      quality: QUALITY[i],
      mode: MODE_NAMES[i],
      is145: i === 0 || i === 3 || i === 4,
    };
  });
}

/* ---------- lever harp (tuned in 3 flats: E♭ A♭ B♭) ---------- */
export const BASE_TUNING: Record<string, string> = { C: 'C', D: 'D', E: 'E♭', F: 'F', G: 'G', A: 'A♭', B: 'B♭' };

export function leverStates(key: Key) {
  const byLetter: Record<string, string> = {};
  key.notes.forEach((n) => {
    byLetter[n[0]] = n;
  });
  return ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((L) => {
    const sounds = byLetter[L];
    return { letter: L, sounds, base: BASE_TUNING[L], up: sounds !== BASE_TUNING[L] };
  });
}

/* ============================================================
   Modal universe — buildScaleContext (ported from app.js)
   ============================================================ */
const MAJ_REF = [0, 2, 4, 5, 7, 9, 11];
const MIN_REF = [0, 2, 3, 5, 7, 8, 10];

export interface CharacterNote {
  sym: string;
  noteIndex: number;
  deg: number;
}
export interface ModeContext {
  name: string;
  mood: string;
  root: string;
  rootIndex: number;
  ref: 'major' | 'minor';
  character: CharacterNote[];
  notes: string[];
  chord: string;
  chordNotes: string[];
}
export interface ScaleContext {
  keyName: string;
  world: ParentWorld;
  toneIndex: number;
  parentNotes: string[];
  modes: ModeContext[];
}

export function buildScaleContext(keyName: string, world: ParentWorld): ScaleContext {
  const rootPc = tRootPC(keyName);
  const s = TLETTERS.indexOf(keyName[0] as any);
  const parentNotes = world.formula.map((iv, i) => tSpell(TLETTERS[(s + i) % 7], (rootPc + iv) % 12));
  const modes: ModeContext[] = world.modes.map((m, mi) => {
    const mf = world.formula.map((_, j) => (((world.formula[(mi + j) % 7] - world.formula[mi]) % 12) + 12) % 12);
    const maj3 = mf.includes(4);
    const ref = maj3 ? MAJ_REF : MIN_REF;
    const character: CharacterNote[] = [];
    for (let k = 1; k < 7; k++) {
      if (mf[k] !== ref[k]) {
        const d = mf[k] - MAJ_REF[k];
        const sym = (d === 0 ? '♮' : d <= -2 ? '♭♭' : d === -1 ? '♭' : d >= 2 ? '♯♯' : '♯') + (k + 1);
        character.push({ sym, noteIndex: (mi + k) % 7, deg: k + 1 });
      }
    }
    const third = mf[2];
    const fifth = mf[4];
    const q =
      third === 4 && fifth === 7 ? '' :
      third === 3 && fifth === 7 ? 'm' :
      third === 3 && fifth === 6 ? '°' :
      third === 4 && fifth === 8 ? '+' :
      third === 4 && fifth === 6 ? '(♭5)' : '';
    const chordNotes = [parentNotes[mi], parentNotes[(mi + 2) % 7], parentNotes[(mi + 4) % 7]];
    return {
      name: m.name, mood: m.mood, root: parentNotes[mi], rootIndex: mi,
      ref: maj3 ? 'major' : 'minor', character, notes: mf.map((_, j) => parentNotes[(mi + j) % 7]),
      chord: parentNotes[mi] + q, chordNotes,
    };
  });
  return { keyName, world, toneIndex: world.toneIndex, parentNotes, modes };
}

/* deterministic verse-of-the-day */
export function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}
export function verseOfDay(d: Date): Verse {
  return VERSES[dayOfYear(d) % VERSES.length];
}
