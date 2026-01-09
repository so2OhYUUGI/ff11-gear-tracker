/**
 * @file: JobSelector.tsx
 * @role: ジョブ選択ドロップダウン。
 *        ロジックとスタイルを完全に分離。表示名は JOB_DETAILS から取得し、
 *        スタイルは UI_STYLE から一括参照します。
 */

'use client';

import { useState } from 'react';
import { UI_STYLE } from '@/lib/styles';
import { JOBS, JobCode, JOB_DETAILS } from '@/lib/constants/';

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
		/* すべて UI_STYLE を参照するように修正 */
		<div className={UI_STYLE.jobSelector.wrapper}>
			{/* トリガーボタン */}
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className={UI_STYLE.jobSelector.trigger}
			>
				<span className={UI_STYLE.jobSelector.triggerLabel}>Job : </span>
				<span className={UI_STYLE.jobSelector.triggerValue}>{JOB_DETAILS[currentJob].name_ja}</span>
				<span className={UI_STYLE.jobSelector.triggerIcon}>▼</span>
			</button>

			{isOpen && (
				<>
					{/* 透明な背景 */}
					<div
						className={UI_STYLE.jobSelector.overlay}
						onClick={() => setIsOpen(false)}
					/>

					{/* ポップアップメニュー */}
					<div
						className={UI_STYLE.jobSelector.menu}
						onClick={(e) => e.stopPropagation()}
					>
						<div className={UI_STYLE.jobSelector.menuHeader}>
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
									<span className={UI_STYLE.jobSelector.buttonDot}>●</span>
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