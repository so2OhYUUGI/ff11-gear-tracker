'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UI_STYLE } from '@/lib/styles';
import { GearCategory } from '@/lib/types';

interface GearEditModalProps {
	isOpen: boolean;
	onClose: () => void;
	characterId: string;
	jobCode: string;
	category: GearCategory;
	slot: { id: string, name: string } | null;
	onSelect: () => void;
}

export default function GearEditModal({ isOpen, onClose, characterId, jobCode, category, slot, onSelect }: GearEditModalProps) {
	const supabase = createClient();
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchTiers() {
			if (!isOpen || !slot) return;
			setLoading(true);
			const { data } = await supabase
				.from('items')
				.select('*')
				.eq('slot', slot.id)
				.eq('category', category)
				.contains('jobs', [jobCode])
				.order('tier', { ascending: true });
			setItems(data || []);
			setLoading(false);
		}
		fetchTiers();
	}, [isOpen, slot, jobCode, category, supabase]);

	const handleSelectItem = async (itemId: string | null) => {
		if (!slot) return;
		const { error } = await supabase
			.from('character_gears')
			.upsert({
				character_id: characterId, job_code: jobCode, slot: slot.id, item_id: itemId, updated_at: new Date().toISOString()
			}, { onConflict: 'character_id, job_code, slot' });

		if (!error) { onSelect(); onClose(); }
	};

	if (!isOpen || !slot) return null;

	return (
		<div className={UI_STYLE.modal.overlay}>
			<div className={UI_STYLE.modal.content}>
				<div className={UI_STYLE.modal.header}>
					<div>
						<h3 className={UI_STYLE.cardTitle + " text-lg text-blue-600"}>{category} {slot.name} 進捗更新</h3>
						<p className={UI_STYLE.text.tiny + " text-slate-500"}>Job: {jobCode}</p>
					</div>
					<button onClick={onClose} className={UI_STYLE.modal.close}>✕</button>
				</div>

				<div className={UI_STYLE.modal.body}>
					<button onClick={() => handleSelectItem(null)} className={UI_STYLE.modal.removeBtn}>
						❌ 未取得 / 装備なし
					</button>

					{loading ? (
						<div className={UI_STYLE.modal.empty + " animate-pulse"}>Loading Tiers...</div>
					) : items.length > 0 ? (
						items.map(item => (
							<button key={item.id} onClick={() => handleSelectItem(item.id)} className={UI_STYLE.modal.itemBtn}>
								<div className="flex justify-between items-center w-full">
									<div>
										<div className="font-bold text-slate-800 dark:text-slate-100">{item.name_ja}</div>
										<div className={UI_STYLE.badge.secondary + " mt-1"}>Tier: {item.tier === 0 ? 'NQ' : `+${item.tier}`}</div>
									</div>
									<div className="text-blue-500 opacity-0 group-hover:opacity-100 font-black">SET ➔</div>
								</div>
							</button>
						))
					) : (
						<div className={UI_STYLE.modal.empty}>データ未登録</div>
					)}
				</div>
			</div>
		</div>
	);
}