
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
      <body className={`${inter.className} antialiased`}>
        <div className="app-shell-wrapper">
          <Navigation />
          <div className="app-shell-main">
            <AppHeader />
            <main className="app-shell-content">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
