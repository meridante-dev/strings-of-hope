/* ============================================================
   Strings of Hope — THE KEY REGISTRY
   The single source of truth for everything this app persists.

   WHY THIS EXISTS (read before adding a key):
   Sync used to *discover* keys by scanning localStorage for a 'soh-'
   prefix. Nothing declared intent, so the same bug kept re-appearing:
     · soh-labs leaked a device flag into the member's account;
     · soh_journal / soh_harp / soh_sr_skill used an UNDERSCORE, so the
       prefix scan silently skipped them — a member's streak and harp
       setup never followed them to a second device, while the sign-in
       screen promised they would;
     · the privacy screen drifted into saying nothing was uploaded at
       all, because no one could enumerate what was.

   So: a key that is not registered here does not sync, and
   tools/keys-test.js fails the build if any key in the source is
   missing from this table. Declare the key, or it does not exist.

   scope  'account' → belongs to the member; syncs; restorable.
          'device'  → belongs to this phone/tablet; NEVER leaves it.
   merge   how two devices reconcile (account only):
           'obj'   deep-merge, numbers take max      (progress maps)
           'union' union arrays by value             (lists of things done)
           'max'   the larger number wins            (counters, milestones)
           'local' this device's value wins          (settings, dates)
   reset   cleared by "Reset my progress" (identity/setup is kept).
   what    plain language, shown to members on the privacy screen.
   ============================================================ */
const SOH_KEYS = {
  /* — the member's journey — */
  'soh-progress':      {scope:'account', merge:'obj',   reset:true,  group:'P', what:'where you left off in each course'},
  'soh-lessons':       {scope:'account', merge:'obj',   reset:true,  group:'P', what:'which lessons you’ve opened'},
  'soh-journal':       {scope:'account', merge:'union', reset:true,  group:'L', what:'your practice log — sessions, minutes and streak'},
  'soh-visited':       {scope:'account', merge:'union', reset:true,  group:'L', what:'which tools you’ve tried'},
  'soh-paths-walked':  {scope:'account', merge:'max',   reset:true,  group:'L', what:'how many daily paths you’ve completed'},
  'soh-path-*':        {scope:'account', merge:'obj',   reset:true,  group:'L', what:'today’s practice path'},
  'soh-jacob-seen':    {scope:'account', merge:'union', reset:true,  group:'P', what:'modules you’ve read'},
  'soh-shamayim-seen': {scope:'account', merge:'union', reset:true,  group:'P', what:'modules you’ve read'},
  'soh-chen-seen':     {scope:'account', merge:'union', reset:true,  group:'P', what:'modules you’ve read'},
  'soh-certs-seen':    {scope:'account', merge:'union', reset:true,  group:'P', what:'certificates you’ve been shown'},
  'soh-rank-seen':     {scope:'account', merge:'max',   reset:true,  group:'P', what:'the last rank you were congratulated for'},
  'soh-streak-seen':   {scope:'account', merge:'max',   reset:true,  group:'P', what:'the last streak milestone you were shown'},
  'soh-welcomed':      {scope:'account', merge:'max',   reset:true,  group:'P', what:'whether you’ve seen the welcome'},
  'soh-last-visit':    {scope:'account', merge:'local', reset:true,  group:'L', what:'the day you last opened the app'},
  'soh-remind-last':   {scope:'account', merge:'local', reset:true,  group:'L', what:'the day you were last reminded'},
  'soh-sr-skill':      {scope:'account', merge:'obj',   reset:true,  group:'P', what:'your practice-drill scores'},
  'soh-pulse':         {scope:'account', merge:'obj',   reset:true,  group:'T', what:'counts of which screens you open (no content, ever)'},

  /* — who you are and what you play: kept through a progress reset — */
  'soh-profile':       {scope:'account', merge:'obj',   reset:false, group:'H', what:'your harps, their tunings, and the styles you chose'},
  'soh-harp':          {scope:'account', merge:'obj',   reset:false, group:'H', what:'your harp’s base tuning and lever setup'},
  'soh-name':          {scope:'account', merge:'local', reset:false, group:'H', what:'the name you gave'},
  'soh-reminders':     {scope:'account', merge:'local', reset:false, group:'H', what:'whether daily reminders are on'},

  /* — this device only. Never uploaded, never merged. — */
  'soh-theme':         {scope:'device', what:'light or dark'},
  'soh-textsize':      {scope:'device', what:'your chosen text size'},
  'soh-uid':           {scope:'device', what:'which account this device last signed in as'},
  'soh-labs':          {scope:'device', what:'preview mode'},
  'soh-auth-choice':   {scope:'device', what:'whether you dismissed the sign-in screen'},
  'soh-tuner-noisy':   {scope:'device', what:'the tuner’s noisy-room setting'},
};

