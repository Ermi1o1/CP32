// Browser render of the web export for review screenshots. NOT a device test.
// Usage: npm run export:web -- --output-dir /tmp/web && node scripts/render-screens.js /tmp/web <out-dir>
// Needs Playwright with Chromium available on the machine. Also reports page errors, any request to an outside host, and sideways overflow.
const {chromium}=require('playwright');const http=require('http');const fs=require('fs');const path=require('path');
const root=process.argv[2], out=process.argv[3];
const types={'.html':'text/html','.js':'application/javascript','.ttf':'font/ttf','.png':'image/png','.ico':'image/x-icon','.json':'application/json','.css':'text/css'};
const srv=http.createServer((q,r)=>{let p=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(!fs.existsSync(p)||fs.statSync(p).isDirectory())p=path.join(root,'index.html');r.writeHead(200,{'content-type':types[path.extname(p)]||'application/octet-stream'});fs.createReadStream(p).pipe(r);}).listen(8099);
(async()=>{const b=await chromium.launch();const errors=[];
async function shot(name,{prefs,route='/',scheme='light',w=390,h=844,full=false,agenda=null,type=null,click=null,tz=null}){
 const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,colorScheme:scheme,...(tz?{timezoneId:tz}:{timezoneId:'Africa/Addis_Ababa'})});
 const pg=await ctx.newPage();pg.on('pageerror',e=>errors.push(name+': '+e.message));pg.on('console',m=>{if(m.type()==='error')errors.push(name+' console: '+m.text().slice(0,200))});
 pg.on('request',q=>{const u=q.url();if(!u.startsWith('http://localhost:8099'))errors.push(name+' EXTERNAL REQUEST: '+u)});
 await pg.addInitScript(p=>{if(p)localStorage.setItem('prefs.v1',JSON.stringify(p))},prefs);
 await pg.addInitScript(a=>{if(a)localStorage.setItem('agenda.v1',JSON.stringify(a))},agenda);
 await pg.goto('http://localhost:8099'+route);await pg.waitForTimeout(1200);
 if(type){await pg.getByRole('textbox').first().fill(type);await pg.waitForTimeout(500);}
 if(click){await pg.getByText(click,{exact:true}).filter({visible:true}).last().click();await pg.waitForTimeout(700);}
 const sw=await pg.evaluate(()=>document.documentElement.scrollWidth);if(sw>w+1)errors.push(name+' HORIZONTAL OVERFLOW '+sw+'>'+w);
 await pg.screenshot({path:path.join(out,name+'.png'),fullPage:full});await ctx.close();}
const P=(o)=>({lang:'en',mode:'system',textScale:1,brand:'cop32',reduceMotion:false,welcomed:true,livePreview:false,...o});
const W=412;
await shot('01-welcome',{prefs:null,w:W,h:915});
await shot('02-home',{prefs:P({}),w:W,h:1700});
await shot('03-programme',{prefs:P({}),route:'/programme',w:W,h:915});
await shot('04-session',{prefs:P({}),route:'/session/s07',w:W,h:1400});
await shot('05-map',{prefs:P({}),route:'/map',w:W,h:1500});
await shot('06-visit',{prefs:P({}),route:'/visit',w:W,h:915});
await shot('07-updates',{prefs:P({}),route:'/updates',w:W,h:1000});
await shot('08-guide',{prefs:P({}),route:'/guide/around',w:W,h:1000});
await shot('09-guide-emergency',{prefs:P({}),route:'/guide/emergency',w:W,h:1000});
await shot('10-settings',{prefs:P({}),route:'/settings',w:W,h:1500});
await shot('11-home-live',{prefs:P({livePreview:true}),w:W,h:1100});
await shot('12-programme-live',{prefs:P({livePreview:true}),route:'/programme',w:W,h:1000});
await shot('13-home-dark',{prefs:P({mode:'dark'}),w:W,h:1700});
await shot('14-programme-dark',{prefs:P({mode:'dark'}),route:'/programme',w:W,h:915});
await shot('15-session-dark',{prefs:P({mode:'dark'}),route:'/session/s07',w:W,h:1400});
await shot('16-map-dark',{prefs:P({mode:'dark'}),route:'/map',w:W,h:1100});
await shot('17-visit-dark',{prefs:P({mode:'dark'}),route:'/visit',w:W,h:915});
await shot('18-home-200-320',{prefs:P({textScale:2}),w:320,h:2600});
await shot('19-programme-200-320',{prefs:P({textScale:2}),route:'/programme',w:320,h:1800});
await shot('20-session-200-320',{prefs:P({textScale:2}),route:'/session/s07',w:320,h:2400});
await shot('21-visit-200-320',{prefs:P({textScale:2}),route:'/visit',w:320,h:1600});
await shot('22-programme-360',{prefs:P({}),route:'/programme',w:360,h:800});
await shot('23-visit-brand2',{prefs:P({brand:'example'}),route:'/visit',w:W,h:915});
await shot('24-about',{prefs:P({}),route:'/about',w:W,h:1600});
await shot('25-sources',{prefs:P({}),route:'/sources',w:W,h:1300});
await shot('26-programme-saved-empty',{prefs:P({}),route:'/programme',w:W,h:915});
await shot('27-session-missing',{prefs:P({}),route:'/session/nope',w:W,h:700});
await shot('28-gallery',{prefs:P({}),route:'/gallery',w:W,h:2300});
await shot('29-home-am',{prefs:P({lang:'am'}),w:W,h:1700});
await shot('30-search-empty',{prefs:P({}),route:'/search',w:W,h:915});
await shot('31-search-water',{prefs:P({}),route:'/search',w:W,h:1500,type:'water'});
await shot('32-search-none',{prefs:P({}),route:'/search',w:W,h:915,type:'zzqq'});
await shot('33-agenda',{prefs:P({}),route:'/agenda',w:W,h:1100,agenda:['s07','s09','s14','s22']});
await shot('34-agenda-empty',{prefs:P({}),route:'/agenda',w:W,h:915});
await shot('35-speakers',{prefs:P({}),route:'/speakers',w:W,h:1200});
await shot('36-speaker',{prefs:P({}),route:'/speaker/p05',w:W,h:1100});
await shot('37-glossary',{prefs:P({}),route:'/glossary',w:W,h:1500});
await shot('38-programme-end',{prefs:P({}),route:'/programme',w:W,h:1300,agenda:['s07']});
await shot('39-search-dark',{prefs:P({mode:'dark'}),route:'/search',w:W,h:1300,type:'hall'});
await shot('40-agenda-200-320',{prefs:P({textScale:2}),route:'/agenda',w:320,h:1600,agenda:['s07','s09']});
await shot('41-exhibitors',{prefs:P({}),route:'/exhibitors',w:W,h:1200});
await shot('42-exhibitor',{prefs:P({}),route:'/exhibitor/e11',w:W,h:1300});
await shot('43-programme-filter',{prefs:P({}),route:'/programme',w:W,h:915,click:'Filter'});
await shot('44-session-localtime',{prefs:P({}),route:'/session/s07',w:W,h:1100,tz:'Europe/London'});
await shot('45-exhibitors-dark-200',{prefs:P({mode:'dark',textScale:2}),route:'/exhibitors',w:320,h:1400});
console.log(errors.length?errors.join('\n'):'no errors, no external requests, no overflow');await b.close();srv.close();})();
