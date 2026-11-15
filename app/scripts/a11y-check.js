// Automated accessibility check (axe-core, WCAG 2.0–2.2 A/AA) on the web export: every route x EN/AM x light/dark.
// Browser only — it does not replace the TalkBack checklist in docs/operations/device-checklist.md.
// Usage: node scripts/a11y-check.js <web-export-dir>   (needs Playwright + axe-core on the machine)
const {chromium}=require('playwright');const http=require('http');const fs=require('fs');const path=require('path');
const root=process.argv[2];const axe=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const srv=http.createServer((q,r)=>{let p=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(!fs.existsSync(p)||fs.statSync(p).isDirectory())p=path.join(root,'index.html');r.writeHead(200,{'content-type':p.endsWith('.js')?'application/javascript':p.endsWith('.html')?'text/html':'application/octet-stream'});fs.createReadStream(p).pipe(r);}).listen(8098);
(async()=>{const b=await chromium.launch();let total=0,runs=0;const seen={};
const routes=['/','/programme','/session/s07','/session/s06','/map','/visit','/updates','/guide/around','/guide/emergency','/guide/nope','/settings','/about','/sources','/gallery','/search','WELCOME','LIVE/','LIVE/programme','LIVE/session/s06'];
for(const route of routes)for(const lang of ['en','am'])for(const mode of ['light','dark']){
 const ctx=await b.newContext({viewport:{width:390,height:844},colorScheme:mode});const pg=await ctx.newPage();
 const live=route.startsWith('LIVE');const path=live?route.slice(4):route;
 const prefs={lang,mode,textScale:1,brand:'cop32',reduceMotion:false,welcomed:route!=='WELCOME',livePreview:live};
 await pg.addInitScript(p=>localStorage.setItem('prefs.v1',JSON.stringify(p)),prefs);
 await pg.goto('http://localhost:8098'+(route==='WELCOME'?'/':path));await pg.waitForTimeout(2000);await pg.addScriptTag({content:axe});
 const res=await pg.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,n:v.nodes.length,ex:v.nodes[0].html.slice(0,140),msg:(v.nodes[0].failureSummary||'').slice(0,160)}))});
 runs++;for(const v of res){total+=v.n;const k=v.id;seen[k]=seen[k]||{count:0,impact:v.impact,where:new Set(),ex:v.ex,msg:v.msg};seen[k].count+=v.n;seen[k].where.add(`${route} ${lang} ${mode}`);}
 await ctx.close();}
console.log(`${runs} runs, ${total} violation nodes`);for(const [k,v] of Object.entries(seen))console.log(`- ${k} [${v.impact}] x${v.count} in ${v.where.size} runs e.g. ${[...v.where][0]}\n    ${v.ex}\n    ${v.msg.replace(/\n/g,' ')}`);
await b.close();srv.close();})();
