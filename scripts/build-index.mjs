// games/ フォルダを走査して games.json を生成するスクリプト（GitHub Actions で実行）
//
// 対応する置き方:
//   games/my-game.html          … HTML 1枚だけのゲーム
//   games/my-game/index.html    … 画像や JS など複数ファイルのゲーム
//
// タイトル・作者・説明は以下の優先順で決まる:
//   1. games/my-game/game.json  { "title", "author", "description", "tags" }
//   2. HTML 内の <title>, <meta name="author">, <meta name="description">
//   3. フォルダ名 / ファイル名、Git のコミット作者
import { readdirSync, readFileSync, existsSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const GAMES_DIR = "games";
const THUMB_NAMES = ["thumbnail.png", "thumbnail.jpg", "thumbnail.jpeg", "thumbnail.gif", "thumbnail.webp"];

function git(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}

function readHtmlMeta(file) {
  const html = readFileSync(file, "utf8");
  const pick = (re) => {
    const m = html.match(re);
    return m ? decodeEntities(m[1].trim()) : "";
  };
  const meta = (name) =>
    pick(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["']`, "i")) ||
    pick(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${name}["']`, "i"));
  return {
    title: pick(/<title[^>]*>([^<]*)<\/title>/i),
    author: meta("author"),
    description: meta("description"),
  };
}

function gitInfo(path) {
  // 最初に追加した人を作者、最後の更新日時を更新日とする
  // （--follow はフォルダに使えないので付けない）
  const authors = git(["log", "--format=%an", "--", path]).split("\n").filter(Boolean);
  const updated = git(["log", "-1", "--format=%cI", "--", path]);
  const added = git(["log", "--diff-filter=A", "--format=%cI", "--", path]).split("\n").filter(Boolean).pop();
  return {
    author: authors.length ? authors[authors.length - 1] : "",
    updated: updated || new Date().toISOString(),
    added: added || updated || new Date().toISOString(),
  };
}

const games = [];

if (existsSync(GAMES_DIR)) {
  for (const name of readdirSync(GAMES_DIR).sort()) {
    if (name.startsWith(".") || name.startsWith("_")) continue;
    const full = join(GAMES_DIR, name);
    const isDir = statSync(full).isDirectory();

    let entry, id;
    if (isDir) {
      entry = join(full, "index.html");
      if (!existsSync(entry)) {
        console.warn(`skip: ${full} に index.html がありません`);
        continue;
      }
      id = name;
    } else if (/\.html?$/i.test(name)) {
      entry = full;
      id = name.replace(/\.html?$/i, "");
    } else {
      continue;
    }

    const html = readHtmlMeta(entry);
    let json = {};
    const jsonPath = join(full, "game.json");
    if (isDir && existsSync(jsonPath)) {
      try {
        json = JSON.parse(readFileSync(jsonPath, "utf8"));
      } catch (e) {
        console.warn(`warn: ${jsonPath} の JSON が壊れています: ${e.message}`);
      }
    }
    const info = gitInfo(full);
    const thumb = isDir ? THUMB_NAMES.find((t) => existsSync(join(full, t))) : null;

    games.push({
      id,
      title: json.title || html.title || id,
      // Git のコミット作者名は GitHub アカウント名なので表示に使わない
      author: json.author || html.author || "ななし",
      description: json.description || html.description || "",
      tags: Array.isArray(json.tags) ? json.tags : [],
      url: entry.replace(/\\/g, "/"),
      thumbnail: thumb ? `${GAMES_DIR}/${name}/${thumb}` : null,
      added: info.added,
      updated: info.updated,
    });
  }
}

games.sort((a, b) => b.added.localeCompare(a.added));
writeFileSync("games.json", JSON.stringify({ generated: new Date().toISOString(), games }, null, 2));
console.log(`games.json を生成しました（${games.length} 本）`);
