# DEVELOPMENT_LOG.md

## ⚠️ AIアシスタントへの重要指示（メンテナンスポリシー）
**このドキュメントは本プロジェクトの「設計図」兼「開発履歴」です。AIアシスタントは以下のルールを厳守すること：**

1. **情報の永続性**: 「2. ディレクトリ構成」および「3. データベース設計」のセクションは、プロジェクトの根幹である。**ユーザーから明示的な指示がない限り、絶対に削除・省略・簡略化しないこと。**
2. **情報の同期**: 新しいコードの確認や設計変更のたびに、当該セクションを最新の状態に更新すること。
3. **リスト形式の遵守**: ディレクトリ構成の表示にエスケープ文字（ツリー記号）や <pre> タグを使用せず、箇条書きリスト形式で表現すること。
4. **継続性の確保**: セッション再開時、AIは本ドキュメントを最優先で読み込み、設計思想を理解した上で作業すること。

---

## 1. プロジェクト概要
FF11のRME/AF装束強化進捗トラッカー。
- **Framework**: Next.js 15 (App Router / React 19)
- **Database/Auth**: Supabase
- **Design System**: `src/lib/styles.ts` (`UI_STYLE`) による一括管理

---

## 2. ディレクトリ構成
- src/
  - app/ (Server Components / Next.js 15)
    - page.tsx : 認証チェック・初期データフェッチ担当
    - (auth)/ : 認証・ログインフロー関連
  - components/ (Client Components)
    - AppHeader.tsx : 共通ヘッダー（ログアウト・ユーザー情報）
    - CharacterManager.tsx : 画面遷移司令塔（キャラ一覧 ↔ Dashboard）
    - Dashboard.tsx : 装備管理メイン画面（部位スロット軸）
  - lib/ (共通ユーティリティ・定義)
    - styles.ts : デザイン定義 (UI_STYLE) - インラインスタイル禁止
    - constants.ts : ジョブ・スロット・アイテム定義（予定）
  - utils/
    - supabase/ : Supabase SDK設定（Server/Client）

---

## 3. データベース設計 (Schema)

### Enum: equipment_slot
- 定義: `main, sub, range, ammo, head, neck, ear1, ear2, body, hands, ring1, ring2, back, waist, legs, feet`

### Table: items (装備マスタ)
- id: text (PK) - アイテム識別子
- name: text (NOT NULL) - 内部用/英語名称
- name_ja: text - 日本語表示名
- slot: equipment_slot - 部位固定
- category: text - カテゴリ（AF, Relic, Empy, etc.）
- tier: integer - 強化段階 (0:NQ, 1:+1, 2:+2, 3:+3)
- jobs: text[] - 装備可能ジョブの配列

### Table: characters (キャラクター)
- id: uuid (PK)
- user_id: uuid (FK)
- name: text
- world: text

### Table: character_gears (装備状況)
- id: uuid (PK)
- character_id: uuid (FK -> characters.id)
- job_code: text (WAR, MNK, etc.)
- slot: equipment_slot
- item_id: text (FK -> items.id)
- 制約: `UNIQUE(character_id, job_code, slot)` - 1キャラ1ジョブ1部位に1装備を保証

---

## 4. 開発履歴

### [2026-01-07] アーキテクチャの刷新と装備軸UIの導入
- **Server/Clientの完全分離**: page.tsx でのデータフェッチと CharacterManager でのステート管理を明確化。
- **UI/UXリニューアル**: 部位スロット軸（頭胴手脚足）のUIへ移行。AppHeader による操作系の集約。
- **デザインシステムの強化**: UI_STYLE の定義拡張（buttonSecondary, input, header等）と、白飛び（コントラスト不足）問題の修正。

### [2025以前] 初期基盤
- SupabaseによるAuth・DB基盤構築、複数ゲームアカウント対応。

---

## 5. 次のフェーズ (TODO)
- [ ] **装備変更モーダル**: スロットクリック時に部位・ジョブ適合アイテムを抽出・保存する機能。
- [ ] **定数ファイルの独立**: Dashboard.tsx 内の JOBS 配列等を lib/constants.ts へ移動。
- [ ] **インラインスタイルの完全廃止**: Dashboard.tsx 等に残るベタ書きクラスを UI_STYLE へ完全移行。
- [ ] **データインポート**: RME/AF系アイテムマスタのバッチ登録。