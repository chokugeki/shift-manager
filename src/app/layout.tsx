import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ShiftProvider } from "@/context/ShiftContext";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "チャート式シフト管理システム",
  description: "Chart-based Shift Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <ShiftProvider>
            <Header />
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
            <Toaster position="bottom-right" />
          </ShiftProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
