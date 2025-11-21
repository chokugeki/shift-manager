---
description: Vercelへのデプロイ手順
---

# Vercelへのデプロイ方法

Next.jsアプリケーションをVercelにデプロイする最も簡単で推奨される方法は、GitHubを使用することです。

## 手順

### 1. GitHubリポジトリの準備
まず、ソースコードをGitHubにアップロードします。

1.  [GitHub](https://github.com/)のアカウントを作成します（まだの場合）。
2.  GitHubで「New repository」をクリックし、新しいリポジトリを作成します。
3.  ローカルのプロジェクトフォルダで以下のコマンドを実行し、GitHubにプッシュします。

```bash
# gitの初期化（まだの場合）
git init

# 全ファイルをステージング
git add .

# コミット
git commit -m "Initial commit"

# リモートリポジトリを追加（URLは自分のリポジトリのものに置き換えてください）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# プッシュ
git push -u origin main
```

### 2. Vercelでの設定
1.  [Vercel](https://vercel.com/)のアカウントを作成します（"Continue with GitHub"を選ぶとスムーズです）。
2.  ダッシュボードの「Add New...」ボタンから「Project」を選択します。
3.  「Import Git Repository」の画面で、先ほど作成したGitHubリポジトリの「Import」ボタンを押します。

### 3. デプロイの実行
1.  「Configure Project」画面が表示されます。
2.  **Framework Preset** が `Next.js` になっていることを確認します。
3.  **Build and Output Settings** や **Environment Variables** は、特別な設定がなければそのままで大丈夫です。
4.  「Deploy」ボタンをクリックします。

### 4. 完了
デプロイが完了すると、花吹雪のアニメーションが表示され、公開URL（例: `https://your-project.vercel.app`）が発行されます。このURLにアクセスすれば、誰でもアプリを利用できます。

---

## 今後の更新について
GitHubと連携しているため、ローカルでコードを修正してGitHubに `push` するだけで、Vercelが自動的に検知して新しいバージョンをデプロイしてくれます。
