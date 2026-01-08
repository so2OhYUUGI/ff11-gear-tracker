import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import GearTrackerContainer from "@/components/gear/GearTrackerContainer";
import { Suspense } from "react";

export default async function GearPage(props: {
	searchParams: Promise<{ charId?: string }>;
}) {
	const searchParams = await props.searchParams;
	const charId = searchParams.charId;

	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) return redirect("/login");

	const { data: characters } = await supabase
		.from("characters")
		.select(`
      id, 
      name, 
      world, 
      last_job_code,
      game_accounts (
        id,
        name,
        color_code
      )
    `);
	
	if (!characters || characters.length === 0) {
		return redirect("/setup");
	}

	return (
		<Suspense fallback={<div className="p-10 text-center">Loading Tracker...</div>}>
			<GearTrackerContainer
				initialCharacters={characters}
				initialCharId={charId}
			/>
		</Suspense>
	);
}