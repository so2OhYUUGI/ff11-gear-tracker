# DEVELOPMENT_LOG.md

## ⚠️ AIアシスタントへの重要指示（メンテナンスポリシー）
**このドキュメントは本プロジェクトの「設計図」兼「開発履歴」です。AIアシスタントは以下のルールを厳守すること：**

1. **情報の永続性**: 「2. ディレクトリ構成」および「3. データベース設計」のセクションはプロジェクトの根幹である。**ユーザーから明示的な指示がない限り、絶対に削除・省略・簡略化しないこと。**
2. **情報の同期**: コード確認や設計変更のたびに、当該セクションを最新の状態に更新すること。
3. **リスト形式の遵守**: ディレクトリ構成の表示に特殊文字（ツリー記号）や <pre> タグを使用せず、箇条書きリスト形式で表現すること。
4. **継続性の確保**: セッション再開時、AIは本ドキュメントを最優先で読み込み、設計思想を理解した上で作業すること。

---

## 1. プロジェクト概要
FF11のRME/AF装束強化進捗トラッカー。
- **Framework**: Next.js 15 (App Router / React 19)
- **Database/Auth**: Supabase
- **Design System**: `src/lib/styles.ts` (`UI_STYLE`)

---

## 2. ディレクトリ構成 (2026-01-08 最新)
- src/
  - app/ (Routing)
    - gear/ : /gear (装束トラッカー画面)
    - characters/ : /characters (キャラクター管理画面)
    - page.tsx : 総合ダッシュボード（ホーム）
    - layout.tsx : 共通レイアウト（Navigation, AppHeaderを内包）
  - components/ (UI Components)
    - layout/ : AppHeader.tsx, Navigation.tsx
    - gear/ : GearTrackerContainer.tsx, JobSelector.tsx, GearSlotList.tsx
    - character/ : CharacterManager.tsx
  - lib/ (共通定義・ロジック)
    - styles.ts : デザイン定義システム (UI_STYLE)
    - constants/ : jobs.ts, slots.ts (定数管理)
  - utils/
    - supabase/ : server.ts, client.ts

---

## 3. データベース設計 (Schema)

### Enum: equipment_slot
- `main, sub, range, ammo, head, neck, ear1, ear2, body, hands, ring1, ring2, back, waist, legs, feet`

### Table: items (装備マスタ)
- id: text (PK), name: text, name_ja: text, slot: equipment_slot, category: text, tier: integer, jobs: text[]

### Table: characters (キャラクター)
- id: uuid (PK), user_id: uuid (FK), name: text, world: text

### Table: character_gears (装備状況)
- id: uuid (PK), character_id: uuid (FK), job_code: text, slot: equipment_slot, item_id: text (FK)
- 制約: `UNIQUE(character_id, job_code, slot)`

---

## 4. 開発履歴

### [2026-01-08] 大規模リファクタリングとモジュール化の完了
- **App Shell の導入**: サイドバー（PC）とボトムナビ（スマホ）による共通レイアウトを `layout.tsx` に実装。
- **機能ベースのフォルダ再編**: `components` 配下を `layout`, `gear`, `character` に整理。
- **コンポーネントの解体 (Dashboard.tsx の廃止)**:
    - 巨大だった `Dashboard.tsx` を `GearTrackerContainer`, `JobSelector`, `GearSlotList` に分割。
    - 状態管理と表示ロジックを分離し、メンテナンス性を向上。
- **定数管理の外部化**: `JOBS` や `MAJOR_SLOTS` の定義を `src/lib/constants/` に集約。

### [2026-01-07] 装備軸UIの導入とDB拡張
- 5部位スロット表示形式の考案、および RME/AF 管理用の DB スキーマ拡張。

---

## 5. 次のフェーズ (TODO)
- [ ] **装備選択モーダル (GearEditModal)**: スロットクリック時に部位・ジョブ適合アイテムを抽出・保存する機能の実装。
- [ ] **インラインスタイルの完全廃止**: `GearTrackerContainer` 等に残る細かなベタ書きクラスを `UI_STYLE` へ移行。
- [ ] **ホーム画面 (page.tsx) の構築**: 全キャラの進捗サマリー等を表示するダッシュボードの作成。
- [ ] **型定義の厳格化**: Supabase の結合クエリに対する型安全性の確保。