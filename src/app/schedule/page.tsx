'use client';

import React, { useState } from 'react';
import { useShiftContext } from '@/context/ShiftContext';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ShiftType } from '@/types';
import GanttChart from '@/components/GanttChart';
import Link from 'next/link';
import { getEffectiveShiftType } from '@/utils/shiftUtils';

export default function SchedulePage() {
    const { staff, shifts, requests, updateShift, shiftTypes } = useShiftContext();
    const [currentMonth, setCurrentMonth] = useState(addMonths(new Date(), 1));
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
    const prevMonth = () => setCurrentMonth(prev => addMonths(prev, -1));

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const handleShiftChange = (staffId: string, date: Date, type: ShiftType) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        updateShift({
            id: `${staffId}-${dateStr}`,
            staffId,
            date: dateStr,
            shiftType: type,
        });
    };

    const getDailyCounts = (date: Date) => {
        const counts: Record<string, number> = {};
        shiftTypes.forEach(t => counts[t.id] = 0);

        staff.forEach(s => {
            const type = getEffectiveShiftType(s.id, date, shifts, requests);
            if (counts[type] !== undefined) {
                counts[type]++;
            } else {
                counts[type] = (counts[type] || 0) + 1;
            }
        });

        return counts;
    };

    const getStaffMonthlyCounts = (staffId: string) => {
        const counts: Record<string, number> = {};
        shiftTypes.forEach(t => counts[t.id] = 0);

        daysInMonth.forEach(date => {
            const type = getEffectiveShiftType(staffId, date, shifts, requests);
            if (counts[type] !== undefined) {
                counts[type]++;
            } else {
                counts[type] = (counts[type] || 0) + 1;
            }
        });

        return counts;
    };

    const handlePrintMonthly = () => {
        document.body.classList.add('print-monthly');
        window.print();
        setTimeout(() => {
            document.body.classList.remove('print-monthly');
        }, 500);
    };

    return (
        <div className="container-fluid">
            <div className="page-header">
                <h1 className="page-title">シフト作成・管理</h1>
                <div className="flex items-center gap-4 no-print">
                    <button onClick={prevMonth} className="btn btn-outline">&lt; 前月</button>
                    <div className="text-xl font-bold">
                        {format(currentMonth, 'yyyy年 M月', { locale: ja })}
                    </div>
                    <button onClick={nextMonth} className="btn btn-outline">次月 &gt;</button>
                    <button onClick={handlePrintMonthly} className="btn btn-primary flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        印刷
                    </button>
                </div>
                <Link href="/" className="text-blue-600 hover:underline no-print">トップへ戻る</Link>
            </div>

            <div className="print-only-title" style={{ display: 'none' }}>
                <h1 className="text-2xl font-bold text-center mb-4">{format(currentMonth, 'yyyy年 M月', { locale: ja })} シフト表</h1>
            </div>

            <div className="schedule-table-container">
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th className="sticky-col name-col">職員名</th>
                            {daysInMonth.map(date => {
                                const isSunday = getDay(date) === 0;
                                const isSelected = selectedDate && isSameDay(date, selectedDate);
                                return (
                                    <th
                                        key={date.toISOString()}
                                        onClick={() => setSelectedDate(date)}
                                        className={`date-header ${isSunday ? 'sunday' : ''} ${isSelected ? 'selected' : ''}`}
                                    >
                                        {format(date, 'd')}
                                        <br />
                                        <span className="day-label">{format(date, 'E', { locale: ja })}</span>
                                    </th>
                                );
                            })}
                            {/* Staff Summary Headers */}
                            {shiftTypes.map(type => (
                                <th key={`header-${type.id}`} className="summary-header text-center" style={{ minWidth: '40px', fontSize: '0.8rem' }}>
                                    {type.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(s => {
                            const staffCounts = getStaffMonthlyCounts(s.id);
                            return (
                                <tr key={s.id}>
                                    <td className="sticky-col name-cell">{s.name}</td>
                                    {daysInMonth.map(date => {
                                        const displayType = getEffectiveShiftType(s.id, date, shifts, requests);
                                        const request = requests.find(r => r.staffId === s.id && r.date === format(date, 'yyyy-MM-dd'));
                                        const currentShiftType = shiftTypes.find(t => t.id === displayType) || shiftTypes.find(t => t.id === 'Day');

                                        return (
                                            <td key={date.toISOString()} className="shift-cell">
                                                <select
                                                    value={displayType}
                                                    onChange={(e) => handleShiftChange(s.id, date, e.target.value as ShiftType)}
                                                    className={`shift-select ${request ? 'is-request' : ''}`}
                                                    style={{
                                                        backgroundColor: currentShiftType?.color || '#fff',
                                                        color: displayType === 'Off' ? '#ef4444' : '#000',
                                                        fontWeight: displayType === 'Off' ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {shiftTypes.map(t => (
                                                        <option key={t.id} value={t.id}>{t.label}</option>
                                                    ))}
                                                </select>
                                                {request && <div className="request-marker" />}
                                            </td>
                                        );
                                    })}
                                    {/* Staff Summary Counts */}
                                    {shiftTypes.map(type => (
                                        <td key={`count-${s.id}-${type.id}`} className="text-center font-bold" style={{ backgroundColor: '#f8fafc' }}>
                                            {staffCounts[type.id] || 0}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}

                        {/* Dynamic Validation Rows */}
                        {shiftTypes.map(type => (
                            <tr key={type.id} className="validation-row">
                                <td className="sticky-col">{type.name}</td>
                                {daysInMonth.map(date => {
                                    const counts = getDailyCounts(date);
                                    // Add specific validation logic here if needed (e.g., Early >= 1)
                                    let isValid = true;
                                    if (type.id === 'Early') isValid = counts[type.id] >= 1;
                                    if (type.id === 'Late') isValid = counts[type.id] >= 2;

                                    return (
                                        <td key={date.toISOString()} className={`count-cell ${!isValid ? 'invalid' : ''}`}>
                                            {counts[type.id] || 0}
                                        </td>
                                    );
                                })}
                                {/* Empty cells for summary columns in validation rows */}
                                {shiftTypes.map(t => (
                                    <td key={`validation-empty-${type.id}-${t.id}`} style={{ backgroundColor: '#f1f5f9' }}></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedDate && (
                <div className="gantt-container card">
                    <GanttChart
                        date={selectedDate}
                        shifts={shifts.filter(s => s.date === format(selectedDate, 'yyyy-MM-dd'))}
                    />
                </div>
            )}

            <div className="mt-8 text-center no-print">
                <Link href="/" className="text-blue-600 hover:underline">トップへ戻る</Link>
            </div>
        </div>
    );
}
