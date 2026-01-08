'use client';

import { UI_STYLE } from '@/lib/styles';
import { JOBS, JobCode } from '@/lib/constants/jobs';

interface JobSelectorProps {
	currentJob: JobCode;
	onJobChange: (job: JobCode) => void;
}

export default function JobSelector({ currentJob, onJobChange }: JobSelectorProps) {
	return (
		<div className="flex items-center gap-2">
			<label className={UI_STYLE.label}>Job Select</label>
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