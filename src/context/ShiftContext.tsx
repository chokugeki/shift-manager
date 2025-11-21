'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Shift, ShiftRequest, TaskAssignment, Staff, TaskType, ShiftTypeDefinition } from '@/types';

interface ShiftContextType {
    staff: Staff[];
    taskTypes: TaskType[];
    shiftTypes: ShiftTypeDefinition[];
    requests: ShiftRequest[];
    shifts: Shift[];
    assignments: TaskAssignment[];
    addRequest: (request: ShiftRequest) => void;
    removeRequest: (requestId: string) => void;
    updateShift: (shift: Shift) => void;
    addAssignment: (assignment: TaskAssignment) => void;
    removeAssignment: (assignmentId: string) => void;
    getShiftsByDate: (date: string) => Shift[];
    getAssignmentsByDate: (date: string) => TaskAssignment[];
    addStaff: (staff: Staff) => void;
    updateStaff: (staff: Staff) => void;
    deleteStaff: (id: string) => void;
    addTaskType: (taskType: TaskType) => void;
    updateTaskType: (taskType: TaskType) => void;
    copiedAssignments: TaskAssignment[] | null;
    copyAssignments: (assignments: TaskAssignment[]) => void;
    pasteAssignments: (targetDate: string) => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider = ({ children }: { children: ReactNode }) => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
    const [requests, setRequests] = useState<ShiftRequest[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
    const [copiedAssignments, setCopiedAssignments] = useState<TaskAssignment[] | null>(null);

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                const [staffRes, tasksRes, shiftsRes] = await Promise.all([
                    fetch('/api/staff'),
                    fetch('/api/tasks'),
                    fetch('/api/shifts')
                ]);

                const staffData = await staffRes.json();
                const tasksData = await tasksRes.json();
                const shiftsData = await shiftsRes.json();

                setStaff(staffData);
                setTaskTypes(tasksData);
                setRequests(shiftsData.requests);
                setShifts(shiftsData.shifts);
                setAssignments(shiftsData.assignments);
            } catch (error) {
                console.error('Failed to load data:', error);
            }
        };
        loadData();
    }, []);

    // Static Shift Types
    const shiftTypes: ShiftTypeDefinition[] = [
        { id: 'Day', label: '日', name: '日勤', color: '#ffffff' },
        { id: 'Off', label: '休', name: '公休', color: '#e2e8f0' },
        { id: 'Early', label: '早', name: '早番', color: '#fef9c3' },
        { id: 'Late', label: '遅', name: '遅番', color: '#ffedd5' },
        { id: 'Night', label: '夜', name: '夜勤', color: '#e0e7ff' }
    ];

    const addRequest = async (request: ShiftRequest) => {
        setRequests((prev) => [...prev, request]);
        await fetch('/api/shifts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'request', data: request }),
        });
    };

    const removeRequest = async (requestId: string) => {
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
        await fetch('/api/shifts', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'request', id: requestId }),
        });
    };

    const updateShift = async (shift: Shift) => {
        setShifts((prev) => {
            const existing = prev.findIndex((s) => s.id === shift.id);
            if (existing >= 0) {
                const newShifts = [...prev];
                newShifts[existing] = shift;
                return newShifts;
            }
            return [...prev, shift];
        });
        await fetch('/api/shifts', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'shift', data: shift }),
        });
    };

    const addAssignment = async (assignment: TaskAssignment) => {
        setAssignments((prev) => [...prev, assignment]);
        await fetch('/api/shifts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'assignment', data: assignment }),
        });
    };

    const removeAssignment = async (assignmentId: string) => {
        setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
        await fetch('/api/shifts', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'assignment', id: assignmentId }),
        });
    };

    const getShiftsByDate = (date: string) => {
        return shifts.filter((s) => s.date === date);
    };

    const getAssignmentsByDate = (date: string) => {
        return assignments.filter((a) => a.date === date);
    };

    const addStaff = async (newStaff: Staff) => {
        setStaff((prev) => [...prev, newStaff]);
        await fetch('/api/staff', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStaff),
        });
    };

    const updateStaff = async (updatedStaff: Staff) => {
        setStaff((prev) => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
        await fetch('/api/staff', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedStaff),
        });
    };

    const deleteStaff = async (id: string) => {
        setStaff((prev) => prev.filter(s => s.id !== id));
        await fetch(`/api/staff?id=${id}`, {
            method: 'DELETE',
        });
    };

    const addTaskType = async (newTaskType: TaskType) => {
        setTaskTypes((prev) => [...prev, newTaskType]);
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTaskType),
        });
    };

    const updateTaskType = async (updatedTask: TaskType) => {
        setTaskTypes((prev) => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        await fetch('/api/tasks', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        });
    };

    const copyAssignments = (assignmentsToCopy: TaskAssignment[]) => {
        setCopiedAssignments(assignmentsToCopy);
    };

    const pasteAssignments = async (targetDate: string) => {
        if (!copiedAssignments) return;

        const newAssignments = copiedAssignments.map(a => ({
            ...a,
            id: Math.random().toString(36).substr(2, 9),
            date: targetDate
        }));

        setAssignments(prev => [...prev, ...newAssignments]);

        // Persist each new assignment
        // Note: In a production app, we should have a bulk add API
        for (const assignment of newAssignments) {
            await fetch('/api/shifts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'assignment', data: assignment }),
            });
        }
    };

    return (
        <ShiftContext.Provider
            value={{
                staff,
                taskTypes,
                shiftTypes,
                requests,
                shifts,
                assignments,
                addRequest,
                removeRequest,
                updateShift,
                addAssignment,
                removeAssignment,
                getShiftsByDate,
                getAssignmentsByDate,
                addStaff,
                updateStaff,
                deleteStaff,
                addTaskType,
                updateTaskType,
                copiedAssignments,
                copyAssignments,
                pasteAssignments,
            }}
        >
            {children}
        </ShiftContext.Provider>
    );
};

export const useShiftContext = () => {
    const context = useContext(ShiftContext);
    if (context === undefined) {
        throw new Error('useShiftContext must be used within a ShiftProvider');
    }
    return context;
};
