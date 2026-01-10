
/**
 * @file: styles.ts
 * @role: アプリ全体のスタイル定義。
 *        z-index の階層を整理し、要素の重なりと Sticky 位置の競合を解消します。
*/

export const UI_STYLE = {
	// アプリ全体の枠組み
	shell: {
		wrapper: "flex h-screen w-full overflow-hidden bg-background",
		main: "flex flex-col flex-1 min-w-0 h-full relative",
		content: "flex-1 overflow-y-auto relative z-0",
	},
	
	header: {
		app: {
			wrapper: "sticky top-0 z-40 w-full bg-background border-b border-border/60",
			inner: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between",
			logo: "text-lg font-black italic tracking-tighter text-blue-600",
			logout: "text-[10px] font-black text-slate-500 hover:text-red-500 transition-colors py-1 px-3 border border-slate-200 dark:border-slate-700 rounded-full bg-white dark:bg-slate-800"
		},
		backButton: "h-9 w-9 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-all active:scale-95 shrink-0 z-30 mr-4",
		stickyWrapper: "sticky top-0 z-50 bg-background/95 backdrop-blur py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-border/40 pb-4 overflow-visible",
		user: "flex items-center justify-between w-full bg-muted/40 p-2 rounded-lg border border-border/60 my-2 overflow-visible",
		decorationText: "absolute right-4 bottom-0 text-7xl font-black italic opacity-10 select-none text-white tracking-tighter pointer-events-none",
		session: "flex items-center justify-between text-white p-4 rounded-xl shadow-lg relative overflow-hidden",
	},

	gearListSection: "relative z-10",

	// セクション（進捗や在庫のまとまり）
	section: "space-y-4",
	sectionTitleText: "text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1",

	cardTitle: "text-[11px] font-black uppercase tracking-tight text-foreground truncate",
	quantity: "text-2xl font-black tracking-tighter text-foreground",
	progressText: "font-mono text-[10px] font-bold text-foreground",

	// 装備リストのコンテナ（タブとの一体化用）
	gearListWrapper: "bg-white dark:bg-slate-900 border-x border-b border-slate-200 dark:border-slate-800 rounded-b-2xl p-4 shadow-sm",
};