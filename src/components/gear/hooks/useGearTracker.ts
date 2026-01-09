/**
 * @file: useGearTracker.ts
 * @role: 装備データの取得ロジック。
 *        選択中のジョブと装束カテゴリに基づいて、Supabaseからデータを抽出します。
 *        また、キャラクターに紐づくアカウント情報からUIの表示カラーを管理します。
 */
/**
 * src/components/gear/hooks/useGearTracker.ts
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { JobCode, Character, CharacterGear, GearCategory, GameAccount } from '@/lib/types';
import { getColorByIndex } from '@/lib/colors';

// 修正: 引数にデフォルト値 = [] を設定して安全化
export const useGearTracker = (
	initialCharacters: Character[] = [],
	allAccounts: GameAccount[] = [],
	initialCharId?: string | null
) => {
	const supabase = createClient();

	// キャラクター選択の状態管理
	// 修正: initialCharacters が空の場合も考慮
	const [selectedCharId] = useState(initialCharId || initialCharacters[0]?.id || '');

	// 修正: オプショナルチェーン (?.) を使用して安全にアクセス
	const char = initialCharacters?.find(c => c.id === selectedCharId);

	// アカウントカラーの算出
	const accountData = Array.isArray(char?.game_accounts) ? char?.game_accounts[0] : char?.game_accounts;
	const accountIndex = allAccounts?.findIndex(acc => acc.id === accountData?.id) ?? -1;
	const accountColor = accountData?.color_code || getColorByIndex(accountIndex >= 0 ? accountIndex : 999);

	// ジョブとカテゴリの状態管理
	const [currentJob, setCurrentJob] = useState<JobCode>((char?.last_job_code as JobCode) || 'WAR');
	const [activeCategory, setActiveCategory] = useState<GearCategory>('AF');

	// 装備データとローディング状態
	const [gears, setGears] = useState<Record<string, CharacterGear>>({});
	const [loading, setLoading] = useState(false);
	const [editingSlot, setEditingSlot] = useState<{ id: string, name: string } | null>(null);

	/**
	 * 装備データをフェッチする関数
	 */
	const fetchGears = useCallback(async () => {
		if (!selectedCharId || !currentJob || !activeCategory) return;
		setLoading(true);

		const { data, error } = await supabase
			.from('character_gears')
			.select(`
				*,
				items:items(*)
			`)
			.eq('character_id', selectedCharId)
			.eq('job_code', currentJob)
			.eq('category', activeCategory);

		if (error) {
			console.error('Fetch Error:', error.message, error.details);
		}

		if (!error && data) {
			const gearMap = data.reduce((acc: Record<string, CharacterGear>, gear: any) => {
				acc[gear.slot] = gear;
				return acc;
			}, {});
			setGears(gearMap);
		}
		setLoading(false);
	}, [selectedCharId, currentJob, activeCategory, supabase]);

	// ジョブ、カテゴリ、またはキャラクターが変わった時にデータを再取得
	useEffect(() => {
		fetchGears();
	}, [fetchGears]);

	/**
	 * ジョブ変更時の処理
	 */
	const handleJobChange = async (job: JobCode) => {
		setCurrentJob(job);
		if (selectedCharId) {
			supabase.from('characters')
				.update({ last_job_code: job })
				.eq('id', selectedCharId)
				.then(({ error }) => {
					if (error) console.error('Error updating last_job:', error);
				});
		}
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