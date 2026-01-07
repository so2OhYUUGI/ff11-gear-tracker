"use client";

import { ChevronLeft, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UI_STYLE } from "@/lib/styles"; // 共通スタイルをインポート

export function SessionHeader({ character, onBack }: any) {
	return (
		// UI_STYLE.header.session に bg-primary や padding などが集約されています
		<div className={UI_STYLE.header.session}>
			<div className="flex items-center gap-2 min-w-0">
				<Button
					variant="ghost"
					size="icon"
					className={UI_STYLE.header.backButton}
					onClick={onBack}
				>
					<ChevronLeft className="w-6 h-6" />
				</Button>

				<div className="flex items-center gap-2 min-w-0">
					{/* アイコンの背景色は文字色の10%透明に固定 */}
					<div className="p-1.5 bg-primary-foreground/10 rounded-lg shrink-0">
						<UserCircle className="w-4 h-4 text-primary-foreground" />
					</div>

					<div className="min-w-0">
						{/* UI_STYLE.label でフォントサイズや太さを統一。色はヘッダーに合わせて微調整 */}
						<p className={`${UI_STYLE.label} text-primary-foreground opacity-70 mb-0`}>
							Active Session
						</p>
						{/* UI_STYLE.cardTitle でフォントの雰囲気を統一 */}
						<p className={`${UI_STYLE.cardTitle} text-sm text-primary-foreground leading-none normal-case`}>
							{character?.name}
							<span className="ml-1.5 text-[10px] font-medium opacity-60">
								@{character?.world}
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}