"use client";

import { useSearchParams } from "next/navigation";
import { requestPasswordReset } from "@/app/actions";

export default function ForgotPasswordForm({ onBackToLogin }: { onBackToLogin: () => void }) {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const error = searchParams.get("error");

  return (
    <div className="w-full">
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-black italic tracking-tighter text-white drop-shadow-md">
                FF11 GEAR TRACKER
            </h1>
            <p className="form-label opacity-50 uppercase tracking-widest mt-1">
                パスワードをリセット
            </p>
        </div>

        {(error || message) && (
            <div className="mb-6 border-l-4 border-red-600 bg-red-950/30 p-4 animate-in fade-in slide-in-from-top-1">
                <div className="form-label text-red-500 mb-1 flex items-center gap-2">
                    <span className="text-xs">●</span> SYSTEM MESSAGE
                </div>
                <div className="text-tiny text-slate-200 leading-relaxed">
                    {error || message}
                </div>
            </div>
        )}

        <form>
            <div className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="email" className="form-label">
                        メールアドレス
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="vana_diel@example.com"
                        required
                        className="form-input"
                    />
                </div>
            </div>

            <div className="mt-8 flex flex-col gap-4">
                <button 
                    formAction={requestPasswordReset}
                    className="btn btn-primary w-full py-3"
                >
                    リセット用リンクを送信
                </button>
            </div>

            <div className="my-6 flex items-center gap-4" aria-hidden="true">
                <hr className="w-full border-t border-slate-700/50" />
            </div>

            <div className="flex flex-col items-center">
                <button
                    type="button"
                    onClick={onBackToLogin}
                    className="btn btn-secondary w-4/5 py-3"
                >
                    ログイン画面に戻る
                </button>
            </div>
        </form>

        <div className="mt-8 text-center">
            <p className="text-tiny opacity-30">
                &copy; 2024 FF11 Gear Tracker / Developed by so2
            </p>
        </div>
    </div>
  );
}
