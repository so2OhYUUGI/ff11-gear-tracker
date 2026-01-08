'use client';

import { useRouter } from "next/navigation";
import { UI_STYLE } from "@/lib/styles";

interface Character {
	id: string;
	name: string;
	world: string;
}

export default function CharacterManager({ initialCharacters }: { initialCharacters: Character[] }) {
	const router = useRouter();

	const handleSelectCharacter = (id: string) => {
		// 装備管理ページへ遷移（クエリパラメータでキャラを指定）
		router.push(`/gear?charId=${id}`);
	};

	return (
		<div className="space-y-6">
			<header>
				<h2 className={UI_STYLE.sectionTitleText}>Characters</h2>
				<p className={UI_STYLE.label}>管理するキャラクターを選択してトラッカーを開く</p>
			</header>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{initialCharacters.map((char) => (
					<button
						key={char.id}
						onClick={() => handleSelectCharacter(char.id)}
						className={`${UI_STYLE.card} ${UI_STYLE.cardInactive} text-left hover:${UI_STYLE.cardActive} transition-all group flex flex-col justify-between min-h-[120px]`}
					>
						<div>
							<div className={UI_STYLE.text.label}>{char.world}</div>
							<h2 className="text-xl font-black text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 transition-colors">
								{char.name}
							</h2>
						</div>
						<div className={`${UI_STYLE.text.tiny} text-primary font-black self-end tracking-widest`}>
							Open Tracker ➔
						</div>
					</button>
				))}

				<a
					href="/setup"
					className={`${UI_STYLE.card} border-dashed border-2 border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all min-h-[120px]`}
				>
					<span className="text-3xl font-bold mb-2">+</span>
					<span className={UI_STYLE.text.label}>New Character</span>
				</a>
			</div>
		</div>
	);
}