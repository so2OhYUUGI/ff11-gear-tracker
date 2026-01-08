'use client';

import { useState } from 'react';
import { UI_STYLE } from '@/lib/styles';
import { GameAccount } from '@/lib/types';

interface AccountStepProps {
	accounts: GameAccount[];
	selectedAccountId: string;
	onSelect: (id: string) => void;
	newAccountName: string;
	onNewAccountNameChange: (name: string) => void;
	onNext: () => void;
}

export default function AccountStep({
	accounts, selectedAccountId, onSelect, newAccountName, onNewAccountNameChange, onNext
}: AccountStepProps) {
	const [isCreatingNew, setIsCreatingNew] = useState(accounts.length === 0);

	return (
		<div className="space-y-6">
			<div>
				<h3 className={UI_STYLE.mainTitle}>Step 1: アカウント設定</h3>
				<p className={UI_STYLE.label}>キャラクターを紐付けるアカウントを選んでください</p>
			</div>

			<div className="space-y-4">
				{/* 既存アカウントリスト（ある場合のみ） */}
				{accounts.length > 0 && (
					<div className="grid gap-3">
						{accounts.map((acc) => (
							<button
								key={acc.id}
								onClick={() => {
									onSelect(acc.id);
									onNewAccountNameChange('');
									setIsCreatingNew(false);
								}}
								className={`${UI_STYLE.card} text-left border-2 ${!isCreatingNew && selectedAccountId === acc.id ? 'border-blue-500 bg-blue-50/50' : 'border-border'
									}`}
							>
								<div className="font-bold text-foreground">{acc.name}</div>
							</button>
						))}
					</div>
				)}

				<div className="relative py-4">
					<div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
					<div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-slate-400">または</span></div>
				</div>

				{/* 新規アカウント作成入力 */}
				<div className={`${UI_STYLE.card} ${isCreatingNew ? 'border-blue-500 bg-blue-50/50' : 'border-border'}`}>
					<label className={UI_STYLE.label}>新しいゲームアカウントを作成</label>
					<input
						type="text"
						className={UI_STYLE.input + " w-full mt-2"}
						placeholder="例: メイン垢 / 倉庫用"
						value={newAccountName}
						onChange={(e) => {
							onNewAccountNameChange(e.target.value);
							onSelect('');
							setIsCreatingNew(true);
						}}
					/>
				</div>
			</div>

			<button
				onClick={onNext}
				disabled={!selectedAccountId && !newAccountName}
				className={`${UI_STYLE.button} w-full`}
			>
				キャラクター情報の入力へ ➔
			</button>
		</div>
	);
}