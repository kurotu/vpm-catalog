---
layout: ~/layouts/MarkdownLayout.astro
title: VPM Catalogについて
---

## Contents

## VPM Catalogとは？

VPM Catalogは、VCCで使用できるVPMパッケージとリポジトリを収集したリストです。
VRChatのアバターやワールドのプロジェクトで使うことのできるパッケージを探すことができます。

### VCCとは？

VRChat Creator Companion (VCC)は、VRChatが提供する公式のツールでクリエイターがプロジェクトを管理するのに役立ちます。
便利なツールをVPMパッケージとしてインポートしたり、依存関係を管理したりすることができます。
詳細については、[VCCのドキュメント](https://vcc.docs.vrchat.com/)を参照してください。

### VPMとは？

VRChat Package Manager (VPM)は、VCCや他の互換ツールで使用されるパッケージ形式です。
VPMパッケージとしてアセットを配布し、VCCで簡単にプロジェクトにインポートすることができます。
詳細については、[VCCのドキュメント](https://vcc.docs.vrchat.com/vpm/)を参照してください。

## パッケージを掲載するには？

VPM Catalogにパッケージを掲載するには、VPMリポジトリのURLを登録する必要があります。
一度リポジトリが掲載されると、VPM Catalogは自動的にリポジトリからパッケージの一覧を取得します。

[登録フォーム](https://docs.google.com/forms/d/e/1FAIpQLSc4nvnKJAbHkvygU-CT3Ms0viUm3dv_i_66R7c22tQSZ-f1Ow/viewform?usp=sf_link)からリポジトリを送信してください。

## パッケージの情報が少ないのはなぜ？

VPM CatalogはVPMリポジトリからパッケージのメタデータを取得し、最新のリリースzipファイルから`README.md`ファイルを取得します。
そのため、リポジトリにメタデータや`README.md`ファイルがない場合、情報が少なく表示されます。

### パッケージのzipファイルにREADME.mdを含める

パッケージのルートフォルダにある`README.md`がページの作成に使用されます。

### package.jsonとリポジトリjsonの推奨フィールドを埋める

推奨フィールドはUnity Package Manager (UPM)形式に基づいています。
`package.json`ファイルにメタデータを記載し、リポジトリのjsonに埋め込むことができます。
詳細については、[Unityのドキュメント](https://docs.unity3d.com/ja/2022.3/Manual/upm-manifestPkg.html)を参照してください。

ページに表示される推奨フィールドは以下の通りです。

| フィールド | 説明 |
|---|---|
| `description` | パッケージの簡単な説明。 |
| `displayName` | Unityに表示されるユーザーに分かりやすい名前。 |
| `unity` | パッケージが互換性を持つ最低のUnityバージョンを示します。 |
| `author` | パッケージの作者。 |
| `changelogUrl` | URLで指定したパッケージの変更ログのカスタムの保存場所。 |
| `documentationUrl` | URLで指定したパッケージのドキュメントのカスタムの保存場所。 |
| `license` | [SPDX識別子形式](https://spdx.org/licenses/)を使用したOSSライセンスの識別子、または "See LICENSE.md file" のような文字列。 |
| `licenseUrl` | URLで指定したパッケージのライセンス情報の保存場所。 |

## パッケージやリポジトリを削除するには？

VPM Catalogからパッケージやリポジトリを削除する方法は2つあります。

### 1. パッケージメタデータの`'vrc-get'.yanked`フィールドを使用する

`'vrc-get'.yanked`は[vrc-get](https://vrc-get.anatawa12.com/ja/cli/)と[ALCOM](https://vrc-get.anatawa12.com/ja/alcom/)で定義されている、廃止されたパッケージを非表示にするためのフィールドです。
VPM Catalogも`'vrc-get'.yanked`が文字列または`true`の場合にパッケージを非表示にします。

```json
{
  "name": "com.example.package",
  "vrc-get": {
    "yanked": "This package is discontinued."
  }
}
```

### 2. ウェブサイトの管理者に連絡する

- GitHubリポジトリ: [kurotu/vpm-catalog](https://github.com/kurotu/vpm-catalog)
- X: [@kurotu](https://x.com/kurotu)

## Googleアナリティクスの使用について

当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。このGoogleアナリティクスはデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。

この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。この規約に関しての詳細は[Googleアナリティクスサービス利用規約](https://marketingplatform.google.com/about/analytics/terms/jp/)のページや[Googleポリシーと規約ページ](https://policies.google.com/technologies/ads?hl=ja)をご覧ください。
