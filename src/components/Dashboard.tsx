"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateInventory } from "../app/actions";

// 既存コンポーネント
import { UserHeader } from "./dashboard/UserHeader";
import { ProjectSection } from "./dashboard/ProjectSection";
import { InventoryGrid } from "./dashboard/InventoryGrid";
import { CharacterPortal } from "./dashboard/CharacterPortal";
import { SessionHeader } from "./dashboard/SessionHeader";

// 新規コンポーネント
// 相対パスではなくエイリアスを使う
import { GearPlanner } from "@/components/planner/GearPlanner";
import { StatsSummary } from "@/components/planner/StatsSummary";
import { JobSelector } from "@/components/planner/JobSelector";

// shadcn UI
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CharacterWizard } from "./character/CharacterWizard";

import { FullGearPlan, JobType, GearSlot, GearPlan } from "@/types/gear";

interface DashboardProps {
	characters: any[];
	items: any[];
	userTargets: any[];
	user: any;
}

export function Dashboard({ characters, items, userTargets, user }: DashboardProps) {
	const [activeCharId, setActiveCharId] = useState<string | null>(null);
	const [inventoryMap, setInventoryMap] = useState<Record<string, number>>({});
	const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
	const [isWizardOpen, setIsWizardOpen] = useState(false);

	// --- 計画用の状態 ---
	const [selectedJob, setSelectedJob] = useState<JobType>("WAR");	// 各部位でどの装備(AF/Relic/Empy)のどの段階(+0~+3)を選択しているか
	// 本来はDBから初期値を取得する
	const [plan, setPlan] = useState<Record<string, { type: string; stage: string }>>({
		Head: { type: "AF", stage: "+3" },
		Body: { type: "Relic", stage: "+3" },
		Hands: { type: "Empy", stage: "+3" },
		Legs: { type: "AF", stage: "+3" },
		Feet: { type: "AF", stage: "+3" },
	});

	const router = useRouter();
	const activeCharacter = characters.find((c) => c.id === activeCharId);

	// --- 既存ロジック ---
	const getAccountTotal = (itemId: string) => {
		return characters.reduce((sum: number, char: any) => {
			const inv = char.inventories?.find((i: any) => i.item_id === itemId);
			return sum + (inv ? inv.quantity : 0);
		}, 0);
	};

	const getItemBreakdown = (itemId: string) => {
		return characters
			.map((char) => ({
				name: char.name,
				quantity: char.inventories?.find((i: any) => i.item_id === itemId)?.quantity || 0,
				isCurrent: char.id === activeCharId,
			}))
			.filter((entry) => entry.quantity > 0);
	};

	const getQuantity = (itemId: string) => {
		if (!activeCharacter) return 0;
		const key = `${activeCharacter.id}-${itemId}`;
		if (inventoryMap[key] !== undefined) return inventoryMap[key];
		const inv = activeCharacter.inventories?.find((i: any) => i.item_id === itemId);
		return inv ? inv.quantity : 0;
	};

	const handleUpdate = async (itemId: string, currentQty: number, delta: number) => {
		if (!activeCharacter) return;
		const newQty = Math.max(0, currentQty + delta);
		const key = `${activeCharacter.id}-${itemId}`;
		setInventoryMap((prev) => ({ ...prev, [key]: newQty }));
		try {
			await updateInventory(activeCharacter.id, itemId, newQty);
		} catch (error) {
			console.error("Update failed", error);
		}
	};

	if (!activeCharId) {
		return (
			<div className="flex flex-col gap-6 w-full max-w-md mx-auto pb-10 px-1">
				<UserHeader email={user?.email} />
				<CharacterPortal
					characters={characters}
					userTargets={userTargets}
					onSelect={(id: string) => setActiveCharId(id)}
					onAddChar={() => setIsWizardOpen(true)}
					getAccountTotal={getAccountTotal}
				/>
				<Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
					<DialogContent className="sm:max-w-[400px] w-[95vw] rounded-xl">
						<DialogHeader><DialogTitle>新規キャラクター登録</DialogTitle></DialogHeader>
						<CharacterWizard onComplete={() => { setIsWizardOpen(false); router.refresh(); }} onCancel={() => setIsWizardOpen(false)} />
					</DialogContent>
				</Dialog>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 w-full max-w-md mx-auto pb-20 px-1">
			<SessionHeader character={activeCharacter} onBack={() => setActiveCharId(null)} />

			<Tabs defaultValue="planner" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="planner">装備計画</TabsTrigger>
					<TabsTrigger value="materials">在庫参照</TabsTrigger>
				</TabsList>

				<TabsContent value="planner" className="space-y-6 mt-4">
					<JobSelector selectedJob={selectedJob} onSelect={setSelectedJob} />

					{/* 合計ステータス表示 */}
					<StatsSummary plan={plan} job={selectedJob} />

					{/* 装備選択マトリクス */}
					<GearPlanner
						job={selectedJob}
						plan={plan}
						onPlanChange={(slot, val) => setPlan(prev => ({ ...prev, [slot]: val }))}
					/>
				</TabsContent>

				<TabsContent value="materials" className="space-y-6 mt-4">
					<ProjectSection
						userTargets={userTargets}
						getAccountTotal={getAccountTotal}
						getItemBreakdown={getItemBreakdown}
						selectedCharId={activeCharId}
						characters={characters}
					/>
					<InventoryGrid
						items={items}
						getQuantity={getQuantity}
						loadingItems={loadingItems}
						onUpdate={handleUpdate}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}