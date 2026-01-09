"use client";

import { useSearchParams } from "next/navigation";
import { login, signup } from "../actions";
import { UI_STYLE } from "@/lib/styles";
import { Suspense } from "react";

function LoginForm() {
	const searchParams = useSearchParams();
	const message = searchParams.get("message");
	const error = searchParams.get("error");

	return (
		<div className={`${UI_STYLE.container} flex items-center justify-center min-h-[80vh]`}>
			<div className={`${UI_STYLE.card} w-full max-w-md p-8 bg-slate-900/80`}>
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-black italic tracking-tighter text-white drop-shadow-md">
						FF11 GEAR TRACKER
					</h1>
					<p className={UI_STYLE.text.label + " opacity-50 uppercase tracking-widest mt-1"}>
						Authentication Required
					</p>
				</div>

				{/* エラー表示（Alertコンポーネントの代わり） */}
				{(error || message) && (
					<div className="mb-6 border-l-4 border-red-600 bg-red-950/30 p-4 animate-in fade-in slide-in-from-top-1">
						<div className={`${UI_STYLE.label} text-red-500 mb-1 flex items-center gap-2`}>
							<span className="text-xs">●</span> SYSTEM MESSAGE
						</div>
						<div className={`${UI_STYLE.text.tiny} text-slate-200 leading-relaxed`}>
							{error || message}
						</div>
					</div>
				)}

				<form className="space-y-6">
					<div className="space-y-2">
						<label htmlFor="email" className={UI_STYLE.label}>
							Email Address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="vana_diel@example.com"
							required
							className={UI_STYLE.input}
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="password" className={UI_STYLE.label}>
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							className={UI_STYLE.input}
						/>
					</div>

					<div className="flex flex-col gap-3 pt-4">
						<button
							formAction={login}
							className={`${UI_STYLE.button.primary} w-full py-3`}
						>
							ログイン
						</button>
						<button
							formAction={signup}
							className={`${UI_STYLE.button.secondary} w-full py-3`}
						>
							新規登録
						</button>
					</div>
				</form>

				<div className="mt-8 text-center">
					<p className={`${UI_STYLE.text.tiny} opacity-30`}>
						&copy; 2024 FF11 Gear Tracker / Developed by so2
					</p>
				</div>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={<div className={UI_STYLE.container}>Loading...</div>}>
			<LoginForm />
		</Suspense>
	);
}