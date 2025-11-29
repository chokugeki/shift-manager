'use client';

import React, { useState } from 'react';
import { useShiftContext } from '@/context/ShiftContext';
import { format, addMinutes, parse } from 'date-fns';
import { Shift, TaskType } from '@/types';
import { getEffectiveShiftType } from '@/utils/shiftUtils';

interface GanttChartProps {
    date: Date;
    shifts: Shift[];
}

// Generate 30-minute slots from 7:00 to 20:00
const START_HOUR = 7;
const END_HOUR = 20;
const TIME_SLOTS: string[] = [];
for (let h = START_HOUR; h < END_HOUR; h++) {
    TIME_SLOTS.push(`${h.toString().padStart(2, '0')}:00`);
    TIME_SLOTS.push(`${h.toString().padStart(2, '0')}:30`);
}

export default function GanttChart({ date, shifts }: GanttChartProps) {
    const { staff, taskTypes, assignments, requests, addAssignment, removeAssignment, copyAssignments, pasteAssignments, copiedAssignments } = useShiftContext();
    const [selectedTaskType, setSelectedTaskType] = useState<TaskType | null>(taskTypes[0]);

    // Filter staff who are working today (not Off)
    const workingStaff = staff.filter(s => {
        const type = getEffectiveShiftType(s.id, date, shifts, requests);
        return type !== 'Off';
    });

    if (workingStaff.length === 0) {
        return <div className="p-4 text-center text-gray-500">この日の勤務者はいません。シフト表で勤務を設定してください。</div>;
    }

    const dateStr = format(date, 'yyyy-MM-dd');
    const dayAssignments = assignments.filter(a => a.date === dateStr);

    const handleCellClick = (staffId: string, time: string) => {
        if (!selectedTaskType) return;

        // Check if clicked on an existing assignment to remove it
        const clickedTime = parse(`${dateStr} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
        const existing = dayAssignments.find(a => {
            const start = parse(`${dateStr} ${a.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
            const end = parse(`${dateStr} ${a.endTime}`, 'yyyy-MM-dd HH:mm', new Date());
            return clickedTime >= start && clickedTime < end && a.staffId === staffId;
        });

        if (existing) {
            removeAssignment(existing.id);
            return;
        }

        // Add new assignment
        const startTime = time;
        const startDateTime = parse(`${dateStr} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date());
        const endDateTime = addMinutes(startDateTime, selectedTaskType.duration);
        const endTime = format(endDateTime, 'HH:mm');

        // Check for overlap with existing assignments for this staff
        const hasOverlap = dayAssignments.some(a => {
            if (a.staffId !== staffId) return false;
            const aStart = parse(`${dateStr} ${a.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
            const aEnd = parse(`${dateStr} ${a.endTime}`, 'yyyy-MM-dd HH:mm', new Date());
            return (
                (startDateTime >= aStart && startDateTime < aEnd) ||
                (endDateTime > aStart && endDateTime <= aEnd) ||
                (startDateTime <= aStart && endDateTime >= aEnd)
            );
        });

        if (!hasOverlap) {
            addAssignment({
                id: Math.random().toString(36).substr(2, 9),
                date: dateStr,
                staffId,
                startTime,
                endTime,
                taskTypeId: selectedTaskType.id,
            });
        } else {
            alert('他の業務と時間が重複しています');
        }
    };

    const handlePrintGantt = () => {
        document.body.classList.add('print-gantt');
        window.print();
        setTimeout(() => {
            document.body.classList.remove('print-gantt');
        }, 500);
    };

    return (
        <div className="gantt-wrapper">
            <div className="flex items-center gap-4 mb-4">
                <h2 className="gantt-title mb-0">
                    業務割り当て: {format(date, 'yyyy年 M月 d日')}
                </h2>
                <div className="flex gap-2 no-print">
                    <button
                        onClick={handlePrintGantt}
                        className="btn btn-primary btn-sm flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        印刷
                    </button>
                    <button
                        onClick={() => copyAssignments(dayAssignments)}
                        className="btn btn-outline btn-sm"
                    >
                        コピー
                    </button>
                    <button
                        onClick={() => pasteAssignments(dateStr)}
                        className="btn btn-outline btn-sm"
                        disabled={!copiedAssignments}
                    >
                        貼り付け
                    </button>
                </div>
            </div>

            <div className="task-type-selector no-print" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '0.5rem',
                overflowX: 'visible',
                flexWrap: 'wrap'
            }}>
                {taskTypes.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setSelectedTaskType(t)}
                        className={`task-btn ${selectedTaskType?.id === t.id ? 'active' : ''}`}
                        style={{
                            backgroundColor: t.color,
                            width: '100%',
                            textAlign: 'center'
                        }}
                    >
                        {t.name} ({t.duration}分)
                    </button>
                ))}
            </div>

            <div className="gantt-scroll" style={{ overflowX: 'auto', maxWidth: '100%' }}>
                <div className="gantt-table" style={{ minWidth: '1200px' }}>
                    {/* Header */}
                    <div className="gantt-header-row" style={{ gridTemplateColumns: `150px repeat(${TIME_SLOTS.length}, 1fr)` }}>
                        <div className="gantt-staff-col header">職員</div>
                        {TIME_SLOTS.map((t, i) => (
                            <div key={t} className="time-header" style={{ fontSize: '0.7rem', writingMode: 'vertical-lr' }}>
                                {i % 2 === 0 ? t : ''}
                            </div>
                        ))}
                    </div>

                    {/* Rows */}
                    {workingStaff.map(s => {
                        const shiftType = getEffectiveShiftType(s.id, date, shifts, requests);
                        return (
                            <div key={s.id} className="gantt-row" style={{ gridTemplateColumns: `150px repeat(${TIME_SLOTS.length}, 1fr)` }}>
                                <div className="gantt-staff-col">
                                    <div className="staff-name">{s.name}</div>
                                    <div className="shift-label">{shiftType}</div>
                                </div>
                                {TIME_SLOTS.map(time => {
                                    const cellTime = parse(`${dateStr} ${time}`, 'yyyy-MM-dd HH:mm', new Date());

                                    // Find assignment covering this slot
                                    const assignment = dayAssignments.find(a => {
                                        if (a.staffId !== s.id) return false;
                                        const start = parse(`${dateStr} ${a.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
                                        const end = parse(`${dateStr} ${a.endTime}`, 'yyyy-MM-dd HH:mm', new Date());
                                        return cellTime >= start && cellTime < end;
                                    });

                                    const taskType = assignment ? taskTypes.find(t => t.id === assignment.taskTypeId) : null;
                                    const isStart = assignment && assignment.startTime === time;

                                    return (
                                        <div
                                            key={time}
                                            onClick={() => handleCellClick(s.id, time)}
                                            className="time-cell"
                                            style={{
                                                backgroundColor: taskType?.color,
                                                borderLeft: '1px solid #eee',
                                                borderRight: '1px solid #eee',
                                                opacity: taskType ? 1 : 0.5,
                                                cursor: 'pointer',
                                                color: '#000'
                                            }}
                                            title={taskType ? `${taskType.name} (${assignment?.startTime} - ${assignment?.endTime})` : ''}
                                        >
                                            {isStart && taskType && (
                                                <div className="task-marker" style={{ fontSize: '0.6rem', overflow: 'hidden', whiteSpace: 'nowrap', paddingLeft: '2px' }}>
                                                    {taskType.name}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
