#!/usr/bin/env node
// sync-kami-css.mjs — ship the built kami.css into each forkable toy/tool repo
// so a fork renders with the shared design system standalone.
//
// DEFAULT = DRY RUN: clones each repo into .sync-tmp/, copies kami.css, stages
// it, and prints `git status` — but does NOT push. Pass --push to actually
// commit + push (a bulk shared-state action; use only with explicit go-ahead).
//
// Usage:
//   node scripts/sync-kami-css.mjs                 # dry run, all repos
//   node scripts/sync-kami-css.mjs --only sonicc,aurora   # subset
//   node scripts/sync-kami-css.mjs --push          # commit + push (GATED)

import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const KAMI = join(ROOT, "packages", "kami-css", "kami.css");
const TMP = join(ROOT, ".sync-tmp"); // repo-internal, gitignored — never /tmp
const ORG = "k3sava";

// repo → path inside the repo where kami.css should land
const REPOS = [
  "aurea", "aurora", "form", "gravity-type", "kaleidoscopic",
  "particle-life", "pixart", "plink", "poster", "sonicc",
  "string-art", "synth-pad", "wordart",
  "tool-json-formatter", "tool-meeting-cost", "tool-qr-code", "tool-template",
].map((name) => ({ name, dest: "kami.css" }));

const args = process.argv.slice(2);
const PUSH = args.includes("--push");
const onlyArg = args.find((a) => a.startsWith("--only"));
const only = onlyArg ? (onlyArg.split("=")[1] || args[args.indexOf(onlyArg) + 1] || "").split(",").filter(Boolean) : null;

function sh(cmd, cwd) {
  return execFileSync(cmd[0], cmd.slice(1), { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

async function main() {
  if (!existsSync(KAMI)) {
    console.error("kami.css not built. Run `pnpm css:build` first.");
    process.exit(1);
  }
  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });

  const targets = REPOS.filter((r) => !only || only.includes(r.name));
  console.log(`sync-kami-css: ${targets.length} repos, mode=${PUSH ? "PUSH" : "DRY RUN"}\n`);

  let ok = 0, fail = 0;
  for (const repo of targets) {
    const dir = join(TMP, repo.name);
    try {
      sh(["git", "clone", "--depth", "1", `https://github.com/${ORG}/${repo.name}.git`, dir]);
      copyFileSync(KAMI, join(dir, repo.dest));
      sh(["git", "add", repo.dest], dir);
      const status = sh(["git", "status", "--porcelain"], dir).trim();
      if (!status) {
        console.log(`  = ${repo.name}: kami.css already up to date`);
        ok++;
        continue;
      }
      if (PUSH) {
        sh(["git", "commit", "-m", "chore: sync kami.css from little-things"], dir);
        sh(["git", "push"], dir);
        console.log(`  ✓ ${repo.name}: pushed`);
      } else {
        console.log(`  ~ ${repo.name}: staged (dry run)\n      ${status.replace(/\n/g, "\n      ")}`);
      }
      ok++;
    } catch (e) {
      console.log(`  ✗ ${repo.name}: ${String(e.message).split("\n")[0]}`);
      fail++;
    }
  }
  console.log(`\nsync-kami-css: ${ok} ok, ${fail} failed${PUSH ? "" : " (dry run — no pushes)"}`);
  if (!PUSH) console.log(`Clones left in ${TMP} for inspection. Re-run with --push to commit + push.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
