# 概要

直近1か月の新規VPMレポジトリを調査し、repositories.txtに追加するプルリクエストを作成してください。

## タスク方針

vpm-discoveryスキルを使用してリポジトリを探索します。
発見した新規VPMリポジトリに対応するプルリクエストがすでに作成されている場合は重複しないようにしてください。
リポジトリはGitHubに掲載されているとは限らないため、Yahooリアルタイム検索による探索は必ず行ってください。

## プルリクエスト

### タイトル

`Add new VPM repositories (YYYY-MM-DD)` の形式とし、現在の日付を入れます。

### コミット内容

作業はmasterとは別ブランチで実施してください。
リポジトリURLはrepositories.txtに辞書順で追記します。

repositories.txtに未記載ではあるが無視すべきリポジトリを発見した場合はrepositories-ignore.txtへコメントと共に追記します。

```
{URL} # {REASON}
```

最後に `tasks/sort-repos.sh` を実行してrepositories.txt等を辞書順にソートしてください。

### 本文

追加するリポジトリ自体の概要のほか、代表的なパッケージに関する概要を記載してください。
