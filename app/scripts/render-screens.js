// Browser render of the web export for review screenshots. NOT a device test.
// Usage: npm run export:web -- --output-dir /tmp/web && node scripts/render-screens.js /tmp/web <out-dir>
// Needs Playwright with Chromium available on the machine. Also reports page errors, any request to an outside host, and sideways overflow.
const {chromium}=require('playwright');const http=require('http');const fs=require('fs');const path=require('path');
const root=process.argv[2], out=process.argv[3];
const types={'.html':'text/html','.js':'application/javascript','.ttf':'font/ttf','.png':'image/png','.ico':'image/x-icon','.json':'application/json','.css':'text/css'};
const srv=http.createServer((q,r)=>{let p=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(!fs.existsSync(p)||fs.statSync(p).isDirectory())p=path.join(root,'index.html');r.writeHead(200,{'content-type':types[path.extname(p)]||'application/octet-stream'});fs.createReadStream(p).pipe(r);}).listen(8099);
(async()=>{const b=await chromium.launch();const errors=[];
async function shot(name,{prefs,route='/',scheme='light',w=390,h=844,full=false}){
 const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,colorScheme:scheme});
 const pg=await ctx.newPage();pg.on('pageerror',e=>errors.push(name+': '+e.message));pg.on('console',m=>{if(m.type()==='error')errors.push(name+' console: '+m.text().slice(0,200))});
 pg.on('request',q=>{const u=q.url();if(!u.startsWith('http://localhost:8099'))errors.push(name+' EXTERNAL REQUEST: '+u)});
 await pg.addInitScript(p=>{if(p)localStorage.setItem('prefs.v1',JSON.stringify(p))},prefs);
 await pg.goto('http://localhost:8099'+route);await pg.waitForTimeout(1200);
 const sw=await pg.evaluate(()=>document.documentElement.scrollWidth);if(sw>w+1)errors.push(name+' HORIZONTAL OVERFLOW '+sw+'>'+w);
 await pg.screenshot({path:path.join(out,name+'.png'),fullPage:full});await ctx.close();}
const P=(o)=>({lang:'en',mode:'system',textScale:1,brand:'cop32',reduceMotion:false,welcomed:true,...o});
await shot('01-welcome-en',{prefs:null});
await shot('02-welcome-am',{prefs:P({welcomed:false,lang:'am'})});
await shot('03-home-en',{prefs:P({})});
await shot('04-home-am',{prefs:P({lang:'am'})});
await shot('05-home-dark',{prefs:P({mode:'dark'})});
await shot('06-home-brand2',{prefs:P({brand:'example'})});
await shot('07-programme-en',{prefs:P({}),route:'/programme'});
await shot('08-visit-am-dark',{prefs:P({lang:'am',mode:'dark'}),route:'/visit'});
await shot('09-settings',{prefs:P({}),route:'/settings',h:1400});
await shot('10-sources-am',{prefs:P({lang:'am'}),route:'/sources',h:1300});
await shot('11-gallery-en',{prefs:P({}),route:'/gallery',h:2300});
await shot('12-gallery-am-dark',{prefs:P({lang:'am',mode:'dark'}),route:'/gallery',h:2500});
await shot('13-home-am-200-320',{prefs:P({lang:'am',textScale:2}),w:320,h:1500});await shot('16-programme-am-200-320',{prefs:P({lang:'am',textScale:2}),route:'/programme',w:320,h:1500});await shot('17-settings-am-dark',{prefs:P({lang:'am',mode:'dark'}),route:'/settings',h:1500});
await shot('14-about-en',{prefs:P({}),route:'/about',h:1000});
await shot('15-updates-brand2-dark',{prefs:P({brand:'example',mode:'dark'}),route:'/updates'});
console.log(errors.length?errors.join('\n'):'no errors, no external requests, no overflow');await b.close();srv.close();})();
