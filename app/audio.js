/* ============================================================
   Drone engine — a warm, breathing pad for lever-harp practice.
   Pure Web Audio: no files, works offline. Created on first user tap.
   ============================================================ */
/* one shared context so drone + metronome can sound together */
let _AC=null;
function audioCtx(){
  if(!_AC) _AC = new (window.AudioContext||window.webkitAudioContext)();
  // iOS suspends with the non-standard state 'interrupted' (phone call, lock,
  // backgrounding) as well as 'suspended' — and can stay stuck after returning.
  // Resuming inside a user-gesture call always counts as activation, so resume
  // on anything that isn't 'running'. (webkit.org / MDN BaseAudioContext.state)
  if(_AC.state!=='running'){ try{ _AC.resume(); }catch(e){} }
  // The iPhone ring/silent switch mutes Web Audio (but not <audio>) unless the
  // audio session is 'playback' (Safari 16.4+). Older users often leave the
  // switch on silent and report "no sound" — this is the fix. No-op elsewhere.
  try{ if(navigator.audioSession && navigator.audioSession.type!=='playback') navigator.audioSession.type='playback'; }catch(e){}
  return _AC;
}
/* recover from iOS 'interrupted' when the app returns to the foreground */
try{ document.addEventListener('visibilitychange',()=>{
  if(!document.hidden && _AC && _AC.state!=='running'){ try{ _AC.resume().catch(()=>{}); }catch(e){} }
}); }catch(e){}

/* recorded-drone file naming by pitch class (drop files in audio/drones/<set>/) */
const DRONE_PCFILE = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

