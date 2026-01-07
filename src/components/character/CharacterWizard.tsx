"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Loader2, Plus } from 'lucide-react';

interface CharacterWizardProps {
	onComplete?: () => void;
	onCancel?: () => void;
}

const WORLDS = [
	"Asura", "Bahamut", "Bismarck", "Carbuncle", "Cerberus",
	"Fenrir", "Lakshmi", "Leviathan", "Odin", "Phoenix",
	"Quetzalcoatl", "Ragnarok", "Shiva", "Siren", "Sylph", "Valefor"
];

// FF11の種族リスト
const RACES = [
	{ id: "Hume", name: "ヒューム" },
	{ id: "Elvaan", name: "エルヴァーン" },
	{ id: "Tarutaru", name: "タルタル" },
	{ id: "Mithra", name: "ミスラ" },
	{ id: "Galka", name: "ガルカ" },
];

interface AccountWithWorld {
	id: string;
	name: string;
	suggestedWorld?: string;
}

export function CharacterWizard({ onComplete, onCancel }: CharacterWizardProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [name, setName] = useState('');
	const [world, setWorld] = useState('');
	const [race, setRace] = useState('Hume'); // 種族の状態を追加
	const [selectedAccountId, setSelectedAccountId] = useState<string>('new');
	const [newAccountName, setNewAccountName] = useState('');
	const [accounts, setAccounts] = useState<AccountWithWorld[]>([]);

	const router = useRouter();
	const supabase = createClient();

	useEffect(() => {
		async function loadInitialData() {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) return;

			const { data: accData } = await supabase
				.from('game_accounts')
				.select(`id, name, characters ( world )`)
				.eq('user_id', user.id)
				.order('created_at', { ascending: true });

			if (accData) {
				const formattedAccounts = accData.map(acc => ({
					id: acc.id,
					name: acc.name,
					suggestedWorld: acc.characters?.[0]?.world
				}));

				setAccounts(formattedAccounts);

				if (formattedAccounts.length > 0) {
					const firstAcc = formattedAccounts[0];
					setSelectedAccountId(firstAcc.id);
					if (firstAcc.suggestedWorld) setWorld(firstAcc.suggestedWorld);
				}
			}
		}
		loadInitialData();
	}, [supabase]);

	const handleAccountChange = (accId: string) => {
		setSelectedAccountId(accId);
		if (accId === 'new') {
			const anyWorld = accounts.find(a => a.suggestedWorld)?.suggestedWorld;
			if (anyWorld) setWorld(anyWorld);
		} else {
			const targetAcc = accounts.find(a => a.id === accId);
			if (targetAcc?.suggestedWorld) setWorld(targetAcc.suggestedWorld);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const { data: { user }, error: userError } = await supabase.auth.getUser();
			if (userError || !user) throw new Error("認証に失敗しました。");

			let finalAccountId = selectedAccountId;

			if (selectedAccountId === 'new') {
				if (!newAccountName) throw new Error("アカウント名を入力してください。");
				const { data: accData, error: accError } = await supabase
					.from('game_accounts')
					.insert({ user_id: user.id, name: newAccountName })
					.select().single();
				if (accError) throw accError;
				finalAccountId = accData.id;
			}

			// 性別の自動判定（ミスラなら女性、ガルカなら男性、他は一旦男性をデフォルトに）
			const gender = race === 'Mithra' ? 'Female' : 'Male';

			const { error: insertError } = await supabase
				.from('characters')
				.insert({
					user_id: user.id,
					account_id: finalAccountId,
					name: name,
					world: world,
					race: race,
					gender: gender,
				});

			if (insertError) throw insertError;
			if (onComplete) onComplete();
			router.refresh();
		} catch (err: any) {
			setError(err.message || '登録に失敗しました');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6 py-2">
			{error && (
				<div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md italic">
					⚠️ {error}
				</div>
			)}

			<div className="space-y-4">
				{/* アカウント選択 */}
				<div className="grid w-full items-center gap-1.5 p-4 border rounded-lg bg-muted/20">
					<Label className="text-xs font-bold uppercase text-muted-foreground">Account Setting</Label>
					<Select value={selectedAccountId} onValueChange={handleAccountChange}>
						<SelectTrigger className="bg-background">
							<SelectValue placeholder="アカウントを選択" />
						</SelectTrigger>
						<SelectContent>
							{accounts.map((acc) => (
								<SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
							))}
							<SelectItem value="new" className="text-blue-600 font-bold">
								<span className="flex items-center gap-1">
									<Plus className="w-3 h-3" /> 新規アカウント作成
								</span>
							</SelectItem>
						</SelectContent>
					</Select>

					{selectedAccountId === 'new' && (
						<div className="mt-2 space-y-2 animate-in fade-in slide-in-from-top-1">
							<Input
								placeholder="アカウント名を入力 (例: Main, Mule1...)"
								value={newAccountName}
								onChange={(e) => setNewAccountName(e.target.value)}
								required={selectedAccountId === 'new'}
							/>
						</div>
					)}
				</div>

				<div className="grid grid-cols-2 gap-4">
					{/* 種族選択 */}
					<div className="grid w-full items-center gap-1.5">
						<Label htmlFor="race" className="text-xs font-bold uppercase text-muted-foreground ml-1">Race</Label>
						<Select value={race} onValueChange={setRace}>
							<SelectTrigger id="race" className="bg-background">
								<SelectValue placeholder="種族を選択" />
							</SelectTrigger>
							<SelectContent>
								{RACES.map((r) => (
									<SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* ワールド選択 */}
					<div className="grid w-full items-center gap-1.5">
						<Label htmlFor="world" className="text-xs font-bold uppercase text-muted-foreground ml-1">World</Label>
						<Select value={world} onValueChange={setWorld} required disabled={loading}>
							<SelectTrigger id="world" className="bg-background">
								<SelectValue placeholder="サーバーを選択" />
							</SelectTrigger>
							<SelectContent>
								{WORLDS.map((w) => (
									<SelectItem key={w} value={w}>{w}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* キャラクター名 */}
				<div className="grid w-full items-center gap-1.5">
					<Label htmlFor="name" className="text-xs font-bold uppercase text-muted-foreground ml-1">Character Name</Label>
					<Input
						id="name"
						placeholder="例: Tarutaru"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						disabled={loading}
						className="bg-background"
					/>
				</div>
			</div>

			<div className="flex justify-end gap-3 pt-4 border-t">
				{onCancel && (
					<Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
						キャンセル
					</Button>
				)}
				<Button type="submit" disabled={loading || !name || !world || (selectedAccountId === 'new' && !newAccountName)}>
					{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					キャラクターを登録
				</Button>
			</div>
		</form>
	);
}