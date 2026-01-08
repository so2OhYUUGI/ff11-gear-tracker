import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CharacterManager from "@/components/character/CharacterManager";
import { UI_STYLE } from "@/lib/styles";

export default async function Home() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  const { data: characters } = await supabase
    .from("characters")
    .select("id, name, world")
    .order("created_at", { ascending: true });

  return (
    <div className={UI_STYLE.container}>
      {/* ウェルカムメッセージ */}
      <section className="mb-10">
        <h1 className={UI_STYLE.mainTitle}>Vana'diel Portal</h1>
        <p className="text-slate-500 text-sm">FF11 Gear Tracker へようこそ。作成中の装束やキャラクターを管理しましょう。</p>
      </section>

      {/* サマリーパネル（将来的にここに全体進捗などを出す） */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className={UI_STYLE.card + " bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30"}>
          <h3 className={UI_STYLE.cardTitle}>Global Progress</h3>
          <p className="text-3xl font-black text-blue-600 mt-2">-- %</p>
          <p className={UI_STYLE.text.tiny + " mt-1"}>Coming Soon: アカウント全体の達成率</p>
        </div>
        <div className={UI_STYLE.card}>
          <h3 className={UI_STYLE.cardTitle}>Quick Stats</h3>
          <p className="text-slate-500 text-sm mt-2">登録キャラ数: {characters?.length || 0}</p>
          <p className="text-slate-500 text-sm">直近の更新: ---</p>
        </div>
      </div>

      {/* キャラクター選択セクション */}
      <CharacterManager initialCharacters={characters || []} />
    </div>
  );
}