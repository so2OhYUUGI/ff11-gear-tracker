"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { createTarget } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export function TargetWizard({ characters, onComplete }: any) {
	const [recipes, setRecipes] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	const [selectedChar, setSelectedChar] = useState(characters[0]?.id || "");
	const [selectedRecipe, setSelectedRecipe] = useState("");
	const [priority, setPriority] = useState("1"); // Default: Medium

	const supabase = createClient();

	useEffect(() => {
		async function loadRecipes() {
			const { data } = await supabase.from("recipe_groups").select("*").order("category");
			if (data) setRecipes(data);
		}
		loadRecipes();
	}, [supabase]);

	const handleSubmit = async () => {
		if (!selectedChar || !selectedRecipe) return;
		setLoading(true);
		try {
			await createTarget(selectedChar, selectedRecipe, parseInt(priority));
			onComplete();
		} catch (err) {
			alert("登録に失敗しました。既に同じ目標が設定されている可能性があります。");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-5 py-2 text-foreground">
			<div className="space-y-4">
				<div className="space-y-1.5">
					<Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">担当キャラクター</Label>
					<Select value={selectedChar} onValueChange={setSelectedChar}>
						<SelectTrigger className="h-10">
							<SelectValue placeholder="キャラを選択" />
						</SelectTrigger>
						<SelectContent>
							{characters.map((c: any) => (
								<SelectItem key={c.id} value={c.id}>{c.name} ({c.world})</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-1.5">
					<Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">目標プロジェクト</Label>
					<Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
						<SelectTrigger className="h-10">
							<SelectValue placeholder="目標を選択" />
						</SelectTrigger>
						<SelectContent>
							{recipes.map((r: any) => (
								<SelectItem key={r.id} value={r.id}>[{r.category}] {r.name}</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-1.5">
					<Label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">優先度</Label>
					<Select value={priority} onValueChange={setPriority}>
						<SelectTrigger className="h-10">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="2">最優先 (High)</SelectItem>
							<SelectItem value="1">通常 (Medium)</SelectItem>
							<SelectItem value="0">長期・並行 (Low)</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<Button onClick={handleSubmit} className="w-full h-11 font-bold" disabled={loading || !selectedRecipe}>
				{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "プロジェクトを開始する"}
			</Button>
		</div>
	);
}