'use client';

import { UI_STYLE } from '@/lib/styles';
import { MAJOR_SLOTS } from '@/lib/constants/slots';

interface GearSlotListProps {
	gears: Record<string, any>;
	loading: boolean;
	// ↓ ここを 'onSlotClick?:' に変更（'?' を追加）
	onSlotClick?: (slot: { id: string, name: string }) => void;
}

export default function GearSlotList({ gears, loading, onSlotClick }: GearSlotListProps) {
	return (
		<div className={UI_STYLE.section}>
			<div className="flex justify-between items-center px-1">
				<h2 className={UI_STYLE.sectionTitleText}>Equipment Progress</h2>
				{loading && <span className={UI_STYLE.text.tiny + " text-blue-500 animate-pulse"}>Syncing...</span>}
			</div>

			<div className="grid gap-3">
				{MAJOR_SLOTS.map((slot) => {
					const gear = gears[slot.id];
					return (
						<div
							key={slot.id}
							// ↓ onSlotClick が渡されている場合のみ実行する
							onClick={() => onSlotClick?.({ id: slot.id, name: slot.name })}
							className={`${UI_STYLE.card} ${gear ? UI_STYLE.cardActive : UI_STYLE.cardInactive} flex items-center p-3 sm:p-4 transition-all border-l-4 ${gear ? 'border-l-blue-500' : 'border-l-border'} ${onSlotClick ? 'cursor-pointer hover:border-blue-500' : ''}`}
						>
							<div className="w-10 h-10 sm:w-12 sm:h-12 flex flex-col items-center justify-center bg-muted rounded border border-border/50 mr-4 shrink-0">
								<span className="text-xl">{slot.icon}</span>
								<span className={UI_STYLE.text.tiny + " opacity-50"}>{slot.name}</span>
							</div>

							<div className="flex-grow min-w-0">
								{gear ? (
									<div>
										<div className={UI_STYLE.cardTitle + " text-sm mb-1 text-foreground"}>
											{gear.items?.name_ja}
										</div>
										<div className="flex flex-wrap gap-2">
											<span className={UI_STYLE.badge.info}>{gear.items?.category}</span>
											<span className={UI_STYLE.badge.secondary}>
												{gear.items?.tier === 0 ? 'NQ' : `+${gear.items?.tier}`}
											</span>
										</div>
									</div>
								) : (
									<div className="text-muted-foreground text-xs italic">未登録</div>
								)}
							</div>

							<div className="ml-2 text-muted-foreground opacity-30">➔</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}