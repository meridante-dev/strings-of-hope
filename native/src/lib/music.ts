/* ============================================================
   Lever Harp music engine — computed, not transcribed.
   Ported from the web app's tuning.js. A lever raises a string
   one semitone; a scale is "clean" only if every note lands on a
   distinct string as either its down or up pitch.
   ============================================================ */

export const TPC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
export const TLETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

/** strings (by letter) that have NO lever — can't be raised. null = all have levers */
let HARP_NO_LEVERS: Set<string> | null = null;
export function setHarpNoLevers(set: Set<string> | null) {
  HARP_NO_LEVERS = set;
}

export type BaseKey = 'E♭' | 'C';

export interface BaseTuning {
  key: string;
  label: string;
  down: Record<string, number>;
  blurb: string;
}

/* base tunings: per string, the DOWN pitch class (UP = down+1) */
export const TBASES: Record<BaseKey, BaseTuning> = {
  'E♭': {
    key: 'E♭',
    label: 'E♭ Major Base',
    down: { C: 0, D: 2, E: 3, F: 5, G: 7, A: 8, B: 10 },
    blurb:
      'Tuned to three flats (E♭ A♭ B♭). The most flexible base — levers reach a huge range of flat, natural and modal worlds.',
  },
  C: {
    key: 'C',
    label: 'C Major Base',
    down: { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 },
    blurb:
      'All naturals. Simplest for beginners and bright sharp-side keys; flat-heavy worlds aren’t reachable without retuning.',
  },
};

export const TCANDIDATES: Record<BaseKey, string[]> = {
  'E♭': ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'],
  C: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
};

const TACC: Record<string, number> = { '': 0, '♯': 1, '♭': -1, '♯♯': 2, '♭♭': -2 };

export function tRootPC(name: string): number {
  return (((TPC[name[0]] + (TACC[name.slice(1)] || 0)) % 12) + 12) % 12;
}

export function tSpell(letter: string, pc: number): string {
  const nat = TPC[letter];
  let d = (pc - nat + 12) % 12;
  if (d > 6) d -= 12;
  const acc =
    d === 0 ? '' : d === 1 ? '♯' : d === -1 ? '♭' : d === 2 ? '♯♯' : d === -2 ? '♭♭' : d > 0 ? '+' + d : '' + d;
  return letter + acc;
}

export const MODE_SEQ = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];
export const MODE_QUALITY = ['major', 'minor', 'minor', 'major', 'major', 'minor', 'dim'];

export interface Family {
  key: string;
  name: string;
  cat: string;
  formula: number[];
  modal?: boolean;
  related: string;
  mood: string;
  good: string[];
}

export const TFAMILIES: Family[] = [
  { key: 'major', name: 'Major', cat: 'major', formula: [0, 2, 4, 5, 7, 9, 11], modal: true,
    related: 'Major — with its relative minor & 7 modes', mood: 'clear, warm, grounded',
    good: ['worship', 'folk', 'classical', 'meditative'] },
  { key: 'harmonic-minor', name: 'Harmonic Minor', cat: 'harmonic-minor', formula: [0, 2, 3, 5, 7, 8, 11],
    related: 'Harmonic minor (raised 7th)', mood: 'dark, classical, dramatic, prayerful',
    good: ['classical', 'cinematic', 'Hebraic'] },
  { key: 'melodic-minor', name: 'Melodic Minor', cat: 'melodic-minor', formula: [0, 2, 3, 5, 7, 9, 11],
    related: 'Melodic minor (ascending)', mood: 'smooth, bittersweet, jazzy',
    good: ['jazz', 'cinematic', 'classical'] },
  { key: 'phrygian-dominant', name: 'Phrygian Dominant · Hijaz', cat: 'hijaz', formula: [0, 1, 4, 5, 7, 8, 10],
    related: '5th mode of harmonic minor', mood: 'Middle Eastern, Sephardic, desert, mystical',
    good: ['Hebraic', 'Middle Eastern', 'Sephardic', 'improvisational'] },
  { key: 'double-harmonic', name: 'Double Harmonic · Byzantine', cat: 'byzantine', formula: [0, 1, 4, 5, 7, 8, 11],
    related: 'Double harmonic major (Byzantine / Arabic)', mood: 'Byzantine, sacred, ancient, exotic',
    good: ['Middle Eastern', 'sacred', 'cinematic'] },
  { key: 'harmonic-major', name: 'Harmonic Major', cat: 'harmonic-major', formula: [0, 2, 4, 5, 7, 8, 11],
    related: 'Harmonic major (♭6)', mood: 'major yet mysterious, bittersweet', good: ['classical', 'cinematic'] },
  { key: 'ukrainian-dorian', name: 'Ukrainian Dorian · Romanian Minor', cat: 'romanian', formula: [0, 2, 3, 6, 7, 9, 10],
    related: 'Ukrainian Dorian / Romanian minor (♯4)', mood: 'Eastern European, mysterious, wandering',
    good: ['folk', 'cinematic'] },
  { key: 'hungarian-minor', name: 'Hungarian Minor', cat: 'hungarian', formula: [0, 2, 3, 6, 7, 8, 11],
    related: 'Hungarian / double harmonic minor', mood: 'dark, mystical, dramatic',
    good: ['cinematic', 'Middle Eastern'] },
];

