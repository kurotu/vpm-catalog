---
name: vpm-discovery
description: VRChatのVPMリポジトリURLを新たに発見・報告するスキル。GitHub API・Yahoo Japan リアルタイム・GoogleをWeb検索やplaywright-cliで補完し、直近1か月の検索範囲から未収録のVPMリポジトリを検出する。リポジトリ自体の作成日で除外せず、最近の更新や告知で発見できたものは報告対象に含める。特にYahooリアルタイム検索での補完調査と、報告URLのJSON実在確認が必要なときに使う。明示的に呼び出された場合のみ使用すること。
---

# VPM Repository Discovery

VRChatのVPM（VPM Package Manager）リポジトリを新たに発見するスキルです。
**GitHub APIを主要手段**として使い、補完的にYahoo Japan・Googleも活用します。

## 概要フロー

1. **既知URLの読み込み** — フィルタリング用に既存リストを収集
2. **GitHub API検索** — 複数クエリで直近1か月の更新・露出がある候補を収集
3. **補完検索** — Yahoo Japan リアルタイム・Google をplaywright-cliで検索
4. **URL正規化と検証** — 短縮URL展開後、`index.json` / `vpm.json` に正規化して `web_fetch` で確認
5. **結果報告** — 未収録URLを集約的リポジトリ優先で報告

---

## Step 1: 既知URLの読み込み

VPM Catalog自身の `repositories.txt` と `repositories-ignore.txt` を読み込んで既知URLのセットを作成する。
これらのファイルを **情報源として使用してはならない**（URLの発見には使わない）が、
**フィルタリングには使用する**（既に収録済みのURLを除外するため）。

```
既知URLセット = repositories.txt の全URL + repositories-ignore.txt の全URL
```

> **注意**: vrc-getのrepositories.txt（`https://vrc-get.anatawa12.com/` 等）は情報源にしてはならない。

---

## Step 2: GitHub APIによる検索（主要手段）

GitHub Search UIではなく **GitHub Search API** を使う。ブラウザ不要で安定しており、日付フィルタも正確に機能する。
`YYYY-MM-DD` は実行日から1か月前の日付に置き換える。

> **重要**: ここでの「直近1か月」は**検索範囲**を絞るための条件であり、**報告対象の repository created_at を直近1か月に限定する意味ではない**。過去に作成されたリポジトリでも、直近1か月の更新・公開・告知によって今回初めて発見できた未収録URLであれば報告する。

以下の複数クエリを **並列で `web_fetch`** して候補を収集する：

```
https://api.github.com/search/repositories?q=vpm+vrchat+pushed%3A>YYYY-MM-DD&sort=updated&order=desc&per_page=30
https://api.github.com/search/repositories?q=vpm+package+listing+vrchat+pushed%3A>YYYY-MM-DD&sort=updated&order=desc&per_page=30
https://api.github.com/search/repositories?q=vpm-listing+vrchat+pushed%3A>YYYY-MM-DD&sort=updated&order=desc&per_page=30
https://api.github.com/search/repositories?q=VCC+listing+vrchat+pushed%3A>YYYY-MM-DD&sort=updated&order=desc&per_page=30
```

レスポンスJSONの `items` 配列から以下の条件でGitHub Pages URLを絞り込む：
- `has_pages: true` — GitHub PagesでVPM JSONを配信している可能性が高い
- `fork: false` — フォークは除外
- 対象外: vpm-catalogリポジトリ自身（`kurotu/vpm-catalog`）、vrc-get等のツール系リポジトリ

GitHubPagesのURLは `https://<owner>.github.io/<repo>/index.json` が標準。
`homepage` フィールドにカスタムドメインが入っている場合はそちらも候補にする。

> **ページネーション**: `total_count > 30` の場合は `&page=2` で続きを取得すること。

---

## Step 3: 補完検索（playwright-cli）

GitHub APIで見つからない可能性のある情報源として、Yahoo Japan リアルタイムとGoogleも確認する。

