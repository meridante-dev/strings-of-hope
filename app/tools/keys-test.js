/* Enforces the key registry (keys.js).
   This exists because the registry is only worth having if something FAILS
   when it's wrong. Every bug it guards against has already happened once:
     · a device flag (soh-labs) synced into members' accounts;
     · soh_journal / soh_harp used an underscore, so the prefix scan skipped
       them and members lost their streak and harp setup on a second device;
     · the privacy screen claimed nothing was uploaded, long after sync shipped;
     · SOH_VERSION drifted 9 days behind the service-worker cache.
   Run: node tools/keys-test.js */
const fs=require('fs'), path=require('path');
const dir=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(dir,f),'utf8');
const {SOH_KEYS, sohKeySpec, sohPrivacyUngrouped}=require(path.join(dir,'keys.js'));

let fails=0;
const fail=m=>{ console.log('  ✗ '+m); fails++; };
const ok=m=>console.log('  ✓ '+m);

/* 1 — every persisted key in the source is registered */
const sources=['app.js','sync.js','keys.js','data.js','tuning.js','audio.js'];
const used=new Set();
sources.forEach(f=>{
  const re=/localStorage\.(?:getItem|setItem|removeItem)\('([^']+)'/g; let m;
  const src=read(f);
  while((m=re.exec(src))) used.add(m[1]);
});
// dynamic key builders: todayPathKey() -> 'soh-path-' + date
(read('app.js').match(/'soh-[a-z-]+-'\s*\+/g)||[]).forEach(x=>used.add(x.match(/'([^']+)'/)[1]+'*'));
const unregistered=[...used].filter(k=>!sohKeySpec(k) && !sohKeySpec(k.replace(/\*$/,'x')));
unregistered.length ? fail('unregistered keys in source: '+unregistered.join(', ')+' — add them to keys.js')
                    : ok(`all ${used.size} persisted keys are registered`);

/* 2 — no key may use the underscore prefix again (the silent-skip bug) */
const underscore=[...used].filter(k=>/^soh_/.test(k));
underscore.length ? fail('underscore keys (these never sync): '+underscore.join(', '))
                  : ok('no soh_ underscore keys outside the migration');

/* 3 — every registered key declares what it is, in plain language */
const noWhat=Object.keys(SOH_KEYS).filter(k=>!SOH_KEYS[k].what);
noWhat.length ? fail('registered without a member-readable "what": '+noWhat.join(', '))
              : ok('every key has member-readable copy for the privacy screen');

/* 4 — account keys declare a merge policy; device keys must not sync */
const badMerge=Object.keys(SOH_KEYS).filter(k=>SOH_KEYS[k].scope==='account' && !['obj','union','max','local'].includes(SOH_KEYS[k].merge));
badMerge.length ? fail('account keys with no/invalid merge policy: '+badMerge.join(', '))
                : ok('every account key declares a merge policy');
const badScope=Object.keys(SOH_KEYS).filter(k=>!['account','device'].includes(SOH_KEYS[k].scope));
badScope.length ? fail('invalid scope: '+badScope.join(', ')) : ok('every key has a valid scope');

/* 4b — every account key rolls up into a member-readable privacy group,
   so the generated summary can never quietly omit a category */
const ungrouped=sohPrivacyUngrouped();
ungrouped.length ? fail('account keys missing a privacy group: '+ungrouped.join(', '))
                 : ok('every account key is covered by a privacy group');

/* 5 — settings must not max-merge (max on '0'/'1' silently re-enables them) */
const ratchet=['soh-reminders'].filter(k=>SOH_KEYS[k] && SOH_KEYS[k].merge==='max');
ratchet.length ? fail('settings using max-merge (cannot be turned off): '+ratchet.join(', '))
               : ok('settings use last-writer-wins, not max-merge');

/* 6 — sync must not reintroduce a prefix scan */
const sync=read('sync.js');
/indexOf\('soh-'\)===0/.test(sync) ? fail('sync.js still guesses keys by prefix — it must ask keys.js')
                                   : ok('sync.js resolves keys through the registry');

/* 7 — the privacy screen must not re-assert the old falsehood.
   Checked against SHIPPED code with comments stripped: the fix's own comment
   quotes the old sentence to explain why it was wrong, and documenting a bug
   must not count as committing it. */
const app=read('app.js');
const shipped=app.replace(/\/\*[\s\S]*?\*\//g,'').replace(/(^|[^:])\/\/.*$/gm,'$1');
/nothing is uploaded to a server/.test(shipped) ? fail('privacy copy still claims nothing is uploaded')
                                                : ok('privacy copy no longer claims nothing is uploaded');
/sohPrivacyStorage/.test(app) ? ok('privacy copy is generated from the registry')
                              : fail('privacy copy is not generated from the registry');

/* 8 — the version members report must match the build we ship */
const swCache=(read('sw.js').match(/CACHE\s*=\s*'soh-v([^']+)'/)||[])[1];
const appVer=(app.match(/let SOH_VERSION\s*=\s*'([^']+)'/)||[])[1];
const swDate=(swCache||'').split('-')[0], appDate=(appVer||'').split(' ')[0];
swDate && appDate && swDate===appDate
  ? ok(`fallback version matches the SW cache (${swDate})`)
  : fail(`version drift: sw.js cache is '${swCache}' but app.js fallback is '${appVer}'`);

console.log(fails ? `\n${fails} check(s) FAILED` : '\nall key-registry checks passed');
process.exit(fails?1:0);
