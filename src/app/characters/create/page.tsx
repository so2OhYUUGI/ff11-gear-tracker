import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CharacterWizard from "@/components/character/CharacterWizard";

export default async function CreateCharacterPage() {
	const supabase = await createClient();

	const { data: { user } } = await supabase.auth.getUser();
	if (!user) redirect("/login");

	// ゲームアカウントを取得してウィザードに渡す
	const { data: accounts } = await supabase
		.from("game_accounts")
		.select("*")
		.order("created_at", { ascending: true });

	return (
		<div className="page-container page-wrapper">
			<div className="max-w-2xl mx-auto">
				<CharacterWizard accounts={accounts || []} />
			</div>
		</div>
	);
}
