import { login, signup } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react"; // アイコン
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// searchParams を受け取る (Next.js 15 の仕様に合わせる)
export default async function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ error?: string; message?: string }>;
}) {
	const { error, message } = await searchParams;

	return (
		<div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">FF11 Gear Tracker</CardTitle>
					<CardDescription className="text-center">
						アカウントにログインするか、新しく作成してください
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* --- エラーメッセージの表示 --- */}
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>エラー</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{/* --- 成功メッセージの表示 (新規登録時など) --- */}
					{message && (
						<Alert className="border-green-500 text-green-600">
							<CheckCircle2 className="h-4 w-4 stroke-green-600" />
							<AlertTitle>通知</AlertTitle>
							<AlertDescription>{message}</AlertDescription>
						</Alert>
					)}

					<form className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">メールアドレス</Label>
							<Input id="email" name="email" type="email" placeholder="name@example.com" required />
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">パスワード</Label>
							<Input id="password" name="password" type="password" required />
						</div>

						<div className="flex flex-col gap-2 pt-2">
							<Button formAction={login} className="w-full">ログイン</Button>
							<Button formAction={signup} variant="outline" className="w-full">新規登録</Button>
						</div>
					</form>
				</CardContent>

				<CardFooter>
					<p className="text-xs text-center w-full text-muted-foreground">
						※新規登録後は確認メールが送信されます。
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}