import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import GearTrackerContainer from "@/components/gear/GearTrackerContainer";

export default async function GearPage() {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) return redirect("/login");

	// 全キャラクターを取得（ジョブ選択の前に、まず誰の装備かを選ぶため）
	const { data: characters } = await supabase
		.from("characters")
		.select("id, name, world");

	return (
		<div className="p-4">
			<GearTrackerContainer initialCharacters={characters || []} />
		</div>
	);
}