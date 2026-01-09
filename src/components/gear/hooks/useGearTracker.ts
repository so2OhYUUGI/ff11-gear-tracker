/**
 * @file: useGearTracker.ts
 * @role: 装備データの取得ロジック。
 *        選択中のジョブと装束カテゴリに基づいて、Supabaseからデータを抽出します。
 *        また、キャラクターに紐づくアカウント情報からUIの表示カラーを管理します。
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { JobCode } from '@/lib/constants';
import { Character, CharacterGear, GearCategory, GameAccount } from '@/lib/types';
import { getColorByIndex } from '@/lib/colors';

export const useGearTracker = (initialCharacters: Character[], allAccounts: GameAccount[], initialCharId?: string | null) => {
	const supabase = createClient();

	// キャラクター選択の状態管理
	const [selectedCharId] = useState(initialCharId || initialCharacters[0]?.id || '');
	const char = initialCharacters.find(c => c.id === selectedCharId);

	// アカウントカラーの算出（元のロジックを維持）
	const accountData = Array.isArray(char?.game_accounts) ? char?.game_accounts[0] : char?.game_accounts;
	const accountIndex = allAccounts.findIndex(acc => acc.id === accountData?.id);
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
	 * ※ .select() 内の master_items を 実態である items に修正しました。
	 */
	const fetchGears = useCallback(async () => {
		if (!selectedCharId || !currentJob || !activeCategory) return;
		setLoading(true);

		const { data, error } = await supabase
			.from('character_gears')
			.select(`
				*,
				items:items(*)
			`) // ★ 修正: master_items ではなく items を指定 (400エラー対策)
			.eq('character_id', selectedCharId)
			.eq('job_code', currentJob)
			.eq('category', activeCategory);

		if (error) {
			console.error('Fetch Error:', error.message, error.details);
		}

		if (!error && data) {
			// slotをキーにしたオブジェクトに変換
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
	 * ステートの更新と、DB側の最終ジョブ情報の保存を行います。
	 */
	const handleJobChange = async (job: JobCode) => {
		setCurrentJob(job);
		// DB側の最終ジョブも非同期で更新（UI更新を優先）
		supabase.from('characters')
			.update({ last_job_code: job })
			.eq('id', selectedCharId)
			.then(({ error }) => {
				if (error) console.error('Error updating last_job:', error);
			});
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