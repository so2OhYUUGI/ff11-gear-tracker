'use client';

import { UI_STYLE } from '@/lib/styles';
import { MAJOR_SLOTS } from '@/lib/constants/';
import { CharacterGear } from '@/lib/types';

interface GearSlotListProps {
	gears: Record<string, CharacterGear>; // any を排除
	loading: boolean;
	onSlotClick?: (slot: { id: string, name: string }) => void;
}

export default function GearSlotList({ gears, loading, onSlotClick }: GearSlotListProps) {
	return (
		<div className={UI_STYLE.section}>
			<div className="flex justify-between items-center px-1 mb-2">
				<h2 className={UI_STYLE.sectionTitleText}>Equipment Progress</h2>
				{loading && <span className={UI_STYLE.text.tiny + " text-blue-500 animate-pulse font-bold"}>SYNCING...</span>}
			</div>

			<div className="grid gap-3">
				{MAJOR_SLOTS.map((slot) => {
					const gear = gears[slot.id];
					return (
						<div
							key={slot.id}
							onClick={() => onSlotClick?.({ id: slot.id, name: slot.name })}
							className={`${UI_STYLE.card} ${UI_STYLE.gearSlot.container} ${gear ? UI_STYLE.gearSlot.active : UI_STYLE.gearSlot.inactive} group`}
						>
							<div className={UI_STYLE.gearSlot.iconWrapper}>
								<span className="text-xl">{slot.icon}</span>
								<span className={UI_STYLE.gearSlot.iconText}>{slot.name}</span>
							</div>

							<div className={UI_STYLE.gearSlot.details}>
								{gear ? (
									<div>
										<div className={UI_STYLE.gearSlot.name}>
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
									<div className={UI_STYLE.gearSlot.emptyText}>未登録</div>
								)}
							</div>

							<div className={UI_STYLE.gearSlot.arrow}>➔</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}