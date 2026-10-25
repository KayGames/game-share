# 🎮 なかまゲーム置き場

仲間内で作った HTML ゲームを共有するためのサイトです。
`games/` フォルダにゲームを入れるだけで、一覧ページに自動で追加されます。

**遊ぶ場所:** `https://<ユーザー名>.github.io/<リポジトリ名>/`

---

## ゲームを追加する（ブラウザだけでOK）

### パターンA: HTML 1枚だけのゲーム

1. このリポジトリの `games` フォルダを開く
2. 右上の **Add file → Upload files**
3. `my-game.html` をドラッグ＆ドロップ → **Commit changes**

### パターンB: 画像・JS・音声などが複数あるゲーム

1. フォルダの中に **`index.html`** を入れておく（これが最初に開くページ）
2. `games` フォルダで **Add file → Upload files**
3. **フォルダごと**ドラッグ＆ドロップ → **Commit changes**

```
games/
├── click-race.html        ← パターンA
└── dodge/                 ← パターンB
    ├── index.html
    ├── game.js
    ├── style.css
    ├── game.json          ← 任意: タイトルや説明
    └── thumbnail.png      ← 任意: 一覧に出るサムネイル（16:9 推奨）
```

1〜2分後に一覧ページへ反映されます（進み具合は **Actions** タブで確認できます）。

## タイトル・作者・説明の付け方

何も書かなくても、ファイル名とアップロードした人の名前で表示されます。
ちゃんと表示したい場合はどちらかを書いてください。

**方法1: HTML の `<head>` に書く**（パターンA・B どちらでも可）

```html
<title>ゲームのタイトル</title>
<meta name="author" content="作った人">
<meta name="description" content="どんなゲームか一言で">
```

**方法2: `game.json` を置く**（パターンBのみ。タグも付けられる）

```json
{
  "title": "ゲームのタイトル",
  "author": "作った人",
  "description": "どんなゲームか一言で",
  "tags": ["アクション", "2人用"]
}
```

## ルール・注意

- パスは**相対パス**で書く（`/img/a.png` ではなく `img/a.png`）。先頭が `/` だと動きません
- ファイル名・フォルダ名は**半角英数字とハイフン**がおすすめ（例: `space-shooter`）
- 1ファイル 100MB まで（GitHub の制限）
- 名前が `_` か `.` で始まるもの（例: `_wip-game`）は一覧に出ません。作りかけの置き場にどうぞ
- 他の人のゲームを直すときは、ひとこと声をかけてから

---

## 管理者向け: 最初のセットアップ

1. GitHub で新しいリポジトリを作り、このフォルダの中身をすべてアップロード
   （`.github` フォルダも忘れずに。Upload files でドラッグすれば入ります）
2. **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にする
3. **Actions** タブで「ゲーム一覧を更新して公開」を **Run workflow**（または何かコミット）
4. **Settings → Collaborators → Add people** で仲間を招待すると、仲間も直接アップロードできます

> 無料プランでは GitHub Pages を使うにはリポジトリを **Public** にする必要があります。
> サイトの URL を知っている人なら誰でも遊べる状態になる点に注意してください。
