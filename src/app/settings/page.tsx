// src/app/settings/page.tsx
import { UI_STYLE } from "@/lib/styles";

export default function SettingsPage() {
	return (
		<div className={`${UI_STYLE.container} ${UI_STYLE.pageWrapper}`}>
			<header className="mb-10">
				<h1 className={UI_STYLE.mainTitle}>App Settings</h1>
				<p className={UI_STYLE.label}>アプリとデータの管理</p>
			</header>

			<div className="grid gap-4">
				{/* ゲームアカウント管理へのリンク */}
				<a href="/accounts" className={UI_STYLE.card + " flex items-center justify-between hover:border-blue-500 transition-colors group"}>
					<div>
						<div className="font-bold text-slate-800 dark:text-white">Game Account Management</div>
						<div className="text-xs text-slate-500 mt-1">ゲームアカウントの追加・削除・色設定</div>
					</div>
					<span className="text-slate-300 group-hover:text-blue-500 transition-colors">➔</span>
				</a>

				{/* 将来の設定項目（例） */}
				<div className={UI_STYLE.card + " opacity-50 cursor-not-allowed"}>
					<div className="font-bold text-slate-400">Display Preferences (Coming Soon)</div>
				</div>
			</div>
		</div>
	);
}