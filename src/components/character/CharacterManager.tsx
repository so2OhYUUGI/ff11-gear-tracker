'use client';

import { useState } from "react";
import Dashboard from "@/components/gear/Dashboard";
import { UI_STYLE } from "@/lib/styles";

export default function CharacterManager({ initialCharacters }: { initialCharacters: any[] }) {
	const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

	if (selectedCharacterId) {
		return (
			<Dashboard
				characterId={selectedCharacterId}
				onBack={() => setSelectedCharacterId(null)}
			/>
		);
	}

	return (
		<div className={UI_STYLE.container}>
			<header className="mb-10">
				<h1 className={UI_STYLE.mainTitle}>Character Select</h1>
				<p className={UI_STYLE.label}>管理するキャラクターを選択してください</p>
			</header>

			{/* レスポンシブグリッド: スマホ1列、タブレット2列、PC3列 */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
				{initialCharacters.map((char) => (
					<button
						key={char.id}
						onClick={() => setSelectedCharacterId(char.id)}
						className={`${UI_STYLE.card} ${UI_STYLE.cardInactive} text-left hover:${UI_STYLE.cardActive} transition-all group min-h-[140px] flex flex-col justify-between`}
					>
						<div>
							<div className={UI_STYLE.text.label}>{char.world}</div>
							{/* カード内の名前は cardTitle や foreground を使用して視認性を確保 */}
							<h2 className="text-xl font-black text-foreground mt-1 group-hover:text-primary transition-colors">
								{char.name}
							</h2>
						</div>
						<div className={`${UI_STYLE.text.tiny} text-primary font-black self-end tracking-widest`}>
							Open Tracker ➔
						</div>
					</button>
				))}

				{/* 新規作成カード */}
				<a
					href="/setup"
					className={`${UI_STYLE.card} border-dashed border-2 border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all min-h-[140px]`}
				>
					<span className="text-3xl font-bold mb-2">+</span>
					<span className={UI_STYLE.text.label}>New Character</span>
				</a>
			</div>
		</div>
	);
}