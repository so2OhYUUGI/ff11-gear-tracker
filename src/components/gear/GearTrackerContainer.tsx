'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UI_STYLE } from '@/lib/styles';
import { JobCode } from '@/lib/constants/jobs';
import { Character, CharacterGear, GearCategory } from '@/lib/types'; // 型をインポート
import { formatGearMap } from '@/lib/utils';
import JobSelector from './JobSelector';
import GearSlotList from './GearSlotList';
import GearEditModal from './GearEditModal';

interface GearTrackerContainerProps {
	initialCharacters: Character[]; // any を排除
	initialCharId?: string | null;
}

export default function GearTrackerContainer({ initialCharacters, initialCharId }: GearTrackerContainerProps) {
	const supabase = createClient();
	const [selectedCharId, setSelectedCharId] = useState(initialCharId || initialCharacters[0]?.id || '');

	const char = initialCharacters.find(c => c.id === selectedCharId);
	const [currentJob, setCurrentJob] = useState<JobCode>((char?.last_job_code as JobCode) || 'WAR');
	const [activeCategory, setActiveCategory] = useState<GearCategory>('AF');

	// 型を Record<string, CharacterGear> に固定
	const [gears, setGears] = useState<Record<string, CharacterGear>>({});
	const [loading, setLoading] = useState(false);
	const [editingSlot, setEditingSlot] = useState<{ id: string, name: string } | null>(null);

	const fetchGears = async () => {
		if (!selectedCharId) return;
		setLoading(true);
		const { data, error } = await supabase
			.from('character_gears')
			.select(`slot, items ( id, name_ja, tier, category )`)
			.eq('character_id', selectedCharId)
			.eq('job_code', currentJob);

		if (!error && data) {
			setGears(formatGearMap(data as unknown as CharacterGear[]));
		} else {
			setGears({});
		}
		setLoading(false);
	};

	useEffect(() => { fetchGears(); }, [selectedCharId, currentJob]);
	
	const handleJobChange = async (job: JobCode) => {
		setCurrentJob(job);
		await supabase.from('characters').update({ last_job_code: job }).eq('id', selectedCharId);
	};

	return (
		<div className={`${UI_STYLE.container} ${UI_STYLE.pageWrapper}`}>
			<div className={UI_STYLE.header.stickyWrapper}>
				{char && (
					<div className={UI_STYLE.header.session}>
						<div className="flex-1 z-10 min-w-0">
							<p className={UI_STYLE.text.tiny + " opacity-60 text-white mb-1 tracking-widest uppercase"}>
								{char.world}
							</p>
							<h1 className="text-2xl sm:text-3xl font-black italic text-white leading-none truncate drop-shadow-md">
								{char.name}
							</h1>
						</div>
						<div className={UI_STYLE.header.decorationText}>{currentJob}</div>
					</div>
				)}

				<div className={UI_STYLE.header.user}>
					<div className="flex items-center gap-2">
						<label className={UI_STYLE.label}>Character</label>
						<select value={selectedCharId} onChange={(e) => setSelectedCharId(e.target.value)} className={UI_STYLE.input}>
							{initialCharacters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
						</select>
					</div>
					<JobSelector currentJob={currentJob} onJobChange={handleJobChange} />
				</div>
			</div>

			{/* 2. メインコンテンツ（カテゴリータブ + 装備リスト） */}
			<div className="mt-4">
				{/* カテゴリー切り替えタブ */}
				<div className={UI_STYLE.tab.container}>
					{(['AF', 'Relic', 'Empyrean'] as GearCategory[]).map(cat => (
						<button
							key={cat}
							onClick={() => setActiveCategory(cat)}
							className={`${UI_STYLE.tab.item} ${activeCategory === cat ? UI_STYLE.tab.active : UI_STYLE.tab.inactive
								}`}
						>
							{cat === 'Empyrean' ? 'EMPY' : cat}
						</button>
					))}
				</div>
				
				{/* 装備進捗リスト本体 */}
				<div className={UI_STYLE.gearListWrapper}>
					<div className="flex justify-between items-center mb-4 px-1">
						<h2 className={UI_STYLE.sectionTitleText}>
							{activeCategory} PROGRESS
						</h2>
						{loading && (
							<span className={UI_STYLE.text.tiny + " text-blue-500 animate-pulse font-bold"}>
								SYNCING...
							</span>
						)}
					</div>

					<GearSlotList
						gears={gears}
						loading={loading}
						onSlotClick={setEditingSlot}
					/>
				</div>
			</div>

			{/* 3. 進捗更新モーダル */}
			<GearEditModal
				isOpen={!!editingSlot}
				onClose={() => setEditingSlot(null)}
				characterId={selectedCharId}
				jobCode={currentJob}
				category={activeCategory}
				slot={editingSlot}
				onSelect={fetchGears}
			/>
		</div>
	);
}