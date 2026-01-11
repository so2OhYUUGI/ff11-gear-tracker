// src/app/settings/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Cog, Database, Users } from 'lucide-react';
import Link from 'next/link';

// 管理者専用リンクのコンポーネント
// サーバーサイドで権限をチェックし、管理者であればリンクを表示する
async function AdminLink() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- Start Debug ---
  console.log('[AdminLink Debug] Checking user state...');
  if (!user) {
    console.log('[AdminLink Debug] No user found. Hiding link.');
    return null;
  }
  console.log(`[AdminLink Debug] User found. ID: ${user.id}`);
  // --- End Debug ---

  const { data: userRole, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  // --- Start Debug ---
  console.log(`[AdminLink Debug] Querying user_roles for user_id: ${user.id}`);
  if (error) {
      console.error('[AdminLink Debug] Error fetching user role:', error.message);
  }
  console.log('[AdminLink Debug] Fetched user role data:', userRole);
  // --- End Debug ---

  if (userRole?.role !== 'admin') {
    // --- Start Debug ---
    console.log(`[AdminLink Debug] Role is '${userRole?.role}'. Not 'admin'. Hiding link.`);
    // --- End Debug ---
    return null; // 管理者でなければ何も表示しない
  }

  // --- Start Debug ---
  console.log('[AdminLink Debug] User is admin. Showing link.');
  // --- End Debug ---

  // 管理者であればリンクを表示
  return (
    <Link href="/admin/items" className="card flex items-center justify-between hover:border-yellow-500 transition-colors group">
      <div>
        <div className="font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
          <Database size={16} />
          <span>Master Data Management</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">アイテムマスターの管理（管理者専用）</div>
      </div>
      <span className="text-slate-300 group-hover:text-yellow-500 transition-colors">➔</span>
    </Link>
  );
}

// 設定ページのメインコンポーネント
export default function SettingsPage() {
  return (
    <div className="page-container page-wrapper">
      <header className="mb-10">
        <h1 className="main-title flex items-center gap-3"><Cog />App Settings</h1>
        <p className="page-description">アプリとデータの管理</p>
      </header>

      <div className="grid gap-4 ">
        {/* ゲームアカウント管理へのリンク */}
        <Link href="/accounts" className="card flex items-center justify-between hover:border-blue-500 transition-colors group">
          <div>
            <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Users size={16} />
              <span>Game Account Management</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">ゲームアカウントの追加・削除・色設定</div>
          </div>
          <span className="text-slate-300 group-hover:text-blue-500 transition-colors">➔</span>
        </Link>

        {/* 管理者専用リンク（サーバーコンポーネント） */}
        <AdminLink />

        {/* 将来の設定項目 */}
        <div className="card opacity-50 cursor-not-allowed">
          <div className="font-bold text-slate-400">Display Preferences (Coming Soon)</div>
        </div>
      </div>
    </div>
  );
}
