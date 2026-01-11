# DEVELOPMENT_LOG.md
これは開発メモであると同時にAIと継続的な作業を行うための指令書である。

## ⚠️ AIアシスタントへの重要指示（メンテナンスポリシー）
**本ドキュメントはプロジェクトの「設計図」兼「正解（Source of Truth）」である。**
1. **情報の永続性**: 「2. ディレクトリ構成」「3. データベース設計」は、AIによる要約や省略を厳禁とする。
2. **ドキュメントの同期**: 作業完了時（Gitプッシュ等）、AIは本ドキュメント(`DEVELOPMENT_LOG.md`)および`README.md`を常に最新の状態に保ち、ユーザーと同期すること。
3. **視認性の確保**: ディレクトリ構成に特殊文字（ツリー記号）を使用せず、箇条書きリスト形式を維持すること。
4. **コード修正時の確認**: 新規のコンポーネントは即座に生成すること。既存のコードを書き換えるときは、修正が必要なコンポーネントを提示し、そのコードのGitHub URLを求めること。

---

## 1. プロジェクト概要
FF11 装束強化進捗トラッカー。複数キャラクターの装備進捗を一元管理し、強化に必要な素材や次の目標を可視化することを目的としたWebアプリケーション。

### 技術スタック (Technical Stack)
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19 (with React Compiler)
- **Language**: TypeScript 5
- **Backend & Auth**: Supabase (SSR)
- **Styling**: 
  - **Core**: Tailwind CSS v4
  - **Utilities**: `clsx`, `tailwind-merge`, `class-variance-authority`
  - **Icons**: `lucide-react`

---

## 2. ディレクトリ構成 (2026-01-09 更新)
### 詳細が知りたい場合は find src -maxdepth 4 -not -path '*/.*' を求めよ
- src/
  - app/ (Routing)
    - gear/ : 装束トラッカー画面
    - characters/ : キャラクター管理 (一覧、作成)
    - accounts/ : ゲームアカウント管理
    - login/ : ログインページ
    - auth/ : 認証関連 (コールバック、サインアウト)
    - settings/ : アプリ設定
    - test/ : テスト用ページ
    - actions.ts : Server Actions
    - page.tsx : 総合ポータル
    - layout.tsx : アプリ共通レイアウト（AppShell）
  - components/ (UI Components)
    - layout/ : AppHeader, Navigation
    - gear/ : GearTrackerContainer, JobSelector, GearSlotList, GearEditModal, GearCategoryTabs, GearUpgradeRecipe
    - gear/hooks/ : useGearTracker, useUpgradeRecipes (カスタムフック)
    - character/ : CharacterManager, CharacterWizard, CharacterCard, steps/
    - account/ : AccountList
  - lib/ (Shared Core)
    - supabase/ : server/client SDK設定
    - types.ts : アプリ共通型定義
    - utils.ts : ユーティリティ関数
    - constants/ : 各種定数の宣言
    - colors.ts : アカウントカラー生成ロジック

---

## 3. データベース設計 (Schema)

### 3.1. スキーマのSource of Truth
データベースのテーブル定義、制約、カスタム型など、構造に関する**唯一の正解（Source of Truth）は `supabase/schema.sql` ファイル**です。

データベース構造に変更を加えた場合（例: カラムの追加、テーブルの作成）、開発者は必ずSupabaseのマイグレーション機能等を用いて変更内容をこの`schema.sql`に反映させる必要があります。

### 3.2. アクセス制御 (Row Level Security)
セキュリティとデータの整合性を保つため、テーブルにはRLSポリシーが設定されています。

- **`items` テーブル**:
  - `SELECT`: 認証済みユーザーであれば誰でも可能。
  - `INSERT`, `UPDATE`, `DELETE`: `admin` ロールを持つユーザーのみ可能。
- **`user_roles` テーブル**:
  - `SELECT`: ユーザーは自分自身のロール情報のみ閲覧可能。`admin` は全ユーザーのロールを閲覧可能。
  - `INSERT`, `UPDATE`, `DELETE`: `admin` ロールを持つユーザーのみ可能。

### 3.3. AIとのスキーマ同期手順
開発環境とAIの持つデータベース知識に齟齬が生じた場合、AIは以下の手順で最新のスキーマ情報を自身に再学習させること。

1.  **`supabase/schema.sql` を読み込む**
2.  **内容を解析・学習する**

---

## 4. 開発履歴 (サマリー)

### [日付自動挿入] 管理者権限機能の基盤を実装 (RBAC)
- **課題**: マスターデータを安全に管理・編集するための専用の仕組みが必要だった。
- **解決**: ロールベースアクセス制御（RBAC）を導入し、管理者ユーザーのみが特定操作を行える基盤を構築した。
    - **`user_roles` テーブルの新設**: ユーザーIDとロール（例: 'admin'）を紐付けて管理するテーブルを作成。
    - **RLS (Row Level Security) ポリシーの設定**:
        - `items` テーブルに対し、CUD（作成・更新・削除）操作を `admin` ロールを持つユーザーに限定。
        - `user_roles` テーブル自体も保護し、`admin` のみがあらゆるロール情報を編集でき、一般ユーザーは自身のロール閲覧しかできないように制限。
    - **ドキュメント整備**: `README.md` および `DEVELOPMENT_LOG.md` に管理者セットアップの手順を明記。

### [2026-01-09] 装束カテゴリ別進捗管理機能の完全実装
- **課題**: AF/Relic/Empyrean等の装束データが、ジョブと部位しかキーがなかったため上書きされてしまう設計上の問題を特定。
- **解決**: データベース、ロジック、UIを全面的に改修し、各装束シリーズを独立して管理できる機能を実装した。
    - **データベース拡張**: `character_gears`テーブルに`category`カラムを追加し、`(character_id, job_code, category, slot)`の複合ユニーク制約を定義。データ競合(409エラー)を根本的に解消。
    - **ロジック・UI修正**: カテゴリ切替タブを新設し、`useGearTracker`フックがカテゴリを意識してデータを取得・保存するように修正。UIの確実な再描画のため`key`プロパティを活用。
    - **その他**: `JobSelector`の日本語対応やレイアウト調整、関連するバグ修正を実施。

### [2026-01-08] UI/UXの抜本的改善とコードリファクタリング
- **FF11らしいUI/UXの追求**
- **コード品質の向上**
- **情報アーキテクチャの整備**

---

## 5. 次回のタスク
- **マスターデータ管理画面の実装**
  - アイテムの一覧表示（ページネーション、検索、フィルタリング）
  - アイテムの編集・新規作成・削除機能 (CRUD)
  - Next.js Server Actions を利用した安全なデータ更新

---

## 6. 実装希望(HOPE)
- [ ] **強化素材と在庫の可視化**
- [ ] **装備のアップグレード機能**
- [ ] **進捗サマリー画面**
- [ ] **外部データ連携**
- [ ] **UIの拡張**
