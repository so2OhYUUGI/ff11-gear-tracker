'use client';

import { UI_STYLE } from '@/lib/styles';
import { RACES, WORLDS, Race, Gender } from '@/lib/constants/identity';

interface IdentityStepProps {
	formData: { name: string; world: string; race: string; gender: string };
	onChange: (field: string, value: string) => void;
	onBack: () => void;
	onSubmit: () => void;
	isSubmitting: boolean;
}

export default function IdentityStep({ formData, onChange, onBack, onSubmit, isSubmitting }: IdentityStepProps) {

	const handleRaceChange = (race: string) => {
		onChange('race', race);
		// 性別の自動適用（初期値セット）
		if (race === 'Galka') {
			onChange('gender', 'Male');
		} else if (race === 'Mithra') {
			onChange('gender', 'Female');
		} else {
			onChange('gender', ''); // 他の種族は手動選択待ち
		}
	};

	// 特定の性別を選択不可にする判定ロジック
	const isGenderDisabled = (gender: Gender) => {
		if (!formData.race) return true; // 種族未選択時は両方無効
		if (formData.race === 'Galka' && gender === 'Female') return true;
		if (formData.race === 'Mithra' && gender === 'Male') return true;
		return false;
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className={UI_STYLE.mainTitle}>Step 2: キャラクター情報</h3>
				<p className={UI_STYLE.label}>ヴァナ・ディールでの詳細なアイデンティティ</p>
			</div>

			<div className="space-y-4">
				{/* 名前 */}
				<div>
					<label className={UI_STYLE.label}>名前</label>
					<input
						type="text"
						className={UI_STYLE.input + " w-full"}
						value={formData.name}
						onChange={(e) => onChange('name', e.target.value)}
						placeholder="Character Name"
					/>
				</div>

				{/* ワールド */}
				<div>
					<label className={UI_STYLE.label}>ワールド</label>
					<select
						className={UI_STYLE.input + " w-full"}
						value={formData.world}
						onChange={(e) => onChange('world', e.target.value)}
					>
						<option value="">選択してください</option>
						{WORLDS.map(w => <option key={w} value={w}>{w}</option>)}
					</select>
				</div>

				{/* 種族 */}
				<div>
					<label className={UI_STYLE.label}>種族</label>
					<select
						className={UI_STYLE.input + " w-full"}
						value={formData.race}
						onChange={(e) => handleRaceChange(e.target.value)}
					>
						<option value="">選択してください</option>
						{RACES.map(r => <option key={r} value={r}>{r}</option>)}
					</select>
				</div>

				{/* 性別選択（常に表示し、条件に応じて無効化） */}
				<div>
					<label className={UI_STYLE.label}>性別</label>
					<div className="flex gap-6 mt-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-border">
						{(['Male', 'Female'] as Gender[]).map(g => {
							const disabled = isGenderDisabled(g);
							return (
								<label
									key={g}
									className={`flex items-center gap-2 transition-all ${disabled
											? 'opacity-30 cursor-not-allowed filter grayscale'
											: 'cursor-pointer group'
										}`}
								>
									<input
										type="radio"
										name="gender"
										value={g}
										disabled={disabled}
										checked={formData.gender === g}
										onChange={(e) => onChange('gender', e.target.value)}
										className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 disabled:bg-slate-200"
									/>
									<span className={`text-sm font-bold ${formData.gender === g ? 'text-blue-600' : 'text-slate-500'
										}`}>
										{g}
									</span>
								</label>
							);
						})}
					</div>
					{formData.race === 'Galka' && <p className="text-[10px] text-slate-400 mt-1 italic">* ガルカは男性のみ選択可能です</p>}
					{formData.race === 'Mithra' && <p className="text-[10px] text-slate-400 mt-1 italic">* ミスラは女性のみ選択可能です</p>}
				</div>
			</div>

			<div className="flex gap-3 pt-4">
				<button onClick={onBack} className={UI_STYLE.buttonSecondary + " flex-1"}>戻る</button>
				<button
					onClick={onSubmit}
					disabled={isSubmitting || !formData.name || !formData.world || !formData.race || !formData.gender}
					className={`${UI_STYLE.button} flex-1`}
				>
					{isSubmitting ? '保存中...' : '登録完了'}
				</button>
			</div>
		</div>
	);
}