const Drone = {
  ctx:null, master:null, voices:[], playing:false,
  vol:0.5, rootName:'C', octave:3, type:'fifth', voice:'pad',
  kind:'synth', set:'shruti', _sampleEl:null, onFallback:null,   // kind: 'synth' | 'sample'

  _ac(){ this.ctx = audioCtx(); return this.ctx; },
  _sampleSrc(name){ return `audio/drones/${this.set}/${DRONE_PCFILE[tRootPC(name)]}.mp3`; },
  _startSample(){
    audioCtx();                                   // unlock audio on the user gesture
    let el=this._sampleEl;
    if(!el){
      el=new Audio(); el.loop=true; el.preload='auto'; this._sampleEl=el;
      el.addEventListener('error',()=>{ if(this.kind==='sample'){ this.kind='synth'; this.start(); if(this.onFallback) this.onFallback(); } });
    }
    el.src=this._sampleSrc(this.rootName); el.volume=this.vol;
    el.play().catch(()=>{});
    this.playing=true;
  },
  noteFreq(name, oct){
    const pc = tRootPC(name);                 // from tuning.js
    const midi = pc + 12*(oct+1);
    return 440 * Math.pow(2,(midi-69)/12);
  },
  intervals(){
    return ({tonic:[0], fifth:[0,7], octave:[0,12], full:[0,7,12]})[this.type] || [0];
  },

  start(){
    if(this.kind==='sample'){ this._startSample(); return; }
    const ac=this._ac();
    this._teardown();
    const master=ac.createGain(); master.gain.value=0.0001;
    const comp=ac.createDynamicsCompressor();
    comp.threshold.value=-14; comp.ratio.value=3;
    master.connect(comp); comp.connect(ac.destination);
    this.master=master;
    const f0=this.noteFreq(this.rootName,this.octave);
    this.intervals().forEach((semi,i)=>this._voice(ac,master,f0,semi,i));
    const now=ac.currentTime;
    master.gain.setValueAtTime(0.0001,now);
    master.gain.exponentialRampToValueAtTime(this.vol,now+0.9);   // soft swell in
    this.playing=true;
  },

  _voice(ac,dest,f0,semi,i){
    const freq=f0*Math.pow(2,semi/12);
    const vg=ac.createGain(); vg.gain.value = i===0?0.55:0.34;     // upper voices quieter
    const filt=ac.createBiquadFilter(); filt.type='lowpass'; filt.Q.value=0.6;
    filt.frequency.value = this.voice==='reed'?2700 : this.voice==='pure'?1300 : 1900;
    vg.connect(filt); filt.connect(dest);
    const shapes = this.voice==='pure'?['sine'] : this.voice==='reed'?['sawtooth','sine'] : ['sine','triangle'];
    const oscs=[];
    shapes.forEach((t,j)=>{
      const o=ac.createOscillator(); o.type=t; o.frequency.value=freq; o.detune.value=(j-0.5)*7;
      const og=ac.createGain(); og.gain.value = j===0?0.7:0.4;
      o.connect(og); og.connect(vg); o.start(); oscs.push(o);
    });
    // gentle "breathing" so it never feels static
    const lfo=ac.createOscillator(); lfo.frequency.value=0.11+i*0.035;
    const lg=ac.createGain(); lg.gain.value=0.05;
    lfo.connect(lg); lg.connect(vg.gain); lfo.start();
    this.voices.push({oscs,lfo,semi,filt});
  },

  /* smoothly retune to a new root while playing (modes wheel follows the spin) */
  setRoot(name){
    this.rootName=name;
    if(!this.playing) return;
    if(this.kind==='sample'){ if(this._sampleEl){ this._sampleEl.src=this._sampleSrc(name); this._sampleEl.volume=this.vol; this._sampleEl.play().catch(()=>{}); } return; }
    const ac=this.ctx, f0=this.noteFreq(name,this.octave), now=ac.currentTime;
    this.voices.forEach(v=>{
      const f=f0*Math.pow(2,v.semi/12);
      v.oscs.forEach(o=>o.frequency.setTargetAtTime(f,now,0.08));
    });
  },
  setVolume(v){ this.vol=v; if(this._sampleEl) this._sampleEl.volume=v; if(this.master) this.master.gain.setTargetAtTime(v,this.ctx.currentTime,0.05); },

  stop(){
    if(this._sampleEl){ try{ this._sampleEl.pause(); }catch(e){} }
    if(!this.master){ this.playing=false; return; }
    const ac=this.ctx, m=this.master, vs=this.voices.slice(), now=ac.currentTime;
    m.gain.cancelScheduledValues(now);
    m.gain.setValueAtTime(Math.max(m.gain.value,0.0001),now);
    m.gain.exponentialRampToValueAtTime(0.0001,now+0.7);          // soft fade out
    setTimeout(()=>{ vs.forEach(v=>{ v.oscs.forEach(o=>{try{o.stop()}catch(e){}}); try{v.lfo.stop()}catch(e){} }); try{m.disconnect()}catch(e){} },800);
    this.master=null; this.voices=[]; this.playing=false;
  },
  _teardown(){
    this.voices.forEach(v=>{ v.oscs.forEach(o=>{try{o.stop()}catch(e){}}); try{v.lfo.stop()}catch(e){} });
    if(this.master){ try{this.master.disconnect()}catch(e){} }
    this.voices=[]; this.master=null;
  },
  toggle(){ this.playing ? this.stop() : this.start(); },
};

/* ============================================================
   Metronome — lookahead scheduler (accurate clicks), musical presets.
   pattern = per-pulse accent levels: 2 strong · 1.5 medium · 1 normal · 0 silent
   ============================================================ */
