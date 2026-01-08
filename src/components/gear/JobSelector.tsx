'use client';

import { UI_STYLE } from '@/lib/styles';
import { JOBS, JobCode } from '@/lib/constants/jobs';

interface JobSelectorProps {
	currentJob: string;
	onJobChange: (job: JobCode) => void;
}

export default function JobSelector({ currentJob, onJobChange }: JobSelectorProps) {
	return (
		<div className="flex items-center gap-3">
			<label className={UI_STYLE.label}>Current Job</label>
			<select
				value={currentJob}
				onChange={(e) => onJobChange(e.target.value as JobCode)}
				className={UI_STYLE.input}
			>
				{JOBS.map(job => (
					<option key={job} value={job}>{job}</option>
				))}
			</select>
		</div>
	);
}