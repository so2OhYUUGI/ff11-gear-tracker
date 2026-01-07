"use client";

import { useState } from "react";
import { PlusCircle, MinusCircle, Loader2, UserPlus } from "lucide-react"; // UserPlusを追加
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
} from "@/components/ui/dialog"; // Dialogをインポート
import { CharacterWizard } from "@/components/character/CharacterWizard"; // ウィザードをインポート
import { useRouter } from "next/navigation";

interface DashboardProps {
	characters: any[];
	items: any[];
}

export function Dashboard({ characters, items }: DashboardProps) {
	const [inventoryMap, setInventoryMap] = useState<Record<string, number>>({});
	const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
	const [isWizardOpen, setIsWizardOpen] = useState(false); // ウィザードの開閉状態
	const router = useRouter();

	const selectedCharacter = characters[0];

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
		// selectedCharacter自体がいない場合は0を返す
		if (!selectedCharacter) return 0;

		const key = `${selectedCharacter.id}-${itemId}`;
		if (inventoryMap[key] !== undefined) return inventoryMap[key];

		// inventories が undefined または null の場合でもエラーにならないようにする
		const inventories = selectedCharacter.inventories || [];
		const inv = inventories.find((i: any) => i.item_id === itemId);

		return inv ? inv.quantity : 0;
	};
	
	// キャラクターがいない時の表示
	if (characters.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
				<h2 className="text-xl font-semibold">キャラクターが登録されていません</h2>
				<p className="text-muted-foreground">
					まずはキャラクターを作成して、トラッキングを開始しましょう。
				</p>
				<Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
					<DialogTrigger asChild>
						<Button size="lg" className="gap-2">
							<PlusCircle className="w-5 h-5" />
							キャラクターを作成する
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>新規キャラクター登録</DialogTitle>
						</DialogHeader>
						<CharacterWizard
							onComplete={() => {
								setIsWizardOpen(false);
								router.refresh();
							}}
						/>
					</DialogContent>
				</Dialog>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-2xl font-bold">アイテムトラッカー</h2>
					<p className="text-muted-foreground">
						キャラクター: <span className="font-medium text-foreground">{selectedCharacter.name}</span>
					</p>
				</div>

				{/* 追加のキャラクターを登録するためのボタン */}
				<Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
					<DialogTrigger asChild>
						<Button variant="outline" size="sm" className="gap-2">
							<UserPlus className="w-4 h-4" />
							キャラ追加
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>新規キャラクター登録</DialogTitle>
						</DialogHeader>
						<CharacterWizard
							onComplete={() => {
								setIsWizardOpen(false);
								router.refresh();
							}}
						/>
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{items.map((item) => {
					const qty = getQuantity(item.id);
					const isLoading = loadingItems[`${selectedCharacter.id}-${item.id}`];

					return (
						<Card key={item.id} className="overflow-hidden">
							<CardHeader className="bg-muted/50 pb-3">
								<div className="flex justify-between items-start">
									<CardTitle className="text-lg">{item.name}</CardTitle>
									<Badge variant="secondary">{item.category}</Badge>
								</div>
							</CardHeader>
							<CardContent className="pt-4">
								<div className="flex items-center justify-between">
									<div className="text-3xl font-bold">
										{isLoading ? (
											<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
										) : (
											qty
										)}
									</div>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="icon"
											onClick={() => handleUpdateQuantity(item.id, qty, -1)}
											disabled={isLoading || qty <= 0}
										>
											<MinusCircle className="w-5 h-5" />
										</Button>
										<Button
											variant="outline"
											size="icon"
											onClick={() => handleUpdateQuantity(item.id, qty, 1)}
											disabled={isLoading}
										>
											<PlusCircle className="w-5 h-5" />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
