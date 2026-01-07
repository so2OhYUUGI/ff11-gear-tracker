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
	}
};