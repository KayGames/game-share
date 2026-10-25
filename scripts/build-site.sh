#!/bin/sh
# 公開用フォルダ _site を作る（Cloudflare Pages のビルドコマンドから呼ばれる）
set -e

# 追加日・更新日を git 履歴から取るので、浅いクローンなら履歴を取り直す
if [ "$(git rev-parse --is-shallow-repository 2>/dev/null)" = "true" ]; then
  git fetch --unshallow --quiet || echo "warn: 履歴を取得できませんでした（日付が不正確になります）"
fi

node scripts/build-index.mjs

rm -rf _site
mkdir _site
cp index.html games.json _site/
cp -r games _site/

# 検索エンジンに載らないようにする
cat > _site/robots.txt <<'EOF'
User-agent: *
Disallow: /
EOF
cat > _site/_headers <<'EOF'
/*
  X-Robots-Tag: noindex, nofollow
EOF
node scripts/add-noindex.mjs _site
