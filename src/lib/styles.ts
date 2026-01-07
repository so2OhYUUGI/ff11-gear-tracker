export const UI_STYLE = {
	// 全体コンテナ
	container: "flex flex-col gap-6 w-full max-w-md mx-auto pb-20 px-1 animate-in fade-in duration-500",

	// セクション（進捗や在庫のまとまり）
	section: "space-y-4", // ← これが漏れていました
	sectionTitleText: "text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1",

	// テキストスタイル
	mainTitle: "text-2xl font-black italic tracking-tighter uppercase text-primary",
	label: "text-[9px] font-bold uppercase text-muted-foreground tracking-tighter block",
	cardTitle: "text-[11px] font-black uppercase tracking-tight text-foreground truncate",
	quantity: "text-2xl font-black tracking-tighter text-foreground",
	progressText: "font-mono text-[10px] font-bold text-foreground",

	// テキストカテゴリ
	text: {
		tiny: "text-[8px] font-medium uppercase",
		mono: "font-mono text-[10px]",
		label: "text-[9px] font-bold uppercase tracking-tighter",
	},

	// カード
	card: "overflow-hidden shadow-sm border-2 bg-card transition-all",
	cardActive: "border-primary ring-1 ring-primary/20 shadow-md",
	cardInactive: "border-border opacity-90",

	// ヘッダー関連
	header: {
		session: "flex items-center justify-between bg-primary text-primary-foreground p-3 rounded-xl shadow-lg mb-2",
		user: "flex items-center justify-between bg-muted/40 p-3 rounded-lg border border-border/60 mb-2",
		backButton: "h-9 w-9 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground rounded-full shrink-0 border-none flex items-center justify-center",
	},

	// プログレスバー
	progress: {
		container: "w-full bg-muted h-2 rounded-full overflow-hidden border border-border/50",
		bar: "h-full transition-all duration-1000 bg-primary",
		complete: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]",
	},

	// ボタン
	button: {
		icon: "h-8 w-8 rounded-md border border-border flex items-center justify-center",
		add: "w-full h-9 border-dashed gap-2 font-bold text-[10px] uppercase flex items-center justify-center",
		tab: "h-8 text-[10px] font-bold uppercase",
	},

	// --- 追加分 ---
	buttonSecondary: "px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2",
	input: "px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold",
	// --------------

	title: "text-2xl font-bold text-slate-900 dark:text-white mb-6",
	
	badge: {
		info: "px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px] font-bold uppercase",
		success: "px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-[10px] font-bold uppercase",
		warning: "px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded text-[10px] font-bold uppercase",
		secondary: "px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold uppercase",
	}
};