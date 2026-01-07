"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Star, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UI_STYLE } from "@/lib/styles";

export function CharacterPortal({ characters, userTargets, onSelect, onAddChar, getAccountTotal }: any) {
	return (
		<div className={UI_STYLE.container}>
			<div className="text-center space-y-1">
				<h2 className={UI_STYLE.mainTitle}>Select Character</h2>
				<p className={UI_STYLE.label}>操作するキャラクターを選んでください</p>
			</div>

			<div className="grid grid-cols-1 gap-3">
				{characters.map((char: any) => {
					const mainTarget = userTargets
						?.filter((t: any) => t.character_id === char.id)
						.sort((a: any, b: any) => (b.priority || 0) - (a.priority || 0))[0];

					let overallProgress = 0;
					if (mainTarget?.recipe_groups?.recipe_requirements) {
						const reqs = mainTarget.recipe_groups.recipe_requirements;
						const totalProgress = reqs.reduce((acc: number, req: any) => {
							const current = getAccountTotal(req.item_id);
							return acc + Math.min(1, current / req.quantity);
						}, 0);
						overallProgress = Math.floor((totalProgress / reqs.length) * 100);
					}

					return (
						<Card
							key={char.id}
							className={`${UI_STYLE.card} p-4 cursor-pointer hover:border-primary active:scale-[0.98] border-2 shadow-sm`}
							onClick={() => onSelect(char.id)}
						>
							<div className="flex justify-between items-start">
								<div className="flex items-center gap-3">
									{/* アバター: UI_STYLE.header.backButton の色味と統一感を出すため bg-primary を使用 */}
									<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black italic shadow-md shrink-0">
										{char.name.charAt(0)}
									</div>
									<div className="min-w-0">
										<div className="flex items-center gap-1.5">
											{/* UI_STYLE.cardTitle を使用し、文字色を強制 */}
											<span className={`${UI_STYLE.cardTitle} text-base text-foreground`}>{char.name}</span>
											<Badge variant="outline" className={`${UI_STYLE.text.tiny} h-4 px-1 border-muted-foreground/30 text-muted-foreground`}>
												{char.race}
											</Badge>
										</div>
										<p className={`${UI_STYLE.label} mb-0`}>{char.world}</p>
									</div>
								</div>
								{mainTarget?.priority === 2 && <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />}
							</div>

							{mainTarget && (
								<div className="mt-4 pt-3 border-t border-dashed border-border/60 space-y-2">
									<div className="flex justify-between items-end">
										<div className="flex items-center gap-1 text-primary">
											<Target className="w-3 h-3" />
											{/* 目標名も UI_STYLE.label を流用 */}
											<span className={`${UI_STYLE.label} mb-0 text-primary truncate max-w-[150px]`}>
												{mainTarget.recipe_groups?.name}
											</span>
										</div>
										<span className="text-xs font-black italic text-primary">{overallProgress}%</span>
									</div>
									<div className={UI_STYLE.progress.container}>
										<div
											className={UI_STYLE.progress.bar}
											style={{ width: `${overallProgress}%` }}
										/>
									</div>
								</div>
							)}
						</Card>
					);
				})}

				<Button
					variant="outline"
					className={`${UI_STYLE.button.add} h-20 border-2 flex-col bg-muted/5 hover:bg-muted/10 transition-colors group`}
					onClick={onAddChar}
				>
					<UserPlus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
					<span className={`${UI_STYLE.label} mb-0 group-hover:text-primary transition-colors`}>Add New Character</span>
				</Button>
			</div>
		</div>
	);
}