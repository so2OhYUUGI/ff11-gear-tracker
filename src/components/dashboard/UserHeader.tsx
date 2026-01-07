"use client";

import { Button } from "@/components/ui/button";
import { UI_STYLE } from "@/lib/styles"; // 共通スタイルをインポート

export function UserHeader({ email }: { email?: string }) {
	return (
		// UI_STYLE.header.user で背景色、余白、境界線を一括管理
		<div className={UI_STYLE.header.user}>
			<div className="min-w-0">
				{/* UI_STYLE.label で「Operator」の文字サイズと太さを統一 */}
				<p className={UI_STYLE.label}>Operator</p>
				<p className="text-xs font-bold truncate text-foreground">
					{email}
				</p>
			</div>

			<form action="/auth/signout" method="post">
				{/* ボタンの高さやフォントサイズも UI_STYLE の基準に合わせる */}
				<Button
					variant="ghost"
					size="sm"
					type="submit"
					className="h-7 text-[10px] uppercase font-bold hover:bg-destructive/10 hover:text-destructive transition-colors"
				>
					Sign Out
				</Button>
			</form>
		</div>
	);
}