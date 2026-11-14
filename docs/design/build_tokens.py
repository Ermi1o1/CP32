"""Single source for design tokens. Run: python3 build_tokens.py -> writes tokens.json and prints/validates WCAG contrast.
Original, neutral palette (NOT an official COP32/UNFCCC identity; D1/D3)."""
import json, sys
def lum(h):
    h=h.lstrip('#'); c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    c=[x/12.92 if x<=0.03928 else ((x+0.055)/1.055)**2.4 for x in c]; return .2126*c[0]+.7152*c[1]+.0722*c[2]
def cr(a,b):
    la,lb=sorted((lum(a),lum(b)),reverse=True); return (la+.05)/(lb+.05)
COLOR = {  # v1.0 "Daylight" (D73, Design Pass v2). White-first. One accent: amber "line". Deep green ink for links and selection.
 # Role names are unchanged from v0.2 so components keep compiling; `line`, `ink` and `onInk` are new.
 "light": {"bg":"#F6F7F4","surface":"#FFFFFF","surfaceAlt":"#ECEFEA","border":"#6F7A74","divider":"#E1E5DF",
   "text":"#101614","textSecondary":"#4E5953","textTertiary":"#5E6963","primary":"#0F4A45","onPrimary":"#FFFFFF","primarySoft":"#E1ECE8","onPrimarySoft":"#0C3A36",
   "accent":"#F29F3D","onAccent":"#1A1206","sunset":"#F29F3D","heroFrom":"#16211D","heroTo":"#101614","onHero":"#FFFFFF","heroKicker":"#F29F3D","link":"#0F4A45",
   "info":"#0B5A8A","infoBg":"#E3EEF6","success":"#23620F","successBg":"#E5F3DA","warning":"#7A3A0E","warningBg":"#FFF0DF","danger":"#B3261E","dangerBg":"#FCE7E3","onDanger":"#FFFFFF","focus":"#0F4A45","star":"#B36A00",
   "line":"#CF7300","ink":"#101614","onInk":"#FFFFFF",
   "bar":"rgba(255,255,255,.92)","fill":"rgba(16,22,20,.06)","separator":"rgba(16,22,20,.12)"},
 "dark": {"bg":"#0C1512","surface":"#15211D","surfaceAlt":"#1C2A25","border":"#7F8C85","divider":"#22302B",
   "text":"#F1EEE6","textSecondary":"#A8B3AC","textTertiary":"#96A29B","primary":"#8FD3C8","onPrimary":"#06211E","primarySoft":"#173A35","onPrimarySoft":"#C5ECE5",
   "accent":"#F29F3D","onAccent":"#1A1206","sunset":"#F29F3D","heroFrom":"#1C2A25","heroTo":"#15211D","onHero":"#FFFFFF","heroKicker":"#F29F3D","link":"#8FD3C8",
   "info":"#8CC8F0","infoBg":"#16303F","success":"#9FE0A8","successBg":"#17301C","warning":"#F8C99A","warningBg":"#2E1F10","danger":"#FF9D92","dangerBg":"#3A1A16","onDanger":"#2B0A06","focus":"#8FD3C8","star":"#F2B33D",
   "line":"#F29F3D","ink":"#F1EEE6","onInk":"#0C1512",
   "bar":"rgba(21,33,29,.94)","fill":"rgba(241,238,230,.08)","separator":"rgba(241,238,230,.14)"}}
# (foreground, background, minimum ratio, rule)
PAIRS = [("text","bg",4.5,"body text"),("text","surface",4.5,"body text on card"),("textSecondary","bg",4.5,"secondary text"),("textSecondary","surface",4.5,"secondary text on card"),
 ("textSecondary","surfaceAlt",4.5,"secondary text on alt surface"),("text","surfaceAlt",4.5,"text on alt surface"),
 ("onPrimary","primary",4.5,"primary button text"),("onPrimarySoft","primarySoft",4.5,"selected chip/tab text"),("onAccent","accent",4.5,"accent button text"),
 ("primary","bg",4.5,"primary-coloured text/icon on bg"),("primary","surface",4.5,"primary text on card"),("link","bg",4.5,"links"),("link","surface",4.5,"links on card"),
 ("info","infoBg",4.5,"info banner"),("success","successBg",4.5,"success banner"),("warning","warningBg",4.5,"warning banner"),("danger","dangerBg",4.5,"danger/alert banner"),("onDanger","danger",4.5,"danger button text"),
 ("border","bg",3.0,"input/control border (non-text 3:1)"),("border","surface",3.0,"control border on card"),("focus","bg",3.0,"focus ring on bg"),("focus","surface",3.0,"focus ring on card"),
 ("primary","primarySoft",3.0,"icon on selected state (non-text)"),
 ("onAccent","accent",4.5,"primary-action (amber) button text"),("onHero","heroFrom",4.5,"hero text (top)"),("onHero","heroTo",4.5,"hero text (bottom)"),("heroKicker","heroTo",4.5,"hero kicker"),("heroKicker","heroFrom",4.5,"hero kicker (top)"),
 ("onInk","ink",4.5,"text on the ink block (selected tab, primary dark button)"),("line","bg",3.0,"the signature line on the page background (non-text)"),("line","surface",3.0,"the signature line on a card (non-text)"),("textTertiary","surface",4.5,"tertiary text on card"),("textTertiary","bg",4.5,"tertiary text on bg"),("star","surface",3.0,"saved star (non-text)"),("textSecondary","primarySoft",4.5,"secondary text on soft tint")]
