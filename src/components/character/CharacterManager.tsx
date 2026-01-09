'use client';

import { useRouter } from "next/navigation";
import { UI_STYLE } from "@/lib/styles";

interface CharacterManagerProps {
	groupedCharacters: Record<string, { name: string, color: string, chars: any[] }>;
}

export default function CharacterManager({ groupedCharacters }: CharacterManagerProps) {
	const router = useRouter();

	const allCharacters = Object.entries(groupedCharacters).flatMap(([accountId, group]) =>
		group.chars.map(char => ({
			...char,
			accountName: group.name,
			accountColor: group.color
		}))
	);

	return (
		<div className="space-y-6">
			<header className="px-1">
				<h2 className={UI_STYLE.sectionTitleText}>Characters</h2>
				<p className={UI_STYLE.label}>キャラクター名が長い場合も折り返して表示されます</p>
			</header>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{allCharacters.map((char) => (
					<button
						key={char.id}
						onClick={() => router.push(`/gear?charId=${char.id}`)}
						className={`${UI_STYLE.card} ${UI_STYLE.characterCard.wrapper} relative`}
						style={{
							borderTopColor: char.accountColor,
							boxShadow: `0 4px 14px -2px ${char.accountColor}33`,
						} as React.CSSProperties}
					>
						{/* アカウントバッジ：左上に絶対配置 */}
						<div
							className={UI_STYLE.characterCard.accountBadge}
							style={{
								backgroundColor: char.accountColor,
								position: 'absolute',
								top: '0.75rem',
								left: '0.75rem',
								margin: 0,
								zIndex: 10
							}}
						>
							{char.accountName}
						</div>

						{/* コンテンツエリア：バッジとの重なりを防ぐため上部に余白を確保 */}
						<div className="w-full pt-6">

							{/* ワールド：名前の上に移動 */}
							<div className={`${UI_STYLE.characterCard.world} mb-1`}>
								{char.world}
							</div>

							{/* 名前エリア */}
							<h4 className={UI_STYLE.characterCard.name}>
								{char.name}
							</h4>

							{/* ジョブバッジ：名前の下に配置 */}
							<div className="flex justify-center mt-2">
								<div
									className={UI_STYLE.characterCard.jobBadge}
									style={{
										position: 'static',
										transform: 'none',
										margin: 0
									}}
								>
									{char.last_job_code || 'WAR'}
								</div>
							</div>
						</div>

						<div className="flex justify-end items-center mt-2">
							<span className={UI_STYLE.characterCard.selectText}>
								SELECT ➔
							</span>
						</div>
					</button>
				))}

				<a
					href="/characters/create"
					className={`${UI_STYLE.card} border-dashed border-2 border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all min-h-[140px] opacity-60 hover:opacity-100`}
				>
					<span className="text-2xl font-bold">+</span>
					<span className={UI_STYLE.text.label}>New Character</span>
				</a>
			</div>
		</div>
	);
}