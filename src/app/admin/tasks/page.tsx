'use client';

import React, { useState, useRef } from 'react';
import { useShiftContext } from '@/context/ShiftContext';
import Link from 'next/link';

export default function TaskAdminPage() {
    const { taskTypes, addTaskType, updateTaskType, deleteTaskType } = useShiftContext();
    const nameRef = useRef<HTMLInputElement>(null);
    const [newDuration, setNewDuration] = useState(60);
    const [newColor, setNewColor] = useState('#FFB74D');
    const [newTextColor, setNewTextColor] = useState('#000000');
    const [editingId, setEditingId] = useState<string | null>(null);

    // Calculate inverted color helper
    const getInvertedColor = (hex: string) => {
        // Remove hash if present
        hex = hex.replace('#', '');

        // Parse RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Invert
        const rInv = (255 - r).toString(16).padStart(2, '0');
        const gInv = (255 - g).toString(16).padStart(2, '0');
        const bInv = (255 - b).toString(16).padStart(2, '0');

        return `#${rInv}${gInv}${bInv}`;
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setNewColor(color);
        // Auto-set text color to inverted color when background changes
        setNewTextColor(getInvertedColor(color));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = nameRef.current?.value || '';
        if (!name.trim()) return;

        if (editingId) {
            updateTaskType({
                id: editingId,
                name: name,
                duration: newDuration,
                color: newColor,
                textColor: newTextColor,
            });
            setEditingId(null);
            // Reset all when finishing edit
            if (nameRef.current) nameRef.current.value = '';
            setNewDuration(60);
            setNewColor('#FFB74D');
            setNewTextColor('#000000');
        } else {
            addTaskType({
                id: `task-${Date.now()}`,
                name: name,
                duration: newDuration,
                color: newColor,
                textColor: newTextColor,
            });
            // Only reset name when adding new, preserve duration and color
            if (nameRef.current) nameRef.current.value = '';
        }
    };

    const handleEdit = (t: { id: string; name: string; duration: number; color: string; textColor?: string }) => {
        setEditingId(t.id);
        if (nameRef.current) nameRef.current.value = t.name;
        setNewDuration(t.duration);
        setNewColor(t.color);
        setNewTextColor(t.textColor || '#000000');
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
                    <div className="control-group md:col-span-1">
                        <label>業務名</label>
                        <input
                            type="text"
                            className="form-input"
                            ref={nameRef}
                            placeholder="業務名を入力"
                            autoComplete="off"
                        />
                    </div>
                    <div className="control-group">
                        <label>所要時間 (分)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={newDuration}
                            onChange={(e) => setNewDuration(Number(e.target.value))}
                            step={10}
                            min={10}
                        />
                    </div>
                    <div className="control-group">
                        <label>背景色</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="color"
                                className="form-input h-10 w-full p-1"
                                value={newColor}
                                onChange={handleColorChange}
                            />
                        </div>
                    </div>
                    <div className="control-group">
                        <label>文字色 (背景変更で自動反転)</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="color"
                                className="form-input h-10 w-full p-1"
                                value={newTextColor}
                                onChange={(e) => setNewTextColor(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="md:col-span-4 flex justify-end gap-2">
                        {editingId && (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-outline text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                                    onClick={() => {
                                        if (window.confirm('本当に削除しますか？')) {
                                            deleteTaskType(editingId);
                                            setEditingId(null);
                                            if (nameRef.current) nameRef.current.value = '';
                                            setNewDuration(60);
                                            setNewColor('#FFB74D');
                                            setNewTextColor('#000000');
                                        }
                                    }}
                                >
                                    削除
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => {
                                        setEditingId(null);
                                        if (nameRef.current) nameRef.current.value = '';
                                        setNewDuration(60);
                                        setNewColor('#FFB74D');
                                        setNewTextColor('#000000');
                                    }}
                                >
                                    キャンセル
                                </button>
                            </>
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
                            style={{
                                backgroundColor: t.color,
                                color: t.textColor || '#000000',
                                border: '1px solid rgba(0,0,0,0.1)'
                            }}
                            onClick={() => handleEdit(t)}
                        >
                            <div className="font-bold">{t.name}</div>
                            <div className="text-sm opacity-80">{t.duration}分</div>
                            <div className="text-xs opacity-60 mt-2">クリックして編集</div>
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
