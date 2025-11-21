'use client';

import React, { useState } from 'react';
import { useShiftContext } from '@/context/ShiftContext';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';

export default function RequestsPage() {
    const { staff, requests, addRequest, removeRequest } = useShiftContext();
    const [selectedStaffId, setSelectedStaffId] = useState(staff[0]?.id || '');
    const [currentMonth, setCurrentMonth] = useState(addMonths(new Date(), 1)); // Default to next month

    const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
    const prevMonth = () => setCurrentMonth(prev => addMonths(prev, -1));

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    // Calculate empty cells for start of month
    const startDay = getDay(startOfMonth(currentMonth));
    const emptyDays = Array.from({ length: startDay }, (_, i) => i);

    const toggleRequest = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const existing = requests.find(r => r.date === dateStr && r.staffId === selectedStaffId);

        if (!existing) {
            addRequest({
                id: Math.random().toString(36).substr(2, 9),
                date: dateStr,
                staffId: selectedStaffId,
                type: 'Off',
            });
        } else {
            removeRequest(existing.id);
        }
    };

    const isRequested = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return requests.some(r => r.date === dateStr && r.staffId === selectedStaffId);
    };

    return (
        <div className="container py-8">
            <h1 className="page-title">休日希望入力</h1>

            <div className="card mb-6">
                <div className="controls-row">
                    <div className="control-group">
                        <label>職員選択</label>
                        <select
                            className="form-select"
                            value={selectedStaffId}
                            onChange={(e) => setSelectedStaffId(e.target.value)}
                        >
                            {staff.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="control-group">
                        <label>対象月</label>
                        <div className="flex items-center gap-2">
                            <button onClick={prevMonth} className="btn btn-outline px-2 py-1 text-sm">&lt;</button>
                            <div className="month-display">
                                {format(currentMonth, 'yyyy年 M月', { locale: ja })}
                            </div>
                            <button onClick={nextMonth} className="btn btn-outline px-2 py-1 text-sm">&gt;</button>
                        </div>
                    </div>
                </div>

                <div className="calendar-header">
                    <div className="sunday">日</div>
                    <div>月</div>
                    <div>火</div>
                    <div>水</div>
                    <div>木</div>
                    <div>金</div>
                    <div className="saturday">土</div>
                </div>

                <div className="calendar-grid">
                    {emptyDays.map(d => <div key={`empty-${d}`} className="calendar-cell empty" />)}

                    {daysInMonth.map(date => {
                        const requested = isRequested(date);
                        const isSunday = getDay(date) === 0;

                        return (
                            <div
                                key={date.toISOString()}
                                onClick={() => toggleRequest(date)}
                                className={`calendar-cell ${requested ? 'requested' : ''} ${isSunday ? 'sunday-cell' : ''}`}
                            >
                                <span className={`date-number ${isSunday ? 'text-red' : ''}`}>
                                    {format(date, 'd')}
                                </span>

                                {requested && (
                                    <div className="status-badge requested">
                                        <span>希望休</span>
                                    </div>
                                )}

                                {isSunday && !requested && (
                                    <div className="status-badge closed">
                                        <span>定休日</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-end mt-4">
                    <button onClick={nextMonth} className="btn btn-outline">次月 &gt;</button>
                </div>
            </div>

            <div className="actions-row">
                <Link href="/" className="btn btn-primary">トップへ戻る</Link>
            </div>
            <div className="text-center mt-8">
                <Link href="/" className="text-blue-600 hover:underline">トップへ戻る</Link>
            </div>
        </div>
    );
}
