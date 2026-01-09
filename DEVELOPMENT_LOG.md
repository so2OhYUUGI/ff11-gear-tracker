# DEVELOPMENT_LOG.md
これは開発メモであると同時にAIと継続的な作業を行うための指令書である。

## ⚠️ AIアシスタントへの重要指示（メンテナンスポリシー）
**本ドキュメントはプロジェクトの「設計図」兼「正解（Source of Truth）」である。**
1. **情報の永続性**: 「2. ディレクトリ構成」「3. データベース設計」は、AIによる要約や省略を厳禁とする。
2. **情報の同期**: Gitへプッシュした、もしくはすることを確認したら、AIは本ドキュメントを最新の状態に更新し、ユーザーと同期すること。
3. **視認性の確保**: ディレクトリ構成に特殊文字（ツリー記号）を使用せず、箇条書きリスト形式を維持すること。
4. **コード修正時の確認**: 新規のコンポーネントは即座に生成すること。既存のコードを書き換えるときは、修正が必要なコンポーネントを提示し、そのコードのGitHub URLを求めること。

---

## 1. プロジェクト概要
FF11 装束強化進捗トラッカー。
- **Framework**: Next.js 15 (App Router)
- **Database/Auth**: Supabase
- **Design System**: `src/lib/styles.ts` 一括管理

---

## 2. ディレクトリ構成 (2026-01-08 最終形態)
- src/
  - app/ (Routing)
    - gear/ : 装束トラッカー画面
    - characters/ : キャラクター管理
    - accounts/ : ゲームアカウント管理
    - auth/ : アプリアカウント関連
    - settings/ : アプリ設定など
    - page.tsx : 総合ポータル
    - layout.tsx : アプリ共通レイアウト（AppShell）
  - components/ (UI Components)
    - layout/ : AppHeader, Navigation
    - gear/ : GearTrackerContainer, JobSelector, GearSlotList, GearEditModal
    - gear/hooks/ : useGearTracker (ロジック抽出)
    - character/ : CharacterManager
    - account/ : AccountList
  - lib/ (Shared Core)
    - supabase/ : server/client SDK設定
    - styles.ts : デザインシステム (UI_STYLE)
    - types.ts : アプリ共通型定義
    - utils.ts : ビジネスロジック
    - constants/ : jobs.ts, slots.ts, gear.ts (ティア定義)
    - colors.ts : アカウントカラー生成ロジック

---

## 3. データベース設計 (Schema)
| table_name          | columns                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| character_gears     | id, character_id, job_code, slot, item_id, status, updated_at, category                                       |
| characters          | id, user_id, name, world, account_label, race, gender, created_at, updated_at, game_account_id, last_job_code |
| game_accounts       | id, user_id, name, created_at, color_code                                                                     |
| gear_progression    | id, character_id, group_name, job_code, slot, current_item_id, updated_at                                     |
| inventories         | id, character_id, item_id, quantity, location, updated_at                                                     |
| items               | id, name, category, created_at, name_ja, slot, tier, jobs, base_stats                                         |
| profiles            | id, username, avatar_url                                                                                      |
| recipe_groups       | id, name, category, description                                                                               |
| recipe_requirements | id, group_id, item_id, quantity, step_name                                                                    |
| recipes             | id, result_item_id, recipe_type, base_item_id, material_item_id, quantity, acquisition_note                   |
| user_targets        | id, user_id, character_id, group_id, status, created_at, priority, user_note                                  |
---

## 4. 開発履歴

### [2026-01-08] UXの深化とFF11スタイルの追求
- **ジョブ選択UIの刷新**: 
    - 従来のドロップダウンを廃止し、FF11実機に倣った **11行2列のジョブグリッド・ポップアップ** を実装。
    - 22ジョブすべてを一望でき、没入感と操作性を両立。
- **アカウントカラーの完全同期**: 
    - ポータルで設定されたアカウント固有色を、装備画面のキャラクター情報カードの背景色へリアルタイム反映。
    - アカウントのアイデンティティをページを跨いで維持するUXを実現。
