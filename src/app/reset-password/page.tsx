"use client";

import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage("パスワードが正常にリセットされました。新しいパスワードでログインしてください。");
      // Optionally, redirect to login after a delay
      setTimeout(() => {
        router.push('/login');
      }, 5000);
    }
  };
  
  const code = searchParams.get('code');
  if (!code) {
    return (
        <div className="page-container flex-col items-center justify-center">
            <div className="card w-full max-w-md p-8 bg-slate-900/80 text-center">
                <h1 className="text-2xl font-bold mb-4">無効なリンク</h1>
                <p className="text-slate-300">このパスワードリセットリンクは無効か、有効期限が切れています。お手数ですが、もう一度リセットをリクエストしてください。</p>
                <button onClick={() => router.push('/login')} className="btn btn-primary mt-6">ログイン画面に戻る</button>
            </div>
        </div>
    );
  }


  return (
    <div className="page-container flex-col items-center justify-center">
        <div className="card w-full max-w-md p-8 bg-slate-900/80">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black italic tracking-tighter text-white drop-shadow-md">
                    パスワードの再設定
                </h1>
                <p className="form-label opacity-50 uppercase tracking-widest mt-1">
                    新しいパスワードを入力してください。
                </p>
            </div>

            {error && (
                <div className="mb-6 border-l-4 border-red-600 bg-red-950/30 p-4">
                    <p className="text-tiny text-red-400">{error}</p>
                </div>
            )}
            {message && (
                <div className="mb-6 border-l-4 border-green-600 bg-green-950/30 p-4">
                    <p className="text-tiny text-green-400">{message}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className='form-label' htmlFor="password">新しいパスワード</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="space-y-2">
                    <label className='form-label' htmlFor="confirmPassword">新しいパスワード（確認用）</label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="pt-4">
                    <button type="submit" className="btn btn-primary w-full py-3">
                        パスワードを更新
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}
