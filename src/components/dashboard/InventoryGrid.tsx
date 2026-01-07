"use client";

import { PlusCircle, MinusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UI_STYLE } from "@/lib/styles"; // 共通スタイルをインポート

export function InventoryGrid({ items, getQuantity, loadingItems, onUpdate }: any) {
	return (
		<section className={UI_STYLE.section}>
			{/* セクションタイトル */}
			<div className="flex items-center gap-2 px-1 text-muted-foreground">
				<PlusCircle className="w-3 h-3" />
				<h2 className={UI_STYLE.label + " mb-0"}>Stock Management</h2>
			</div>

			{/* レスポンシブグリッド */}
			<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
				{items.map((item: any) => {
					const qty = getQuantity(item.id);
					const isLoading = loadingItems[item.id];

					return (
						<Card key={item.id} className={UI_STYLE.card + " border-border/60 shadow-none bg-card/50"}>
							<div className="p-3 space-y-3">
								{/* アイテム情報エリア */}
								<div className="flex flex-col min-w-0">
									<span className="text-[7px] font-bold text-muted-foreground uppercase mb-0.5 tracking-widest">
										{item.category}
									</span>
									<span className={UI_STYLE.cardTitle + " leading-tight"}>
										{item.name}
									</span>
								</div>

								{/* メイン操作エリア */}
								<div className="flex items-center justify-between gap-2">
									<div className="relative flex-1">
										<Input
											type="number"
											value={qty}
											onChange={(e) => onUpdate(item.id, 0, parseInt(e.target.value) || 0)}
											className={`${UI_STYLE.quantity} h-9 pl-2 pr-1 bg-background border-none focus-visible:ring-1 focus-visible:ring-primary/30`}
											disabled={isLoading}
										/>
										{isLoading && (
											<div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
												<Loader2 className="w-4 h-4 animate-spin text-primary" />
											</div>
										)}
									</div>

									<div className="flex gap-1">
										<Button
											variant="secondary"
											size="icon"
											className={UI_STYLE.button.icon}
											onClick={() => onUpdate(item.id, qty, -1)}
											disabled={isLoading || qty <= 0}
										>
											<MinusCircle className="w-4 h-4" />
										</Button>
										<Button
											variant="secondary"
											size="icon"
											className={UI_STYLE.button.icon}
											onClick={() => onUpdate(item.id, qty, 1)}
											disabled={isLoading}
										>
											<PlusCircle className="w-4 h-4 text-primary" />
										</Button>
									</div>
								</div>

								{/* クイック加算ボタン (バルク入力対応) */}
								<div className="flex gap-1">
									<Button
										variant="ghost"
										className="flex-1 h-6 text-[9px] font-bold border border-border/40 hover:bg-primary/5 hover:text-primary transition-colors"
										onClick={() => onUpdate(item.id, qty, 100)}
										disabled={isLoading}
									>
										+100
									</Button>
									<Button
										variant="ghost"
										className="flex-1 h-6 text-[9px] font-bold border border-border/40 hover:bg-primary/5 hover:text-primary transition-colors"
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