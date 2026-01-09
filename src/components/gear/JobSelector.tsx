/**
 * @file: JobSelector.tsx
 * @role: ジョブ選択ドロップダウン。
 *        ボタンの左下角にメニューを整列させ、余計な視覚効果を排除しました。
 */

'use client';

import { useState } from 'react';
import { UI_STYLE } from '@/lib/styles';
import { JOBS, JobCode } from '@/lib/constants/';

interface JobSelectorProps {
	currentJob: JobCode;
	onJobChange: (job: JobCode) => void;
}

export default function JobSelector({ currentJob, onJobChange }: JobSelectorProps) {
	const [isOpen, setIsOpen] = useState(false);

	const handleSelect = (job: JobCode) => {
		onJobChange(job);
		setIsOpen(false);
	};

	return (
		/* この relative が基準となり、menu がボタンの真下に来ます */
		<div className=" inline-block">
			{/* トリガーボタン */}
			<button
				onClick={() => setIsOpen(true)}
				className={UI_STYLE.jobSelector.trigger}
			>
				<span className={UI_STYLE.jobSelector.triggerLabel}>Job</span>
				<span className={UI_STYLE.jobSelector.triggerValue}>{currentJob}</span>
				<span className="text-slate-500 text-[8px] ml-1">▼</span>
			</button>

			{/* ジョブ選択ポップアップロジック */}
			{isOpen && (
				<>
					{/* 1. 透明な背景（どこをクリックしても閉じるための層） */}
					<div
						className={UI_STYLE.jobSelector.overlay}
						onClick={() => setIsOpen(false)}
					/>

					{/* 2. メニュー本体（ボタンの直下に配置） */}
					<div className={UI_STYLE.jobSelector.menu}>
						<div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-2 border-b border-slate-800 pb-1">
							Select Job
						</div>

						<div className={UI_STYLE.jobSelector.grid}>
							{JOBS.map((job) => (
								<button
									key={job}
									onClick={() => handleSelect(job)}
									className={`
                    ${UI_STYLE.jobSelector.button}
                    ${currentJob === job ? UI_STYLE.jobSelector.active : UI_STYLE.jobSelector.inactive}
                  `}
								>
									<span className="mr-2 opacity-30 text-[8px]">●</span>
									{job}
								</button>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
}