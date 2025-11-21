'use client';

import React, { useState } from 'react';
import { useShiftContext } from '@/context/ShiftContext';
import Link from 'next/link';

export default function StaffAdminPage() {
    const { staff, addStaff, updateStaff, deleteStaff } = useShiftContext();
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        if (editingId) {
            updateStaff({ id: editingId, name: newName });
            setEditingId(null);
        } else {
            addStaff({
                id: `staff-${Date.now()}`,
                name: newName,
            });
        }
        setNewName('');
    };

    const handleEdit = (s: { id: string; name: string }) => {
        setEditingId(s.id);
        setNewName(s.name);
    };

    const handleDelete = (id: string) => {
        if (confirm('本当に削除しますか？')) {
            deleteStaff(id);
        }
    };

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="page-title mb-0">職員登録</h1>
                <Link href="/" className="text-blue-600 hover:underline">トップへ戻る</Link>
            </div>

            <div className="card mb-8">
                <h2 className="section-title">{editingId ? '職員編集' : '新規職員追加'}</h2>
                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                    <div className="control-group flex-1">
                        <label>氏名</label>
                        <input
                            type="text"
                            className="form-input"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="氏名を入力"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {editingId ? '更新' : '追加'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => {
                                setEditingId(null);
                                setNewName('');
                            }}
                        >
                            キャンセル
                        </button>
                    )}
                </form>
            </div>

            <div className="card">
                <h2 className="section-title">職員一覧</h2>
                <ul className="staff-list">
                    {staff.map((s) => (
                        <li key={s.id} className="staff-item flex justify-between items-center">
                            <span>{s.name}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(s)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    編集
                                </button>
                                <button
                                    onClick={() => handleDelete(s.id)}
                                    className="text-sm text-red-600 hover:underline"
                                >
                                    削除
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="actions-row mt-8 text-center">
                <Link href="/" className="text-blue-600 hover:underline">
                    トップへ戻る
                </Link>
            </div>
        </div>
    );
}
