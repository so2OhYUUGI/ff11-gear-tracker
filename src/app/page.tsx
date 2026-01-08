// src/app/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CharacterManager from "@/components/character/CharacterManager";
import { UI_STYLE } from "@/lib/styles";
import { groupCharactersByAccount } from "@/lib/utils"; // 追加

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  const { data: characters } = await supabase
    .from("characters")
    .select(`id, name, world, last_job_code, game_accounts ( id, name, color_code )`)
    .order("created_at", { ascending: true });

  // ロジックを関数一つで完結
  const groupedCharacters = groupCharactersByAccount(characters || []);

  return (
    <div className={`${UI_STYLE.container} ${UI_STYLE.pageWrapper}`}>
      <header className="mb-10">
        <h1 className={UI_STYLE.mainTitle}>Vana'diel Portal</h1>
        <p className={UI_STYLE.label}>操作するキャラクターを選択してください</p>
      </header>
      <CharacterManager groupedCharacters={groupedCharacters} />
    </div>
  );
}