- **ナビゲーションとレイアウトの改善**: 
    - スティッキーヘッダー内に「ポータルへ戻る」ボタンを統合。
    - `AppHeader` ➔ `SessionHeader` ➔ `GearTabs` の **3層マルチレイヤーSticky** を完成させ、スクロール時の利便性を最大化。
- **コード品質の向上 (Custom Hook化)**:
    - `GearTrackerContainer` からビジネスロジックを `useGearTracker` フックとして分離。コンポーネントの行数を削減し、保守性を高めた。

## [2026-01-08] キャラクター作成フローのリファクタリング
### 実装内容
- **CharacterWizard の分解**: 肥大化していたウィザードコンポーネントを `AccountStep`, `IdentityStep` に分離し、メンテナンス性を向上。
- **責務の分離**: 各ステップが「表示」を、ウィザード本体が「進行管理と保存」を担当する構造を確立。

### [2026-01-08] UXの階層化：ポータルの純化と設定画面の導入
- **ポータル画面の改善**:
    - `app/page.tsx` から管理系リンクを排除。キャラクター選択という主目的に特化。
- **設定ハブ (/settings) の新設**:
    - 滅多に使用しない管理機能（アカウント管理等）を隔離・集約するための専用パスを作成。
- **グローバルナビゲーションの強化**:
    - `AppHeader` に設定アイコンを追加し、どの画面からでも設定ハブへアクセス可能に。

### [2026-01-08] アカウント管理画面のビジュアル強化
- **カラー同期の徹底**:
    - `/accounts` 画面において、各アカウントのカードにポータルと共通のシステムカラー（またはユーザー設定色）を左ボーダーおよびアイコンとして反映。
    - データの出現順（作成日時順）に応じたインデックス番号を表示し、色割り当ての透明性を確保。
- **UIコンポーネントのブラッシュアップ**:
    - `AccountList` をより詳細なメタ情報（IDの一部、作成日）を表示する形式に拡張。

## [2026-01-08] - 装束切り替え不具合の調査とデータ構造の再定義

### 現在の状況
- 各装束（AF/レリック/エンピ）を切り替えても、装備リストの表示が正しく更新されない、またはデータが混ざる不具合が発生。
- 型エラーの修正（`GearSlotList` への `category` プロパティ追加）は完了。

### 発見された課題（設計上の問題）
- **データ保持の不備**: 現状のデータ構造が「ジョブ × 部位」のみをキーとしており、装束カテゴリ（AF1/2/3等）が考慮されていない。
- **上書き問題**: 同一部位にAFを登録した後にレリックを登録すると、データが上書きされてしまう。本来はAFの強化状態とレリックの強化状態を「別々に」保持・確認できる必要がある。
## [2026-01-09] - 装束カテゴリ切り替え機能の完全実装とスキーマ拡張

### 本日の進捗
- **装束切り替え（AF/Relic/Empyrean）の不具合解消**: 
  - カテゴリを切り替えても表示が変わらない、またはデータが混ざる問題を解決。
  - `GearSlotList` に `key={`${currentJob}-${activeCategory}`}` を付与し、状態の完全リセットを保証。
- **データベース構造の拡張 (Supabase)**:
  - `character_gears` テーブルに `category` カラムを追加。
  - `unique_gear_entry` 制約（character_id, job_code, category, slot）を追加し、各装束シリーズの独立した進捗保存を可能にした。
- **データ取得ロジックの修正**:
  - `useGearTracker.ts` において、`category` を含めたクエリ発行と、カテゴリ変更時の自動再取得（Effectの依存配列への追加）を実装。

### 変更されたファイルと役割
- **`src/lib/types.ts`**: `CharacterGear` 型に `category` を追加。`items` プロパティを `GearItem` 型で共通化。
- **`src/components/gear/GearTrackerContainer.tsx`**: Stickyヘッダー等のデザインを維持しつつ、カテゴリ状態の配信と `key` による再描画制御を実装。
- **`src/components/gear/hooks/useGearTracker.ts`**: Supabase（createClient）を用いたカテゴリ別のデータ取得・状態管理ロジック。
- **`src/components/gear/GearEditModal.tsx`**: 保存時に `category` を含めるように修正。

