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
	return (
		<div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
			{GEAR_CATEGORIES.map((cat) => (
				<button
					// cat は 'AF' などの文字列なので、そのまま key や引数に使います
					key={cat}
					onClick={() => onSelect(cat as GearCategory)}
					className={`
						flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all
						${activeCategory === cat
							? 'bg-white text-blue-600 shadow-sm'
							: 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}
					`}
				>
					{/* 表示名も cat (AF, RELIC 等) をそのまま使用 */}
					{cat}
				</button>
			))}
		</div>
	);
}