### playwright-cli が利用可能かどうかの確認

playwright-cliを起動する前に、Chromiumがインストールされているか確認する。
失敗した場合は先にインストールする：
```bash
playwright-cli install-browser chromium
```

### 3-1: Yahoo Japan リアルタイム検索

まずは次のクエリを優先して試す:

1. `VPM リポジトリ`
2. `VPMリポジトリ`
3. `VPM リポジトリ VRChat`
4. `VCC 追加`

`VPM リポジトリ` は実際の告知ポストに当たりやすく、`VPMリポジトリ VRChat` や `index.json VRChat VPM` のように語を増やしすぎると「一致する情報は見つかりませんでした」になりやすい。

```bash
playwright-cli open "https://search.yahoo.co.jp/realtime/search?p=VPM%20%E3%83%AA%E3%83%9D%E3%82%B8%E3%83%88%E3%83%AA&ei=UTF-8"
playwright-cli snapshot
```

リアルタイム検索はXポスト等が対象。VPMリポジトリURLや `index.json` / `vpm.json` を含む投稿を探す。

- ページ本文に `一致する情報は見つかりませんでした` が含まれる場合、そのクエリは不発と判断する
- 表示上は `...` で省略されることがあるため、必要に応じてリンク一覧を取得する
- `t.co` など短縮URLは、必ずリダイレクト先を展開してから候補URLとして扱う
- Yahooで見つかったURLが HTML ページやディレクトリURL（例: `https://example.github.io/repo/` や `https://example.github.io/vpm/`）だった場合、そのまま報告せず Step 4 の正規化を行う

Bot検出やJavaScriptエラーが発生した場合はスキップして次に進む。

### 3-2: Google 検索

Googleはヘッドレスブラウザを頻繁にブロックするため、`web_fetch` を先に試みる：
```
https://www.google.com/search?q=VRChat+vpm+index.json+site%3Agithub.io&tbs=qdr%3Am
```

取得できなかった場合（JavaScript必須で空の結果）はスキップする。
playwright-cliでも同様にBotブロックされることが多いため、無理に試みない。

---

## Step 4: VPMリポジトリURLのパターン認識

VPMリポジトリのURLは以下のようなパターンを持つことが多い：

```
https://<user>.github.io/<repo>/index.json
https://<user>.github.io/<repo>/vpm.json
https://<user>.github.io/<repo>/
https://<user>.github.io/vpm/
https://vpm.<domain>/index.json
https://vpm.<domain>/vpm.json
https://<custom-domain>/
https://raw.githubusercontent.com/<user>/<repo>/main/index.json
https://<custom-domain>/index.json
```

ただし、**報告対象は JSON を直接返すURLだけ**とする。
HTMLページやディレクトリURLを見つけた場合は、まず次のようにJSON候補へ正規化する:

1. 末尾が `/` の場合は `index.json` を付けた候補を試す
2. `index.json` が404なら `vpm.json` も試す
3. カスタムドメインのルートURLも同様に `index.json` / `vpm.json` を試す

例:

- `https://rassi0429.github.io/KokoaVPMRepository/` → `https://rassi0429.github.io/KokoaVPMRepository/index.json`
- `https://sizimityper.github.io/vpm/` → `https://sizimityper.github.io/vpm/index.json`

URLを収集したら、正規化後のURLに実際にアクセスして**VPMリポジトリであることを確認**する（Step 5）。

---

## Step 5: URL検証

候補URLそれぞれに対して **`web_fetch`** でアクセスし、以下の条件を確認する。
playwright-cliでの検証より `web_fetch` の方が高速で安定しているため、こちらを優先する。

1. HTTPステータスが200（404などはそのURLを除外）
2. JSONとして解析可能
3. 以下のいずれかのフィールドを含む：
   - `packages` オブジェクト（VPMリポジトリの必須フィールド）
   - `name` + `id` + `url`

追加ルール:

