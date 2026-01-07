"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateInventory } from "../app/actions";
import { UserHeader } from "./dashboard/UserHeader";
import { ProjectSection } from "./dashboard/ProjectSection";
import { CharacterControl } from "./dashboard/CharacterControl";
import { InventoryGrid } from "./dashboard/InventoryGrid";

interface DashboardProps {
	characters: any[];
	items: any[];
	userTargets: any[];
	user: any;
}

export function Dashboard({ characters, items, userTargets, user }: DashboardProps) {
	const [inventoryMap, setInventoryMap] = useState<Record<string, number>>({});
	const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
	const [isWizardOpen, setIsWizardOpen] = useState(false);
	const [selectedCharId, setSelectedCharId] = useState<string | null>(
		characters.length > 0 ? characters[0].id : null
	);

	const router = useRouter();
	const selectedCharacter = characters.find((c: any) => c.id === selectedCharId) || characters[0];

	// 全キャラの在庫を合算するロジック
	const getAccountTotal = (itemId: string) => {
		return characters.reduce((sum: number, char: any) => {
			const inv = char.inventories?.find((i: any) => i.item_id === itemId);
			return sum + (inv ? inv.quantity : 0);
		}, 0);
	};

	// 個別在庫の取得ロジック（最新の更新分を優先）
	const getQuantity = (itemId: string) => {
		if (!selectedCharacter) return 0;
		const key = `${selectedCharacter.id}-${itemId}`;
		if (inventoryMap[key] !== undefined) return inventoryMap[key];
		const inv = selectedCharacter.inventories?.find((i: any) => i.item_id === itemId);
		return inv ? inv.quantity : 0;
	};

	// 在庫更新アクション
	const handleUpdate = async (itemId: string, currentQty: number, delta: number) => {
		if (!selectedCharacter) return;
		const newQty = Math.max(0, currentQty + delta);
		const key = `${selectedCharacter.id}-${itemId}`;
		setLoadingItems(prev => ({ ...prev, [itemId]: true }));
		try {
			await updateInventory(selectedCharacter.id, itemId, newQty);
			setInventoryMap(prev => ({ ...prev, [key]: newQty }));
		} catch (error) {
			console.error("Update failed", error);
		} finally {
			setLoadingItems(prev => ({ ...prev, [itemId]: false }));
		}
	};

	return (
		<div className="flex flex-col gap-6 w-full max-w-lg mx-auto pb-20 overflow-x-hidden">
			<UserHeader email={user?.email} />

			{userTargets.length > 0 && (
				<ProjectSection userTargets={userTargets} getAccountTotal={getAccountTotal} />
			)}

			<CharacterControl
				characters={characters}
				selectedCharId={selectedCharId}
				onSelectChar={setSelectedCharId}
				isWizardOpen={isWizardOpen}
				setIsWizardOpen={setIsWizardOpen}
				onRefresh={() => { setIsWizardOpen(false); router.refresh(); }}
			/>

			<InventoryGrid
				items={items}
				getQuantity={getQuantity}
				loadingItems={loadingItems}
				onUpdate={handleUpdate}
			/>
		</div>
	);
}