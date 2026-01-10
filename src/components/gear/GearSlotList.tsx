
/**
 * src/components/gear/GearSlotList.tsx
 * 役割: 各部位（頭・胴・手など）の装備状態をリスト表示するコンポーネント
 * 選択された装束カテゴリ（AF/RELICなど）に基づき、現在の収集状況を一覧化して表示します。
 */

'use client';

import { MAJOR_SLOTS } from '@/lib/constants/';
import { CharacterGear, GearCategory } from '@/lib/types';
import GearUpgradeRecipe from './GearUpgradeRecipe';

interface GearSlotListProps {
	gears: Record<string, CharacterGear>;
	category: GearCategory;
	loading: boolean;
	onSlotClick?: (slot: { id: string, name: string }) => void;
}

export default function GearSlotList({ gears, category, loading, onSlotClick }: GearSlotListProps) {

  const getSlotClasses = (gear: CharacterGear | undefined) => {
    const baseClass = 'gear-slot';
    const stateClass = gear ? 'gear-slot--active' : 'gear-slot--inactive';
    return `${baseClass} ${stateClass} group`;
  };

	return (
		<div className="gear-slot-list">
			<div className="gear-slot-list__header">
				<h2 className="gear-slot-list__title">
					Equipment Progress ({category})
				</h2>
				{loading && <span className="gear-slot-list__syncing-text">SYNCING...</span>}
			</div>

			<div className="gear-slot-list__grid">
				{MAJOR_SLOTS.map((slot) => {
					const gear = gears[slot.id];
					return (
						<div
							key={`${category}-${slot.id}`}
							onClick={() => onSlotClick?.({ id: slot.id, name: slot.name })}
							className={getSlotClasses(gear)}
						>
							<div className="gear-slot__icon-wrapper">
								<span className="text-xl">{slot.icon}</span>
								<span className="gear-slot__icon-text">{slot.name}</span>
							</div>

							<div className="gear-slot__details">
								{gear ? (
									<div>
										<div className="gear-slot__name">
											{gear.items?.name_ja}
										</div>
										<div className="flex flex-wrap gap-2">
											<span className="badge badge--info">{gear.items?.category}</span>
											<span className="badge badge--secondary">
												{gear.items?.tier === 0 ? 'NQ' : `+${gear.items?.tier}`}
											</span>
										</div>
									</div>
								) : (
									<div className="gear-slot__empty-text">未登録</div>
								)}
							</div>
							<div>
								{gear && <GearUpgradeRecipe itemId={gear.item_id} />}
							</div>

							<div className="gear-slot__arrow">➔</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