### 決定された設計方針
- **拡張性**: 今後「アンバス装備」や「装備比較セット（category: 'equipped'）」などが追加されても、同一テーブル・同一ロジックで対応可能な構造とした。
- **ドキュメント化**: 各ファイルの冒頭に「@file」および「@role」を記述する習慣を開始。
## [2026-01-09] - 装束カテゴリ管理機能の完全実装とDB同期の修正

### 本日の成果
- **装束シリーズ別の独立管理を実現**: 
  - AF、レリック、エンピリアンの各装束を、ジョブごとに独立して進捗（強化段階）をトラッキングできるようになった。
- **データ不整合と400/409エラーの完全解消**:
  - データベースのユニーク制約を `(character_id, job_code, category, slot)` に更新し、競合（409）を解消。
  - Supabaseの結合クエリにおけるテーブル名指定を `master_items` から実態の `items` に修正し、リクエストエラー（400）を解消。
- **UI/UXの向上**:
  - カテゴリ切り替え時に `GearSlotList` を `key` プロパティでリマウントさせ、表示の確実な更新を保証。
  - アカウントカラーの取得ロジックを既存の `getColorByIndex` 形式で復元。

### 技術的な変更点
- **データベース (Supabase)**:
  - `character_gears` テーブルに `category` カラムを追加。
  - `character_gears_upsert_key` (UNIQUE) を再定義。
- **型定義 (`src/lib/types.ts`)**:
  - `CharacterGear` および `GearItem` の型をデータベースの実態（IDがtext型であること等）に合わせて再定義。
- **各ファイルへの役割記載**:
  - プロジェクトのルールに基づき、各ファイルの冒頭に `@file` および `@role` コメントを完備。

- [2026-01-09] 改善: `JobSelector` の利便性向上。
  - ジョブ選択リスト内の表記を日本語（戦士、風水士等）にアップデート。
  - ヘッダー表示はデザイン性を重視し、アルファベット3文字表記を維持。

  ## [2026-01-09] - 装束カテゴリ完全対応とJobSelectorの高度なUI調整

### 本日の進捗
- **装束カテゴリ切り替え機能の実装**:
  - AF / Relic / Empyrean を切り替えて、それぞれの強化進捗を独立して管理できる機能を実装。
  - `GearSlotList` に `key` プロパティ（`${currentJob}-${activeCategory}`）を付与し、切り替え時の確実なUIリフレッシュを保証。
- **データベース構造の最適化 (Supabase)**:
  - `character_gears` テーブルに `category` カラムを追加し、装束シリーズの識別を可能にした。
  - 複合ユニーク制約 `unique_gear_entry` を `(character_id, job_code, category, slot)` で再定義し、データの重複保存を防止。
  - `items` テーブル（マスターデータ）のテーブル名不一致による400エラーを解消。
- **JobSelector の日本語化とレイアウト修正**:
  - `constants/index.ts` に `JOB_DETAILS` を導入し、選択リスト内のジョブ名を日本語表記（戦士、モンク等）にアップデート。
  - ヘッダーのトリガー表示はデザイン性を重視し、英語略称（WAR, GEO等）を維持。

### 技術的課題と解決策
- **409 Conflict / 400 Bad Request**:
  - DB側の古いユニーク制約の削除と、プログラム側の `upsert` 時の `onConflict` 指定を一致させることで解決。
- **JobSelector の配置・重なり問題**:
  - **重なり**: `stickyWrapper` (z-50) と `app.wrapper` (z-40) の重なり順を入れ替え、ポップアップがアプリヘッダーに隠れないよう修正。
  - **幅の制限**: 親要素の `flex` コンテキストによる圧縮を回避するため、あえて `JobSelector` ルートの `relative` を削除。
  - **絶対配置**: `relative` 排除に伴い、`styles.ts` 側で `right-0` および `top` のオフセット値を調整し、画面右端かつボタン直下にピタッと吸着する配置を実現。

