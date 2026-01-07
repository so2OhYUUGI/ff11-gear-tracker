"use client";

import { PlusCircle, MinusCircle, Loader2, ChevronsUp, ChevronsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // shadcnのInputを使用

export function InventoryGrid({ items, getQuantity, loadingItems, onUpdate }: any) {
	return (
		<section className="space-y-2">
			<div className="flex items-center gap-2 text-muted-foreground px-1">
				<PlusCircle className="w-3 h-3" />
				<h2 className="text-[9px] font-bold uppercase tracking-widest font-mono">Inventory Stock</h2>
			</div>

			<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
				{items.map((item: any) => {
					const qty = getQuantity(item.id);
					const isLoading = loadingItems[item.id];

					return (
						<Card key={item.id} className="overflow-hidden bg-card/50 shadow-none border-border/60">
							<div className="p-3 space-y-3">
								{/* ヘッダー：カテゴリと名前 */}
								<div className="flex flex-col min-w-0">
									<span className="text-[7px] font-bold text-muted-foreground uppercase mb-0.5">{item.category}</span>
									<span className="text-[10px] font-black truncate leading-tight">{item.name}</span>
								</div>

								{/* メイン操作エリア：直接入力と±1ボタン */}
								<div className="flex items-center justify-between gap-2">
									<div className="relative flex-1">
										<Input
											type="number"
											value={qty}
											onChange={(e) => onUpdate(item.id, 0, parseInt(e.target.value) || 0)}
											className="h-9 text-lg font-black tracking-tighter pl-2 pr-1 bg-background border-none focus-visible:ring-1"
											disabled={isLoading}
										/>
										{isLoading && (
											<div className="absolute inset-0 flex items-center justify-center bg-background/50">
												<Loader2 className="w-4 h-4 animate-spin text-primary" />
											</div>
										)}
									</div>

									<div className="flex gap-1">
										<Button variant="secondary" size="icon" className="h-9 w-8" onClick={() => onUpdate(item.id, qty, -1)} disabled={isLoading || qty <= 0}><MinusCircle className="w-4 h-4" /></Button>
										<Button variant="secondary" size="icon" className="h-9 w-8" onClick={() => onUpdate(item.id, qty, 1)} disabled={isLoading}><PlusCircle className="w-4 h-4 text-primary" /></Button>
									</div>
								</div>

								{/* クイック加算ボタン：+100, +1000 (FF11プレイヤーに必須) */}
								<div className="flex gap-1">
									<Button
										variant="ghost"
										className="flex-1 h-6 text-[9px] font-bold border border-border/40 hover:bg-blue-50 hover:text-blue-600"
										onClick={() => onUpdate(item.id, qty, 100)}
										disabled={isLoading}
									>
										+100
									</Button>
									<Button
										variant="ghost"
										className="flex-1 h-6 text-[9px] font-bold border border-border/40 hover:bg-blue-50 hover:text-blue-600"
										onClick={() => onUpdate(item.id, qty, 1000)}
										disabled={isLoading}
									>
										+1000
									</Button>
								</div>
							</div>
						</Card>
					);
				})}
			</div>
		</section>
	);
}