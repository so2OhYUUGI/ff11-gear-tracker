# FF11 Gear Tracker

Final Fantasy XIの複数キャラクターの装束（エンピリアン装束、アーティファクトなど）の強化進捗を追跡・管理するためのWebアプリケーションです。
開発中のプロジェクトであり、機能は順次追加されます。

## ⚡️ 技術スタック (主要なもの)

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

より詳細な技術スタックやディレクトリ構成、DB設計については `DEVELOPMENT_LOG.md` を参照してください。

## 🛠️ 開発環境のセットアップ

### 1. プロジェクトのクローンと依存関係のインストール

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
npm install
```

### 2. 環境変数の設定

プロジェクトのルートに `.env.local` ファイルを作成し、Supabaseプロジェクトの情報を追記します。

```.env.local
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 3. データベースのセットアップ

`supabase/schema.sql` がデータベースの完全なスキーマです。Supabaseプロジェクトにこのスキーマを適用してください。（Supabase CLIまたはWebダッシュボード経由）

### 4. 管理者 (Admin) の設定

アイテムマスターの編集など、一部の機能は管理者権限を持つユーザーのみが利用できます。
開発環境で管理者ユーザーをセットアップするには、`DEVELOPMENT_LOG.md` の「**管理者 (Admin) ロールのセットアップ**」セクションを参照してください。


## 📝 AIアシスタントとの連携

このプロジェクトはAIアシスタント（Google Gemini）との共同作業を前提としています。
開発を始める際は、**まず `DEVELOPMENT_LOG.md` を読み込ませてください`**。
このファイルには、AIがプロジェクトを正しく理解し、適切にサポートするための重要な指示がすべて記載されています。
