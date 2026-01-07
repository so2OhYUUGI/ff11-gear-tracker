import { Button } from "@/components/ui/button";

export function UserHeader({ email }: { email?: string }) {
	return (
		<div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border border-border/60">
			<div className="min-w-0">
				<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Operator</p>
				<p className="text-xs font-bold truncate">{email}</p>
			</div>
			<form action="/auth/signout" method="post">
				<Button variant="ghost" size="sm" type="submit" className="h-7 text-[10px] uppercase font-bold">Sign Out</Button>
			</form>
		</div>
	);
}