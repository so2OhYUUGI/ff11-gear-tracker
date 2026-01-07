# FF11 Gear Tracker - 開発ログ & 仕様書

## 1. プロジェクト概要
FF11（ファイナルファンタジーXI）のRMEA武器やAF/エンピ装束作成に必要な「素材」「ポイント」を、複数アカウント・複数キャラクターにまたがって一元管理するアプリ。
「あと何がいくつ足りないか」を可視化することを目的とする。

## 2. 技術スタック
- **Frontend**: Next.js 15 (App Router) / TypeScript
- **Styling**: Tailwind CSS / shadcn/ui
- **Backend/DB**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Auth**: Supabase Auth (Email/Password) + SSR (@supabase/ssr)
- **State Management**: React Hooks (`useState`) + TanStack Query + Server Actions

## 3. データベース設計 (Schema)
主なテーブル構成（RLS有効化済み）:
- `profiles`: ユーザー情報
- `game_accounts`: メイン垢、倉庫垢などのアカウント定義
- `characters`: キャラクター定義
- `items`: 素材・ポイントのマスターデータ（JSONBでステータス保持、categoryでポイント/装備を区別）
- `inventories`: 誰が何をいくつ持っているか (複合ユニーク制約: `character_id`, `item_id`, `location`)
- `recipes`: 合成・強化レシピ
- `user_targets`: ユーザーの作成目標

## 4. 現在の実装状況 (Status)

### 完了済み (Done)
- [x] **環境構築**: Next.js + Supabase 接続確立
- [x] **DB定義**: 全テーブル作成済み (RLS設定含む)
- [x] **マスターデータ**: `items` テーブルへ主要データのSeed投入済み（アレキ、ヘヴィメタル、ホールマーク等）
- [x] **認証機能**:
    - 新規登録 / ログイン / ログアウト
    - メール認証フロー（Callback処理実装済み）
- [x] **基本UI**:
    - アイテム一覧のカード表示
    - ログイン状態によるヘッダーの出し分け
- [x] **在庫管理機能 (MVP)**:
    - 「メインキャラを作成する」ボタンによる簡易キャラ作成
    - アイテムカード上での「＋」「－」ボタンによる在庫数のリアルタイム保存 (`inventories` テーブルへのUpsert)

### 未実装・課題 (Todo)
- [ ] **複数キャラ切り替え**: 現在は1人目のキャラの在庫しか操作・表示できない仕様。ドロップダウン等で操作対象を切り替える機能が必要。
- [ ] **目標設定 (Target)**: 「ウコンバサラを作りたい」と設定すると、必要数と所持数の差分を表示する機能。
- [ ] **大量のマスターデータ**: 現在10件程度。スクレイピング等での拡充が必要。
- [ ] **保管場所管理**: 現在は全て `location: 'inventory'` 固定。金庫や倉庫の概念追加。

### 将来の拡張予定 (Future Expansion)
- [ ] **魔法習得状況の管理 (Magic Tracker)**
    - 魔法スクロールの入手場所（NPC販売店、ドロップBF等）の表示。
    - 販売価格（ギル）の併記。
    - キャラクターごとの習得済みフラグの管理。
- [ ] **青魔法特化データ**
    - ラーニング対象となるモンスター名の紐付け。
    - モンスターの主な生息地域および出現条件。
    - 対応する拡張コンテンツ（プロマシア、アドゥリン等）の判別。

## 5. 開発履歴・トラブルシューティング (Logs)

### Next.js 15 対応
- **課題**: `cookies()` が非同期関数になったため、Supabaseクライアント作成時に `Type Error` が発生。
- **解決**: `src/utils/supabase/server.ts` および呼び出し元 (`page.tsx`, `layout.tsx`) をすべて `async/await` 対応に変更。

### 日本語リダイレクト問題
- **課題**: ログイン/登録失敗時の `redirect()` に日本語メッセージを含めると `Invalid character in header content` エラーが発生。
- **解決**: `encodeURIComponent()` でメッセージをエンコードして渡すよう修正。

### メール認証のリダイレクト
- **課題**: 認証メールのリンクを踏むと404エラー。
- **解決**: `src/app/auth/callback/route.ts` を作成し、Auth Codeをセッションと交換する処理を実装。

## 6. ディレクトリ構成 (主要なもののみ)

.
└─ src/
   ├─ app/
   │  ├─ auth/callback/route.ts # 認証コールバック
   │  ├─ login/page.tsx # ログイン画面
   ├─ page.tsx # トップ画面 (Server Component)
   ├─ layout.tsx
   ├─ components/
   │  ├─ Dashboard.tsx # 在庫管理UI (Client Component)
   └─ utils/supabase
            ├─ client.ts # Browser Client
            └─ server.ts # Server Client (Cookie操作あり)


