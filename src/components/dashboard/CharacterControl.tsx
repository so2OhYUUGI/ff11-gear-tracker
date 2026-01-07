"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CharacterWizard } from "../character/CharacterWizard";

interface CharacterControlProps {
	characters: any[];
	selectedCharId: string | null;
	onSelectChar: (id: string) => void;
	isWizardOpen: boolean;
	setIsWizardOpen: (open: boolean) => void;
	onRefresh: () => void;
}

export function CharacterControl({
	characters,
	selectedCharId,
	onSelectChar,
	isWizardOpen,
	setIsWizardOpen,
	onRefresh
}: CharacterControlProps) {
	return (
		<section className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-end gap-3">
			<div className="w-full sm:flex-1 space-y-1.5">
				<Label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Character</Label>
				<Select value={selectedCharId || ""} onValueChange={onSelectChar}>
					<SelectTrigger className="w-full h-9 bg-background">
						<SelectValue placeholder="キャラを選択" />
					</SelectTrigger>
					<SelectContent>
						{characters.map((char) => (
							<SelectItem key={char.id} value={char.id}>{char.name} ({char.world})</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
				<DialogTrigger asChild>
					{/* h-9 にして高さを抑え、sm:w-auto で横幅を内容に合わせる */}
					<Button variant="outline" className="w-full sm:w-auto h-9 px-4 border-dashed gap-2 shrink-0">
						<UserPlus className="w-3.5 h-3.5" />
						<span className="text-[11px] font-bold uppercase">Add Char</span>
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader><DialogTitle>キャラクター登録</DialogTitle></DialogHeader>
					<CharacterWizard onComplete={onRefresh} onCancel={() => setIsWizardOpen(false)} />
				</DialogContent>
			</Dialog>
		</section>
	);
}