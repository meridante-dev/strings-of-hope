/* Verifies sohProse() over every authored string in the course.
   The contract: paragraphs may be ADDED, nothing else may change. */
const fs=require('fs'), path=require('path');
const dir=path.join(__dirname,'..');
const src=fs.readFileSync(path.join(dir,'app.js'),'utf8');
const a=src.indexOf('const PROSE_TAGCH'), b=src.indexOf('function renderLesson(dir)');
eval(src.slice(a,b)+'\nglobal.P=sohProse;');
eval(fs.readFileSync(path.join(dir,'theory.js'),'utf8')+'\nglobal.T=THEORY_COURSE;');
const P=global.P, T=global.T;
const strings=[];
T.forEach(u=>u.chapters.forEach(c=>c.lessons.forEach(l=>{ strings.push(l.body); if(l.harp) strings.push(l.harp); })));
// Tags become a space on BOTH sides, so a <p> boundary compares equal to the
// source's inter-sentence space. Applied identically to input and output.
const norm=s=>s.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const tags=s=>(s.match(/<\/?[a-z][^>]*>/gi)||[]).filter(t=>!/^<\/?p>$/i.test(t)).join('|');
let lossy=0,corrupt=0,unbalanced=0; const paras={};
strings.forEach((s,i)=>{
  const out=P(s);
  if(norm(out)!==norm(s)){ lossy++; if(lossy<3){ const A=norm(s),B=norm(out);
    let k=0; while(k<A.length&&A[k]===B[k])k++; console.log('LOSS @'+i+' at char '+k+'\n IN :…'+A.slice(Math.max(0,k-40),k+40)+'\n OUT:…'+B.slice(Math.max(0,k-40),k+40)); } }
  if(tags(out)!==tags(s)) corrupt++;
  const ps=out.match(/<p>([\s\S]*?)<\/p>/g)||[];
  ps.forEach(p=>{ const c=t=>(p.match(new RegExp('<'+t+'>','g'))||[]).length, e=t=>(p.match(new RegExp('</'+t+'>','g'))||[]).length;
    if(c('b')!==e('b')||c('i')!==e('i')) unbalanced++; });
  paras[ps.length]=(paras[ps.length]||0)+1;
});
console.log('strings tested :', strings.length);
console.log('content loss   :', lossy,   lossy?'✗ FAIL':'✓ none');
console.log('tag corruption :', corrupt, corrupt?'✗ FAIL':'✓ none');
console.log('unbalanced tags:', unbalanced, unbalanced?'✗ FAIL':'✓ none');
console.log('paragraphs per string:', JSON.stringify(paras));
process.exit(lossy||corrupt||unbalanced?1:0);
