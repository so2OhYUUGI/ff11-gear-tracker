# DEVELOPMENT_LOG.md

## ⚠️ AIアシスタントへの重要指示（メンテナンスポリシー）
**このドキュメントは本プロジェクトの「設計図」兼「開発履歴」です。AIアシスタントは以下のルールを厳守すること：**

1. **情報の永続性**: 「2. ディレクトリ構成」および「3. データベース設計」のセクションはプロジェクトの根幹である。**ユーザーから明示的な指示がない限り、絶対に削除・省略・簡略化しないこと。**
2. **情報の同期**: コード確認や設計変更のたびに、当該セクションを最新の状態に更新すること。
3. **リスト形式の遵守**: ディレクトリ構成の表示に特殊文字（ツリー記号）や <pre> タグを使用せず、箇条書きリスト形式で表現すること。

---

## 1. プロジェクト概要
FF11のRME/AF装束強化進捗トラッカー。
- **Framework**: Next.js 15 (App Router / React 19)
- **Database/Auth**: Supabase
- **Design System**: `src/lib/styles.ts` (`UI_STYLE`)

---

## 2. ディレクトリ構成（2026-01-08 再構築）
- src/
  - app/ (Routing)
    - gear/ : /gear (装束トラッカー画面：ジョブ選択 -> 装備選択)
    - characters/ : /characters (キャラクター管理画面)
    - target/ : /target (目標・素材計算画面：予定)
    - page.tsx : 総合ダッシュボード（ホーム）
    - layout.tsx : アプリ共通レイアウト（Navigation, AppHeaderを内包）
  - components/ (UI Components)
    - layout/ : AppHeader.tsx, Navigation.tsx
    - gear/ : JobSelector.tsx, GearSlotList.tsx, GearEditModal.tsx
    - character/ : CharacterManager.tsx, CharacterCard.tsx
    - ui/ : ボタンやバッジ等の共通パーツ（予定）
  - lib/ (共通定義・ロジック)
    - styles.ts : UI_STYLE (デザインシステム)
    - constants/ : jobs.ts, slots.ts (定数管理)
  - utils/
    - supabase/ : server.ts, client.ts

---

## 3. データベース設計 (Schema)

### Enum: equipment_slot
- 定義: `main, sub, range, ammo, head, neck, ear1, ear2, body, hands, ring1, ring2, back, waist, legs, feet`

### Table: items (装備マスタ)
- id: text (PK) - アイテム識別子
- name: text (NOT NULL) - 英語名称
- name_ja: text - 日本語表示名
- slot: equipment_slot - 部位
- category: text - カテゴリ（AF, Relic, Empy, etc.）
- tier: integer - 強化段階 (0～3)
- jobs: text[] - 装備可能ジョブ

### Table: characters (キャラクター)
- id: uuid (PK)
- user_id: uuid (FK)
- name: text
- world: text

### Table: character_gears (装備状況)
- id: uuid (PK)
- character_id: uuid (FK)
- job_code: text
- slot: equipment_slot
- item_id: text (FK)
- 制約: `UNIQUE(character_id, job_code, slot)`

---

## 4. 開発履歴

### [2026-01-08] フォルダ構成の再構築とアプリレイアウトの導入
- **共通レイアウトの実装**: サイドバー（PC）とボトムナビ（スマホ）による「App Shell」を構築。
- **ディレクトリ構成の整理**: 機能ベース（Gear, Character, Layout）のフォルダ構成に再編。
- **ページ責務の明確化**: 
    - `/` (Home): 総合ダッシュボード
    - `/gear` : 装束トラッカー（ジョブ選択 ➔ 装束選択フローの起点）
    - `/characters` : キャラクター管理

### [2026-01-07] 装備軸UIの導入
- 主要5部位（頭胴手脚足）をリスト形式で表示する Dashboard 試作版の実装。

---

## 5. 次のフェーズ (TODO)
- [ ] **リンク切れの解消**: フォルダ移動に伴うインポートパスの修正。
- [ ] **JobSelector の独立**: Dashboard からジョブ選択機能を切り出し、`/gear` ページで管理。
- [ ] **装束選択フローの構築**: ジョブ選択 ➔ 部位選択 ➔ 装備選択モーダルの連動。
- [ ] **インラインスタイルの完全廃止**: 共通レイアウト部分の UI_STYLE 移行。