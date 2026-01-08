'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UI_STYLE } from '@/lib/styles';

interface GearEditModalProps {
	isOpen: boolean;
	onClose: () => void;
	characterId: string;
	jobCode: string;
	category: string; // AF, Relic, Empyrean
	slot: { id: string, name: string } | null;
	onSelect: () => void;
}

export default function GearEditModal({
	isOpen, onClose, characterId, jobCode, category, slot, onSelect
}: GearEditModalProps) {
	const supabase = createClient();
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchTiers() {
			if (!isOpen || !slot) return;
			setLoading(true);

			// 同じジョブ、同じ部位、同じカテゴリー（AF/Relic等）の全ティアを取得
			const { data, error } = await supabase
				.from('items')
				.select('*')
				.eq('slot', slot.id)
				.eq('category', category)
				.contains('jobs', [jobCode])
				.order('tier', { ascending: true });

			if (error) {
				console.error("Fetch Tiers Error:", error);
			}
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
				character_id: characterId,
				job_code: jobCode,
				slot: slot.id,
				item_id: itemId,
				updated_at: new Date().toISOString(),
			}, {
				onConflict: 'character_id, job_code, slot'
			});

		if (!error) {
			onSelect();
			onClose();
		}
	};

	if (!isOpen || !slot) return null;

	return (
		<div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className={`${UI_STYLE.card} w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl`}>
				<div className="flex justify-between items-center mb-6">
					<div>
						<h3 className={UI_STYLE.cardTitle + " text-lg text-blue-600"}>{category} {slot.name} 進捗更新</h3>
						<p className={UI_STYLE.text.tiny + " text-slate-500"}>Job: {jobCode}</p>
					</div>
					<button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
				</div>

				<div className="flex-1 overflow-y-auto space-y-3 pr-2">
					<button
						onClick={() => handleSelectItem(null)}
						className="w-full p-4 text-center border-2 border-dashed border-slate-200 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all text-[10px] font-black text-slate-400 uppercase tracking-widest"
					>
						❌ 未取得 / 装備なし
					</button>

					{loading ? (
						<div className="py-10 text-center animate-pulse text-slate-400">Loading Tiers...</div>
					) : items.length > 0 ? (
						items.map(item => (
							<button
								key={item.id}
								onClick={() => handleSelectItem(item.id)}
								className="w-full p-4 text-left border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
							>
								<div className="flex justify-between items-center">
									<div>
										<div className="font-bold text-slate-800">{item.name_ja}</div>
										<div className="flex gap-2 mt-1">
											<span className={UI_STYLE.badge.secondary}>Tier: {item.tier === 0 ? 'NQ' : `+${item.tier}`}</span>
										</div>
									</div>
									<div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all font-black">SET ➔</div>
								</div>
							</button>
						))
					) : (
						<div className="py-10 text-center text-slate-400 text-xs italic">
							データが登録されていません。<br />(category: {category}, slot: {slot.id})
						</div>
					)}
				</div>
			</div>
		</div>
	);
}