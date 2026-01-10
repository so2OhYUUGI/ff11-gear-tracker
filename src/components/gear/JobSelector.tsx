
/**
 * @file: JobSelector.tsx
 * @role: ジョブ選択ドロップダウン。
 *        ロジックとスタイルを完全に分離。表示名は JOB_DETAILS から取得します。
 */

'use client';

import { useState } from 'react';
import { JOBS, JOB_DETAILS } from '@/lib/constants/';
import { JobCode } from '@/lib/types';

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

	const getButtonClasses = (job: JobCode) => {
		const isActive = currentJob === job;
		return `job-selector__button ${isActive ? 'job-selector__button--active' : 'job-selector__button--inactive'}`;
	};

	return (
		<div className="job-selector">
			{/* トリガーボタン */}
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="job-selector__trigger"
			>
				<span className="job-selector__trigger-label">Job : </span>
				<span className="job-selector__trigger-value">{JOB_DETAILS[currentJob].name_ja}</span>
				<span className="job-selector__trigger-icon">▼</span>
			</button>

			{isOpen && (
				<>
					{/* 透明な背景 */}
					<div
						className="job-selector__overlay"
						onClick={() => setIsOpen(false)}
					/>

					{/* ポップアップメニュー */}
					<div
						className="job-selector__menu"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="job-selector__menu-header">
							Select Job
						</div>

						<div className="job-selector__grid">
							{JOBS.map((job) => (
								<button
									key={job}
									onClick={() => handleSelect(job)}
									className={getButtonClasses(job)}
								>
									<span className="job-selector__button-dot">●</span>
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
