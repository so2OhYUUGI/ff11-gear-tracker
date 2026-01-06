# FF11 Gear Tracker

ファイナルファンタジーXI (FF11) のRMEA武器やAF・エンピリアン装束作成を支援する、素材・ポイント管理アプリケーションです。
複数アカウント・複数キャラクターの所持アイテムを一元管理し、目標達成に必要な残数を可視化します。

## 🚀 主な機能

- **アイテムデータベース**: 素材、装備、各種ポイント（ホールマーク、ガラントリー等）を統合管理
- **在庫管理**: キャラクターごとの所持数をリアルタイムで記録・更新
- **ユーザー認証**: Supabase Authによるメールアドレス認証（ログイン/新規登録）
- **マルチキャラクター**: 1ユーザーにつき複数のキャラクター（メイン・倉庫）を紐付け可能

## 🛠 技術スタック

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime)
- **Deployment**: Vercel (予定)

## 🏁 開発環境のセットアップ (Getting Started)

### 1. リポジトリのクローン
```bash
git clone https://github.com/so2OhYUUGI/ff11-gear-tracker.git
cd ff11-gear-tracker