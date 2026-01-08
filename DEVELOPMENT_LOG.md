# DEVELOPMENT_LOG.md

## ⚠️ AIアシスタントへの重要指示（メンテナンスポリシー）
**本ドキュメントはプロジェクトの「設計図」兼「正解（Source of Truth）」である。**
1. **情報の永続性**: 「2. ディレクトリ構成」「3. データベース設計」は、AIによる要約や省略を厳禁とする。
2. **情報の同期**: コード変更のたびに、AIは本ドキュメントを最新の状態に更新し、ユーザーと同期すること。
3. **視認性の確保**: ディレクトリ構成に特殊文字（ツリー記号）を使用せず、箇条書きリスト形式を維持すること。

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
    - page.tsx : 総合ポータル
    - layout.tsx : アプリ共通レイアウト（AppShell）
  - components/ (UI Components)
    - layout/ : AppHeader, Navigation
    - gear/ : GearTrackerContainer, JobSelector, GearSlotList, GearEditModal
    - gear/hooks/ : useGearTracker (ロジック抽出)
    - character/ : CharacterManager
  - lib/ (Shared Core)
    - styles.ts : デザインシステム (UI_STYLE)
    - types.ts : アプリ共通型定義
    - utils.ts : ビジネスロジック
    - constants/ : jobs.ts, slots.ts, gear.ts (ティア定義)
    - colors.ts : アカウントカラー生成ロジック
  - utils/
    - supabase/ : server/client SDK設定

---

## 3. データベース設計 (Schema)
### Enum: equipment_slot
- main, sub, range, ammo, head, neck, ear1, ear2, body, hands, ring1, ring2, back, waist, legs, feet

### Table: items, characters, character_gears, game_accounts
(※各テーブルのカラム定義は本日のSQL実行により最新化済み。color_code, last_job_code 等を実装)

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

---

## 5. 次のフェーズ (TODO)
- [ ] **強化素材の可視化**: 
    - 各部位の装備状況に基づき、次の段階（ティア）へ進むために必要な素材リストを表示する機能。
    - 所持在庫と必要数の差分を計算し、不足分を視覚的に強調する。
- [ ] **素材マスタデータの設計**: レシピ（必要素材）情報を管理する新テーブルの検討。
- [ ] **GearEditModal の初期値表示**: モーダルを開いた際、現在選択されているティアをハイライトする。