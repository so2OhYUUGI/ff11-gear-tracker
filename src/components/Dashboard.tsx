"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateInventory } from "../app/actions";

// 分割したコンポーネントのインポート
import { UserHeader } from "./dashboard/UserHeader";
import { ProjectSection } from "./dashboard/ProjectSection";
import { CharacterControl } from "./dashboard/CharacterControl";
import { InventoryGrid } from "./dashboard/InventoryGrid";
import { CharacterPortal } from "./dashboard/CharacterPortal";
import { SessionHeader } from "./dashboard/SessionHeader";

// shadcn UI
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CharacterWizard } from "./character/CharacterWizard";

interface DashboardProps {
	characters: any[];
	items: any[];
	userTargets: any[];
	user: any;
}

export function Dashboard({ characters, items, userTargets, user }: DashboardProps) {
	// --- 状態管理 ---
	const [activeCharId, setActiveCharId] = useState<string | null>(null);
	const [inventoryMap, setInventoryMap] = useState<Record<string, number>>({});
	const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
	const [isWizardOpen, setIsWizardOpen] = useState(false);

	const router = useRouter();

	// 選択中のキャラクターオブジェクト
	const activeCharacter = characters.find((c) => c.id === activeCharId);

	// --- ロジック: 全キャラ合算 (パズル用) ---
	const getAccountTotal = (itemId: string) => {
		return characters.reduce((sum: number, char: any) => {
			const inv = char.inventories?.find((i: any) => i.item_id === itemId);
			return sum + (inv ? inv.quantity : 0);
		}, 0);
	};

	// --- ロジック: アイテムごとの全キャラ内訳 (パズルチップ用) ---
	const getItemBreakdown = (itemId: string) => {
		return characters
			.map((char) => ({
				name: char.name,
				quantity: char.inventories?.find((i: any) => i.item_id === itemId)?.quantity || 0,
				isCurrent: char.id === activeCharId,
			}))
			.filter((entry) => entry.quantity > 0);
	};

	// --- ロジック: 個別在庫取得 ---
	const getQuantity = (itemId: string) => {
		if (!activeCharacter) return 0;
		const key = `${activeCharacter.id}-${itemId}`;
		if (inventoryMap[key] !== undefined) return inventoryMap[key];
		const inv = activeCharacter.inventories?.find((i: any) => i.item_id === itemId);
		return inv ? inv.quantity : 0;
	};

	// --- ロジック: 在庫更新アクション ---
	const handleUpdate = async (itemId: string, currentQty: number, delta: number) => {
		if (!activeCharacter) return;
		const newQty = Math.max(0, currentQty + delta);
		const key = `${activeCharacter.id}-${itemId}`;

		setInventoryMap((prev) => ({ ...prev, [key]: newQty }));
		setLoadingItems((prev) => ({ ...prev, [itemId]: true }));

		try {
			await updateInventory(activeCharacter.id, itemId, newQty);
		} catch (error) {
			console.error("Update failed", error);
			setInventoryMap((prev) => ({ ...prev, [key]: currentQty }));
		} finally {
			setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
		}
	};

	// --- 1. エントランス画面 (キャラクター未選択時) ---
	if (!activeCharId) {
		return (
			<div className="flex flex-col gap-6 w-full max-w-md mx-auto pb-10 overflow-x-hidden px-1">
				<UserHeader email={user?.email} />

				<CharacterPortal
					characters={characters}
					userTargets={userTargets}
					onSelect={(id: string) => setActiveCharId(id)}
					onAddChar={() => setIsWizardOpen(true)}
					getAccountTotal={getAccountTotal}
				/>

				{/* キャラ登録ウィザード用の隠しダイアログ */}
				<Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
					<DialogContent className="sm:max-w-[400px] w-[95vw] rounded-xl">
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
		);
	}

	// --- 2. セッション画面 (操作キャラクター選択時) ---
	return (
		<div className="flex flex-col gap-6 w-full max-w-md mx-auto pb-20 animate-in slide-in-from-right-4 duration-300 px-1">
			{/* セッション専用ヘッダー (戻るボタン付き) */}
			<SessionHeader
				character={activeCharacter}
				onBack={() => setActiveCharId(null)}
			/>

			{/* プロジェクト進捗 (パズルB案: 内訳表示付き) */}
			<ProjectSection
				userTargets={userTargets}
				getAccountTotal={getAccountTotal}
				getItemBreakdown={getItemBreakdown}
				selectedCharId={activeCharId}
				characters={characters}
			/>

			{/* 操作中のキャラの在庫一覧 */}
			<InventoryGrid
				items={items}
				getQuantity={getQuantity}
				loadingItems={loadingItems}
				onUpdate={handleUpdate}
			/>

			{/* 開発時のみのデバッグ表示 */}
			{process.env.NODE_ENV === "development" && (
				<div className="mt-10 p-2 bg-amber-50 border border-amber-200 rounded text-[9px] text-amber-800 text-center">
					Active Char ID: {activeCharId}
				</div>
			)}
		</div>
	);
}