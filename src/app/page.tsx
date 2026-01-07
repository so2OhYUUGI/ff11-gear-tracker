import { createClient } from "@/utils/supabase/server";
import Dashboard  from "@/components/Dashboard";
import { redirect } from "next/navigation";

//export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. キャラクターと、その紐付き先のアカウント・在庫をすべて取得
  const { data: characters } = await supabase
    .from("characters")
    .select(`
      *,
      game_accounts ( name ),
      inventories (*)
    `)
    .order('created_at', { ascending: true });

  // 2. ユーザーが設定した目標を取得
  // user_targets -> recipe_groups -> recipe_requirements の順で結合して取得
  const { data: userTargets } = await supabase
    .from("user_targets")
    .select(`
      *,
      recipe_groups (
        name,
        recipe_requirements (
          item_id,
          quantity,
          step_name
        )
      )
    `)
    .eq('user_id', user.id);

  // 3. アイテムマスター
  const { data: items } = await supabase
    .from("items")
    .select("*")
    .order('name');

  return (
    <main className="min-h-screen bg-background">
      {/* 画面全体の横幅を制御するコンテナ */}
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
        {characters && characters.length > 0 ? (
          <Dashboard
            characterId={characters[0].id}
          />
        ) : (
          <div className="p-8 text-center">
            <p>キャラクターが登録されていません。</p>
            <a href="/setup" className="text-blue-500 underline">キャラクターを作成する</a>
          </div>
        )}
      </div>
    </main>
  );
}