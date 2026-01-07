'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { CharacterFormData } from '@/types/database'; // パスは環境に合わせて調整

const WORLDS = [
	'Asura', 'Bahamut', 'Odin', 'Shiva', 'Sylph', 'Valefor',
	'Ragnarok', 'Cerberus', 'Bismarck', 'Lakshmi', 'Phoenix',
	'Carbuncle', 'Fenrir', 'Siren', 'Quetzalcoatl', 'Leviathan'
];

const RACES = ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'];

export default function CharacterWizard() {
	const supabase = createClientComponentClient();
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState<CharacterFormData>({
		account_label: '', // Step 1
		name: '',          // Step 1
		world: 'Asura',    // Step 1
		race: 'Hume',      // Step 2
		gender: 'Male',    // Step 2
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleNext = () => setStep(prev => prev + 1);
	const handleBack = () => setStep(prev => prev - 1);

	const handleSubmit = async () => {
		setLoading(true);
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) throw new Error('User not found');

			const { error } = await supabase
				.from('characters')
				.insert({
					user_id: user.id,
					name: formData.name,
					world: formData.world,
					account_label: formData.account_label || null,
					race: formData.race,
					gender: formData.gender
				});

			if (error) throw error;

			// 作成成功後のリダイレクト（ダッシュボードなどへ）
			router.push('/dashboard');
			router.refresh();

		} catch (error) {
			console.error('Error creating character:', error);
			alert('キャラクター作成に失敗しました');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
			<h2 className="text-xl font-bold text-slate-100 mb-6 flex justify-between items-center">
				<span>新規キャラクター作成</span>
				<span className="text-sm font-normal text-slate-400">Step {step}/2</span>
			</h2>

			{/* --- STEP 1: 基本情報 --- */}
			{step === 1 && (
				<div className="space-y-4">
					<div>
						<label className="block text-sm text-slate-400 mb-1">アカウント名 (任意)</label>
						<input
							type="text"
							name="account_label"
							value={formData.account_label}
							onChange={handleChange}
							placeholder="例: メイン垢, 倉庫ちゃん"
							className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-slate-100 focus:border-blue-500 outline-none"
						/>
						<p className="text-xs text-slate-500 mt-1">複数アカウントをお持ちの場合の識別に便利です。</p>
					</div>

					<div>
						<label className="block text-sm text-slate-400 mb-1">キャラクター名 <span className="text-red-500">*</span></label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-slate-100 focus:border-blue-500 outline-none"
						/>
					</div>

					<div>
						<label className="block text-sm text-slate-400 mb-1">ワールド <span className="text-red-500">*</span></label>
						<select
							name="world"
							value={formData.world}
							onChange={handleChange}
							className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-slate-100 focus:border-blue-500 outline-none"
						>
							{WORLDS.map(w => <option key={w} value={w}>{w}</option>)}
						</select>
					</div>
				</div>
			)}

			{/* --- STEP 2: 種族・性別 --- */}
			{step === 2 && (
				<div className="space-y-4">
					<div>
						<label className="block text-sm text-slate-400 mb-1">種族</label>
						<select
							name="race"
							value={formData.race}
							onChange={handleChange}
							className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-slate-100 focus:border-blue-500 outline-none"
						>
							{RACES.map(r => <option key={r} value={r}>{r}</option>)}
						</select>
					</div>

					<div>
						<label className="block text-sm text-slate-400 mb-1">性別</label>
						<div className="flex gap-4">
							<label className="flex items-center space-x-2 cursor-pointer">
								<input
									type="radio"
									name="gender"
									value="Male"
									checked={formData.gender === 'Male'}
									onChange={handleChange}
									className="accent-blue-500"
								/>
								<span className="text-slate-200">Male</span>
							</label>
							<label className="flex items-center space-x-2 cursor-pointer">
								<input
									type="radio"
									name="gender"
									value="Female"
									checked={formData.gender === 'Female'}
									onChange={handleChange}
									className="accent-pink-500"
								/>
								<span className="text-slate-200">Female</span>
							</label>
						</div>
						{/* ガルカ・ミスラ用の補足（UX向上） */}
						{formData.race === 'Galka' && formData.gender === 'Female' && (
							<p className="text-xs text-amber-500 mt-1">※設定上、ガルカに女性はいませんが選択は可能です。</p>
						)}
						{formData.race === 'Mithra' && formData.gender === 'Male' && (
							<p className="text-xs text-amber-500 mt-1">※設定上、ミスラの男性は極めて稀ですが選択は可能です。</p>
						)}
					</div>
				</div>
			)}

			{/* --- ナビゲーションボタン --- */}
			<div className="flex justify-between mt-8 pt-4 border-t border-slate-700">
				{step > 1 ? (
					<button
						onClick={handleBack}
						className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition"
					>
						戻る
					</button>
				) : (
					<div></div> // スペーサー
				)}

				{step < 2 ? (
					<button
						onClick={handleNext}
						disabled={!formData.name} // 名前必須チェック
						className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
					>
						次へ
					</button>
				) : (
					<button
						onClick={handleSubmit}
						disabled={loading}
						className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium disabled:opacity-50 transition flex items-center"
					>
						{loading ? '作成中...' : '冒険を始める'}
					</button>
				)}
			</div>
		</div>
	);
}