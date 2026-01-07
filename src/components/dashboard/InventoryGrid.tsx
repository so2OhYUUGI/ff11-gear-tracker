"use client";

import { PlusCircle, MinusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function InventoryGrid({ items, getQuantity, loadingItems, onUpdate }: any) {
	return (
		<section className="space-y-3">
			<div className="flex items-center gap-2 text-muted-foreground px-1">
				<PlusCircle className="w-3.5 h-3.5" />
				<h2 className="text-[10px] font-bold uppercase tracking-widest">Inventory Stock</h2>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
				{items.map((item: any) => {
					const qty = getQuantity(item.id);
					const isLoading = loadingItems[item.id];
					return (
						<Card key={item.id} className="overflow-hidden bg-card/50 shadow-none border-border/60 transition-colors hover:border-primary/40">
							<div className="p-2.5 space-y-2">
								<div className="flex flex-col">
									<span className="text-[8px] font-bold text-muted-foreground uppercase mb-0.5">{item.category}</span>
									<span className="text-[10px] font-black truncate">{item.name}</span>
								</div>
								<div className="flex items-center justify-between gap-1">
									<span className="text-xl font-black tracking-tighter">
										{isLoading ? <Loader2 className="w-3 h-3 animate-spin text-primary" /> : qty.toLocaleString()}
									</span>
									<div className="flex gap-1">
										<Button variant="secondary" size="icon" className="h-7 w-7 rounded-md" onClick={() => onUpdate(item.id, -1)} disabled={isLoading || qty <= 0}><MinusCircle className="w-3.5 h-3.5" /></Button>
										<Button variant="secondary" size="icon" className="h-7 w-7 rounded-md" onClick={() => onUpdate(item.id, 1)} disabled={isLoading}><PlusCircle className="w-3.5 h-3.5 text-primary" /></Button>
									</div>
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		</section>
	);
}