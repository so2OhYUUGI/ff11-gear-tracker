// src/app/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CharacterManager from "@/components/character/CharacterManager";
import { groupCharactersByAccount } from "@/lib/colors"; // 追加

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  // アカウントとキャラクターの両方を取得
  const [accountsRes, charsRes] = await Promise.all([
    supabase.from("game_accounts").select("*").order("created_at", { ascending: true }),
    supabase.from("characters").select(`id, name, world, last_job_code, game_accounts ( id, name, color_code )`).order("created_at", { ascending: true })
  ]);

  const accounts = accountsRes.data || [];
  const characters = charsRes.data || [];

  // アカウントリストを渡して、色を固定させる
  const groupedCharacters = groupCharactersByAccount(characters, accounts);

  return (
    <div className="page-container page-wrapper">
      <header className="mb-10">
        <h1 className="main-title">Vana'diel Portal</h1>
        <p className="page-description">操作するキャラクターを選択してください</p>
      </header>
      <CharacterManager groupedCharacters={groupedCharacters} />
    </div>
  );
}
