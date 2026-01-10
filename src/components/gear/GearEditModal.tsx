
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GearCategory, GearItem, JobCode } from '@/lib/types';
import { JOB_MIN_TIER_RULES } from '@/lib/constants/';

interface GearEditModalProps {
	isOpen: boolean;
	onClose: () => void;
	characterId: string;
	jobCode: JobCode;
	category: GearCategory;
	slot: { id: string, name: string } | null;
	currentItemId?: number | null;
	onSelect: () => void;
}

export default function GearEditModal({
	isOpen, onClose, characterId, jobCode, category, slot, currentItemId, onSelect
}: GearEditModalProps) {
	const supabase = createClient();
	const [items, setItems] = useState<GearItem[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchItems() {
			if (!isOpen || !slot) return;
			setLoading(true);

			const { data, error } = await supabase
				.from('items')
				.select('*')
				.eq('slot', slot.id)
				.eq('category', category)
				.contains('jobs', [jobCode])
				.order('tier', { ascending: true });

			if (!error && data) {
				let filtered = data as GearItem[];
				const minTier = JOB_MIN_TIER_RULES[jobCode]?.[category];
				if (minTier !== undefined) {
					filtered = filtered.filter(item => item.tier >= minTier);
				}
				setItems(filtered);
			}
			setLoading(false);
		}
		fetchItems();
	}, [isOpen, slot, jobCode, category, supabase]);

	const handleSelectItem = async (itemId: number | null) => {
		if (!slot) return;
		const { error } = await supabase
			.from('character_gears')
			.upsert({
				character_id: characterId,
				job_code: jobCode,
				category: category,
				slot: slot.id,
				item_id: itemId,
				updated_at: new Date().toISOString()
			}, { onConflict: 'character_id,job_code,category,slot' });

		if (!error) {
			onSelect();
			onClose();
		} else {
			alert('保存に失敗しました。');
		}
	};
  
  const getItemButtonClasses = (itemId: number) => {
    const isActive = currentItemId === itemId;
    return `modal__item-button ${isActive ? 'modal__item-button--active' : ''}`;
  };

	if (!isOpen || !slot) return null;

	return (
		<div className="modal__overlay" onClick={onClose}>
			<div className="modal__content" onClick={(e) => e.stopPropagation()}>
				<div className="modal__header">
					<h3 className="modal__title">{category} {slot.name} 選択</h3>
					<button onClick={onClose} className="modal__close-button">✕</button>
				</div>
				<div className="modal__body">
					<button onClick={() => handleSelectItem(null)} className="modal__remove-button">
						❌ 未取得 / 装備なし (解除)
					</button>
					{loading ? (
						<div className="modal__loading-state">Loading...</div>
					) : items.length > 0 ? (
						<div className="space-y-2 mt-2">
							{items.map(item => (
								<button
									key={item.id}
									onClick={() => handleSelectItem(item.id)}
									className={getItemButtonClasses(item.id)}
								>
									<div className="flex flex-col items-start">
										<span className="modal__item-label">
											{item.name_ja}
											{currentItemId === item.id && <span className="text-yellow-400 text-xs ml-2">★装備中</span>}
										</span>
										<span className="badge badge--secondary">Tier: {item.tier}</span>
									</div>
									<div className="modal__action-text">選択</div>
								</button>
							))}
						</div>
					) : (
						<div className="modal__empty-state">データなし</div>
					)}
				</div>
			</div>
		</div>
	);
}
