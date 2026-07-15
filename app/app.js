/* ============================================================
   Strings of Hope · Modes — app shell, views & routing
   ============================================================ */

const css = (v)=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();

/* light haptic on Android (no-op on iOS Safari) */
function haptic(kind){ try{ if(!navigator.vibrate) return;
  const p={tap:6, select:3, soft:9, success:[11,32,16], win:[14,26,14,26,22], warn:[22,40,22], heavy:16}[kind];
  if(p!=null) navigator.vibrate(p);
}catch(e){} }
function buzz(){ haptic('tap'); }

/* ============================================================
   FEATURE FLAGS — beta focus (2026-07-15)
   Ship a small, perfected core; keep the rest in the workshop
   until each piece gets its refinement pass. Flip a flag to true
   to release a feature. Nothing is deleted — data, views and code
   all stay; these only hide entry points.
   Preview everything on your own device: run
     localStorage.setItem('soh-labs','1')  in the console (then reload).
   ============================================================ */
const SOH_FLAGS={
  jacob:false,        // Jacob's Universe — awaiting taught-lesson treatment on all modules
  shamayim:false,     // Shamayim Harp — contemplative journey, refine pacing first
  chen:false,         // Chen · Symmetry — deep material, needs guided intro
  sightread:false,    // Sight-Reading — detection UX needs a hardening pass like the tuner
  eartraining:false,  // Ear Training — drills need levels + progression
  rhythm:false,       // Rhythm engine — groove content needs curation
  repertoire:false,   // Repertoire — too thin to show yet
};
/* what the Learn hub teases as coming */
const SOH_WORKSHOP_NAMES={ jacob:'Jacob’s Universe', shamayim:'Shamayim Harp', chen:'Chen · Symmetry',
  sightread:'Sight-Reading', eartraining:'Ear Training', rhythm:'Rhythm', repertoire:'Repertoire' };
function sohLabs(){ try{ return localStorage.getItem('soh-labs')==='1'; }catch(e){ return false; } }
function sohOn(view){ return sohLabs() || SOH_FLAGS[view]!==false; }
function sohApplyFlags(){
  Object.keys(SOH_FLAGS).forEach(v=>{ if(!sohOn(v))
    document.querySelectorAll(`[data-view="${v}"]`).forEach(el=>{ el.hidden=true; el.style.display='none'; }); });
}

/* horizontal swipe via pointer events (iOS + Android). Taps pass through;
   a real drag fires the callback and swallows the trailing click. */
function addSwipe(el, {onLeft, onRight, threshold=46}={}){
  if(!el) return;
  let x0=0,y0=0,t0=0,tracking=false;
  el.addEventListener('pointerdown',e=>{ tracking=true; x0=e.clientX; y0=e.clientY; t0=e.timeStamp; });
  el.addEventListener('pointerup',e=>{
    if(!tracking) return; tracking=false;
    const dx=e.clientX-x0, dy=e.clientY-y0, dt=e.timeStamp-t0;
    if(Math.abs(dx)>threshold && Math.abs(dx)>Math.abs(dy)*1.3 && dt<700){
      const swallow=ev=>{ ev.stopPropagation(); ev.preventDefault(); };
      el.addEventListener('click',swallow,{capture:true,once:true});
      setTimeout(()=>el.removeEventListener('click',swallow,true),340);
      buzz();
      (dx<0 ? onLeft : onRight)?.();
    }
  });
  el.addEventListener('pointercancel',()=>tracking=false);
}

/* reveal-on-scroll. Elements animate in when scrolled into view; but anything already
   on-screen (incl. after a view switch) reveals immediately so content is never stuck hidden. */
const io = new IntersectionObserver((es)=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
},{threshold:.08});
function observeReveals(root=document){
  root.querySelectorAll('.reveal:not(.in)').forEach(el=>{
    if(el.dataset.obs) return;
    el.dataset.obs='1'; io.observe(el);
  });
}
/* reveal everything currently visible in `root` right now (no wait for the observer) */
function triggerReveals(root=document){
  let i=0;
  root.querySelectorAll('.reveal:not(.in)').forEach(el=>{
    const r = el.getBoundingClientRect();
    if(el.offsetParent !== null && r.top < window.innerHeight + 60){
      el.style.animationDelay=(Math.min(i,8)*0.05)+'s'; el.classList.add('in'); io.unobserve(el); i++;
    }
  });
}

/* ============================================================
   MODES VIEW — the modal universe
   Pick any key × parent world; spin its 7 named modes.
   Root parks at 12 o'clock; character note(s) glow.
   ============================================================ */
const R = 100, STEP = 360/7;
const MAJ_REF = [0,2,4,5,7,9,11], MIN_REF = [0,2,3,5,7,8,10];
let mwKey = 'C';
let mwWorld = PARENT_WORLDS[0];
let scaleCtx = null;
let activeMode = 0;
let ringDeg = 0, animId = null;
const easeInOut = x => x<0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2,3)/2;

/* build the chosen scale: spelled parent notes + each mode's character vs nearest major/minor */
function buildScaleContext(keyName, world){
  const rootPc = tRootPC(keyName), s = TLETTERS.indexOf(keyName[0]);
  const parentNotes = world.formula.map((iv,i)=> tSpell(TLETTERS[(s+i)%7], (rootPc+iv)%12));
  const modes = world.modes.map((m,mi)=>{
    const mf = world.formula.map((_,j)=> ((world.formula[(mi+j)%7] - world.formula[mi]) % 12 + 12) % 12);
    const maj3 = mf.includes(4);
    const ref = maj3 ? MAJ_REF : MIN_REF;
    const character = [];
    for(let k=1;k<7;k++){
      if(mf[k] !== ref[k]){
        const d = mf[k] - MAJ_REF[k];                 // label the resulting degree vs the MAJOR scale
        const sym = (d===0?'♮':d<=-2?'♭♭':d===-1?'♭':d>=2?'♯♯':'♯') + (k+1);
        character.push({ sym, noteIndex:(mi+k)%7, deg:k+1 });
      }
    }
    const third=mf[2], fifth=mf[4];
    const q = (third===4&&fifth===7)?'':(third===3&&fifth===7)?'m':(third===3&&fifth===6)?'°':(third===4&&fifth===8)?'+':(third===4&&fifth===6)?'(♭5)':'';
    const chordNotes=[parentNotes[mi],parentNotes[(mi+2)%7],parentNotes[(mi+4)%7]];
    return { name:m.name, mood:m.mood, root:parentNotes[mi], rootIndex:mi,
             ref:maj3?'major':'minor', character, notes:mf.map((_,j)=>parentNotes[(mi+j)%7]),
             chord:parentNotes[mi]+q, chordNotes };
  });
  return { keyName, world, tone:world.tone, parentNotes, modes };
}

function rebuildModes(keepMode){
  scaleCtx = buildScaleContext(mwKey, mwWorld);
  activeMode = keepMode ? Math.min(activeMode,6) : 0;
  buildKeyChips(); buildWorldChips(); buildModeButtons(); buildRuler(); buildWheel(); buildRail();
  renderHarpHint();
  setMode(activeMode, false);
}

/* is the current scale playable on an E♭ / C lever harp, and with which levers? */
function renderHarpHint(){
  const host=document.getElementById('harpHint'); if(!host) return;
  const fam={formula:mwWorld.formula, cat:mwWorld.key, name:mwWorld.name};
  const row=(base)=>{
    const r=computeScale(base, mwKey, fam);
    if(!r) return `<div class="hh-row off"><span class="hh-base">${base} harp</span><span class="hh-state">needs retuning</span></div>`;
    const up=r.leversUp.length?r.leversUp.join(' · '):'none';
    return `<div class="hh-row"><span class="hh-base">${base} harp</span><span class="hh-state">levers up: <b>${up}</b></span></div>`;
  };
  host.innerHTML = `<div class="harp-hint reveal"><div class="hh-title">On your harp</div>${row('E♭')}${row('C')}</div>`;
  observeReveals(host); triggerReveals(host);
}

function buildKeyChips(){
  const host=document.getElementById('keyChips'); if(!host) return; host.innerHTML='';
  KEYS12.forEach(k=>{
    const b=document.createElement('button');
    b.className='keychip'+(k===mwKey?' on':''); b.textContent=k;
    b.addEventListener('click',()=>{ if(mwKey===k)return; mwKey=k; rebuildModes(true); buzz();
      b.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'}); });
    host.appendChild(b);
  });
}
function buildWorldChips(){
  const host=document.getElementById('worldChips'); if(!host) return; host.innerHTML='';
  PARENT_WORLDS.forEach(w=>{
    const b=document.createElement('button');
    b.className='worldchip'+(w.key===mwWorld.key?' on':''); b.textContent=w.name.split(' · ')[0];
    if(w.key===mwWorld.key) b.style.setProperty('--c',`var(${w.tone})`);
    b.addEventListener('click',()=>{ if(mwWorld.key===w.key)return; mwWorld=w; rebuildModes(true); buzz(); });
    host.appendChild(b);
  });
  const blurb=document.getElementById('worldBlurb'); if(blurb) blurb.textContent=mwWorld.blurb;
}

function buildWheel(){
  const ring=document.getElementById('ringG'); if(!ring) return; ring.innerHTML='';
  scaleCtx.parentNotes.forEach((nt,i)=>{
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','petal');
    g.innerHTML=`<g class="petal-inner"><circle r="26"></circle><text class="deg" y="-9" text-anchor="middle">${i+1}</text><text class="ltr" y="8" text-anchor="middle">${nt}</text></g>`;
    g.addEventListener('click',()=>setMode(i,true));
    ring.appendChild(g);
  });
  renderRing();
}

function renderRing(){
  const ring=document.getElementById('ringG'); if(!ring) return;
  [...ring.children].forEach((g,i)=>{
    const a=(i*STEP+ringDeg)*Math.PI/180;
    g.setAttribute('transform',`translate(${(R*Math.sin(a)).toFixed(2)} ${(-R*Math.cos(a)).toFixed(2)})`);
  });
}

function setMode(i, animate){
  activeMode=i;
  let target=-i*STEP;
  while(target-ringDeg> 180) target-=360;
  while(target-ringDeg<-180) target+=360;
  decorate();
  cancelAnimationFrame(animId);
  if(!animate){ ringDeg=target; renderRing(); return; }
  const start=ringDeg, t0=performance.now(), dur=640;
  (function frame(now){
    const p=Math.min(1,(now-t0)/dur);
    ringDeg=start+(target-start)*easeInOut(p); renderRing();
    if(p<1) animId=requestAnimationFrame(frame); else { ringDeg=target; renderRing(); }
  })(t0);
}

function decorate(){
  const m=scaleCtx.modes[activeMode], tone=scaleCtx.tone;
  const charSet=new Set(m.character.map(c=>c.noteIndex));
  const ring=document.getElementById('ringG');
  [...ring.children].forEach((g,i)=>{
    g.querySelector('.deg').textContent=((i-activeMode+7)%7)+1;
    const isRoot=i===activeMode, isChar=charSet.has(i);
    g.classList.toggle('root',isRoot);
    g.classList.toggle('flavor',isChar);
    g.classList.remove('hint');
    if(isChar) g.style.setProperty('--c',`var(${tone})`); else g.style.removeProperty('--c');
  });
  const nameEl=document.getElementById('wcName');
  nameEl.textContent=m.name; nameEl.style.color=`var(${tone})`;
  nameEl.style.fontSize = m.name.length>15 ? '18px' : m.name.length>11 ? '22px' : '29px';
  document.getElementById('wcRole').textContent=`${ordinalWord(activeMode)} mode · chord ${m.chord}`;
  const fl=document.getElementById('wcFlavor');
  fl.textContent = m.character.length ? m.character.map(c=>c.sym).join('  ·  ') : `the ${m.ref} scale itself`;
  fl.style.color = m.character.length ? `var(${tone})` : 'var(--ink-faint)';
  document.querySelectorAll('.mode-switch button').forEach((b,i)=>{
    const on=i===activeMode; b.classList.toggle('on',on);
    if(on){ b.style.background=`var(${tone})`; b.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'}); }
    else b.style.background='';
  });
  document.querySelectorAll('.ruler .rcell').forEach((c,i)=>c.classList.toggle('on',i===activeMode));
  const mark=document.querySelector('.ruler .rmark');
  if(mark){ mark.style.transform=`translateX(${activeMode*100}%)`; mark.style.background=`var(${tone})`; }
  document.querySelectorAll('#rail .mode').forEach((el,i)=>el.classList.toggle('active',i===activeMode));
  if(Drone.playing && Drone.followWheel) Drone.setRoot(scaleCtx.modes[activeMode].root);
  syncDroneButtons();
  renderCharacter();
  renderModePractice();
}

function buildModeButtons(){
  const host=document.querySelector('.mode-switch'); host.innerHTML='';
  scaleCtx.modes.forEach((m,i)=>{
    const b=document.createElement('button');
    b.textContent=m.name;
    b.addEventListener('click',()=>setMode(i,true));
    host.appendChild(b);
  });
}

function buildRuler(){
  const host=document.querySelector('.ruler');
  host.innerHTML = scaleCtx.parentNotes.map(n=>`<span class="rcell">${n}</span>`).join('') + `<span class="rmark"></span>`;
}

/* shared: the two-row comparison body for any mode (used by Modes view + Journey) */
function diffHTML(mi){
  const m=MODES[mi], p=PARALLELS[m.name];
  if(p.diff<0)
    return `<div class="diff-none"><b>${m.name}</b> <em>is</em> the ${p.label} scale itself — there's no note to change. Its character comes from where it sits.</div>`;
  const row=(label,notes,me)=>`
    <div class="drow${me?' me':''}">
      <span class="dlabel">${label}</span>
      <span class="dnotes">${notes.map((n,i)=>`<b class="${i===p.diff?'dhi':''}">${n}</b>`).join('')}</span>
    </div>`;
  return row(m.name, m.notes, true) + row(p.label, p.notes, false) +
    `<div class="dtag">${m.wheelFlavorTxt} — the one note that turns ${p.label} into ${m.name}</div>`;
}
/* "what makes it special" — the active mode's character vs its plain major/minor */
function renderCharacter(){
  const host=document.getElementById('diffBody'); if(!host) return;
  const m=scaleCtx.modes[activeMode];
  host.style.setProperty('--c',`var(${scaleCtx.tone})`);
  let html;
  if(!m.character.length){
    html=`<div class="diff-none"><b>${m.name}</b> <em>is</em> the plain ${m.ref} scale here — its colour comes from where it sits in the family.</div>`;
  } else {
    const notesRow=m.notes.map((nt,j)=>`<b class="${m.character.some(c=>c.deg===j+1)?'dhi':''}">${nt}</b>`).join('');
    const syms=m.character.map(c=>c.sym).join(' · ');
    html=`<div class="drow me"><span class="dlabel">${m.name}</span><span class="dnotes">${notesRow}</span></div>`+
      `<div class="dtag">${syms} — what colours ${m.root} ${m.name} against a plain ${m.ref} scale</div>`;
  }
  const t=(typeof MODE_TEACHING!=='undefined') && MODE_TEACHING[m.name];
  if(t) html += `<div class="simcha-card">`+
    `<div class="simcha-h">Simcha’s way in</div>`+
    `<div class="simcha-row"><span class="sc-k">Chord</span> ${t.chord}</div>`+
    `<div class="simcha-row"><span class="sc-k">Pattern</span> ${t.pattern}</div>`+
    `<div class="simcha-song">♪ ${t.song}</div></div>`;
  host.innerHTML=html;
}

function ordinalWord(n){return ["first","second","third","fourth","fifth","sixth","seventh"][n] || (n+1)+"th";}

function buildRail(){
  const rail = document.getElementById('rail');
  if(!rail) return; rail.innerHTML='';
  scaleCtx.modes.forEach((m,idx)=>{
    const el = document.createElement('article');
    el.className='mode reveal';
    el.style.setProperty('--c',`var(${scaleCtx.tone})`);
    const charHtml = m.character.length
      ? `<span class="flavor">${m.character.map(c=>c.sym).join(' ')}</span>`
      : `<span class="flavor none">the ${m.ref}</span>`;
    const notesHtml = m.notes.map((nt,j)=>{
      let cls='note'; if(j===0) cls+=' root'; if(m.character.some(c=>c.deg===j+1)) cls+=' flav';
      return `<div class="${cls}"><span class="d">${j+1}</span>${nt}</div>`;
    }).join('');
    el.innerHTML = `
      <div class="head">
        <div class="num">${idx+1}</div>
        <div class="titles"><div class="nm">${m.name}</div><div class="greek">${m.mood}</div></div>
        <div class="badges">${charHtml}</div>
      </div>
      <div class="notes">${notesHtml}</div>
      <div class="moremeta">
        <div class="chip-chord">${m.chord}<small> ${m.chordNotes.join(' ')}</small></div>
        <div class="feel">${m.mood}</div>
      </div>`;
    el.addEventListener('click',()=>{
      setMode(idx,true);
      document.querySelector('#view-modes .wheel-card').scrollIntoView({behavior:'smooth',block:'center'});
    });
    rail.appendChild(el);
  });
  observeReveals(rail); triggerReveals(rail);
}

/* ============================================================
   MODE ENRICHMENT — suggested drone + groove + practice + improv,
   with one-tap backing (drone + rhythm together).
   ============================================================ */
function suggestedGroove(world, mode){
  const tbl = {
    'major':           ['meditative','celtic','meditative','celtic','celtic','meditative','meditative'],
    'harmonic-minor':  ['meditative','meditative','meditative','sephardic','middleeast','middleeast','breath'],
    'melodic-minor':   ['meditative','meditative','flowing','celtic','meditative','meditative','flowing'],
    'double-harmonic': ['middleeast','middleeast','breath','middleeast','middleeast','meditative','breath'],
  };
  return (tbl[world.key] || tbl['major'])[mode] || 'meditative';
}
function suggestedDrone(world){
  const reed = (world.key==='harmonic-minor' || world.key==='double-harmonic');
  return { type:'fifth', voice: reed ? 'reed' : 'pad' };
}
function practiceText(m){
  if(m.character.length){
    const c=m.character[0];
    return `Linger on the ${c.sym} (${m.notes[c.deg-1]}) — that note <em>is</em> the colour. Try ${m.root} → ${m.notes[c.deg-1]} → ${m.root}, slowly.`;
  }
  return `Walk up 1‑2‑3‑4‑5, rest on the 5th, then fall home to ${m.root}.`;
}
function improvText(m){
  const ch = m.character.length ? m.notes[m.character[0].deg-1] : m.notes[2];
  return `“Begin and end on ${m.root}. Let ${ch} be your surprise — and return home whenever you feel lost.”`;
}

function renderModePractice(){
  const host=document.getElementById('modePractice'); if(!host) return;
  const m=scaleCtx.modes[activeMode], dr=suggestedDrone(mwWorld), gk=suggestedGroove(mwWorld, activeMode);
  const g=RHYTHMS.find(r=>r.key===gk), dt=DRONE_TYPES.find(t=>t.key===dr.type);
  host.style.setProperty('--c',`var(${scaleCtx.tone})`);
  host.innerHTML = `
    <div class="pr-line"><span class="pr-k">Drone</span><span class="pr-v">${m.root} · ${dt.label.toLowerCase()}</span></div>
    <div class="pr-line"><span class="pr-k">Groove</span><span class="pr-v">${g.label} · ${g.bpm} bpm</span></div>
    <div class="pr-pat"><span class="pr-k">Practice</span><span>${practiceText(m)}</span></div>
    <div class="pr-prompt">${improvText(m)}</div>
    <button class="pr-play" id="modeBacking">
      <svg class="dp-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      <svg class="dp-stop" viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="7" width="10" height="10" rx="2"/></svg>
      <span>Play backing</span></button>`;
  document.getElementById('modeBacking').addEventListener('click',()=>toggleBacking(gk, dr));
  syncBackingButton();
}
function toggleBacking(gk, dr){
  const m=scaleCtx.modes[activeMode];
  if(Drone.playing && Metro.running){ Drone.stop(); Metro.stop(); }
  else {
    Drone.followWheel=true; Drone.rootName=m.root; Drone.type=dr.type; Drone.voice=dr.voice; Drone.start();
    Metro.setPreset(gk); if(!Metro.running) Metro.start();
    if(typeof updateDroneCard==='function') updateDroneCard();
    if(typeof updateRhythmCard==='function') updateRhythmCard();
  }
  syncBackingButton(); syncDroneButtons(); buzz();
}
function syncBackingButton(){
  const b=document.getElementById('modeBacking'); if(!b) return;
  const live=Drone.playing && Metro.running;
  b.classList.toggle('playing',live);
  const s=b.querySelector('span'); if(s) s.textContent = live ? 'Stop backing' : 'Play backing';
}

/* ============================================================
   SCALES VIEW — per-key scale & diatonic chords
   ============================================================ */
let activeKey = 0;

function buildKeyBar(){
  const bar = document.getElementById('keybar');
  bar.innerHTML='';
  KEYS.forEach((k,i)=>{
    const rel = relativeMinorName(k);
    const b=document.createElement('button');
    b.className='keypill'+(i===activeKey?' on':'');
    b.innerHTML = `${k.tonic}<small>${rel}</small>`;
    b.addEventListener('click',()=>{ activeKey=i; buildKeyBar(); renderKey(); });
    bar.appendChild(b);
  });
}

/* ---- chord progressions by style (module 7) ---- */
let scaleProgStyle='worship';
const PROGRESSIONS={
  worship:{label:'Worship', items:[['I','V','vi','IV'],['vi','IV','I','V'],['I','IV','I','V']]},
  folk:{label:'Folk', items:[['I','IV','V'],['I','V','vi','IV'],['IV','I','V']]},
  celtic:{label:'Celtic', items:[['I','♭VII','IV'],['vi','IV','I','V'],['I','V','♭VII','IV']]},
  meditative:{label:'Meditative', items:[['I','vi'],['I','IV'],['vi','IV'],['I','iii','IV']]},
  cinematic:{label:'Cinematic', items:[['vi','IV','I','V'],['I','♭VI','♭VII'],['vi','♭VII','I']]},
  eastern:{label:'Middle Eastern', items:[['i','♭VII','♭VI','V'],['I','♭II'],['i','V']], note:'play it over a Hijaz drone — the magic is the raised 3rd against the ♭2.'},
};
function romanChord(key, tok){
  const notes=key.notes, tonicPc=tRootPC(key.tonic);
  const DI={'I':[0,''],'i':[0,'m'],'ii':[1,'m'],'iii':[2,'m'],'IV':[3,''],'iv':[3,'m'],'V':[4,''],'vi':[5,'m'],'vii°':[6,'°']};
  if(DI[tok]) return notes[DI[tok][0]]+DI[tok][1];
  const BO={'♭II':[1,1],'♭III':[2,3],'♭VI':[5,8],'♭VII':[6,10]};
  if(BO[tok]){ const L=notes[BO[tok][0]][0]; return tSpell(L,(tonicPc+BO[tok][1])%12); }
  return tok;
}
function buildProgStyles(){
  const host=document.getElementById('progStyles'); if(!host) return; host.innerHTML='';
  Object.keys(PROGRESSIONS).forEach(k=>{ const b=document.createElement('button'); b.className='dchip'+(k===scaleProgStyle?' on':''); b.textContent=PROGRESSIONS[k].label;
    b.addEventListener('click',()=>{ scaleProgStyle=k; buildProgStyles(); renderProgList(); buzz(); }); host.appendChild(b); });
}
function renderProgList(){
  const host=document.getElementById('progList'); if(!host) return;
  const key=KEYS[activeKey], st=PROGRESSIONS[scaleProgStyle];
  host.innerHTML = st.items.map(toks=>`<div class="prog">${toks.map(t=>`<span class="prog-chord"><b>${romanChord(key,t)}</b><small>${t}</small></span>`).join('<i>→</i>')}</div>`).join('')
    + (st.note?`<div class="prog-note">${st.note}</div>`:'');
}

function renderKey(){
  const key = KEYS[activeKey];
  const host = document.getElementById('keyBody');
  const chords = diatonicChords(key);

  const scaleTiles = key.notes.map((nt,i)=>{
    let cls='note'+(i===0?' root':'');
    return `<div class="${cls}"><span class="d">${i+1}</span>${nt}</div>`;
  }).join('');

  const chordRow = (c)=>`
    <div class="chord${c.is145?' is145':''}" style="--c:var(${VAR[c.degree]})">
      <div class="rn">${c.roman}</div>
      <div class="cmid"><div class="cname">${c.name}</div><div class="cnotes">${c.notes}</div></div>
      <div class="cmode">${c.mode}</div>
    </div>`;

  const majors = chords.filter(c=>c.quality==='major');
  const minors = chords.filter(c=>c.quality==='minor');
  const dims   = chords.filter(c=>c.quality==='dim');

  host.innerHTML = `
    <div class="scale-title reveal">The ${key.tonic} Major Scale</div>
    <div class="scale-sub reveal">relative minor · ${relativeMinorName(key)}</div>
    <div class="card reveal" style="padding:18px 16px">
      <div class="notes">${scaleTiles}</div>
    </div>

    <div class="chord-group reveal">
      <div class="gh"><h3>Major Chords</h3><em>I · IV · V</em></div>
      <div class="chords">${majors.map(chordRow).join('')}</div>
    </div>

    <div class="chord-group reveal">
      <div class="gh"><h3>Minor Chords</h3><em>ii · iii · vi</em></div>
      <div class="chords">${minors.map(chordRow).join('')}</div>
    </div>

    <div class="chord-group reveal">
      <div class="gh"><h3>Diminished</h3><em>vii°</em></div>
      <div class="chords">${dims.map(chordRow).join('')}</div>
    </div>

    <div class="callout reveal">
      <div class="ic">✨</div>
      <div class="ct">The <b>1&ndash;4&ndash;5</b> &mdash; ${chords[0].name}, ${chords[3].name}, ${chords[4].name} &mdash;
      are the three bright major chords most songs are built from. Simcha&rsquo;s &ldquo;happy&rdquo; progression.</div>
    </div>

    <div class="section-label reveal" style="margin-top:32px"><span class="n">♪</span><h2>Progressions</h2><span class="hint">pick a feel</span></div>
    <div class="dchips reveal" id="progStyles"></div>
    <div class="prog-list reveal" id="progList"></div>`;
  buildProgStyles(); renderProgList();
  observeReveals(host); triggerReveals(host);
}

/* ============================================================
   TUNING EXPLORER — base tuning → scales, modes, modal worlds, lever lab
   ============================================================ */
let tuneBase = 'E♭';
let tuneCat = 'all';
let tuneScales = generateScales(tuneBase);
let labUp = new Set();

function leverStrip(leversUp){
  const up = new Set(leversUp);
  return `<div class="lup">${TLETTERS.map(L=>`<span class="lchip${up.has(L)?' on':''}">${L}${up.has(L)?'<i>▲</i>':''}</span>`).join('')}</div>`;
}

function scaleCard(sc){
  const upTxt = sc.leversUp.length ? sc.leversUp.join(' · ') : 'none — home tuning';
  const tags = sc.good.map(g=>`<span class="ttag">${g}</span>`).join('');
  const rel = sc.relMinor ? ` · rel. minor ${sc.relMinor}m` : '';
  const modes = sc.modes
    ? `<div class="tc-modes"><span class="tcm-label">Modes</span>${sc.modes.map(m=>`<span>${m.root} ${m.name}</span>`).join('')}</div>` : '';
  return `<article class="tcard reveal">
    <div class="tc-head">
      <div class="tc-titles"><div class="tc-name">${sc.name}</div><div class="tc-sub">${sc.related}${rel}</div></div>
      <span class="tc-diff d${sc.lvl}">${sc.difficulty}</span>
    </div>
    <div class="tc-levers"><span class="tcl-label">Levers up</span><b>${upTxt}</b></div>
    ${leverStrip(sc.leversUp)}
    <div class="tc-notes">${sc.notes.join('<i>·</i>')}</div>
    <div class="tc-mood">${sc.mood}</div>
    <div class="tc-tags">${tags}</div>
    ${modes}
  </article>`;
}

function buildBaseSeg(){
  const seg=document.getElementById('baseSeg'); seg.innerHTML='';
  ['E♭','C'].forEach(b=>{
    const btn=document.createElement('button');
    btn.className='seg-btn'+(b===tuneBase?' on':'');
    btn.textContent=TBASES[b].label;
    btn.addEventListener('click',()=>{
      if(tuneBase===b) return;
      tuneBase=b; tuneScales=generateScales(b); labUp=new Set();
      buildBaseSeg(); renderTune(); buzz();
    });
    seg.appendChild(btn);
  });
  document.getElementById('baseBlurb').textContent=TBASES[tuneBase].blurb;
}

function buildCatChips(){
  const host=document.getElementById('catChips'); host.innerHTML='';
  TCATEGORIES.forEach(c=>{
    const b=document.createElement('button');
    b.className='cat-chip'+(c.key===tuneCat?' on':'')+(c.key==='lab'?' lab':'');
    b.textContent=c.label;
    b.addEventListener('click',()=>{ tuneCat=c.key; buildCatChips(); renderTune();
      const on=host.querySelector('.cat-chip.on'); on&&on.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'}); });
    host.appendChild(b);
  });
}

function renderTune(){
  const host=document.getElementById('tuneBody');
  if(tuneCat==='lab'){ host.innerHTML=leverLabUI(); bindLab(); observeReveals(host); triggerReveals(host); return; }
  const list = tuneCat==='all' ? tuneScales : tuneScales.filter(s=>s.cat===tuneCat);
  host.innerHTML = `<div class="tcount reveal">${list.length} clean ${list.length===1?'world':'worlds'} on the ${tuneBase} base</div>`
    + list.map(scaleCard).join('');
  observeReveals(host); triggerReveals(host);
}

function leverLabUI(){
  const r = leverLab(tuneBase, labUp);
  const toggles = TLETTERS.map((L,i)=>{
    const up=labUp.has(L);
    return `<button class="lab-tog${up?' on':''}" data-l="${L}">
      <span class="lt-letter">${L}</span><span class="lt-note">${r.notes[i]}</span><span class="lt-state">${up?'▲ up':'down'}</span></button>`;
  }).join('');
  const matchHTML = r.matches.length
    ? r.matches.map(m=>{
        const extra = m.modes ? `<div class="lm-modes">${m.relMinor}m · ${m.modes.map(x=>x.root+' '+x.name).join(' · ')}</div>` : '';
        return `<div class="lm"><div class="lm-top"><span class="lm-name">${m.name}</span><span class="lm-fam">${m.famName.split(' · ')[0]}</span></div>${extra}</div>`;
      }).join('')
    : `<div class="lm-none">No standard 7-note scale matches this exact set — every note above is still yours to explore freely.</div>`;
  return `<div class="lab reveal">
    <p class="lab-q">Toggle each lever to match your harp — see your notes and what you can play.</p>
    <div class="lab-toggles">${toggles}</div>
    <div class="lab-result">
      <div class="lab-lbl">Your notes</div>
      <div class="lab-notes">${r.notes.join('<i>·</i>')}</div>
      <div class="lab-lbl">You can play</div>
      <div class="lab-matches">${matchHTML}</div>
    </div>
  </div>`;
}
function bindLab(){
  document.querySelectorAll('.lab-tog').forEach(b=>{
    b.addEventListener('click',()=>{ const L=b.dataset.l; labUp.has(L)?labUp.delete(L):labUp.add(L); buzz(); renderTune(); });
  });
}

/* ============================================================
   JOURNEY — guided walkthrough that replicates the teaching video
   Title → What is a mode? → Mother Scale (Ionian) → each mode → outro
   ============================================================ */
const JRN_STEPS = [
  {kind:'title'},
  {kind:'intro'},
  {kind:'mode', m:0}, {kind:'mode', m:1}, {kind:'mode', m:2}, {kind:'mode', m:3},
  {kind:'mode', m:4}, {kind:'mode', m:5}, {kind:'mode', m:6},
  {kind:'outro'},
];
let jrnStep = 0;

/* a static flower for mode mi: root at 12 o'clock, scale clockwise, flavor highlighted */
function flowerSVG(mi){
  const mode = MODES[mi];
  const petals = mode.notes.map((nt,j)=>{
    const a = j*STEP * Math.PI/180;
    const x=(92*Math.sin(a)).toFixed(1), y=(-92*Math.cos(a)).toFixed(1);
    const isRoot=(j===0), isFlavor=(nt===mode.wheelFlavor);
    let cls='jp'+(isRoot?' root':'')+(isFlavor?' flavor':'');
    const label = isRoot ? 'Root' : (isFlavor ? 'Flavor' : '');
    const style = isFlavor ? ` style="--c:var(${VAR[mi]})"` : '';
    return `<g class="${cls}" transform="translate(${x} ${y})"${style}>
        <circle r="27"></circle>
        <text class="jn" y="${label?'1':'7'}" text-anchor="middle">${nt}</text>
        ${label?`<text class="jl" y="15" text-anchor="middle">${label}</text>`:''}
      </g>`;
  }).join('');
  return `<svg class="flower" viewBox="-130 -134 260 270" style="--c:var(${VAR[mi]})">
      <path class="topmark" d="M0 -123 l-7 -11 l14 0 Z"></path>
      ${petals}
      <text class="jc-name" y="-3" text-anchor="middle" fill="${''}">${mode.name}</text>
      <text class="jc-sub" y="16" text-anchor="middle">${ordinalWord(mi)} mode</text>
    </svg>`;
}

function jrnRender(dir){
  const step = JRN_STEPS[jrnStep];
  const stage = document.getElementById('jrnStage');
  let html='';
  if(step.kind==='title'){
    html = `<div class="jrn-slide center">
      <img class="jrn-lyre" src="img/lyre.png" alt="">
      <div class="kicker">Theory 101</div>
      <h1 class="jrn-h1">A Journey<br>Through the Modes</h1>
      <p class="jrn-lead">Seven colours hidden inside one scale. Take them one step at a time.</p>
    </div>`;
  } else if(step.kind==='intro'){
    html = `<div class="jrn-slide center">
      <div class="jrn-q">What is a mode?</div>
      <p class="jrn-lead big">Take one scale. Start it on a different note.<br>Same notes — a whole new feeling.<br><em>That</em> is a mode.</p>
    </div>`;
  } else if(step.kind==='mode'){
    const mi=step.m;
    html = `<div class="jrn-slide" style="--c:var(${VAR[mi]})">
      ${flowerSVG(mi)}
      <p class="jrn-lead">${JOURNEY_LEAD[MODES[mi].name]}</p>
      <div class="jrn-diff">${diffHTML(mi)}</div>
    </div>`;
  } else if(step.kind==='outro'){
    html = `<div class="jrn-slide center">
      <img class="jrn-lyre" src="img/lyre.png" alt="">
      <h1 class="jrn-h1">Seven modes,<br>one mother scale</h1>
      <p class="jrn-lead">Now spin the wheel and explore them for yourself.</p>
      <button class="jrn-cta" id="jrnToWheel">Open the Wheel →</button>
    </div>`;
  }
  stage.innerHTML = html;
  stage.scrollTop = 0; window.scrollTo(0,0);
  // re-trigger entrance (directional when swiping/stepping)
  const slide = stage.firstElementChild;
  slide.classList.add('jrn-in');
  if(dir===1) slide.classList.add('from-right');
  else if(dir===-1) slide.classList.add('from-left');

  // progress dots
  document.querySelectorAll('.jrn-progress .jdot').forEach((d,i)=>d.classList.toggle('on', i===jrnStep));
  // nav state
  document.getElementById('jrnBack').disabled = jrnStep===0;
  const next=document.getElementById('jrnNext');
  next.style.visibility = jrnStep===JRN_STEPS.length-1 ? 'hidden':'visible';
  const cta=document.getElementById('jrnToWheel');
  if(cta) cta.addEventListener('click',()=>{ showView('modes'); setMode(0,false); });
}
function jrnGo(d){
  const nv = Math.max(0, Math.min(JRN_STEPS.length-1, jrnStep+d));
  if(nv===jrnStep) return;
  jrnStep = nv;
  jrnRender(d>0?1:-1);
}
function buildJourney(){
  const prog=document.querySelector('.jrn-progress');
  prog.innerHTML = JRN_STEPS.map(()=>`<span class="jdot"></span>`).join('');
  document.getElementById('jrnBack').addEventListener('click',()=>jrnGo(-1));
  document.getElementById('jrnNext').addEventListener('click',()=>jrnGo(1));
  addSwipe(document.getElementById('jrnStage'), {onLeft:()=>jrnGo(1), onRight:()=>jrnGo(-1)});
  jrnRender();
}

/* ============================================================
   DRONE STUDIO
   ============================================================ */
const DRONE_TYPES = [
  {key:'tonic',  label:'Tonic'},
  {key:'fifth',  label:'Tonic + 5th'},
  {key:'octave', label:'Tonic + Octave'},
  {key:'full',   label:'Tonic + 5th + 8ve'},
];
const DRONE_SOUNDS = [
  {key:'shruti',   label:'Shruti Box',       kind:'sample', set:'shruti'},
  {key:'harpwind', label:'Harp in the Wind', kind:'sample', set:'harpwind'},
  {key:'pad',      label:'Warm Pad',         kind:'synth',  voice:'pad'},
  {key:'pure',     label:'Pure',             kind:'synth',  voice:'pure'},
  {key:'reed',     label:'Reed',             kind:'synth',  voice:'reed'},
];
let droneSound='pad';   // default to the synth pad until recordings are added
function setDroneSound(s){
  droneSound=s.key;
  if(s.kind==='sample'){ Drone.kind='sample'; Drone.set=s.set; }
  else { Drone.kind='synth'; Drone.voice=s.voice; }
  if(Drone.playing){ Drone.stop(); Drone.start(); }
}
const DRONE_MOODS = [
  {key:'peaceful',  label:'Peaceful',       atmos:'atmos-peaceful',  sound:'pad',     type:'fifth'},
  {key:'ancient',   label:'Ancient',        atmos:'atmos-ancient',   sound:'shruti',  type:'octave'},
  {key:'celtic',    label:'Celtic',         atmos:'atmos-celtic',    sound:'harpwind',type:'fifth'},
  {key:'hebrew',    label:'Hebrew Desert',  atmos:'atmos-desert',    sound:'shruti',  type:'fifth'},
  {key:'mideast',   label:'Middle Eastern', atmos:'atmos-desert',    sound:'reed',    type:'fifth'},
  {key:'cinematic', label:'Cinematic',      atmos:'atmos-cinematic', sound:'pad',     type:'full'},
  {key:'meditative',label:'Meditation',     atmos:'atmos-medit',     sound:'pad',     type:'tonic'},
  {key:'bright',    label:'Bright',         atmos:'atmos-bright',    sound:'pure',    type:'full'},
];
let droneMood='peaceful';
const ATMOS_CLASSES = DRONE_MOODS.map(m=>m.atmos);
function setDroneMood(m){
  droneMood=m.key;
  const hero=document.getElementById('droneHero');
  if(hero){ ATMOS_CLASSES.forEach(c=>hero.classList.remove(c)); hero.classList.add(m.atmos); }
  Drone.type=m.type;
  const s=DRONE_SOUNDS.find(x=>x.key===m.sound) || DRONE_SOUNDS[2];
  setDroneSound(s);              // sets sound + restarts if playing
  buildDrone();
}
function droneNotesLabel(){
  const r=Drone.rootName, pc=tRootPC(r), rli=TLETTERS.indexOf(r[0]);
  const fifth=tSpell(TLETTERS[(rli+4)%7],(pc+7)%12);
  const map={tonic:[r], fifth:[r,fifth], octave:[r,r], full:[r,fifth,r]};
  return (map[Drone.type]||[r]).join(' + ');
}

function buildDrone(){
  const mk=(host,items,sel,on)=>{
    if(!host) return; host.innerHTML='';
    items.forEach(it=>{
      const b=document.createElement('button');
      b.className=(host.id==='droneKeys'?'keychip':'dchip')+(sel(it)?' on':'');
      b.textContent=it.label||it;
      b.addEventListener('click',()=>{ on(it); buzz(); buildDrone(); });
      host.appendChild(b);
    });
  };
  mk(document.getElementById('droneKeys'), KEYS12.map(k=>({key:k,label:k})), it=>it.key===Drone.rootName,
     it=>{ Drone.followWheel=false; Drone.setRoot(it.key); });
  mk(document.getElementById('droneTypes'), DRONE_TYPES, it=>it.key===Drone.type,
     it=>{ Drone.type=it.key; if(Drone.playing) Drone.start(); });
  mk(document.getElementById('droneVoices'), DRONE_SOUNDS, it=>it.key===droneSound,
     it=>setDroneSound(it));
  mk(document.getElementById('droneMoods'), DRONE_MOODS, it=>it.key===droneMood,
     it=>setDroneMood(it));
  updateDroneCard();
}

const TYPE_SHORT={tonic:'Tonic', fifth:'Fifth', octave:'Octave', full:'Fifth + Octave'};
function updateDroneCard(){
  const root=document.getElementById('droneRoot'); if(root) root.textContent=droneNotesLabel();
  const meta=document.getElementById('droneMeta');
  if(meta){ const s=DRONE_SOUNDS.find(x=>x.key===droneSound);
    meta.textContent=`${TYPE_SHORT[Drone.type]||''} · ${s.label}`; }
  syncDroneButtons();
}
function syncDroneButtons(){
  const dp=document.getElementById('dronePlay'); if(dp) dp.classList.toggle('playing', Drone.playing && Drone.followWheel!==true);
  document.querySelectorAll('.wheel-drone').forEach(b=>{
    const live = Drone.playing && Drone.followWheel===true;
    b.classList.toggle('playing', live);
    const s=b.querySelector('span'); if(s) s.textContent = live ? 'Stop drone' : 'Hear the drone';
  });
  updateNowPlaying();
}
function updateNowPlaying(){
  const np=document.getElementById('nowPlaying'); if(!np) return;
  const droneOn=(typeof Drone!=='undefined'&&Drone.playing), metroOn=(typeof Metro!=='undefined'&&Metro.running);
  np.hidden = !(droneOn||metroOn);
  if(np.hidden) return;
  let title='', sub='';
  if(droneOn){
    title = (Drone.followWheel && scaleCtx) ? `${scaleCtx.modes[activeMode].root} ${scaleCtx.modes[activeMode].name}` : `${droneNotesLabel()} drone`;
    sub = metroOn ? `Drone · ${RHYTHMS.find(r=>r.key===Metro.presetKey)?.label||'groove'}` : `Drone · ${TYPE_SHORT[Drone.type]||''}`;
  } else {
    title = RHYTHMS.find(r=>r.key===Metro.presetKey)?.label||'Rhythm';
    sub = `${Metro.bpm} BPM`;
  }
  const t=document.getElementById('npTitle'), s=document.getElementById('npSub');
  if(t) t.textContent=title; if(s) s.textContent=sub;
}
function initNowPlaying(){
  document.getElementById('npStop')?.addEventListener('click',()=>{
    Drone.stop(); Metro.stop(); syncDroneButtons();
    if(typeof updateRhythmCard==='function') updateRhythmCard();
    if(typeof syncBackingButton==='function') syncBackingButton();
    updateNowPlaying(); buzz();
  });
}

function initDrone(){
  buildDrone();
  Drone.onFallback=()=>{ droneSound='pad'; buildDrone(); const m=document.getElementById('droneMeta'); if(m) m.textContent='warm pad · recording coming soon'; };
  const play=document.getElementById('dronePlay');
  if(play) play.addEventListener('click',()=>{ Drone.followWheel=false; Drone.toggle(); syncDroneButtons(); buzz(); });
  const vol=document.getElementById('droneVol');
  if(vol) vol.addEventListener('input',()=>Drone.setVolume(vol.value/100));
  const wd=document.getElementById('wheelDrone');
  if(wd) wd.addEventListener('click',()=>{
    if(Drone.playing && Drone.followWheel){ Drone.stop(); }
    else { Drone.followWheel=true; Drone.setRoot(scaleCtx.modes[activeMode].root); Drone.start(); }
    syncDroneButtons(); buzz();
  });
}

/* ============================================================
   RHYTHM ENGINE
   ============================================================ */
function buildRhythm(){
  const host=document.getElementById('rhythmPresets');
  if(host){ host.innerHTML='';
    RHYTHMS.forEach(r=>{
      const b=document.createElement('button');
      b.className='dchip'+(r.key===Metro.presetKey?' on':'');
      b.textContent=r.label;
      b.addEventListener('click',()=>{ Metro.setPreset(r.key); buzz(); buildRhythm(); updateRhythmCard(); });
      host.appendChild(b);
    });
  }
  renderBeatDots();
  updateRhythmCard();
}
function renderBeatDots(){
  const host=document.getElementById('metroDots'); if(!host) return;
  const n=Metro.pattern.length, R=88; let s='';
  for(let i=0;i<n;i++){
    const a=(i/n*360-90)*Math.PI/180, x=110+R*Math.cos(a), y=110+R*Math.sin(a), acc=Metro.pattern[i];
    const cls=acc>=2?'md-dot strong':acc>=1.5?'md-dot med':acc>0?'md-dot':'md-dot silent';
    s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${acc>=2?7:5}" class="${cls}" data-i="${i}"/>`;
  }
  host.innerHTML=s;
}
function updateRhythmCard(){
  const n=document.getElementById('bpmNum'); if(n) n.textContent=Metro.bpm;
  const m=document.getElementById('rhythmMeter'); const p=RHYTHMS.find(r=>r.key===Metro.presetKey);
  if(m&&p) m.textContent=p.label;
  const play=document.getElementById('rhythmPlay'); if(play) play.classList.toggle('playing',Metro.running);
  document.querySelectorAll('#rhythmPresets .dchip').forEach((b,i)=>b.classList.toggle('on',RHYTHMS[i].key===Metro.presetKey));
  updateNowPlaying();
}
function rhythmBeat(acc,idx){
  const dot=document.querySelector('#metroDots .md-dot[data-i="'+idx+'"]');
  if(dot){ dot.classList.add('hit'); setTimeout(()=>dot.classList.remove('hit'),120); }
  if(acc>=2){ const play=document.getElementById('rhythmPlay'); if(play){ play.classList.add('beat'); setTimeout(()=>play.classList.remove('beat'),110); } }
}
function initRhythm(){
  buildRhythm();
  Metro.onBeat=rhythmBeat;
  document.getElementById('rhythmPlay')?.addEventListener('click',()=>{ Metro.toggle(); updateRhythmCard(); buzz(); });
  document.getElementById('bpmDown')?.addEventListener('click',()=>{ Metro.setBpm(Metro.bpm-2); updateRhythmCard(); });
  document.getElementById('bpmUp')?.addEventListener('click',()=>{ Metro.setBpm(Metro.bpm+2); updateRhythmCard(); });
  document.getElementById('tapBtn')?.addEventListener('click',()=>{ Metro.tap(); updateRhythmCard(); buzz(); });
  const vol=document.getElementById('rhythmVol'); if(vol) vol.addEventListener('input',()=>Metro.setVolume(vol.value/100));
}

/* ============================================================
   PRACTICE ROOM — a guided 5–90 min session
   ============================================================ */
let prTotal=20, prSegs=[], prIdx=0, prRemaining=0, prTimer=null, prPaused=false, prCtx=null;
const SEG_SETS = {
  s:['tune','scale','drone','improv','reflect'],
  m:['tune','warm','scale','drone','rhythm','improv','reflect'],
  l:['tune','warm','scale','drone','rhythm','lh','rh','improv','reflect'],
};
const SEG_W = {tune:1, warm:1, scale:1.4, drone:1.2, rhythm:1.2, lh:1.5, rh:1.5, improv:1.6, reflect:1};

function segInfo(key, c){
  const m=c.mode;
  switch(key){
    case 'tune':   return {title:'Tune up', text:`Set your harp with <b>all levers down</b>, then raise the levers for this scale. Check each string is clear and true.`};
    case 'warm':   return {title:'Warm up', text:`Loosen your hands. Play <b>${c.keyName} ${c.worldName}</b> slowly up and down — no tempo, just listen.`};
    case 'scale':  return {title:'The scale', parts:[`Play <b>${m.name}</b>: ${m.notes.join(' · ')}.`, `Name each degree aloud as you climb and fall.`]};
    case 'drone':  return {title:'Sink into the drone', audio:'drone', parts:[`A <b>${m.root}</b> drone is sounding. Play the scale over it slowly…`, `Feel how every note leans toward home.`]};
    case 'rhythm': return {title:'Add the pulse', audio:'both', text:`The <b>${c.grooveLabel}</b> groove joins the drone. Play the scale gently in time.`};
    case 'lh':     return {title:'Left hand', audio:'both', parts:[`Let your left hand find <b>${m.chord}</b> — its notes are ${(m.chordNotes||[]).join(' · ')}.`, `Play them gently on the strong beats, or roll them into a slow pattern that flows. Let each note ring on, so a soft harmony grows beneath your melody.`]};
    case 'rh':     return {title:'Right-hand motif', audio:'both', text:`Over the left hand, shape a 3–4 note motif. ${practiceText(m)}`};
    case 'improv': return {title:'Improvise', audio:'both', text:improvText(m)};
    case 'reflect':return {title:'Reflect', audio:'stop', text:`Let the sound fade to silence. What did you discover? Keep one phrase you loved — hum it once more.`};
  }
}
function buildSession(total, c){
  const set = total<=5?SEG_SETS.s : total<=10?SEG_SETS.m : SEG_SETS.l;
  const totalW = set.reduce((a,k)=>a+SEG_W[k],0);
  const segs = set.map(k=>({key:k, ...segInfo(k,c), mins:Math.max(1,Math.round(total*SEG_W[k]/totalW))}));
  let d = total - segs.reduce((a,s)=>a+s.mins,0), guard=0;
  const order=[...segs].sort((a,b)=>b.mins-a.mins);
  while(d!==0 && guard++<300){ const s=order[guard%order.length]; if(d>0){s.mins++;d--;} else if(s.mins>1){s.mins--;d++;} }
  return segs;
}

function buildPractice(){
  const dur=document.getElementById('prDurations');
  if(dur){ dur.innerHTML=''; [5,10,20,45,90].forEach(min=>{
    const b=document.createElement('button'); b.className='dchip'+(min===prTotal?' on':''); b.textContent=min+' min';
    b.addEventListener('click',()=>{ prTotal=min; buildPractice(); buzz(); }); dur.appendChild(b);
  }); }
  const host=document.getElementById('prFocus');
  if(host && scaleCtx){
    const m=scaleCtx.modes[activeMode], g=RHYTHMS.find(r=>r.key===suggestedGroove(mwWorld,activeMode));
    host.innerHTML=`<div class="prf-mode">${m.root} ${m.name}</div>
      <div class="prf-sub">${mwKey} ${mwWorld.name.split(' · ')[0]} · ${g.label}</div>
      <div class="prf-hint">Change it any time on the <b>Modes</b> wheel.</div>`;
  }
}

function startSession(){
  const m=scaleCtx.modes[activeMode], gk=suggestedGroove(mwWorld,activeMode), g=RHYTHMS.find(r=>r.key===gk);
  prCtx={ keyName:mwKey, worldName:mwWorld.name.split(' · ')[0], world:mwWorld, mode:m, grooveKey:gk, grooveLabel:g.label };
  prSegs=buildSession(prTotal, prCtx); prIdx=0; prPaused=false;
  document.getElementById('prSetup').hidden=true;
  document.getElementById('prRun').hidden=false;
  document.body.classList.add('in-session');
  document.getElementById('prProgress').innerHTML=prSegs.map(()=>'<span class="jdot"></span>').join('');
  window.scrollTo(0,0); renderStep(); buzz();
}
function prFmt(s){ const m=Math.floor(s/60), ss=s%60; return m+':'+(ss<10?'0':'')+ss; }
function renderStep(){
  const seg=prSegs[prIdx], stage=document.getElementById('prStage');
  if(seg.audio==='drone') prBacking(false);
  else if(seg.audio==='both') prBacking(true);
  else if(seg.audio==='stop'){ Drone.stop(); Metro.stop(); }
  prRemaining=seg.mins*60;
  const textHtml = seg.parts
    ? seg.parts.map((p,i)=>`<p class="pr-text pr-part${i===0?' shown':''}" data-part="${i}">${p}</p>`).join('')
    : `<p class="pr-text pr-fade">${seg.text}</p>`;
  stage.innerHTML=`<div class="pr-step jrn-in">
    <div class="pr-seg">Step ${prIdx+1} of ${prSegs.length} · ${seg.mins} min</div>
    <h2 class="pr-title">${seg.title}</h2>
    <div class="pr-timer" id="prTimer">${prFmt(prRemaining)}</div>
    <div class="pr-bar"><span id="prBar"></span></div>
    ${textHtml}
    ${seg.key==='reflect'?`<textarea id="prReflect" class="pr-reflect" placeholder="One phrase you want to keep…"></textarea>`:''}
  </div>`;
  document.querySelectorAll('#prProgress .jdot').forEach((d,i)=>d.classList.toggle('on',i<=prIdx));
  document.getElementById('prNext').textContent = prIdx===prSegs.length-1?'Finish ✓':'Next ›';
  document.getElementById('prPause').textContent='Pause'; prPaused=false;
  const back=document.getElementById('prBack'); if(back) back.style.visibility = prIdx===0?'hidden':'visible';
  clearInterval(prTimer);
  const segTotal=seg.mins*60, PR_REVEAL=11;
  prTimer=setInterval(()=>{
    if(prPaused) return;
    prRemaining--;
    const t=document.getElementById('prTimer'); if(t) t.textContent=prFmt(Math.max(0,prRemaining));
    const bar=document.getElementById('prBar'); if(bar) bar.style.width=(100*(segTotal-prRemaining)/segTotal)+'%';
    if(seg.parts){ const elapsed=segTotal-prRemaining;                   // stage the lines in, with a breath between
      seg.parts.forEach((p,i)=>{ if(i>0 && elapsed>=i*PR_REVEAL){ const el=stage.querySelector('.pr-part[data-part="'+i+'"]'); if(el && !el.classList.contains('shown')) el.classList.add('shown'); } }); }
    if(prRemaining<=0) nextStep();
  },1000);
}
function prevStep(){ if(prIdx<=0) return; prIdx--; renderStep(); buzz(); }
function prBacking(withRhythm){
  Drone.followWheel=false; Drone.rootName=prCtx.mode.root;
  const d=suggestedDrone(prCtx.world); Drone.type=d.type; Drone.voice=d.voice;
  if(!Drone.playing) Drone.start(); else Drone.setRoot(prCtx.mode.root);
  if(withRhythm){ if(Metro.presetKey!==prCtx.grooveKey) Metro.setPreset(prCtx.grooveKey); if(!Metro.running) Metro.start(); }
}
function pauseToggle(){ prPaused=!prPaused; document.getElementById('prPause').textContent=prPaused?'Resume':'Pause'; buzz(); }
function nextStep(){ if(prIdx>=prSegs.length-1){ endSession(true); return; } prIdx++; renderStep(); buzz(); }
function endSession(completed){
  clearInterval(prTimer); Drone.stop(); Metro.stop();
  if(completed && prCtx){
    const note=(document.getElementById('prReflect')?.value||'').trim();
    logSession({ date:new Date().toISOString(), minutes:prTotal, key:prCtx.keyName, world:prCtx.worldName,
      mode:`${prCtx.mode.root} ${prCtx.mode.name}`, groove:prCtx.grooveLabel, note });
  }
  document.body.classList.remove('in-session');
  const run=document.getElementById('prRun'), setup=document.getElementById('prSetup');
  if(run) run.hidden=true; if(setup) setup.hidden=false;
  buildPractice();
}
function initPractice(){
  buildPractice();
  document.getElementById('prBegin')?.addEventListener('click',startSession);
  document.getElementById('prNext')?.addEventListener('click',()=>nextStep());
  document.getElementById('prBack')?.addEventListener('click',()=>prevStep());
  document.getElementById('prPause')?.addEventListener('click',pauseToggle);
  document.getElementById('prExit')?.addEventListener('click',()=>endSession(false));
}

/* ============================================================
   REPERTOIRE HELPER — is this song playable on your harp?
   ============================================================ */
const REP_QUAL = { major:{label:'Major', formula:[0,2,4,5,7,9,11]}, minor:{label:'Minor', formula:[0,2,3,5,7,8,10]} };
let repBase='E♭', repKey='C', repQual='major';

function spellScale(keyName, formula){
  const rpc=tRootPC(keyName), s=TLETTERS.indexOf(keyName[0]);
  return formula.map((iv,i)=>tSpell(TLETTERS[(s+i)%7],(rpc+iv)%12));
}
function repAnalyze(){
  const fam={formula:REP_QUAL[repQual].formula, cat:'rep', name:'rep'};
  const here=computeScale(repBase, repKey, fam);
  const kpc=tRootPC(repKey);
  const clean=[];
  TCANDIDATES[repBase].forEach(root=>{ const s=computeScale(repBase,root,fam); if(s) clean.push({root, leversUp:s.leversUp, pc:tRootPC(root)}); });
  let best=null;
  clean.forEach(c=>{ if(c.root===repKey) return; let d=((c.pc-kpc)%12+12)%12; if(d>6)d-=12;
    const dist=Math.abs(d);
    if(!best || dist<best.dist || (dist===best.dist && c.leversUp.length<best.leversUp.length)) best={...c,d,dist};
  });
  return {here, clean, best, notes:spellScale(repKey, fam.formula)};
}

function buildRepertoire(){
  const seg=document.getElementById('repBaseSeg');
  if(seg){ seg.innerHTML=''; ['E♭','C'].forEach(b=>{
    const btn=document.createElement('button'); btn.className='seg-btn'+(b===repBase?' on':''); btn.textContent=TBASES[b].label;
    btn.addEventListener('click',()=>{ if(repBase===b)return; repBase=b; buildRepertoire(); buzz(); }); seg.appendChild(btn);
  }); }
  const keys=document.getElementById('repKeys');
  if(keys){ keys.innerHTML=''; KEYS12.forEach(k=>{
    const b=document.createElement('button'); b.className='keychip'+(k===repKey?' on':''); b.textContent=k;
    b.addEventListener('click',()=>{ repKey=k; buildRepertoire(); buzz(); b.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'}); }); keys.appendChild(b);
  }); }
  const ql=document.getElementById('repQual');
  if(ql){ ql.innerHTML=''; Object.keys(REP_QUAL).forEach(q=>{
    const b=document.createElement('button'); b.className='dchip'+(q===repQual?' on':''); b.textContent=REP_QUAL[q].label;
    b.addEventListener('click',()=>{ repQual=q; buildRepertoire(); buzz(); }); ql.appendChild(b);
  }); }
  renderRepertoire();
}

function renderRepertoire(){
  const host=document.getElementById('repResult'); if(!host) return;
  const a=repAnalyze();
  const keyLabel=`${repKey} ${REP_QUAL[repQual].label}`;
  const notesHtml=`<div class="rep-notes">${a.notes.join('<i>·</i>')}</div>`;
  let verdict, body;
  if(a.here){
    const up=a.here.leversUp.length?a.here.leversUp.join(' · '):'none — home tuning';
    verdict=`<div class="rep-verdict ok">✓ Playable cleanly</div>`;
    body=`<div class="rep-row"><span class="rep-k">Levers up</span><b>${up}</b></div>
      <div class="rep-note">Set these once and play the whole song on your <b>${repBase}</b> harp — no lever changes needed.</div>`;
  } else {
    verdict=`<div class="rep-verdict warn">⚠ Not clean in this key</div>`;
    if(a.best){
      const dir=a.best.d>0?'up':'down'; const semis=Math.abs(a.best.d);
      const up=a.best.leversUp.length?a.best.leversUp.join(' · '):'none';
      body=`<div class="rep-note"><b>${keyLabel}</b> can’t be tuned cleanly on the <b>${repBase}</b> harp.</div>
        <div class="rep-suggest"><span class="rep-k">Easiest key</span>
          <div><b>${a.best.root} ${REP_QUAL[repQual].label}</b> — transpose ${semis} semitone${semis>1?'s':''} ${dir}<br><span class="rep-sub">levers up: ${up}</span></div></div>`;
    } else {
      body=`<div class="rep-note">No clean ${REP_QUAL[repQual].label.toLowerCase()} key is reachable on this base.</div>`;
    }
  }
  const chips=a.clean.map(c=>`<button class="rep-keychip${c.root===repKey?' on':''}" data-k="${c.root}">${c.root}</button>`).join('');
  host.innerHTML = `
    <div class="rep-head"><div class="rep-title">${keyLabel}</div>${verdict}</div>
    ${notesHtml}
    ${body}
    <div class="rep-clean"><span class="rep-k">Clean ${REP_QUAL[repQual].label.toLowerCase()} keys on ${repBase}</span><div class="rep-keys">${chips}</div></div>`;
  host.querySelectorAll('.rep-keychip').forEach(b=>b.addEventListener('click',()=>{ repKey=b.dataset.k; buildRepertoire(); buzz(); }));
}

/* ============================================================
   HARP TUNER — mic pitch detection
   ============================================================ */
let tunerBase='E♭', tunerCal=440;
let tunerNoisy=(()=>{ try{ return localStorage.getItem('soh-tuner-noisy')==='1'; }catch(e){ return false; } })();
function tunerApplyNoise(){
  // Standard already gates ambience; Noisy room demands a louder, cleaner signal
  // (for squeaky appliances, fans, conversation nearby).
  if(tunerNoisy){ Tuner.rmsMin=0.03; Tuner.clarityMin=0.96; Tuner.stableFrames=4; }
  else { Tuner.rmsMin=0.012; Tuner.clarityMin=0.93; Tuner.stableFrames=3; }
}
function buildTuner(){
  tunerApplyNoise();
  const cal=document.getElementById('tunerCal');
  if(cal){ cal.innerHTML=''; [440,441,442].forEach(a=>{
    const b=document.createElement('button'); b.className='dchip'+(a===tunerCal?' on':''); b.textContent='A'+a;
    b.addEventListener('click',()=>{ tunerCal=a; Tuner.a4=a; buildTuner(); buzz(); }); cal.appendChild(b);
  });
    const nb=document.createElement('button'); nb.className='dchip'+(tunerNoisy?' on':''); nb.textContent='Noisy room';
    nb.title='Stricter filtering — ignores background noise, needs a clear pluck';
    nb.addEventListener('click',()=>{ tunerNoisy=!tunerNoisy; try{ localStorage.setItem('soh-tuner-noisy',tunerNoisy?'1':'0'); }catch(e){} buildTuner(); buzz(); });
    cal.appendChild(nb);
  }
  const seg=document.getElementById('tunerBaseSeg');
  if(seg){ seg.innerHTML=''; ['E♭','C'].forEach(bk=>{
    const btn=document.createElement('button'); btn.className='seg-btn'+(bk===tunerBase?' on':''); btn.textContent=TBASES[bk].label;
    btn.addEventListener('click',()=>{ if(tunerBase===bk)return; tunerBase=bk; buildTuner(); buzz(); }); seg.appendChild(btn);
  }); }
  renderTunerStrings();
}
function renderTunerStrings(detectedName){
  const host=document.getElementById('tunerStrings'); if(!host) return;
  const down = TLETTERS.map(L=>tSpell(L, TBASES[tunerBase].down[L]));
  host.innerHTML = down.map(n=>`<span class="tstr${detectedName&&n===detectedName?' on':''}">${n}</span>`).join('');
}
function buildTunerGauge(){
  const g=document.getElementById('tgTicks'); if(!g) return; let s='';
  for(let i=0;i<=20;i++){
    const deg=-90+i*9, a=deg*Math.PI/180, major=(i%5===0), R1=104, R2=major?86:96;
    const x1=120+R1*Math.sin(a), y1=124-R1*Math.cos(a), x2=120+R2*Math.sin(a), y2=124-R2*Math.cos(a);
    s+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="tk${i===10?' center':major?' maj':''}"/>`;
  }
  g.innerHTML=s;
}
function tunerUpdate(freq, note){
  const noteEl=document.getElementById('tunerNote'), octEl=document.getElementById('tunerOct'),
        freqEl=document.getElementById('tunerFreq'), needle=document.getElementById('tgNeedle');
  if(!noteEl) return;
  const setNeedle=(cents,intune)=>{ if(!needle) return;
    const deg=Math.max(-1,Math.min(1,cents/50))*88;
    needle.setAttribute('transform',`rotate(${deg} 120 124)`); needle.classList.toggle('intune',intune); };
  if(!note){
    noteEl.textContent='—'; noteEl.className='tuner-note';
    octEl.textContent = Tuner.running ? 'listening… play a string' : 'tap start, then play a string';
    freqEl.textContent='—'; setNeedle(0,false);
    renderTunerStrings(); return;
  }
  const inTune=Math.abs(note.cents)<=5;
  noteEl.textContent=note.name; noteEl.className='tuner-note'+(inTune?' intune':'');
  const enh=ENHARM[note.name]?` (${ENHARM[note.name]})`:'';
  octEl.textContent=`octave ${note.octave}${enh} · ${note.cents>=0?'+':''}${note.cents}¢`;
  freqEl.textContent=freq.toFixed(1)+' Hz';
  setNeedle(note.cents,inTune);
  renderTunerStrings(note.name);
}
function initTuner(){
  Tuner.onUpdate=tunerUpdate;
  Tuner.onError=()=>{ const o=document.getElementById('tunerOct'); if(o) o.textContent='Microphone access needed — allow it, then tap again.';
    document.getElementById('tunerMic')?.classList.remove('playing'); };
  buildTunerGauge();
  buildTuner();
  document.getElementById('tunerMic')?.addEventListener('click',async()=>{
    const btn=document.getElementById('tunerMic');
    if(Tuner.running){ Tuner.stop(); btn.classList.remove('playing'); tunerUpdate(-1,null); }
    else { btn.classList.add('playing'); await Tuner.start(); if(!Tuner.running) btn.classList.remove('playing'); }
    buzz();
  });
}

/* ============================================================
   LEVER CHANGE TRAINER — drill clean lever flips with the metronome
   ============================================================ */
let lt={base:'E♭', from:'C', to:'G', bars:2, bpm:80, timing:'beat', running:false, bar:0};
const LT_TIMING=[{key:'beat',label:'On the beat'},{key:'rest',label:'On a rest'},{key:'phrase',label:'Before phrase'}];
const LT_TIPS={beat:'Flip on beat 1 — one sharp, clean motion.', rest:'Flip on the last beat’s rest, just before the downbeat.', phrase:'Prepare on the bar before, then flip into the new phrase.'};

function leverDiff(base, fromKey, toKey){
  const fam={formula:[0,2,4,5,7,9,11], cat:'lt', name:'Major'};
  const a=computeScale(base, fromKey, fam), b=computeScale(base, toKey, fam);
  if(!a||!b) return {clean:false, a:!!a, b:!!b};
  const upA=new Set(a.leversUp), upB=new Set(b.leversUp);
  return {clean:true, toUp:[...upB].filter(l=>!upA.has(l)), toDown:[...upA].filter(l=>!upB.has(l))};
}
function buildLevers(){
  const seg=document.getElementById('ltBaseSeg');
  if(seg){ seg.innerHTML=''; ['E♭','C'].forEach(bk=>{ const b=document.createElement('button'); b.className='seg-btn'+(bk===lt.base?' on':''); b.textContent=TBASES[bk].label;
    b.addEventListener('click',()=>{ if(lt.base===bk)return; lt.base=bk; buildLevers(); buzz(); }); seg.appendChild(b); }); }
  const mk=(id,cur,set)=>{ const h=document.getElementById(id); if(!h)return; h.innerHTML='';
    KEYS12.forEach(k=>{ const b=document.createElement('button'); b.className='keychip'+(k===cur?' on':''); b.textContent=k;
      b.addEventListener('click',()=>{ set(k); buildLevers(); buzz(); b.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'}); }); h.appendChild(b); }); };
  mk('ltFrom', lt.from, k=>lt.from=k); mk('ltTo', lt.to, k=>lt.to=k);
  const bars=document.getElementById('ltBars'); if(bars){ bars.innerHTML=''; [1,2,4].forEach(n=>{ const b=document.createElement('button'); b.className='dchip'+(n===lt.bars?' on':''); b.textContent=n;
    b.addEventListener('click',()=>{ lt.bars=n; buildLevers(); buzz(); }); bars.appendChild(b); }); }
  const tim=document.getElementById('ltTiming'); if(tim){ tim.innerHTML=''; LT_TIMING.forEach(t=>{ const b=document.createElement('button'); b.className='dchip'+(t.key===lt.timing?' on':''); b.textContent=t.label;
    b.addEventListener('click',()=>{ lt.timing=t.key; buildLevers(); buzz(); }); tim.appendChild(b); }); }
  const bn=document.getElementById('ltBpm'); if(bn) bn.textContent=lt.bpm;
  renderLtDiff(); renderLtStage();
}
function renderLtDiff(){
  const host=document.getElementById('ltDiff'); if(!host) return;
  const d=leverDiff(lt.base,lt.from,lt.to);
  if(lt.from===lt.to){ host.innerHTML=`<div class="lt-nope">Pick two different keys to practise the change.</div>`; return; }
  if(!d.clean){ host.innerHTML=`<div class="lt-nope">One of these keys isn’t clean on the ${lt.base} harp — try another (the Tuning Explorer shows which are reachable).</div>`; return; }
  const fmt=(arr,cls,sym)=>arr.map(l=>`<span class="lt-chip ${cls}">${sym} ${l}</span>`).join('');
  const total=d.toUp.length+d.toDown.length;
  host.innerHTML=`<div class="lt-diff-head"><span class="lt-dh-keys">${lt.from} → ${lt.to}</span><span class="lt-dh-n">${total} lever${total!==1?'s':''} to flip</span></div>
    <div class="lt-chips">${fmt(d.toUp,'up','▲')}${fmt(d.toDown,'down','▼')}</div>
    <div class="lt-diff-note">▲ raise · ▼ lower · every other string stays put.</div>`;
}
function fmtFlipCue(up,down,target){
  const parts=[up.map(l=>'▲'+l).join(' '), down.map(l=>'▼'+l).join(' ')].filter(Boolean).join('   ');
  return `${parts} → ${target}`;
}
function renderLtStage(){
  const host=document.getElementById('ltStage'); if(!host) return;
  const d=leverDiff(lt.base,lt.from,lt.to);
  if(!lt.running){ host.innerHTML=`<div class="lt-idle"><em>${LT_TIPS[lt.timing]}</em><span>Press start — the pulse will cue your flips.</span></div>`; return; }
  if(!d.clean||lt.from===lt.to){ host.innerHTML=`<div class="lt-idle"><span>Pick two clean, different keys.</span></div>`; return; }
  const cycle=lt.bars*2, pos=((lt.bar-1)%cycle+cycle)%cycle, inA=pos<lt.bars, key=inA?lt.from:lt.to, barInSide=(pos%lt.bars)+1;
  let flip='';
  if(pos===lt.bars) flip=fmtFlipCue(d.toUp,d.toDown,lt.to);
  else if(pos===0 && lt.bar>1) flip=fmtFlipCue(d.toDown,d.toUp,lt.from);
  host.innerHTML=`<div class="lt-stage-inner${flip?' flipnow':''}">
    ${flip?`<div class="lt-flip">FLIP</div><div class="lt-flip-detail">${flip}</div>`:`<div class="lt-play">Play in <b>${key}</b></div>`}
    <div class="lt-barcount">bar ${barInSide} of ${lt.bars}</div></div>`;
}
function ltBeat(acc,idx){ if(idx!==0) return; lt.bar++; renderLtStage(); }
function ltStart(){
  const d=leverDiff(lt.base,lt.from,lt.to);
  if(lt.running){ ltStop(); return; }
  if(!d.clean||lt.from===lt.to) return;
  lt.running=true; lt.bar=0;
  Metro.bpm=lt.bpm; Metro.pattern=[2,1,1,1]; Metro.presetKey='lt'; Metro.onBeat=ltBeat; Metro.start();
  const b=document.getElementById('ltStart'); if(b){ b.textContent='Stop drill'; b.classList.add('lt-stopbtn'); }
  renderLtStage();
}
function ltStop(){
  lt.running=false; Metro.stop(); Metro.onBeat=null;
  const b=document.getElementById('ltStart'); if(b){ b.textContent='Start drill'; b.classList.remove('lt-stopbtn'); }
  renderLtStage();
}
function initLevers(){
  buildLevers();
  document.getElementById('ltStart')?.addEventListener('click',()=>{ ltStart(); buzz(); });
  document.getElementById('ltDown')?.addEventListener('click',()=>{ lt.bpm=Math.max(40,lt.bpm-4); if(lt.running)Metro.setBpm(lt.bpm); const n=document.getElementById('ltBpm'); if(n)n.textContent=lt.bpm; });
  document.getElementById('ltUp')?.addEventListener('click',()=>{ lt.bpm=Math.min(200,lt.bpm+4); if(lt.running)Metro.setBpm(lt.bpm); const n=document.getElementById('ltBpm'); if(n)n.textContent=lt.bpm; });
}

/* ============================================================
   HARP PROFILE — tune the app to the player's instrument (localStorage)
   ============================================================ */
let harpProfile=null, pfBase='E♭', pfLeverMode='full', pfNoLevers=new Set();
const PF_LEVERMODE=[{key:'full',label:'Full levers'},{key:'partial',label:'Partial levers'}];

function loadProfile(){
  try{ const r=localStorage.getItem('soh_harp'); if(r) harpProfile=JSON.parse(r); }catch(e){}
  if(harpProfile){ pfBase=harpProfile.base||'E♭'; pfLeverMode=harpProfile.leverMode||'full'; pfNoLevers=new Set(harpProfile.noLevers||[]); applyProfile(harpProfile); }
}
function applyProfile(p){
  tuneBase = p.base==='C'?'C':'E♭'; repBase=tuneBase; tunerBase=tuneBase; lt.base=tuneBase;
  HARP_NO_LEVERS = (p.leverMode==='partial' && p.noLevers && p.noLevers.length) ? new Set(p.noLevers) : null;
  tuneScales = generateScales(tuneBase);
}
function buildProfile(){
  const seg=document.getElementById('pfBaseSeg');
  if(seg){ seg.innerHTML=''; ['E♭','C'].forEach(b=>{ const btn=document.createElement('button'); btn.className='seg-btn'+(b===pfBase?' on':''); btn.textContent=TBASES[b].label;
    btn.addEventListener('click',()=>{ pfBase=b; buildProfile(); buzz(); }); seg.appendChild(btn); }); }
  const lm=document.getElementById('pfLeverMode');
  if(lm){ lm.innerHTML=''; PF_LEVERMODE.forEach(o=>{ const b=document.createElement('button'); b.className='dchip'+(o.key===pfLeverMode?' on':''); b.textContent=o.label;
    b.addEventListener('click',()=>{ pfLeverMode=o.key; buildProfile(); buzz(); }); lm.appendChild(b); }); }
  const st=document.getElementById('pfStringToggles');
  if(st){
    if(pfLeverMode==='partial'){ st.style.display='grid';
      st.innerHTML=TLETTERS.map(L=>`<button class="pf-str${pfNoLevers.has(L)?'':' on'}" data-l="${L}">${L}<span>${pfNoLevers.has(L)?'none':'lever'}</span></button>`).join('');
      st.querySelectorAll('.pf-str').forEach(b=>b.addEventListener('click',()=>{ const L=b.dataset.l; pfNoLevers.has(L)?pfNoLevers.delete(L):pfNoLevers.add(L); buildProfile(); buzz(); }));
    } else { st.style.display='none'; st.innerHTML=''; }
  }
  const brand=document.getElementById('pfBrand'); if(brand && harpProfile && !brand.value && document.activeElement!==brand) brand.value=harpProfile.brand||'';
  const strings=document.getElementById('pfStrings'); if(strings && harpProfile && !strings.value && document.activeElement!==strings) strings.value=harpProfile.strings||'';
}
function saveProfile(){
  const p={ brand:(document.getElementById('pfBrand')?.value||'').trim(), strings:(document.getElementById('pfStrings')?.value||'').trim(),
    base:pfBase, leverMode:pfLeverMode, noLevers:[...pfNoLevers] };
  harpProfile=p;
  try{ localStorage.setItem('soh_harp', JSON.stringify(p)); }catch(e){}
  applyProfile(p);
  if(document.getElementById('baseSeg')){ buildBaseSeg(); buildCatChips(); renderTune(); }
  buildRepertoire(); buildTuner(); buildLevers();
  const saved=document.getElementById('pfSaved');
  if(saved){ const lc = pfLeverMode==='partial' ? ` · ${7-pfNoLevers.size}/7 levers` : ' · full levers';
    saved.textContent=`Saved ✓ — ${TBASES[pfBase].label}${lc}. Every tuning now matches your harp.`; saved.classList.add('show'); }
  buzz();
}
function initProfile(){ buildProfile(); document.getElementById('pfSave')?.addEventListener('click',saveProfile); }

/* ============================================================
   PRACTICE JOURNAL — sessions, streaks, favourites (localStorage)
   ============================================================ */
let journal=[];
function loadJournal(){ try{ const r=localStorage.getItem('soh_journal'); if(r) journal=JSON.parse(r); }catch(e){} }
function logSession(entry){ journal.unshift(entry); if(journal.length>300) journal.pop(); try{ localStorage.setItem('soh_journal', JSON.stringify(journal)); }catch(e){} }
function journalStats(){
  const sessions=journal.length, totalMin=journal.reduce((a,e)=>a+(e.minutes||0),0);
  const days=[...new Set(journal.map(e=>(e.date||'').slice(0,10)))].sort().reverse();
  let streak=0;
  if(days.length){
    const fmt=d=>d.toISOString().slice(0,10); let cur=new Date();
    if(days[0]!==fmt(cur)) cur.setDate(cur.getDate()-1);
    while(days.includes(fmt(cur))){ streak++; cur.setDate(cur.getDate()-1); }
  }
  const top=(k)=>{ const m={}; journal.forEach(e=>{ if(e[k]) m[e[k]]=(m[e[k]]||0)+1; }); let b=null; for(const x in m){ if(!b||m[x]>b.n) b={k:x,n:m[x]}; } return b; };
  return {sessions, totalMin, streak, topMode:top('mode'), topGroove:top('groove')};
}
function buildJournal(){
  const host=document.getElementById('journalBody'); if(!host) return;
  if(!journal.length){
    host.innerHTML=`<section class="card jl-empty reveal">No sessions yet.<br><span>Finish a <b>Practice Room</b> session and it lands here — with your streak, favourite modes and reflections.</span></section>`;
    observeReveals(host); triggerReveals(host); return;
  }
  const s=journalStats();
  const stat=(n,l)=>`<div class="jl-stat"><div class="jl-statn">${n}</div><div class="jl-statl">${l}</div></div>`;
  const favs=[];
  if(s.topMode) favs.push(`<div class="jl-fav"><span>Most-played mode</span><b>${s.topMode.k}</b></div>`);
  if(s.topGroove) favs.push(`<div class="jl-fav"><span>Favourite groove</span><b>${s.topGroove.k}</b></div>`);
  const items=journal.map(e=>{
    let ds=e.date; try{ ds=new Date(e.date).toLocaleDateString(undefined,{month:'short',day:'numeric'}); }catch(x){}
    return `<div class="jl-item"><div class="jl-date">${ds}</div><div class="jl-mid"><div class="jl-mode">${e.mode||'Practice'}</div>
      <div class="jl-meta">${e.minutes} min${e.groove?' · '+e.groove:''}</div>${e.note?`<div class="jl-note">“${e.note}”</div>`:''}</div></div>`;
  }).join('');
  host.innerHTML=`
    <section class="card jl-stats reveal">${stat(s.sessions,'sessions')}${stat(s.totalMin,'minutes')}${stat(s.streak,'day streak')}</section>
    ${favs.length?`<section class="card jl-favs reveal">${favs.join('')}</section>`:''}
    <div class="section-label reveal"><span class="n">·</span><h2>History</h2></div>
    <div class="jl-list reveal">${items}</div>`;
  observeReveals(host); triggerReveals(host);
}

/* ============================================================
   AI HARP COACH — local intent engine now; Claude API later.
   Reasons over the same engines and DRIVES the app via actions.
   ============================================================ */
const COACH_MODES=[
  {re:/phrygian dominant|hijaz|freygish|ahava/, w:'harmonic-minor', m:4},
  {re:/ukrainian dorian|romanian/, w:'harmonic-minor', m:3},
  {re:/lydian ?#?2|lydian sharp 2/, w:'harmonic-minor', m:5},
  {re:/harmonic minor/, w:'harmonic-minor', m:0},
  {re:/lydian dominant|overtone|acoustic scale/, w:'melodic-minor', m:3},
  {re:/altered|super ?locrian/, w:'melodic-minor', m:6},
  {re:/melodic minor|jazz minor/, w:'melodic-minor', m:0},
  {re:/hungarian minor/, w:'double-harmonic', m:3},
  {re:/oriental/, w:'double-harmonic', m:4},
  {re:/double harmonic|byzantine|gypsy major|bhairav/, w:'double-harmonic', m:0},
  {re:/dorian/, w:'major', m:1},
  {re:/phrygian/, w:'major', m:2},
  {re:/lydian/, w:'major', m:3},
  {re:/mixolydian/, w:'major', m:4},
  {re:/locrian/, w:'major', m:6},
  {re:/aeolian|natural minor/, w:'major', m:5},
  {re:/ionian|major/, w:'major', m:0},
];
const COACH_MOODS=[
  {re:/hebrew|hebraic|desert|middle ?eastern|mizrahi|sephardic|klezmer|jewish|temple/, w:'harmonic-minor', m:4, key:'D'},
  {re:/byzantine|arabic|maqam|egyptian/, w:'double-harmonic', m:0, key:'D'},
  {re:/celtic|irish|folk|highland/, w:'major', m:1, key:'D'},
  {re:/jazz|smooth|noir/, w:'melodic-minor', m:0, key:'C'},
  {re:/dark|cinematic|dramatic|tense|sad|mourn|grief|sorrow/, w:'harmonic-minor', m:0, key:'D'},
  {re:/peaceful|meditat|calm|prayer|worship|sacred|gentle|soothing|still/, w:'major', m:0, key:'C'},
  {re:/bright|happy|joyful|uplift|hopeful/, w:'major', m:4, key:'G'},
];
function detectKey(q){
  let m=q.match(/([A-Ga-g])\s*(#|♯|b|♭|sharp|flat)?\s+(?=major|minor|ionian|dorian|phrygian|lydian|mixolydian|aeolian|locrian|harmonic|melodic|hijaz|dominant|byzantine|hungarian|oriental|ukrainian)/i)
        || q.match(/\b(?:in|of|on|to|key of)\s+([A-Ga-g])\s*(#|♯|b|♭|sharp|flat)?\b/i);
  if(!m) return null;
  let L=m[1].toUpperCase(), acc=(m[2]||'').toLowerCase(), name=L;
  if(/^(#|♯|s)/.test(acc)) name=L+'♯'; else if(/^(b|♭|f)/.test(acc)) name=L+'♭';
  const pc=tRootPC(name);
  return KEYS12.find(k=>tRootPC(k)===pc) || name;
}
function coachResolve(q){
  const s=q.toLowerCase(), key=detectKey(q);
  const durM=s.match(/\b(5|10|20|45|90)\s?(m|min)/);
  const duration=durM?parseInt(durM[1]):null;
  const wantsSession=/session|practice|routine|plan|workout/.test(s)||duration!=null;
  const wantsImprov=/improv|jam|noodle|solo|over (the|this|a|my) drone/.test(s);
  const stuck=/stuck|bored|rut|same old|fresh|something new|new sound|new idea|inspire/.test(s);
  const today=/today|what should i|what do i|where (do i|to) (start|begin)|warm.?up/.test(s);
  const modeHit=COACH_MODES.find(x=>x.re.test(s)), moodHit=COACH_MOODS.find(x=>x.re.test(s));
  let worldKey, modeIndex, keyName=key;
  if(modeHit && !(stuck && modeHit.w==='major' && (modeHit.m===0||modeHit.m===5))){ worldKey=modeHit.w; modeIndex=modeHit.m; }
  else if(moodHit){ worldKey=moodHit.w; modeIndex=moodHit.m; keyName=keyName||moodHit.key; }
  else if(stuck){ worldKey='major'; modeIndex=4; keyName=keyName||mwKey; }
  else if(wantsImprov){ worldKey=mwWorld.key; modeIndex=activeMode; keyName=mwKey; }
  else if(today){ worldKey='major'; modeIndex=1; keyName=keyName||'D'; }
  if(!worldKey){ worldKey='major'; modeIndex=1; }
  keyName=keyName||'D';
  return {keyName, worldKey, modeIndex, duration, wantsSession:wantsSession||today, wantsImprov, stuck, today};
}
function coachAnswer(r){
  const world=PARENT_WORLDS.find(w=>w.key===r.worldKey);
  const parentPc=((tRootPC(r.keyName) - world.formula[r.modeIndex])%12+12)%12;
  const parentName=KEYS12.find(k=>tRootPC(k)===parentPc) || r.keyName;
  const ctx=buildScaleContext(parentName, world), mode=ctx.modes[r.modeIndex];
  const fam={formula:world.formula, cat:world.key, name:world.name};
  const lev=computeScale(tuneBase, parentName, fam);
  const dr=suggestedDrone(world), gk=suggestedGroove(world, r.modeIndex), g=RHYTHMS.find(x=>x.key===gk);
  const levTxt = lev ? (lev.leversUp.length?lev.leversUp.join(' · '):'none — your home tuning') : `not cleanly tunable on your ${tuneBase} harp`;
  let intro;
  if(r.wantsImprov) intro=`Let’s improvise in <b>${mode.root} ${mode.name}</b>.`;
  else if(r.stuck) intro=`Same room, new light — try <b>${mode.root} ${mode.name}</b>.`;
  else if(r.today){ const st=journalStats().streak; intro=`${st>0?`You’re on a ${st}-day streak — keep it alive. `:''}Today, sit with <b>${mode.root} ${mode.name}</b>.`; }
  else if(r.wantsSession) intro=`Here’s a ${r.duration||20}-minute journey in <b>${mode.root} ${mode.name}</b>.`;
  else intro=`Try <b>${mode.root} ${mode.name}</b>.`;
  const colour = mode.character.length?`<span class="cm-k">Colour</span> ${mode.character.map(c=>c.sym).join(' · ')}<br>`:'';
  const text=`${intro}<br>
    <span class="cm-k">Notes</span> ${mode.notes.join(' · ')}<br>
    <span class="cm-k">Levers</span> ${levTxt}<br>
    <span class="cm-k">Drone</span> ${mode.root} · tonic + fifth<br>
    <span class="cm-k">Groove</span> ${g.label}<br>
    ${colour}<span class="cm-tip">${practiceText(mode)}</span><br>
    <em>${improvText(mode).replace(/[“”]/g,'')}</em>`;
  const goto=()=>{ mwKey=parentName; mwWorld=world; rebuildModes(false); setMode(r.modeIndex,false); };
  const actions=[
    {label:'Open on the wheel', fn:()=>{ goto(); showView('modes'); document.querySelector('#view-modes .wheel-card')?.scrollIntoView({behavior:'smooth',block:'center'}); }},
    {label:'Play the backing', fn:()=>{ goto(); Drone.followWheel=true; Drone.rootName=mode.root; Drone.type='fifth'; Drone.voice=dr.voice; Drone.start(); Metro.setPreset(gk); Metro.start(); if(typeof syncDroneButtons==='function') syncDroneButtons(); }},
  ];
  if(r.wantsSession) actions.push({label:`Start a ${r.duration||20}-min session`, fn:()=>{ goto(); prTotal=r.duration||20; showView('practice'); }});
  return {text, actions};
}

/* ============================================================
   HARPER KNOWLEDGE ENGINE — grounds the coach in ALL app material.
   Auto-built from the live data (theory course, modes, circle of fifths,
   Simcha course, tools). Add new content anywhere → the coach knows it.
   Runs free on every device; also feeds context to the on-device LLM (RAG).
   ============================================================ */
const HARPER_STOP=new Set('the and for you your with that this what when how why are can has have will not but its from into over more our about which would should could does did was were them they then than also just like want need help play playing player harp lever levers'.split(' '));
const HARPER_SYN={ tune:'tuning tuner pitch',tuning:'tuner pitch tune',chord:'chords triad harmony',chords:'triad harmony chord',
  scale:'scales mode',sad:'minor aeolian',happy:'major ionian bright',dark:'phrygian minor',dreamy:'lydian',bluesy:'mixolydian mixo',
  key:'keys signature',signature:'key keys sharps flats',interval:'intervals',ear:'eartraining',read:'sightread notation staff',
  notation:'staff read sightread',rhythm:'meter beat tempo time',beginner:'basic fundamentals start begin first',circle:'fifths keys',
  fifths:'circle keys',transpose:'transposition',harmonic:'harmonics overtone series',overtone:'harmonics series timbre',
  glissando:'gliss pentatonic sweep',pentatonic:'gliss glissando',meditate:'drone meditation contemplative',cadence:'cadences resolve',
  mode:'modes modal',sound:'physics acoustics waves',tuning_system:'temperament pythagorean just equal',temperament:'tuning equal just pythagorean' };
function harperStrip(s){ const e=document.createElement('div'); e.innerHTML=String(s||''); return (e.textContent||'').replace(/\s+/g,' ').trim(); }
function harperTrim(s,n){ s=harperStrip(s); return s.length>n ? s.slice(0,n).replace(/\s+\S*$/,'')+'…' : s; }
function harperTok(s){ return harperStrip(s).toLowerCase().replace(/[^a-z0-9♯♭#\s]/g,' ').split(/\s+/).filter(w=>w.length>2 && !HARPER_STOP.has(w)); }
const HARPER_TOOLS=[
  {title:'Tuner',view:'tuner',desc:'The Tuner listens through your mic and shows each string’s pitch against A440 — so you can tune your harp accurately.',text:'tune your harp to pitch with the microphone, chromatic A440 tuner, in tune fix tuning'},
  {title:'Levers & key chart',view:'levers',desc:'The Lever chart shows exactly which levers to raise to set any key on your harp.',text:'lever lab which strings to raise to set any key, sharps and flats, lever recipe for each key'},
  {title:'Drone',view:'drone',desc:'The Drone holds a sustained tonic-and-fifth pad to play, meditate or improvise over.',text:'sustained drone backing pad, tonic and fifth, to play over, meditate or improvise'},
  {title:'Rhythm engine',view:'rhythm',desc:'The Rhythm engine is a metronome with meditative-instrument grooves for practising timing and meter.',text:'metronome, rhythm grooves, meter, practice timing, percussion samples, compound time'},
  {title:'Practice Room',view:'practice',desc:'The Practice Room runs a guided, timed session with a warm-up and staged steps.',text:'guided practice session, timer, warm up routine, staged practice'},
  {title:'Sight Reading Coach',view:'sightread',desc:'The Sight-Reading Coach shows notation, listens as you play, and guides you note by note.',text:'sight reading, read notation on the staff, the app listens and detects your pitch and guides you'},
  {title:'Ear Training',view:'eartraining',desc:'Ear Training plays intervals and chords for you to identify by ear, with instant feedback.',text:'ear training, recognise intervals and chords by ear, aural listening drills, name what you hear'},
  {title:'Modes wheel',view:'modes',desc:'The Modes wheel lets you explore all seven modes in any key, with levers, drone and groove.',text:'modal wheel, explore the seven modes ionian dorian phrygian lydian mixolydian aeolian locrian in any key'},
  {title:'Scales',view:'scales',desc:'The Scales tool builds any scale and its diatonic chords for your harp.',text:'scales and chords, build a scale, diatonic chords tool'},
  {title:'Music Theory course',view:'theory',desc:'An eleven-unit Music Theory course — fundamentals, harmony, chromatic harmony, counterpoint, the science of sound, theory in the real world (pop, groove & blues), jazz, the galant style, musical form, advanced chromaticism, and music since 1900 — every lesson mapped to the lever harp.',text:'eleven unit music theory course plus the science of sound, fundamentals harmony chromatic counterpoint jazz swing chord symbols voicings ii V I turnaround tritone substitution reharmonization chord scale blues bebop acoustics tuning pop schemas galant tonnetz groove sight singing solfege orchestration fux species counterpoint sonata rondo binary ternary form neapolitan augmented sixth chromatic mediant modulation atonality twelve tone serialism set theory post-tonal minimalism impressionism'},
  {title:'Modes course',view:'learn',desc:'Simcha’s Modes course — a pure-music journey through the seven modes on the harp.',text:'Simcha modes course, pure music teaching, a journey through the modes'},
  {title:'Circle of Fifths',view:'circle',desc:'The interactive Circle of Fifths shows every key, its lever recipe, its diatonic chords and relative minor — and which keys your harp can reach.',text:'interactive circle of fifths, every key, lever recipe, diatonic chords, relative minor, modulation, transposition'},
  {title:'Meditation',view:'meditation',desc:'Meditation pairs a drone with contemplative, Davidic-harp practice.',text:'contemplative drone meditation, davidic harp, sit with a drone'},
];
let HARPER_KB=null;
function buildHarperKB(){
  if(HARPER_KB) return HARPER_KB;
  const docs=[], add=(d)=>{ d.terms=harperTok((d.title||'')+' '+(d.text||'')); docs.push(d); };
  if(typeof THEORY_COURSE!=='undefined') THEORY_COURSE.forEach(u=>u.chapters.forEach(ch=>{
    const open=()=>theoryOpenByChapter(ch.n);
    ch.lessons.forEach(L=>{ const body=harperStrip(L.body), harp=harperStrip(L.harp||'');
      add({type:'lesson',title:L.h||ch.title,chN:ch.n,chTitle:ch.title,view:'theory',body,harp,text:body+' '+harp,open}); });
    add({type:'chapter',title:'Chapter '+ch.n+': '+ch.title,chN:ch.n,chTitle:ch.title,view:'theory',text:ch.title+' '+ch.lessons.map(l=>l.h).join(' '),open});
  }));
  if(typeof MODE_TEACHING!=='undefined') Object.keys(MODE_TEACHING).forEach(name=>{ const t=MODE_TEACHING[name];
    add({type:'mode',title:name+' mode',view:'modes',teaching:t,text:[t.framing,t.char,t.chord,t.pattern,t.song].map(harperStrip).join(' '),open:()=>showView('modes')}); });
  if(typeof MODE_TEACHING_EXTRA!=='undefined') MODE_TEACHING_EXTRA.forEach(m=>add({type:'mode',title:m.name,view:'modes',text:harperStrip((m.from?m.from+' ':'')+m.note),open:()=>showView('modes')}));
  if(typeof SIMCHA_COURSE!=='undefined') SIMCHA_COURSE.forEach(c=>c.lessons.forEach(L=>{ if(!L.h) return;
    add({type:'simcha',title:L.h,view:'learn',text:harperStrip(L.body||'')+' '+harperStrip(L.harp||''),open:()=>showView('learn')}); }));
  if(sohOn('jacob') && typeof JACOB_MODULES!=='undefined'){
    JACOB_MODULES.forEach(m=>{
      const idea=harperStrip(m.idea||''), harp=harperStrip(m.harp||'');
      const qa=(typeof JACOB_QUIZ!=='undefined'&&JACOB_QUIZ[m.n])?JACOB_QUIZ[m.n].map(x=>x.q+' '+x.a).join(' '):'';
      const links=(m.links||[]).map(l=>l.label).join(' ');
      add({type:'jacob',title:m.title,jacobN:m.n,view:'jacob',body:idea,harp,
        text:'jacob collier '+(m.kicker||'')+' '+idea+' '+harp+' '+qa+' '+links,
        open:()=>{ showView('jacob'); if(typeof jacobOpenModule==='function') jacobOpenModule(m.n); }}); });
    add({type:'tool',title:'Jacob’s Universe',view:'jacob',
      desc:'Harmony the Jacob Collier way — feeling first, one note under many chords, negative harmony, reharmonisation and the pocket — every idea mapped to your lever harp.',
      text:'jacob collier universe harmony approach feeling first negative harmony reharmonization voicings inversions microtonality overtone series groove pocket brightness',
      open:()=>showView('jacob')});
  }
  if(typeof CIRCLE_KEYS!=='undefined') add({type:'tool',title:'Circle of Fifths & playable keys',view:'circle',
    desc:'The Circle of Fifths orders all 12 keys by their sharps and flats. On your lever harp it shows which keys you can reach and the exact levers each one needs — your map for choosing and changing key.',
    text:'circle of fifths key signatures lever recipe reachable keys modulation '+CIRCLE_KEYS.map(k=>k.maj+' '+k.min+' '+k.acc+' '+harperStrip(k.lever)).join(' '),open:()=>showView('circle')});
  HARPER_TOOLS.filter(t=>sohOn(t.view)).forEach(t=>add({type:'tool',title:t.title,view:t.view,desc:t.desc,text:t.text,open:()=>showView(t.view)}));
  HARPER_KB=docs; return docs;
}
function kbSearch(q,n){
  const kb=buildHarperKB(), base=harperTok(q), exp=[];
  base.forEach(t=>{ exp.push(t); if(HARPER_SYN[t]) exp.push(...HARPER_SYN[t].split(' ')); });
  const scored=kb.map(d=>{ let s=0; const tt=harperTok(d.title);
    exp.forEach(t=>{ if(tt.includes(t)) s+=3; const c=d.terms.filter(x=>x===t).length; if(c) s+=Math.min(c,3);
      else if(d.terms.some(x=>x.length>3&&(x.startsWith(t)||t.startsWith(x)))) s+=0.5; });
    if(d.type==='lesson'||d.type==='mode') s*=1.1;
    return {d,s}; }).filter(x=>x.s>0).sort((a,b)=>b.s-a.s);
  return scored.slice(0,n||6).map(x=>x.d);
}
function harperKey(d){ return d.chN?('ch'+d.chN):(d.view+'|'+d.title); }
function harperPath(top){
  const seen=new Set(), items=[];
  top.forEach(d=>{ const k=harperKey(d); if(seen.has(k))return; seen.add(k);
    items.push({label:(d.chN?('Ch'+d.chN+' · '):'')+harperTrim(String(d.title).replace(/^Chapter \d+: /,''),38),open:d.open,ord:d.chN||900,key:k}); });
  items.sort((a,b)=>a.ord-b.ord); return items.slice(0,4);
}
function harperExercise(top){
  for(const d of top){ if(d.chN && typeof THEORY_COURSE!=='undefined'){
      for(const u of THEORY_COURSE){ const ch=u.chapters.find(c=>c.n===d.chN); if(ch&&ch.quiz&&ch.quiz.length) return ch.quiz[0].q; } }
    if(d.type==='jacob' && typeof JACOB_QUIZ!=='undefined' && JACOB_QUIZ[d.jacobN] && JACOB_QUIZ[d.jacobN][0]) return JACOB_QUIZ[d.jacobN][0].q;
    if(d.type==='mode'&&d.teaching) return `On your harp, set the mode and dance around its character note — ${harperTrim(d.teaching.char,140)}`;
  } return null;
}
function harperKnowledge(q,top){
  const best=top[0]; let lead;
  if(best.type==='lesson'||best.type==='jacob'){ lead=`<b>${best.title}.</b> ${harperTrim(best.body,260)}`+(best.harp?`<br><span class="cm-k">On your harp</span> ${harperTrim(best.harp,210)}`:''); }
  else if(best.type==='mode'&&best.teaching){ const t=best.teaching; lead=`<b>${best.title}.</b> ${harperStrip(t.framing)}<br><span class="cm-k">Character</span> ${harperTrim(t.char,150)}<br><span class="cm-k">Chord</span> ${harperTrim(t.chord,150)}`; }
  else lead=`<b>${best.title}.</b> ${harperTrim(best.desc||best.text,260)}`;
  const path=harperPath(top), ex=harperExercise(top);
  let text=lead;
  if(path.length>1) text+=`<br><span class="cm-k">Pathway</span> ${path.map(p=>p.label).join('  →  ')}`;
  if(ex) text+=`<br><span class="cm-k">Try this</span> ${harperTrim(ex,200)}`;
  const seen=new Set(), actions=[];
  actions.push({label:'Open '+harperTrim(String(best.title).replace(/^Chapter \d+: /,''),30)+' →', fn:best.open}); seen.add(harperKey(best));
  path.forEach(p=>{ if(!seen.has(p.key)){ seen.add(p.key); actions.push({label:p.label,fn:p.open}); } });
  return {text, actions:actions.slice(0,5), top};
}
function harperAnswer(q){
  const s=(q||'').toLowerCase(), top=kbSearch(q,6);
  const practiceSignals=/\b(session|routine|workout|improv|jam|noodle|stuck|bored|today|warm.?up|mood|vibe|desert|cinematic|hebrew|something new|inspire|what should i play|set me up)\b/.test(s)
    || (typeof COACH_MOODS!=='undefined' && COACH_MOODS.some(m=>m.re.test(s)));
  const conceptQ=/\b(what is|what's|what are|how does|explain|define|meaning|difference|teach me|tell me about|theory of|why does)\b/.test(s)
    || /how do .*(work|happen)/.test(s) || (/\?\s*$/.test(q||'') && !practiceSignals);
  if(practiceSignals && !conceptQ){
    const base=coachAnswer(coachResolve(q));
    if(top.length && top[0].open && top[0].type!=='tool') base.actions.push({label:'Learn the theory →',fn:top[0].open});
    base.top=top; return base;
  }
  if(top.length) return harperKnowledge(q,top);
  const base=coachAnswer(coachResolve(q)); base.top=top; return base;
}
function renderCoachPair(question, ans){
  const convo=document.getElementById('coachConvo'); if(!convo) return;
  const wrap=document.createElement('div'); wrap.className='coach-pair jrn-in';
  const acts=ans.actions.map((a,i)=>`<button class="coach-act" data-i="${i}">${a.label}</button>`).join('');
  wrap.innerHTML=`${question?`<div class="coach-q">${question}</div>`:''}
    <div class="coach-a"><div class="coach-a-text">${ans.text}</div>${acts?`<div class="coach-acts">${acts}</div>`:''}</div>`;
  wrap.querySelectorAll('.coach-act').forEach(b=>b.addEventListener('click',()=>{ ans.actions[+b.dataset.i].fn(); buzz(); }));
  convo.insertBefore(wrap, convo.firstChild);
}
function coachFmt(s){ const e=document.createElement('div'); e.textContent=String(s||''); return e.innerHTML.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\n+/g,'<br>'); }
function coachStreamPair(question){
  const convo=document.getElementById('coachConvo'); if(!convo) return null;
  const wrap=document.createElement('div'); wrap.className='coach-pair jrn-in';
  wrap.innerHTML=`${question?`<div class="coach-q">${question}</div>`:''}<div class="coach-a"><div class="coach-a-text"><span class="coach-typing">Harpie is thinking…</span></div></div>`;
  convo.insertBefore(wrap, convo.firstChild);
  return { set:(html)=>{ const el=wrap.querySelector('.coach-a-text'); if(el) el.innerHTML=html; }, wrap };
}
function coachSend(text){
  const t=(text||'').trim(); if(!t) return;
  const inp=document.getElementById('coachInput'); if(inp) inp.value='';
  const struct=harperAnswer(t);                       // grounded answer + app-integrated actions (every device)
  if(typeof SohAI!=='undefined' && SohAI.state==='ready'){
    const pair=coachStreamPair(t);
    const ctx=(struct.top||kbSearch(t,4)).slice(0,4).map(d=>`• ${d.title}: ${harperTrim(d.text,260)}`).join('\n');
    SohAI.ask(t,(full)=>{ if(pair) pair.set(coachFmt(full)); }, ctx).then(full=>{
      if(!pair) return;
      if(!full) pair.set(struct.text);                // fall back to grounded structured answer
      const a=document.createElement('div'); a.className='coach-acts';
      a.innerHTML=struct.actions.map((x,i)=>`<button class="coach-act" data-i="${i}">${x.label}</button>`).join('');
      a.querySelectorAll('.coach-act').forEach(b=>b.addEventListener('click',()=>{ struct.actions[+b.dataset.i].fn(); buzz(); }));
      pair.wrap.querySelector('.coach-a').appendChild(a);
    });
  } else {
    renderCoachPair(t, struct);
  }
}
let coachGreeted=false;
function initCoach(){
  const host=document.getElementById('coachSuggest');
  if(host){ host.innerHTML=''; ['What is the circle of fifths?','How do I play D Dorian?','How do harp harmonics work?','What should I practice today?','Explain key signatures on a lever harp','I want a Hebrew desert sound'].forEach(s=>{
    const b=document.createElement('button'); b.className='coach-sug'; b.textContent=s; b.addEventListener('click',()=>{ coachSend(s); buzz(); }); host.appendChild(b); }); }
  document.getElementById('coachSend')?.addEventListener('click',()=>coachSend(document.getElementById('coachInput').value));
  document.getElementById('coachInput')?.addEventListener('keydown',e=>{ if(e.key==='Enter') coachSend(e.target.value); });
  if(!coachGreeted){ coachGreeted=true; renderCoachPair('', {text:`I’m <b>Harpie</b>, your AI harp coach — trained on this whole app: the full music-theory course, the seven modes, the Circle of Fifths, tuning & acoustics, ear training and every practice tool. Ask me a real question (“<em>what is a cadence?</em>”, “<em>how do I play D Dorian?</em>”), or tell me a <b>mood</b> or <b>session</b> — I’ll answer with precision, give you a learning pathway, an exercise, and open the right place to practise.`, actions:[]}); }
  coachInitAI();
}

/* ============================================================
   On-device AI Coach — WebLLM (MLC) via WebGPU. No API key, runs locally
   and offline after a one-time model download. Falls back to the built-in
   rule-based coach when WebGPU/the model is unavailable.
   ============================================================ */
const SohAI = {
  state:'idle',                       // idle | loading | ready | unavailable | error
  engine:null, model:'Llama-3.2-1B-Instruct-q4f16_1-MLC', progress:0, onState:null,
  available(){ return typeof navigator!=='undefined' && !!navigator.gpu; },
  _set(s,txt){ this.state=s; if(this.onState) this.onState(s, this.progress, txt); },
  async load(){
    if(this.state==='ready'||this.state==='loading') return this.state==='ready';
    if(!this.available()){ this._set('unavailable'); return false; }
    this._set('loading','starting');
    try{
      const webllm = await import('https://esm.run/@mlc-ai/web-llm');
      this.engine = await webllm.CreateMLCEngine(this.model, {
        initProgressCallback:(p)=>{ this.progress=p.progress||0; this._set('loading', p.text); }
      });
      this._set('ready'); return true;
    }catch(e){ console.warn('AI Coach load failed:', e); this._set('error', String(e&&e.message||e)); return false; }
  },
  async ask(userText, onToken, context){
    if(this.state!=='ready' || !this.engine) return null;
    const sys = `You are Harpie, the warm, expert AI lever-harp coach inside the Strings of Hope app. `
      + `You know the app's full music-theory course (5 units, 42 chapters — fundamentals, harmony, chromatic harmony, counterpoint & 20th-century, and the science of sound), the seven modes and Simcha's modal teaching, the interactive Circle of Fifths, tuning systems & the harmonic series, ear training, sight-reading and all the practice tools. `
      + `${typeof sohProfileLine==='function'?sohProfileLine():`The player's harp base tuning is ${tuneBase}.`} Answer in 2-5 short, precise, harp-specific sentences, grounded ONLY in the app material below. Always give one concrete next step or exercise, and never shame the player.`
      + `\n\nApp material relevant to this question:\n${context||'(general lever-harp guidance)'}`;
    try{
      const chunks = await this.engine.chat.completions.create({ stream:true, temperature:0.6, max_tokens:280,
        messages:[{role:'system',content:sys},{role:'user',content:userText}] });
      let full='';
      for await (const ch of chunks){ const d=ch.choices?.[0]?.delta?.content||''; if(d){ full+=d; if(onToken) onToken(full); } }
      return full.trim();
    }catch(e){ console.warn('AI ask failed:', e); return null; }
  },
};
function coachInitAI(){
  const badge=document.getElementById('coachBadge'); if(!badge) return;
  badge.onclick=null; badge.classList.remove('clickable');
  if(SohAI.state==='ready'){ badge.innerHTML='✨ On-device AI is on — natural answers, grounded in the app, fully private.'; badge.classList.add('on'); return; }
  if(!SohAI.available()){ badge.innerHTML='Harpie is trained on the whole app — course, modes, theory & tools. Ask anything. (Free-form on-device AI needs a WebGPU browser.)'; return; }
  badge.innerHTML='✨ Add free-form on-device AI — one private ~0.9&nbsp;GB download, then natural answers grounded in the app, offline.';
  badge.classList.add('clickable');
  badge.onclick=()=>{
    badge.classList.remove('clickable');
    SohAI.onState=(s,prog,txt)=>{
      if(s==='loading') badge.innerHTML=`Preparing AI Coach… ${prog?Math.round(prog*100)+'%':''} <span class="cb-sub">${txt?String(txt).slice(0,48):''}</span>`;
      else if(s==='ready'){ badge.innerHTML='✨ AI Coach is on — ask me anything, privately.'; badge.classList.add('on'); buzz(); }
      else if(s==='error'){ badge.innerHTML='Couldn’t start the AI Coach here — the built-in coach is still with you.'; }
      else if(s==='unavailable'){ badge.innerHTML='On-device AI needs WebGPU. The built-in coach is active.'; }
    };
    badge.innerHTML='Preparing AI Coach…';
    SohAI.load();
  };
}

/* ============================================================
   HARPIE LESSON ASSISTANT — a corner helper inside lessons.
   De-jargons, decodes concepts, goes deeper (grounded engine + optional
   on-device LLM), and can run a live web search (Wikipedia).
   ============================================================ */
const HARPIE_GLOSSARY={
  'tonic':'the home note of a key — where the music rests.',
  'dominant':'the 5th degree (and its chord) — it pulls strongly back to the tonic.',
  'subdominant':'the 4th degree (and its chord) — a step away from home.',
  'leading tone':'the 7th degree — a half step below the tonic, leaning up into it.',
  'cadence':'musical punctuation — how a phrase ends (V→I is a full stop).',
  'interval':'the distance between two notes (a third, a fifth, an octave…).',
  'triad':'a three-note chord: root, third and fifth stacked in thirds.',
  'inversion':'a chord with a note other than the root in the bass.',
  'diatonic':'using only the notes of the current key — no accidentals.',
  'chromatic':'using notes from outside the key for extra colour.',
  'mode':'a scale with its own pattern of steps and its own mood (e.g. Dorian).',
  'scale degree':'a note’s numbered position in a scale (1 = tonic … 7 = leading tone).',
  'key signature':'the sharps or flats at the start of a line that set the key.',
  'accidental':'a sharp, flat or natural that changes a note for a moment.',
  'enharmonic':'two names for the same pitch (C♯ = D♭).',
  'arpeggio':'the notes of a chord played one after another instead of together.',
  'octave':'the distance to the next note of the same name — double the frequency (2:1).',
  'harmonic':'an overtone — a higher pitch sounding faintly inside a note; it gives timbre.',
  'overtone':'a harmonic — a higher pitch inside a played note.',
  'timbre':'tone colour — why a harp and a flute differ on the same note.',
  'fundamental':'the main, lowest pitch of a note (the 1st harmonic).',
  'pentatonic':'a five-note scale with no half steps — the harp’s glissando scale.',
  'modulation':'moving the music to a new key.',
  'tonicization':'briefly making another chord feel like “home” without truly changing key.',
  'secondary dominant':'a borrowed dominant chord pointing at a chord other than the tonic.',
  'suspension':'holding a note over a chord change so it clashes, then resolving down.',
  'non-chord tone':'a melody note that isn’t part of the chord beneath it.',
  'voice leading':'moving each voice of a chord smoothly into the next chord.',
  'counterpoint':'combining two or more independent melodies at once.',
  'phrase':'a complete musical thought, usually ending in a cadence.',
  'sequence':'a musical idea repeated at a higher or lower pitch.',
  'temperament':'a system for tuning the 12 notes (modern standard: equal temperament).',
  'transposition':'moving a whole piece to a new key, higher or lower.',
  'roman numeral':'a label (I, ii, V…) for a chord’s place and quality in the key.',
  'relative minor':'the minor key sharing a major key’s notes (C major ↔ A minor).',
  'glissando':'a sweep across the strings — a cascade of notes.',
  'ostinato':'a short pattern repeated over and over.',
  'drone':'a sustained held note (often the tonic) under the music.',
  'standing wave':'a trapped, self-reinforcing vibration — how a string makes a steady pitch.',
};
let _hpCtx=null, _hpBound=false;
function harpieBind(){
  if(_hpBound) return; _hpBound=true;
  document.getElementById('hpClose')?.addEventListener('click',harpieClose);
  document.getElementById('harpiePanel')?.addEventListener('click',e=>{ if(e.target.id==='harpiePanel') harpieClose(); });
  document.getElementById('hpSend')?.addEventListener('click',()=>{ const i=document.getElementById('hpInput'); if(i&&i.value.trim()){ harpieRespond(i.value.trim()); i.value=''; } });
  document.getElementById('hpInput')?.addEventListener('keydown',e=>{ if(e.key==='Enter'&&e.target.value.trim()){ harpieRespond(e.target.value.trim()); e.target.value=''; } });
  document.querySelectorAll('#hpQuick button').forEach(b=>b.addEventListener('click',()=>{ harpieQuick(b.dataset.act); buzz(); }));
}
function harpieOpenLesson(){
  const L=(typeof theoryLessons!=='undefined')&&theoryLessons[theoryLi];
  const ch=(typeof THEORY_COURSE!=='undefined')&&THEORY_COURSE[theorySem]&&THEORY_COURSE[theorySem].chapters[theoryCh];
  if(!L||!ch) return;
  _hpCtx={ title:L.h||ch.title, body:harperStrip(L.body||''), harp:harperStrip(L.harp||''), chN:ch.n, chTitle:ch.title };
  const _q=document.getElementById('hpQuick'); if(_q) _q.style.display='';
  harpieBind();
  document.getElementById('hpCtx').textContent='about “'+_hpCtx.title+'”';
  document.getElementById('hpBody').innerHTML='';
  harpieAddMsg('a',`Hi — I’m <b>Harpie</b>. Ask me anything about <b>${_hpCtx.title}</b>, or tap a shortcut below. I can simplify it, decode the jargon, go deeper, or search the web.`);
  const ov=document.getElementById('harpiePanel'); if(ov){ ov.hidden=false; document.body.classList.add('hp-open'); }
  setTimeout(()=>document.getElementById('hpInput')?.focus(),60); buzz();
}
function harpieClose(){ const ov=document.getElementById('harpiePanel'); if(ov) ov.hidden=true; document.body.classList.remove('hp-open'); }
function harpieAddMsg(role,html){ const b=document.getElementById('hpBody'); if(!b) return null;
  const d=document.createElement('div'); d.className='hp-msg hp-'+role; d.innerHTML=html; b.appendChild(d); b.scrollTop=b.scrollHeight; return d; }
function harpieActsHtml(a){ return (a&&a.length)?'<div class="hp-acts">'+a.map((x,i)=>`<button class="hp-act" data-i="${i}">${x.label}</button>`).join('')+'</div>':''; }
function harpieAttach(el,a){ if(!el||!a) return; el.querySelectorAll('.hp-act').forEach(b=>b.addEventListener('click',()=>{ a[+b.dataset.i].fn(); harpieClose(); buzz(); })); }
function harpieRespond(q){
  harpieAddMsg('q', harperStrip(q));
  const ctx=_hpCtx, grounded=harperAnswer(q+(ctx?(' '+ctx.title):''));
  if(typeof SohAI!=='undefined' && SohAI.state==='ready'){
    const bubble=harpieAddMsg('a','<span class="coach-typing">Harpie is thinking…</span>');
    let cs=(ctx?`Current lesson — ${ctx.title} (Chapter ${ctx.chN}: ${ctx.chTitle}): ${ctx.body} ${ctx.harp}\n`:'');
    (grounded.top||kbSearch(q,3)).slice(0,3).forEach(d=>cs+=`• ${d.title}: ${harperTrim(d.text,200)}\n`);
    SohAI.ask(q,(full)=>{ bubble.innerHTML=coachFmt(full); },cs).then(full=>{ bubble.innerHTML=(full?coachFmt(full):grounded.text)+harpieActsHtml(grounded.actions); harpieAttach(bubble,grounded.actions); });
  } else {
    const d=harpieAddMsg('a', grounded.text+harpieActsHtml(grounded.actions)); harpieAttach(d,grounded.actions);
  }
}
function harpieQuick(act){
  const ctx=_hpCtx; if(!ctx) return;
  if(act==='simple'){
    if(typeof SohAI!=='undefined'&&SohAI.state==='ready'){ harpieRespond('Explain this lesson simply, in plain words, for a beginner.'); }
    else { harpieAddMsg('q','Explain simply'); harpieAddMsg('a',`<b>In plain terms.</b> ${ctx.body}`+(ctx.harp?`<br><span class="cm-k">On your harp</span> ${ctx.harp}`:'')); }
  } else if(act==='decode'){ harpieDecode(); }
  else if(act==='deeper'){ harpieAddMsg('q','Go deeper'); const g=harperKnowledge(ctx.title, kbSearch(ctx.title,6)); const d=harpieAddMsg('a', g.text+harpieActsHtml(g.actions)); harpieAttach(d,g.actions); }
  else if(act==='web'){ harpieWebSearch(ctx.title); }
}
function harpieDecode(){
  const ctx=_hpCtx; harpieAddMsg('q','Decode the terms');
  const text=(ctx.title+' '+ctx.body+' '+ctx.harp).toLowerCase();
  const found=Object.keys(HARPIE_GLOSSARY).filter(k=>text.indexOf(k)>=0).slice(0,7);
  if(!found.length){ harpieAddMsg('a','No heavy jargon in this one — ask me about any word and I’ll explain it plainly.'); return; }
  harpieAddMsg('a','<b>The terms in this lesson</b><ul class="hp-gloss">'+found.map(k=>`<li><b>${k}</b> — ${HARPIE_GLOSSARY[k]}</li>`).join('')+'</ul>');
}
async function harpieWiki(term){
  const url='https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts%7Cinfo&inprop=url&exintro=1&explaintext=1&redirects=1&generator=search&gsrlimit=1&gsrsearch='+encodeURIComponent(term+' music');
  const r=await fetch(url); if(!r.ok) throw new Error('http '+r.status); const j=await r.json();
  const pages=j.query&&j.query.pages; if(!pages) return null; const p=Object.values(pages)[0];
  return p?{title:p.title, extract:p.extract||'', url:p.fullurl||('https://en.wikipedia.org/wiki/'+encodeURIComponent(p.title))}:null;
}
async function harpieWebSearch(term){
  harpieAddMsg('q','Search the web · '+term);
  const bubble=harpieAddMsg('a','<span class="coach-typing">Searching the web…</span>');
  try{
    const res=await harpieWiki(term);
    if(res&&res.extract){ bubble.innerHTML=`<b>${res.title}</b> <span class="hp-src">· Wikipedia</span><br>${harperTrim(res.extract,460)}<br><a class="hp-link" href="${res.url}" target="_blank" rel="noopener noreferrer">Read more on Wikipedia →</a>`; }
    else bubble.innerHTML='I couldn’t find a clear web result — try rephrasing, or just ask me and I’ll explain it from the course.';
  }catch(e){ bubble.innerHTML='The web search didn’t go through (you may be offline). I can still explain it from the course — just ask.'; }
}

/* ============================================================
   VERSE OF THE DAY
   ============================================================ */
function dayOfYear(){ const n=new Date(); return Math.floor((n - new Date(n.getFullYear(),0,0))/86400000); }
function renderVerse(){
  const host=document.getElementById('verseCard'); if(!host || typeof VERSES==='undefined' || !VERSES.length) return;
  const v=VERSES[dayOfYear()%VERSES.length];
  host.innerHTML=`<div class="verse-label">Verse of the day</div>
    ${v.he?`<div class="verse-stam" dir="rtl" lang="he">${v.he}</div>`:''}
    <div class="verse-text">“${v.text}”</div>
    ${v.tr?`<div class="verse-translit">${v.tr}</div>`:''}
    <div class="verse-ref">${v.heref?`<span class="verse-ref-he" dir="rtl" lang="he">${v.heref}</span> · `:''}${v.ref}</div>`;
}

/* ============================================================
   HOME — a smart "Today" surface (greeting · today's focus · streak)
   ============================================================ */
const DAILY_FOCUS=[
  {k:'D',w:'major',m:1}, {k:'E',w:'major',m:2}, {k:'G',w:'major',m:4}, {k:'A',w:'major',m:5},
  {k:'D',w:'harmonic-minor',m:4}, {k:'F',w:'major',m:3}, {k:'C',w:'major',m:0}, {k:'E',w:'double-harmonic',m:0},
];
function resolveMode(keyName, worldKey, modeIndex){
  const world=PARENT_WORLDS.find(w=>w.key===worldKey);
  const parentPc=((tRootPC(keyName)-world.formula[modeIndex])%12+12)%12;
  const parentName=KEYS12.find(k=>tRootPC(k)===parentPc)||keyName;
  const ctx=buildScaleContext(parentName, world);
  return {parentName, world, mode:ctx.modes[modeIndex], modeIndex};
}
/* ============================================================
   NETFLIX-STYLE LEARNING SURFACE — continue hero + content rails
   ============================================================ */
function sohProgressSave(kind,data){
  try{ const p=JSON.parse(localStorage.getItem('soh-progress')||'{}'); p[kind]=Object.assign({},data,{ts:Date.now()}); localStorage.setItem('soh-progress',JSON.stringify(p)); }catch(e){}
}
function sohProgressGet(){ try{ return JSON.parse(localStorage.getItem('soh-progress')||'{}'); }catch(e){ return {}; } }
function sohChapterProg(n){ try{ const d=JSON.parse(localStorage.getItem('soh-lessons')||'{}')['t'+n]; return d?{seen:d.seen,total:d.total,done:d.seen>=d.total}:null; }catch(e){ return null; } }
function sohUnitProg(u){ const t=u.chapters.length; let done=0; u.chapters.forEach(c=>{ const p=sohChapterProg(c.n); if(p&&p.done) done++; }); return {done,t,pct:Math.round(done/t*100)}; }
function jacobSeen(n){ try{ return JSON.parse(localStorage.getItem('soh-jacob-seen')||'[]').includes(n); }catch(e){ return false; } }
function nxResume(){
  const p=sohProgressGet(), cands=[];
  if(p.theory && typeof THEORY_COURSE!=='undefined'){ const u=THEORY_COURSE[p.theory.sem], ch=u&&u.chapters[p.theory.ch];
    if(ch) cands.push({ts:p.theory.ts, eyebrow:'Continue · Music Theory', title:ch.title, sub:(u.kicker||'Semester '+u.sem)+' · Chapter '+ch.n,
      go:()=>{ showView('theory'); openTheoryChapter(p.theory.sem,p.theory.ch); } }); }
  if(p.jacob && sohOn('jacob') && typeof JACOB_MODULES!=='undefined'){ const m=JACOB_MODULES.find(x=>x.n===p.jacob.n);
    if(m) cands.push({ts:p.jacob.ts, eyebrow:'Continue · Jacob’s Universe', title:m.title, sub:'Module '+m.n+' · '+(m.kicker||''),
      go:()=>{ showView('jacob'); jacobOpenModule(m.n); } }); }
  cands.sort((a,b)=>b.ts-a.ts); return cands[0]||null;
}
function renderNxHero(){
  const el=document.getElementById('nxHero'); if(!el) return;
  let r=nxResume();
  if(!r){ const f=DAILY_FOCUS[dayOfYear()%DAILY_FOCUS.length], rv=resolveMode(f.k,f.w,f.m);
    r={ eyebrow:'Today’s practice', title:rv.mode.root+' '+rv.mode.name, sub:rv.mode.mood,
        go:()=>{ mwKey=rv.parentName; mwWorld=rv.world; rebuildModes(false); setMode(rv.modeIndex,false); prTotal=20; showView('practice'); } }; }
  const h=new Date().getHours();
  el.dataset.tod = h<6?'night' : h<9?'dawn' : h<13?'morning' : h<18?'afternoon' : h<21?'dusk' : 'night';
  el.innerHTML=`<span class="nx-strings" aria-hidden="true"></span><span class="nx-shimmer" aria-hidden="true"></span><span class="nx-glow" aria-hidden="true"></span><span class="nxh-heb" aria-hidden="true">תקוה</span>
    <span class="nxh-eyebrow">${r.eyebrow}</span>
    <span class="nxh-title">${r.title}</span>
    <span class="nxh-sub">${r.sub||''}</span>
    <span class="nxh-cta">▶&nbsp; ${r.eyebrow.startsWith('Continue')?'Continue':'Begin'}</span>`;
  el.onclick=()=>{ r.go(); buzz(); };
}
const NX_TOOLS=[
  {v:'coach',t:'Harpie',d:'AI Harp Coach'},{v:'practice',t:'Practice Room',d:'Guided session'},
  {v:'sightread',t:'Sight Reading',d:'It listens as you play'},{v:'eartraining',t:'Ear Training',d:'Name what you hear'},
  {v:'circle',t:'Circle of 5ths',d:'Your map of keys'},{v:'modes',t:'Modes Wheel',d:'Seven colours'},
  {v:'scales',t:'Scales',d:'Build any scale'},{v:'tuner',t:'Tuner',d:'A440, by ear or mic'},
  {v:'levers',t:'Levers',d:'Set any key'},{v:'drone',t:'Drone',d:'A bed to play over'},{v:'rhythm',t:'Rhythm',d:'Find the pocket'},
];
const NX_SACRED=[
  {v:'meditation',t:'Meditation',d:'Davidic harp & drone'},{v:'tehillim',t:'Tehillim',d:'Psalm of the day'},
  {v:'hebrew',t:'Hebrew Date',d:'On this day'},{v:'compass',t:'Jerusalem',d:'Face the Holy City'},
  {v:'journal',t:'Journal',d:'Your practice log'},{v:'repertoire',t:'Repertoire',d:'Pieces you play'},{v:'profile',t:'My Harp',d:'Tuning & levers'},
];
/* — procedural module art: painted scenes in the desert-hero language — */
const SOH_ART={
  c1:{sky:['#1B1440','#3B2D6E','#8873B5'], sun:'#F2E7C8', hill:['#241640','#170E2B','#0D0719'], motif:'clouds'}, /* Jacob — heavenly clouds */
  c2:{sky:['#241708','#5B3A14','#A8702E'], sun:'#F2CD8A', hill:['#3A2812','#281A0B','#170F06'], motif:'sun'},    /* Theory — amber dawn    */
  c3:{sky:['#12211A','#2C4A38','#5D7D5A'], sun:'#E9D9A0', hill:['#22382C','#16261D','#0C1510'], motif:'sun'},    /* Simcha — oasis         */
  c4:{sky:['#1F1408','#43290E','#7A5220'], sun:'#ECC27A', hill:['#33220E','#231708','#120B04'], motif:'strings'},/* Tools — bronze         */
  c5:{sky:['#0B1226','#1C2A4D','#3D4F7D'], sun:'#F0E3B2', hill:['#141D36','#0D1425','#070B16'], motif:'stars'},  /* Sacred — night blue    */
};
let _sohArtId=0;
function sohArt(cat,i){
  const a=SOH_ART[cat]||SOH_ART.c2, s=(i*137+29)%100, uid='a'+(_sohArtId++);
  const sx=50+((s*3.1)%290), sy=30+((s*1.7)%42), r=13+(s%11);
  const d1=118-(s%22), d2=150-(s%16), d3=178-(s%10);
  let motif='', ground;
  if(a.motif==='stars') motif=[...Array(8)].map((_,k)=>{const x=(s*7+k*53)%370+10,y=(k*29+s*3)%78+8;return `<circle cx='${x}' cy='${y}' r='1.3' fill='${a.sun}' opacity='.85'/>`;}).join('');
  else if(a.motif==='strings') motif=[0,1,2,3].map(k=>`<line x1='${30+k*26}' y1='0' x2='${64+k*26}' y2='220' stroke='${a.sun}' stroke-width='.8' opacity='.16'/>`).join('');
  if(a.motif==='clouds'){
    /* heavenly cloudscape — soft banks drifting in the universe, no dunes */
    const cl=(x,y,sc,f,o)=>`<g fill='${f}' opacity='${o}'><ellipse cx='${x}' cy='${y}' rx='${36*sc}' ry='${12*sc}'/><ellipse cx='${x-24*sc}' cy='${y+4*sc}' rx='${22*sc}' ry='${9*sc}'/><ellipse cx='${x+25*sc}' cy='${y+5*sc}' rx='${25*sc}' ry='${10*sc}'/><ellipse cx='${x+3*sc}' cy='${y-7*sc}' rx='${18*sc}' ry='${8*sc}'/></g>`;
    motif=[...Array(6)].map((_,k)=>{const x=(s*11+k*67)%370+10,y=(k*19+s*2)%64+6;return `<circle cx='${x}' cy='${y}' r='1.2' fill='#EDE6FF' opacity='.9'/>`;}).join('');
    ground = cl(100+(s%70),108,0.9,'#CFC1EE',.30) + cl(280-(s%50),138,1.2,'#B4A2E0',.42)
           + cl(70+(s%40),176,1.5,'#907CC6',.55) + cl(300-(s%30),198,1.8,'#6F5BA6',.7)
           + cl(160+(s%60),224,2.2,'#4F3F80',.9);
  } else {
    ground = `<path d="M0,${d1} Q95,${d1-26} 190,${d1} T390,${d1-8} V220 H0 Z" fill="${a.hill[0]}" opacity=".82"/>
    <path d="M0,${d2} Q130,${d2-24} 240,${d2} T390,${d2-6} V220 H0 Z" fill="${a.hill[1]}" opacity=".93"/>
    <path d="M0,${d3} Q120,${d3-16} 230,${d3} T390,${d3-4} V220 H0 Z" fill="${a.hill[2]}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <defs><linearGradient id="${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a.sky[0]}"/><stop offset=".55" stop-color="${a.sky[1]}"/><stop offset="1" stop-color="${a.sky[2]}"/></linearGradient></defs>
    <rect width="390" height="220" fill="url(#${uid})"/>
    <circle cx="${sx}" cy="${sy}" r="${r*2.5}" fill="${a.sun}" opacity=".13"/>
    <circle cx="${sx}" cy="${sy}" r="${r}" fill="${a.sun}" opacity=".55"/>${motif}
    ${ground}
  </svg>`;
}
function nxCard(cls,kick,title,sub,badge,art){
  return `<button class="nx-card ${cls}">${art?`<span class="nxc-art">${art}</span><span class="nxc-scrim"></span>`:''}<span class="nxc-kick">${kick||''}</span><span class="nxc-t">${title}</span><span class="nxc-s">${sub||''}</span>${badge?`<span class="nxc-badge">${badge}</span>`:''}</button>`;
}
function renderNxRails(){
  const host=document.getElementById('nxRails'); if(!host) return; host.innerHTML='';
  const rail=(title,view,cardsHtml,binder)=>{
    const w=document.createElement('div'); w.className='nx-rail reveal in';
    w.innerHTML=`<div class="nx-rail-h"><span>${title}</span>${view?`<button class="nx-all" data-v="${view}">All ›</button>`:''}</div><div class="nx-row">${cardsHtml}</div>`;
    if(view) w.querySelector('.nx-all').addEventListener('click',()=>{ showView(view); buzz(); });
    host.appendChild(w); if(binder) binder(w);
  };
  if(sohOn('jacob') && typeof JACOB_MODULES!=='undefined'){
    rail('Jacob’s Universe','jacob', JACOB_MODULES.map(m=>nxCard('nx-c1', m.kicker||('Module '+m.n), m.title, '', m.toy?'▶ play':(jacobSeen(m.n)?'✓':''), sohArt('c1',m.n))).join(''),
      w=>w.querySelectorAll('.nx-card').forEach((b,i)=>b.addEventListener('click',()=>{ showView('jacob'); jacobOpenModule(JACOB_MODULES[i].n); buzz(); })));
  }
  if(typeof THEORY_COURSE!=='undefined'){
    rail('Music Theory','theory', THEORY_COURSE.map(u=>{ const pr=sohUnitProg(u);
      const sub=`${pr.done}/${pr.t} chapters`+(pr.done?`<span class="nxc-bar"><i style="width:${pr.pct}%"></i></span>`:'');
      return nxCard('nx-c2', u.kicker||('Semester '+u.sem), u.title, sub,'', sohArt('c2',u.sem)); }).join(''),
      w=>w.querySelectorAll('.nx-card').forEach(b=>b.addEventListener('click',()=>{ showView('theory'); buzz(); })));
  }
  if(typeof SIMCHA_COURSE!=='undefined'){
    rail('Simcha’s Modes Course','learn', SIMCHA_COURSE.map((c,ci)=>nxCard('nx-c3', c.sub||'', c.title, c.lessons.length+' lessons','', sohArt('c3',ci))).join(''),
      w=>w.querySelectorAll('.nx-card').forEach(b=>b.addEventListener('click',()=>{ showView('learn'); buzz(); })));
  }
  const _tools=NX_TOOLS.filter(t=>sohOn(t.v)), _sacred=NX_SACRED.filter(t=>sohOn(t.v));
  rail('Practice & Tools',null, _tools.map((t,i)=>nxCard('nx-c4','',t.t,t.d,'', sohArt('c4',i))).join(''),
    w=>w.querySelectorAll('.nx-card').forEach((b,i)=>b.addEventListener('click',()=>{ showView(_tools[i].v); buzz(); })));
  rail('Sacred & Daily',null, _sacred.map((t,i)=>nxCard('nx-c5','',t.t,t.d,'', sohArt('c5',i))).join(''),
    w=>w.querySelectorAll('.nx-card').forEach((b,i)=>b.addEventListener('click',()=>{ showView(_sacred[i].v); buzz(); })));
}

function renderHome(){
  const d=new Date(), h=d.getHours();
  const greet = h<5?'Still awake' : h<12?'Good morning' : h<17?'Good afternoon' : h<21?'Good evening' : 'A quiet night';
  const ge=document.getElementById('homeGreet'); if(ge) ge.textContent=greet;
  const de=document.getElementById('homeDate'); if(de) de.textContent=d.toLocaleDateString(undefined,{weekday:'long', month:'long', day:'numeric'});
  const s=journalStats(), st=document.getElementById('homeStreak');
  if(st){ let lv=null; try{ lv=sohLevel(); }catch(e){}
    st.innerHTML = s.streak>0 ? `<span class="sk-dot"></span>${s.streak}-day flame${lv?` · ${lv.name}`:''}` : (lv&&lv.n>1?`✦ ${lv.name}`:(s.sessions?`${s.sessions} ${s.sessions===1?'session':'sessions'}`:'Begin today'));
    st.style.cursor='pointer'; st.onclick=()=>{ if(typeof sohOnboardOpen==='function') sohOnboardOpen(); }; st.title='Your harp profile'; }
  const f=DAILY_FOCUS[dayOfYear()%DAILY_FOCUS.length], r=resolveMode(f.k,f.w,f.m), m=r.mode;
  const tc=document.getElementById('todayCard');
  if(tc){
    tc.style.setProperty('--c',`var(${r.world.tone})`);
    tc.innerHTML=`<div class="td-row"><span class="td-lead">Today’s practice</span><span class="td-arrow">→</span></div>
      <div class="td-mode">${m.root} ${m.name}</div>
      <div class="td-mood">${m.mood}</div>
      <div class="td-cta">Tap to begin a 20‑minute session</div>`;
    tc.onclick=()=>{ mwKey=r.parentName; mwWorld=r.world; rebuildModes(false); setMode(r.modeIndex,false); prTotal=20; showView('practice'); buzz(); };
  }
  renderHomeHebrew(d);
  try{ renderWelcome(); }catch(e){}
  try{ youMaybeRemind(); }catch(e){}
  renderNxHero();
  try{ if(typeof buildTodayPath==='function') buildTodayPath(); }catch(e){}
  renderVerse();
  try{
    if(typeof sohProfile==='function' && !sohProfile().harp && !window._sohObSeen){
      window._sohObSeen=true;
      setTimeout(sohMaybeOnboard, 700);   // opens only if the auth gate isn't in front
    }
  }catch(e){}
}

/* ============================================================
   HEBREW CALENDAR · DAILY TEHILLIM · ON THIS DAY
   ============================================================ */
const HEB_CAT = { torah:'#B28E47', temple:'#8E6F31', holiday:'#5E8C7E', history:'#6E8398', person:'#86708F' };
let tehDow = null;   // selected weekday in the Tehillim view (null = today)

function renderHomeHebrew(d){
  const btn=document.getElementById('homeHebDate'); if(!btn || typeof gregorianToHebrew!=='function') return;
  const h=gregorianToHebrew(d); btn.hidden=false;
  btn.innerHTML=`<span class="hd-star">✡</span>${h.render}<span class="hd-go">›</span>`;
}
/* Hebrew opening line (consonantal, STA"M-style — no nikud) + Tanakh reference, by day-of-week.
   Hebrew is matched to each day's transliteration (incipit). */
const SHIR_HEBREW = {
  0:{ ref:'תהילים כ״ד', he:'לדוד מזמור ליהוה הארץ ומלואה' },
  1:{ ref:'תהילים מ״ח', he:'שיר מזמור לבני קרח גדול יהוה ומהלל מאד' },
  2:{ ref:'תהילים פ״ב', he:'מזמור לאסף אלהים נצב בעדת אל' },
  3:{ ref:'תהילים צ״ד', he:'אל נקמות יהוה אל נקמות הופיע' },
  4:{ ref:'תהילים פ״א', he:'הרנינו לאלהים עוזנו הריעו לאלהי יעקב' },
  5:{ ref:'תהילים צ״ג', he:'יהוה מלך גאות לבש' },
  6:{ ref:'תהילים צ״ב', he:'מזמור שיר ליום השבת טוב להדות ליהוה' },
};
function renderSongCard(d){
  const card=document.getElementById('songCard'); if(!card || typeof songOfDay!=='function') return;
  const s=songOfDay(d); if(!s){ card.hidden=true; return; }
  const H=SHIR_HEBREW[s.dow]||{ref:'',he:''};
  card.hidden=false;
  card.innerHTML=`<div class="sc-row"><span class="sc-lead">Song of the day · ${s.day}</span><span class="td-arrow">→</span></div>
    <div class="sc-ref"><span class="sc-ref-he" dir="rtl" lang="he">${H.ref}</span><span class="sc-ref-en">${s.psalms.map(p=>'Psalm '+p).join(' + ')}</span></div>
    <div class="sc-stam" dir="rtl" lang="he">${H.he}</div>
    <div class="sc-translit">${s.incipit}</div>
    <div class="sc-theme">${s.theme}</div>`;
}
/* ---- Hebrew helpers: STA"M consonantal display + auto transliteration (every verse) ---- */
function hebStrip(s){
  return String(s||'')
    .replace(/\{[^}]*\}/g,'').replace(/\([^)]*\)/g,'').replace(/&thinsp;|&nbsp;/g,' ')
    .replace(/[֑-ׇֽֿׁׂׅׄ]/g,'')   // cantillation + nikud + dots
    .replace(/־/g,' ').replace(/[׀׃׆]/g,'')           // maqaf→space, paseq/sof-pasuk/nun-hafukha
    .replace(/\s+/g,' ').trim();
}
const HCONS={'א':'','ב':'v','ג':'g','ד':'d','ה':'h','ו':'v','ז':'z','ח':'ch','ט':'t','י':'y','כ':'ch','ך':'ch','ל':'l','מ':'m','ם':'m','נ':'n','ן':'n','ס':'s','ע':'','פ':'f','ף':'f','צ':'tz','ץ':'tz','ק':'k','ר':'r','ש':'sh','ת':'t'};
const HVOW={'ְ':'’','ֱ':'e','ֲ':'a','ֳ':'o','ִ':'i','ֵ':'e','ֶ':'e','ַ':'a','ָ':'a','ֹ':'o','ֺ':'o','ֻ':'u','ׇ':'o'};
function hebTranslit(src){
  if(!src) return '';
  let s=String(src).replace(/[֑-ֽֿ֯׀׃ׅׄ׆]/g,'')
    .replace(/\{[^}]*\}/g,'').replace(/\([^)]*\)/g,'').replace(/&thinsp;|&nbsp;/g,' ');
  s=s.replace(/י[ְ-ׇּׁׂ]*ה[ְ-ׇּׁׂ]*ו[ְ-ׇּׁׂ]*ה/g,' Adonai '); // Tetragrammaton -> Adonai (emitted via Latin pass-through)
  const ch=[...s], out=[]; let prevVow='', wordStart=true;
  for(let i=0;i<ch.length;i++){ const c=ch[i];
    /* divine name handled by the Latin pass-through below */
    if(c==='־'||c===' '){ if(out.length&&out[out.length-1]!==' ') out.push(' '); wordStart=true; prevVow=''; continue; }
    if(/[A-Za-z]/.test(c)){ out.push(c); wordStart=false; prevVow=''; continue; }
    const code=c.codePointAt(0); if(code<0x05D0||code>0x05EA) continue;
    let j=i+1,dag=false,sin=false,vow='';
    while(j<ch.length){ const nc=ch[j].codePointAt(0);
      if(nc===0x05BC){dag=true;j++;continue;}
      if(nc===0x05C1){j++;continue;}                 // shin dot
      if(nc===0x05C2){sin=true;j++;continue;}         // sin dot
      if((nc>=0x05B0&&nc<=0x05BB)||nc===0x05C7){ vow+=(HVOW[ch[j]]||''); j++; continue; }
      break;
    }
    let cons=HCONS[c]||'';
    if(c==='ש') cons=sin?'s':'sh';
    if(c==='ב'&&dag) cons='b';
    if((c==='כ'||c==='ך')&&dag) cons='k';
    if((c==='פ'||c==='ף')&&dag) cons='p';
    if(c==='ו'){ if(dag&&!vow) cons='u'; else if(vow.indexOf('o')>=0){cons='o';vow='';} else cons='v'; }
    if(c==='י'&&!vow&&/i$/.test(prevVow)) cons='';   // mater yod after chirik
    if(vow==='’' && !wordStart) vow='';              // silent (nach) sheva mid-word
    out.push(cons+vow); prevVow=vow; wordStart=false; i=j-1;
  }
  let r=out.join('').replace(/\s+/g,' ').trim();
  return r? r.charAt(0).toUpperCase()+r.slice(1):'';
}
function renderTehillim(){
  if(typeof SHIR_SHEL_YOM==='undefined') return;
  const s = tehDow!=null ? SHIR_SHEL_YOM.find(x=>x.dow===tehDow) : songOfDay(new Date());
  if(!s) return;
  const days=document.getElementById('tehDays');
  if(days){ days.innerHTML=''; const labels=['Sun','Mon','Tue','Wed','Thu','Fri','Shabbat'];
    SHIR_SHEL_YOM.forEach(x=>{ const b=document.createElement('button'); b.className='teh-day'+(x.dow===s.dow?' on':'');
      b.innerHTML=`<b>${labels[x.dow]}</b><span>Ps ${x.psalms.join('+')}</span>`;
      b.addEventListener('click',()=>{ tehDow=x.dow; renderTehillim(); buzz(); b.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'}); });
      days.appendChild(b); });
  }
  const H=SHIR_HEBREW[s.dow]||{ref:'',he:''};
  const ctx=document.getElementById('tehContext');
  if(ctx) ctx.innerHTML=`<div class="tc-day">${s.hebrewDay} · ${s.day}</div>
    <div class="tc-ref-he" dir="rtl" lang="he">${H.ref}</div>
    <div class="tc-stam" dir="rtl" lang="he">${H.he}</div>
    <div class="tc-incipit">${s.incipit}</div>
    <div class="tc-theme">${s.theme}</div>
    <div class="tc-note">Sung in the Holy Temple by the Levites on ${s.day} — ${s.creation}.</div>`;
  const host=document.getElementById('tehScroll');
  if(host){ host.innerHTML = s.psalms.map((p,i)=>{
    const t=TEHILLIM_TEXT[p]; if(!t) return '';
    const isExtra = s.extra && i>0, limit = isExtra ? 3 : t.he.length;
    let rows='';
    for(let v=0; v<limit; v++){ const raw=t.he[v]||'';
      rows+=`<div class="teh-v"><span class="teh-vn">${v+1}</span><div class="teh-he" dir="rtl" lang="he">${hebStrip(raw)}</div><div class="teh-tr">${hebTranslit(raw)}</div><div class="teh-en">${t.en[v]||''}</div></div>`; }
    return `<div class="teh-psalm"><div class="teh-ref">${t.ref}${isExtra?' · 1–3':''}</div>${rows}</div>`;
  }).join(''); }
  triggerReveals(document.getElementById('view-tehillim'));
}
function renderHebrew(){
  if(typeof gregorianToHebrew!=='function') return;
  const d=new Date(), h=gregorianToHebrew(d);
  const big=document.getElementById('hebBig'); if(big) big.textContent=`${h.day} ${h.monthName}`;
  const yr=document.getElementById('hebGreg'); if(yr) yr.textContent=`${h.render} · ${d.toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'})}`;
  const sub=document.getElementById('hebSub'); const s=songOfDay(d);
  if(sub) sub.innerHTML = s ? `Today’s Levites’ song is <b>${s.psalms.map(p=>'Psalm '+p).join(' + ')}</b> · <button class="heb-link" data-view="tehillim">read the Tehillah ›</button>` : '';
  const host=document.getElementById('hebEvents');
  if(host){ const ev=jewishEventsFor(h.monthName, h.day);
    if(!ev.length) host.innerHTML=`<div class="heb-empty">No recorded event for the <b>${h.render}</b> in our collection yet — but every day the harp can give thanks.</div>`;
    else host.innerHTML = ev.map(e=>`<div class="heb-ev" style="--cat:${HEB_CAT[e.category]||'var(--gold)'}">
      <div class="he-top"><span class="he-cat">${e.category}</span>${e.year&&e.year!=='—'?`<span class="he-year">${e.year}</span>`:''}</div>
      <div class="he-title">${e.title}</div><div class="he-detail">${e.detail}</div></div>`).join('');
  }
  triggerReveals(document.getElementById('view-hebrew'));
}

/* ============================================================
   DAVIDIC HARP MEDITATION — mode + drone + Simcha's way-in + a Sefaria text
   ============================================================ */
const MED_MODES = ['Ionian','Dorian','Phrygian','Lydian','Mixolydian','Aeolian','Locrian'];
const MED_ROOTS = {Ionian:'C',Dorian:'D',Phrygian:'E',Lydian:'F',Mixolydian:'G',Aeolian:'A',Locrian:'B'};
const MED_TONE  = ['--m1','--m2','--m3','--m4','--m5','--m6','--m7'];
const MED_TEXTS = [{key:'mode',label:'This mode’s psalm'},{key:'today',label:'Song of the day'},{key:'refuge',label:'A psalm of refuge'}];
const MED_REFUGE = ['Psalms 23','Psalms 27','Psalms 91','Psalms 121','Psalms 62','Psalms 16','Psalms 131','Psalms 46'];
let med = { mode:'Dorian', text:'mode', lenMin:5, _timer:null, remaining:0, running:false, _init:false };

/* Sefaria — keyless contemplative text (JPS 1917 Public Domain), with offline fallback */
async function sefariaText(ref){
  try{
    const ven=encodeURIComponent('The Holy Scriptures: A New Translation (JPS 1917)');
    const r=await fetch(`https://www.sefaria.org/api/texts/${encodeURIComponent(ref)}?context=0&commentary=0&ven=${ven}`);
    if(!r.ok) throw 0; const j=await r.json();
    const strip=s=>String(s||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
    const he=(Array.isArray(j.he)?j.he:[j.he]).map(strip), en=(Array.isArray(j.text)?j.text:[j.text]).map(strip);
    if(!en.some(Boolean)) throw 0;
    return { ref:j.ref||ref, he, en };
  }catch(e){
    const m=String(ref).match(/Psalms?\s+(\d+)/i);
    if(m && typeof TEHILLIM_TEXT!=='undefined' && TEHILLIM_TEXT[m[1]]) return { ref:'Psalms '+m[1], he:TEHILLIM_TEXT[m[1]].he, en:TEHILLIM_TEXT[m[1]].en, offline:true };
    return null;
  }
}
function medTextRef(){
  if(med.text==='today'){ const s=songOfDay(new Date()); return 'Psalms '+(s?s.psalms[0]:23); }
  if(med.text==='refuge'){ return MED_REFUGE[Math.floor(Math.random()*MED_REFUGE.length)]; }
  return (MODE_TEACHING[med.mode]&&MODE_TEACHING[med.mode].psalm)||'Psalms 23';
}
function buildMeditation(){
  const m=document.getElementById('medModes');
  if(m){ m.innerHTML=''; MED_MODES.forEach((name,i)=>{ const b=document.createElement('button'); b.className='med-mode'+(name===med.mode?' on':'');
    b.style.setProperty('--c',`var(${MED_TONE[i]})`); b.innerHTML=`<b>${name}</b><span>on ${MED_ROOTS[name]}</span>`;
    b.addEventListener('click',()=>{ med.mode=name; buildMeditation(); buzz(); }); m.appendChild(b); }); }
  const fill=(id,items,isOn,pick)=>{ const h=document.getElementById(id); if(!h) return; h.innerHTML='';
    items.forEach(o=>{ const b=document.createElement('button'); b.className='dchip'+(isOn(o)?' on':''); b.textContent=o.label;
      b.addEventListener('click',()=>{ pick(o); buzz(); }); h.appendChild(b); }); };
  fill('medTexts', MED_TEXTS, o=>o.key===med.text, o=>{ med.text=o.key; buildMeditation(); });
  fill('medLens', [5,10,20].map(n=>({key:n,label:n+' min'})), o=>o.key===med.lenMin, o=>{ med.lenMin=o.key; buildMeditation(); });
}
function medBegin(){
  const teach=MODE_TEACHING[med.mode], root=MED_ROOTS[med.mode], tone=MED_TONE[MED_MODES.indexOf(med.mode)];
  document.getElementById('medSetup').hidden=true; document.getElementById('medRun').hidden=false;
  document.body.classList.add('in-session');
  Drone.followWheel=false; Drone.setRoot(root); Drone.type='fifth'; Drone.voice='pad'; if(!Drone.playing) Drone.start();
  document.getElementById('medDroneBtn').classList.add('on');
  const w=document.getElementById('medWayin'); w.style.setProperty('--c',`var(${tone})`);
  w.innerHTML=`<div class="mw-mode">${med.mode} · drone on ${root}</div>
    <div class="mw-frame">${teach.framing}</div>
    <div class="mw-row"><span class="mw-k">Character</span> ${teach.char}</div>
    <div class="mw-row"><span class="mw-k">Chord</span> ${teach.chord}</div>
    <div class="mw-row"><span class="mw-k">The way in</span> ${teach.pattern}</div>
    <div class="mw-song">♪ ${teach.song}</div>`;
  document.getElementById('medReflect').innerHTML=`<span class="mr-q">“</span>${teach.reflect}<span class="mr-q">”</span>`;
  medLoadText();
  med.remaining=med.lenMin*60; med.running=true;
  const tEl=document.getElementById('medTimer'); if(tEl) tEl.textContent=prFmt(med.remaining);
  clearInterval(med._timer);
  med._timer=setInterval(()=>{ if(!med.running) return; med.remaining--; const t=document.getElementById('medTimer'); if(t)t.textContent=prFmt(Math.max(0,med.remaining)); if(med.remaining<=0) medEnd(); },1000);
  triggerReveals(document.getElementById('view-meditation')); buzz();
}
async function medLoadText(){
  const host=document.getElementById('medText'); if(!host) return;
  host.innerHTML=`<div class="med-loading">Drawing a text near…</div>`;
  const data=await sefariaText(medTextRef());
  if(!data){ host.innerHTML=`<div class="med-loading">Let the drone carry you — no text could be drawn just now.</div>`; return; }
  const n=Math.min(data.en.length,8); let rows='';
  for(let i=0;i<n;i++) rows+=`<div class="med-v"><div class="med-he" dir="rtl" lang="he">${data.he[i]||''}</div><div class="med-en">${data.en[i]||''}</div></div>`;
  host.innerHTML=`<div class="med-ref">${data.ref}${data.offline?' · offline':''}</div>${rows}${data.en.length>n?'<div class="med-more">…let it carry you on, in your own Tehillim</div>':''}`;
}
function medSetDrone(on){ document.getElementById('medDroneBtn')?.classList.toggle('on',on);
  if(on){ Drone.setRoot(MED_ROOTS[med.mode]); if(!Drone.playing) Drone.start(); } else if(Drone.playing) Drone.stop();
  if(typeof updateNowPlaying==='function') updateNowPlaying(); }
function medEnd(){ clearInterval(med._timer); med.running=false; if(Drone.playing) Drone.stop(); if(typeof updateNowPlaying==='function') updateNowPlaying();
  document.body.classList.remove('in-session');
  const r=document.getElementById('medRun'), s=document.getElementById('medSetup'); if(r)r.hidden=true; if(s)s.hidden=false; buildMeditation(); }
function medEnter(){ if(!med._init){ med._init=true;
    document.getElementById('medBegin')?.addEventListener('click',medBegin);
    document.getElementById('medExit')?.addEventListener('click',medEnd);
    document.getElementById('medDroneBtn')?.addEventListener('click',()=>medSetDrone(!Drone.playing));
    document.getElementById('medNewText')?.addEventListener('click',()=>{ medLoadText(); buzz(); });
  }
  const r=document.getElementById('medRun'), s=document.getElementById('medSetup'); if(r)r.hidden=true; if(s)s.hidden=false; buildMeditation(); }
function medLeave(){ if(med.running) medEnd(); }

/* ============================================================
   SIMCHA'S MODES COURSE — pure music teaching pathway (no scripture)
   ============================================================ */
let learnCh=0, learnLi=0, learnLessons=[], _learnBound=false;
function learnExpand(ch){
  const out=[];
  ch.lessons.forEach(L=>{
    if(L.gen==='modes'){ MODES.forEach((m,i)=>{ const t=(typeof MODE_TEACHING!=='undefined'&&MODE_TEACHING[m.name])||{};
      out.push({ h:m.name, flower:i, body:(JOURNEY_LEAD[m.name]||t.framing||''), harp:t.pattern, chord:t.chord, song:t.song }); }); }
    else out.push(L);
  });
  return out;
}
function buildLearnHub(){
  const host=document.getElementById('learnChapters'); if(!host || typeof SIMCHA_COURSE==='undefined') return; host.innerHTML='';
  SIMCHA_COURSE.forEach((ch,ci)=>{
    const count=learnExpand(ch).length;
    const b=document.createElement('button'); b.className='learn-ch';
    b.innerHTML=`<div class="lc-n">${ci+1}</div><div class="lc-tx"><div class="lc-t">${ch.title}</div><div class="lc-s">${ch.sub} · ${count} lessons</div></div><span class="lc-go">›</span>`;
    b.addEventListener('click',()=>openChapter(ci)); host.appendChild(b);
  });
  triggerReveals(document.getElementById('view-learn'));
}
function openChapter(ci){
  learnCh=ci; learnLessons=learnExpand(SIMCHA_COURSE[ci]); learnLi=0;
  document.getElementById('learnHub').hidden=true; document.getElementById('learnRun').hidden=false;
  document.body.classList.add('in-session');
  document.getElementById('learnProgress').innerHTML=learnLessons.map(()=>'<span class="jdot"></span>').join('');
  renderLesson(0); window.scrollTo(0,0); buzz();
}
function renderLesson(dir){
  const L=learnLessons[learnLi], stage=document.getElementById('learnStage'); if(!L||!stage) return;
  const hasFlower=(L.flower!=null);
  let extra='';
  if(L.chord) extra+=`<div class="learn-meta"><span class="lm-k">Character chord</span> ${L.chord}</div>`;
  if(L.song)  extra+=`<div class="learn-song">♪ ${L.song}</div>`;
  if(L.harp)  extra+=`<div class="learn-harp"><span class="lm-k">On your harp</span> ${L.harp}</div>`;
  const action=L.action?`<button class="jrn-cta" id="learnAction">${L.action.label}</button>`:'';
  stage.innerHTML=`<div class="jrn-slide ${hasFlower?'':'center'}" ${hasFlower?`style="--c:var(${VAR[L.flower]})"`:''}>
    ${hasFlower?flowerSVG(L.flower):''}
    ${L.h?`<h2 class="learn-h">${L.h}</h2>`:''}
    <p class="jrn-lead">${L.body}</p>${extra}${action}</div>`;
  const slide=stage.firstElementChild; if(slide){ slide.classList.add('jrn-in'); if(dir===1)slide.classList.add('from-right'); else if(dir===-1)slide.classList.add('from-left'); }
  document.querySelectorAll('#learnProgress .jdot').forEach((d,i)=>d.classList.toggle('on',i===learnLi));
  document.getElementById('learnBack').textContent = learnLi===0 ? '‹ Chapters' : '‹ Back';
  document.getElementById('learnNext').textContent = learnLi===learnLessons.length-1 ? (learnCh<SIMCHA_COURSE.length-1?'Next chapter ›':'Finish ✓') : 'Next ›';
  const act=document.getElementById('learnAction'); if(act&&L.action) act.addEventListener('click',()=>showView(L.action.view));
}
function learnGo(d){
  if(d<0 && learnLi===0){ learnExit(); return; }
  if(d>0 && learnLi===learnLessons.length-1){ if(learnCh<SIMCHA_COURSE.length-1) openChapter(learnCh+1); else learnExit(); return; }
  learnLi=Math.max(0,Math.min(learnLessons.length-1,learnLi+d)); renderLesson(d>0?1:-1); window.scrollTo(0,0); buzz();
}
function learnExit(){ document.body.classList.remove('in-session');
  document.getElementById('learnRun').hidden=true; document.getElementById('learnHub').hidden=false; buildLearnHub(); window.scrollTo(0,0); }
function learnEnter(){ if(!_learnBound){ _learnBound=true;
    document.getElementById('learnBack')?.addEventListener('click',()=>learnGo(-1));
    document.getElementById('learnNext')?.addEventListener('click',()=>learnGo(1));
    document.getElementById('learnExit')?.addEventListener('click',learnExit);
    const wrap=document.getElementById('learnStage'); if(wrap&&typeof addSwipe==='function') addSwipe(wrap,{onLeft:()=>learnGo(1),onRight:()=>learnGo(-1)});
  }
  document.getElementById('learnRun').hidden=true; document.getElementById('learnHub').hidden=false; buildLearnHub();
}
function learnLeave(){ document.body.classList.remove('in-session'); }

/* ============================================================
   MUSIC THEORY COURSE — four-semester curriculum (theory.js)
   ============================================================ */
let theorySem=0, theoryCh=0, theoryLi=0, theoryLessons=[], _theoryBound=false;
function theoryKeyboardSVG(){
  const names=['C','D','E','F','G','A','B'], ww=30, wh=84;
  let whites='', labels='';
  names.forEach((nm,i)=>{ const x=i*ww;
    whites+=`<rect x="${x}" y="0" width="${ww-1.5}" height="${wh}" rx="3" fill="var(--surface)" stroke="var(--line-2)"/>`;
    labels+=`<text x="${x+ww/2}" y="${wh-7}" text-anchor="middle" font-size="10" fill="var(--ink-faint)">${nm}</text>`; });
  let blacks=''; [0,1,3,4,5].forEach(i=>{ const x=(i+1)*ww-ww*0.3; blacks+=`<rect x="${x}" y="0" width="${ww*0.6}" height="${wh*0.62}" rx="2" fill="var(--ink)"/>`; });
  return `<svg class="thy-kbd" viewBox="0 0 ${7*ww} ${wh}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="keyboard">${whites}${blacks}${labels}</svg>`;
}
/* ===== Theory gamification: XP · ranks · certificates ===== */
const THEORY_RANKS=[
  {min:0,    name:'Apprentice of Strings'},
  {min:150,  name:'Novice Harper'},
  {min:400,  name:'Student of Theory'},
  {min:800,  name:'Journeyman Harper'},
  {min:1300, name:'Adept of Harmony'},
  {min:2000, name:'Harmonist'},
  {min:2900, name:'Master Harper'},
  {min:4000, name:'Loremaster of the Strings'},
];
function sohName(){ try{ return (localStorage.getItem('soh-name')||sohProfile().name||'').trim(); }catch(e){ return ''; } }
function sohSetName(){ try{ const v=prompt('Your name, as it should appear on your certificates:', sohName()); if(v!=null) localStorage.setItem('soh-name', v.trim()); return true; }catch(e){ return false; } }
function sohTheoryStats(){
  let xp=0, chDone=0, chTotal=0, unitsDone=0, unitsTotal=0;
  try{ const d=JSON.parse(localStorage.getItem('soh-lessons')||'{}');
    (THEORY_COURSE||[]).forEach(u=>{ unitsTotal++; if(sohUnitProg(u).pct>=100) unitsDone++;
      u.chapters.forEach(c=>{ chTotal++; const e=d['t'+c.n];
        if(e){ xp+=Math.min(e.seen,e.total)*10; if(e.seen>=e.total){ chDone++; xp+=50; } } }); });
  }catch(e){}
  xp += unitsDone*150 + ((unitsTotal>0 && unitsDone===unitsTotal)?400:0);
  try{ const d=JSON.parse(localStorage.getItem('soh-lessons')||'{}');
    (typeof JACOB_MODULES!=='undefined'?JACOB_MODULES:[]).forEach(m=>{ const e=d['j'+m.n];
      if(e){ xp+=Math.min(e.seen,e.total)*8; if(e.seen>=e.total) xp+=40; } });
  }catch(e){}
  let rank=THEORY_RANKS[0]; THEORY_RANKS.forEach(r=>{ if(xp>=r.min) rank=r; });
  const ri=THEORY_RANKS.indexOf(rank), next=THEORY_RANKS[ri+1]||null;
  return { xp, rank:rank.name, rankN:ri+1, rankMin:rank.min, next,
    chDone, chTotal, pct: chTotal?Math.round(chDone/chTotal*100):0, unitsDone, unitsTotal };
}
function sohCertsEarned(){
  const out=[]; (THEORY_COURSE||[]).forEach(u=>{ if(sohUnitProg(u).pct>=100) out.push({id:'u'+u.sem, unit:u}); });
  const st=sohTheoryStats(); if(st.unitsTotal>0 && st.unitsDone===st.unitsTotal) out.push({id:'diploma'});
  return out;
}
function sohCertHTML(cert){
  const name=sohName()||'A Devoted Harper';
  let date=''; try{ date=new Date().toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'}); }catch(e){}
  let title, sub, body, src='';
  if(cert.id==='diploma'){
    title='Diploma'; sub='Master of Music Theory';
    body='has completed every unit of the Strings of Hope Music Theory course — from the first notes to the avant-garde, the science of sound, and theory in the real world — each concept mapped to the lever harp.';
  } else {
    const u=cert.unit; title='Certificate of Completion'; sub=u.title;
    body=`has completed <b>${u.title}</b> — ${u.sub} — comprising ${u.chapters.length} chapters, every one mapped to the lever harp.`;
    src=u.src||'';
  }
  return `<div class="cert-sheet${cert.id==='diploma'?' diploma':''}">
    <img class="cert-seal" src="img/lyre.png" alt="">
    <div class="cert-acad">Strings of Hope · Academy of the Lever Harp</div>
    <div class="cert-title">${title}</div>
    <div class="cert-rule"></div>
    <div class="cert-sub">${sub}</div>
    <div class="cert-pre">This certifies that</div>
    <button class="cert-name" id="certName" title="Tap to set your name">${name}</button>
    <div class="cert-body">${body}</div>
    <div class="cert-foot"><span class="cert-date">${date}</span></div>
    ${src?`<div class="cert-src">${src}</div>`:''}
    <div class="cert-sig">Believe in your dreams. · <b>Strings of Hope</b></div>
  </div>`;
}
function sohOpenCert(cert){
  const ov=document.getElementById('certModal'); if(!ov||!cert) return;
  ov.querySelector('#certBody').innerHTML=sohCertHTML(cert);
  ov.hidden=false; document.body.classList.add('cert-open');
  ov.querySelector('#certName')?.addEventListener('click',()=>{ if(sohSetName()) sohOpenCert(cert); });
  buzz();
}
function sohOpenCertById(id){ sohOpenCert(sohCertsEarned().find(c=>c.id===id)); }
function sohCloseCert(){ const ov=document.getElementById('certModal'); if(ov){ ov.hidden=true; document.body.classList.remove('cert-open'); const s=ov.querySelector('.cert-scroll'); s&&s.classList.remove('cert-new'); } }
let _certBound=false;
function sohBindCert(){ if(_certBound) return; _certBound=true;
  document.getElementById('certPrint')?.addEventListener('click',()=>{ try{ window.print(); }catch(e){} });
  document.getElementById('certClose')?.addEventListener('click',sohCloseCert);
  document.getElementById('certModal')?.addEventListener('click',e=>{ if(e.target.id==='certModal') sohCloseCert(); });
}
function sohCertCelebrate(){
  try{ const earned=sohCertsEarned(), seen=new Set(JSON.parse(localStorage.getItem('soh-certs-seen')||'[]'));
    const fresh=earned.filter(c=>!seen.has(c.id));
    earned.forEach(c=>seen.add(c.id)); localStorage.setItem('soh-certs-seen',JSON.stringify([...seen]));
    if(fresh.length){ const c=fresh.find(x=>x.id==='diploma')||fresh[0]; sohOpenCert(c); haptic('win');
      const s=document.querySelector('#certModal .cert-scroll'); if(s){ s.classList.add('cert-new'); setTimeout(()=>s.classList.remove('cert-new'),2600); } return true; }
  }catch(e){}
  return false;
}
function theoryMasterHTML(){
  const st=sohTheoryStats(), earnedIds=new Set(sohCertsEarned().map(c=>c.id));
  const seals=(THEORY_COURSE||[]).map(u=>{ const id='u'+u.sem, on=earnedIds.has(id);
    return `<button class="thy-seal${on?' on':''}" data-cert="${id}"${on?'':' disabled'}>
      <span class="thy-seal-i">${on?'✦':'🔒'}</span><span class="thy-seal-t">${u.kicker||('Unit '+u.sem)}</span></button>`; }).join('');
  const dOn=earnedIds.has('diploma');
  const diploma=`<button class="thy-seal diploma${dOn?' on':''}" data-cert="diploma"${dOn?'':' disabled'}>
      <span class="thy-seal-i">${dOn?'👑':'🔒'}</span><span class="thy-seal-t">Diploma</span></button>`;
  const nextTxt=st.next?`${st.next.min-st.xp} XP to ${st.next.name}`:'Highest rank reached';
  return `<div class="thy-master">
    <div class="thy-mh"><div><div class="thy-mrank">${st.rank}</div><div class="thy-msub">Level ${st.rankN} · Theory mastery</div></div>
      <div class="thy-mxp"><span class="thy-mxp-n">${st.xp.toLocaleString()}</span><span class="thy-mxp-l">XP</span></div></div>
    <div class="thy-mbar"><i style="width:${st.pct}%"></i></div>
    <div class="thy-mstat"><span>${st.chDone} / ${st.chTotal} chapters · ${st.pct}%</span><span>${nextTxt}</span></div>
    <div class="thy-seal-lbl">Certificates</div>
    <div class="thy-seals">${seals}${diploma}</div>
  </div>`;
}
function buildTheoryHub(){
  const host=document.getElementById('theoryUnits'); if(!host || typeof THEORY_COURSE==='undefined') return; host.innerHTML='';
  const master=document.createElement('div'); master.innerHTML=theoryMasterHTML(); const mp=master.firstElementChild;
  if(mp){ host.appendChild(mp); mp.querySelectorAll('.thy-seal.on').forEach(b=>b.addEventListener('click',()=>sohOpenCertById(b.dataset.cert))); }
  THEORY_COURSE.forEach((unit,ui)=>{
    const grp=document.createElement('div'); grp.className='thy-unit';
    const kicker = unit.kicker || ('Semester '+unit.sem);
    const srcNote = unit.src ? `<div class="thy-unit-src">${unit.src}</div>` : '';
    const up=(typeof sohUnitProg==='function')?sohUnitProg(unit):{done:0,t:unit.chapters.length,pct:0};
    const bar=`<div class="thy-unit-prog"><div class="thy-unit-bar"><i style="width:${up.pct}%"></i></div><span class="thy-unit-pct">${up.done}/${up.t}</span></div>`;
    grp.innerHTML=`<div class="thy-unit-h"><span class="thy-sem">${kicker}</span><div class="thy-unit-t">${unit.title}</div><div class="thy-unit-s">${unit.sub}</div>${bar}${srcNote}</div>`;
    const list=document.createElement('div'); list.className='thy-chs';
    unit.chapters.forEach((ch,ci)=>{ const b=document.createElement('button');
      const p=(typeof sohChapterProg==='function')?sohChapterProg(ch.n):null; const done=!!(p&&p.done);
      b.className='thy-ch'+(done?' done':'');
      const chk=`<span class="tc-check${done?' on':''}">${done?'✓':ch.n}</span>`;
      const mark=(p&&!done)?`<span class="tc-p">${p.seen}/${p.total}</span>`:'';
      b.innerHTML=`${chk}<span class="tc-t">${ch.title}</span>${mark}<span class="tc-go">›</span>`;
      b.addEventListener('click',()=>openTheoryChapter(ui,ci)); list.appendChild(b); });
    grp.appendChild(list); host.appendChild(grp);
  });
  const cr=document.getElementById('theoryCredit'); if(cr) cr.textContent=(typeof THEORY_SOURCE!=='undefined')?THEORY_SOURCE:'';
  sohBindCert(); triggerReveals(document.getElementById('view-theory'));
  try{ sohCertCelebrate(); }catch(e){}
}
function openTheoryChapter(ui,ci){
  if(typeof sohProgressSave==='function') sohProgressSave('theory',{sem:ui,ch:ci});
  theorySem=ui; theoryCh=ci; theoryLi=0;
  const ch=THEORY_COURSE[ui].chapters[ci];
  theoryLessons = ch.quiz && ch.quiz.length ? ch.lessons.concat([{quiz:ch.quiz, h:'Check your understanding'}]) : ch.lessons.slice();
  document.getElementById('theoryHub').hidden=true; document.getElementById('theoryRun').hidden=false;
  document.body.classList.add('in-session');
  document.getElementById('theoryProgress').innerHTML=theoryLessons.map(()=>'<span class="jdot"></span>').join('');
  renderTheoryLesson(0); window.scrollTo(0,0); buzz();
}
function theoryHarpHTML(text){
  return `<div class="thy-harp"><div class="thy-harp-l"><span class="thy-harp-i">⇪</span> On your lever harp</div><p>${text}</p></div>`;
}
function theoryQuizHTML(quiz){
  const items=quiz.map((q,i)=>`<div class="thy-q">
    <p class="thy-q-q"><span class="thy-q-n">${i+1}</span>${q.q}</p>
    <button class="thy-q-rev" data-qi="${i}">Show answer</button>
    <p class="thy-q-a" hidden>${q.a}</p></div>`).join('');
  return `<div class="thy-quiz">${items}</div>`;
}
function renderTheoryLesson(dir){
  const L=theoryLessons[theoryLi], stage=document.getElementById('theoryStage'); if(!L||!stage) return;
  const ch=THEORY_COURSE[theorySem].chapters[theoryCh];
  let inner;
  if(L.quiz){
    inner = `${L.h?`<h2 class="learn-h">${L.h}</h2>`:''}
      <p class="thy-quiz-sub">Tap each question to reveal the answer.</p>
      ${theoryQuizHTML(L.quiz)}`;
  } else {
    const visual = L.visual==='keyboard' ? theoryKeyboardSVG() : '';
    const staff = L.staff ? `<div class="thy-visual"><div class="thy-staff" id="theoryStaff"></div></div>` : '';
    const action = L.action ? `<button class="jrn-cta" id="theoryAction">${L.action.label}</button>` : '';
    inner = `${L.h?`<h2 class="learn-h">${L.h}</h2>`:''}
      ${visual?`<div class="thy-visual">${visual}</div>`:''}
      ${staff}
      <p class="jrn-lead thy-body">${L.body}</p>
      ${L.harp?theoryHarpHTML(L.harp):''}
      ${action}`;
  }
  stage.innerHTML=`<div class="jrn-slide center thy-slide">
    <div class="thy-crumb">Ch ${ch.n} · ${ch.title}</div>
    ${inner}</div>`;
  const slide=stage.firstElementChild; if(slide){ slide.classList.add('jrn-in'); if(dir===1)slide.classList.add('from-right'); else if(dir===-1)slide.classList.add('from-left'); }
  if(L.staff) theoryRenderStaff(L.staff,'theoryStaff');
  try{ const k='t'+ch.n, d=JSON.parse(localStorage.getItem('soh-lessons')||'{}');
    d[k]={seen:Math.max((d[k]&&d[k].seen)||0, theoryLi+1), total:theoryLessons.length};
    localStorage.setItem('soh-lessons',JSON.stringify(d)); }catch(e){}
  document.querySelectorAll('#theoryProgress .jdot').forEach((d,i)=>d.classList.toggle('on',i===theoryLi));
  document.getElementById('theoryBack').textContent = theoryLi===0 ? '‹ Chapters' : '‹ Back';
  const more = theoryCh<THEORY_COURSE[theorySem].chapters.length-1 || theorySem<THEORY_COURSE.length-1;
  document.getElementById('theoryNext').textContent = theoryLi===theoryLessons.length-1 ? (more?'Next chapter ›':'Finish ✓') : 'Next ›';
  const act=document.getElementById('theoryAction'); if(act&&L.action) act.addEventListener('click',()=>showView(L.action.view));
  stage.querySelectorAll('.thy-q-rev').forEach(btn=>btn.addEventListener('click',()=>{
    const a=btn.parentElement.querySelector('.thy-q-a'); if(!a) return;
    const show=a.hidden; a.hidden=!show; btn.textContent=show?'Hide answer':'Show answer'; btn.classList.toggle('on',show); buzz();
  }));
}
function theoryRenderStaff(spec,mountId){
  try{
    const VF = window.VexFlow || window.Vex && window.Vex.Flow; const mount=document.getElementById(mountId);
    if(!VF || !mount) { if(mount) mount.style.display='none'; return; }
    const w=Math.min(360, Math.max(220, mount.clientWidth||300));
    const factory=new VF.Factory({ renderer:{ elementId:mountId, width:w, height:120 } });
    const score=factory.EasyScore(); const system=factory.System({ x:10, y:0, width:w-20 });
    const voice=score.voice(score.notes(spec.notes,{ clef:spec.clef||'treble' }));
    const stave=system.addStave({ voices:[voice] }).addClef(spec.clef||'treble');
    if(spec.key) stave.addKeySignature(spec.key);
    factory.draw();
    const svg=mount.querySelector('svg'); if(svg){ svg.removeAttribute('width'); svg.setAttribute('preserveAspectRatio','xMidYMid meet'); svg.style.maxWidth='100%'; svg.style.height='auto'; }
  }catch(e){ const mount=document.getElementById(mountId); if(mount) mount.style.display='none'; }
}
function theoryGo(d){
  if(d<0 && theoryLi===0){ theoryExit(); return; }
  if(d>0 && theoryLi===theoryLessons.length-1){
    let ui=theorySem, ci=theoryCh+1;
    if(ci>=THEORY_COURSE[ui].chapters.length){ ui++; ci=0; }
    if(ui<THEORY_COURSE.length) openTheoryChapter(ui,ci); else theoryExit();
    return;
  }
  theoryLi=Math.max(0,Math.min(theoryLessons.length-1,theoryLi+d)); renderTheoryLesson(d>0?1:-1); window.scrollTo(0,0); buzz();
}
function theoryExit(){ document.body.classList.remove('in-session');
  document.getElementById('theoryRun').hidden=true; document.getElementById('theoryHub').hidden=false; buildTheoryHub(); window.scrollTo(0,0); }
function theoryEnter(){ if(!_theoryBound){ _theoryBound=true;
    document.getElementById('theoryBack')?.addEventListener('click',()=>theoryGo(-1));
    document.getElementById('theoryNext')?.addEventListener('click',()=>theoryGo(1));
    document.getElementById('theoryExit')?.addEventListener('click',theoryExit);
    document.getElementById('theoryAsk')?.addEventListener('click',harpieOpenLesson);
    const wrap=document.getElementById('theoryStage'); if(wrap&&typeof addSwipe==='function') addSwipe(wrap,{onLeft:()=>theoryGo(1),onRight:()=>theoryGo(-1)});
  }
  document.getElementById('theoryRun').hidden=true; document.getElementById('theoryHub').hidden=false; buildTheoryHub();
}
function theoryLeave(){ document.body.classList.remove('in-session'); }
/* deep-link into the Music Theory course by chapter number */
function theoryOpenByChapter(n){
  if(typeof THEORY_COURSE==='undefined') return;
  for(let s=0;s<THEORY_COURSE.length;s++){ const ci=THEORY_COURSE[s].chapters.findIndex(c=>c.n===n); if(ci>=0){ showView('theory'); openTheoryChapter(s,ci); return; } }
}

/* ============================================================
   INTERACTIVE CIRCLE OF FIFTHS (theory.js data)
   ============================================================ */
let circleSel={pos:0,mode:'maj'}, _circleBound=false;
function buildCircle(){
  const host=document.getElementById('cofSvg'); if(!host || typeof CIRCLE_KEYS==='undefined') return;
  const intro=document.getElementById('cofIntro'); if(intro) intro.textContent=CIRCLE_INTRO;
  const cx=160, cy=160, rMaj=130, rMin=88;
  let nodes='';
  CIRCLE_KEYS.forEach(k=>{
    const ang=(-90 + k.pos*30)*Math.PI/180, c=Math.cos(ang), s=Math.sin(ang);
    const mx=cx+rMaj*c, my=cy+rMaj*s, ix=cx+rMin*c, iy=cy+rMin*s;
    const base = k.reach ? 'reach' : 'dim';
    nodes+=`<g class="cof-k ${base}${k.home?' home':''}" data-pos="${k.pos}" data-mode="maj"><circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="21"/><text x="${mx.toFixed(1)}" y="${my.toFixed(1)}">${k.maj}</text></g>`;
    nodes+=`<g class="cof-k min ${base}" data-pos="${k.pos}" data-mode="min"><circle cx="${ix.toFixed(1)}" cy="${iy.toFixed(1)}" r="15.5"/><text x="${ix.toFixed(1)}" y="${iy.toFixed(1)}">${k.min}</text></g>`;
  });
  host.innerHTML=`<svg viewBox="0 0 320 320" role="img" aria-label="Circle of fifths">
    <circle class="cof-ring" cx="160" cy="160" r="109"/>
    <text class="cof-center-t" x="160" y="152">CIRCLE</text>
    <text class="cof-center-s" x="160" y="172">of fifths</text>
    ${nodes}</svg>`;
  host.querySelectorAll('.cof-k').forEach(g=>g.addEventListener('click',()=>selectCircleKey(+g.dataset.pos,g.dataset.mode)));
  selectCircleKey(circleSel.pos, circleSel.mode);
}
function selectCircleKey(pos,mode){
  const k=CIRCLE_KEYS[pos]; if(!k) return; circleSel={pos,mode};
  document.querySelectorAll('#cofSvg .cof-k').forEach(g=>g.classList.toggle('on', +g.dataset.pos===pos && g.dataset.mode===mode));
  renderCirclePanel(k,mode); buzz();
}
function renderCirclePanel(k,mode){
  const panel=document.getElementById('cofPanel'); if(!panel) return;
  const isMin = mode==='min';
  const minName = k.min.slice(0,-1)+' minor';   // 'Am' → 'A minor'
  const name = isMin ? minName : k.maj+' major';
  const partnerLabel = isMin ? k.maj+' major' : minName;
  const major = CIRCLE_DIATONIC[k.maj]||[];
  const chords = isMin ? major.map((_,i)=>major[(i+5)%7]) : major;
  const rns = isMin ? CIRCLE_RN_MINOR : CIRCLE_RN_MAJOR;
  const enh = k.enh ? ` <span class="cof-enh">= ${k.enh} ${isMin?'minor':'major'}</span>` : '';
  const chips = chords.map((c,i)=>`<div class="cof-ch"><span class="cof-rn">${rns[i]}</span><span class="cof-cn">${c}</span></div>`).join('');
  const links = (typeof CIRCLE_LINKS!=='undefined'?CIRCLE_LINKS:[]).map(l=>`<button class="cof-link" data-ch="${l.n}">${l.label} ›</button>`).join('');
  const leverCls = k.reach ? 'cof-lever' : 'cof-lever off';
  const leverLabel = k.reach ? (k.home?'⌂ Home tuning':'⇪ On your E♭-tuned harp') : '⊘ Outside the E♭ range';
  panel.innerHTML=`
    <div class="cof-head">
      <div class="cof-name">${name}${enh}</div>
      <button class="cof-partner" id="cofPartner">↔ ${partnerLabel}</button>
    </div>
    <div class="cof-sig">${k.acc}</div>
    <div class="${leverCls}"><div class="cof-lever-l">${leverLabel}</div><p>${k.lever}</p></div>
    <div class="cof-sec-t">Diatonic chords${isMin?' (natural minor)':''}</div>
    <div class="cof-chords">${chips}</div>
    <div class="cof-actions">
      <button class="cof-cta" data-view="levers">Set your levers →</button>
      <button class="cof-cta ghost" data-view="scales">Build these chords →</button>
    </div>
    <div class="cof-sec-t">Relevant music theory</div>
    <div class="cof-links">${links}</div>`;
  const p=document.getElementById('cofPartner'); if(p) p.addEventListener('click',()=>selectCircleKey(k.pos, isMin?'maj':'min'));
  panel.querySelectorAll('.cof-cta').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
  panel.querySelectorAll('.cof-link').forEach(b=>b.addEventListener('click',()=>theoryOpenByChapter(+b.dataset.ch)));
}

/* ============================================================
   EAR TRAINING — recognise intervals & chords by ear (harp pluck synth)
   Reuses audioCtx() from audio.js.
   ============================================================ */
const ET_INTERVALS = [
  {semi:1,  name:'Minor 2nd',   tune:'like the “Jaws” theme'},
  {semi:2,  name:'Major 2nd',   tune:'“Happy Birth-day…”'},
  {semi:3,  name:'Minor 3rd',   tune:'“Greensleeves”'},
  {semi:4,  name:'Major 3rd',   tune:'“Do-Re-Mi” — “a female deer”'},
  {semi:5,  name:'Perfect 4th', tune:'“Here Comes the Bride”'},
  {semi:6,  name:'Tritone',     tune:'“Maria” / “The Simpsons”'},
  {semi:7,  name:'Perfect 5th', tune:'“Twinkle, Twinkle…”'},
  {semi:9,  name:'Major 6th',   tune:'“My Bonnie Lies Over the Ocean”'},
  {semi:12, name:'Octave',      tune:'“Some-where…” (Over the Rainbow)'},
];
const ET_CHORDS = [
  {semis:[0,4,7], name:'Major',      tune:'bright, settled'},
  {semis:[0,3,7], name:'Minor',      tune:'soft, wistful'},
  {semis:[0,3,6], name:'Diminished', tune:'tense, unstable'},
  {semis:[0,4,8], name:'Augmented',  tune:'dreamy, suspended'},
];
let etMode='interval', etList=ET_INTERVALS, etCur=0, etRoot=60, etRight=0, etTotal=0, etAnswered=false, etPlayed=false, _etBound=false;
function etMidiFreq(m){ return 440*Math.pow(2,(m-69)/12); }
function harpPluck(freq, when, dur){
  const ac=audioCtx(), t=when||ac.currentTime; dur=dur||1.6;
  const g=ac.createGain(); g.connect(ac.destination);
  g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(0.5,t+0.012);
  g.gain.exponentialRampToValueAtTime(0.0006,t+dur);
  [[1,1],[2,0.30],[3,0.12]].forEach(([mult,amp])=>{
    const o=ac.createOscillator(); o.type='triangle'; o.frequency.value=freq*mult;
    const og=ac.createGain(); og.gain.value=amp; o.connect(og); og.connect(g);
    o.start(t); o.stop(t+dur+0.05);
  });
}
function etPlay(){
  const ac=audioCtx(), now=ac.currentTime+0.06, it=etList[etCur];
  if(etMode==='interval'){
    harpPluck(etMidiFreq(etRoot), now, 1.1);
    harpPluck(etMidiFreq(etRoot+it.semi), now+0.62, 1.6);
  } else {
    it.semis.forEach((s,i)=>harpPluck(etMidiFreq(etRoot+s), now+i*0.09, 1.8));
  }
  etPlayed=true; const rp=document.getElementById('etReplay'); if(rp) rp.hidden=false;
}
function etNewQuestion(){
  etList = etMode==='interval'?ET_INTERVALS:ET_CHORDS;
  etCur = Math.floor(Math.random()*etList.length);
  etRoot = 55 + Math.floor(Math.random()*10);     // G3..E4, a comfortable range
  etAnswered=false; etPlayed=false;
  etBuildGrid();
  const fb=document.getElementById('etFeedback'); if(fb){ fb.textContent=''; fb.className='et-feedback reveal in'; }
  const nx=document.getElementById('etNext'); if(nx) nx.hidden=true;
  const rp=document.getElementById('etReplay'); if(rp) rp.hidden=true;
  const pl=document.getElementById('etPlayLabel'); if(pl) pl.textContent = etMode==='interval'?'Play interval':'Play chord';
}
function etBuildGrid(){
  const grid=document.getElementById('etGrid'); if(!grid) return;
  grid.innerHTML = etList.map((o,i)=>`<button class="et-opt" data-idx="${i}">${o.name}</button>`).join('');
  grid.querySelectorAll('.et-opt').forEach(b=>b.addEventListener('click',()=>etAnswer(+b.dataset.idx)));
}
function etAnswer(idx){
  if(etAnswered) return;
  if(!etPlayed) etPlay();                          // make sure they've heard it at least once
  etAnswered=true; etTotal++;
  const correct = etCur, ok = idx===correct, it=etList[etCur];
  if(ok) etRight++;
  document.querySelectorAll('#etGrid .et-opt').forEach((b,i)=>{
    if(i===correct) b.classList.add('right');
    else if(i===idx) b.classList.add('wrong');
    b.disabled=true;
  });
  const fb=document.getElementById('etFeedback');
  if(fb){ fb.className='et-feedback reveal in '+(ok?'good':'bad');
    fb.innerHTML = `${ok?'✓ Correct — ':'✗ It was '}<b>${it.name}</b><span class="et-tune">${it.tune}</span>`; }
  const sc=document.getElementById('etScore'); if(sc) sc.textContent=`Score ${etRight} / ${etTotal}`;
  const nx=document.getElementById('etNext'); if(nx) nx.hidden=false;
  buzz();
}
function etSetMode(mode){
  if(mode===etMode) return; etMode=mode;
  document.querySelectorAll('.et-tab').forEach(t=>t.classList.toggle('on', t.dataset.etmode===mode));
  etNewQuestion();
}
function etEnter(){
  if(!_etBound){ _etBound=true;
    document.getElementById('etPlay')?.addEventListener('click',etPlay);
    document.getElementById('etReplay')?.addEventListener('click',etPlay);
    document.getElementById('etNext')?.addEventListener('click',etNewQuestion);
    document.querySelectorAll('.et-tab').forEach(t=>t.addEventListener('click',()=>etSetMode(t.dataset.etmode)));
  }
  etNewQuestion();
}

/* ============================================================
   JACOB'S UNIVERSE — harmony the Jacob Collier way (jacob.js data)
   ============================================================ */
let _jacobBound=false;
function buildJacob(){
  const host=document.getElementById('jacobModules'); if(!host || typeof JACOB_MODULES==='undefined') return;
  host.innerHTML='';
  JACOB_MODULES.forEach(m=>{
    const b=document.createElement('button'); b.className='ju-card'+(m.toy?' toy':'');
    const hasL=m.lessons&&m.lessons.length, pr=hasL?jacobModuleProg(m.n):null;
    const tag = hasL
      ? (pr&&pr.done?'<span class="ju-done">✓</span>':(pr?`<span class="ju-prog">${pr.seen}/${pr.total}</span>`:'<span class="ju-toy-tag">study</span>'))
      : (m.toy?'<span class="ju-toy-tag">▶ play</span>':(jacobSeen(m.n)?'<span class="ju-done">✓</span>':''));
    b.innerHTML=`<span class="nxc-art">${sohArt('c1',m.n)}</span><span class="nxc-scrim"></span>
      <div class="ju-card-top"><span class="ju-n">${m.n}</span><span class="ju-kick">${m.kicker||''}</span>${tag}</div>
      <div class="ju-card-t">${m.title}</div>`;
    b.addEventListener('click',()=>jacobOpenModule(m.n));
    host.appendChild(b);
  });
  const lib=document.getElementById('jacobLibrary'); if(lib) lib.innerHTML=jacobLibraryHTML();
  const cr=document.getElementById('jacobCredit'); if(cr) cr.textContent=(typeof JACOB_SOURCE!=='undefined')?JACOB_SOURCE:'';
  document.getElementById('jacobHub').hidden=false; document.getElementById('jacobDetail').hidden=true;
  triggerReveals(document.getElementById('view-jacob'));
}
const JU_KIND={ watch:{i:'▶',t:'Watch'}, read:{i:'❧',t:'Read'}, book:{i:'❦',t:'Read'}, tool:{i:'✦',t:'Try'} };
function jacobResHTML(list){
  return `<div class="ju-res-list">${list.map(r=>{ const k=JU_KIND[r.k]||JU_KIND.read;
    return `<a class="ju-res" href="${r.url}" target="_blank" rel="noopener noreferrer">
      <span class="ju-res-k k-${r.k}"><span class="ju-res-i">${k.i}</span>${k.t}</span>
      <span class="ju-res-main"><span class="ju-res-t">${r.label}</span><span class="ju-res-by">${r.by}</span></span>
      <span class="ju-res-go">↗</span></a>`; }).join('')}</div>`;
}
function jacobLibraryHTML(){
  if(typeof JACOB_LIBRARY==='undefined') return '';
  const groups=JACOB_LIBRARY.groups.map(g=>`<div class="ju-lib-g"><div class="ju-lib-gt">${g.t}</div>${jacobResHTML(g.items)}</div>`).join('');
  return `<div class="ju-lib"><div class="ju-lib-h"><span class="ju-lib-kick">Deeper study</span>
    <div class="ju-lib-title">The library behind the universe</div>
    <p class="ju-lib-intro">${JACOB_LIBRARY.intro}</p></div>${groups}</div>`;
}
/* --- shared render helpers (used by single-page & stepped modules) --- */
function jacobHarpHTML(t){ return `<div class="thy-harp"><div class="thy-harp-l"><span class="thy-harp-i">⇪</span> On your lever harp</div><p>${t}</p></div>`; }
function jacobToyHTML(m){ return m.toy==='oneNote'?jacobOneNoteHTML():m.toy==='mirror'?jacobMirrorHTML():m.toy==='arrivals'?jacobArrivalsHTML():m.toy==='reharm'?jacobReharmHTML():''; }
function jacobBindToy(m){ if(m.toy==='oneNote') jacobBindOneNote(); else if(m.toy==='mirror') jacobBindMirror(); else if(m.toy==='arrivals') jacobBindArrivals(); else if(m.toy==='reharm') jacobBindReharm(); }
function jacobLinksHTML(m){ const links=(m.links||[]).map(l=>`<a class="ju-link" href="${l.url}" target="_blank" rel="noopener noreferrer">▶ ${l.label}</a>`).join('');
  return links?`<div class="ju-sec-t">Watch Jacob</div><div class="ju-links">${links}</div>`:''; }
function jacobDeeperHTML(m){ return (typeof JACOB_DEEPER!=='undefined'&&JACOB_DEEPER[m.n])?`<div class="ju-sec-t">Go deeper</div>${jacobResHTML(JACOB_DEEPER[m.n])}`:''; }
function jacobModuleMark(n){ try{ const d=JSON.parse(localStorage.getItem('soh-lessons')||'{}'), i=Math.max(1,(_juStep||0)+1);
    const k='j'+n, cur=(d[k]&&d[k].seen)||0; d[k]={seen:Math.max(cur,i), total:(_juSteps?_juSteps.length:1)};
    localStorage.setItem('soh-lessons',JSON.stringify(d)); }catch(e){} }
function jacobModuleProg(n){ try{ const d=JSON.parse(localStorage.getItem('soh-lessons')||'{}')['j'+n]; return d?{seen:d.seen,total:d.total,done:d.seen>=d.total}:null; }catch(e){ return null; } }
function jacobNextStudyModule(){ try{ const d=JSON.parse(localStorage.getItem('soh-lessons')||'{}');
    return (typeof JACOB_MODULES!=='undefined'?JACOB_MODULES:[]).find(m=>m.lessons&&m.lessons.length && !(d['j'+m.n]&&d['j'+m.n].seen>=d['j'+m.n].total)) || null; }catch(e){ return null; } }

let _juMod=null, _juSteps=null, _juStep=0;
function jacobOpenModule(n){
  const m=JACOB_MODULES.find(x=>x.n===n); const stage=document.getElementById('jacobStage'); if(!m||!stage) return;
  if(typeof sohProgressSave==='function') sohProgressSave('jacob',{n:n});
  try{ const v=new Set(JSON.parse(localStorage.getItem('soh-jacob-seen')||'[]')); v.add(n); localStorage.setItem('soh-jacob-seen',JSON.stringify([...v])); }catch(e){}
  document.getElementById('jacobHub').hidden=true; document.getElementById('jacobDetail').hidden=false;
  if(m.lessons && m.lessons.length){
    _juMod=m; _juSteps=[{kind:'intro'}].concat(m.lessons.map(L=>({kind:'lesson',L}))).concat([{kind:'practice'}]); _juStep=0;
    jacobRenderStep(0);
  } else { _juMod=null; _juSteps=null; jacobRenderSingle(m); }
  window.scrollTo(0,0); buzz();
}
function jacobRenderSingle(m){
  const stage=document.getElementById('jacobStage'); if(!stage) return;
  stage.innerHTML=`<div class="ju-slide jrn-in">
    <div class="ju-crumb">${m.kicker||'Module '+m.n}</div>
    <h2 class="learn-h">${m.title}</h2>
    <p class="jrn-lead ju-idea">${m.idea}</p>
    ${jacobHarpHTML(m.harp)}
    ${m.note?`<div class="ju-note"><span class="ju-note-k">Roots</span> ${m.note}</div>`:''}
    ${jacobToyHTML(m)}
    ${jacobLinksHTML(m)}
    ${jacobDeeperHTML(m)}
    ${jacobQuizHTML(m.n)}
  </div>`;
  jacobBindToy(m); jacobBindQuiz();
}
function jacobRenderStep(i){
  const m=_juMod, stage=document.getElementById('jacobStage'); if(!m||!stage||!_juSteps) return;
  _juStep=Math.max(0,Math.min(_juSteps.length-1,i)); const N=_juSteps.length, s=_juSteps[_juStep];
  const dots=_juSteps.map((_,k)=>`<span class="jdot${k===_juStep?' on':''}${k<_juStep?' seen':''}"></span>`).join('');
  let body='';
  if(s.kind==='intro'){
    body=`<h2 class="learn-h">${m.title}</h2><p class="jrn-lead ju-idea">${m.idea}</p>${jacobHarpHTML(m.harp)}${m.note?`<div class="ju-note"><span class="ju-note-k">Roots</span> ${m.note}</div>`:''}`;
  } else if(s.kind==='lesson'){
    const L=s.L;
    body=`<div class="ju-step-k">${L.kick||'Learn'}</div><h2 class="learn-h">${L.h}</h2><p class="jrn-lead ju-idea">${L.body}</p>${L.harp?jacobHarpHTML(L.harp):''}`;
  } else {
    body=`<div class="ju-step-k">Practice &amp; explore</div><h2 class="learn-h">Put it under your hands</h2>${jacobToyHTML(m)}${jacobLinksHTML(m)}${jacobDeeperHTML(m)}${jacobQuizHTML(m.n)}`;
  }
  stage.innerHTML=`<div class="ju-slide jrn-in">
    <div class="ju-crumb">${m.kicker||'Module '+m.n} · step ${_juStep+1} of ${N}</div>
    <div class="ju-dots">${dots}</div>
    ${body}
    <div class="ju-nav">
      <button class="jrn-btn ghost" id="juPrev">${_juStep===0?'‹ All modules':'‹ Back'}</button>
      <button class="jrn-btn" id="juNext">${_juStep===N-1?'Finish ✓':'Next ›'}</button>
    </div>
  </div>`;
  if(s.kind==='practice'){ jacobBindToy(m); jacobBindQuiz(); }
  jacobModuleMark(m.n);
  document.getElementById('juPrev').addEventListener('click',()=>jacobStepGo(-1));
  document.getElementById('juNext').addEventListener('click',()=>jacobStepGo(1));
  window.scrollTo(0,0); buzz();
}
function jacobStepGo(d){
  if(!_juSteps) return;
  if(d<0 && _juStep===0){ jacobBack(); return; }
  if(d>0 && _juStep===_juSteps.length-1){ jacobModuleMark(_juMod.n); jacobBack(); return; }
  jacobRenderStep(_juStep+d);
}
/* --- Toy: Arrivals — same chord, different approach (GRAMMY U) --- */
function jacobArrivalsHTML(){
  const pads=JU_ARRIVALS.pads.map((p,i)=>`<button class="ju-chord" data-i="${i}">${p.label}</button>`).join('');
  return `<div class="ju-toy">
    <div class="ju-held"><span class="ju-held-k">Where you arrive from</span><span class="ju-held-n">☀ ↔ ☁</span><span class="ju-held-s">the same chord, two different lights</span></div>
    <div class="ju-pads">${pads}</div>
    <div class="ju-readout" id="juArrOut"><span class="ju-feel">Tap an arrival →</span><span class="ju-role">hear the approach chord lead into it.</span></div>
  </div>`;
}
function jacobBindArrivals(){
  const stage=document.getElementById('jacobStage'); if(!stage) return;
  stage.querySelectorAll('.ju-chord').forEach(b=>b.addEventListener('click',()=>{
    const i=+b.dataset.i, p=JU_ARRIVALS.pads[i];
    stage.querySelectorAll('.ju-chord').forEach(x=>x.classList.toggle('on',x===b));
    if(typeof audioCtx==='function'){ const ac=audioCtx(), t0=ac.currentTime+0.05;
      p.a.forEach((mm,k)=>harpPluck(etMidiFreq(mm), t0+k*0.09, 1.5));
      p.b.forEach((mm,k)=>harpPluck(etMidiFreq(mm), t0+1.35+k*0.09, 2.4)); }
    const r=document.getElementById('juArrOut'); if(r) r.innerHTML=`<span class="ju-feel">${p.feel}</span><span class="ju-role">${p.name} — ${p.role}</span>`;
    buzz();
  }));
}
/* --- Toy: Reharm Lab — Amazing Grace in three escalating colours --- */
let _juReharmLevel=0;
function jacobReharmHTML(){
  const tabs=JU_REHARM.levels.map((l,i)=>`<button class="ju-rh-tab${i===0?' on':''}" data-i="${i}">${l.label.split(' · ')[0]}</button>`).join('');
  return `<div class="ju-toy">
    <div class="ju-held"><span class="ju-held-k">Reharm Lab</span><span class="ju-held-n">Amazing Grace</span><span class="ju-held-s">${JU_REHARM.melody}</span></div>
    <div class="ju-rh-tabs">${tabs}</div>
    <div class="ju-readout" id="juRhOut"></div>
    <button class="ju-rh-play" id="juRhPlay">▶ Play this version</button>
  </div>`;
}
function jacobReharmRender(){
  const l=JU_REHARM.levels[_juReharmLevel], r=document.getElementById('juRhOut');
  if(r) r.innerHTML=`<span class="ju-feel">${l.label}</span><span class="ju-role">${l.desc}</span>`;
  document.querySelectorAll('#jacobStage .ju-rh-tab').forEach((t,i)=>t.classList.toggle('on',i===_juReharmLevel));
}
function jacobPlayReharm(){
  const l=JU_REHARM.levels[_juReharmLevel]; if(!l||typeof audioCtx!=='function') return;
  const ac=audioCtx(); let t=ac.currentTime+0.06;
  l.steps.forEach(s=>{ s.ch.forEach((mm,k)=>harpPluck(etMidiFreq(mm), t+k*0.05, 1.5));
    harpPluck(etMidiFreq(s.mel), t+0.02, 1.7); t+=0.82; });
}
function jacobBindReharm(){
  _juReharmLevel=0; jacobReharmRender();
  const stage=document.getElementById('jacobStage'); if(!stage) return;
  stage.querySelectorAll('.ju-rh-tab').forEach(t=>t.addEventListener('click',()=>{ _juReharmLevel=+t.dataset.i; jacobReharmRender(); jacobPlayReharm(); buzz(); }));
  document.getElementById('juRhPlay')?.addEventListener('click',()=>{ jacobPlayReharm(); buzz(); });
}
/* --- Check-your-understanding, per module --- */
function jacobQuizHTML(n){
  const qs=(typeof JACOB_QUIZ!=='undefined')?JACOB_QUIZ[n]:null; if(!qs||!qs.length) return '';
  return `<div class="ju-sec-t">Check your understanding</div><div class="thy-quiz">${qs.map((q,i)=>`
    <div class="thy-q"><p class="thy-q-q"><span class="thy-q-n">${i+1}</span>${q.q}</p>
    <button class="thy-q-rev" data-jq="${i}">Show answer</button>
    <p class="thy-q-a" hidden>${q.a}</p></div>`).join('')}</div>`;
}
function jacobBindQuiz(){
  document.querySelectorAll('#jacobStage .thy-q-rev').forEach(b=>b.addEventListener('click',()=>{
    const a=b.parentElement.querySelector('.thy-q-a'); if(!a) return;
    const show=a.hidden; a.hidden=!show; b.textContent=show?'Hide answer':'Show answer'; b.classList.toggle('on',show); buzz();
  }));
}
/* --- Toy: Negative-Harmony Mirror (June Lee Pt 1 spec) --- */
function jacobMirrorHTML(){
  const pads=JU_MIRROR.pads.map((p,i)=>`<button class="ju-chord" data-i="${i}">${p.label}</button>`).join('');
  return `<div class="ju-toy">
    <div class="ju-held"><span class="ju-held-k">The mirror</span><span class="ju-held-n">C ↔ G</span><span class="ju-held-s">${JU_MIRROR.axis}</span></div>
    <div class="ju-pads">${pads}</div>
    <div class="ju-readout" id="juMirrorOut"><span class="ju-feel">Tap a cadence →</span><span class="ju-role">hear the chord, then its reflection.</span></div>
  </div>`;
}
function jacobPlayMirror(i){
  const p=JU_MIRROR.pads[i]; if(!p || typeof audioCtx!=='function') return;
  const ac=audioCtx(), t0=ac.currentTime+0.05;
  p.o.forEach((m,k)=>harpPluck(etMidiFreq(m), t0+k*0.09, 1.5));
  p.m.forEach((m,k)=>harpPluck(etMidiFreq(m), t0+1.35+k*0.09, 2.4));
}
function jacobBindMirror(){
  const stage=document.getElementById('jacobStage'); if(!stage) return;
  stage.querySelectorAll('.ju-chord').forEach(b=>b.addEventListener('click',()=>{
    const i=+b.dataset.i, p=JU_MIRROR.pads[i];
    stage.querySelectorAll('.ju-chord').forEach(x=>x.classList.toggle('on',x===b));
    jacobPlayMirror(i);
    const r=document.getElementById('juMirrorOut'); if(r) r.innerHTML=`<span class="ju-feel">${p.name}</span><span class="ju-role">${p.feel}</span>`;
    buzz();
  }));
}
function jacobBack(){ document.getElementById('jacobDetail').hidden=true; document.getElementById('jacobHub').hidden=false; window.scrollTo(0,0); }
/* --- Toy: One Note, Many Chords --- */
function jacobOneNoteHTML(){
  const h=JU_ONE_NOTE.held;
  const pads=JU_ONE_NOTE.chords.map((c,i)=>`<button class="ju-chord" data-i="${i}">${c.name}</button>`).join('');
  return `<div class="ju-toy">
    <div class="ju-held"><span class="ju-held-k">Hold this note</span><span class="ju-held-n">${h.name}</span><span class="ju-held-s">it never changes — only the chord beneath it does</span></div>
    <div class="ju-pads">${pads}</div>
    <div class="ju-readout" id="juReadout"><span class="ju-feel">Tap a chord →</span><span class="ju-role">hear how the same ${h.name} changes colour.</span></div>
  </div>`;
}
function jacobPlayOneNote(i){
  const c=JU_ONE_NOTE.chords[i]; if(!c || typeof audioCtx!=='function') return;
  const ac=audioCtx(), now=ac.currentTime+0.05;
  c.notes.forEach((m,k)=>harpPluck(etMidiFreq(m), now+k*0.085, 2.2));   // chord rolled beneath
  harpPluck(etMidiFreq(JU_ONE_NOTE.held.midi), now+0.02, 2.9);          // held note on top, sustained
}
function jacobBindOneNote(){
  const stage=document.getElementById('jacobStage'); if(!stage) return;
  stage.querySelectorAll('.ju-chord').forEach(b=>b.addEventListener('click',()=>{
    const i=+b.dataset.i, c=JU_ONE_NOTE.chords[i];
    stage.querySelectorAll('.ju-chord').forEach(x=>x.classList.toggle('on',x===b));
    jacobPlayOneNote(i);
    const r=document.getElementById('juReadout'); if(r) r.innerHTML=`<span class="ju-feel">${c.feel}</span><span class="ju-role">${c.role}</span>`;
    buzz();
  }));
}
function jacobEnter(){
  if(!_jacobBound){ _jacobBound=true; document.getElementById('jacobBack')?.addEventListener('click',jacobBack); }
  buildJacob();
}

/* ============================================================
   FACE JERUSALEM — compass to the Temple Mount
   ============================================================ */
const JERUSALEM={lat:31.778, lon:35.2354};
let compassBearing=null, compassHeading=0, compassDist=null, compassOriented=false, compassBound=false;
function bearingTo(lat1,lon1,lat2,lon2){
  const φ1=lat1*Math.PI/180, φ2=lat2*Math.PI/180, Δλ=(lon2-lon1)*Math.PI/180;
  const y=Math.sin(Δλ)*Math.cos(φ2), x=Math.cos(φ1)*Math.sin(φ2)-Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
  return (Math.atan2(y,x)*180/Math.PI+360)%360;
}
function distanceKm(lat1,lon1,lat2,lon2){
  const R=6371, dφ=(lat2-lat1)*Math.PI/180, dλ=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dφ/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dλ/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
}
function compassRender(){
  const needle=document.getElementById('compassNeedle'), info=document.getElementById('compassInfo');
  if(compassBearing==null) return;
  if(needle) needle.style.transform=`translate(-50%,-100%) rotate(${compassBearing-compassHeading}deg)`;
  const dir = compassOriented ? 'follow the needle' : `${Math.round(compassBearing)}° from North — align the top of your phone to North`;
  if(info) info.innerHTML=`<b>${Math.round(compassDist).toLocaleString()} km</b> to Jerusalem · ${dir}`;
}
function compassOnOrient(e){
  let h=null;
  if(typeof e.webkitCompassHeading==='number') h=e.webkitCompassHeading;
  else if(typeof e.alpha==='number') h=360-e.alpha;
  if(h!=null && !isNaN(h)){ compassHeading=h; compassOriented=true; compassRender(); }
}
async function compassStart(){
  const info=document.getElementById('compassInfo');
  if(!navigator.geolocation){ if(info) info.textContent='Location isn’t available on this device.'; return; }
  if(info) info.textContent='Finding your place under heaven…';
  navigator.geolocation.getCurrentPosition(pos=>{
    compassBearing=bearingTo(pos.coords.latitude,pos.coords.longitude,JERUSALEM.lat,JERUSALEM.lon);
    compassDist=distanceKm(pos.coords.latitude,pos.coords.longitude,JERUSALEM.lat,JERUSALEM.lon);
    compassRender();
  }, ()=>{ if(info) info.textContent='Couldn’t reach your location — please allow access and try again.'; }, {enableHighAccuracy:true, timeout:12000});
  try{
    if(typeof DeviceOrientationEvent!=='undefined' && typeof DeviceOrientationEvent.requestPermission==='function'){
      const p=await DeviceOrientationEvent.requestPermission();
      if(p==='granted' && !compassBound){ window.addEventListener('deviceorientation', compassOnOrient, true); compassBound=true; }
    } else if(!compassBound){
      window.addEventListener('deviceorientationabsolute', compassOnOrient, true);
      window.addEventListener('deviceorientation', compassOnOrient, true);
      compassBound=true;
    }
  }catch(e){}
}
function initCompass(){ document.getElementById('compassBtn')?.addEventListener('click',()=>{ compassStart(); buzz(); }); }

/* ============================================================
   ROUTING
   ============================================================ */
function revealNow(root){ if(!root) return; let i=0; root.querySelectorAll('.reveal:not(.in)').forEach(el=>{ el.style.animationDelay=(Math.min(i,8)*0.05)+'s'; el.classList.add('in'); try{ io.unobserve(el); }catch(e){} i++; }); }
/* ============================================================
   SHAMAYIM HARP — the five-worlds contemplative journey
   ============================================================ */
function shyArt(n){
  let s=(n*2654435761)>>>0; const rnd=()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; };
  const g='shy'+n;
  let stars=''; for(let i=0;i<16;i++){ const x=(rnd()*100).toFixed(1), y=(rnd()*70).toFixed(1), r=(0.3+rnd()*1.1).toFixed(2), o=(0.4+rnd()*0.6).toFixed(2);
    stars+=`<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${o}"/>`; }
  let strings=''; for(let i=0;i<5;i++){ const x=(20+i*15+rnd()*4).toFixed(1); strings+=`<line x1="${x}" y1="34" x2="${(x*1+6).toFixed(1)}" y2="100" stroke="url(#gs${g})" stroke-width="0.5" opacity="0.5"/>`; }
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${g}" cx="70%" cy="18%" r="90%">
        <stop offset="0%" stop-color="#3a4d7a"/><stop offset="42%" stop-color="#1a2140"/><stop offset="100%" stop-color="#0a0a18"/>
      </radialGradient>
      <linearGradient id="gs${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e2b65c" stop-opacity="0.9"/><stop offset="100%" stop-color="#e2b65c" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#${g})"/>${stars}
    <circle cx="72" cy="16" r="9" fill="#f3ead6" opacity="0.16"/><circle cx="72" cy="16" r="4.5" fill="#f6ecd4" opacity="0.5"/>
    ${strings}</svg>`;
}
let _shyBound=false, _shyN=0;
function shamayimSeen(n){ try{ return JSON.parse(localStorage.getItem('soh-shamayim-seen')||'[]').includes(n); }catch(e){ return false; } }
function shamayimMarkSeen(n){ try{ const v=new Set(JSON.parse(localStorage.getItem('soh-shamayim-seen')||'[]')); v.add(n); localStorage.setItem('soh-shamayim-seen',JSON.stringify([...v])); }catch(e){} }
function shyLibraryHTML(){
  if(typeof SHAMAYIM_SOURCES==='undefined') return '';
  const groups=SHAMAYIM_SOURCES.groups.map(g=>`<div class="ju-lib-g"><div class="ju-lib-gt">${g.t}</div>${jacobResHTML(g.items)}</div>`).join('');
  return `<div class="ju-lib"><div class="ju-lib-h"><span class="ju-lib-kick">Foundations</span>
    <div class="ju-lib-title">The ground beneath the journey</div>
    <p class="ju-lib-intro">${SHAMAYIM_SOURCES.intro}</p></div>${groups}</div>`;
}
function buildShamayim(){
  const host=document.getElementById('shamayimLevels'); if(!host || typeof SHAMAYIM_LEVELS==='undefined') return;
  const lead=document.getElementById('shamayimLead'); if(lead&&typeof SHAMAYIM_INTRO!=='undefined') lead.innerHTML=SHAMAYIM_INTRO.lead;
  host.innerHTML='';
  SHAMAYIM_LEVELS.forEach(lv=>{ const b=document.createElement('button'); b.className='shy-card';
    b.innerHTML=`<span class="shy-card-art">${shyArt(lv.n)}</span><span class="shy-card-scrim"></span>
      <div class="shy-card-top"><span class="shy-card-n">${lv.n}</span><span class="shy-card-kick">${lv.kicker||''}</span>${shamayimSeen(lv.n)?'<span class="shy-done">✦</span>':''}</div>
      <div class="shy-card-heb">${lv.heb}</div>
      <div class="shy-card-t">${lv.tr}</div>
      <div class="shy-card-w">${lv.world}</div>`;
    b.addEventListener('click',()=>shamayimOpenLevel(lv.n)); host.appendChild(b); });
  const lib=document.getElementById('shamayimSources'); if(lib) lib.innerHTML=shyLibraryHTML();
  const cr=document.getElementById('shamayimCredit'); if(cr) cr.textContent=(typeof SHAMAYIM_SOURCE!=='undefined')?SHAMAYIM_SOURCE:'';
  if(!_shyBound){ _shyBound=true; document.getElementById('shamayimBack')?.addEventListener('click',shamayimBack); }
  document.getElementById('shamayimHub').hidden=false; document.getElementById('shamayimDetail').hidden=true;
  triggerReveals(document.getElementById('view-shamayim'));
}
function shyBlockHTML(b){
  if(b.k==='lead') return `<p class="shy-lead-big">${b.text}</p>`;
  if(b.k==='prose') return `<p class="shy-prose">${b.text}</p>`;
  if(b.k==='resonance') return `<p class="shy-resonance">${b.text}</p>`;
  if(b.k==='scripture') return `<div class="shy-verse">${b.heb?`<div class="shy-verse-heb">${b.heb}</div>`:''}<p class="shy-verse-en">${b.text}</p><div class="shy-verse-ref">${b.ref}</div></div>`;
  if(b.k==='science') return `<div class="shy-card2 shy-science"><div class="shy-card-k"><span class="shy-card-i">✦</span>${b.h}</div><p>${b.text}</p>${b.src?`<div class="shy-card-src">${b.src}</div>`:''}</div>`;
  if(b.k==='tradition') return `<div class="shy-card2 shy-tradition"><div class="shy-card-k"><span class="shy-card-i">✡</span>${b.h}</div><p>${b.text}</p></div>`;
  if(b.k==='quote') return `<blockquote class="shy-quote">${b.text}${b.by?`<cite>— ${b.by}</cite>`:''}</blockquote>`;
  return '';
}
function shamayimOpenLevel(n){
  const lv=SHAMAYIM_LEVELS.find(x=>x.n===n); const stage=document.getElementById('shamayimStage'); if(!lv||!stage) return;
  _shyN=n; shamayimMarkSeen(n); if(typeof sohProgressSave==='function') try{ sohProgressSave('shamayim',{n:n}); }catch(e){}
  const N=SHAMAYIM_LEVELS.length;
  const blocks=lv.blocks.map(shyBlockHTML).join('');
  stage.innerHTML=`<div class="shy-slide jrn-in">
    <div class="shy-hero">${shyArt(n)}<div class="shy-hero-scrim"></div>
      <div class="shy-hero-txt"><div class="shy-hero-heb">${lv.heb}</div><div class="shy-hero-tr">${lv.tr}</div><div class="shy-hero-w">${lv.world}</div></div></div>
    <div class="shy-body">
      <div class="shy-sub2">${lv.sub}</div>
      ${blocks}
      <div class="shy-nav">
        <button class="jrn-btn ghost" id="shyPrev">${n===1?'‹ The five worlds':'‹ '+SHAMAYIM_LEVELS[n-2].tr}</button>
        <button class="jrn-btn" id="shyNext">${n===N?'Complete ✦':SHAMAYIM_LEVELS[n].tr+' ›'}</button>
      </div>
    </div>
  </div>`;
  document.getElementById('shamayimHub').hidden=true; document.getElementById('shamayimDetail').hidden=false;
  document.getElementById('shyPrev').addEventListener('click',()=>{ if(n===1) shamayimBack(); else shamayimOpenLevel(n-1); });
  document.getElementById('shyNext').addEventListener('click',()=>{ if(n===N) shamayimBack(); else shamayimOpenLevel(n+1); });
  window.scrollTo(0,0); buzz();
}
function shamayimBack(){ document.getElementById('shamayimDetail').hidden=true; document.getElementById('shamayimHub').hidden=false; buildShamayim(); window.scrollTo(0,0); }

/* ============================================================
   CHEN — Musical Symmetry & Grace (Ariel Cohen Alloro)
   ============================================================ */
function chenArt(n){
  const g='chn'+n, hue=n%2?'#2a1c0c':'#241a10';
  let chev=''; for(let i=0;i<6;i++){ const y=18+i*14, o=(0.55-i*0.06).toFixed(2);
    chev+=`<path d="M50 ${y} L30 ${y+9} M50 ${y} L70 ${y+9}" stroke="#e2b65c" stroke-width="0.7" opacity="${o}" fill="none"/>`; }
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="${g}" cx="50%" cy="42%" r="75%"><stop offset="0%" stop-color="#4a361a"/><stop offset="55%" stop-color="${hue}"/><stop offset="100%" stop-color="#140d05"/></radialGradient></defs>
    <rect width="100" height="100" fill="url(#${g})"/>
    <line x1="50" y1="6" x2="50" y2="94" stroke="#e2b65c" stroke-width="0.5" opacity="0.5"/>${chev}
    <circle cx="50" cy="50" r="3" fill="#f6ecd4" opacity="0.5"/></svg>`;
}
let _chenBound=false;
function chenSeen(n){ try{ return JSON.parse(localStorage.getItem('soh-chen-seen')||'[]').includes(n); }catch(e){ return false; } }
function chenMarkSeen(n){ try{ const v=new Set(JSON.parse(localStorage.getItem('soh-chen-seen')||'[]')); v.add(n); localStorage.setItem('soh-chen-seen',JSON.stringify([...v])); }catch(e){} }
function chenLibraryHTML(){
  if(typeof CHEN_SOURCES==='undefined') return '';
  const groups=CHEN_SOURCES.groups.map(g=>`<div class="ju-lib-g"><div class="ju-lib-gt">${g.t}</div>${jacobResHTML(g.items)}</div>`).join('');
  return `<div class="ju-lib"><div class="ju-lib-h"><span class="ju-lib-kick">Sources</span>
    <div class="ju-lib-title">Where this comes from</div><p class="ju-lib-intro">${CHEN_SOURCES.intro}</p></div>${groups}</div>`;
}
function buildChen(){
  const host=document.getElementById('chenModules'); if(!host || typeof CHEN_MODULES==='undefined') return;
  if(typeof CHEN_INTRO!=='undefined'){ const t=document.getElementById('chenTeacher'), l=document.getElementById('chenLead');
    if(t) t.textContent=CHEN_INTRO.teacher; if(l) l.innerHTML=CHEN_INTRO.lead; }
  host.innerHTML='';
  CHEN_MODULES.forEach(m=>{ const b=document.createElement('button'); b.className='chen-card';
    b.innerHTML=`<span class="chen-card-art">${chenArt(m.n)}</span><span class="chen-card-scrim"></span>
      <div class="chen-card-top"><span class="chen-card-n">${m.n}</span><span class="chen-card-kick">${m.kicker||''}</span>${m.toy?'<span class="chen-toytag">▶ play</span>':(chenSeen(m.n)?'<span class="chen-done">✦</span>':'')}</div>
      <div class="chen-card-t">${m.title}</div>`;
    b.addEventListener('click',()=>chenOpenModule(m.n)); host.appendChild(b); });
  const lib=document.getElementById('chenSources'); if(lib) lib.innerHTML=chenLibraryHTML();
  const cr=document.getElementById('chenCredit'); if(cr) cr.textContent=(typeof CHEN_SOURCE!=='undefined')?CHEN_SOURCE:'';
  if(!_chenBound){ _chenBound=true; document.getElementById('chenBack')?.addEventListener('click',chenBack); }
  document.getElementById('chenHub').hidden=false; document.getElementById('chenDetail').hidden=true;
  triggerReveals(document.getElementById('view-chen'));
}
/* Toy: the 8-note symmetrical (octatonic) scale */
function chenOctatonicHTML(){
  const pads=CHEN_OCTATONIC.degrees.map((d,i)=>`<button class="ju-chord chen-deg" data-i="${i}">${d}</button>`).join('');
  return `<div class="ju-toy"><div class="ju-held"><span class="ju-held-k">The 8-string scale</span><span class="ju-held-n">חֵן</span><span class="ju-held-s">${CHEN_OCTATONIC.name} — whole, half, whole, half…</span></div>
    <div class="chen-scale">${pads}</div>
    <button class="ju-rh-play" id="chenScalePlay">▶ Play the scale</button></div>`;
}
function chenBindOctatonic(){
  const stage=document.getElementById('chenStage'); if(!stage) return;
  stage.querySelectorAll('.chen-deg').forEach(btn=>btn.addEventListener('click',()=>{ const i=+btn.dataset.i;
    if(typeof audioCtx==='function') harpPluck(etMidiFreq(CHEN_OCTATONIC.notes[i]), audioCtx().currentTime+0.03, 1.6); buzz(); }));
  document.getElementById('chenScalePlay')?.addEventListener('click',()=>{ if(typeof audioCtx!=='function') return;
    const ac=audioCtx(); CHEN_OCTATONIC.notes.forEach((m,k)=>harpPluck(etMidiFreq(m), ac.currentTime+0.05+k*0.28, 1.4)); buzz(); });
}
/* Toy: retrograde — forward, then its reverse answers it */
function chenRetroHTML(){
  return `<div class="ju-toy"><div class="ju-held"><span class="ju-held-k">Forward &amp; reverse</span><span class="ju-held-n">↔</span><span class="ju-held-s">${CHEN_RETRO.label} — hear it answer itself</span></div>
    <div class="chen-retro"><button class="ju-rh-tab on" id="chenFwd">▶ Forward</button><button class="ju-rh-tab" id="chenRev">◀ In reverse</button></div>
    <div class="ju-readout" id="chenRetroOut"><span class="ju-feel">Play forward, then reverse.</span><span class="ju-role">On a symmetrical scale, the reverse becomes the answer.</span></div></div>`;
}
function chenPlayMelody(rev){ if(typeof audioCtx!=='function') return; const ac=audioCtx();
  const seq=rev?[...CHEN_RETRO.melody].reverse():CHEN_RETRO.melody; seq.forEach((m,k)=>harpPluck(etMidiFreq(m), ac.currentTime+0.05+k*0.3, 1.5)); }
function chenBindRetro(){
  document.getElementById('chenFwd')?.addEventListener('click',()=>{ chenPlayMelody(false);
    document.getElementById('chenFwd').classList.add('on'); document.getElementById('chenRev').classList.remove('on');
    const r=document.getElementById('chenRetroOut'); if(r) r.innerHTML='<span class="ju-feel">Forward</span><span class="ju-role">the phrase as written.</span>'; buzz(); });
  document.getElementById('chenRev')?.addEventListener('click',()=>{ chenPlayMelody(true);
    document.getElementById('chenRev').classList.add('on'); document.getElementById('chenFwd').classList.remove('on');
    const r=document.getElementById('chenRetroOut'); if(r) r.innerHTML='<span class="ju-feel">In reverse — its own answer</span><span class="ju-role">the same notes, mirrored in time.</span>'; buzz(); });
}
function chenBlockHTML(b){
  if(b.k==='lead') return `<p class="chen-lead-big">${b.text}</p>`;
  if(b.k==='prose') return `<p class="chen-prose">${b.text}</p>`;
  if(b.k==='teaching') return `<div class="chen-teach"><span class="chen-teach-i">חן</span><p>${b.text}</p></div>`;
  if(b.k==='quote') return `<blockquote class="chen-quote">${b.text}${b.by?`<cite>${b.by}</cite>`:''}</blockquote>`;
  if(b.k==='harp') return `<div class="thy-harp"><div class="thy-harp-l"><span class="thy-harp-i">⇪</span> On your lever harp</div><p>${b.text}</p></div>`;
  if(b.k==='science') return `<div class="shy-card2 shy-science"><div class="shy-card-k"><span class="shy-card-i">✦</span>${b.h}</div><p>${b.text}</p>${b.src?`<div class="shy-card-src">${b.src}</div>`:''}</div>`;
  if(b.k==='resonance') return `<p class="chen-resonance">${b.text}</p>`;
  if(b.k==='toy') return b.toy==='octatonic'?chenOctatonicHTML():b.toy==='retro'?chenRetroHTML():'';
  return '';
}
function chenOpenModule(n){
  const m=CHEN_MODULES.find(x=>x.n===n); const stage=document.getElementById('chenStage'); if(!m||!stage) return;
  chenMarkSeen(n); if(typeof sohProgressSave==='function') try{ sohProgressSave('chen',{n:n}); }catch(e){}
  const N=CHEN_MODULES.length;
  stage.innerHTML=`<div class="chen-slide jrn-in">
    <div class="chen-hero">${chenArt(n)}<div class="chen-hero-scrim"></div>
      <div class="chen-hero-txt"><div class="chen-hero-kick">${m.kicker||''}</div><div class="chen-hero-t">${m.title}</div></div></div>
    <div class="chen-body">
      ${m.blocks.map(chenBlockHTML).join('')}
      <div class="shy-nav">
        <button class="jrn-btn ghost" id="chenPrev">${n===0?'‹ All teachings':'‹ '+CHEN_MODULES[n-1].title}</button>
        <button class="jrn-btn" id="chenNext">${n===N-1?'Complete ✦':CHEN_MODULES[n+1].title+' ›'}</button>
      </div>
    </div>
  </div>`;
  if(m.toy==='octatonic') chenBindOctatonic();
  if(m.toy==='retro') chenBindRetro();
  document.getElementById('chenHub').hidden=true; document.getElementById('chenDetail').hidden=false;
  document.getElementById('chenPrev').addEventListener('click',()=>{ if(n===0) chenBack(); else chenOpenModule(n-1); });
  document.getElementById('chenNext').addEventListener('click',()=>{ if(n===N-1) chenBack(); else chenOpenModule(n+1); });
  window.scrollTo(0,0); buzz();
}
function chenBack(){ document.getElementById('chenDetail').hidden=true; document.getElementById('chenHub').hidden=false; buildChen(); window.scrollTo(0,0); }

/* ============================================================
   CREDITS & LICENSES — everything free, legal, and attributed
   ============================================================ */
const CREDITS = [
  { t:'Scripture & Hebrew text', items:[
    {n:'The Holy Scriptures (JPS 1917)', l:'Public Domain', d:'All Bible text — Psalms, Samuel, and more — in the 1917 Jewish Publication Society translation, which is in the public domain worldwide.'},
    {n:'Masoretic Hebrew & cantillation', l:'Public Domain', d:'The Hebrew text and te‘amim, ancient and public domain, displayed via Sefaria.'},
  ]},
  { t:'Music-theory content we adapt', items:[
    {n:'Open Music Theory, v.2', l:'CC BY-SA 4.0', d:'Ed. Gotham, Gullings, Hamm, Hughes, Jarvis, Lavengood & Peterson. Adapted for the “Theory in the Real World” unit, with attribution and share-alike.'},
    {n:'“Microtonality” — Justin Rubin', l:'CC BY 4.0', d:'University of Minnesota Open. Adapted for the Jacob’s Universe microtonality lessons, with attribution.'},
    {n:'Music Theory for the 21st-Century Classroom — R. Hutchinson', l:'GFDL', d:'Adapted across the core theory course.'},
    {n:'Understanding Basic Music Theory — C. Schmidt-Jones', l:'CC BY-SA 4.0', d:'Adapted for the Science of Sound unit.'},
  ]},
  { t:'Fonts', items:[
    {n:'ShlomoStam (Hebrew Torah script)', l:'SIL Open Font License', d:'Bundled and used for Hebrew scripture.'},
    {n:'Playfair Display · Cormorant Garamond · Cinzel', l:'SIL Open Font License', d:'Served from Google Fonts.'},
  ]},
  { t:'Open-source libraries', items:[
    {n:'VexFlow', l:'MIT', d:'Music notation rendering.'},
    {n:'OpenSheetMusicDisplay', l:'BSD-3-Clause', d:'Score display.'},
    {n:'pitchy', l:'0BSD', d:'Pitch detection for the ear-training & tuner tools.'},
    {n:'fft.js', l:'MIT', d:'Fast Fourier transform utility.'},
  ]},
  { t:'Teaching sources — cited, never reproduced', items:[
    {n:'Jacob Collier’s masterclasses & interviews', l:'Link-out', d:'Every concept is taught in our own words with links to the original videos; no transcripts or footage are hosted.'},
    {n:'Public-domain Jewish-music scholarship', l:'Public Domain', d:'A.Z. Idelsohn (1929) and the Jewish Encyclopedia (1906) — freely adaptable, with attribution.'},
    {n:'Modern Jewish-music scholarship', l:'Link-out', d:'Tarsi, the Journal of Synagogue Music, Bernard, Rapport, Kleinman, and others — their ideas taught in our own words, with citation and links; their text and notation are never copied. Haïk-Vantoura’s decipherment is cited as one contested theory.'},
    {n:'Ariel Cohen Alloro — Chen & symmetrical music', l:'Attributed', d:'The Chen section adapts and abridges his teachings in our own words, clearly attributed. The underlying music theory (the octatonic scale, retrograde) is standard and public; his Jewish-mysticism–physics framework is presented as his teaching, not as established science.'},
  ]},
  { t:'Science', items:[
    {n:'Cited research', l:'Attributed', d:'Established findings (music therapy, cymatics, frisson/dopamine, awe, string theory) are cited to their researchers. Where a parallel between tradition and physics is poetic rather than proven, it is marked as such — never presented as established fact.'},
  ]},
  { t:'Your privacy', items:[
    {n:'Everything stays on your device', l:'Private', d:'Your progress, streak, certificates and profile are saved only in this browser (local storage) — nothing is uploaded to a server or shared.'},
    {n:'The microphone', l:'Local only', d:'The mic is used only for the tuner and ear-training, entirely on your device. It is never recorded, saved, or sent anywhere.'},
  ]},
];
function buildCredits(){
  const host=document.getElementById('creditsBody'); if(!host) return;
  host.innerHTML=CREDITS.map(sec=>`<div class="creds-sec">
    <div class="creds-h">${sec.t}</div>
    ${sec.items.map(it=>`<div class="creds-item"><div class="creds-top"><span class="creds-n">${it.n}</span><span class="creds-lic">${it.l}</span></div><p class="creds-d">${it.d}</p></div>`).join('')}
  </div>`).join('') + `<p class="creds-foot">Believe you have found something copyrighted used incorrectly? Tell us and we will fix it at once. Strings of Hope is built to be 100% free and legal.<br><br>Strings of Hope · v${(typeof SOH_VERSION!=='undefined')?SOH_VERSION:'beta'} · <a href="mailto:info@edenrise.com?subject=Strings%20of%20Hope%20feedback" style="color:var(--gold-deep)">send feedback</a></p>`;
  triggerReveals(document.getElementById('view-credits'));
}

/* ============================================================
   PLAY · THE HARP — a real, pluckable instrument (canvas)
   ============================================================ */
const HarpPlay = (function(){
  let cv, ctx, W=0, H=0, dpr=1, strings=[], raf=0, running=false, key='C', hinted=false;
  const KEYROOT={C:48,D:50,'E♭':51,F:53,G:55};
  function scaleFor(k){ const root=KEYROOT[k]||48, iv=[0,2,4,5,7,9,11], out=[];
    for(let i=0;i<15;i++) out.push(root+Math.floor(i/7)*12+iv[i%7]); return out; }
  function layout(){ if(W<10) return; const notes=scaleFor(key), N=notes.length, padX=20, sp=(W-padX*2)/(N-1);
    strings=notes.map((m,i)=>{ const x=padX+i*sp, t=i/(N-1), pc=m%12;
      return { x, yTop:14+Math.pow(t,1.5)*(H*0.42), yBot:H-18, midi:m, pc, amp:0, ph:0,
        color: pc===0?'#e08a6a' : (pc===5?'#6f93c4' : '#e2b65c') }; });
  }
  function setSize(){ if(!cv) return; const r=cv.getBoundingClientRect();
    if(r.width<10){ setTimeout(setSize,80); return; }
    dpr=window.devicePixelRatio||1; W=r.width; H=r.height; cv.width=W*dpr; cv.height=H*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0); layout(); }
  function draw(){ ctx.clearRect(0,0,W,H);
    ctx.strokeStyle='rgba(226,182,92,.22)'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.moveTo(12,H-17); ctx.lineTo(W-12,H-17); ctx.stroke();
    strings.forEach(s=>{ const bow=s.amp*Math.sin(s.ph)*20, my=(s.yTop+s.yBot)/2;
      ctx.beginPath(); ctx.moveTo(s.x,s.yTop); ctx.quadraticCurveTo(s.x+bow,my,s.x,s.yBot);
      const key=(s.pc===0||s.pc===5); ctx.strokeStyle=s.color; ctx.globalAlpha=key?0.95:0.72;
      ctx.lineWidth=key?2.1:1.4; ctx.shadowColor=s.color; ctx.shadowBlur=Math.min(12,2+s.amp*34);
      ctx.stroke(); ctx.shadowBlur=0; ctx.globalAlpha=1;
      s.amp*=0.945; s.ph+=0.55; if(s.amp<0.008) s.amp=0; });
  }
  function loop(){ draw(); raf=requestAnimationFrame(loop); }
  function pluck(i,vel){ const s=strings[i]; if(!s) return; s.amp=Math.min(1,vel||1); s.ph=0;
    try{ harpPluck(etMidiFreq(s.midi), audioCtx().currentTime+0.004, 1.9); }catch(e){}
    if(!hinted){ hinted=true; const h=document.getElementById('playHint'); if(h) h.classList.add('gone'); } }
  function idxAt(x){ let best=-1,bd=1e9; strings.forEach((s,i)=>{ const d=Math.abs(s.x-x); if(d<bd){bd=d;best=i;} }); return bd<22?best:-1; }
  let down=false, last=-1;
  const px=e=>{ const r=cv.getBoundingClientRect(); return (e.clientX!=null?e.clientX:(e.touches&&e.touches[0].clientX))-r.left; };
  function onDown(e){ down=true; last=-1; const i=idxAt(px(e)); if(i>=0){ pluck(i,1); last=i; haptic('tap'); } e.preventDefault(); }
  function onMove(e){ if(!down) return; const i=idxAt(px(e)); if(i>=0 && i!==last){ pluck(i,0.82); last=i; haptic('select'); } }
  function onUp(){ down=false; last=-1; }
  function init(){ cv=document.getElementById('harpCanvas'); if(!cv) return; ctx=cv.getContext('2d');
    if(!cv._bound){ cv._bound=1;
      cv.addEventListener('pointerdown',onDown); window.addEventListener('pointermove',onMove); window.addEventListener('pointerup',onUp);
      window.addEventListener('resize',()=>{ if(running) setSize(); }); }
    setSize(); }
  return { start(){ init(); running=true; if(!raf) loop(); },
           stop(){ running=false; if(raf){ cancelAnimationFrame(raf); raf=0; } },
           setKey(k){ key=k; layout(); } };
})();
function buildPlay(){
  const kc=document.getElementById('playKeys');
  if(kc && !kc._built){ kc._built=1; const keys=['C','D','E♭','F','G'];
    kc.innerHTML=keys.map((k,i)=>`<button class="play-key${i===0?' on':''}" data-k="${k}">${k}</button>`).join('');
    kc.querySelectorAll('.play-key').forEach(b=>b.addEventListener('click',()=>{ kc.querySelectorAll('.play-key').forEach(x=>x.classList.toggle('on',x===b)); HarpPlay.setKey(b.dataset.k); buzz(); }));
  }
  HarpPlay.start();
}
function playLeave(){ try{ HarpPlay.stop(); }catch(e){} }

/* ============================================================
   HUB TABS — Learn · Practice · Spirit · You (2026-07-07 redesign)
   ============================================================ */
function _seenPct(key,total){ try{ const n=JSON.parse(localStorage.getItem(key)||'[]').length; return total?Math.round(Math.min(n,total)/total*100):0; }catch(e){ return 0; } }
function buildLearnHub(){
  const host=document.getElementById('learnWorlds'); if(!host) return;
  let theoryPct=0; try{ theoryPct=sohTheoryStats().pct; }catch(e){}
  const jT=(typeof JACOB_MODULES!=='undefined')?JACOB_MODULES.length:11;
  const sT=(typeof SHAMAYIM_LEVELS!=='undefined')?SHAMAYIM_LEVELS.length:5;
  const cT=(typeof CHEN_MODULES!=='undefined')?CHEN_MODULES.length:6;
  const worlds=[
    {v:'modes', n:'Modes', d:'The modal wheel · 7 modes', pct:null,
      ic:'<circle cx="12" cy="6" r="2.4"/><circle cx="18" cy="15" r="2.4"/><circle cx="6" cy="15" r="2.4"/><path d="M12 8v4M10 14l-2.4 1M14 14l2.4 1"/>'},
    {v:'theory', n:'Music Theory', d:'Eleven units · certificates', pct:theoryPct,
      ic:'<path d="M4 18V7M9 18V4M14 18v-8M19 18V9"/>'},
    {v:'jacob', n:'Jacob’s Universe', d:'Harmony as feeling · '+jT+' modules', pct:_seenPct('soh-jacob-seen',jT),
      ic:'<circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="9" ry="3.8"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)"/>'},
    {v:'shamayim', n:'Shamayim Harp', d:'The five worlds of the soul', pct:_seenPct('soh-shamayim-seen',sT),
      ic:'<path d="M5 21V6a5 5 0 015-5M19 21C17 10 11 8 9 7M9 21h10"/>'},
    {v:'chen', n:'Chen · Symmetry', d:'Ariel Cohen Alloro', pct:_seenPct('soh-chen-seen',cT),
      ic:'<path d="M12 3v18M7 7l-4 5 4 5M17 7l4 5-4 5"/>'},
  ];
  const shown=worlds.filter(w=>sohOn(w.v));
  const hidden=worlds.filter(w=>!sohOn(w.v)).map(w=>w.n);
  host.innerHTML=shown.map(w=>`<button class="world-row" data-view="${w.v}">
    <span class="wr-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">${w.ic}</svg></span>
    <span class="wr-t"><span class="wr-n">${w.n}</span><span class="wr-d">${w.d}</span>${w.pct!=null?`<span class="wr-bar"><i style="width:${w.pct}%"></i></span>`:''}</span>
    <span class="wr-go">›</span></button>`).join('')
  + (hidden.length?`<div class="wr-workshop"><span class="wrw-k">✦ In the workshop</span>
      <span class="wrw-t">${hidden.join(' · ')}</span>
      <span class="wrw-d">Being lovingly refined — each will open when it’s ready.</span></div>`:'');
  host.querySelectorAll('.world-row').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
}
function buildSpirit(){ try{ if(typeof renderSongCard==='function') renderSongCard(new Date()); }catch(e){} }
const SOH_VERSION = '2026.07.07 · beta';
function youEncourage(st, streak, certs){
  if(streak>=7) return `${streak} days in a row — your harp knows your hands now. Keep the flame alight. 🔥`;
  if(streak>=2) return `A ${streak}-day streak going. A few minutes today keeps it alive.`;
  if(st && st.next && (st.next.min-st.xp)<=120) return `Just <b>${st.next.min-st.xp} XP</b> to <b>${st.next.name}</b> — you’re nearly there.`;
  if(certs && certs.length) return `You’ve earned <b>${certs.length}</b> certificate${certs.length>1?'s':''}. Beautiful work — keep climbing.`;
  if(st && st.chDone>0) return `<b>${st.chDone}</b> chapter${st.chDone>1?'s':''} done. Every one is a new colour under your hands.`;
  return `Every note counts. Play a little today and watch it grow.`;
}
function buildYou(){
  const el=document.getElementById('youCard'); if(!el) return;
  let st=null,lv=null; try{ st=sohTheoryStats(); }catch(e){} try{ lv=sohLevel(); }catch(e){}
  const js=(typeof journalStats==='function')?journalStats():{streak:0};
  const certs=(typeof sohCertsEarned==='function')?sohCertsEarned():[];
  const badges=(typeof sohEarned==='function')?sohEarned().length:0, badgesT=(typeof sohBadgeList==='function')?sohBadgeList().length:10;
  const u=(window.SOH_SYNC&&SOH_SYNC.user)||null;
  const name=(u&&!u.isAnonymous&&(u.displayName||(u.email&&u.email.split('@')[0])))||((typeof sohName==='function'&&sohName()))||'Harper';
  const _hs=(typeof sohHarps==='function')?sohHarps():[];
  const _act=(typeof sohActiveIdx==='function')?sohActiveIdx():0;
  const harp=_hs.length?sohHarpLabel(_hs[_act].type):'Lever harpist';
  const av=(u&&u.photoURL)?`<img class="prof-av" src="${u.photoURL}" alt="" referrerpolicy="no-referrer">`:`<div class="prof-av prof-av-x">${(name[0]||'✦').toUpperCase()}</div>`;
  // rank ring
  const xp=st?st.xp:0, rankMin=st?st.rankMin:0, next=st?st.next:null;
  const band=next?Math.max(0,Math.min(1,(xp-rankMin)/((next.min-rankMin)||1))):1;
  const R=30, C=(2*Math.PI*R).toFixed(1), off=(C*(1-band)).toFixed(1);
  const worlds=[['Theory',st?st.pct:0,'theory'],['Jacob',_seenPct('soh-jacob-seen',(typeof JACOB_MODULES!=='undefined')?JACOB_MODULES.length:11),'jacob'],
    ['Shamayim',_seenPct('soh-shamayim-seen',(typeof SHAMAYIM_LEVELS!=='undefined')?SHAMAYIM_LEVELS.length:5),'shamayim'],
    ['Chen',_seenPct('soh-chen-seen',(typeof CHEN_MODULES!=='undefined')?CHEN_MODULES.length:6),'chen']].filter(w=>sohOn(w[2]));
  const earnedB=(typeof sohEarned==='function')?new Set(sohEarned().map(b=>b.id)):new Set();
  const r=(typeof nxResume==='function')?nxResume():null;
  const remOn = (()=>{ try{ return localStorage.getItem('soh-reminders')==='1'; }catch(e){ return false; } })();

  el.innerHTML=`
    <div class="prof-hero">
      <div class="prof-id">${av}<div class="prof-idt"><div class="prof-name">${name}</div><div class="prof-harp">${harp}</div></div></div>
      <div class="prof-rankrow">
        <svg class="prof-ring" viewBox="0 0 72 72" aria-hidden="true"><circle class="pr-track" cx="36" cy="36" r="${R}"/><circle class="pr-fill" cx="36" cy="36" r="${R}" style="stroke-dasharray:${C};stroke-dashoffset:${off}"/><text x="36" y="41" text-anchor="middle" class="pr-num">${st?st.rankN:1}</text></svg>
        <div class="prof-rankt"><div class="prof-rank-n">${st?st.rank:'Apprentice of Strings'}</div>
          <div class="prof-rank-xp">${xp.toLocaleString()} XP</div>
          <div class="prof-rank-next">${next?`${(next.min-xp).toLocaleString()} XP to ${next.name}`:'Highest rank reached ✦'}</div></div>
      </div>
    </div>
    <div class="prof-stats">
      <div><b>${js.streak||0}</b><span>day streak</span></div>
      <div><b>${st?st.chDone:0}</b><span>chapters</span></div>
      <div><b>${certs.length}</b><span>certificates</span></div>
      <div><b>${badges}/${badgesT}</b><span>badges</span></div>
    </div>
    <div class="prof-encourage">${youEncourage(st, js.streak||0, certs)}</div>
    <button class="prof-continue" id="profContinue">${r?`Keep going · ${harperTrim?harperTrim(r.title,26):r.title}`:'Explore the worlds'} <span>→</span></button>

    <div class="prof-sec-t">My harps</div>
    <div class="prof-harps">
      ${_hs.map((h,i)=>`<button class="prof-harpchip${i===_act?' on':''}" data-hi="${i}">
        <span class="ph-t">${sohHarpLabel(h.type)}</span><span class="ph-tune">${h.tuning==='C'?'C major':'E♭'} tuning</span>
        ${_hs.length>1?`<span class="ph-x" data-hx="${i}" role="button" aria-label="Remove this harp">✕</span>`:''}
      </button>`).join('')}
      <button class="prof-harpchip ph-add" id="profAddHarp"><span class="ph-t">+ Add a harp</span><span class="ph-tune">multiple harps welcome</span></button>
    </div>

    <div class="prof-sec-t">Certificates</div>
    ${certs.length
      ? `<div class="prof-certs">${certs.map(c=>`<button class="prof-seal" data-cert="${c.id}"><span class="ps-i">${c.id==='diploma'?'👑':'✦'}</span><span class="ps-t">${c.id==='diploma'?'Diploma':(c.unit?c.unit.kicker||c.unit.title:'Unit')}</span></button>`).join('')}</div>`
      : `<div class="prof-cert-empty"><div class="pce-bar"><i style="width:${st?st.pct:0}%"></i></div><span>${st?st.pct:0}% to your first certificate — finish a unit to earn it.</span></div>`}

    <div class="prof-sec-t">Your worlds</div>
    <div class="prof-worlds">${worlds.map(([n,p])=>`<div class="prof-world"><span class="pw-n">${n}</span><span class="pw-bar"><i style="width:${p}%"></i></span><span class="pw-p">${p}%</span></div>`).join('')}</div>

    <div class="prof-sec-t">Pilgrimage</div>
    <div class="prof-badges">${(typeof sohBadgeList==='function'?sohBadgeList():[]).map(b=>`<div class="prof-badge${earnedB.has(b.id)?' on':''}" title="${b.d}"><span class="pb-i">${earnedB.has(b.id)?'✦':'·'}</span><span class="pb-t">${b.t}</span></div>`).join('')}</div>

    <div class="prof-remind" id="reminderRow">
      <div><div class="pr-t">Daily practice reminder</div><div class="pr-d">A gentle nudge to keep your streak alive</div></div>
      <button class="pr-switch${remOn?' on':''}" id="reminderToggle" role="switch" aria-checked="${remOn}"><span class="pr-knob"></span></button>
    </div>`;

  el.querySelector('#profContinue')?.addEventListener('click',()=>{ if(r&&r.go) r.go(); else showView('learn-hub'); buzz(); });
  el.querySelectorAll('.prof-harpchip[data-hi]').forEach(c=>c.addEventListener('click',e=>{
    if(e.target.classList.contains('ph-x')) return;
    sohSetActiveHarp(+c.dataset.hi); buildYou(); try{ renderHome(); }catch(err){} buzz();
  }));
  el.querySelectorAll('.ph-x').forEach(x=>x.addEventListener('click',e=>{
    e.stopPropagation();
    const i=+x.dataset.hx, h=sohHarps()[i];
    if(h && confirm(`Remove your ${sohHarpLabel(h.type)}?`)){ sohRemoveHarp(i); buildYou(); buzz(); }
  }));
  el.querySelector('#profAddHarp')?.addEventListener('click',()=>{ sohOnboardOpen(true); buzz(); });
  el.querySelectorAll('.prof-seal').forEach(b=>b.addEventListener('click',()=>{ if(typeof sohOpenCertById==='function') sohOpenCertById(b.dataset.cert); }));
  el.querySelector('#reminderToggle')?.addEventListener('click',youToggleReminder);

  const v=document.getElementById('youVersion'); if(v) v.textContent='Strings of Hope · v'+SOH_VERSION+' · works offline';
  try{ if(typeof sohRenderAuth==='function') sohRenderAuth(); }catch(e){}
}
function youToggleReminder(){
  let on=false; try{ on=localStorage.getItem('soh-reminders')==='1'; }catch(e){}
  if(on){ try{ localStorage.setItem('soh-reminders','0'); }catch(e){} buildYou(); buzz(); return; }
  if(!('Notification' in window)){ try{ localStorage.setItem('soh-reminders','1'); }catch(e){} buildYou(); return; }
  try{ Notification.requestPermission().then(p=>{
    try{ localStorage.setItem('soh-reminders', p==='granted'?'1':'0'); }catch(e){}
    if(p==='granted'){ try{ new Notification('Reminders on 🎵',{body:'We’ll cheer you on to keep your streak alive.',icon:'img/icon-192.png'}); }catch(e){} }
    buildYou();
  }); }catch(e){ buildYou(); }
}
function youMaybeRemind(){
  try{
    const today=new Date().toISOString().slice(0,10);
    const lastVisit=localStorage.getItem('soh-last-visit'); localStorage.setItem('soh-last-visit',today);
    if(localStorage.getItem('soh-reminders')!=='1') return;
    if(!('Notification' in window) || Notification.permission!=='granted') return;
    if(localStorage.getItem('soh-remind-last')===today) return;
    if(lastVisit && lastVisit!==today){
      const js=journalStats(); const msg=js.streak>0?`Your ${js.streak}-day streak is waiting 🔥`:'A few minutes at the harp today?';
      new Notification('Strings of Hope 🎵',{body:msg, icon:'img/icon-192.png'});
      localStorage.setItem('soh-remind-last',today);
    }
  }catch(e){}
}
function renderWelcome(){
  const el=document.getElementById('welcomeCard'); if(!el) return;
  let seen=false; try{ seen=localStorage.getItem('soh-welcomed')==='1'; }catch(e){}
  if(seen){ el.hidden=true; return; }
  el.hidden=false;
  el.innerHTML=`<button class="wc-x" id="wcClose" aria-label="Dismiss">✕</button>
    <div class="wc-k">Welcome to the beta</div>
    <div class="wc-t">You’re one of the first to play here 🎵</div>
    <p class="wc-p">Explore the five worlds under <b>Learn</b>, tap the harp bubble to ask <b>Harpie</b> anything, and share what you find from <b>You → Send feedback</b>. Thank you for testing.</p>`;
  el.querySelector('#wcClose')?.addEventListener('click',()=>{ try{ localStorage.setItem('soh-welcomed','1'); }catch(e){} el.hidden=true; buzz(); });
}
function harpieOpenGlobal(){
  if(typeof harpieBind==='function') harpieBind();
  window._hpCtx=null; try{ _hpCtx=null; }catch(e){}
  const q=document.getElementById('hpQuick'); if(q) q.style.display='none';
  const c=document.getElementById('hpCtx'); if(c) c.textContent='ask anything';
  const body=document.getElementById('hpBody'); if(body) body.innerHTML='';
  harpieAddMsg('a','Hi — I’m <b>Harpie</b>, your harp coach. Ask me anything: a concept, a chord, what to practise next — or search for any lesson or tool by name.');
  const ov=document.getElementById('harpiePanel'); if(ov){ ov.hidden=false; document.body.classList.add('hp-open'); }
  setTimeout(()=>document.getElementById('hpInput')?.focus(),60); buzz();
}
const _HUB_TABS=['home','learn-hub','tools','spirit','you'];
let _prevView='home';

/* ============================================================
   CELEBRATION MOMENTS — level-ups, streak milestones
   ============================================================ */
let _celRaf=0, _celBound=false;
function sohHarpFlourish(){ try{ const ac=audioCtx(); [60,64,67,72,76,79,84,88].forEach((m,k)=>harpPluck(etMidiFreq(m), ac.currentTime+0.05+k*0.06, 2.2)); }catch(e){} }
function celBurst(){
  const cv=document.getElementById('celCanvas'); if(!cv) return; const ctx=cv.getContext('2d');
  const dpr=window.devicePixelRatio||1, W=cv.clientWidth||window.innerWidth, H=cv.clientHeight||window.innerHeight;
  cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  const cols=['#e2b65c','#f3ead6','#d98a6a','#c39a54','#6f93c4'], parts=[], cx=W/2, cy=H*0.4;
  for(let i=0;i<110;i++){ const a=Math.random()*Math.PI*2, sp=2+Math.random()*8;
    parts.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-4,g:0.12+Math.random()*0.09,s:3+Math.random()*4,
      rot:Math.random()*6,vr:(Math.random()-0.5)*0.4,c:cols[i%cols.length],life:1}); }
  cancelAnimationFrame(_celRaf);
  (function loop(){ ctx.clearRect(0,0,W,H); let alive=false;
    parts.forEach(p=>{ p.vy+=p.g; p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr; p.life-=0.008;
      if(p.life>0 && p.y<H+24){ alive=true; ctx.save(); ctx.globalAlpha=Math.max(0,p.life); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
        ctx.fillStyle=p.c; ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*1.7); ctx.restore(); } });
    if(alive) _celRaf=requestAnimationFrame(loop); else ctx.clearRect(0,0,W,H);
  })();
}
function sohCelebrate(o){
  const ov=document.getElementById('celebrate'); if(!ov) return; o=o||{};
  ov.querySelector('#celIcon').textContent=o.icon||'✦';
  ov.querySelector('#celKicker').textContent=o.kicker||'Milestone';
  ov.querySelector('#celTitle').textContent=o.title||'';
  ov.querySelector('#celSub').textContent=o.sub||'';
  ov.hidden=false; document.body.classList.add('cel-open');
  if(!_celBound){ _celBound=true;
    document.getElementById('celBtn')?.addEventListener('click',sohCelebrateClose);
    ov.addEventListener('click',e=>{ if(e.target===ov) sohCelebrateClose(); }); }
  haptic('win'); sohHarpFlourish();
  const rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(!rm) requestAnimationFrame(celBurst);
}
function sohCelebrateClose(){ const ov=document.getElementById('celebrate'); if(ov){ ov.hidden=true; document.body.classList.remove('cel-open'); } cancelAnimationFrame(_celRaf); _celRaf=0; }
function sohCheckMilestones(){
  try{
    // Rank up
    const st=sohTheoryStats(); const rs=localStorage.getItem('soh-rank-seen');
    if(rs==null){ localStorage.setItem('soh-rank-seen',String(st.rankN)); }
    else if(st.rankN>parseInt(rs)){ localStorage.setItem('soh-rank-seen',String(st.rankN));
      sohCelebrate({kicker:'Level up',icon:'✦',title:st.rank,sub:`You’ve reached rank ${st.rankN} — ${st.xp.toLocaleString()} XP. Keep climbing.`}); return; }
    // Streak milestones
    const streak=(journalStats().streak)||0, ms=[3,7,14,30,50,100,200,365];
    const ss=localStorage.getItem('soh-streak-seen');
    if(ss==null){ localStorage.setItem('soh-streak-seen',String(ms.filter(m=>streak>=m).pop()||0)); return; }
    const hit=ms.filter(m=>streak>=m && m>parseInt(ss));
    if(hit.length){ const top=hit[hit.length-1]; localStorage.setItem('soh-streak-seen',String(top));
      sohCelebrate({kicker:'Streak',icon:'🔥',title:`${top}-day streak!`,sub:'Your harp knows your hands now. Keep the flame alight.'}); }
  }catch(e){}
}
const _TAB_PARENT={ modes:'learn-hub',learn:'learn-hub',theory:'learn-hub',jacob:'learn-hub',shamayim:'learn-hub',chen:'learn-hub',
  practice:'tools',tuner:'tools',eartraining:'tools',rhythm:'tools',circle:'tools',sightread:'tools',drone:'tools',levers:'tools',scales:'tools',repertoire:'tools',
  tehillim:'spirit',meditation:'spirit',hebrew:'spirit',compass:'spirit',
  profile:'you',journal:'you',credits:'you' };

function showView(name){
  if(!document.getElementById('view-'+name)) name='home';                 // never navigate to a missing view
  if(typeof sohOn==='function' && !sohOn(name)) name=_TAB_PARENT[name]||'home'; // flagged-off feature → its hub
  document.body.classList.remove('in-session');                            // never leave the nav stuck hidden
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active', v.id==='view-'+name));
  // flow: directional view transition (push deeper · pop back · cross-fade tabs)
  try{ const _av=document.getElementById('view-'+name);
    if(_av && name!==_prevView){
      const prevHub=_HUB_TABS.includes(_prevView), nextHub=_HUB_TABS.includes(name);
      const vt = !nextHub ? 'vt-push' : (!prevHub ? 'vt-pop' : 'vt-tab');
      _av.classList.remove('vt-push','vt-pop','vt-tab'); void _av.offsetWidth; _av.classList.add(vt);
      haptic(nextHub?'tap':'soft');
    }
    _prevView=name;
  }catch(e){}
  const _activeTab = _HUB_TABS.includes(name) ? name : (_TAB_PARENT[name]||null);
  document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('on', b.dataset.view===_activeTab));
  const _fab=document.getElementById('harpieFab'); if(_fab) _fab.hidden = !_HUB_TABS.includes(name);
  document.body.classList.toggle('in-journey', name==='journey');
  try{
    if(name==='journey'){ jrnStep=0; jrnRender(); }
    if(name==='practice') buildPractice();
    if(name==='tuner') buildTuner();
    else if(typeof Tuner!=='undefined' && Tuner.running){ Tuner.stop(); document.getElementById('tunerMic')?.classList.remove('playing'); tunerUpdate(-1,null); }
    if(name==='levers') buildLevers();
    else if(typeof lt!=='undefined' && lt.running) ltStop();
    if(name==='rhythm') Metro.onBeat=rhythmBeat;
    if(name==='profile') buildProfile();
    if(name==='journal'){ buildJournal(); if(typeof renderBadges==='function') renderBadges(); }
    if(typeof sohVisit==='function') sohVisit(name);
    if(name==='home') renderHome();
    if(_HUB_TABS.includes(name)) setTimeout(()=>{ try{ sohCheckMilestones(); }catch(e){} }, 420);
    if(name==='learn-hub') buildLearnHub();
    if(name==='tools'){}
    if(name==='spirit') buildSpirit();
    if(name==='you') buildYou();
    if(name==='compass') compassRender();
    if(name==='sightread') srEnter(); else if(typeof srLeave==='function') srLeave();
    if(name==='tehillim'){ tehDow=null; renderTehillim(); }
    if(name==='hebrew') renderHebrew();
    if(name==='meditation') medEnter(); else if(typeof medLeave==='function') medLeave();
    if(name==='learn') learnEnter(); else if(typeof learnLeave==='function') learnLeave();
  if(name==='theory') theoryEnter(); else if(typeof theoryLeave==='function') theoryLeave();
    if(name==='circle') buildCircle();
    if(name==='eartraining') etEnter();
    if(name==='jacob') jacobEnter();
    if(name==='shamayim') buildShamayim();
    if(name==='chen') buildChen();
    if(name==='play') buildPlay(); else if(typeof playLeave==='function') playLeave();
    if(name==='credits') buildCredits();
  }catch(err){ console.warn('view init error ('+name+'):', err); }
  try{ window.scrollTo(0,0); }catch(e){}
  observeReveals();
  revealNow(document.getElementById('view-'+name));                        // force the whole view visible — no blank pages
}

/* ============================================================
   AI SIGHT READING COACH — listen, guide, gently correct.
   Reuses Tuner (mic autocorrelation), Drone, Metro, buildScaleContext,
   computeScale (lever awareness), the harp profile + the practice journal.
   ============================================================ */
const SR_LEVELS = [
  {key:'abs',   label:'Absolute beginner', range:3,  bpm:54, wait:true,  labels:true,  durs:[4]},
  {key:'beg',   label:'Beginner',          range:5,  bpm:60, wait:true,  labels:true,  durs:[4,4,2]},
  {key:'early', label:'Early intermediate',range:7,  bpm:72, wait:false, labels:false, durs:[4,2,2,1]},
  {key:'int',   label:'Intermediate',      range:9,  bpm:84, wait:false, labels:false, durs:[2,1,1,1]},
  {key:'adv',   label:'Advanced',          range:12, bpm:96, wait:false, labels:false, durs:[1,1,1,1,2]},
];
const SR_CLEFS = [{key:'treble',label:'Treble'},{key:'bass',label:'Bass'},{key:'grand',label:'Grand staff',soon:true}];
const SR_TYPES = [
  {key:'note',  label:'Note Finder'},
  {key:'rhythm',label:'Rhythm Reader'},
  {key:'melody',label:'Melody Reader'},
  {key:'mode',  label:'Mode Reading'},
  {key:'drone', label:'Drone Reading'},
  {key:'lever', label:'Lever Reading'},
];
/* each preset = a parent key + world + mode index (drives notes AND lever setup) */
const SR_SCALES = [
  {label:'C Major',            key:'C', world:'major',           mode:0},
  {label:'A Minor',            key:'C', world:'major',           mode:5},
  {label:'D Dorian',           key:'C', world:'major',           mode:1},
  {label:'G Mixolydian',       key:'C', world:'major',           mode:4},
  {label:'E Phrygian',         key:'C', world:'major',           mode:2},
  {label:'D Phrygian Dominant',key:'G', world:'harmonic-minor',  mode:4},
  {label:'E Harmonic Minor',   key:'E', world:'harmonic-minor',  mode:0},
  {label:'G Phrygian Dominant',key:'C', world:'harmonic-minor',  mode:4},
];
const SR_LENS = [3,5,10,20];
const SR_LETTERS = ['C','D','E','F','G','A','B'];

let sr = {
  level:'beg', clef:'treble', type:'note', scaleIdx:0, lenMin:5,
  wait:true, labels:true, bpm:60, droneOn:false, metroOn:false, lookahead:false,
  /* runtime */
  ctx:null, mode:null, fam:null, levers:null, clean:true, leversUp:[],
  exercise:[], _status:[], idx:0, playing:false, micOn:false, _review:[],
  startedAt:0, _hist:[], _lockUntil:0, _armTimer:null, stats:null, session:null, _init:false,
  scoreMode:false, osmd:null, scoreTitle:'', _scoreXml:'',
};

/* per-note lever state on the player's actual base tuning — works for ANY note (incl. imported scores) */
function srLeverFor(letter, pc){
  const base=TBASES[tuneBase] && TBASES[tuneBase].down; if(!base) return undefined;
  const down=base[letter]; if(down===undefined) return undefined;
  const up=(down+1)%12;
  if(pc===down) return 'down'; if(pc===up) return 'up'; return null;   // null = needs a different tuning
}

function srDi(letter, oct){ return SR_LETTERS.indexOf(letter) + 7*oct; }
function srSpan(){ return SR_LEVELS.find(l=>l.key===sr.level) || SR_LEVELS[1]; }

/* ---------- spaced-repetition weak-note model (localStorage) ---------- */
let srSkill = {};
function srLoadSkill(){ try{ srSkill=JSON.parse(localStorage.getItem('soh_sr_skill'))||{}; }catch(e){ srSkill={}; } }
function srSaveSkill(){ try{ localStorage.setItem('soh_sr_skill', JSON.stringify(srSkill)); }catch(e){} }
function srNoteKey(n){ return n.letter + (n.name.length>1?n.name.slice(1):'') + n.octave; }
function srRecord(n, correct){
  const k=srNoteKey(n); const s=srSkill[k]||{seen:0, ok:0, weak:0.5, due:0};
  s.seen++;
  if(correct){ s.ok++; s.weak=Math.max(0, +(s.weak-0.34).toFixed(3)); s.due=Date.now()+(s.weak<0.2?864e5:18e5); }   // 1 day vs 30 min
  else { s.weak=Math.min(1, +(s.weak+0.5).toFixed(3)); s.due=Date.now(); }
  srSkill[k]=s; srSaveSkill();
}
function srPickWeighted(pool){
  const now=Date.now();
  const w=pool.map(n=>{ const s=srSkill[srNoteKey(n)]; let x=1; if(s){ x+=2*s.weak; if(s.due&&s.due<=now) x+=1.5; } return x; });
  let tot=w.reduce((a,b)=>a+b,0), r=Math.random()*tot;
  for(let i=0;i<pool.length;i++){ r-=w[i]; if(r<=0) return pool[i]; }
  return pool[pool.length-1];
}
function srWeakestDue(pool){
  const now=Date.now(); let best=null, bw=0;
  pool.forEach(n=>{ const s=srSkill[srNoteKey(n)]; if(s && s.weak>0.34){ const sc=s.weak+(s.due&&s.due<=now?0.5:0); if(sc>bw){ bw=sc; best=n; } } });
  return best;
}

/* resolve the chosen scale into a mode context + lever setup on the player's harp */
function srResolveScale(){
  const p = SR_SCALES[sr.scaleIdx];
  const world = PARENT_WORLDS.find(w=>w.key===p.world) || PARENT_WORLDS[0];
  const ctx = buildScaleContext(p.key, world);
  const mode = ctx.modes[p.mode] || ctx.modes[0];
  const fam = {formula:world.formula, cat:world.key, name:world.name};
  const sc = computeScale(tuneBase, p.key, fam);     // null = not cleanly playable on this base
  sr.ctx=ctx; sr.mode=mode; sr.fam=fam;
  sr.clean = !!sc; sr.levers = sc?sc.levers:null; sr.leversUp = sc?sc.leversUp:[];
  return {p, world, ctx, mode, sc};
}

/* an ascending pitch ladder of the mode (3 octaves) with octaves assigned */
function srLadder(){
  const notes = sr.mode.notes;
  let oct = sr.clef==='bass' ? 3 : 4, prev = -1;
  const out=[];
  for(let r=0;r<3;r++){
    notes.forEach(nm=>{
      const letter=nm[0], li=SR_LETTERS.indexOf(letter);
      if(prev>=0 && li<=prev) oct++;
      prev=li;
      const pc=tRootPC(nm);
      out.push({name:nm, letter, octave:oct, pc, midi: pc+12*(oct+1)});
    });
  }
  return out;
}

function srGenExercise(){
  const lvl = srSpan();
  const ladder = srLadder();
  const range = Math.min(lvl.range, ladder.length-1);
  const win = ladder.slice(0, range+1);            // tonic .. range degrees up
  const ex=[];
  sr._review=[];
  const durFor = i => (sr.type==='note') ? 4 : lvl.durs[i % lvl.durs.length];

  if(sr.type==='note'){
    const pick=srPickWeighted(win); ex.push({...pick, dur:4});
    if(srSkill[srNoteKey(pick)] && srSkill[srNoteKey(pick)].weak>0.34) sr._review.push(srNoteKey(pick));
  } else if(sr.type==='rhythm'){
    const base = win[0];
    for(let i=0;i<6;i++) ex.push({...base, dur: lvl.durs[i % lvl.durs.length]});
  } else {
    const N = (sr.level==='abs'||sr.level==='beg') ? 5 : 7;
    let pos = Math.max(0, win.indexOf(srPickWeighted(win)));        // weighted start
    for(let i=0;i<N;i++){
      ex.push({...win[pos], dur: durFor(i)});
      const big = (sr.level==='int'||sr.level==='adv') && Math.random()<0.3;
      const dir = Math.random()<0.5 ? 1 : -1;
      pos = Math.max(0, Math.min(win.length-1, pos + dir*(big?2:1)));
    }
    /* spaced-repetition: resurface the weakest due note mid-phrase */
    const due = srWeakestDue(win);
    if(due && N>=4){ const slot=1+Math.floor(Math.random()*(N-2)); ex[slot]={...due, dur:durFor(slot)}; sr._review.push(srNoteKey(due)); }
    /* lever reading: make sure a levers-up note appears so the change is practised */
    if(sr.type==='lever' && sr.leversUp.length){
      const target = win.find(n=>sr.leversUp.includes(n.letter));
      if(target) ex[Math.floor(ex.length/2)] = {...target, dur:2};
    }
  }
  return ex;
}

/* ---------- staff renderer ---------- */
function srCss(v){ return (getComputedStyle(document.documentElement).getPropertyValue(v)||'').trim() || '#888'; }
function srVexDur(beats){ return beats>=4?'w' : beats>=2?'h' : beats>=1?'q' : beats>=0.5?'8':'16'; }
function srVexKey(n){
  const acc = n.name.length>1 ? n.name.slice(1).replace(/♯/g,'#').replace(/♭/g,'b') : '';
  return { key: n.letter.toLowerCase()+acc+'/'+n.octave, acc };
}
/* world-class notation via VexFlow 5 (falls back to the hand-built staff if unavailable) */
function srRenderStaff(){
  const wrap=document.getElementById('srStaffWrap'); if(!wrap) return;
  if(sr.scoreMode){ if(sr.osmd) srScoreCursorTo(sr.idx); return; }   // OSMD owns the canvas in score mode
  if(typeof VexFlow==='undefined' || !VexFlow.Renderer){ srRenderStaffFallback(); return; }
  const VF=VexFlow, ex=sr.exercise, clef=sr.clef==='bass'?'bass':'treble';
  if(!ex.length){ wrap.innerHTML=''; return; }
  wrap.innerHTML='';
  const noteW=58, H=204, W=Math.max(320, 96 + ex.length*noteW);
  const colOf = st => st==='done-ok'?srCss('--sr-ok') : st==='done-bad'?srCss('--sr-bad') : st==='current'?srCss('--gold') : srCss('--ink-faint');
  try{
    const renderer=new VF.Renderer(wrap, VF.Renderer.Backends.SVG);
    renderer.resize(W,H);
    const ctx=renderer.getContext();
    const stave=new VF.Stave(6, 40, W-16); stave.addClef(clef);
    stave.setStyle({ strokeStyle:srCss('--line-2'), fillStyle:srCss('--ink-soft') });
    stave.setContext(ctx).draw();
    const vnotes = ex.map((n,i)=>{
      const {key,acc}=srVexKey(n);
      const sn=new VF.StaveNote({clef, keys:[key], duration:srVexDur(n.dur)});
      if(acc) sn.addModifier(new VF.Accidental(acc), 0);
      const c=colOf(sr._status[i]||'upcoming');
      sn.setStyle({ fillStyle:c, strokeStyle:c });
      return sn;
    });
    const totalBeats=ex.reduce((a,n)=>a+n.dur,0);
    const voice=new VF.Voice({numBeats:Math.max(1,totalBeats), beatValue:4}).setMode(VF.Voice.Mode.SOFT);
    voice.addTickables(vnotes);
    new VF.Formatter().joinVoices([voice]).format([voice], W-110);
    voice.draw(ctx, stave);
    // soft highlight band + labels overlay
    const svg=wrap.querySelector('svg'); const SVGNS='http://www.w3.org/2000/svg'; if(svg){ svg.style.width='100%'; svg.style.height='auto'; svg.removeAttribute('width'); svg.removeAttribute('height');
      if(sr.playing && sr.idx<vnotes.length){
        const x=vnotes[sr.idx].getAbsoluteX();
        const band=document.createElementNS(SVGNS,'rect');
        band.setAttribute('x',x-24); band.setAttribute('y',24); band.setAttribute('width',48); band.setAttribute('height',H-86);
        band.setAttribute('rx',13); band.setAttribute('fill',srCss('--gold')); band.setAttribute('opacity','0.13');
        svg.insertBefore(band, svg.firstChild);
      }
      // look-ahead: dashed marker + eye over the NEXT note, training the eyes to read ahead
      if(sr.lookahead && sr.playing && sr.idx+1<vnotes.length){
        const x=vnotes[sr.idx+1].getAbsoluteX();
        const eye=document.createElementNS(SVGNS,'rect');
        eye.setAttribute('x',x-20); eye.setAttribute('y',28); eye.setAttribute('width',40); eye.setAttribute('height',H-94);
        eye.setAttribute('rx',11); eye.setAttribute('fill','none'); eye.setAttribute('stroke',srCss('--gold'));
        eye.setAttribute('stroke-dasharray','3 4'); eye.setAttribute('stroke-width','1.5'); eye.setAttribute('opacity','0.55');
        svg.insertBefore(eye, svg.firstChild);
        const g=document.createElementNS(SVGNS,'text'); g.setAttribute('x',x); g.setAttribute('y',20); g.setAttribute('text-anchor','middle');
        g.setAttribute('font-size','12'); g.setAttribute('fill',srCss('--gold-deep')); g.setAttribute('opacity','0.75'); g.textContent='👁';
        svg.appendChild(g);
      }
      if(sr.labels){ ex.forEach((n,i)=>{ const x=vnotes[i].getAbsoluteX(); const t=document.createElementNS('http://www.w3.org/2000/svg','text');
        t.setAttribute('x',x); t.setAttribute('y',H-10); t.setAttribute('text-anchor','middle'); t.setAttribute('font-size','11.5');
        t.setAttribute('fill', (sr._status[i]==='current')?srCss('--gold-deep'):srCss('--ink-faint')); t.textContent=n.letter+n.octave; svg.appendChild(t); }); }
    }
  }catch(e){ srRenderStaffFallback(); }
}
function srRenderStaffFallback(){
  const wrap=document.getElementById('srStaffWrap'); if(!wrap) return;
  const ex=sr.exercise, clef=sr.clef;
  const LG=14, staffTop=58, x0=88, dx=60;
  const W=Math.max(330, x0 + ex.length*dx + 30), H=198;
  const bottomLineY=staffTop+4*LG;
  const bottomRef = clef==='bass' ? srDi('G',2) : srDi('E',4);
  let lines=''; for(let k=0;k<5;k++) lines+=`<line class="sr-staff-line" x1="20" y1="${staffTop+k*LG}" x2="${W-16}" y2="${staffTop+k*LG}"/>`;
  const clefGlyph = clef==='bass' ? '𝄢' : '𝄞';
  const clefY = clef==='bass' ? staffTop+LG*1.55 : bottomLineY+4;

  // soft highlight column behind the note currently being read
  let band='';
  if(sr.playing && sr.idx<ex.length){ const cx=x0+sr.idx*dx; band=`<rect class="sr-cur-band" x="${cx-26}" y="${staffTop-20}" width="52" height="${4*LG+40}" rx="14"/>`; }

  let notesSvg='';
  ex.forEach((n,i)=>{
    const x=x0+i*dx;
    const steps=srDi(n.letter,n.octave)-bottomRef;
    const y=bottomLineY-steps*(LG/2);
    const status=sr._status[i]||'upcoming';
    let ledg='';
    if(steps<0) for(let s=-2;s>=steps;s-=2){ const ly=bottomLineY-s*(LG/2); ledg+=`<line class="sr-ledger" x1="${x-13}" y1="${ly}" x2="${x+13}" y2="${ly}"/>`; }
    if(steps>8) for(let s=10;s<=steps;s+=2){ const ly=bottomLineY-s*(LG/2); ledg+=`<line class="sr-ledger" x1="${x-13}" y1="${ly}" x2="${x+13}" y2="${ly}"/>`; }
    const open = n.dur>=2;                          // half / whole = hollow
    const stem = n.dur<4;                           // whole note = no stem
    const head = `<ellipse class="sr-notehead" cx="${x}" cy="${y}" rx="8" ry="6" transform="rotate(-18 ${x} ${y})"/>`
               + (open ? `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="2.6" fill="var(--surface)" transform="rotate(-18 ${x} ${y})"/>` : '');
    const up = steps<=4;
    const stemSvg = stem ? `<line class="sr-notestem" x1="${x+(up?7.5:-7.5)}" y1="${y}" x2="${x+(up?7.5:-7.5)}" y2="${y+(up?-1:1)*36}"/>` : '';
    const acc = n.name.length>1 ? `<text class="sr-acc" x="${x-18}" y="${y+5.5}">${n.name.slice(1)}</text>` : '';
    const lbl = sr.labels ? `<text class="sr-nlabel" x="${x}" y="${H-10}">${n.letter}${n.octave}</text>` : '';
    notesSvg += `<g class="sr-note ${status}">${ledg}${acc}${head}${stemSvg}${lbl}</g>`;
  });
  wrap.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="music staff">`
    + band + lines + `<text class="sr-clef" x="28" y="${clefY}" font-size="${clef==='bass'?44:58}">${clefGlyph}</text>`
    + notesSvg + `</svg>`;
}

/* ---------- setup screen ---------- */
function srChips(hostId, items, isOn, pick){
  const host=document.getElementById(hostId); if(!host) return;
  host.innerHTML='';
  items.forEach(it=>{
    const b=document.createElement('button');
    b.className='dchip'+(isOn(it)?' on':'')+(it.soon?' soon':'');
    b.textContent = it.label + (it.soon?' · soon':'');
    if(!it.soon) b.addEventListener('click',()=>{ pick(it); buzz(); });
    host.appendChild(b);
  });
}
function srRenderHarp(){
  srResolveScale();
  const host=document.getElementById('srHarp'); if(!host) return;
  const leverMode = (typeof pfLeverMode!=='undefined' && pfLeverMode==='partial') ? `partial (${7-(pfNoLevers?pfNoLevers.size:0)}/7)` : 'full levers';
  const up = sr.leversUp.length ? sr.leversUp.join(' · ') : 'none — home tuning';
  const notes = sr.mode.notes.map(n=>`<span class="srh-n">${n}</span>`).join('');
  const warn = !sr.clean ? `<div class="srh-warn">⚠ Some notes of this scale aren’t reachable on your ${tuneBase} harp with your current levers. Raise the needed levers in <b>My Harp</b>, or pick another scale.</div>` : '';
  host.innerHTML =
     `<div class="srh-row"><span class="srh-k">Base tuning</span><span class="srh-v">${TBASES[tuneBase].label}</span></div>`
    +`<div class="srh-row"><span class="srh-k">Levers</span><span class="srh-v">${leverMode}</span></div>`
    +`<div class="srh-row"><span class="srh-k">Levers up</span><span class="srh-v">${up}</span></div>`
    +`<div class="srh-row"><span class="srh-k">Reading in</span><span class="srh-v">${sr.mode.root} ${sr.mode.name}</span></div>`
    +`<div class="srh-notes">${notes}</div>`+warn;
}
function srBuildSetup(){
  srChips('srLevel', SR_LEVELS, l=>l.key===sr.level, l=>{ sr.level=l.key; sr.bpm=l.bpm; sr.wait=l.wait; sr.labels=l.labels; srBuildSetup(); });
  srChips('srClef', SR_CLEFS, c=>c.key===sr.clef, c=>{ sr.clef=c.key; srRenderHarp(); });
  srChips('srType', SR_TYPES, t=>t.key===sr.type, t=>{ sr.type=t.key; if(t.key==='drone') sr.droneOn=true; srBuildOpts(); });
  srChips('srScale', SR_SCALES.map((s,i)=>({...s,_i:i})), s=>s._i===sr.scaleIdx, s=>{ sr.scaleIdx=s._i; srRenderHarp(); });
  srChips('srLen', SR_LENS.map(m=>({key:m,label:m+' min'})), o=>o.key===sr.lenMin, o=>{ sr.lenMin=o.key; srBuildSetup(); });
  srRenderHarp();
  srBuildOpts();
  triggerReveals(document.getElementById('view-sightread'));
}
function srBuildOpts(){
  const host=document.getElementById('srOpts'); if(!host) return;
  const sw=(id,on,b,sub)=>`<div class="sr-opt"><div class="sr-opt-l"><b>${b}</b><span>${sub}</span></div><div class="sr-switch${on?' on':''}" data-sw="${id}" role="switch" aria-checked="${on}"></div></div>`;
  host.innerHTML =
     sw('wait', sr.wait, 'Wait Mode', 'Hold each note until you play it right')
    +sw('lookahead', sr.lookahead, 'Look-ahead', 'Mark the next note — train your eyes to read ahead')
    +sw('labels', sr.labels, 'Show note names', 'Letter under each note')
    +sw('drone', sr.droneOn, 'Drone', 'A tonal pad in this mode')
    +sw('metro', sr.metroOn, 'Metronome', 'A steady pulse')
    +`<div class="sr-opt"><div class="sr-opt-l"><b>Tempo</b><span>beats per minute</span></div>`
    +`<div class="sr-stepper"><button data-bpm="-4">–</button><b id="srBpmV">${sr.bpm} BPM</b><button data-bpm="4">+</button></div></div>`;
  host.querySelectorAll('[data-sw]').forEach(el=>el.addEventListener('click',()=>{
    const k=el.dataset.sw; sr[k+ (k==='drone'?'On': k==='metro'?'On':'') ]= !sr[k==='drone'?'droneOn':k==='metro'?'metroOn':k];
    srBuildOpts(); buzz();
  }));
  host.querySelectorAll('[data-bpm]').forEach(el=>el.addEventListener('click',()=>{
    sr.bpm=Math.max(40,Math.min(160, sr.bpm + (+el.dataset.bpm))); const v=document.getElementById('srBpmV'); if(v)v.textContent=sr.bpm+' BPM'; buzz();
  }));
}

/* ---------- run / exercise loop ---------- */
function srStart(single){
  srResolveScale();
  if(sr.type==='note') single=false;
  sr.exercise = single ? [ {...srLadder()[0], dur:4} ] : srGenExercise();
  sr._status = sr.exercise.map(()=> 'upcoming');
  sr.idx=0; sr.playing=true; sr._hist=[]; sr._lockUntil=0;
  sr.stats = sr.stats && sr._continue ? sr.stats : {total:0,correct:0,almost:0,wrong:0,timing:[],cents:[],wrongByNote:{}};
  if(!sr.session) sr.session = {start:Date.now(), exercises:0, total:0, correct:0};
  sr._continue=false;
  document.getElementById('srSetup').hidden=true;
  document.getElementById('srScore').hidden=true;
  document.getElementById('srRun').hidden=false;
  srRenderInfo();
  if(sr.droneOn) srSetDrone(true);
  if(sr.metroOn) srSetMetro(true);
  srArm(0);
  if(!sr.micOn) srToggleMic(true);
  triggerReveals(document.getElementById('view-sightread'));
}
function srRenderInfo(){
  const host=document.getElementById('srInfo'); if(!host) return;
  const lvl=srSpan(), tp=SR_TYPES.find(t=>t.key===sr.type);
  host.innerHTML =
     `<div class="sr-i-title">${tp.label} — ${sr.mode.root} ${sr.mode.name}</div>`
    +`<span>Level <b>${lvl.label}</b></span><span>Clef <b>${sr.clef==='bass'?'Bass':'Treble'}</b></span>`
    +`<span>Levers up <b>${sr.leversUp.length?sr.leversUp.join(' · '):'none'}</b></span>`
    +`<span>${sr.bpm} BPM</span>${sr.wait?'<span>Wait Mode</span>':''}`;
  document.getElementById('srProgress').textContent = `Note ${Math.min(sr.idx+1,sr.exercise.length)} / ${sr.exercise.length}`;
}
function srArm(i){
  clearTimeout(sr._armTimer);
  sr.idx=i;
  sr._status = sr._status.map((s,k)=> k<i ? s : (k===i?'current':'upcoming'));
  sr.playing=true; sr._hist=[];
  srRenderStaff(); if(sr.scoreMode) srRenderInfoScore(); else srRenderInfo();
  const n=sr.exercise[i];
  srLeverReminder(n);
  srSetFeedback('', `Play <b>${n.name}${n.octave}</b>`, sr.wait?'Listening… take your time.':'Listening…');
  sr._noteAt = performance.now();
  if(!sr.wait){
    const spb=60/sr.bpm, ms=n.dur*spb*1000 + 1400;     // grace for harp sustain
    sr._armTimer=setTimeout(()=>{ if(sr.idx===i && sr.playing) srResolve(i,'miss'); }, ms);
  }
}
function srResolve(i, kind, detName, cents){
  if(sr.idx!==i) return;
  clearTimeout(sr._armTimer);
  const n=sr.exercise[i];
  if(kind==='ok') srRecord(n,true); else if(kind==='wrong'||kind==='lever'||kind==='miss') srRecord(n,false);
  sr.stats.total++; sr.session.total++;
  if(kind==='ok'){
    sr.stats.correct++; sr.session.correct++;
    sr._status[i]='done-ok';
    let timing=''; if(!sr.wait){ const spb=60/sr.bpm; const expected=sr.startedAt + srCumBeats(i)*spb*1000; const d=performance.now()-expected; sr.stats.timing.push(d);
      timing = Math.abs(d)<160?'Good timing.': d>0?'Slightly late.':'Slightly early.'; }
    if(typeof cents==='number'){ sr.stats.cents.push(cents); }
    const tune = (typeof cents==='number' && Math.abs(cents)>=6) ? ` Your ${n.letter} sounds ${Math.abs(cents)} cents ${cents>0?'sharp':'flat'}.` : '';
    srSetFeedback('ok', 'Correct.', (timing+tune).trim() || 'Beautifully in tune.');
  } else if(kind==='octave'){
    sr.stats.almost++; sr._status[i]='current';
    srSetFeedback('almost', `Right note — wrong octave.`, `That was ${detName}. Find ${n.name}${n.octave}.`);
    sr._lockUntil=performance.now()+900; srRenderStaff(); return;   // don't advance in either mode
  } else if(kind==='lever'){
    sr.stats.wrong++; srCountWrong(n); sr._status[i]= sr.wait?'current':'done-bad';
    const dir = ((n.pc - tRootPC(detName))%12+12)%12===1 ? 'Raise' : 'Lower';
    srSetFeedback('bad', `You played ${detName} — expected ${n.name}.`, `${dir} the ${n.letter} lever, then play ${n.name}${n.octave}.`);
    if(sr.wait){ sr._lockUntil=performance.now()+900; srRenderStaff(); return; }
  } else if(kind==='miss'){
    sr.stats.wrong++; srCountWrong(n); sr._status[i]='done-bad';
    srSetFeedback('almost', `Let’s keep moving.`, `That one was ${n.name}${n.octave}. You’ll get it next pass.`);
  } else { /* wrong */
    sr.stats.wrong++; srCountWrong(n); sr._status[i]= sr.wait?'current':'done-bad';
    srSetFeedback('bad', `You played ${detName||'a different note'} — expected ${n.name}.`, srStepHint(detName,n));
    if(sr.wait){ sr._lockUntil=performance.now()+900; srRenderStaff(); return; }
  }
  srRenderStaff();
  sr._lockUntil = performance.now()+550;
  setTimeout(()=>{ if(sr.idx+1>=sr.exercise.length) srFinish(); else srArm(sr.idx+1); }, 700);
}
function srCumBeats(i){ let b=0; for(let k=0;k<i;k++) b+=sr.exercise[k].dur; return b; }
function srCountWrong(n){ const key=n.name+n.octave; sr.stats.wrongByNote[key]=(sr.stats.wrongByNote[key]||0)+1; }
function srStepHint(detName, n){
  if(!detName) return `Try again slowly — ${n.name} is the next target.`;
  const dPc=tRootPC(detName), diff=((n.pc-dPc)%12+12)%12;
  if(diff===1||diff===2) return `Almost — move up to ${n.name}.`;
  if(diff===10||diff===11) return `Almost — move down to ${n.name}.`;
  return `Look for ${n.name}${n.octave} and try again.`;
}
function srLeverReminder(n){
  const host=document.getElementById('srLever'); if(!host) return;
  const st = srLeverFor(n.letter, n.pc);
  if(st===null){ host.innerHTML = `<b>${n.name}${n.octave}</b> isn’t reachable on your ${tuneBase} harp — it needs a different tuning. Skip it or retune.`; return; }
  const word = st==='up' ? `the <b>${n.letter} lever up</b>` : st==='down' ? `the <b>${n.letter} lever down</b>` : `your <b>${n.letter}</b> string`;
  host.innerHTML = `Next: <b>${n.name}${n.octave}</b> — play ${word}.`;
}

/* ---------- MusicXML import (OpenSheetMusicDisplay) ---------- */
function srEsc(s){ const d=document.createElement('div'); d.textContent=String(s||''); return d.innerHTML; }
let _osmdLoading=null;
function srLoadOSMD(){
  if(window.opensheetmusicdisplay) return Promise.resolve(true);
  if(_osmdLoading) return _osmdLoading;
  _osmdLoading=new Promise((res,rej)=>{ const s=document.createElement('script'); s.src='vendor/osmd.js'; s.onload=()=>res(true); s.onerror=()=>rej(new Error('osmd load failed')); document.head.appendChild(s); });
  return _osmdLoading;
}
const SR_OSMD_LETTER={0:'C',2:'D',4:'E',5:'F',7:'G',9:'A',11:'B'};
function srExtractScore(osmd){
  const out=[]; let step=0, guard=0;
  osmd.cursor.reset();
  while(osmd.cursor.Iterator && !osmd.cursor.Iterator.EndReached && guard<4000){
    const notes=osmd.cursor.NotesUnderCursor().filter(n=>n.Pitch);
    if(notes.length){
      let top=notes[0]; notes.forEach(n=>{ if(n.Pitch.Frequency>top.Pitch.Frequency) top=n; });   // melody = top voice
      const info=freqToNote(top.Pitch.Frequency,440), midi=info.midi, pc=((midi%12)+12)%12;
      const letter=SR_OSMD_LETTER[top.Pitch.FundamentalNote]||info.name[0];
      const dur=(top.Length&&top.Length.RealValue?top.Length.RealValue:0.25)*4;
      out.push({name:tSpell(letter,pc), letter, octave:Math.floor(midi/12)-1, pc, midi, dur, step});
    }
    osmd.cursor.next(); step++; guard++;
  }
  osmd.cursor.reset();
  return out;
}
function srScoreCursorTo(i){
  const o=sr.osmd; if(!o||!o.cursor) return;
  const target=(sr.exercise[i]&&sr.exercise[i].step)||0;
  o.cursor.reset(); o.cursor.show();
  for(let s=0;s<target && o.cursor.Iterator && !o.cursor.Iterator.EndReached;s++) o.cursor.next();
}
function srRenderInfoScore(){
  const host=document.getElementById('srInfo'); if(!host) return;
  host.innerHTML = `<div class="sr-i-title">Reading — ${srEsc(sr.scoreTitle)}</div>`
    +`<span><b>${sr.exercise.length}</b> notes</span><span>Base tuning <b>${tuneBase}</b></span><span>Wait Mode</span>`;
  const prog=document.getElementById('srProgress'); if(prog) prog.textContent=`Note ${Math.min(sr.idx+1,sr.exercise.length)} / ${sr.exercise.length}`;
}
async function srStartScore(xmlText, title){
  const fail=(msg)=>{ srSetFeedback('bad','Couldn’t read that score', msg||'Use a MusicXML (.xml / .musicxml) file exported from your notation app.'); };
  try{
    await srLoadOSMD();
    if(!window.opensheetmusicdisplay){ srEnter(); fail(); return; }
    sr._scoreXml=xmlText; sr.scoreTitle=title||'Imported score'; sr.scoreMode=true;
    document.getElementById('srSetup').hidden=true; document.getElementById('srScore').hidden=true; document.getElementById('srRun').hidden=false;
    const wrap=document.getElementById('srStaffWrap'); wrap.innerHTML='<div id="srOsmd" class="sr-osmd"></div>';
    const oh=document.getElementById('srOsmd');
    if(oh && oh.clientWidth<80){ oh.style.width=Math.max(320,(window.innerWidth||0)-36, wrap.clientWidth||0)+'px'; }   // guard collapsed layout
    const osmd=new opensheetmusicdisplay.OpenSheetMusicDisplay(oh, {autoResize:true, drawTitle:false, drawPartNames:false, drawingParameters:'compacttight'});
    await osmd.load(xmlText); osmd.render(); sr.osmd=osmd; osmd.cursor.show();
    if(!sr._osmdResize){ sr._osmdResize=true; window.addEventListener('resize',()=>{ if(sr.scoreMode&&sr.osmd){ try{ const o=document.getElementById('srOsmd'); if(o) o.style.width=''; sr.osmd.render(); srScoreCursorTo(sr.idx); }catch(e){} } }); }
    const ex=srExtractScore(osmd);
    if(!ex.length){ sr.scoreMode=false; srEnter(); fail('No playable notes found in that file.'); return; }
    sr.exercise=ex; sr._status=ex.map(()=> 'upcoming'); sr.idx=0; sr.playing=true; sr._hist=[]; sr._lockUntil=0; sr.wait=true;
    sr.stats={total:0,correct:0,almost:0,wrong:0,timing:[],cents:[],wrongByNote:{}};
    if(!sr.session) sr.session={start:Date.now(),exercises:0,total:0,correct:0};
    srRenderInfoScore(); srArm(0);
    if(!sr.micOn) srToggleMic(true);
    triggerReveals(document.getElementById('view-sightread'));
  }catch(e){ console.warn('score import failed:', e); sr.scoreMode=false; srEnter(); fail(); }
}

/* ---------- microphone evaluation ---------- */
function srToggleMic(force){
  const want = (typeof force==='boolean') ? force : !sr.micOn;
  const btn=document.getElementById('srMic'), lbl=document.getElementById('srMicLabel');
  if(want){
    Tuner.onUpdate=srOnPitch;
    Tuner.onError=()=>{ if(lbl) lbl.textContent='Allow microphone, then tap again'; btn&&btn.classList.remove('live'); sr.micOn=false; };
    Tuner.start();
    sr.micOn=true; if(sr.startedAt===0) sr.startedAt=performance.now();
    btn&&btn.classList.add('live'); if(lbl) lbl.textContent='Listening…';
  } else {
    if(Tuner.running) Tuner.stop();
    sr.micOn=false; btn&&btn.classList.remove('live'); if(lbl) lbl.textContent='Tap to listen';
  }
}
function srOnPitch(freq, note){
  if(!sr.playing || !note || freq<=0){ return; }
  srSetReadout(`Hearing <b>${note.name}${note.octave}</b>`);
  if(performance.now() < sr._lockUntil) return;
  sr._hist.push(note.midi); if(sr._hist.length>6) sr._hist.shift();
  /* stable detection: same midi for >=3 of last frames (harp resonance is noisy) */
  const counts={}; sr._hist.forEach(m=>counts[m]=(counts[m]||0)+1);
  let cand=null,best=0; for(const m in counts){ if(counts[m]>best){ best=counts[m]; cand=+m; } }
  if(best<3) return;
  srEvaluate(cand, note.cents, note);
}
function srEvaluate(detMidi, cents, note){
  const i=sr.idx, n=sr.exercise[i]; if(!n) return;
  sr._hist=[];
  if(sr.type==='rhythm'){                                  // rhythm: any clear onset counts
    srResolve(i,'ok', note.name+note.octave, cents); return;
  }
  if(detMidi===n.midi){ srResolve(i,'ok', note.name+note.octave, cents); return; }
  if(detMidi%12===n.pc){ srResolve(i,'octave', note.name+note.octave, cents); return; }
  const detName=note.name;
  if(detName[0]===n.letter){ srResolve(i,'lever', detName, cents); return; }
  srResolve(i,'wrong', detName+note.octave, cents);
}

/* ---------- score ---------- */
function srFinish(){
  clearTimeout(sr._armTimer); sr.playing=false;
  sr.session.exercises++;
  const s=sr.stats, total=Math.max(1,s.total);
  const noteAcc=Math.round(s.correct/total*100);
  const timed=s.timing.filter(d=>Math.abs(d)<160).length;
  const rhythmAcc = s.timing.length ? Math.round(timed/s.timing.length*100) : (sr.wait?100:0);
  const avgCents = s.cents.length ? Math.round(s.cents.reduce((a,b)=>a+Math.abs(b),0)/s.cents.length) : null;
  const tuneTxt = avgCents==null?'—': avgCents<=6?'Good': avgCents<=14?'Fair':'Drifting';
  const weak = Object.entries(s.wrongByNote).sort((a,b)=>b[1]-a[1]).slice(0,3).map(e=>e[0]);
  const trackedWeak = Object.entries(srSkill).filter(([k,v])=>v.weak>0.34).sort((a,b)=>b[1].weak-a[1].weak).slice(0,3).map(e=>e[0]);
  /* adaptive suggestion */
  let sug;
  if(noteAcc<70) sug = `Let’s steady the notes — repeat at <b>${Math.max(40,sr.bpm-8)} BPM</b> with note names on and Wait Mode.`;
  else if(!sr.wait && rhythmAcc<70) sug = `Your notes are landing — repeat the same melody at <b>${Math.max(40,sr.bpm-6)} BPM</b> with a stronger pulse.`;
  else sug = `Lovely. Add one note and nudge the tempo to <b>${Math.min(160,sr.bpm+6)} BPM</b>${sr.labels?' — try it with note names hidden':''}.`;

  document.getElementById('srRun').hidden=true;
  const card=document.getElementById('srScoreCard');
  card.innerHTML =
     `<div class="sr-bigstat"><div class="v">${noteAcc}%</div><div class="l">Note accuracy</div></div>`
    +`<div class="sr-statgrid">`
    +`<div class="sr-stat"><div class="v">${rhythmAcc}%</div><div class="l">Rhythm accuracy</div></div>`
    +`<div class="sr-stat"><div class="v">${tuneTxt}</div><div class="l">Tuning${avgCents!=null?` · ±${avgCents}¢`:''}</div></div>`
    +`<div class="sr-stat"><div class="v">${weak.length?weak.join(', '):'—'}</div><div class="l">Weak notes</div></div>`
    +`<div class="sr-stat"><div class="v">${sr.session.exercises}</div><div class="l">Exercises this session</div></div>`
    +`</div>`
    +`<div class="sr-suggest"><b>Next step:</b> ${sug}</div>`
    + (trackedWeak.length?`<div class="sr-suggest" style="margin-top:8px"><b>Spaced repetition:</b> I’ll keep resurfacing your weak notes — ${trackedWeak.join(', ')}.</div>`:'');
  const btns=document.getElementById('srScoreBtns');
  btns.innerHTML =
     `<button data-sa="repeat">Repeat</button>`
    +`<button data-sa="easier">Make easier</button>`
    +`<button data-sa="next" class="primary">Next exercise ›</button>`
    +`<button data-sa="save">Save to journal</button>`
    +`<button data-sa="coach">Ask AI Coach</button>`;
  btns.querySelectorAll('[data-sa]').forEach(b=>b.addEventListener('click',()=>srScoreAction(b.dataset.sa)));
  document.getElementById('srScore').hidden=false;
  triggerReveals(document.getElementById('view-sightread'));
  buzz();
}
function srScoreAction(a){
  if(sr.scoreMode && (a==='repeat'||a==='easier')){ srStartScore(sr._scoreXml, sr.scoreTitle); return; }
  if(sr.scoreMode && a==='next'){ srEnter(); return; }
  if(a==='repeat'){ sr._continue=true; srStart(false); }
  else if(a==='easier'){ srEasier(); sr._continue=true; srStart(false); }
  else if(a==='next'){ sr.stats=null; srStart(false); }
  else if(a==='save'){ srSaveSession(); }
  else if(a==='coach'){ srSaveSession(false); showView('coach'); }
}
function srEasier(){
  const order=['adv','int','early','beg','abs']; const i=order.indexOf(sr.level);
  sr.bpm=Math.max(40,sr.bpm-8); sr.wait=true; sr.labels=true;
  if(i>=0 && i<order.length-1 && sr.stats && sr.stats.correct/Math.max(1,sr.stats.total)<0.6) sr.level=order[i+1];
}
function srSaveSession(toast){
  const s=sr.session; if(!s){ return; }
  const noteAcc = s.total?Math.round(s.correct/s.total*100):0;
  logSession({ date:new Date().toISOString(), type:'sightread', minutes:sr.lenMin,
    key:sr.mode.root, world:sr.mode.name, label:`Sight reading · ${sr.mode.root} ${sr.mode.name}`,
    detail:`${SR_TYPES.find(t=>t.key===sr.type).label} · ${noteAcc}% notes · ${s.exercises} exercises` });
  if(toast!==false){
    const card=document.getElementById('srScoreCard');
    if(card) card.insertAdjacentHTML('afterbegin',`<div class="sr-suggest" style="text-align:center">Saved to your Practice Journal ✓</div>`);
  }
  buzz();
}

/* ---------- drone / metronome / AI hints ---------- */
function srSetDrone(on){
  sr.droneOn=on; document.getElementById('srDroneBtn')?.classList.toggle('on',on);
  if(on){ Drone.followWheel=false; Drone.setRoot(sr.mode.root); if(!Drone.playing) Drone.start(); if(typeof updateNowPlaying==='function') updateNowPlaying(); }
  else { if(Drone.playing) Drone.stop(); if(typeof updateNowPlaying==='function') updateNowPlaying(); }
}
function srSetMetro(on){
  sr.metroOn=on; document.getElementById('srMetroBtn')?.classList.toggle('on',on);
  Metro.setBpm(sr.bpm);
  if(on){ Metro.onBeat=null; Metro.start(); } else { Metro.stop(); }
}
const SR_PROMPTS = [
  {label:'Make this easier', k:'easier'}, {label:'Slow this down', k:'slow'},
  {label:'Show note names', k:'show'}, {label:'Hide note names', k:'hide'},
  {label:'Give me a hint', k:'hint'}, {label:'Why was this wrong?', k:'why'},
  {label:'Practice this again', k:'repeat'}, {label:'Add a drone', k:'drone'},
  {label:'Remove the rhythm', k:'norhythm'}, {label:'Train my bass clef', k:'bass'},
  {label:'5-minute session', k:'five'}, {label:'Help with D Dorian', k:'dorian'},
  {label:'Read accidentals', k:'accidentals'},
];
function srBuildPrompts(){
  const host=document.getElementById('srPrompts'); if(!host) return; host.innerHTML='';
  SR_PROMPTS.forEach(p=>{ const b=document.createElement('button'); b.textContent=p.label;
    b.addEventListener('click',()=>srHint(p.k)); host.appendChild(b); });
}
function srHintOut(html){ const o=document.getElementById('srHintOut'); if(o){ o.innerHTML=html; o.classList.add('show'); } }
function srHint(k){
  const n=sr.exercise[sr.idx]||{}; buzz();
  switch(k){
    case 'easier': srEasier(); srHintOut(`Easing off — slower tempo, Wait Mode and note names on. Tap <b>Repeat</b> below to try again.`); srRenderStaff(); break;
    case 'slow': sr.bpm=Math.max(40,sr.bpm-8); Metro.setBpm(sr.bpm); srRenderInfo(); srHintOut(`Tempo down to <b>${sr.bpm} BPM</b>. Breathe, and read one note at a time.`); break;
    case 'show': sr.labels=true; srRenderStaff(); srHintOut(`Note names on. Each letter sits under its notehead.`); break;
    case 'hide': sr.labels=false; srRenderStaff(); srHintOut(`Note names hidden — trust your eyes on the staff.`); break;
    case 'hint': { const st=sr.levers?sr.levers[n.letter]:null; srHintOut(`Look for the <b>${n.letter}</b> string${st==='up'?` with its lever <b>up</b>`:st==='down'?` (lever down)`:''}. The written note is <b>${n.name}${n.octave}</b>.`); break; }
    case 'why':
      if(typeof SohAI!=='undefined' && SohAI.state==='ready'){
        srHintOut(`<b>Harper</b> is thinking…`);
        SohAI.ask(`On a ${tuneBase}-base lever harp, in ${sr.mode.root} ${sr.mode.name}, the student is reading toward ${n.name}${n.octave}. Give one short, kind tip to find and read this note.`,
          full=>srHintOut(`<b>Harper:</b> ${coachFmt(full)}`));
      } else {
        srHintOut(`Read the notehead’s line or space, then name it before you play. Right now you’re aiming for <b>${n.name}${n.octave}</b>.`);
      }
      break;
    case 'repeat': sr._continue=true; srStart(false); break;
    case 'drone': srSetDrone(true); srHintOut(`A <b>${sr.mode.root}</b> drone is sounding — let every note lean toward home.`); break;
    case 'norhythm': sr.exercise=sr.exercise.map(x=>({...x,dur:4})); srRenderStaff(); srHintOut(`Rhythm removed — even notes, no pressure. Just find the pitches.`); break;
    case 'bass': sr.clef='bass'; srHintOut(`Switched to bass clef. Tap <b>Repeat</b> to read the lower range.`); sr._continue=true; srStart(false); break;
    case 'five': sr.lenMin=5; srHintOut(`Set a gentle 5-minute session. Keep going — I’ll track your progress.`); break;
    case 'dorian': sr.scaleIdx=SR_SCALES.findIndex(s=>s.label==='D Dorian'); srResolveScale(); srHintOut(`D Dorian: D E F G A B C — a minor sound with a bright natural 6th (the B). Tap <b>Repeat</b> to read it.`); break;
    case 'accidentals': sr.type='lever'; srHintOut(`Lever Reading on. A sharp ♯ means raise that string’s lever; a flat ♭ means lower it. Watch for the lever note in the line.`); sr._continue=true; srStart(false); break;
  }
}

/* ---------- helpers, enter/leave, init ---------- */
function srSetReadout(html){ const r=document.getElementById('srReadout'); if(r) r.innerHTML=html; }
function srSetFeedback(cls, main, sub){
  const f=document.getElementById('srFeedback'); if(!f) return;
  f.className='sr-feedback '+(cls||'');
  const ico = cls==='ok'?'✓' : cls==='almost'?'◐' : cls==='bad'?'✕' : '♪';
  f.innerHTML=`<div class="sr-fb-ico">${ico}</div><div class="sr-fb-text"><div class="sr-fb-main">${main}</div>`
    +(sub?`<div class="sr-fb-sub">${sub}</div>`:'')+`</div>`;
}
function srEnter(){
  if(!sr._init) initSightRead();
  sr.scoreMode=false; sr.osmd=null;
  document.getElementById('srRun').hidden=true;
  document.getElementById('srScore').hidden=true;
  document.getElementById('srSetup').hidden=false;
  srBuildSetup();
}
function srLeave(){
  if(sr.micOn) srToggleMic(false);
  if(sr.metroOn){ Metro.stop(); }
  if(sr.droneOn && Drone.playing){ Drone.stop(); if(typeof updateNowPlaying==='function') updateNowPlaying(); }
  clearTimeout(sr._armTimer); sr.playing=false;
}
function initSightRead(){
  if(sr._init) return; sr._init=true;
  srLoadSkill();
  srBuildPrompts();
  document.getElementById('srStart')?.addEventListener('click',()=>{ srStart(false); });
  document.getElementById('srQuick')?.addEventListener('click',()=>{ sr.type='note'; sr.level='abs'; sr.bpm=54; sr.wait=true; sr.labels=true; srStart(true); });
  document.getElementById('srMic')?.addEventListener('click',()=>srToggleMic());
  document.getElementById('srPlay')?.addEventListener('click',()=>{ sr.playing=!sr.playing; document.getElementById('srPlay').textContent=sr.playing?'Pause':'Start'; if(sr.playing){ srArm(sr.idx); if(!sr.micOn) srToggleMic(true); } else { clearTimeout(sr._armTimer); srRenderStaff(); } });
  document.getElementById('srRepeat')?.addEventListener('click',()=>{ sr._continue=true; srStart(false); });
  document.getElementById('srNext')?.addEventListener('click',()=>{ srResolve(sr.idx,'miss'); });
  document.getElementById('srOverride')?.addEventListener('click',()=>{ srResolve(sr.idx,'ok', sr.exercise[sr.idx]?.name+sr.exercise[sr.idx]?.octave, 0); });
  document.getElementById('srExit')?.addEventListener('click',()=>{ srLeave(); srEnter(); });
  document.getElementById('srScoreExit')?.addEventListener('click',()=>{ srEnter(); });
  document.getElementById('srDroneBtn')?.addEventListener('click',()=>srSetDrone(!sr.droneOn));
  document.getElementById('srMetroBtn')?.addEventListener('click',()=>srSetMetro(!sr.metroOn));
  document.getElementById('srSampleBtn')?.addEventListener('click',async()=>{ buzz();
    try{ const xml=await (await fetch('samples/ode-to-joy.musicxml')).text(); srStartScore(xml,'Ode to Joy (theme)'); }
    catch(e){ srSetFeedback('bad','Couldn’t load the sample','Check your connection and try again.'); } });
  document.getElementById('srFile')?.addEventListener('change',(e)=>{ const f=e.target.files&&e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=()=>srStartScore(String(r.result), f.name.replace(/\.[^.]+$/,'')); r.readAsText(f); e.target.value=''; });
}

/* ---------- init ---------- */
loadProfile();           // apply the player's harp (base + partial levers) before building views
loadJournal();
rebuildModes();
buildKeyBar();
renderKey();
buildBaseSeg();
buildCatChips();
renderTune();
initDrone();
initRhythm();
initPractice();
buildRepertoire();
initTuner();
initLevers();
initProfile();
initCoach();
initCompass();
initNowPlaying();
renderHome();
buildJourney();
addSwipe(document.querySelector('#view-modes .wheel-wrap'), {
  onLeft:()=>setMode((activeMode+1)%7, true),
  onRight:()=>setMode((activeMode+6)%7, true),
});
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
sohApplyFlags();   // beta focus: hide entry points of workshop features
document.getElementById('harpieFab')?.addEventListener('click',()=>{ if(typeof harpieOpenGlobal==='function') harpieOpenGlobal(); });
document.getElementById('learnSearch')?.addEventListener('click',()=>{ if(typeof harpieOpenGlobal==='function') harpieOpenGlobal(); });
showView('home');
observeReveals();

/* ============================================================
   THEME TOGGLE — Dark Luxe (default) ⇄ Klaf parchment light
   ============================================================ */
function sohThemeSet(t){
  if(t==='light') document.documentElement.dataset.theme='light';
  else delete document.documentElement.dataset.theme;
  try{ localStorage.setItem('soh-theme', t==='light'?'light':'dark'); }catch(e){}
  const b=document.getElementById('themeToggle'); if(b) b.textContent = t==='light' ? '☾' : '☀';
}
(function initTheme(){
  const cur=document.documentElement.dataset.theme==='light'?'light':'dark';
  const b=document.getElementById('themeToggle'); if(b){ b.textContent=cur==='light'?'☾':'☀';
    b.addEventListener('click',e=>{ e.stopPropagation(); e.preventDefault();
      sohThemeSet(document.documentElement.dataset.theme==='light'?'dark':'light'); buzz(); }); }
})();

/* ============================================================
   HARP PROFILE + ONBOARDING — the app knows your instrument
   ============================================================ */
const SOH_HARPS=[
  {id:'22-lap',t:'22-string lap harp',strings:22},{id:'25-lap',t:'25-string lap harp',strings:25},
  {id:'26-lap',t:'26-string lever harp',strings:26},{id:'27-lap',t:'27-string lap harp',strings:27},
  {id:'29-lap',t:'29-string lap harp',strings:29},{id:'34-lever',t:'34-string lever harp',strings:34},
  {id:'36-lever',t:'36/38-string lever harp',strings:36},
  {id:'pedal',t:'Pedal harp',strings:47},{id:'unsure',t:'I’m not sure yet',strings:34},
];
function sohHarpLabel(id){ const h=SOH_HARPS.find(x=>x.id===id); return h?h.t:(id||'Lever harp'); }
const SOH_STYLES=['Jewish · Hebraic','Contemplative','Celtic','Folk','Classical','Worship','Sephardic · Middle Eastern','Jazz','Improvisation','Therapeutic'];
function sohProfile(){ try{ return JSON.parse(localStorage.getItem('soh-profile')||'{}'); }catch(e){ return {}; } }
function sohProfileSave(p){ try{ localStorage.setItem('soh-profile',JSON.stringify(p)); }catch(e){} }
/* — Multiple harps (community request) —
   P.harps = [{type:'34-lever', tuning:'E♭'}, …], P.active = index.
   The legacy P.harp / P.tuning fields always MIRROR the active harp, so every
   existing reader (Harpie context, Today's Path, profile line…) keeps working. */
function sohHarps(){
  const P=sohProfile();
  if(Array.isArray(P.harps)&&P.harps.length) return P.harps;
  return P.harp ? [{type:P.harp, tuning:P.tuning||'E♭'}] : [];
}
function sohActiveIdx(){ const P=sohProfile(); const n=sohHarps().length; return Math.max(0,Math.min(P.active||0, n-1)); }
function sohActiveHarp(){ const hs=sohHarps(); return hs.length?hs[sohActiveIdx()]:null; }
function sohApplyTuning(t){
  if(typeof tuneBase==='undefined') return;
  const base = t==='C' ? 'C' : 'E♭';
  if(tuneBase!==base){ tuneBase=base; try{ tuneScales=generateScales(base); }catch(e){} }
}
function sohSetActiveHarp(i){
  const P=sohProfile(); const hs=sohHarps();
  if(i<0||i>=hs.length) return;
  P.harps=hs; P.active=i; P.harp=hs[i].type; P.tuning=hs[i].tuning;
  sohProfileSave(P); sohApplyTuning(hs[i].tuning);
}
function sohRemoveHarp(i){
  const P=sohProfile(); const hs=sohHarps();
  if(hs.length<2||i<0||i>=hs.length) return;      // never remove the last harp
  hs.splice(i,1);
  P.harps=hs; P.active=Math.min(sohActiveIdx(), hs.length-1);
  P.harp=hs[P.active].type; P.tuning=hs[P.active].tuning;
  sohProfileSave(P); sohApplyTuning(P.tuning);
}
function sohProfileLine(){
  const P=sohProfile(); if(!P.harp) return `The player's harp base tuning is ${tuneBase}.`;
  const h=SOH_HARPS.find(x=>x.id===P.harp)||SOH_HARPS[4];
  return `The player plays a ${h.t} (${h.strings} strings), tuned in ${P.tuning||'E♭'}${P.styles&&P.styles.length?`, and loves: ${P.styles.join(', ')}`:''}.`;
}
let _obStep=0,_obDraft=null,_obBound=false,_obAdd=false;
function sohOnboardOpen(addMode){
  _obAdd=!!addMode;
  _obStep=0;
  _obDraft=_obAdd ? {harp:null,tuning:null,styles:(sohProfile().styles||[])}
                  : Object.assign({harp:null,tuning:null,styles:[]},sohProfile());
  if(!_obBound){ _obBound=true;
    document.getElementById('obClose')?.addEventListener('click',sohOnboardClose);
    document.getElementById('obBack')?.addEventListener('click',()=>{ if(_obStep>0){_obStep--;obRender();} });
    document.getElementById('obNext')?.addEventListener('click',()=>{ const last=_obAdd?1:2; if(_obStep<last){_obStep++;obRender();} else obFinish(); });
  }
  document.getElementById('obPanel').hidden=false; document.body.classList.add('hp-open'); obRender();
}
function sohOnboardClose(){ document.getElementById('obPanel').hidden=true; document.body.classList.remove('hp-open'); }
/* Open the first-run harp onboarding ONLY when nothing is in front of it.
   The auth gate (z-index 220) sits above the onboarding (z-index 130); if both
   are open at once the gate silently eats every tap meant for the harp options.
   So we never open onboarding while the gate is visible — the gate-dismissal
   paths (guest + successful sign-in) re-invoke this once they close. */
function sohMaybeOnboard(){
  try{
    if(typeof sohProfile==='function' && sohProfile().harp) return;   // already chosen
    const gate=document.getElementById('authGate');
    if(gate && !gate.hidden) return;                                  // gate currently up — it will call us back
    // The gate appears ASYNCHRONOUSLY once Firebase resolves, which can land after
    // our timer. If a gate is still *coming* (Firebase configured + no auth choice
    // made yet), stay closed and let the gate-dismissal path open us instead.
    const cfg=window.SOH_FIREBASE_CONFIG;
    let choice=null; try{ choice=localStorage.getItem('soh-auth-choice'); }catch(e){}
    if(cfg && cfg.apiKey && choice!=='1' && !(window.SOH_SYNC && SOH_SYNC.user)) return;
    const ob=document.getElementById('obPanel');
    if(ob && !ob.hidden) return;                                      // already open
    sohOnboardOpen();
  }catch(e){}
}
window.sohMaybeOnboard=sohMaybeOnboard;
function obRender(){
  const b=document.getElementById('obBody'), lbl=document.getElementById('obStepLabel');
  const steps=_obAdd?['1 of 2 · your new harp','2 of 2 · its tuning']
                    :['1 of 3 · your instrument','2 of 3 · your tuning','3 of 3 · what calls you'];
  if(lbl) lbl.textContent=steps[_obStep];
  document.getElementById('obBack').style.visibility=_obStep?'visible':'hidden';
  const last=_obAdd?1:2;
  document.getElementById('obNext').textContent=_obStep<last?'Next ›':(_obAdd?'Add harp ✦':'Begin ✦');
  if(_obStep===0) b.innerHTML=`<div class="ob-q">What harp do you play?</div><div class="ob-opts">${SOH_HARPS.map(h=>`<button class="ob-opt${_obDraft.harp===h.id?' on':''}" data-v="${h.id}">${h.t}</button>`).join('')}</div>`;
  else if(_obStep===1) b.innerHTML=`<div class="ob-q">How is it tuned?</div><div class="ob-opts">${['E♭','C','Other / not sure'].map(t=>`<button class="ob-opt${_obDraft.tuning===t?' on':''}" data-v="${t}">${t==='E♭'?'E♭ major — three flats, the classic lever tuning':t==='C'?'C major — all naturals':'Other / not sure'}</button>`).join('')}</div>`;
  else b.innerHTML=`<div class="ob-q">Which styles are calling you? <span class="ob-multi">choose any</span></div><div class="ob-opts ob-grid">${SOH_STYLES.map(s=>`<button class="ob-opt${_obDraft.styles.includes(s)?' on':''}" data-v="${s}">${s}</button>`).join('')}</div>`;
  b.querySelectorAll('.ob-opt').forEach(o=>o.addEventListener('click',()=>{
    const v=o.dataset.v;
    if(_obStep===0) _obDraft.harp=v;
    else if(_obStep===1) _obDraft.tuning=v;
    else { const i=_obDraft.styles.indexOf(v); if(i>=0)_obDraft.styles.splice(i,1); else _obDraft.styles.push(v); }
    obRender(); buzz();
  }));
}
function obFinish(){
  if(!_obDraft.harp) _obDraft.harp='34-lever';
  const tuning=_obDraft.tuning==='C'?'C':'E♭';
  const P=sohProfile(); const hs=sohHarps();
  if(_obAdd && hs.length){ hs.push({type:_obDraft.harp, tuning}); P.active=hs.length-1; }
  else { const i=hs.length?sohActiveIdx():0; hs[i]={type:_obDraft.harp, tuning}; P.active=i; }  // edit = replace active harp
  P.harps=hs; P.styles=_obDraft.styles||P.styles||[];
  P.harp=hs[P.active].type; P.tuning=hs[P.active].tuning;   // legacy mirror = active harp
  sohProfileSave(P); sohApplyTuning(hs[P.active].tuning);
  sohOnboardClose(); renderHome(); try{ buildYou(); }catch(e){} buzz();
}

/* ============================================================
   TODAY'S HARP PATH — the daily loop (Duolingo habit, harpist soul)
   ============================================================ */
function todayPathSteps(){
  const P=sohProfile(), day=dayOfYear(), steps=[];
  steps.push({id:'tune',t:'Tune & settle',m:2,v:'tuner'});
  steps.push({id:'warm',t:'Warm hands — slow arpeggios',m:4,v:'practice'});
  const drills=[{id:'sight',t:'Sight-reading',m:5,v:'sightread'},{id:'ear',t:'Ear training',m:5,v:'eartraining'},
    {id:'rhythm',t:'Rhythm — find the pocket',m:5,v:'rhythm'},{id:'wheel',t:'One mode, slowly — the wheel',m:5,v:'modes'},
    {id:'circle',t:'Walk the Circle of Fifths',m:5,v:'circle'}].filter(s=>sohOn(s.v));
  if(drills.length) steps.push(drills[day%drills.length]);
  const r=nxResume();
  if(r) steps.push({id:'lesson',t:'Lesson · '+r.title,m:6,go:r.go});
  else steps.push({id:'lesson',t:'Begin a lesson',m:6,v:'theory'});
  if(sohOn('jacob') && typeof jacobNextStudyModule==='function'){ const jm=jacobNextStudyModule();
    if(jm) steps.push({id:'jstudy',t:'Study · '+jm.title,m:5,go:()=>{ showView('jacob'); jacobOpenModule(jm.n); }}); }
  const soulful=(P.styles||[]).some(s=>/Jewish|Contemplative|Worship|Therapeutic/.test(s));
  steps.push(soulful? {id:'soul',t:'Contemplative close — drone & breath',m:4,v:'meditation'}
                    : {id:'improv',t:'Improvise on the wheel',m:4,v:'modes'});
  return steps;
}
function todayPathKey(){ return 'soh-path-'+new Date().toISOString().slice(0,10); }
function buildTodayPath(){
  const host=document.getElementById('todayPath'); if(!host) return;
  const steps=todayPathSteps(); let done={};
  try{ done=JSON.parse(localStorage.getItem(todayPathKey())||'{}'); }catch(e){}
  const total=steps.reduce((a,s)=>a+s.m,0), left=steps.filter(s=>!done[s.id]).reduce((a,s)=>a+s.m,0);
  const all=steps.every(s=>done[s.id]);
  host.innerHTML=`<div class="tp-panel">
    <div class="tp-head"><span class="tp-kick">Today’s Harp Path</span><span class="tp-min">${all?'complete ✦':left+' of '+total+' min left'}</span></div>
    ${steps.map((s,i)=>`<div class="tp-row${done[s.id]?' done':''}" data-i="${i}">
      <button class="tp-check" data-i="${i}" aria-label="Mark done">${done[s.id]?'✓':''}</button>
      <span class="tp-t">${s.t}</span><span class="tp-m">${s.m} min</span></div>`).join('')}
    ${all?`<div class="tp-bless">You walked the whole path today. Your harp is remembering you.</div>`:''}
  </div>`;
  host.querySelectorAll('.tp-row').forEach(row=>row.addEventListener('click',e=>{
    if(e.target.classList.contains('tp-check')) return;
    const s=steps[+row.dataset.i]; if(s.go) s.go(); else showView(s.v); buzz();
  }));
  host.querySelectorAll('.tp-check').forEach(c=>c.addEventListener('click',()=>{
    const s=steps[+c.dataset.i]; const d=(()=>{try{return JSON.parse(localStorage.getItem(todayPathKey())||'{}')}catch(e){return{}}})();
    d[s.id]=!d[s.id]; try{ localStorage.setItem(todayPathKey(),JSON.stringify(d)); }catch(e){}
    if(steps.every(x=>d[x.id])){ try{ localStorage.setItem('soh-paths-walked', String(1+parseInt(localStorage.getItem('soh-paths-walked')||'0'))); }catch(e){} }
    buildTodayPath(); buzz();
  }));
}

/* ============================================================
   PILGRIMAGE — levels & badges (gentle, never shame)
   ============================================================ */
const SOH_LEVELS=['Beginning','Listening','Placing','Melody','Harmony','Resonance','Song','Ascent','Service','Radiance'];
function sohVisited(){ try{ return JSON.parse(localStorage.getItem('soh-visited')||'[]'); }catch(e){ return []; } }
function sohVisit(name){
  try{ const v=new Set(sohVisited()); if(!v.has(name)){ v.add(name); localStorage.setItem('soh-visited',JSON.stringify([...v])); } }catch(e){}
}
const SOH_BADGES_ALL=[
  {id:'flame1', t:'First Flame',        d:'Your first practice session', test:s=>s.sessions>=1},
  {id:'flame7', t:'Seven-Day Flame',    d:'Practised seven days in a row', test:s=>s.streak>=7},
  {id:'theory', t:'Theory Seed',        d:'Began the theory course', test:()=>!!sohProgressGet().theory},
  {id:'jacob',  t:'Universe Voyager',   d:'Entered Jacob’s Universe', needs:'jacob', test:()=>!!sohProgressGet().jacob},
  {id:'lever',  t:'Lever Explorer',     d:'Explored the lever chart', test:()=>sohVisited().includes('levers')},
  {id:'read',   t:'Reading Seed',       d:'Tried sight-reading', needs:'sightread', test:()=>sohVisited().includes('sightread')},
  {id:'ear',    t:'Listening Ear',      d:'Trained your ear', needs:'eartraining', test:()=>sohVisited().includes('eartraining')},
  {id:'nigun',  t:'First Nigun',        d:'Sat with the meditation drone', test:()=>sohVisited().includes('meditation')},
  {id:'circle', t:'Circle Walker',      d:'Walked the Circle of Fifths', test:()=>sohVisited().includes('circle')},
  {id:'path',   t:'Path Complete',      d:'Walked a full daily path', test:()=>parseInt(localStorage.getItem('soh-paths-walked')||'0')>=1},
];
/* only badges whose feature is released (a flagged-off badge can't be earned) */
function sohBadgeList(){ return SOH_BADGES_ALL.filter(b=>!b.needs||sohOn(b.needs)); }
function sohEarned(){ const s=journalStats(); return sohBadgeList().filter(b=>{ try{return b.test(s);}catch(e){return false;} }); }
function sohLevel(){
  const s=journalStats(), earned=sohEarned().length;
  const score=(s.sessions||0)*2+(s.streak||0)+earned*3+(parseInt(localStorage.getItem('soh-paths-walked')||'0'))*4;
  const th=[0,3,7,12,18,26,36,48,62,80]; let li=0;
  th.forEach((t,i)=>{ if(score>=t) li=i; });
  return {name:SOH_LEVELS[li], n:li+1, score};
}
function renderBadges(){
  const host=document.getElementById('sohBadges'); if(!host) return;
  const earned=new Set(sohEarned().map(b=>b.id)), lv=sohLevel();
  host.innerHTML=`<div class="bg-panel">
    <div class="tp-kick">Your pilgrimage</div>
    <div class="bg-level">Level ${lv.n} · <b>${lv.name}</b></div>
    <div class="bg-grid">${sohBadgeList().map(b=>`<div class="bg-badge${earned.has(b.id)?' on':''}"><span class="bg-i">${earned.has(b.id)?'✦':'·'}</span><span class="bg-t">${b.t}</span><span class="bg-d">${b.d}</span></div>`).join('')}</div>
  </div>`;
}
