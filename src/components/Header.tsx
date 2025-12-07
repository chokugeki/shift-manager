'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CloudSyncModal } from './CloudSyncModal';

export const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-gray-800 hover:text-gray-600">

                </Link>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        データ共有
                    </button>
                </div>
            </div>

            <CloudSyncModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </header>
    );
};
