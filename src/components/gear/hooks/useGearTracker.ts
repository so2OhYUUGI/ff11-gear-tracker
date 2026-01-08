import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { JobCode } from '@/lib/constants/jobs';
import { Character, CharacterGear, GearCategory } from '@/lib/types';
import { formatGearMap } from '@/lib/utils';
import { getSystemColor } from '@/lib/colors';

export function useGearTracker(initialCharacters: Character[], initialCharId?: string | null) {
	const supabase = createClient();
	const [selectedCharId] = useState(initialCharId || initialCharacters[0]?.id || '');

	// キャラクター情報を取得（アカウント情報を含む）
	const char = initialCharacters.find(c => c.id === selectedCharId);

	// アカウント色の抽出ロジック
	const accountData = Array.isArray(char?.game_accounts) ? char?.game_accounts[0] : char?.game_accounts;
	const accountColor = accountData?.color_code || getSystemColor(accountData?.id || '');

	const [currentJob, setCurrentJob] = useState<JobCode>((char?.last_job_code as JobCode) || 'WAR');
	const [activeCategory, setActiveCategory] = useState<GearCategory>('AF');
	const [gears, setGears] = useState<Record<string, CharacterGear>>({});
	const [loading, setLoading] = useState(false);
	const [editingSlot, setEditingSlot] = useState<{ id: string, name: string } | null>(null);

	const fetchGears = async () => {
		if (!selectedCharId) return;
		setLoading(true);
		const { data } = await supabase
			.from('character_gears')
			.select(`slot, items ( id, name_ja, tier, category )`)
			.eq('character_id', selectedCharId)
			.eq('job_code', currentJob);

		setGears(data ? formatGearMap(data as any) : {});
		setLoading(false);
	};

	useEffect(() => { fetchGears(); }, [selectedCharId, currentJob]);

	const handleJobChange = async (job: JobCode) => {
		setCurrentJob(job);
		await supabase.from('characters').update({ last_job_code: job }).eq('id', selectedCharId);
	};

	return {
		char,
		accountColor, // 色を返す
		currentJob,
		activeCategory,
		setActiveCategory,
		gears,
		loading,
		editingSlot,
		setEditingSlot,
		handleJobChange,
		refreshGears: fetchGears,
		selectedCharId
	};
}