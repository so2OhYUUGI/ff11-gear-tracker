export const UI_STYLE = {
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

	card: "bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6",
	title: "text-2xl font-bold text-slate-900 dark:text-white mb-6",

	// ボタン: 背景青、文字白を明示
	button: "inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50",

	// サブボタン: 背景グレー、文字白を明示
	buttonSecondary: "inline-flex items-center justify-center px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2",

	// 入力フォーム: 文字色を slate-900 (ライト) / white (ダーク) で固定
	input: "px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold",

	badge: {
		info: "px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded text-[10px] font-bold uppercase border border-blue-200 dark:border-blue-800",
		success: "px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded text-[10px] font-bold uppercase border border-emerald-200 dark:border-emerald-800",
		warning: "px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded text-[10px] font-bold uppercase border border-amber-200 dark:border-amber-800",
		secondary: "px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold uppercase border border-slate-200 dark:border-slate-600",
	},

	shell: {
		// 既存の背景色と干渉しないよう bg-background を活用
		wrapper: "flex h-screen w-full overflow-hidden bg-background",
		main: "flex flex-col flex-1 min-w-0 h-full relative",
		content: "flex-1 overflow-y-auto p-4 pb-24 md:pb-6", // スマホ時のボトムナビ分の余白
	},

	nav: {
		sidebar: "hidden md:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0",
		bottom: "md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center h-16 px-2 z-[100]",
		item: "flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-lg transition-colors min-w-[64px]",
		itemActive: "bg-blue-600 text-white",
		itemInactive: "text-slate-500 md:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
		label: "text-[10px] md:text-sm font-bold uppercase tracking-tighter md:tracking-normal",
	},

	// キャラクター選択カード専用
	characterCard: {
		wrapper: "group relative flex flex-col justify-between min-h-[140px] transition-all duration-300 border-t-[8px] border-x border-b border-x-slate-200 border-b-slate-200 dark:border-x-slate-800 dark:border-b-slate-800 hover:shadow-lg bg-white dark:bg-slate-900",

		// truncateを解除し、2行までの折り返しを許可（長い名前対策）
		name: "text-lg font-black text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 break-all",

		// 絶対配置で右上に浮かせる
		jobBadge: "absolute top-2 right-2 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-black italic text-slate-500 shadow-sm z-20",

		accountBadge: "inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-widest mt-2",
		world: "text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-1",
		selectText: "text-[10px] font-black text-blue-500 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0"
	},

};