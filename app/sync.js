/* ============================================================
   Strings of Hope — cloud sync (Firebase Auth + Firestore)
   - Google Sign-In. Offline-first: local storage stays the source
     of truth; signing in MERGES local + cloud (progress never lost)
     then keeps them in sync. Logged-out users are unaffected.
   ============================================================ */
(function(){
  const FB_VER = '10.12.2';
  const cfg = window.SOH_FIREBASE_CONFIG || {};
  const configured = !!(cfg.apiKey && cfg.apiKey.length > 10 && cfg.projectId);
  window.SOH_SYNC = { configured, user:null, status: configured?'loading':'unconfigured' };

  // Keys we sync (everything the app persists about a person's journey).
  function syncKeys(){
    const out=[]; try{ for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i);
      if(k && k.indexOf('soh-')===0 && k!=='soh-theme') out.push(k); } }catch(e){}
    return out;
  }
  // theme is per-device, not synced; everything else soh-* is.

  const isNum = v => typeof v==='string' && v.trim()!=='' && !isNaN(+v);
  function parse(v){ try{ return JSON.parse(v); }catch(e){ return undefined; } }
  function mergeObj(a,b){ const o={}, keys=new Set([...Object.keys(a||{}),...Object.keys(b||{})]);
    keys.forEach(k=>{ const x=a?a[k]:undefined, y=b?b[k]:undefined;
      if(typeof x==='number'&&typeof y==='number') o[k]=Math.max(x,y);
      else if(Array.isArray(x)&&Array.isArray(y)) o[k]=[...new Set([...x,...y])];
      else if(x&&y&&typeof x==='object'&&typeof y==='object'&&!Array.isArray(x)) o[k]=mergeObj(x,y);
      else o[k]=(x!==undefined?x:y); });
    return o;
  }
  // Merge a single key's string value (local vs cloud) — never loses progress.
  function mergeVal(local, cloud){
    if(local==null) return cloud; if(cloud==null) return local;
    const lp=parse(local), cp=parse(cloud);
    if(Array.isArray(lp)&&Array.isArray(cp)) return JSON.stringify([...new Set([...lp,...cp])]);
    if(isNum(local)&&isNum(cloud)) return String(Math.max(+local,+cloud));
    if(lp&&cp&&typeof lp==='object'&&typeof cp==='object'&&!Array.isArray(lp)) return JSON.stringify(mergeObj(lp,cp));
    return (local!=='' ? local : cloud); // scalars/config → prefer this device
  }

  let db=null, auth=null, provider=null, _pushT=null, _writingLocal=false;

  function scheduleUI(){ try{ if(typeof sohRenderAuth==='function') sohRenderAuth(); }catch(e){} }

  function cloudDoc(){ return db.collection('users').doc(SOH_SYNC.user.uid); }

  async function pullMergePush(){
    if(!db||!SOH_SYNC.user) return;
    SOH_SYNC.status='syncing'; scheduleUI();
    let cloud={};
    try{ const snap=await cloudDoc().get(); if(snap.exists) cloud=(snap.data()||{}).keys||{}; }catch(e){}
    // merge cloud into local
    const merged={}; const keys=new Set([...syncKeys(), ...Object.keys(cloud)]);
    _writingLocal=true;
    keys.forEach(k=>{ if(k==='soh-theme') return;
      const loc=localStorage.getItem(k), cl=(cloud[k]!==undefined?cloud[k]:null);
      const val=mergeVal(loc, cl);
      if(val!=null){ merged[k]=val; try{ localStorage.setItem(k,val); }catch(e){} }
    });
    _writingLocal=false;
    // push merged snapshot
    try{
      await cloudDoc().set({ keys:merged, name:SOH_SYNC.user.displayName||'', email:SOH_SYNC.user.email||'',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, {merge:true});
    }catch(e){}
    SOH_SYNC.status='synced'; scheduleUI();
    // reflect merged progress in the current view
    try{ if(typeof buildLearnHub==='function') buildLearnHub(); }catch(e){}
    try{ if(typeof buildYou==='function') buildYou(); }catch(e){}
  }

  async function pushOnly(){
    if(!db||!SOH_SYNC.user) return;
    const keys=syncKeys(), data={};
    keys.forEach(k=>{ const v=localStorage.getItem(k); if(v!=null) data[k]=v; });
    try{ await cloudDoc().set({ keys:data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, {merge:true});
      SOH_SYNC.status='synced'; scheduleUI(); }catch(e){}
  }
  function schedulePush(){ if(!SOH_SYNC.user) return; clearTimeout(_pushT); SOH_SYNC.status='saving'; scheduleUI();
    _pushT=setTimeout(pushOnly, 2500); }

  function init(){
    try{ firebase.initializeApp(cfg); }catch(e){ SOH_SYNC.status='error'; scheduleUI(); return; }
    auth=firebase.auth(); db=firebase.firestore();
    provider=new firebase.auth.GoogleAuthProvider();
    try{ db.enablePersistence({synchronizeTabs:true}).catch(()=>{}); }catch(e){}

    // auto-sync: any soh-* write (while signed in) pushes to cloud, debounced.
    try{ const _set=localStorage.setItem.bind(localStorage);
      localStorage.setItem=function(k,v){ _set(k,v); if(!_writingLocal && k&&k.indexOf('soh-')===0 && k!=='soh-theme') schedulePush(); };
    }catch(e){}

    auth.onAuthStateChanged(function(user){
      SOH_SYNC.user = user || null;
      if(user){ SOH_SYNC.status='syncing'; scheduleUI(); pullMergePush(); }
      else { SOH_SYNC.status='signedout'; scheduleUI(); }
    });
    auth.getRedirectResult().catch(()=>{});
    try{ window.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='hidden' && SOH_SYNC.user) pushOnly(); }); }catch(e){}
  }

  // Public actions (called from the You tab UI)
  window.sohSignIn = function(){
    if(!auth){ return; }
    SOH_SYNC.status='signingin'; scheduleUI();
    auth.signInWithPopup(provider).catch(function(err){
      if(err && (err.code==='auth/popup-blocked' || err.code==='auth/cancelled-popup-request' || err.code==='auth/operation-not-supported-in-this-environment')){
        try{ auth.signInWithRedirect(provider); }catch(e){}
      } else { SOH_SYNC.status='signedout'; scheduleUI(); }
    });
  };
  window.sohSignOut = function(){ if(auth) auth.signOut().catch(()=>{}); };

  function loadScripts(list, done){
    (function next(i){ if(i>=list.length){ done(); return; }
      const s=document.createElement('script'); s.src=list[i]; s.async=false;
      s.onload=()=>next(i+1); s.onerror=()=>{ SOH_SYNC.status='error'; scheduleUI(); };
      document.head.appendChild(s);
    })(0);
  }

  if(!configured){ scheduleUI(); return; }   // no config yet → app runs local-only
  loadScripts([
    `https://www.gstatic.com/firebasejs/${FB_VER}/firebase-app-compat.js`,
    `https://www.gstatic.com/firebasejs/${FB_VER}/firebase-auth-compat.js`,
    `https://www.gstatic.com/firebasejs/${FB_VER}/firebase-firestore-compat.js`,
  ], function(){ if(typeof firebase!=='undefined') init(); else { SOH_SYNC.status='error'; scheduleUI(); } });
})();

