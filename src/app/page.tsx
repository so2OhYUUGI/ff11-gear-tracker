// src/app/page.tsx

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CharacterManager from "@/components/character/CharacterManager";
import { UI_STYLE } from "@/lib/styles";
import { getSystemColor } from "@/lib/colors";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  const { data: characters } = await supabase
    .from("characters")
    .select(`
      id, name, world, last_job_code,
      game_accounts ( id, name, color_code )
    `)
    .order("created_at", { ascending: true });

  // アカウントごとにグループ化
  const groupedCharacters = characters?.reduce((acc, char) => {
    const account = char.game_accounts;
    const accountId = account?.id || 'unlinked';

    if (!acc[accountId]) {
      acc[accountId] = {
        name: account?.name || '未紐付け',
        // DBに色があればそれを使用、なければシステムカラーを生成
        color: account?.color_code || getSystemColor(accountId),
        chars: []
      };
    }
    acc[accountId].chars.push(char);
    return acc;
  }, {} as Record<string, { name: string, color: string, chars: any[] }>);

  return (
    <div className={UI_STYLE.container}>
      <header className="mb-10">
        <h1 className={UI_STYLE.mainTitle}>Vana'diel Portal</h1>
        <p className={UI_STYLE.label}>操作するキャラクターを選択してください</p>
      </header>

      <CharacterManager groupedCharacters={groupedCharacters || {}} />
    </div>
  );
}