// 公開用フォルダ内のすべての HTML に noindex を入れて、検索エンジンに載りにくくする
// （GitHub Pages のプロジェクトサイトでは robots.txt が効かないため、各ページに埋め込む）
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const TAG = '<meta name="robots" content="noindex, nofollow">';
const root = process.argv[2] || "_site";
let count = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.html?$/i.test(name)) {
      const html = readFileSync(full, "utf8");
      if (/<meta[^>]+name=["']robots["']/i.test(html)) continue;
      const out = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (m) => `${m}\n${TAG}`) : `${TAG}\n${html}`;
      writeFileSync(full, out);
      count++;
    }
  }
}

walk(root);
console.log(`noindex を ${count} ファイルに追加しました`);
