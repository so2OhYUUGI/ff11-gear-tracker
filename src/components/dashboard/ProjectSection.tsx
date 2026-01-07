import { Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProjectSection({ userTargets, getAccountTotal }: any) {
	return (
		<section className="space-y-3">
			<div className="flex items-center gap-2 text-blue-600 px-1">
				<Layers className="w-4 h-4" />
				<h2 className="text-xs font-bold uppercase tracking-tight">Active Projects</h2>
			</div>
			{userTargets.map((target: any) => (
				<Card key={target.id} className="border-2 border-blue-100 dark:border-blue-900 shadow-sm overflow-hidden">
					<CardHeader className="bg-blue-50/50 dark:bg-blue-900/10 py-2 border-b border-blue-100 dark:border-blue-900">
						<div className="flex justify-between items-center">
							<span className="text-[10px] font-black uppercase tracking-tighter">{target.recipe_groups?.name}</span>
							<Badge className="text-[9px] h-4 px-1">{target.status}</Badge>
						</div>
					</CardHeader>
					<CardContent className="p-3 space-y-3">
						{target.recipe_groups?.recipe_requirements?.map((req: any) => {
							const total = getAccountTotal(req.item_id);
							const percent = Math.min(100, Math.floor((total / req.quantity) * 100));
							return (
								<div key={req.id} className="space-y-1">
									<div className="flex justify-between text-[9px] font-bold uppercase">
										<span className="text-muted-foreground truncate mr-2">{req.step_name || req.item_id}</span>
										<span>{total.toLocaleString()} / {req.quantity.toLocaleString()}</span>
									</div>
									<div className="w-full bg-muted h-2 rounded-full overflow-hidden border border-border">
										<div className={`h-full transition-all duration-1000 ${total >= req.quantity ? "bg-green-500" : "bg-blue-500"}`} style={{ width: `${percent}%` }} />
									</div>
								</div>
							);
						})}
					</CardContent>
				</Card>
			))}
		</section>
	);
}