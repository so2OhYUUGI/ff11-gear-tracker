# DEVELOPMENT_LOG.md

## ⚠️ AIアシスタントへの重要指示（メンテナンスポリシー）
**このドキュメントは本プロジェクトの「設計図」兼「開発履歴」です。AIアシスタントは以下のルールを厳守すること：**

1. **情報の永続性**: 「2. ディレクトリ構成」および「3. データベース設計」のセクションは、プロジェクトの根幹である。**ユーザーから明示的な指示がない限り、絶対に削除・省略・簡略化しないこと。**
2. **情報の同期**: 新しいコードの確認や設計変更のたびに、当該セクションを最新の状態に更新すること。
3. **リスト形式の遵守**: ディレクトリ構成の表示に特殊文字（ツリー記号）や <pre> タグを使用せず、箇条書きリスト形式で表現すること。
4. **継続性の確保**: セッション再開時、AIは本ドキュメントを最優先で読み込み、設計思想を理解した上で作業すること。

---

## 1. プロジェクト概要
FF11のRME/AF装束強化進捗トラッカー。
- **Framework**: Next.js 15 (App Router / React 19)
- **Database/Auth**: Supabase
- **Design System**: `src/lib/styles.ts` (`UI_STYLE`) による一括管理

---

## 2. ディレクトリ構成 (2026-01-08 最新)
- src/
  - app/ (Routing)
    - gear/ : /gear (装束トラッカー画面)
    - characters/ : /characters (キャラクター管理画面)
    - page.tsx : 総合ダッシュボード（ポータル）
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
(※変更なしのため省略。ログ上は常に全項目を保持すること)

---

## 4. 開発履歴

### [2026-01-08] ポータル画面の再構築と不整合の解消
- **トップページ (page.tsx) のポータル化**: ログイン直後の画面を「Vana'diel Portal」として再定義。全体サマリーとキャラ選択を統合。
- **不整合の解消**: フォルダ移動により発生していた `CharacterManager` から `Dashboard` へのリンク切れエラーを修正。
- **ルーティングの整理**: `CharacterManager` から直接コンポーネントを切り替える方式から、URLパラメータ (`/gear?charId=xxx`) を用いたページ遷移方式へ変更。

### [2026-01-08] 大規模リファクタリング（前段）
- 共通レイアウト（App Shell）の導入とコンポーネントの機能別分割。

### [2026-01-08] 構造のクリーンアップとポータル表示の正常化
- **不要コンポーネントの削除**: 旧設計の遺物であった `src/components/dashboard/` フォルダを完全に削除。
- **インポートの正常化**: `CharacterManager` のリンク切れを修正し、`/gear?charId=xxx` へのルーティングを確立。
- **トップページのポータル化**: ログイン後の「玄関口」として、全キャラ一覧とサマリーを表示する構成に変更。

---

## 5. 次のフェーズ (TODO)
- [x] **表示確認**: トップページと /gear ページのエラー解消と遷移確認。
- [x] **クリーンアップ**: 旧 Dashboard 関連ファイルの削除。
- [ ] **装備選択モーダル (GearEditModal)**: スロットクリック時に部位・ジョブ適合アイテムを抽出・保存する機能の実装。
- [ ] **インラインスタイルの完全廃止**: AppHeader 等に残るベタ書きクラスの排除。