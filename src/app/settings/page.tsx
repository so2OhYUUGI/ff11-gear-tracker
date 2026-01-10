// src/app/settings/page.tsx

export default function SettingsPage() {
	return (
		<div className="page-container page-wrapper">
			<header className="mb-10">
				<h1 className="main-title">App Settings</h1>
				<p className="page-description">アプリとデータの管理</p>
			</header>

			<div className="grid gap-4">
				{/* ゲームアカウント管理へのリンク */}
				<a href="/accounts" className="card flex items-center justify-between hover:border-blue-500 transition-colors group">
					<div>
						<div className="font-bold text-slate-800 dark:text-white">Game Account Management</div>
						<div className="text-xs text-slate-500 mt-1">ゲームアカウントの追加・削除・色設定</div>
					</div>
					<span className="text-slate-300 group-hover:text-blue-500 transition-colors">➔</span>
				</a>

				{/* 将来の設定項目（例） */}
				<div className="card opacity-50 cursor-not-allowed">
					<div className="font-bold text-slate-400">Display Preferences (Coming Soon)</div>
				</div>
			</div>
		</div>
	);
}
