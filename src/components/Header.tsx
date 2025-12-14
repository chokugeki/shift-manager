'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export const Header = () => {
    const { user, signOut } = useAuth();

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-gray-800 hover:text-gray-600">
                    チャート式シフト管理システム
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <span className="text-sm text-gray-600 hidden md:inline-block mr-4 border-r pr-4 border-gray-300">
                                {user.email}
                            </span>
                            <button
                                onClick={() => signOut()}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                            >
                                ログアウト
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                        >
                            ログイン
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};
