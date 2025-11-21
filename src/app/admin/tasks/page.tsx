'use client';

import React, { useState } from 'react';
import { useShiftContext } from '@/context/ShiftContext';
import Link from 'next/link';

export default function TaskAdminPage() {
    const { taskTypes, addTaskType, updateTaskType } = useShiftContext();
    const [newName, setNewName] = useState('');
    const [newDuration, setNewDuration] = useState(60);
    const [newColor, setNewColor] = useState('#FFB74D');
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        if (editingId) {
            updateTaskType({
                id: editingId,
                name: newName,
                duration: newDuration,
                color: newColor,
            });
            setEditingId(null);
            // Reset all when finishing edit
            setNewName('');
            setNewDuration(60);
            setNewColor('#FFB74D');
        } else {
            addTaskType({
                id: `task-${Date.now()}`,
                name: newName,
                duration: newDuration,
                color: newColor,
            });
            // Only reset name when adding new, preserve duration and color
            setNewName('');
        }
    };

    const handleEdit = (t: { id: string; name: string; duration: number; color: string }) => {
        setEditingId(t.id);
        setNewName(t.name);
        setNewDuration(t.duration);
        setNewColor(t.color);
    };

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="page-title mb-0">業務内容登録</h1>
                <Link href="/" className="text-blue-600 hover:underline">トップへ戻る</Link>
            </div>

            <div className="card mb-8">
                <h2 className="section-title">{editingId ? '業務編集' : '新規業務追加'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="control-group md:col-span-2">
                        <label>業務名</label>
                        <input
                            type="text"
                            className="form-input"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="業務名を入力"
                        />
                    </div>
                    <div className="control-group">
                        <label>所要時間 (分)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={newDuration}
                            onChange={(e) => setNewDuration(Number(e.target.value))}
                            step={30}
                            min={30}
                        />
                    </div>
                    <div className="control-group">
                        <label>色</label>
                        <input
                            type="color"
                            className="form-input h-10 w-full p-1"
                            value={newColor}
                            onChange={(e) => setNewColor(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-4 flex justify-end gap-2">
                        {editingId && (
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => {
                                    setEditingId(null);
                                    setNewName('');
                                    setNewDuration(60);
                                    setNewColor('#FFB74D');
                                }}
                            >
                                キャンセル
                            </button>
                        )}
                        <button type="submit" className="btn btn-primary">
                            {editingId ? '更新' : '追加'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="card">
                <h2 className="section-title">業務一覧</h2>
                <div className="task-list-grid">
                    {taskTypes.map((t) => (
                        <div
                            key={t.id}
                            className="task-item-card cursor-pointer hover:shadow-md transition-shadow"
                            style={{ borderLeft: `4px solid ${t.color}` }}
                            onClick={() => handleEdit(t)}
                        >
                            <div className="font-bold">{t.name}</div>
                            <div className="text-sm text-gray-600">{t.duration}分</div>
                            <div className="text-xs text-blue-500 mt-2">クリックして編集</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="actions-row mt-8 text-center">
                <Link href="/" className="text-blue-600 hover:underline">
                    トップへ戻る
                </Link>
            </div>
        </div>
    );
}
