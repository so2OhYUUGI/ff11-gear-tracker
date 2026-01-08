// src/components/gear/hooks/useGearTracker.ts

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { JobCode } from '@/lib/constants'; // パス変更
import { Character, CharacterGear, GearCategory, GameAccount } from '@/lib/types';
import { formatGearMap } from '@/lib/utils';
import { getColorByIndex } from '@/lib/colors';

// allAccounts を受け取るように引数を追加
export function useGearTracker(
	initialCharacters: Character[],
	allAccounts: GameAccount[],
	initialCharId?: string | null
) {
	const supabase = createClient();
	const [selectedCharId] = useState(initialCharId || initialCharacters[0]?.id || '');
	const char = initialCharacters.find(c => c.id === selectedCharId);

	// --- 色の同期ロジック（ポータルと統一） ---
	const accountData = Array.isArray(char?.game_accounts) ? char?.game_accounts[0] : char?.game_accounts;
	const accountIndex = allAccounts.findIndex(acc => acc.id === accountData?.id);
	const accountColor = accountData?.color_code || getColorByIndex(accountIndex >= 0 ? accountIndex : 999);
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