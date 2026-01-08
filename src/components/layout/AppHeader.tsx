'use client';

import { createClient } from "@/utils/supabase/client";
import { UI_STYLE } from "@/lib/styles";

export default function AppHeader({ email }: { email?: string }) {
	const handleLogout = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		window.location.href = "/login";
	};

	return (
		// layout.tsx での重なりを制御するため sticky を適用
		<header className={UI_STYLE.appHeader.wrapper}>
			<div className={UI_STYLE.appHeader.inner}>
				<div className="flex items-center gap-2">
					<span className="text-lg font-black italic tracking-tighter text-blue-600">FF11 Tracker</span>
					{email && <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">| {email}</span>}
				</div>
				<button
					onClick={handleLogout}
					className="text-[10px] font-black text-slate-500 hover:text-red-500 transition-colors py-1 px-3 border border-slate-200 dark:border-slate-700 rounded-full bg-white dark:bg-slate-800"
				>
					LOGOUT ⎋
				</button>
			</div>
		</header>
	);
}