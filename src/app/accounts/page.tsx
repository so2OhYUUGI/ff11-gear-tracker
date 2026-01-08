import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AccountList from "@/components/account/AccountList"; // パス変更
import { UI_STYLE } from "@/lib/styles";

export default async function AccountsPage() {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) redirect("/login");

	const { data: accounts } = await supabase
		.from("game_accounts")
		.select(`
      *,
      characters ( id )
    `)
		.order("created_at", { ascending: true });

	return (
		<div className={`${UI_STYLE.container} ${UI_STYLE.pageWrapper}`}>
			<header className="mb-8 flex justify-between items-end">
				<div>
					<h1 className={UI_STYLE.mainTitle}>Account Management</h1>
					<p className={UI_STYLE.label}>上位エンティティ：ゲームアカウントの管理</p>
				</div>
				<a href="/" className={UI_STYLE.buttonSecondary}>ポータルへ戻る</a>
			</header>

			<AccountList initialAccounts={accounts || []} />
		</div>
	);
}