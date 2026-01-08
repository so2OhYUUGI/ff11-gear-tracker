// @file: useGearTracker.ts
// @role: 装備管理のビジネスロジックを担当するカスタムフック。
//        Supabaseとの通信、ジョブ・カテゴリの状態管理、表示用データへの整形を行う。

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { JobCode } from '@/lib/constants';
import { Character, CharacterGear, GearCategory, GameAccount } from '@/lib/types';
import { formatGearMap } from '@/lib/utils';
import { getColorByIndex } from '@/lib/colors';

export function useGearTracker(
	initialCharacters: Character[],
	allAccounts: GameAccount[],
	initialCharId?: string | null
) {
	const supabase = createClient();
	const [selectedCharId] = useState(initialCharId || initialCharacters[0]?.id || '');
	const char = initialCharacters.find(c => c.id === selectedCharId);

	const accountData = Array.isArray(char?.game_accounts) ? char?.game_accounts[0] : char?.game_accounts;
	const accountIndex = allAccounts.findIndex(acc => acc.id === accountData?.id);
	const accountColor = accountData?.color_code || getColorByIndex(accountIndex >= 0 ? accountIndex : 999);

	const [currentJob, setCurrentJob] = useState<JobCode>((char?.last_job_code as JobCode) || 'WAR');
	const [activeCategory, setActiveCategory] = useState<GearCategory>('AF');
	const [gears, setGears] = useState<Record<string, CharacterGear>>({});
	const [loading, setLoading] = useState(false);
	const [editingSlot, setEditingSlot] = useState<{ id: string, name: string } | null>(null);

	// fetchGears を useCallback でラップして安定化
	const fetchGears = useCallback(async () => {
		if (!selectedCharId) return;

		setLoading(true);
		try {
			const { data, error } = await supabase
				.from('character_gears')
				.select(`slot, items ( id, name_ja, tier, category )`)
				.eq('character_id', selectedCharId)
				.eq('job_code', currentJob);

			if (error) throw error;
			setGears(data ? formatGearMap(data as any) : {});
		} catch (err) {
			console.error('Error fetching gears:', err);
		} finally {
			setLoading(false);
		}
	}, [supabase, selectedCharId, currentJob]);

	// ジョブやキャラが変わった時に再取得
	useEffect(() => {
		fetchGears();
	}, [fetchGears]);

	const handleJobChange = async (job: JobCode) => {
		setCurrentJob(job);
		// DB側の最終ジョブも非同期で更新（待たずにUI更新を優先）
		supabase.from('characters').update({ last_job_code: job }).eq('id', selectedCharId).then();
	};

	return {
		char,
		accountColor,
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