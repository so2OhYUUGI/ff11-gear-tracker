
// @file: GearTrackerContainer.tsx
// @role: 装備管理画面のメインレイアウトコンテナ。
//        Stickyヘッダー、ジョブ選択ポップアップ、カテゴリタブ、装備リストの各コンポーネントを統合する。

'use client';

import Link from 'next/link';
import { GameAccount, Character } from '@/lib/types';
import { useGearTracker } from './hooks/useGearTracker';
import JobSelector from './JobSelector';
import GearSlotList from './GearSlotList';
import GearEditModal from './GearEditModal';
import GearCategoryTabs from './GearCategoryTabs';

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
		<div className="page-container page-wrapper">
			{/* ヘッダーセクション */}
			<div className="gear-tracker__header">
				<div className="gear-tracker__session-card" style={{ backgroundColor: accountColor }}>
          <div className="gear-tracker__session-card-overlay"></div>
					<Link href="/" className="gear-tracker__back-button" title="戻る">←</Link>
					<div className="flex-1 z-10 min-w-0">
						<p className="gear-tracker__world-name">{char.world}</p>
						<h1 className="gear-tracker__char-name">{char.name}</h1>
					</div>
					<div className="gear-tracker__job-decoration">{currentJob}</div>
				</div>

				<div className="gear-tracker__job-selector-bar">
					<span className="form-label ml-2">Job Change</span>
					<JobSelector currentJob={currentJob} onJobChange={handleJobChange} />
				</div>

        <GearCategoryTabs activeCategory={activeCategory} onSelect={setActiveCategory} />
			</div>

			{/* リストセクション */}
			<div className="gear-tracker__list-section">
				<div className="gear-tracker__list-wrapper">
					<div className="gear-tracker__list-header">
						<h2 className="section-title-text">{activeCategory} PROGRESS</h2>
						{loading && <span className="gear-tracker__syncing-text">SYNCING...</span>}
					</div>
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
