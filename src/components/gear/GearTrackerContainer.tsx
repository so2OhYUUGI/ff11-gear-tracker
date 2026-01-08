'use client';

import Link from 'next/link';
import { UI_STYLE } from '@/lib/styles';
import { GearCategory, Character } from '@/lib/types';
import { useGearTracker } from './hooks/useGearTracker';
import JobSelector from './JobSelector';
import GearSlotList from './GearSlotList';
import GearEditModal from './GearEditModal';

export default function GearTrackerContainer({ initialCharacters, initialCharId }: { initialCharacters: Character[], initialCharId?: string | null }) {
	const {
		char, accountColor, currentJob, activeCategory, setActiveCategory,
		gears, loading, editingSlot, setEditingSlot,
		handleJobChange, refreshGears, selectedCharId
	} = useGearTracker(initialCharacters, initialCharId);

	if (!char) return null;

	return (
		<div className={`${UI_STYLE.container} ${UI_STYLE.pageWrapper}`}>

			{/* 1. 固定ヘッダーセクション */}
			<div className={UI_STYLE.header.stickyWrapper}>
				<div
					className={UI_STYLE.header.session}
					style={{ backgroundColor: accountColor }} // ここでアカウント色を動的に適用！
				>
					{/* ポータル（キャラ選択）に戻るボタン */}
					<Link
						href="/"
						className={UI_STYLE.header.backButton + " mr-4"}
						title="キャラクター選択に戻る"
					>
						←
					</Link>

					<div className="flex-1 z-10 min-w-0">
						<p className={UI_STYLE.text.tiny + " opacity-70 text-white mb-1 tracking-widest uppercase"}>
							{char.world}
						</p>
						<h1 className="text-2xl sm:text-3xl font-black italic text-white leading-none truncate drop-shadow-md">
							{char.name}
						</h1>
					</div>
					<div className={UI_STYLE.header.decorationText}>{currentJob}</div>
				</div>

				<div className={UI_STYLE.header.user}>
					<span className={UI_STYLE.label + " ml-2"}>Job Change</span>
					<JobSelector currentJob={currentJob} onJobChange={handleJobChange} />
				</div>

				<div className={UI_STYLE.tab.container + " mt-4"}>
					{(['AF', 'Relic', 'Empyrean'] as GearCategory[]).map(cat => (
						<button
							key={cat}
							onClick={() => setActiveCategory(cat)}
							className={`${UI_STYLE.tab.item} ${activeCategory === cat ? UI_STYLE.tab.active : UI_STYLE.tab.inactive
								}`}
						>
							{cat === 'Empyrean' ? 'EMPY' : cat}
						</button>
					))}
				</div>
			</div>

			{/* 2. メインコンテンツ */}
			<div className={UI_STYLE.gearListSection}>
				<div className={UI_STYLE.gearListWrapper + " rounded-t-none border-t-0"}>
					<div className="flex justify-between items-center mb-4 px-1">
						<h2 className={UI_STYLE.sectionTitleText}>
							{activeCategory} PROGRESS
						</h2>
						{loading && (
							<span className={UI_STYLE.text.tiny + " text-blue-500 animate-pulse font-bold"}>
								SYNCING...
							</span>
						)}
					</div>

					<GearSlotList
						gears={gears}
						loading={loading}
						onSlotClick={setEditingSlot}
					/>
				</div>
			</div>

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