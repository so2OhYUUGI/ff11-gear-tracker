'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import AccountStep from './steps/AccountStep';
import IdentityStep from './steps/IdentityStep';
import { GameAccount } from '@/lib/types';

export default function CharacterWizard({ accounts }: { accounts: GameAccount[] }) {
	const supabase = createClient();
	const router = useRouter();

	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [selectedAccountId, setSelectedAccountId] = useState('');
	const [newAccountName, setNewAccountName] = useState('');
	const [formData, setFormData] = useState({ name: '', world: '', race: '', gender: '' });

	const handleFormChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async () => {
		setLoading(true);
		try {
			// 0. 現在のログインユーザーを取得（必須！）
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) throw new Error('User not found');

			let accountId = selectedAccountId;

			// 1. 新規アカウント作成が必要な場合
			if (!accountId && newAccountName) {
				const { data: newAcc, error: accError } = await supabase
					.from('game_accounts')
					.insert({
						name: newAccountName,
						user_id: user.id // アカウントにもuser_idを紐付け
					})
					.select()
					.single();

				if (accError) throw accError;
				accountId = newAcc.id;
			}

			// 2. キャラクター登録
			const { error: charError } = await supabase.from('characters').insert({
				user_id: user.id,          // ★ここが抜けていた可能性が高いです
				game_account_id: accountId,
				name: formData.name,
				world: formData.world,
				race: formData.race,
				gender: formData.gender,
				last_job_code: 'WAR'
			});

			if (charError) throw charError;

			// 成功時
			router.push('/');
			router.refresh();
		} catch (err: any) {
			// エラーの詳細をコンソールに出力して原因を突き止めやすくする
			console.error('Registration Error:', err.message || err);
			alert(`登録に失敗しました: ${err.message || '不明なエラー'}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto">
			{step === 1 ? (
				<AccountStep
					accounts={accounts}
					selectedAccountId={selectedAccountId}
					onSelect={setSelectedAccountId}
					newAccountName={newAccountName}
					onNewAccountNameChange={setNewAccountName}
					onNext={() => setStep(2)}
				/>
			) : (
				<IdentityStep
					formData={formData}
					onChange={handleFormChange}
					onBack={() => setStep(1)}
					onSubmit={handleSubmit}
					isSubmitting={loading}
				/>
			)}
		</div>
	);
}