'use client';

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import { UI_STYLE } from "@/lib/styles";

export default function CharacterManager({ characters }: { characters: any[] }) {
	const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

	// 1. キャラ選択済みの場合は Dashboard を表示
	if (selectedCharacterId) {
		return (
			<Dashboard
				characterId={selectedCharacterId}
				onBack={() => setSelectedCharacterId(null)} // これが重要！
			/>
		);
	}

	// 2. 未選択の場合はキャラ一覧を表示
	return (
		<div className={UI_STYLE.container}>
			<h1 className={UI_STYLE.title}>キャラクターを選択</h1>
			<div className="grid gap-4">
				{characters.map((char) => (
					<div
						key={char.id}
						onClick={() => setSelectedCharacterId(char.id)}
						className={`${UI_STYLE.card} cursor-pointer hover:border-blue-500 transition-all`}
					>
						<div className="font-bold text-lg">{char.name}</div>
						<div className="text-sm text-slate-500">{char.world}</div>
					</div>
				))}
			</div>
		</div>
	);
}