import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ShiftProvider } from "@/context/ShiftContext";

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
          {children}
        </ShiftProvider>
      </body>
    </html>
  );
}
