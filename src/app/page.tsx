import { createClient } from "@/utils/supabase/server";
import { Dashboard } from "@/components/Dashboard";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  console.log("Checking for user:", user.id);

  const { data: characters, error: charError, count } = await supabase
    .from("characters")
    .select(`*, inventories (*)`, { count: 'exact' }) // countを取得するように変更
    .order('created_at', { ascending: true });
  if (charError) {
    console.error("Query Error Detail:", charError);
  }

  // ここで何が返ってきているかターミナルで確認
  console.log("Raw query result:", characters);
  console.log("Exact count from DB:", count);

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .order('name');

  return (
    <main className="container mx-auto py-8">
      {/* user オブジェクトを Dashboard に渡す */}
      <Dashboard
        characters={characters || []}
        items={items || []}
        user={user}
      />
    </main>
  );
}