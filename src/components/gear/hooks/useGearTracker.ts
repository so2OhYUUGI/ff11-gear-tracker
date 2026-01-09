/**
 * src/components/gear/hooks/useGearTracker.ts
 * 役割: 装備データの取得ロジック。
 * 選択中のジョブと装束カテゴリに基づいて、Supabaseからデータを抽出します。
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client'; // 正しいパス
import { JobCode } from '@/lib/constants';
import { Character, CharacterGear, GearCategory, GameAccount } from '@/lib/types';
import { getColorByIndex } from '@/lib/colors';

export const useGearTracker = (initialCharacters: Character[], allAccounts: GameAccount[], initialCharId?: string | null) => {
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

	const fetchGears = useCallback(async () => {
		if (!selectedCharId || !currentJob || !activeCategory) return;
		setLoading(true);

		const supabase = createClient();
		const { data, error } = await supabase
			.from('character_gears')
			.select(`*, items:master_items(*)`)
			.eq('character_id', selectedCharId)
			.eq('job_code', currentJob)
			.eq('category', activeCategory); // ★ ここでカテゴリを絞り込む！

		if (!error && data) {
			// slotをキーにしたオブジェクトに変換
			const gearMap = data.reduce((acc, gear) => {
				acc[gear.slot] = gear;
				return acc;
			}, {});
			setGears(gearMap);
		}
		setLoading(false);
	}, [selectedCharId, currentJob, activeCategory]); // ★ activeCategory が変わったら再実行する

	// 切り替え時にデータを取得し直す
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
		selectedCharId,
	};
};