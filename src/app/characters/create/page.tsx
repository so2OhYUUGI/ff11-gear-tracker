import CharacterWizard from '@/components/character/CharacterWizard';
import { createClient } from '@/utils/supabase/server'; // プロジェクトの構成に合わせて調整してください
import { redirect } from 'next/navigation';

export default async function CreateCharacterPage() {
	// サーバーサイドでの認証チェック (推奨)
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) {
		redirect('/login');
	}

	return (
		<div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
			<div className="w-full max-w-2xl">
				<h1 className="text-3xl font-bold text-center text-slate-100 mb-8">
					Create New Character
				</h1>
				{/* ウィザードコンポーネントの呼び出し */}
				<CharacterWizard />
			</div>
		</div>
	);
}