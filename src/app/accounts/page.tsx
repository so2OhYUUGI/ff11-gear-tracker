import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountList from "@/components/account/AccountList"; // パス変更

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
		<div className="page-container page-wrapper">
			<header className="mb-8 flex justify-between items-end">
				<div>
					<h1 className="main-title">Account Management</h1>
					<p className="page-description">上位エンティティ：ゲームアカウントの管理</p>
				</div>
				<a href="/" className="btn-secondary">ポータルへ戻る</a>
			</header>

			<AccountList initialAccounts={accounts || []} />
		</div>
	);
}