TYPE = {"fontFamily":{"body":"'Atkinson Hyperlegible Next', 'Noto Sans Ethiopic', system-ui, sans-serif","ethiopic":"'Noto Sans Ethiopic', sans-serif",
  "note":"v0.2 (D53): Atkinson Hyperlegible Next (OFL, variable 200–800, Latin ≈34 KB woff2) for Latin; Noto Sans Ethiopic (bundled subset) renders all Ge'ez text via unicode-range fallback (D11, D49). Native iOS may swap Latin to the system font after review."},
 "scale":{ # iOS-Dynamic-Type-aligned; size px at 100%, line-height ratio EN, ratio AM, weight
  "largeTitle":[34,1.2,1.4,800],"title1":[28,1.2,1.4,800],"title2":[24,1.2,1.4,800],"title3":[20,1.25,1.45,800],"headline":[17,1.3,1.6,600],"body":[17,1.35,1.65,400],
  "callout":[16,1.35,1.6,400],"subhead":[15,1.35,1.6,400],"footnote":[13,1.35,1.55,400],"caption":[12,1.35,1.55,600],
  # v1.0 additions (D73): serif display styles and the large tabular clock.
  "display":[38,1.1,1.4,600],"displaySmall":[26,1.15,1.4,600],"clock":[40,1.0,1.2,800],"label":[11,1.3,1.5,800]},
 "weights":{"regular":400,"medium":500,"semibold":600,"bold":700,"heavy":800},"minBodySize":16,"maxTextScale":2.0,"tracking":{"largeTitle":-0.022,"title":-0.015,"body":-0.005,"eyebrow":0.04},
 "amharicNote":"Ge'ez glyphs are dense: use the AM line-height ratio and never go below 14px for AM running text (to validate on A1/A2 devices)."}
SPACE=[0,2,4,8,12,16,20,24,32,40,48,64]
tokens={"meta":{"name":"COP32 guide — Daylight design tokens","status":"v1.0 (2026-11-14, D73, Design Pass v2). Supersedes v0.2 Highland Mist for the native app; the web prototype keeps its own frozen tokens.css. Original palette; not an official COP32/UNFCCC identity.","units":"px (dp/pt equivalent)"},
 "color":COLOR,"typography":TYPE,"space":SPACE,
 "radius":{"sm":10,"md":14,"lg":20,"sheet":24,"device":42,"pill":999},"elevation":{"0":"none","1":"0 1px 2px rgba(10,40,40,.06)","2":"0 10px 24px -14px rgba(12,70,75,.55)","sheet":"0 -8px 30px rgba(0,0,0,.18)"},"material":{"blur":20,"saturate":1.8},
 "motion":{"fast":140,"base":240,"slow":420,"stagger":40,"staggerMax":280,"easing":"cubic-bezier(.2,.9,.25,1)","spring":"cubic-bezier(.3,1.5,.5,1)","pressScale":0.97,"reducedMotion":"disable non-essential motion; durations 0"},
 "layout":{"minTarget":48,"minTargetWeb":44,"minTargetAbsolute":24,"gutter":16,"maxContentWidth":720,"tabBarHeight":64,"listRowMin":48,"listInset":58,"breakpoints":{"phone":0,"tablet":600,"desktop":960}},
 "focus":{"width":3,"offset":2,"style":"solid"}}
if __name__=="__main__":
    bad=0; rows=[]
    for mode,c in COLOR.items():
        for f,b,m,r in PAIRS:
            v=cr(c[f],c[b]); ok=v>=m; bad+=not ok; rows.append((mode,f,b,v,m,ok,r))
    if "--table" in sys.argv:
        print("| Mode | Foreground on background | Ratio | Needs | Use |\n|---|---|---|---|---|")
        for m,f,b,v,mn,ok,r in rows: print(f"| {m} | `{f}` {COLOR[m][f]} on `{b}` {COLOR[m][b]} | {v:.2f}:1 | {mn}:1 {'✔' if ok else '✘'} | {r} |")
    else:
        for m,f,b,v,mn,ok,r in rows:
            if not ok: print("FAIL",m,f,b,round(v,2),mn)
    tokens["contrastChecks"]=[dict(mode=m,fg=f,bg=b,ratio=round(v,2),min=mn,pass_=ok,use=r) for m,f,b,v,mn,ok,r in rows]
    json.dump(tokens,open("tokens.json","w"),indent=1,ensure_ascii=False)
    print("failures:",bad,"of",len(rows),file=sys.stderr)
    # Phase 22 (D64/D65): second output — a TypeScript theme file for the native app.
    # tokens.json stays the single source; nothing in app/ types a colour or size by hand.
    import os
    app_out=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..","..","app","src","theme","tokens.generated.ts")
    if os.path.isdir(os.path.dirname(app_out)):
        t={k:tokens[k] for k in ("color","space","radius","motion","layout","focus")}
        t["type"]={k:{"size":v[0],"lhEn":v[1],"lhAm":v[2],"weight":v[3]} for k,v in tokens["typography"]["scale"].items()}
        with open(app_out,"w",encoding="utf-8") as fh:
            fh.write("// GENERATED by docs/design/build_tokens.py from the design tokens. Do not edit by hand.\n")
            fh.write("export const tokens = "+json.dumps(t,indent=1,ensure_ascii=False)+" as const;\n")
        print("wrote",os.path.normpath(app_out),file=sys.stderr)
    if bad: sys.exit(1)
