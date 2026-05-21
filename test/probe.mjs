import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("/opt/homebrew/lib/node_modules/promptfoo/node_modules/playwright");
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1280,height:900}})).newPage();
const errs=[]; p.on("pageerror",e=>errs.push(String(e.message)));
await p.goto(process.argv[2],{waitUntil:"domcontentloaded"});
await p.waitForTimeout(1200);
const info = await p.evaluate(()=>{
  const c=document.querySelector("canvas");
  if(!c) return {canvas:"NONE"};
  const cs=getComputedStyle(c);
  const r=c.getBoundingClientRect();
  // sample center pixel
  let px="n/a";
  try{const ctx=c.getContext("2d");const d=ctx.getImageData(c.width/2,c.height/2,1,1).data;px=`rgba(${d[0]},${d[1]},${d[2]},${d[3]})`;}catch(e){px="err:"+e.message.slice(0,30);}
  return {
    display:cs.display, visibility:cs.visibility, opacity:cs.opacity,
    cssW:cs.width, cssH:cs.height, attrW:c.width, attrH:c.height,
    rectW:Math.round(r.width), rectH:Math.round(r.height), rectTop:Math.round(r.top),
    centerPixel:px,
    bodyBg:getComputedStyle(document.body).backgroundColor,
    canvasBgVar:getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()
  };
});
console.log(JSON.stringify(info,null,2));
console.log("errors:",errs.length?errs.join(" | "):"none");
await b.close();
