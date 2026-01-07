import { UI_STYLE } from "@/lib/styles";
import { JobType, JobSelectorProps } from "@/types/gear";

const JOBS: JobType[] = ["WAR", "MNK", "WHM", "BLM", "RDM", "THF", "PLD", "DRK", "BST", "BRD", "RNG", "SAM", "NIN", "DRG", "SMN", "BLU", "COR", "PUP", "DNC", "SCH", "GEO", "RUN"];

export function JobSelector({ selectedJob, onSelect }: JobSelectorProps) {
	return (
		<div className="flex flex-wrap gap-1.5 py-2 justify-center">
			{JOBS.map((job) => (
				<button
					key={job}
					onClick={() => onSelect(job)}
					className={`
						w-10 h-10 flex items-center justify-center rounded-md border transition-all
						${UI_STYLE.text.tiny} font-black
						${selectedJob === job
							? "bg-primary text-primary-foreground border-primary shadow-sm scale-110 z-10"
							: "bg-card text-muted-foreground border-border hover:border-primary/50"}
					`}
				>
					{job}
				</button>
			))}
		</div>
	);
}