import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CharacterManager from "@/components/character/CharacterManager";
import AppHeader from "@/components/layout/AppHeader";

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
    <main className="w-full">
      {/* <AppHeader email={user.email} />  ← これを削除 */}
      <CharacterManager initialCharacters={characters || []} />
    </main>
  );
}