/* ---- Auth card UI (rendered into #authCard on the You tab) ---- */
function sohRenderAuth(){
  const el=document.getElementById('authCard'); if(!el) return;
  const S=window.SOH_SYNC||{configured:false,status:'unconfigured'};
  const G='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 01-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1 .7-2.4 1.1-4 1.1-3 0-5.6-2-6.6-4.8H1.4v3.1A12 12 0 0012 24z"/><path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 010-4.8V6.5H1.4a12 12 0 000 11z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 001.4 6.5l4 3.1C6.4 6.8 9 4.8 12 4.8z"/></svg>';
  if(!S.configured){
    el.innerHTML=`<div class="auth-k">Cloud sync</div><div class="auth-t">Not connected yet</div>
      <p class="auth-p">Your progress is saved on this device. Once Google sign-in is connected, you'll be able to sync across all your devices.</p>`;
    return;
  }
  if(S.user){
    const u=S.user, ph=u.photoURL?`<img class="auth-ph" src="${u.photoURL}" alt="" referrerpolicy="no-referrer">`:'<div class="auth-ph auth-ph-x">✦</div>';
    const stt={syncing:'Syncing…',saving:'Saving…',synced:'Synced ✓',signedout:''}[S.status]||'Synced ✓';
    el.innerHTML=`<div class="auth-me">${ph}<div class="auth-meta"><div class="auth-name">${u.displayName||'Signed in'}</div><div class="auth-email">${u.email||''}</div></div></div>
      <div class="auth-sync"><span class="auth-dot"></span>${stt} · across your devices</div>
      <button class="auth-out" id="authOut">Sign out</button>`;
    el.querySelector('#authOut')?.addEventListener('click',()=>{ if(typeof sohSignOut==='function') sohSignOut(); });
  } else {
    const busy=S.status==='signingin';
    el.innerHTML=`<div class="auth-k">Your account</div><div class="auth-t">Save your progress everywhere</div>
      <p class="auth-p">Sign in to sync your lessons, XP and certificates across every device — phone, tablet and desktop.</p>
      <button class="auth-google" id="authIn" ${busy?'disabled':''}>${G}<span>${busy?'Opening…':'Sign in with Google'}</span></button>`;
    el.querySelector('#authIn')?.addEventListener('click',()=>{ if(typeof sohSignIn==='function') sohSignIn(); });
  }
}
