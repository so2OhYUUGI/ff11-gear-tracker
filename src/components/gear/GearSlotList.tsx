/**
 * src/components/gear/GearSlotList.tsx
 * 役割: 各部位（頭・胴・手など）の装備状態をリスト表示するコンポーネント
 * 選択された装束カテゴリ（AF1/AF2など）に基づき、現在の収集状況を一覧化して表示します。
 */

'use client';

import { UI_STYLE } from '@/lib/styles';
import { MAJOR_SLOTS } from '@/lib/constants/';
import { CharacterGear, GearCategory } from '@/lib/types';
import GearUpgradeRecipe from './GearUpgradeRecipe';

interface GearSlotListProps {
	gears: Record<string, CharacterGear>;
	category: GearCategory; // ← 型定義に追加
	loading: boolean;
	onSlotClick?: (slot: { id: string, name: string }) => void;
}

export default function GearSlotList({ gears, category, loading, onSlotClick }: GearSlotListProps) {
	return (
		<div className={UI_STYLE.section}>
			<div className="flex justify-between items-center px-1 mb-2">
				<h2 className={UI_STYLE.sectionTitleText}>
					Equipment Progress ({category})
				</h2>
				{loading && <span className={UI_STYLE.text.tiny + " text-blue-500 animate-pulse font-bold"}>SYNCING...</span>}
			</div>

			<div className="grid gap-3">
				{MAJOR_SLOTS.map((slot) => {
					const gear = gears[slot.id];
					return (
						<div
							// categoryをkeyに含めることで、カテゴリ切り替え時に要素を確実にリフレッシュする
							key={`${category}-${slot.id}`}
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
							<div>
								{gear && <GearUpgradeRecipe itemId={gear.item_id} />}
							</div>

							<div className={UI_STYLE.gearSlot.arrow}>➔</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}