const RHYTHMS = [
  {key:'meditative', label:'4/4 Meditative',  meter:'4/4',  bpm:64,  pattern:[2,1,1,1]},
  {key:'waltz',      label:'3/4 Waltz',        meter:'3/4',  bpm:132, pattern:[2,1,1]},
  {key:'celtic',     label:'6/8 Celtic Sway',  meter:'6/8',  bpm:116, pattern:[2,1,1,1.5,1,1]},
  {key:'flowing',    label:'12/8 Flowing',     meter:'12/8', bpm:120, pattern:[2,1,1,1.5,1,1,1.5,1,1,1.5,1,1]},
  {key:'sephardic',  label:'7/8 Sephardic',    meter:'7/8',  bpm:160, pattern:[2,1,1.5,1,1.5,1,1]},
  {key:'middleeast', label:'10/8 Middle East', meter:'10/8', bpm:150, pattern:[2,1,1,1.5,1,1.5,1,1.5,1,1]},
  {key:'heartbeat',  label:'Heartbeat',        meter:'pulse',bpm:150, pattern:[2,1.4,0,0,0]},
  {key:'breath',     label:'Breath',           meter:'slow', bpm:64,  pattern:[2,0,0,0,1.5,0,0,0]},
];

const Metro = {
  ctx:null, running:false, vol:0.6, bpm:64, presetKey:'meditative', pattern:[2,1,1,1],
  _next:0, _i:0, _timer:null, onBeat:null, _taps:[],
  kind:'synth', kit:null, kitName:'frame',   // kind:'synth'|'sample' — sample = real meditative percussion (audio/metro/<kit>/)

  /* load a real percussion kit: audio/metro/<name>/{strong,mid,soft}.mp3 — falls back to synth on any error */
  async loadKit(name){
    const ac=audioCtx(), set=name||this.kitName;
    try{
      const entries=await Promise.all(['strong','mid','soft'].map(async k=>{
        const res=await fetch(`audio/metro/${set}/${k}.mp3`); if(!res.ok) throw new Error('missing '+k);
        return [k, await ac.decodeAudioData(await res.arrayBuffer())];
      }));
      this.kit={}; entries.forEach(([k,b])=>this.kit[k]=b);
      this.kitName=set; this.kind='sample'; return true;
    }catch(e){ this.kit=null; this.kind='synth'; return false; }
  },
  useSynth(){ this.kind='synth'; },

  setPreset(key){
    const p=RHYTHMS.find(r=>r.key===key); if(!p) return;
    this.presetKey=key; this.pattern=p.pattern.slice(); this.bpm=p.bpm;
    if(this.running){ this.stop(); this.start(); }
  },
  setBpm(b){ this.bpm=Math.max(30,Math.min(240,Math.round(b))); },

  start(){
    const ac=audioCtx(); this.ctx=ac;
    this.running=true; this._i=0; this._next=ac.currentTime+0.08;
    this._tick();
  },
  _tick(){
    const ac=this.ctx, AHEAD=0.12, spb=60/this.bpm;
    while(this._next < ac.currentTime+AHEAD){
      const acc=this.pattern[this._i % this.pattern.length];
      if(acc>0) this._click(this._next, acc, this._i % this.pattern.length);
      this._next += spb; this._i++;
    }
    this._timer=setTimeout(()=>{ if(this.running) this._tick(); }, 25);
  },
  _click(t, acc, idx){
    const ac=this.ctx;
    if(this.kind==='sample' && this.kit){
      const buf = acc>=2?this.kit.strong : acc>=1.5?this.kit.mid : this.kit.soft;
      if(buf){ const src=ac.createBufferSource(); src.buffer=buf;
        const g=ac.createGain(); g.gain.value=this.vol*(acc>=2?1:acc>=1.5?0.82:0.64);
        src.connect(g); g.connect(ac.destination); src.start(t); }
    } else {
      const o=ac.createOscillator(), g=ac.createGain();
      o.type='square';
      o.frequency.value = acc>=2?1600 : acc>=1.5?1180 : 880;
      o.connect(g); g.connect(ac.destination);
      const v=this.vol*(acc>=2?0.5 : acc>=1.5?0.36 : 0.26);
      g.gain.setValueAtTime(0.0001,t);
      g.gain.exponentialRampToValueAtTime(v,t+0.001);
      g.gain.exponentialRampToValueAtTime(0.0001,t+0.05);
      o.start(t); o.stop(t+0.06);
    }
    if(this.onBeat){ const d=Math.max(0,(t-ac.currentTime)*1000); setTimeout(()=>this.onBeat(acc,idx), d); }
  },
  stop(){ this.running=false; clearTimeout(this._timer); },
  toggle(){ this.running ? this.stop() : this.start(); },
  setVolume(v){ this.vol=v; },

  tap(){
    const now=(performance.now ? performance.now() : Date.now());
    this._taps.push(now);
    if(this._taps.length>5) this._taps.shift();
    if(this._taps.length>=2){
      const gaps=[]; for(let i=1;i<this._taps.length;i++) gaps.push(this._taps[i]-this._taps[i-1]);
      const avg=gaps.reduce((a,b)=>a+b,0)/gaps.length;
      if(avg>200 && avg<2000) this.setBpm(60000/avg);
    }
    // reset stale tap chains
    clearTimeout(this._tapTimer); this._tapTimer=setTimeout(()=>this._taps=[],2200);
    return this.bpm;
  },
};

