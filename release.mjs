// release.mjs (Универсалды Monorepo нұсқасы v2 - pnpm version түзетілді)
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// --- Helper Functions ---
const run = (cmd, args = [], opts = {}) => {
  const res = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...opts,
  });
  if (res.status !== 0) process.exit(res.status ?? 1);
  return res;
};

const out = (cmd, args = [], opts = {}) => {
  const res = spawnSync(cmd, args, {
    encoding: "utf8",
    shell: process.platform === "win32",
    ...opts,
  });
  if (res.status !== 0) {
    console.error(`❌ Command failed: ${cmd} ${args.join(" ")}`);
    console.error(res.stderr);
    process.exit(1);
  }
  return res.stdout.toString().trim();
};

// --- 1. Кіріс деректерді алу ---
const targetPackageShortName = process.argv[2];
if (!targetPackageShortName) {
  console.error("❌ Қате: Пакет аты көрсетілмеген.");
  console.log("Usage: pnpm release <package-name> [version-type] [--notes \"...\"]");
  console.log("Мысал: pnpm release react-query-conditional patch");
  process.exit(1);
}

const versionType = process.argv[3] || "patch";
let notes = null;
for (let i = 4; i < process.argv.length; i++) {
  if (process.argv[i] === "--notes") {
    notes = process.argv.slice(i + 1).join(" ");
    break;
  }
}

// --- 2. Пакетті pnpm арқылы табу ---
let pkgData;
try {
  const listOutput = out("pnpm", ["list", "--filter", targetPackageShortName, "--depth=-1", "--json"]);
  const list = JSON.parse(listOutput);
  if (!list || list.length === 0) {
    throw new Error(`Package not found with filter: ${targetPackageShortName}`);
  }
  pkgData = list[0];
} catch (e) {
  console.error(`❌ "${targetPackageShortName}" пакетін табу кезінде қате орын алды.`);
  console.error(e.message);
  process.exit(1);
}

const PKG_NAME = pkgData.name; // @sayyyat/react-query-conditional
const PKG_PATH = pkgData.path; // D:\...\packages\react-query-conditional

console.log(`🚀 Релиз жасалатын пакет: ${PKG_NAME} (v${pkgData.version})`);
console.log(`   Орналасқан жері: ${PKG_PATH}`);

// --- 3. 'git status' тексеру ---
console.log("Checking git status...");
const isClean =
    spawnSync("git", ["diff", "--quiet"]).status === 0 &&
    spawnSync("git", ["diff", "--cached", "--quiet"]).status === 0;

if (!isClean) {
  console.error("❌ Git working directory not clean. Commit or stash your changes first.");
  process.exit(1);
}

// --- 4. 'gh auth' тексеру ---
console.log("Checking GitHub CLI auth status...");
// (Бұл бөлім өзгеріссіз)
const hasGh = spawnSync("gh", ["--version"], { stdio: "ignore" }).status === 0;
const ghToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
if (!hasGh) {
  console.error("❌ GitHub CLI (gh) не установлен.");
  process.exit(1);
}
if (spawnSync("gh", ["auth", "status"], { stdio: "ignore" }).status !== 0 && !ghToken) {
  console.error("❌ Нет аутентификации gh. Выполни `gh auth login`.");
  process.exit(1);
}

// --- 5. ❗️ Нұсқаны 'pnpm' арқылы жаңарту (ТҮЗЕТІЛДІ) ---
console.log(`Bumping version for ${PKG_NAME} using ${versionType}...`);
// 'pnpm version' '--filter'-мен дұрыс жұмыс істемейді.
// Оның орнына, 'cwd' (current working directory) опциясын қолданып,
// команданы тікелей сол пакеттің ІШІНДЕ орындаймыз.
run(
    "pnpm",
    ["version", versionType, "--git-tag-version=false"], // ❗️ 'git' командасын орындамауды сұраймыз
    { cwd: PKG_PATH } // ❗️ Команданы орындау орны
);

// --- 6. Жаңа нұсқаны және тегті алу ---
const pkgJsonPath = path.join(PKG_PATH, "package.json");
const newVersion = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8")).version;
const newTag = `${PKG_NAME}@${newVersion}`; // Формат: @scope/name@v1.2.3

console.log(`New version: ${newVersion}, New tag: ${newTag}`);

// --- 7. 'git commit' және 'tag' жасау ---
console.log("Committing version bump...");
run("git", ["add", pkgJsonPath]);
run("git", ["add", "pnpm-lock.yaml"]);
run("git", ["commit", "-m", `chore(release): ${newTag}`]);

console.log(`Creating git tag ${newTag}...`);
run("git", ["tag", newTag]);

// --- 8. 'git push' ---
console.log("Pushing commit and tag...");
run("git", ["push"]);
run("git", ["push", "--tags"]);

// --- 9. 'gh release create' ---
console.log("Creating GitHub Release...");
const ghArgs = ["release", "create", newTag, "--latest"];
if (notes) ghArgs.push("--notes", notes);
else ghArgs.push("--generate-notes");

run("gh", ghArgs, {
  env: { ...process.env, GH_TOKEN: ghToken ?? process.env.GITHUB_TOKEN },
});

console.log(`✅ Release ${newTag} создан. CI/CD will now take over.`);