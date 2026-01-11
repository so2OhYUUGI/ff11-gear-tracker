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
これらの値は、Supabaseプロジェクト管理画面の `Settings` > `API` から取得できます。

```.env.local
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 3. データベースのセットアップ

このプロジェクトは `supabase/schema.sql` にデータベースの完全なスキーマ（テーブル定義や制約）が記述されています。
Supabaseをローカル環境で開発する場合や、新しいSupabaseプロジェクトに適用する際は、このSQLファイルを使ってデータベースを構築してください。

**Supabase CLIを使用する場合 (推奨):**

Supabase CLIがインストールされていれば、以下のコマンドでスキーマを適用できます。

```bash
# プロジェクトにSupabaseを連携
supabase link --project-ref <your-project-id>

# ローカルDBの変更をスキーマファイルに反映させる前にリセット（任意）
supabase db reset

# リモート（本番）DBにローカルのスキーマを反映
supabase db push
```

**Supabaseダッシュボードを使用する場合:**

1. Supabaseプロジェクトの `SQL Editor` を開きます。
2. `supabase/schema.sql` の内容をコピー＆ペーストします。
3. クエリを実行します。

## 📝 AIアシスタントとの連携

このプロジェクトはAIアシスタント（Google Gemini）との共同作業を前提としています。
AIと開発を始める際は、**まず `DEVELOPMENT_LOG.md` を読み込ませてください`**。
このファイルには、AIがプロジェクトを正しく理解し、適切にサポートするための重要な指示がすべて記載されています。
