
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// Note: このコンポーネントは意図的にReact Server Componentとして作成しています。
// サーバーサイドでユーザーの役割を確認し、権限がない場合はクライアントにページを送信する前にリダイレクトさせるためです。
export default async function AdminItemsPage() {
  const supabase = await createClient(); // <--- await を追加しました！

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // user_rolesテーブルから現在のユーザーのロールを取得
  const { data: userRole, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  // 管理者でない場合は、メインページにリダイレクト
  if (error || !userRole || userRole.role !== 'admin') {
    return redirect('/');
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">アイテム管理 (管理者専用)</h1>
      <p>このページは管理者のみがアクセスできます。</p>
      {/* 今後、ここにアイテム一覧やCRUD機能を追加していきます */}
    </div>
  );
}
