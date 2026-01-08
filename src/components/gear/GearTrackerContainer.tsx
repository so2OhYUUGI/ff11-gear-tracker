'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UI_STYLE } from '@/lib/styles';
import { JobCode } from '@/lib/constants/jobs';
import JobSelector from './JobSelector';
import GearSlotList from './GearSlotList';

export default function GearTrackerContainer({ initialCharacters }: { initialCharacters: any[] }) {
	const supabase = createClient();
	const [selectedCharId, setSelectedCharId] = useState(initialCharacters[0]?.id || '');
	const [currentJob, setCurrentJob] = useState<JobCode>('WAR');
	const [gears, setGears] = useState<Record<string, any>>({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchGears() {
			if (!selectedCharId) return;
			setLoading(true);
			const { data } = await supabase
				.from('character_gears')
				.select(`slot, items ( name_ja, tier, category )`)
				.eq('character_id', selectedCharId)
				.eq('job_code', currentJob);

			if (data) {
				const gearMap = (data as any[]).reduce((acc, gear) => {
					acc[gear.slot] = gear;
					return acc;
				}, {} as Record<string, any>);
				setGears(gearMap);
			} else {
				setGears({});
			}
			setLoading(false);
		}
		fetchGears();
	}, [selectedCharId, currentJob, supabase]);

	const currentChar = initialCharacters.find(c => c.id === selectedCharId);

	return (
		<div className={UI_STYLE.container}>
			{/* 操作エリア */}
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
				<JobSelector currentJob={currentJob} onJobChange={setCurrentJob} />
			</div>

			{/* キャラクター名表示帯 */}
			<div className={UI_STYLE.header.session + " mt-4"}>
				<div className="flex-1">
					<p className={UI_STYLE.text.tiny + " opacity-70"}>{currentChar?.world}</p>
					<h1 className="text-xl font-black italic">{currentChar?.name}</h1>
				</div>
				<div className="text-4xl font-black italic opacity-20">{currentJob}</div>
			</div>

			{/* 装備リスト */}
			<GearSlotList gears={gears} loading={loading} />
		</div>
	);
}