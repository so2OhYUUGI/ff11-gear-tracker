'use client';

import { UI_STYLE } from "@/lib/styles";
import { getColorByIndex } from "@/lib/colors";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AccountList({ initialAccounts }: { initialAccounts: any[] }) {
	const supabase = createClient();
	const router = useRouter();

	const handleDelete = async (id: string, name: string) => {
		if (!confirm(`アカウント「${name}」を削除しますか？\n紐付いているキャラクターも削除される可能性があります。`)) return;

		const { error } = await supabase.from('game_accounts').delete().eq('id', id);
		if (!error) router.refresh();
	};

	return (
		<div className="space-y-4">
			{initialAccounts.map((acc, index) => {
				// ポータルと同じ順序（index）で色を決定
				const displayColor = acc.color_code || getColorByIndex(index);

				return (
					<div
						key={acc.id}
						className={`${UI_STYLE.card} ${UI_STYLE.accountRow.container}`}
						style={{ borderLeftColor: displayColor }}
					>
						{/* 左側：アカウント基本情報 */}
						<div className={UI_STYLE.accountRow.info}>
							<div
								className={UI_STYLE.accountRow.colorPreview}
								style={{ backgroundColor: displayColor }}
							>
								{index + 1}
							</div>
							<div>
								<div className={UI_STYLE.accountRow.name}>{acc.name}</div>
								<div className={UI_STYLE.accountRow.meta}>
									ID: {acc.id.split('-')[0]}... (Created: {new Date(acc.created_at).toLocaleDateString()})
								</div>
							</div>
						</div>

						{/* 中央：統計情報（紐付けキャラ数） */}
						<div className={UI_STYLE.accountRow.stats}>
							<div className="text-center">
								<div className={UI_STYLE.text.label}>Chars</div>
								<div className="font-black text-xl text-blue-500">
									{acc.characters?.length || 0}
								</div>
							</div>
						</div>

						{/* 右側：操作 */}
						<div className={UI_STYLE.accountRow.actions}>
							<button
								onClick={() => handleDelete(acc.id, acc.name)}
								className="p-2 text-slate-300 hover:text-red-500 transition-colors"
								title="アカウント削除"
							>
								🗑️
							</button>
							<div className="text-slate-200">➔</div>
						</div>
					</div>
				);
			})}

			{initialAccounts.length === 0 && (
				<div className={UI_STYLE.modal.empty}>
					アカウントが登録されていません
				</div>
			)}
		</div>
	);
}