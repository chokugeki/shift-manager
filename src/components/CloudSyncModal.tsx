'use client';

import React, { useState, useEffect } from 'react';
import { useShiftContext } from '@/context/ShiftContext';

interface CloudSyncModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({ isOpen, onClose }) => {
    const { saveToCloud, loadFromCloud } = useShiftContext();
    const [apiKey, setApiKey] = useState('');
    const [binId, setBinId] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storedApiKey = localStorage.getItem('jsonbin_api_key');
        const storedBinId = localStorage.getItem('jsonbin_bin_id');
        if (storedApiKey) setApiKey(storedApiKey);
        if (storedBinId) setBinId(storedBinId);
    }, []);

    const handleSaveSettings = () => {
        localStorage.setItem('jsonbin_api_key', apiKey);
        localStorage.setItem('jsonbin_bin_id', binId);
        setMessage('設定を保存しました');
        setStatus('success');
        setTimeout(() => setStatus('idle'), 2000);
    };

    const handleCloudAction = async (action: 'save' | 'load') => {
        if (!apiKey || !binId) {
            setStatus('error');
            setMessage('API KeyとBin IDを設定してください');
            return;
        }

        setStatus('loading');
        setMessage(action === 'save' ? '保存中...' : '読み込み中...');

        try {
            if (action === 'save') {
                await saveToCloud(apiKey, binId);
                setMessage('クラウドに保存しました');
            } else {
                await loadFromCloud(apiKey, binId);
                setMessage('クラウドから読み込みました');
            }
            setStatus('success');
            // Save settings automatically on successful action
            handleSaveSettings();
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage('エラーが発生しました。IDを確認してください。');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">クラウド同期設定 (JSONBin)</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Master Key (X-Master-Key)
                        </label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="w-full border rounded p-2"
                            placeholder="API Keyを入力"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bin ID
                        </label>
                        <input
                            type="text"
                            value={binId}
                            onChange={(e) => setBinId(e.target.value)}
                            className="w-full border rounded p-2"
                            placeholder="Bin IDを入力"
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button
                            onClick={() => handleCloudAction('save')}
                            disabled={status === 'loading'}
                            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            クラウドへ保存
                        </button>
                        <button
                            onClick={() => handleCloudAction('load')}
                            disabled={status === 'loading'}
                            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-green-300"
                        >
                            クラウドから読込
                        </button>
                    </div>

                    {message && (
                        <div className={`p-2 rounded text-center text-sm ${status === 'error' ? 'bg-red-100 text-red-700' :
                                status === 'success' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-700'
                            }`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
