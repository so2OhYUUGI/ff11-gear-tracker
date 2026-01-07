import { Card } from "@/components/ui/card";
import { UI_STYLE } from "@/lib/styles";
import { FullGearPlan, JobType } from "@/types/gear";
import { Zap, Shield, Target } from "lucide-react";

export function StatsSummary({ plan, job }: { plan: FullGearPlan; job: JobType }) {
	const calculateTotal = (statName: string) => {
		const stageMultiplier = (stage: string) => (stage === "+3" ? 50 : stage === "+2" ? 30 : 15);
		return Object.values(plan).reduce((sum, p) => sum + stageMultiplier(p.stage), 0);
	};

	const stats = [
		{ label: "命中", value: calculateTotal("Acc"), icon: <Target className="w-4 h-4 text-primary" /> },
		{ label: "攻撃", value: calculateTotal("Atk"), icon: <Zap className="w-4 h-4 text-primary" /> },
		{ label: "被ダメ", value: "-25%", icon: <Shield className="w-4 h-4 text-primary" /> },
	];

	return (
		<Card className={`${UI_STYLE.card} p-4 bg-muted/30 border-primary/20`}>
			<div className={UI_STYLE.sectionTitleText + " mb-3"}>Planned Total Stats</div>
			<div className="grid grid-cols-3 gap-2">
				{stats.map((s) => (
					<div key={s.label} className="flex flex-col items-center p-2 rounded-lg bg-background/50 border border-border/40">
						<div className="mb-1">{s.icon}</div>
						<div className={UI_STYLE.quantity}>{s.value}</div>
						<div className={UI_STYLE.text.label}>{s.label}</div>
					</div>
				))}
			</div>
		</Card>
	);
}