/**
 * @file: GearEditModal.tsx
 * @role: 装備品選択・更新用のモーダルコンポーネント。
 *        特定の部位（Slot）に対し、ジョブおよび装束カテゴリ（AF/RELIC/EMPY）に適合する
 *        アイテムを検索し、進捗データを `character_gears` テーブルへ永続化します。
 */

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UI_STYLE } from '@/lib/styles';
import { GearCategory, GearItem } from '@/lib/types';
import { JOB_MIN_TIER_RULES } from '@/lib/constants/';

interface GearEditModalProps {
	isOpen: boolean;
	onClose: () => void;
	characterId: string;
	jobCode: string;
	category: GearCategory;
	slot: { id: string, name: string } | null;
	onSelect: () => void;
}

export default function GearEditModal({
	isOpen, onClose, characterId, jobCode, category, slot, onSelect
}: GearEditModalProps) {
	const supabase = createClient();
	const [items, setItems] = useState<GearItem[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchTiers() {
			if (!isOpen || !slot) return;
			setLoading(true);

			const { data, error } = await supabase
				.from('items') // ※DB上のテーブル名に合わせて適宜 master_items 等に変更してください
				.select('*')
				.eq('slot', slot.id)
				.eq('category', category)
				.contains('jobs', [jobCode])
				.order('tier', { ascending: true });

			if (!error && data) {
				let filtered = data as GearItem[];

				const minTier = JOB_MIN_TIER_RULES[jobCode]?.[category];
				if (minTier !== undefined) {
					filtered = filtered.filter(item => item.tier >= minTier);
				}

				setItems(filtered);
			}
			setLoading(false);
		}
		fetchTiers();
	}, [isOpen, slot, jobCode, category, supabase]);

	// アイテム選択時の保存処理
	const handleSelectItem = async (itemId: string | null) => {
		if (!slot) return;

		// 修正ポイント: upsert のペイロードに category を含め、onConflict 条件も更新する
		const { error } = await supabase
			.from('character_gears')
			.upsert({
				character_id: characterId,
				job_code: jobCode,
				category: category, // ★これを追加
				slot: slot.id,
				item_id: itemId,
				updated_at: new Date().toISOString()
			}, {
				// ★一意制約に合わせて category を含める
				onConflict: 'character_id,job_code,category,slot'
			});

		if (!error) {
			onSelect(); // 画面のリフレッシュ（refreshGears）を実行
			onClose();
		} else {
			console.error('Error saving gear:', error);
			console.error('Message:', error.message);
			alert('保存に失敗しました。');
		}
	};

	if (!isOpen || !slot) return null;

	return (
		<div className={UI_STYLE.modal.overlay} onClick={onClose}>
			<div className={UI_STYLE.modal.content} onClick={(e) => e.stopPropagation()}>
				<div className={UI_STYLE.modal.header}>
					<div>
						<h3 className={UI_STYLE.modal.title}>{category} {slot.name} 進捗更新</h3>
						<p className={UI_STYLE.modal.subtitle}>Job: {jobCode}</p>
					</div>
					<button onClick={onClose} className={UI_STYLE.modal.close}>✕</button>
				</div>

				<div className={UI_STYLE.modal.body}>
					<button onClick={() => handleSelectItem(null)} className={UI_STYLE.modal.removeBtn}>
						❌ 未取得 / 装備なし
					</button>

					{loading ? (
						<div className={`${UI_STYLE.modal.empty} animate-pulse`}>Loading Tiers...</div>
					) : items.length > 0 ? (
						<div className="space-y-2">
							{items.map(item => (
								<button key={item.id} onClick={() => handleSelectItem(item.id)} className={UI_STYLE.modal.itemBtn}>
									<div className="flex flex-col items-start">
										<span className={UI_STYLE.modal.itemLabel}>{item.name_ja}</span>
										<span className={UI_STYLE.badge.secondary}>Tier: {item.tier}</span>
									</div>
									<div className={UI_STYLE.modal.actionText}>UPDATE ➔</div>
								</button>
							))}
						</div>
					) : (
						<div className={UI_STYLE.modal.empty}>マスタデータ未登録 ({category})</div>
					)}
				</div>

				<footer className={UI_STYLE.modal.footer}>
					※ジョブおよびカテゴリーに適合する装束の強化段階が表示されています。
				</footer>
			</div>
		</div>
	);
}