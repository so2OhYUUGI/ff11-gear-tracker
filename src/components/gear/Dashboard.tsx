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
				const { data: charData } = await supabase.from('characters').select('*').eq('id', characterId).single();
				if (charData) setCharacter(charData);
				const { data: gearData } = await supabase.from('character_gears').select(`slot, items ( name_ja, tier, category )`).eq('character_id', characterId).eq('job_code', currentJob);
				if (gearData) {
					const gearMap = (gearData as any[]).reduce((acc, gear) => { acc[gear.slot] = gear; return acc; }, {} as Record<string, any>);
					setGears(gearMap);
				} else { setGears({}); }
			} finally { setLoading(false); }
		}
		fetchData();
	}, [characterId, currentJob, supabase]);

	return (
		<div className={UI_STYLE.container}>
			{/* 1. 操作ヘッダー: 戻るボタンを header.backButton の定義に合わせる */}
			<div className={UI_STYLE.header.user}>
				<button onClick={onBack} className={UI_STYLE.header.backButton}>
					<span className="font-bold">←</span>
				</button>
				<div className="flex items-center gap-2">
					<label className={UI_STYLE.label}>Job Select</label>
					<select value={currentJob} onChange={(e) => setCurrentJob(e.target.value)} className={UI_STYLE.input}>
						{JOBS.map(job => <option key={job} value={job}>{job}</option>)}
					</select>
				</div>
			</div>

			{/* 2. キャラクター情報: header.session (bg-primary / text-primary-foreground) を適用 */}
			<div className={UI_STYLE.header.session}>
				<div className="flex-1 min-w-0">
					<p className={UI_STYLE.text.tiny + " opacity-80"}>{character?.world || 'Loading'}</p>
					{/* 名前には明示的に primary-foreground (白系文字) を当てる */}
					<h1 className="text-xl sm:text-2xl font-black italic truncate leading-tight">
						{character?.name || '---'}
					</h1>
				</div>
				{/* ジョブ表示も session 内の背景色に合わせた透過白文字に */}
				<div className="text-4xl sm:text-5xl font-black italic opacity-20 ml-4 select-none">
					{currentJob}
				</div>
			</div>

			{/* 3. 装備リストセクション */}
			<div className={UI_STYLE.section + " mt-8"}>
				<div className="flex justify-between items-center px-1">
					<h2 className={UI_STYLE.sectionTitleText}>Equipment Progress</h2>
					{loading && <span className={UI_STYLE.text.tiny + " text-blue-500 animate-pulse"}>Syncing...</span>}
				</div>

				<div className="grid gap-3">
					{MAJOR_SLOTS.map((slot) => {
						const gear = gears[slot.id];
						return (
							<div
								key={slot.id}
								className={`${UI_STYLE.card} ${gear ? UI_STYLE.cardActive : UI_STYLE.cardInactive} flex items-center p-3 sm:p-4 transition-all border-l-4 ${gear ? 'border-l-blue-500' : 'border-l-border'}`}
							>
								{/* スロットアイコン */}
								<div className="w-10 h-10 sm:w-12 sm:h-12 flex flex-col items-center justify-center bg-muted rounded border border-border/50 mr-4 shrink-0">
									<span className="text-xl">{slot.icon}</span>
									<span className={UI_STYLE.text.tiny + " opacity-50"}>{slot.name}</span>
								</div>

								{/* 装備詳細 */}
								<div className="flex-grow min-w-0">
									{gear ? (
										<div>
											<div className={UI_STYLE.cardTitle + " text-sm mb-1"}>
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
										<div className="text-muted-foreground text-xs italic">未登録</div>
									)}
								</div>

								<div className="ml-2 text-muted-foreground opacity-30">➔</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}