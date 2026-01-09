// @file: GearTrackerContainer.tsx
// @role: 装備管理画面のメインレイアウトコンテナ。
//        Stickyヘッダー、ジョブ選択ポップアップ、カテゴリタブ、装備リストの各コンポーネントを統合する。

'use client';

import Link from 'next/link';
import { UI_STYLE } from '@/lib/styles';
import { GameAccount, Character } from '@/lib/types';
import { GEAR_CATEGORIES } from '@/lib/constants';
import { useGearTracker } from './hooks/useGearTracker';
import JobSelector from './JobSelector';
import GearSlotList from './GearSlotList';
import GearEditModal from './GearEditModal';

export default function GearTrackerContainer({
	initialCharacters,
	allAccounts,
	initialCharId
}: {
	initialCharacters: Character[],
	allAccounts: GameAccount[],
	initialCharId?: string | null
}) {
	const {
		char, accountColor, currentJob, activeCategory, setActiveCategory,
		gears, loading, editingSlot, setEditingSlot,
		handleJobChange, refreshGears, selectedCharId
	} = useGearTracker(initialCharacters, allAccounts, initialCharId);

	if (!char) return null;

	return (
		<div className={`${UI_STYLE.container} ${UI_STYLE.pageWrapper}`}>
			{/* ヘッダーセクション */}
			<div className={UI_STYLE.header.stickyWrapper}>
				<div className={UI_STYLE.header.session} style={{ backgroundColor: accountColor }}>
					<Link href="/" className={UI_STYLE.header.backButton} title="戻る">←</Link>
					<div className="flex-1 z-10 min-w-0">
						<p className={UI_STYLE.text.tiny + " opacity-70 text-white mb-1 tracking-widest uppercase"}>{char.world}</p>
						<h1 className="text-2xl sm:text-3xl font-black italic text-white leading-none truncate drop-shadow-md">{char.name}</h1>
					</div>
					<div className={UI_STYLE.header.decorationText}>{currentJob}</div>
				</div>

				<div className={UI_STYLE.header.user}>
					<span className={UI_STYLE.label + " ml-2"}>Job Change</span>
					<JobSelector currentJob={currentJob} onJobChange={handleJobChange} />
				</div>

				<div className={UI_STYLE.tab.container}>
					{GEAR_CATEGORIES.map(cat => (
						<button
							key={cat}
							onClick={() => setActiveCategory(cat)}
							className={activeCategory === cat ? `${UI_STYLE.tab.item} ${UI_STYLE.tab.active}` : `${UI_STYLE.tab.item} ${UI_STYLE.tab.inactive}`}
						>
							{cat === 'Empyrean' ? 'EMPY' : cat}
						</button>
					))}
				</div>
			</div>

			{/* リストセクション */}
			<div className={UI_STYLE.gearListSection}>
				<div className={`${UI_STYLE.gearListWrapper} border-t-0 rounded-t-none`}>
					<div className="flex justify-between items-center mb-4 px-1">
						<h2 className={UI_STYLE.sectionTitleText}>{activeCategory} PROGRESS</h2>
						{loading && <span className={UI_STYLE.text.tiny + " text-blue-500 font-bold"}>SYNCING...</span>}
					</div>
					{/* 修正ポイント: key を追加することで、カテゴリやジョブの切り替え時にリストを確実に再描画する */}
					<GearSlotList
						key={`${currentJob}-${activeCategory}`}
						gears={gears}
						category={activeCategory}
						loading={loading}
						onSlotClick={setEditingSlot}
					/>
				</div>
			</div>

			{/* 編集モーダル */}
			<GearEditModal
				isOpen={!!editingSlot}
				onClose={() => setEditingSlot(null)}
				characterId={selectedCharId}
				jobCode={currentJob}
				category={activeCategory}
				slot={editingSlot}
				onSelect={refreshGears}
			/>
		</div>
	);
}