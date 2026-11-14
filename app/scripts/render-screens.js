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
await shot('01-welcome',{prefs:null});
await shot('02-home',{prefs:P({}),h:1250});
await shot('03-home-dark',{prefs:P({mode:'dark'}),h:1250});
await shot('04-programme',{prefs:P({}),route:'/programme',h:1250});
await shot('05-programme-dark',{prefs:P({mode:'dark'}),route:'/programme',h:1250});
await shot('06-session',{prefs:P({}),route:'/session/s07',h:1500});
await shot('07-session-dark',{prefs:P({mode:'dark'}),route:'/session/s07',h:1500});
await shot('08-home-200-320',{prefs:P({textScale:2}),w:320,h:2200});
await shot('09-programme-200-320',{prefs:P({textScale:2}),route:'/programme',w:320,h:2200});
await shot('10-session-200-320',{prefs:P({textScale:2}),route:'/session/s07',w:320,h:2600});
await shot('11-home-am',{prefs:P({lang:'am'}),h:1250});
await shot('12-home-brand2',{prefs:P({brand:'example'}),h:1250});
await shot('13-settings',{prefs:P({}),route:'/settings',h:1400});
await shot('14-visit',{prefs:P({}),route:'/visit'});
await shot('15-session-missing',{prefs:P({}),route:'/session/nope'});
await shot('16-gallery',{prefs:P({}),route:'/gallery',h:2300});
console.log(errors.length?errors.join('\n'):'no errors, no external requests, no overflow');await b.close();srv.close();})();