- 元の候補URLがHTMLページや短縮URLだった場合、**最終的に200でJSONを返したURLだけ**を報告URLとして採用する
- ルートURL自体が有効でも、レスポンスがHTMLなら報告対象にしない
- `index.json` と `vpm.json` の両方が有効な場合は、JSONの `url` フィールドと一致する方を優先する
- Yahoo経由で見つけたURLも、報告前に必ず `web_fetch` でJSONレスポンスを確認する

複数の候補URLは **並列で `web_fetch`** して効率よく確認する。

---

## Step 6: フィルタリング

Step 1で収集した既知URLセットと照合し、**既に収録済みのURLは除外する**。

- URLの末尾スラッシュの有無、大文字小文字の違いは正規化して比較すること
- 拾ったHTML URLは、JSON URLに正規化してから既知URLセットと比較すること
- `repositories-ignore.txt` に含まれるURLも除外すること（意図的に除外されているため）

---

## Step 7: 代表パッケージの取得と集約度の評価

未収録URLが確定したら、各リポジトリJSONから情報を取得し、**集約的かどうか**を判定する。

### 集約的リポジトリ（優先報告）

`packages` オブジェクトに**複数の異なるパッケージ**が含まれるリポジトリは「集約的VPMリポジトリ」として優先して報告する。
これは、ある作者が自分の複数ツールをまとめて配布しているケースであり、ユーザーにとって価値が高い。

例: `packages` に `com.author.tool-a`, `com.author.tool-b`, `com.author.tool-c` が含まれる場合 → 集約的

### 単一パッケージリポジトリ（後回し）

`packages` に1パッケージしかない場合は「単一パッケージリポジトリ」として後順で報告する。

### 代表パッケージの選択（単一の場合も含む）

報告用の代表パッケージを1つ選ぶ際の優先順位：
1. `keywords` や `description` が充実しているもの
2. バージョン数が多い（活発に開発されている）もの
3. パッケージ名がわかりやすいもの

---

## Step 8: 結果報告

以下のフォーマットで報告する。**集約的リポジトリを先に、単一パッケージリポジトリを後に**並べること。

```markdown
## 新規発見VPMリポジトリ

### 1. <リポジトリ名>（集約: N パッケージ）   ← 集約的な場合はパッケージ数を明記
**URL**: `<vpm-repository-url>`
**発見元**: GitHub API / Yahoo Japan リアルタイム / Google
**収録パッケージ**: `<pkg-a>`, `<pkg-b>`, ... （集約的の場合は全パッケージIDを列挙）
**代表パッケージ**: `<package-id>`
**概要**: <パッケージ群の機能・用途を2〜3文で説明。集約的な場合はまとめて説明する>

---

### 2. <リポジトリ名>
**URL**: `<vpm-repository-url>`
**発見元**: GitHub API
**代表パッケージ**: `<package-id>`
**概要**: <パッケージの機能・用途を2〜3文で説明>

---
```

未収録URLが見つからなかった場合は、その旨を報告する。

報告時の追加ルール:

- `created_at` が直近1か月より古くても、それを理由に除外しない
- 直近1か月の検索範囲で見つかった未収録URLであれば報告対象に含める
- 必要なら説明文で「最近発見できたが repo 自体は以前から存在する」と補足してよい

---

## 注意事項

- **検索のみが目的**。収集したURLを `repositories.txt` に追加するなど、ファイルの変更は行わない
- GitHub APIはレート制限（未認証: 10req/min）があるため、リクエスト間隔に注意する
- playwright-cliセッションは作業終了後に `playwright-cli close` で必ず閉じる
- GoogleやYahooでBot検出（CAPTCHA等）が発生した場合はスキップして他の検索手段を使う
- 同じドメインの別パス（例: `vpm.example.com/a.json` と `vpm.example.com/b.json`）は別リポジトリとして扱う
- vrc-get（`vrc-get/vrc-get`）などVPMクライアントツール自体はリポジトリではないので除外する