### 変更ファイル
- `src/lib/types.ts`: `CharacterGear` 型の拡張と `GearItem` との統合。
- `src/lib/constants/index.ts`: `JOB_DETAILS` 定数の追加。
- `src/lib/styles.ts`: z-index 階層の整理と `jobSelector.menu` の配置ハック。
- `src/components/gear/JobSelector.tsx`: 日本語名称対応と `relative` 排除による配置最適化。
- `src/components/gear/hooks/useGearTracker.ts`: `category` を含めたフェッチロジックの実装。

### 5. 次回のタスク
- [ ] 装備品の強化段階（Tier）に応じたステータス表示の検討。
- [ ] 大量のマスターデータ（全ジョブの装束名）の正確性の検証。
- [ ] 画面スクロール時の各Sticky要素の挙動の微調整。

#### 1. データベース(Supabase)のスキーマ拡張
- **`character_gears` テーブルへのカラム追加**:
  - 現在 `job_code` と `slot` しかキーがないため、装束シリーズを識別する `category` (text型) カラムを追加する。
  - SQL実行例: `ALTER TABLE character_gears ADD COLUMN category TEXT;`
- **既存データの移行**:
  - 必要に応じて、既存レコードにカテゴリを割り当てるか、テストデータをリセットする。
### 次回のタスク
- [ ] 未登録部位をクリックした際の初期選択リストの精度向上。
- [ ] 装備品の強化段階（Status/Tier）の更新処理の安定化。

#### 2. 型定義とロジックの修正
- **TypeScript型定義の更新**:
  - `CharacterGear` インターフェースに `category` を追加。
- **`useGearTracker.ts` の抜本的修正**:
  - `fetchGears` (取得): `WHERE job_code = ... AND category = ...` のように、現在のカテゴリで絞り込んで取得するようにクエリを修正。
  - `updateGear` (保存): 装備登録・更新時に、現在の `category` を一緒に保存するように修正。
- **フィルタリング処理**:
  - UIに渡す `gears` オブジェクトを生成する際、確実に選択中のカテゴリのみが含まれるようにする。

#### 3. コンポーネントのブラッシュアップ
- **再レンダリングの最適化**:
  - `GearTrackerContainer` から `GearSlotList` を呼び出す際、`key={category}` を付与し、切り替え時に古いステートが残らないことを保証する。
- **ファイルヘッダーの追記**:
  - 決定したルールに基づき、各ファイルの冒頭に役割を示すコメントを追記する。

#### 4. 動作確認項目
- [ ] AFを選択して部位を登録した際、レリックやエンピの同じ部位が「未登録」のままであること。
- [ ] カテゴリを切り替えた際、それぞれの装束の強化状態（+1, +2等）が正しく保持・表示されること。

---

## 6. 実装希望(HOPE)
- [ ] **一部の定数と型宣言が散らばっている件の考察**:
    - types/gear.ts, constants/jobs.ts, constants/gear.ts, constants/slots.ts で似た記述が別々に行われている。これは必要な意図したものか？
- [ ] **強化素材の可視化**: 
    - 各部位の装備状況に基づき、次の段階（ティア）へ進むために必要な素材リストを表示する機能。
    - 所持在庫と必要数の差分を計算し、不足分を視覚的に強調する。
- [ ] **素材マスタデータの設計**: レシピ（必要素材）情報を管理する新テーブルの検討。
- [ ] **ジョブ装束選択の挙動変更**:
    - 未登録の場合は従来通り全ての該当装備から選択可能
    - すでに登録している場合は、強化素材部分に追加予定の”強化する”から該当の装備に差し替える（使用された素材は在庫から消費ただし在庫の下限は０とする）
- [ ] **全てのジョブ、全ての装束を一覧表示して進捗を確認できる画面を追加**:
    - 表形式で、ジョブ＞装束＞部位の順に表示。NQ>+1>+2>109>119などを横棒グラフかブロック塗りつぶしのような形式で可視化
- [ ] **装束の情報にモグの預かり帖の情報を追加**:
- [ ] **ジョブ装束の入手手段にモグチケットを追加**:
    - ディード達成でもらえるモグチケットによる入手を追加して素材消費削減の助けとする
- [ ] **キャラ選択画面のキャラ情報を再検討**:
    - 種族も表示する？
    - 最も不足しているアイテムもしくはポイントを表示する？