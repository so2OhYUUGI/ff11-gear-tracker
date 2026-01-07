"use client";

import { useState } from "react";
import { PlusCircle, MinusCircle, Loader2, UserPlus, Layers, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateInventory } from "../app/actions";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CharacterWizard } from "./character/CharacterWizard";
import { useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface DashboardProps {
	characters: any[];
	items: any[];
	user: any;
}

export function Dashboard({ characters, items, user }: DashboardProps) {
	const [inventoryMap, setInventoryMap] = useState<Record<string, number>>({});
	const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
	const [isWizardOpen, setIsWizardOpen] = useState(false);

	const [selectedCharId, setSelectedCharId] = useState<string | null>(
		characters.length > 0 ? characters[0].id : null
	);

	const router = useRouter();
	const selectedCharacter = characters.find(c => c.id === selectedCharId) || characters[0];

	const handleUpdateQuantity = async (itemId: string, currentQty: number, delta: number) => {
		if (!selectedCharacter) return;
		const newQty = Math.max(0, currentQty + delta);
		const key = `${selectedCharacter.id}-${itemId}`;
		setLoadingItems((prev) => ({ ...prev, [key]: true }));
		try {
			await updateInventory(selectedCharacter.id, itemId, newQty);
			setInventoryMap((prev) => ({ ...prev, [key]: newQty }));
		} catch (error) {
			console.error("Failed to update inventory:", error);
		} finally {
			setLoadingItems((prev) => ({ ...prev, [key]: false }));
		}
	};

	const getQuantity = (itemId: string) => {
		if (!selectedCharacter) return 0;
		const key = `${selectedCharacter.id}-${itemId}`;
		if (inventoryMap[key] !== undefined) return inventoryMap[key];
		const inv = selectedCharacter.inventories?.find((i: any) => i.item_id === itemId);
		return inv ? inv.quantity : 0;
	};

	return (
		<div className="space-y-6">
			{/* --- 常に表示されるエリア: ログイン情報 --- */}
			<div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg border border-border shadow-sm">
				<div className="text-sm">
					<p className="text-muted-foreground text-xs">ログイン中:</p>
					<p className="font-semibold text-foreground">{user?.email}</p>
				</div>
				<form action="/auth/signout" method="post">
					<Button variant="outline" size="sm" type="submit">
						ログアウト
					</Button>
				</form>
			</div>

			{/* --- デバッグ用情報 (原因が判明したら削除してください) --- */}
			<div className="bg-amber-50 border border-amber-200 p-2 rounded text-[10px] text-amber-800 flex gap-4">
				<span>User ID: {user?.id}</span>
				<span>Chars In DB: {characters.length}</span>
			</div>

			{/* --- メインコンテンツ --- */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="space-y-1">
					<h2 className="text-2xl font-bold tracking-tight text-foreground">アイテムトラッカー</h2>
					{characters.length > 0 && (
						<div className="flex items-center gap-2">
							<span className="text-sm text-muted-foreground font-medium">操作中:</span>
							<Select value={selectedCharId || ""} onValueChange={setSelectedCharId}>
								<SelectTrigger className="w-[220px] h-8 text-xs">
									<SelectValue placeholder="キャラを選択" />
								</SelectTrigger>
								<SelectContent>
									{characters.map((char) => (
										<SelectItem key={char.id} value={char.id}>
											{char.name} ({char.world})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
				</div>

				<Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
					<DialogTrigger asChild>
						<Button variant="default" size="sm" className="gap-2 shadow-sm">
							<UserPlus className="w-4 h-4" />
							キャラ追加
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background text-foreground border-border">
						<DialogHeader>
							<DialogTitle>新規キャラクター登録</DialogTitle>
						</DialogHeader>
						<CharacterWizard
							onComplete={() => {
								setIsWizardOpen(false);
								router.refresh();
							}}
							onCancel={() => setIsWizardOpen(false)}
						/>
					</DialogContent>
				</Dialog>
			</div>

			{characters.length === 0 ? (
				/* キャラクターが0人の時の表示 */
				<div className="flex flex-col items-center justify-center min-h-[300px] space-y-6 border-2 border-dashed rounded-xl p-8 bg-muted/5">
					<div className="p-4 bg-muted/20 rounded-full">
						<Layers className="w-12 h-12 text-muted-foreground/30" />
					</div>
					<div className="text-center space-y-2">
						<h3 className="text-xl font-bold text-foreground">キャラクターが未登録です</h3>
						<p className="text-sm text-muted-foreground max-w-xs mx-auto">
							アイテムの在庫を管理するために、まずは最初のキャラクターを作成しましょう。
						</p>
					</div>
					<Button onClick={() => setIsWizardOpen(true)} size="lg" className="gap-2 px-8">
						<PlusCircle className="w-5 h-5" />
						キャラクターを作成する
					</Button>
				</div>
			) : (
				/* キャラクターがいる時の表示 */
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{items.map((item) => {
						const qty = getQuantity(item.id);
						const isLoading = loadingItems[`${selectedCharacter?.id}-${item.id}`];

						return (
							<Card key={item.id} className="overflow-hidden border-border bg-card">
								<CardHeader className="bg-muted/50 pb-3 border-b border-border/50 px-4 py-3">
									<div className="flex justify-between items-start gap-2">
										<CardTitle className="text-xs font-bold truncate" title={item.name}>
											{item.name}
										</CardTitle>
										<Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 uppercase shrink-0">
											{item.category}
										</Badge>
									</div>
								</CardHeader>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div className="text-3xl font-black tracking-tighter">
											{isLoading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : qty}
										</div>
										<div className="flex gap-1.5">
											<Button
												variant="outline"
												size="icon"
												className="h-8 w-8"
												onClick={() => handleUpdateQuantity(item.id, qty, -1)}
												disabled={isLoading || qty <= 0}
											>
												<MinusCircle className="w-4 h-4" />
											</Button>
											<Button
												variant="outline"
												size="icon"
												className="h-8 w-8"
												onClick={() => handleUpdateQuantity(item.id, qty, 1)}
												disabled={isLoading}
											>
												<PlusCircle className="w-4 h-4 text-primary" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}