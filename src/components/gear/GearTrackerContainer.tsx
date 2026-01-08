'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UI_STYLE } from '@/lib/styles';
import { JobCode } from '@/lib/constants/jobs';
import JobSelector from './JobSelector';
import GearSlotList from './GearSlotList';

interface GearTrackerContainerProps {
	initialCharacters: any[];
	initialCharId?: string;
}

// 冒頭に export default があるか確認
export default function GearTrackerContainer({ initialCharacters, initialCharId }: GearTrackerContainerProps) {
	const supabase = createClient();

	// URLからのIDがあればそれを使い、なければ1人目を選択
	const [selectedCharId, setSelectedCharId] = useState(initialCharId || initialCharacters[0]?.id || '');

	// 選択中のジョブ
	const char = initialCharacters.find(c => c.id === selectedCharId);
	const [currentJob, setCurrentJob] = useState<JobCode>((char?.last_job_code as JobCode) || 'WAR');

	const [gears, setGears] = useState<Record<string, any>>({});
	const [loading, setLoading] = useState(false);

	const fetchGears = async () => {
		if (!selectedCharId) return;
		setLoading(true);

		const { data, error } = await supabase
			.from('character_gears')
			.select(`
        slot,
        items (
          name_ja,
          tier,
          category
        )
      `)
			.eq('character_id', selectedCharId)
			.eq('job_code', currentJob);

		if (!error && data) {
			const gearMap = (data as any[]).reduce((acc, gear) => {
				acc[gear.slot] = gear;
				return acc;
			}, {} as Record<string, any>);
			setGears(gearMap);
		} else {
			setGears({});
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchGears();
	}, [selectedCharId, currentJob]);

	const handleJobChange = async (job: JobCode) => {
		setCurrentJob(job);
		await supabase.from('characters').update({ last_job_code: job }).eq('id', selectedCharId);
	};

	const currentChar = initialCharacters.find(c => c.id === selectedCharId);

	return (
		<div className={UI_STYLE.container}>
			<div className={UI_STYLE.header.user + " flex-wrap gap-4"}>
				<div className="flex items-center gap-2">
					<label className={UI_STYLE.label}>Character</label>
					<select
						value={selectedCharId}
						onChange={(e) => setSelectedCharId(e.target.value)}
						className={UI_STYLE.input}
					>
						{initialCharacters.map(char => (
							<option key={char.id} value={char.id}>{char.name}</option>
						))}
					</select>
				</div>
				<JobSelector currentJob={currentJob} onJobChange={handleJobChange} />
			</div>

			{currentChar && (
				<div className={UI_STYLE.header.session + " mt-4 shadow-lg border-none"}>
					<div className="flex-1">
						<p className="text-[10px] font-black uppercase opacity-60 tracking-widest text-white">
							{currentChar.world}
						</p>
						<h1 className="text-2xl font-black italic text-white drop-shadow-md">
							{currentChar.name}
						</h1>
					</div>
					<div className="text-5xl font-black italic opacity-20 ml-4 select-none text-white">
						{currentJob}
					</div>
				</div>
			)}

			<div className="mt-8">
				{/* ここで GearSlotList を呼び出し */}
				<GearSlotList gears={gears} loading={loading} />
			</div>
		</div>
	);
}