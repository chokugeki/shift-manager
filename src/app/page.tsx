'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="main-title">チャート式シフト管理システム</h1>
        <p className="subtitle">
          シンプルで使いやすい、次世代のシフト管理ツール
        </p>
      </div>

      <div className="flex flex-col items-center gap-8 max-w-4xl w-full">
        {/* Row 1: Shift Management (Centered, Large) */}
        <Link href="/schedule" className="card hover:shadow-lg transition-shadow p-8 text-center w-full md:w-2/3 border-l-8 border-green-500">
          <div className="flex flex-col items-center">
            <div className="icon-circle green mb-4">
              <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">シフト作成・管理</h2>
            <p className="text-gray-600">月間シフトの作成と日次業務割り当て</p>
          </div>
        </Link>

        {/* Row 2: Requests (Centered, Medium) */}
        <Link href="/requests" className="card hover:shadow-lg transition-shadow p-6 text-center w-full md:w-1/2 border-l-8 border-blue-500">
          <div className="flex flex-col items-center">
            <div className="icon-circle blue mb-3">
              <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">休日希望入力</h2>
            <p className="text-gray-600 text-sm">職員の希望休を入力します</p>
          </div>
        </Link>

        {/* Row 3: Admin (Side by Side, Small) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-2/3">
          <Link href="/admin/staff" className="card hover:shadow-lg transition-shadow p-4 text-center border-l-4 border-purple-500 flex items-center justify-center gap-4">
            <div className="icon-circle purple w-10 h-10 min-w-[2.5rem]">
              <svg className="icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h2 className="text-lg font-bold">職員登録</h2>
              <p className="text-gray-500 text-xs">職員の追加・編集</p>
            </div>
          </Link>

          <Link href="/admin/tasks" className="card hover:shadow-lg transition-shadow p-4 text-center border-l-4 border-orange-500 flex items-center justify-center gap-4">
            <div className="icon-circle orange w-10 h-10 min-w-[2.5rem]">
              <svg className="icon w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="text-left">
              <h2 className="text-lg font-bold">業務内容登録</h2>
              <p className="text-gray-500 text-xs">業務の登録・編集</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
