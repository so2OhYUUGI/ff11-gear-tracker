
/**
 * src/components/gear/GearCategoryTabs.tsx
 * 役割: 装備カテゴリ（AF/RELIC/EMPY）を選択するタブUI。
 */

'use client';

import { GEAR_CATEGORIES } from '@/lib/constants';
import { GearCategory } from '@/lib/types';

interface GearCategoryTabsProps {
	activeCategory: GearCategory;
	onSelect: (category: GearCategory) => void;
}

export default function GearCategoryTabs({ activeCategory, onSelect }: GearCategoryTabsProps) {

  const getButtonClasses = (category: GearCategory) => {
    const isActive = activeCategory === category;
    return `gear-tabs__button ${isActive ? 'gear-tabs__button--active' : 'gear-tabs__button--inactive'}`;
  };

	return (
		<div className="gear-tabs">
			{GEAR_CATEGORIES.map((cat) => (
				<button
					key={cat}
					onClick={() => onSelect(cat as GearCategory)}
					className={getButtonClasses(cat as GearCategory)}
				>
					{cat}
				</button>
			))}
		</div>
	);
}