/* Look a key up. Supports one wildcard form: 'soh-path-*' matches the
   per-day path keys. Returns null for anything unregistered. */
function sohKeySpec(k){
  if(!k) return null;
  if(SOH_KEYS[k]) return SOH_KEYS[k];
  for(const pat in SOH_KEYS){
    if(pat.charAt(pat.length-1)==='*' && k.indexOf(pat.slice(0,-1))===0) return SOH_KEYS[pat];
  }
  return null;
}
/* The one question sync asks. Unregistered ⇒ never syncs (and says so). */
function sohSyncable(k){
  const s=sohKeySpec(k);
  if(!s){ if(k && k.indexOf('soh')===0 && typeof console!=='undefined')
            console.warn('[soh] unregistered key, will not sync:', k, '— add it to keys.js');
          return false; }
  return s.scope==='account';
}
function sohIsResettable(k){ const s=sohKeySpec(k); return !!(s && s.scope==='account' && s.reset); }
/* Every account key actually present on this device (+ dynamic path keys). */
function sohLocalAccountKeys(){
  const out=[]; try{ for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(sohSyncable(k)) out.push(k); } }catch(e){}
  return out;
}

/* ---- Migration: the underscore keys ----------------------------------
   soh_journal / soh_harp / soh_sr_skill predate the registry and were
   silently excluded from sync by the hyphen check — costing members their
   streak and harp setup on every new device. Move them onto registered
   names ONCE, before anything reads them (this file loads before app.js).
   The old key is removed so the two can never diverge; the data is safe
   because the new key syncs to the member's account on next sign-in. */
(function sohMigrateKeys(){
  const moves=[['soh_journal','soh-journal'],['soh_harp','soh-harp'],['soh_sr_skill','soh-sr-skill']];
  try{
    moves.forEach(([from,to])=>{
      const v=localStorage.getItem(from);
      if(v==null) return;
      if(localStorage.getItem(to)==null) localStorage.setItem(to,v);   // never clobber newer data
      localStorage.removeItem(from);
    });
  }catch(e){}
})();

/* ---- Truth for the privacy screen ------------------------------------
   Generated from the table above so the copy cannot drift from the code
   again. This is what replaced the old (false) "nothing is uploaded". */
/* Grouped, not key-by-key: an honest list of 20 internal keys ("the last rank
   you were congratulated for") is technically true and unreadable, which is its
   own kind of not-telling-people. Every account key must carry a group, and
   keys-test.js fails if one doesn't — so the summary stays complete. */
const SOH_PRIVACY_GROUPS = {"P": "Your progress — lessons opened, chapters finished, certificates and badges", "L": "Your practice log — sessions, minutes and your streak", "H": "Your harps and their tunings, your name, and your settings", "T": "Counts of which screens you open — never what you write, play or record"};
function sohPrivacyAccountList(){
  const out=[];
  Object.keys(SOH_PRIVACY_GROUPS).forEach(g=>{
    if(Object.keys(SOH_KEYS).some(k=>SOH_KEYS[k].scope==='account' && SOH_KEYS[k].group===g)) out.push(SOH_PRIVACY_GROUPS[g]);
  });
  return out;
}
function sohPrivacyUngrouped(){
  return Object.keys(SOH_KEYS).filter(k=>SOH_KEYS[k].scope==='account' && !SOH_PRIVACY_GROUPS[SOH_KEYS[k].group]);
}
function sohPrivacyDeviceList(){
  return Object.keys(SOH_KEYS).filter(k=>SOH_KEYS[k].scope==='device').map(k=>SOH_KEYS[k].what);
}

try{ window.SOH_KEYS=SOH_KEYS; }catch(e){}
try{ if(typeof module!=='undefined' && module.exports) module.exports={SOH_KEYS,SOH_PRIVACY_GROUPS,sohKeySpec,sohSyncable,sohIsResettable,sohPrivacyAccountList,sohPrivacyDeviceList,sohPrivacyUngrouped}; }catch(e){}
