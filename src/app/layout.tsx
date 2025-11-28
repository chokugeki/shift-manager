import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ShiftProvider } from "@/context/ShiftContext";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "介護施設シフト管理システム",
  description: "Nursing Care Shift Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ShiftProvider>
          <Header />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </ShiftProvider>
      </body>
    </html>
  );
}
