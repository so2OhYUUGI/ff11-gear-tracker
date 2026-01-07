"use client";

import { Layers, ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProjectSection({ userTargets = [], getAccountTotal, getItemBreakdown, selectedCharId }: any) {
	const sortedTargets = [...userTargets].sort((a, b) => {
		const aIsCurrent = a.character_id === selectedCharId ? 1 : 0;
		const bIsCurrent = b.character_id === selectedCharId ? 1 : 0;
		return (bIsCurrent - aIsCurrent) || (b.priority - a.priority);
	});

	if (sortedTargets.length === 0) return null;

	return (
		<section className="space-y-4">
			<div className="flex items-center gap-2 px-1 text-primary">
				<Layers className="w-4 h-4" />
				<h2 className="text-xs font-black uppercase tracking-tight text-foreground">Active Projects</h2>
			</div>

			<div className="space-y-4">
				{sortedTargets.map((target: any) => {
					const isCurrentCharTarget = target.character_id === selectedCharId;

					return (
						<Card key={target.id} className={`overflow-hidden shadow-sm transition-all border-2 ${isCurrentCharTarget ? 'border-primary' : 'border-border opacity-80'}`}>
							<CardHeader className={`py-2 px-3 border-b ${isCurrentCharTarget ? 'bg-primary/5' : 'bg-muted/30'}`}>
								<div className="flex justify-between items-center">
									<div className="flex items-center gap-2">
										<span className="text-[10px] font-black uppercase tracking-tighter text-foreground">{target.recipe_groups?.name}</span>
										{isCurrentCharTarget && <Badge className="bg-primary text-primary-foreground text-[8px] h-4">MAIN</Badge>}
									</div>
								</div>
							</CardHeader>

							<CardContent className="p-3 space-y-4">
								{target.recipe_groups?.recipe_requirements?.map((req: any) => {
									const total = getAccountTotal(req.item_id);
									const breakdown = getItemBreakdown(req.item_id);
									const percent = Math.min(100, Math.floor((total / req.quantity) * 100));
									const isComplete = total >= req.quantity;

									return (
										<div key={req.id} className="space-y-2">
											<div className="flex justify-between text-[10px] font-bold uppercase">
												<span className="text-muted-foreground truncate mr-2">{req.step_name || req.item_id}</span>
												<span className={isComplete ? "text-green-600" : "text-foreground"}>
													{total.toLocaleString()} / {req.quantity.toLocaleString()}
												</span>
											</div>

											<div className="w-full bg-muted h-2 rounded-full overflow-hidden border border-border">
												<div className={`h-full transition-all duration-1000 ${isComplete ? "bg-green-500" : "bg-primary"}`} style={{ width: `${percent}%` }} />
											</div>

											<div className="flex flex-wrap gap-1.5 mt-1">
												{breakdown.map((b: any, i: number) => (
													<div
														key={i}
														className={`text-[9px] px-2 py-0.5 rounded-md border flex items-center gap-1 font-bold
                              ${b.isCurrent ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground border-border shadow-sm'}`}
													>
														{!b.isCurrent && <ArrowRightLeft className="w-2.5 h-2.5 opacity-70" />}
														<span className="opacity-70">{b.name.charAt(0)}:</span>
														<span>{b.quantity.toLocaleString()}</span>
													</div>
												))}
											</div>
										</div>
									);
								})}
							</CardContent>
						</Card>
					);
				})}
			</div>
		</section>
	);
}