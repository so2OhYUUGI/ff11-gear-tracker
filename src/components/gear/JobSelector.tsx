/**
 * @file: JobSelector.tsx
 * @role: ジョブ選択ドロップダウン。
 *        トリガー（ボタン）はクールな JobCode (WAR等) を、
 *        リスト内は分かりやすさを重視して JOB_DETAILS から日本語名を表示します。
 */

'use client';

import { useState } from 'react';
import { UI_STYLE } from '@/lib/styles';
import { JOBS, JobCode, JOB_DETAILS } from '@/lib/constants/'; // JOB_DETAILS を追加

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
		<div className="inline-block">
			{/* トリガーボタン: 英語3文字表記を維持 */}
			<button
				onClick={() => setIsOpen(true)}
				className={UI_STYLE.jobSelector.trigger}
			>
				<span className={UI_STYLE.jobSelector.triggerLabel}>Job : </span>
				<span className={UI_STYLE.jobSelector.triggerValue}>{JOB_DETAILS[currentJob].name_ja}</span>
				<span className="text-slate-500 text-[8px] ml-1">▼</span>
			</button>

			{isOpen && (
				<>
					<div
						className={UI_STYLE.jobSelector.overlay}
						onClick={() => setIsOpen(false)}
					/>

					<div className={UI_STYLE.jobSelector.menu}>
						<div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-2 border-b border-slate-800 pb-1 text-left">
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
									{/* ★ 定数から日本語名を表示 */}
									{JOB_DETAILS[job].name_ja}
								</button>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
}