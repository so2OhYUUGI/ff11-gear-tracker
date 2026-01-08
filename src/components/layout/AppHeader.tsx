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
		<header className={UI_STYLE.header.app.wrapper}>
			<div className={UI_STYLE.header.app.inner}>
				<div className="flex items-center gap-2">
					<span className={UI_STYLE.header.app.logo}>FF11 Tracker</span>
					{email && <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">| {email}</span>}
				</div>
				<button
					onClick={handleLogout}
					className={UI_STYLE.header.app.logout}
				>
					LOGOUT ⎋
				</button>
			</div>
		</header>
	);
}