import { Card } from "@/components/ui/card";
import { UI_STYLE } from "@/lib/styles";
import { GearPlannerProps, GearSlot, GearType, GearStage } from "@/types/gear";

const SLOTS: GearSlot[] = ["Head", "Body", "Hands", "Legs", "Feet"];
const TYPES: GearType[] = ["AF", "Relic", "Empy"];
const STAGES: GearStage[] = ["119", "+1", "+2", "+3"];

export function GearPlanner({ job, plan, onPlanChange }: GearPlannerProps) {
	return (
		<div className={UI_STYLE.section}>
			{SLOTS.map((slot) => (
				<Card
					key={slot}
					className={`${UI_STYLE.card} p-4 ${UI_STYLE.cardInactive}`}
				>
					<div className="flex justify-between items-center mb-3">
						<span className={UI_STYLE.cardTitle}>{slot}</span>
						<span className={UI_STYLE.text.tiny + " text-primary"}>
							{job} {plan[slot].type}{plan[slot].stage}
						</span>
					</div>

					{/* 装束タイプ選択 */}
					<div className="grid grid-cols-3 gap-2 mb-3">
						{TYPES.map((type) => (
							<button
								key={type}
								onClick={() => onPlanChange(slot, { ...plan[slot], type })}
								className={`
									${UI_STYLE.button.tab} border rounded transition-all
									${plan[slot].type === type
										? "bg-primary text-primary-foreground border-primary"
										: "bg-muted text-muted-foreground border-border"}
								`}
							>
								{type}
							</button>
						))}
					</div>

					{/* 強化段階選択 */}
					<div className="grid grid-cols-4 gap-2">
						{STAGES.map((stage) => (
							<button
								key={stage}
								onClick={() => onPlanChange(slot, { ...plan[slot], stage })}
								className={`
									${UI_STYLE.text.mono} py-1 rounded border transition-all
									${plan[slot].stage === stage
										? "bg-foreground text-background border-foreground font-bold"
										: "bg-muted/50 text-muted-foreground border-border/50"}
								`}
							>
								{stage}
							</button>
						))}
					</div>
				</Card>
			))}
		</div>
	);
}