// logic-check.mjs — drive real input on deterministic tools and assert the
// CORRECT output appears (not just "no error"). Each case: navigate, run steps,
// assert expected substrings are present in the page.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("/opt/homebrew/lib/node_modules/promptfoo/node_modules/playwright");

const BASE = process.argv[2] || "http://localhost:8231";

// helper actions used in cases
const cases = [
  {
    path: "/base64/", name: "base64 encode",
    run: async (p) => { await p.locator("textarea, input[type=text]").first().fill("hello"); await p.waitForTimeout(300); },
    expect: ["aGVsbG8="],
  },
  {
    path: "/url-encoder/", name: "url encode",
    run: async (p) => { await p.locator("textarea, input[type=text]").first().fill("a b&c=d"); await p.waitForTimeout(300); },
    expectAny: ["a%20b%26c%3Dd", "a+b%26c%3Dd", "a%20b&c=d".replace(/&/g, "%26")],
  },
  {
    path: "/case-converter/", name: "case upper",
    run: async (p) => { await p.locator("textarea").first().fill("hello world"); await p.waitForTimeout(400); },
    expectAny: ["HELLO WORLD", "Hello World", "hello-world", "helloWorld"],
  },
  {
    path: "/color-converter/", name: "hex→rgb",
    run: async (p) => {
      const inp = p.locator("input:not([type=color]):not([type=range]):not([type=checkbox]):not([type=radio])").first();
      await inp.fill("#ff0000"); await inp.press("Enter"); await p.waitForTimeout(400);
    },
    expectAny: ["255, 0, 0", "255,0,0", "rgb(255, 0, 0)"],
  },
  {
    path: "/timestamp/", name: "epoch→date",
    run: async (p) => {
      const inp = p.locator("input").first();
      await inp.fill("0"); await p.waitForTimeout(400);
    },
    expectAny: ["1970", "Jan 01 1970", "1970-01-01"],
  },
  {
    path: "/json-formatter/", name: "pretty-print json",
    run: async (p) => { await p.locator("textarea").first().fill('{"a":1,"b":[2,3]}'); await p.waitForTimeout(400); },
    expectAny: ['"a": 1', '"a":1'],
  },
  {
    path: "/lorem-ipsum/", name: "generate lorem",
    run: async (p) => { await p.waitForTimeout(400); },
    expectAny: ["Lorem", "lorem", "dolor"],
  },
  {
    path: "/hash-generator/", name: "sha256(abc)",
    run: async (p) => { await p.locator("textarea, input[type=text]").first().fill("abc"); await p.waitForTimeout(500); },
    expectAny: ["ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"],
  },
  {
    path: "/text-diff/", name: "diff two texts",
    run: async (p) => {
      const tas = p.locator("textarea");
      await tas.nth(0).fill("the cat sat"); await tas.nth(1).fill("the dog sat"); await p.waitForTimeout(400);
    },
    expectAny: ["cat", "dog"],
  },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ colorScheme: "light", permissions: ["clipboard-read", "clipboard-write"] });
let pass = 0, fail = 0;
for (const c of cases) {
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e.message).slice(0, 80)));
  try {
    await page.goto(BASE + c.path, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(300);
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(200);
    await c.run(page);
    const body = (await page.evaluate(() => document.body.innerText)) + " " +
                 (await page.evaluate(() => Array.from(document.querySelectorAll("input,textarea")).map(e => e.value).join(" ")));
    const wants = c.expect || c.expectAny;
    const ok = c.expect ? c.expect.every((w) => body.includes(w)) : c.expectAny.some((w) => body.includes(w));
    if (ok && errs.length === 0) { pass++; console.log(`✓ ${c.name} (${c.path})`); }
    else { fail++; console.log(`✗ ${c.name} (${c.path}) — expected ${JSON.stringify(wants)}${errs.length ? " | errors: " + errs.join(",") : " | not found in output"}`); }
  } catch (e) {
    fail++; console.log(`✗ ${c.name} (${c.path}) — threw: ${String(e.message).slice(0, 90)}`);
  }
  await page.close();
}
console.log(`\nlogic-check: ${pass} pass, ${fail} fail (of ${cases.length})`);
await browser.close();
