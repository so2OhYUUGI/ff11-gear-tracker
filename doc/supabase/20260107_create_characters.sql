-- 1. キャラクターテーブル
CREATE TABLE characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL, -- ログインユーザー紐付け
  name TEXT NOT NULL,
  world TEXT NOT NULL,
  account_label TEXT,
  race TEXT,
  gender TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. アイテムマスターテーブル（素材・ポイント等）
CREATE TABLE items (
  id TEXT PRIMARY KEY, -- 'alexandrite' などの文字列ID
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'RMEA' 'Point' 等
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 在庫テーブル
CREATE TABLE inventories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE NOT NULL,
  item_id TEXT NOT NULL, -- items.id は外部キーにせず柔軟性を確保
  quantity INTEGER DEFAULT 0 NOT NULL,
  location TEXT DEFAULT 'inventory' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- 同じキャラ・同じアイテム・同じ場所で重複させないための制約
  UNIQUE(character_id, item_id, location)
);

-- キャラクターテーブルのRLS
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Manage own characters" ON characters
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 在庫テーブルのRLS
-- 「親となるキャラクターの所有者が自分であること」を条件にする
ALTER TABLE inventories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Manage own inventories" ON inventories
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = inventories.character_id 
      AND characters.user_id = auth.uid()
    )
  );