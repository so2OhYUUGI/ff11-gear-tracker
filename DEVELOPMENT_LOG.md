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

### 3.2. AIとのスキーマ同期手順
開発環境とAIの持つデータベース知識に齟齬が生じた場合、AIは以下の手順で最新のスキーマ情報を自身に再学習させること。

1.  **`supabase/schema.sql` を読み込む**:
    プロジェクトルートにある`supabase/schema.sql`ファイルの内容を全て読み込む。

2.  **内容を解析・学習する**:
    ファイルに記述されている`CREATE TABLE`文、`ALTER TABLE`文、`CREATE TYPE`文などを解析し、現在のデータベースの完全な構造を記憶する。

**（旧手順：CSVファイルは今後使用しません）**

---

## 4. 開発履歴 (サマリー)

### [2026-01-09] 装束カテゴリ別進捗管理機能の完全実装
- **課題**: AF/Relic/Empyrean等の装束データが、ジョブと部位しかキーがなかったため上書きされてしまう設計上の問題を特定。
- **解決**: データベース、ロジック、UIを全面的に改修し、各装束シリーズを独立して管理できる機能を実装した。
    - **データベース拡張**: `character_gears`テーブルに`category`カラムを追加し、`(character_id, job_code, category, slot)`の複合ユニーク制約を定義。データ競合(409エラー)を根本的に解消。
    - **ロジック・UI修正**: カテゴリ切替タブを新設し、`useGearTracker`フックがカテゴリを意識してデータを取得・保存するように修正。UIの確実な再描画のため`key`プロパティを活用。
    - **その他**: `JobSelector`の日本語対応やレイアウト調整、関連するバグ修正を実施。

### [2026-01-08] UI/UXの抜本的改善とコードリファクタリング
- **FF11らしいUI/UXの追求**:
    - FF11実機を模倣したグリッド式`JobSelector`、アカウントカラーのページ間同期、3層マルチレイヤーStickyヘッダー等を実装し、没入感を向上。
- **コード品質の向上**:
    - `useGearTracker`カスタムフックを導入し、ロジックをコンポーネントから分離。
    - 巨大化した`CharacterWizard`をステップごとにコンポーネント分割し、保守性を高めた。
- **情報アーキテクチャの整備**:
    - ポータル画面から管理系機能を`settings`ページへ分離し、各画面の責務を明確化。

---

## 5. 次回のタスク

### データとロジック
- [ ] 装備品の強化段階（Tier）に応じたステータス表示の検討。
- [ ] 大量のマスターデータ（全ジョブの装束名）の正確性の検証。

### UI/UX
- [ ] 未登録部位をクリックした際の初期選択リストの精度向上。
- [ ] 画面スクロール時の各Sticky要素の挙動の微調整。

---

## 6. 実装希望(HOPE)
- [ ] **強化素材と在庫の可視化**: 
    - 装備の次の強化段階に必要な素材リストを表示する。
    - `inventories`テーブルの在庫数と連携し、不足分をハイライトする。
- [ ] **装備のアップグレード機能**: 
    - 未登録時は従来通り装備を選択、登録済みの場合は「強化」ボタンを表示する。
    - 「強化」実行時に、レシピに基づいて素材を`inventories`から消費し、`character_gears`のアイテムを更新する。
- [ ] **進捗サマリー画面**: 
    - 全ジョブ・全装束の進捗を一覧できるダッシュボード画面を追加する。
    - 強化段階を棒グラフなどで視覚的に表現する。
- [ ] **外部データ連携**: 
    - モグの預かり帖（`mog_case`等）の情報を管理・表示する機能。
    - ディードで得られるモグチケット等の代替アイテムをレシピ計算に組み込む。
- [ ] **UIの拡張**: 
    - キャラクター選択画面に種族などの追加情報を表示する。
    - （将来的には）キャラクターの目標達成に最も不足しているアイテムなどを表示する。