export interface Scale {
  famKey: string;
  famName: string;
  cat: string;
  root: string;
  notes: string[];
  levers: Record<string, 'up' | 'down' | null>;
  leversUp: string[];
  leverCount: number;
  related: string;
  mood: string;
  good: string[];
  difficulty: string;
  lvl: number;
  sig: string;
  name: string;
  relMinor?: string;
  modes?: { deg: number; root: string; name: string; quality: string }[];
}

/* compute one scale on a base; returns null if not cleanly playable */
export function computeScale(baseKey: BaseKey, rootName: string, fam: Family): Scale | null {
  const base = TBASES[baseKey].down;
  const rL = rootName[0];
  const rpc = tRootPC(rootName);
  const s = TLETTERS.indexOf(rL as any);
  const levers: Record<string, 'up' | 'down' | null> = {};
  const notes: string[] = [];
  let clean = true;
  for (let i = 0; i < 7; i++) {
    const L = TLETTERS[(s + i) % 7];
    const pc = (rpc + fam.formula[i]) % 12;
    const down = base[L];
    const up = (down + 1) % 12;
    notes.push(tSpell(L, pc));
    if (pc === down) levers[L] = 'down';
    else if (pc === up && !(HARP_NO_LEVERS && HARP_NO_LEVERS.has(L))) levers[L] = 'up';
    else {
      levers[L] = null;
      clean = false;
    }
  }
  if (!clean) return null;
  const leversUp = TLETTERS.filter((l) => levers[l] === 'up');
  const n = leversUp.length;
  const exotic = ['hijaz', 'byzantine', 'hungarian', 'romanian', 'harmonic-major'].includes(fam.cat);
  let lvl = n <= 1 ? 1 : n === 2 ? 2 : n === 3 ? 3 : n <= 4 ? 4 : 5;
  if (exotic) lvl = Math.min(5, lvl + 1);
  const diff = ['Beginner', 'Beginner', 'Beginner–Intermediate', 'Intermediate', 'Advanced', 'Advanced'][lvl];
  const out: Scale = {
    famKey: fam.key, famName: fam.name, cat: fam.cat, root: rootName, notes, levers, leversUp,
    leverCount: n, related: fam.related, mood: fam.mood, good: fam.good, difficulty: diff, lvl,
    sig: leversUp.join(''), name: '',
  };
  if (fam.modal) {
    out.relMinor = notes[5];
    out.modes = notes.map((nt, i) => ({ deg: i + 1, root: nt, name: MODE_SEQ[i], quality: MODE_QUALITY[i] }));
    out.name = `${rootName} Major`;
  } else {
    out.name = `${rootName} ${fam.name.split(' · ')[0]}`;
  }
  return out;
}

/* generate every clean scale for a base, across all families */
export function generateScales(baseKey: BaseKey): Scale[] {
  const out: Scale[] = [];
  const seen = new Set<string>();
  for (const fam of TFAMILIES) {
    for (const root of TCANDIDATES[baseKey]) {
      const sc = computeScale(baseKey, root, fam);
      if (!sc) continue;
      const id = fam.key + '|' + sc.leversUp.join('') + '|' + tRootPC(root);
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(sc);
    }
  }
  const famOrder: Record<string, number> = {};
  TFAMILIES.forEach((f, i) => (famOrder[f.key] = i));
  out.sort(
    (a, b) =>
      famOrder[a.famKey] - famOrder[b.famKey] || a.leverCount - b.leverCount || tRootPC(a.root) - tRootPC(b.root),
  );
  return out;
}

/* Lever Lab: given which strings are up, what notes & which scales? */
export function leverLab(baseKey: BaseKey, upSet: Set<string>) {
  const base = TBASES[baseKey].down;
  const notes = TLETTERS.map((L) => {
    const down = base[L];
    const pc = upSet.has(L) ? (down + 1) % 12 : down;
    return tSpell(L, pc);
  });
  const sig = TLETTERS.filter((L) => upSet.has(L)).join('');
  const all = generateScales(baseKey);
  const matches = all.filter((sc) => sc.leversUp.join('') === sig);
  return { notes, matches, sig };
}
