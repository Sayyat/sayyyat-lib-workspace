// release.mjs (Monorepo нұсқасы)
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// ❗️ 1. ҚАЙ ПАКЕТТІ ЖАРИЯЛАЙТЫНЫМЫЗДЫ КӨРСЕТЕМІЗ
const PKG_NAME = "@sayyyat/react-query-conditional";
const PKG_PATH = path.resolve(process.cwd(), "packages/react-query-conditional");

// --- (run және out функциялары өзгеріссіз) ---
const run = (cmd, args = [], opts = {}) => {
  const res = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...opts,
  });
  if (res.status !== 0) process.exit(res.status ?? 1);
  return res;
};

// 1) Git тазалығын тексеру (өзгеріссіз)
const isClean =
  spawnSync("git", ["diff", "--quiet"]).status === 0 &&
  spawnSync("git", ["diff", "--cached", "--quiet"]).status === 0;

if (!isClean) {
  console.error("❌ Git working directory not clean. Commit or stash your changes first.");
  process.exit(1);
}

// 2) Нұсқа түрі (өзгеріссіз)
const versionType = process.argv[2] || "patch";
let notes = null;
for (let i = 3; i < process.argv.length; i++) {
  if (process.argv[i] === "--notes") {
    notes = process.argv.slice(i + 1).join(" ");
    break;
  }
}

// 3) 'gh' (GitHub CLI) тексеру (өзгеріссіз)
const hasGh = spawnSync("gh", ["--version"], { stdio: "ignore" }).status === 0;
const ghToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
if (!hasGh) {
  console.error("❌ GitHub CLI (gh) не установлен. Установи gh или используй GH_TOKEN/GITHUB_TOKEN.");
  process.exit(1);
}
if (spawnSync("gh", ["auth", "status"], { stdio: "ignore" }).status !== 0 && !ghToken) {
  console.error("❌ Нет аутентификации gh. Выполни `gh auth login` или задай GH_TOKEN/GITHUB_TOKEN в окружении.");
  process.exit(1);
}

// ❗️ 4) Нұсқаны 'pnpm' арқылы жаңарту (ӨЗГЕРТІЛДІ)
// 'npm version' орнына 'pnpm version' және '--filter' қолданамыз
console.log(`Bumping version for ${PKG_NAME} using ${versionType}...`);
run("pnpm", ["version", versionType, "--filter", PKG_NAME]);

// Жаңа нұсқаны және тегті алу
const pkgJsonPath = path.join(PKG_PATH, "package.json");
const newVersion = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8")).version;
const newTag = `${PKG_NAME}@${newVersion}`; // pnpm осындай тег жасайды

// 5) Push жасау (өзгеріссіз)
run("git", ["push"]);
run("git", ["push", "--tags"]);

// ❗️ 6) GitHub Release жасау (ӨЗГЕРТІЛДІ)
// 'newTag' енді басқа форматта (@sayyyat/...)
const ghArgs = ["release", "create", newTag, "--latest"];
if (notes) ghArgs.push("--notes", notes);
else ghArgs.push("--generate-notes");

run("gh", ghArgs, {
  env: { ...process.env, GH_TOKEN: ghToken ?? process.env.GITHUB_TOKEN },
});

console.log(`✅ Release ${newTag} создан. CI подхватит тег и опубликует в npm.`);