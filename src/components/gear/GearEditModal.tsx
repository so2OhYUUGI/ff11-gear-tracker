'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UI_STYLE } from '@/lib/styles';
import { GearCategory, GearItem, JobCode } from '@/lib/types';
import { JOB_MIN_TIER_RULES } from '@/lib/constants/';

interface GearEditModalProps {
	isOpen: boolean;
	onClose: () => void;
	characterId: string;
	jobCode: JobCode;               // string -> JobCode に変更
	category: GearCategory;
	slot: { id: string, name: string } | null;
	currentItemId?: number | null;  // ★ここがエラーの原因でした。この行が必要です。
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

	if (!isOpen || !slot) return null;

	return (
		<div className={UI_STYLE.modal.overlay} onClick={onClose}>
			<div className={UI_STYLE.modal.content} onClick={(e) => e.stopPropagation()}>
				<div className={UI_STYLE.modal.header}>
					<h3 className={UI_STYLE.modal.title}>{category} {slot.name} 選択</h3>
					<button onClick={onClose} className={UI_STYLE.modal.close}>✕</button>
				</div>
				<div className={UI_STYLE.modal.body}>
					<button onClick={() => handleSelectItem(null)} className={UI_STYLE.modal.removeBtn}>
						❌ 未取得 / 装備なし (解除)
					</button>
					{loading ? (
						<div className="text-center py-4 text-gray-500 animate-pulse">Loading...</div>
					) : items.length > 0 ? (
						<div className="space-y-2 mt-2">
							{items.map(item => (
								<button
									key={item.id}
									onClick={() => handleSelectItem(item.id)}
									className={`${UI_STYLE.modal.itemBtn} ${currentItemId === item.id ? 'bg-slate-700 ring-1 ring-yellow-500' : ''}`}
								>
									<div className="flex flex-col items-start">
										<span className={UI_STYLE.modal.itemLabel}>
											{item.name_ja}
											{currentItemId === item.id && <span className="text-yellow-400 text-xs ml-2">★装備中</span>}
										</span>
										<span className={UI_STYLE.badge.secondary}>Tier: {item.tier}</span>
									</div>
									<div className={UI_STYLE.modal.actionText}>選択</div>
								</button>
							))}
						</div>
					) : (
						<div className={UI_STYLE.modal.empty}>データなし</div>
					)}
				</div>
			</div>
		</div>
	);
}