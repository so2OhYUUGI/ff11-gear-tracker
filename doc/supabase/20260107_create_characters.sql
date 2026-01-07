-- 1. 一旦テーブルを削除する（中のデータも消えます）


-- 2. 正しい構成でテーブルを再作成する
create table characters (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null, -- 最初からNOT NULLで作成
  
  name text not null,
  world text not null,
  account_label text,
  race text,   -- NULLを許容するように一旦変更（後でNOT NULLにできます）
  gender text, -- NULLを許容するように一旦変更
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. APIキャッシュをリフレッシュするために、
-- Supabaseダッシュボードの Settings > API で「Save Config」を忘れずに押してください。