
'use client';

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AppHeader({ email }: { email?: string }) {
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="flex items-center gap-2">
          <Link href="/" className="app-header__logo">FF11 Tracker</Link>
          {email && <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">| {email}</span>}
        </div>

        <div className="flex items-center gap-3">
          {/* 設定ページへのリンクを追加 */}
          <Link
            href="/settings"
            className="text-slate-400 hover:text-blue-500 transition-colors p-1"
            title="アプリ設定"
          >
            <span className="text-lg">⚙️</span>
          </Link>

          <button
            onClick={handleLogout}
            className="app-header__logout-button"
          >
            LOGOUT ⎋
          </button>
        </div>
      </div>
    </header>
  );
}
