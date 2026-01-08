import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UI_STYLE } from "@/lib/styles";
import Navigation from "@/components/layout/Navigation";
import AppHeader from "@/components/layout/AppHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FF11 Gear Tracker",
  description: "Manage your RME/AF gear progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* inter.className を body に適用することでフォントを維持 */}
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <div className={UI_STYLE.shell.wrapper}>
          {/* サイドバー/ボトムナビ */}
          <Navigation />

          <div className={UI_STYLE.shell.main}>
            {/* 共通ヘッダー：ログインユーザー情報は AppHeader 内部で取得可能 */}
            <AppHeader />

            {/* メインコンテンツエリア：スクロール管理をここで行う */}
            <main className={UI_STYLE.shell.content}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}