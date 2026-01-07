"use client";

import { useState } from "react";
import { Layers, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TargetWizard } from "./TargetWizard";

export function ProjectSection({ userTargets = [], getAccountTotal, characters }: any) {
	const [isOpen, setIsOpen] = useState(false);

	// 優先度順にソート
	const sortedTargets = [...userTargets].sort((a, b) => (b.priority || 0) - (a.priority || 0));

	return (
		<section className="space-y-4">
			{/* --- ヘッダー部分は常に表示 --- */}
			<div className="flex items-center justify-between px-1">
				<div className="flex items-center gap-2 text-blue-600">
					<Layers className="w-4 h-4" />
					<h2 className="text-sm font-black uppercase tracking-tight">Active Projects</h2>
				</div>

				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger asChild>
						<Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold gap-1 border border-blue-200 text-blue-600 hover:bg-blue-50">
							<Plus className="w-3 h-3" /> ADD PROJECT
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[400px]">
						<DialogHeader>
							<DialogTitle>プロジェクトの追加</DialogTitle>
						</DialogHeader>
						<TargetWizard
							characters={characters}
							onComplete={() => {
								setIsOpen(false);
								// 必要ならここで router.refresh() 等
							}}
						/>
					</DialogContent>
				</Dialog>
			</div>

			{/* --- リスト部分：0個の時は案内を表示 --- */}
			<div className="space-y-3">
				{sortedTargets.length === 0 ? (
					<div className="py-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-blue-50/20 text-blue-600/50">
						<p className="text-[10px] font-bold uppercase">No Active Projects</p>
						<p className="text-[9px]">上のボタンから目標を追加してください</p>
					</div>
				) : (
					sortedTargets.map((target: any) => {
						const isHighPriority = target.priority === 2;
						const charName = characters.find((c: any) => c.id === target.character_id)?.name || "Unknown";

						return (
							<Card key={target.id} className={`overflow-hidden shadow-sm ${isHighPriority ? 'border-blue-400 border-2' : 'border-border'}`}>
								<CardHeader className={`py-2 px-3 border-b ${isHighPriority ? 'bg-blue-50/50' : 'bg-muted/30'}`}>
									<div className="flex justify-between items-center">
										<div className="flex items-center gap-2">
											{isHighPriority && <Badge className="bg-blue-600 text-[8px] h-4">TOP</Badge>}
											<span className="text-[10px] font-black uppercase tracking-tight">{target.recipe_groups?.name}</span>
										</div>
										<span className="text-[9px] font-bold text-muted-foreground italic">
											{charName}
										</span>
									</div>
								</CardHeader>
								<CardContent className="p-3 space-y-3">
									{target.recipe_groups?.recipe_requirements?.map((req: any) => {
										const total = getAccountTotal(req.item_id);
										const percent = Math.min(100, Math.floor((total / req.quantity) * 100));
										return (
											<div key={req.id} className="space-y-1">
												<div className="flex justify-between text-[9px] font-bold uppercase text-foreground">
													<span className="truncate mr-2">{req.step_name || req.item_id}</span>
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
						);
					})
				)}
			</div>
		</section>
	);
}