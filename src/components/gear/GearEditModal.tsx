'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UI_STYLE } from '@/lib/styles';

interface GearEditModalProps {
	isOpen: boolean;
	onClose: () => void;
	characterId: string;
	jobCode: string;
	slot: { id: string, name: string };
	onSelect: () => void; // 更新後に親を再読み込みさせるため
}

export default function GearEditModal({ isOpen, onClose, characterId, jobCode, slot, onSelect }: GearEditModalProps) {
	const supabase = createClient();
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchAvailableItems() {
			if (!isOpen) return;
			setLoading(true);

			// 当該ジョブかつ当該スロットに合うアイテムを取得
			// AF/Relic/Empy などを優先的に出す
			const { data } = await supabase
				.from('items')
				.select('*')
				.eq('slot', slot.id)
				.contains('jobs', [jobCode])
				.order('tier', { ascending: false });

			setItems(data || []);
			setLoading(false);
		}
		fetchAvailableItems();
	}, [isOpen, slot.id, jobCode, supabase]);

	const handleSelectItem = async (itemId: string | null) => {
		// character_gears テーブルを更新 (Upsert)
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
		} else {
			console.error('Save error:', error);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
			<div className={`${UI_STYLE.card} w-full max-w-md max-h-[80vh] flex flex-col`}>
				<div className="flex justify-between items-center mb-4">
					<h3 className={UI_STYLE.cardTitle + " text-lg"}>
						{slot.name}装備を選択 ({jobCode})
					</h3>
					<button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
				</div>

				<div className="flex-1 overflow-y-auto space-y-2 pr-2">
					{/* 装備を外す選択肢 */}
					<button
						onClick={() => handleSelectItem(null)}
						className="w-full p-3 text-left border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 text-slate-500 text-sm"
					>
						❌ 装備を外す
					</button>

					{loading ? (
						<div className="p-10 text-center animate-pulse text-slate-400">Loading items...</div>
					) : (
						items.map(item => (
							<button
								key={item.id}
								onClick={() => handleSelectItem(item.id)}
								className="w-full p-3 text-left border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex justify-between items-center group"
							>
								<div>
									<div className="font-bold text-slate-800">{item.name_ja}</div>
									<div className={UI_STYLE.badge.secondary + " mt-1"}>{item.category}</div>
								</div>
								<div className="opacity-0 group-hover:opacity-100 text-blue-500">選択</div>
							</button>
						))
					)}
				</div>
			</div>
		</div>
	);
}