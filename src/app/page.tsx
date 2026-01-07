import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CharacterManager from "@/components/CharacterManager";
import AppHeader from "@/components/AppHeader";

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const [{ data: characters }] = await Promise.all([
    supabase.from("characters").select("*").order("created_at", { ascending: true }),
  ]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* 共通ヘッダー */}
      <AppHeader email={user.email} />

      {/* 司令塔コンポーネント */}
      <CharacterManager initialCharacters={characters || []} />
    </main>
  );
}