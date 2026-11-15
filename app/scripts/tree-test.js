// Tree test T1–T12 (docs/ux/ia-validation-kit.md §5) walked through the web export by tapping
// labels a person would read. A scripted walk proves each destination is REACHABLE by the
// expected path; it does not measure whether real people find it. Browser only.
// Usage: node scripts/tree-test.js <web-export-dir>
const {chromium}=require('playwright');const http=require('http');const fs=require('fs');const path=require('path');const root=process.argv[2];
const srv=http.createServer((q,r)=>{let p=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(!fs.existsSync(p)||fs.statSync(p).isDirectory())p=path.join(root,'index.html');r.writeHead(200,{'content-type':p.endsWith('.js')?'application/javascript':p.endsWith('.html')?'text/html':'application/octet-stream'});fs.createReadStream(p).pipe(r);}).listen(8096);
const TASKS=[
 ['T1 airport to hotel',['tab:Visit','Getting around'],'From the airport to the city'],
 ['T2 can the public attend',['Can I attend?'],'Which areas are open to the public'],
 ['T3 events open to everyone',['tab:Programme','Open to public'],'Open to public'],
 ['T4 a saved session moved',['tab:Updates','Alerts'],'No alerts'],
 ['T5 press releases',['tab:Updates','Press'],'No press releases yet'],
 ['T6 step-free entrance',['tab:Map','Step-free'],'South entrance · step-free'],
 ['T7 coffee ceremony',['tab:Visit','Explore Addis'],'Food and coffee'],
 ['T8 change language',['label:Profile and settings','አማርኛ'],'ቅንብሮች'],
 ['T9 loss and damage',['tab:Updates','Glossary'],'Loss and damage'],
 ['T10 recording of the opening',['tab:Updates','Live'],'Nothing live or recorded yet'],
 ['T11 Ethiopian visa',['tab:Visit','Before you travel'],'A link to the official visa service'],
 ['T12 delete your data',['label:Profile and settings','Delete my data'],'Delete'],
];
(async()=>{const b=await chromium.launch();let pass=0;
for(const [name,steps,expect] of TASKS){const ctx=await b.newContext({viewport:{width:412,height:915}});const pg=await ctx.newPage();
 await pg.addInitScript(p=>localStorage.setItem('prefs.v1',JSON.stringify(p)),{lang:'en',mode:'light',textScale:1,brand:'cop32',reduceMotion:true,welcomed:true,livePreview:false});
 await pg.goto('http://localhost:8096/');await pg.waitForTimeout(900);let ok=true,why='';
 try{for(const s of steps){
   // Only what is visible counts: other tabs stay mounted off-screen and may hold the same words.
   const loc=(s.startsWith('tab:')?pg.getByRole('tab',{name:s.slice(4),exact:true}):s.startsWith('label:')?pg.getByLabel(s.slice(6),{exact:true}):pg.getByText(s,{exact:true})).filter({visible:true}).last();
   await loc.scrollIntoViewIfNeeded({timeout:4000});await loc.click({timeout:4000});await pg.waitForTimeout(500);}
  await pg.getByText(expect,{exact:false}).filter({visible:true}).first().waitFor({state:'visible',timeout:4000});
 }catch(e){ok=false;why=String(e.message).split('\n')[0].slice(0,110);}
 console.log(`${ok?'PASS':'FAIL'}  ${name}  [${steps.map(s=>s.replace(/^(tab|label):/,'')).join(' → ')}]  (${steps.length} taps)${ok?'':'  '+why}`);pass+=ok?1:0;await ctx.close();}
console.log(`${pass}/${TASKS.length} tasks reachable`);await b.close();srv.close();process.exit(pass===TASKS.length?0:1);})();
