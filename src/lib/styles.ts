/**
 * @file: styles.ts
 * @role: アプリ全体のスタイル定義。
 *        z-index の階層を整理し、要素の重なりと Sticky 位置の競合を解消します。
*/

export const UI_STYLE = {
	container: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
	pageWrapper: "pt-0 pb-24 md:pb-10", // 上部のパディングを完全に排除

	// アプリ全体の枠組み
	shell: {
		wrapper: "flex h-screen w-full overflow-hidden bg-background",
		main: "flex flex-col flex-1 min-w-0 h-full relative",
		content: "flex-1 overflow-y-auto relative z-0",
	},
	
	header: {
		app: {
			wrapper: "sticky top-0 z-30 w-full bg-background border-b border-border/60",
			inner: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between",
			logo: "text-lg font-black italic tracking-tighter text-blue-600",
			logout: "text-[10px] font-black text-slate-500 hover:text-red-500 transition-colors py-1 px-3 border border-slate-200 dark:border-slate-700 rounded-full bg-white dark:bg-slate-800"
		},
		backButton: "h-9 w-9 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center font-bold shadow-sm transition-all active:scale-95 shrink-0 z-30 mr-4",
		// stickyWrapper に top-14 を統合
		stickyWrapper: "sticky top-0 z-40 bg-background/95 backdrop-blur py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-border/40 pb-4 overflow-visible",		// user 操作バーの下に余白を追加 (mt-2 -> my-2)
		user: "flex items-center justify-between w-full bg-muted/40 p-2 rounded-lg border border-border/60 my-2 overflow-visible",
		// stickyWrapper の py-2 を py-0 にし、密着度を高める。z-indexを30に固定
		decorationText: "absolute right-4 bottom-0 text-7xl font-black italic opacity-10 select-none text-white tracking-tighter pointer-events-none",
		session: "flex items-center justify-between text-white p-4 rounded-xl shadow-lg relative overflow-hidden",
	},

	gearListSection: "relative z-10",

	tab: {
		container: "flex gap-1 px-1 mt-4", // mt-4 をここに統合
		item: "flex-1 py-2.5 rounded-t-xl font-black text-[10px] tracking-widest uppercase transition-all border-t border-x",
		active: "bg-blue-600 text-white border-blue-700 shadow-[0_-4px_10px_rgba(37,99,235,0.2)]",
		inactive: "bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent hover:bg-slate-200",
	},

	// モーダル
	modal: {
		overlay: "fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
		content: "bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col p-6 border border-slate-200 dark:border-slate-700",
		header: "flex justify-between items-center mb-6",
		close: "text-slate-400 hover:text-slate-600 text-xl transition-colors",
		body: "flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar",
		itemBtn: "w-full p-4 text-left border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group flex justify-between items-center",
		removeBtn: "w-full p-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all text-[10px] font-black text-slate-400 uppercase tracking-widest",
		title: "text-lg font-black text-blue-600 dark:text-blue-400 uppercase tracking-tight",
		subtitle: "text-[10px] font-bold text-slate-500 italic uppercase tracking-widest",
		footer: "mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[9px] text-slate-400 leading-relaxed italic",
		actionText: "text-blue-500 font-black text-[10px] opacity-0 group-hover:opacity-100 transition-opacity",
		itemLabel: "font-bold text-slate-800 dark:text-slate-100",
		empty: "py-10 text-center text-slate-400 text-sm italic animate-pulse", // animate-pulse を統合

	},

	// キャラクターカード
	characterCard: {
		wrapper: "group relative flex flex-col justify-between min-h-[140px] transition-all duration-300 border-t-[8px] border-x border-b border-x-slate-200 border-b-slate-200 dark:border-x-slate-800 dark:border-b-slate-800 hover:shadow-lg bg-white dark:bg-slate-900",
		name: "text-lg font-black text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 break-all",
		jobBadge: "absolute top-2 right-2 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-black italic text-slate-500 shadow-sm z-20",
		accountBadge: "inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-widest mt-2",
		world: "",
		selectText: "",
	},

	// 共通の「アプリヘッダー」用スタイルを新設
	appHeader: {
		wrapper: "sticky top-0 z-40 w-full bg-background border-b border-border/60",
		inner: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between",
	},
  

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

	// プログレスバー
	progress: {
		container: "w-full bg-muted h-2 rounded-full overflow-hidden border border-border/50",
		bar: "h-full transition-all duration-1000 bg-primary",
		complete: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]",
	},

	card: "bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6",
	title: "text-2xl font-bold text-slate-900 dark:text-white mb-6",

	// ボタン: 背景青、文字白を明示
	button: {
		base: "inline-flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 font-bold tracking-tighter uppercase rounded-md",
		primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
		secondary: "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200",
	},
	
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

	nav: {
		sidebar: "hidden md:flex w-64 flex-col bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0",
		bottom: "md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center h-16 px-2 z-[100]",
		item: "flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-lg transition-colors min-w-[64px]",
		itemActive: "bg-blue-600 text-white",
		itemInactive: "text-slate-500 md:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
		label: "text-[10px] md:text-sm font-bold uppercase tracking-tighter md:tracking-normal",
	},

	// 装備リストのコンテナ（タブとの一体化用）
	gearListWrapper: "bg-white dark:bg-slate-900 border-x border-b border-slate-200 dark:border-slate-800 rounded-b-2xl p-4 shadow-sm",
	// 装備スロット専用のスタイル定義

	gearSlot: {
		container: "flex items-center p-3 sm:p-4 transition-all border-l-4 cursor-pointer hover:border-blue-500",
		active: "border-l-blue-600 bg-white dark:bg-slate-800 shadow-sm",
		inactive: "border-l-slate-300 dark:border-l-slate-700 opacity-80",
		iconWrapper: "w-10 h-10 sm:w-12 sm:h-12 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 mr-4 shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors",
		iconText: "text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-0.5",
		details: "flex-grow min-w-0",
		name: "font-bold text-slate-900 dark:text-slate-100 mb-1 truncate",
		emptyText: "text-slate-400 text-xs italic py-2",
		arrow: "ml-2 text-slate-300 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
	},

	jobSelector: {
		wrapper: "inline-block overflow-visible", 
		// トリガー（ボタン）は w-52 で固定
		trigger: "flex items-center justify-between w-52 flex-none px-4 py-2 bg-slate-800 hover:bg-black text-white rounded-lg border border-slate-700 shadow-lg transition-all active:scale-95 group",

		// ポップアップメニュー側のスタイル
		// 重点：w-max と whitespace-nowrap を追加
		menu: "absolute z-[999] top-full right-0 left-auto mt-2 p-2 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-max min-w-full max-w-[80vw] whitespace-nowrap overflow-visible",
		triggerLabel: "text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-400",
		triggerValue: "text-sm font-black italic text-white flex-1 text-left ml-1",
		triggerIcon: "text-slate-500 text-[8px] ml-1",

		overlay: "fixed inset-0 z-[110] bg-transparent",
		menuHeader: "text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-2 border-b border-slate-800 pb-1 text-left",

		// grid-flow-col を削除し、自然な横2列の並びに変更
		grid: "grid grid-cols-2 gap-x-4 gap-y-1", 

		button: "flex items-center w-[130px] px-3 py-1.5 text-[11px] font-black italic tracking-tighter transition-colors rounded-sm",
		buttonDot: "mr-2 opacity-30 text-[8px] shrink-0", 
		active: "bg-blue-600 text-white shadow-[inset_0_0_8px_rgba(255,255,255,0.3)]",
		inactive: "text-slate-400 hover:bg-slate-800 hover:text-white",
	},

	// ジョブグリッドメニュー
	jobGrid: {
		// モバイルでは4列、タブレットでは6列、PCでは11列（11x2）に自動調整
		container: "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-1 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-xl border border-border/60",
		button: "flex items-center justify-center py-2 px-1 rounded-lg text-[10px] font-black italic transition-all border border-transparent tracking-tighter",
		active: "bg-blue-600 text-white shadow-md border-blue-400 scale-[1.03] z-10",
		inactive: "text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
	},

	// アカウント管理画面用
	accountRow: {
		container: "flex items-center justify-between p-4 transition-all border-l-[6px] hover:shadow-md",
		info: "flex items-center gap-4 flex-1",
		colorPreview: "w-10 h-10 rounded-full shadow-inner border border-black/10 flex items-center justify-center text-white text-xs",
		name: "font-black text-slate-800 dark:text-white text-lg leading-tight",
		meta: "text-[10px] font-mono text-slate-400 uppercase tracking-tighter mt-1",
		stats: "flex items-center gap-6 px-6 border-x border-border/60",
		actions: "flex items-center gap-2 pl-4",
	},

};