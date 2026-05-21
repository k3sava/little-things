#!/usr/bin/env node
// deploy.mjs — ship the static apps to their live GitHub Pages repos.
//
//   tools  →  k3sava/little-tools  (gh-pages branch)  →  tools.iamkesava.com
//   toys   →  k3sava/little-toys   (gh-pages branch)  →  toys.iamkesava.com
//   hub    →  Vercel (apps.iamkesava.com) — deploy via `vercel --prod`, not here.
//
// Each app's `out/` (Next.js static export, CNAME included) replaces the
// gh-pages tree wholesale. DEFAULT = DRY RUN: builds, clones the target repo
// into .deploy-tmp/, stages the new tree, prints `git status` — but does NOT
// push. Pass --push to commit + push (a shared-state op; explicit go-ahead).
//
// Usage:
//   node scripts/deploy.mjs                 # dry run, both static apps
//   node scripts/deploy.mjs --only toys     # subset
//   node scripts/deploy.mjs --push          # commit + push to live (GATED)
//   node scripts/deploy.mjs --no-build      # reuse existing out/ (skip build)

import { execFileSync } from "node:child_process";
import { cpSync, rmSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TMP = join(ROOT, ".deploy-tmp"); // repo-internal, gitignored — never /tmp
const ORG = "k3sava";

const APPS = [
  { name: "tools", repo: "little-tools", domain: "tools.iamkesava.com" },
  { name: "toys", repo: "little-toys", domain: "toys.iamkesava.com" },
];

const args = process.argv.slice(2);
const PUSH = args.includes("--push");
const NO_BUILD = args.includes("--no-build");
const onlyArg = args.find((a) => a.startsWith("--only"));
const only = onlyArg
  ? (onlyArg.split("=")[1] || args[args.indexOf(onlyArg) + 1] || "").split(",").filter(Boolean)
  : null;

function sh(cmd, cwd) {
  return execFileSync(cmd[0], cmd.slice(1), { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

async function main() {
  const targets = APPS.filter((a) => !only || only.includes(a.name));
  console.log(`deploy: ${targets.length} static app(s), mode=${PUSH ? "PUSH → LIVE" : "DRY RUN"}\n`);

  if (!NO_BUILD) {
    console.log("building (turbo)…");
    const names = targets.map((t) => `--filter=${t.name}`);
    sh(["pnpm", "exec", "turbo", "build", ...names], ROOT);
  }

  rmSync(TMP, { recursive: true, force: true });
  mkdirSync(TMP, { recursive: true });

  let ok = 0, fail = 0;
  for (const app of targets) {
    const out = join(ROOT, "apps", app.name, "out");
    const dir = join(TMP, app.repo);
    try {
      if (!existsSync(out) || readdirSync(out).length === 0) {
        throw new Error(`apps/${app.name}/out is empty — build first (drop --no-build)`);
      }
      // gh-pages branch may be orphaned; clone it specifically.
      sh(["git", "clone", "--depth", "1", "--branch", "gh-pages",
          `https://github.com/${ORG}/${app.repo}.git`, dir]);
      // Wipe tracked tree (keep .git), copy fresh out/ in.
      for (const entry of readdirSync(dir)) {
        if (entry === ".git") continue;
        rmSync(join(dir, entry), { recursive: true, force: true });
      }
      cpSync(out, dir, { recursive: true });
      sh(["git", "add", "-A"], dir);
      const status = sh(["git", "status", "--porcelain"], dir).trim();
      if (!status) {
        console.log(`  = ${app.name}: ${app.domain} already up to date`);
        ok++;
        continue;
      }
      const changed = status.split("\n").length;
      if (PUSH) {
        sh(["git", "commit", "-m", "deploy: sync from little-things monorepo"], dir);
        sh(["git", "push", "origin", "gh-pages"], dir);
        console.log(`  ✓ ${app.name}: pushed → ${app.domain} (${changed} files)`);
      } else {
        console.log(`  ~ ${app.name}: ${changed} files staged for ${app.domain} (dry run)`);
      }
      ok++;
    } catch (e) {
      console.log(`  ✗ ${app.name}: ${String(e.message).split("\n")[0]}`);
      fail++;
    }
  }
  console.log(`\ndeploy: ${ok} ok, ${fail} failed${PUSH ? "" : " (dry run — no pushes)"}`);
  console.log("hub → apps.iamkesava.com deploys separately on Vercel.");
  if (!PUSH) console.log(`Clones left in ${TMP} for inspection. Re-run with --push to go live.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
