"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// プロジェクト標準のクライアントをインポート
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

interface CharacterWizardProps {
	onComplete?: () => void;
	onCancel?: () => void;
}

// FF11の主要なワールドリスト（必要に応じて追加してください）
const WORLDS = [
	"Asura", "Bahamut", "Bismarck", "Carbuncle", "Cerberus",
	"Fenrir", "Lakshmi", "Leviathan", "Odin", "Phoenix",
	"Quetzalcoatl", "Ragnarok", "Shiva", "Siren", "Sylph", "Valefor"
];

export function CharacterWizard({ onComplete, onCancel }: CharacterWizardProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [name, setName] = useState('');
	const [world, setWorld] = useState('');

	const router = useRouter();
	const supabase = createClient();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// 1. 現在のログインユーザーを取得
			const { data: { user }, error: userError } = await supabase.auth.getUser();
			if (userError || !user) throw new Error("認証に失敗しました。再ログインしてください。");

			// 2. キャラクターを登録
			const { error: insertError } = await supabase
				.from('characters')
				.insert({
					user_id: user.id,
					name: name,
					world: world,
				});

			if (insertError) throw insertError;

			// 3. 成功時の処理
			if (onComplete) {
				onComplete();
			} else {
				router.refresh();
			}
		} catch (err: any) {
			console.error('Character creation error:', err);
			setError(err.message || 'キャラクターの作成に失敗しました');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6 py-4">
			{error && (
				<div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
					{error}
				</div>
			)}

			<div className="space-y-4">
				<div className="grid w-full items-center gap-1.5">
					<Label htmlFor="name">キャラクター名</Label>
					<Input
						type="text"
						id="name"
						placeholder="Example: Tarutaru"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						disabled={loading}
					/>
				</div>

				<div className="grid w-full items-center gap-1.5">
					<Label htmlFor="world">ワールド (サーバー)</Label>
					<Select onValueChange={setWorld} required disabled={loading}>
						<SelectTrigger>
							<SelectValue placeholder="ワールドを選択してください" />
						</SelectTrigger>
						<SelectContent>
							{WORLDS.map((w) => (
								<SelectItem key={w} value={w}>
									{w}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="flex justify-end gap-3 pt-4">
				{onCancel && (
					<Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
						キャンセル
					</Button>
				)}
				<Button type="submit" disabled={loading || !name || !world}>
					{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					キャラクターを登録する
				</Button>
			</div>
		</form>
	);
}