/* ============================================================
   Tuner — mic pitch detection (autocorrelation). Harp-specific.
   ============================================================ */
const NOTE_NAMES = ['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
const ENHARM = {'C♯':'D♭','E♭':'D♯','F♯':'G♭','A♭':'G♯','B♭':'A♯'};

function freqToNote(freq, a4){
  const midi = 69 + 12*Math.log2(freq/a4);
  const rounded = Math.round(midi);
  const cents = Math.round((midi-rounded)*100);
  return { name:NOTE_NAMES[((rounded%12)+12)%12], octave:Math.floor(rounded/12)-1, cents, midi:rounded };
}

function autoCorrelate(buf, sampleRate){
  let SIZE=buf.length, rms=0;
  for(let i=0;i<SIZE;i++){ const v=buf[i]; rms+=v*v; }
  rms=Math.sqrt(rms/SIZE);
  if(rms<0.01) return -1;                       // too quiet
  let r1=0, r2=SIZE-1; const thres=0.2;
  for(let i=0;i<SIZE/2;i++){ if(Math.abs(buf[i])<thres){ r1=i; break; } }
  for(let i=1;i<SIZE/2;i++){ if(Math.abs(buf[SIZE-i])<thres){ r2=SIZE-i; break; } }
  buf=buf.slice(r1,r2); SIZE=buf.length;
  const c=new Array(SIZE).fill(0);
  for(let i=0;i<SIZE;i++) for(let j=0;j<SIZE-i;j++) c[i]+=buf[j]*buf[j+i];
  let d=0; while(d<SIZE-1 && c[d]>c[d+1]) d++;
  let maxval=-1, maxpos=-1;
  for(let i=d;i<SIZE;i++){ if(c[i]>maxval){ maxval=c[i]; maxpos=i; } }
  let T0=maxpos;
  if(T0>0 && T0<SIZE-1){
    const x1=c[T0-1], x2=c[T0], x3=c[T0+1];
    const a=(x1+x3-2*x2)/2, b=(x3-x1)/2;
    if(a) T0 = T0 - b/(2*a);
  }
  return T0>0 ? sampleRate/T0 : -1;
}

const Tuner = {
  ctx:null, analyser:null, buf:null, stream:null, running:false, raf:null, a4:440, onUpdate:null, onError:null,
  _pitchy:null, clarityMin:0.93, lastClarity:0, engine:'autocorrelation',
  /* Noise rejection — beta feedback: the tuner chased vacuum-wheel squeaks and room
     noise. Three defences: an RMS gate (ignore quiet ambience), a stability filter
     (a note must persist ~3 frames before we trust it — transient squeaks don't),
     and a hold (once a harp string is locked, keep showing it through the decay
     instead of bouncing to silence). */
  rmsMin:0.012, fMin:28, fMax:2400, stableFrames:3, holdMs:1200,
  _lastMidi:0, _stab:0, _hist:null, _heldF:0, _heldT:0,
  async start(){
    try{
      // Dedicated context for the mic: sharing one AudioContext between
      // getUserMedia and the synths degrades/mutes playback on iOS (the OS
      // flips into a play-and-record session at the mic's sample rate —
      // WebKit bug 154538). Created here, closed in stop().
      audioCtx();                                   // unlock + set playback session on the user gesture
      const ac=new (window.AudioContext||window.webkitAudioContext)(); this.ctx=ac;
      this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,autoGainControl:false,noiseSuppression:false}});
      const src=ac.createMediaStreamSource(this.stream);
      this.analyser=ac.createAnalyser(); this.analyser.fftSize=2048;
      src.connect(this.analyser);
      this.buf=new Float32Array(this.analyser.fftSize);
      // Prefer the McLeod Pitch Method (pitchy) — clarity-gated, robust to harp overtones.
      if(window.SOH_PitchDetector){
        try{ this._pitchy=window.SOH_PitchDetector.forFloat32Array(this.analyser.fftSize); this.engine='mpm'; }
        catch(e){ this._pitchy=null; this.engine='autocorrelation'; }
      } else { this._pitchy=null; this.engine='autocorrelation'; }
      this.running=true; this._loop();
    }catch(e){ this.running=false; if(this.onError) this.onError(e); }
  },
  _loop(){
    if(!this.running) return;
    this.analyser.getFloatTimeDomainData(this.buf);
    // RMS gate — don't even attempt pitch detection on room-level ambience.
    let rms=0; for(let i=0;i<this.buf.length;i++){ const v=this.buf[i]; rms+=v*v; }
    rms=Math.sqrt(rms/this.buf.length);
    let freq=-1;
    if(rms>=this.rmsMin){
      if(this._pitchy){
        const [p,clarity]=this._pitchy.findPitch(this.buf, this.ctx.sampleRate);
        this.lastClarity=clarity;
        freq = (p>0 && clarity>=this.clarityMin) ? p : -1;     // clarity gate kills overtone octave errors
      } else {
        freq=autoCorrelate(this.buf, this.ctx.sampleRate);
        this.lastClarity = freq>0 ? 1 : 0;
      }
      if(freq>0 && (freq<this.fMin || freq>this.fMax)) freq=-1; // outside instrument band
    } else this.lastClarity=0;
    // Stability filter + hold: report a pitch only once the same note has
    // persisted a few frames; then keep it through brief dropouts (string decay).
    const now=(typeof performance!=='undefined'&&performance.now)?performance.now():Date.now();
    if(!this._hist) this._hist=[];
    let out=-1;
    if(freq>0){
      const midi=Math.round(69+12*Math.log2(freq/this.a4));
      this._hist.push({f:freq,m:midi}); if(this._hist.length>7) this._hist.shift();
      if(midi===this._lastMidi) this._stab++; else { this._stab=1; this._lastMidi=midi; }
      if(this._stab>=this.stableFrames){
        const fs=this._hist.filter(h=>h.m===midi).map(h=>h.f).sort((a,b)=>a-b);
        this._heldF=fs[Math.floor(fs.length/2)];               // median — steadies the needle
        this._heldT=now; out=this._heldF;
      } else if(this._heldF && now-this._heldT<this.holdMs) out=this._heldF;
    } else {
      this._stab=0;
      if(this._heldF && now-this._heldT<this.holdMs) out=this._heldF;
      else { this._heldF=0; this._hist.length=0; }
    }
    if(this.onUpdate) this.onUpdate(out>0?out:-1, out>0?freqToNote(out,this.a4):null);
    this.raf=requestAnimationFrame(()=>this._loop());
  },
  stop(){ this.running=false; cancelAnimationFrame(this.raf); this._stab=0; this._heldF=0; if(this._hist) this._hist.length=0;
    if(this.stream){ this.stream.getTracks().forEach(t=>t.stop()); this.stream=null; }
    if(this.ctx){ try{ this.ctx.close(); }catch(e){} this.ctx=null; this.analyser=null; this._pitchy=null; } },
  toggle(){ this.running ? this.stop() : this.start(); },
};
