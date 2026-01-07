'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UI_STYLE } from '@/lib/styles';

const MAJOR_SLOTS = [
	{ id: 'head', name: '頭', icon: '🪖' },
	{ id: 'body', name: '胴', icon: '👕' },
	{ id: 'hands', name: '手', icon: '🧤' },
	{ id: 'legs', name: '脚', icon: '👖' },
	{ id: 'feet', name: '足', icon: '👟' },
] as const;

const JOBS = [
	'WAR', 'MNK', 'WHM', 'BLM', 'RDM', 'THF', 'PLD', 'DRK', 'BST', 'BRD',
	'RNG', 'SAM', 'NIN', 'DRG', 'SMN', 'BLU', 'COR', 'PUP', 'DNC', 'SCH', 'GEO', 'RUN'
];

interface DashboardProps {
	characterId: string;
	onBack: () => void;
}

export default function Dashboard({ characterId, onBack }: DashboardProps) {
	const supabase = createClient();

	const [character, setCharacter] = useState<any>(null);
	const [gears, setGears] = useState<Record<string, any>>({});
	const [currentJob, setCurrentJob] = useState('WAR');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			if (!characterId) return;
			setLoading(true);
			try {
				const { data: charData } = await supabase
					.from('characters')
					.select('*')
					.eq('id', characterId)
					.single();
				if (charData) setCharacter(charData);

				const { data: gearData } = await supabase
					.from('character_gears')
					.select(`slot, items ( name_ja, tier, category )`)
					.eq('character_id', characterId)
					.eq('job_code', currentJob);

				if (gearData) {
					const gearMap = (gearData as any[]).reduce((acc, gear) => {
						acc[gear.slot] = gear;
						return acc;
					}, {} as Record<string, any>);
					setGears(gearMap);
				}
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, [characterId, currentJob, supabase]);

	return (
		<div className={UI_STYLE.container}>
			{/* 1. 戻るボタン & ジョブ選択 (定義済みのスタイルを使用) */}
			<div className="flex justify-between items-center mb-6">
				<button
					onClick={onBack}
					className={UI_STYLE.buttonSecondary}
				>
					← 戻る
				</button>

				<div className="flex items-center gap-2">
					<label className="text-xs font-bold text-slate-500">JOB</label>
					<select
						value={currentJob}
						onChange={(e) => setCurrentJob(e.target.value)}
						className={UI_STYLE.input}
					>
						{JOBS.map(job => (
							<option key={job} value={job}>{job}</option>
						))}
					</select>
				</div>
			</div>

			{/* 2. キャラクター情報カード */}
			<div className={`${UI_STYLE.card} bg-gradient-to-br from-slate-800 to-slate-900 border-none mb-8`}>
				<div className="flex justify-between items-end">
					<div>
						<p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">
							{character?.world || 'Vana\'diel'}
						</p>
						<h1 className={`${UI_STYLE.title} text-white mb-0`}>
							{character?.name || '---'}
						</h1>
					</div>
					<div className="text-4xl font-black text-white/10 italic select-none">
						{currentJob}
					</div>
				</div>
			</div>

			{/* 3. 装備リスト (バッジも UI_STYLE を使用) */}
			<div className="space-y-3">
				<h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
					Equipment Status
				</h2>

				{MAJOR_SLOTS.map((slot) => {
					const gear = gears[slot.id];
					return (
						<div
							key={slot.id}
							className={`${UI_STYLE.card} flex items-center p-4 hover:border-blue-500 transition-all cursor-pointer border-l-4 ${gear ? 'border-l-blue-500' : 'border-l-slate-300'}`}
						>
							<div className="w-12 h-12 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 mr-4">
								<span className="text-xl">{slot.icon}</span>
								<span className="text-[9px] font-bold text-slate-400 uppercase">{slot.name}</span>
							</div>

							<div className="flex-grow">
								{gear ? (
									<div>
										<div className="font-bold text-slate-800 dark:text-slate-100 mb-1">
											{gear.items?.name_ja}
										</div>
										<div className="flex gap-2">
											<span className={UI_STYLE.badge.info}>{gear.items?.category}</span>
											<span className={UI_STYLE.badge.secondary}>
												{gear.items?.tier === 0 ? 'NQ' : `+${gear.items?.tier}`}
											</span>
										</div>
									</div>
								) : (
									<div className="text-slate-400 text-sm italic">未登録</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}