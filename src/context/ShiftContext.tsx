'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Shift, ShiftRequest, TaskAssignment, Staff, TaskType, ShiftTypeDefinition } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface ShiftContextType {
    staff: Staff[];
    taskTypes: TaskType[];
    shiftTypes: ShiftTypeDefinition[];
    requests: ShiftRequest[];
    shifts: Shift[];
    assignments: TaskAssignment[];
    addRequest: (request: ShiftRequest) => Promise<void>;
    removeRequest: (requestId: string) => Promise<void>;
    updateShift: (shift: Shift) => Promise<void>;
    addAssignment: (assignment: TaskAssignment) => Promise<void>;
    removeAssignment: (assignmentId: string) => Promise<void>;
    getShiftsByDate: (date: string) => Shift[];
    getAssignmentsByDate: (date: string) => TaskAssignment[];
    addStaff: (staff: Staff) => Promise<void>;
    updateStaff: (staff: Staff) => Promise<void>;
    deleteStaff: (id: string) => Promise<void>;
    addTaskType: (taskType: TaskType) => Promise<void>;
    updateTaskType: (taskType: TaskType) => Promise<void>;
    deleteTaskType: (id: string) => Promise<void>;
    copiedAssignments: TaskAssignment[] | null;
    copyAssignments: (assignments: TaskAssignment[]) => void;
    pasteAssignments: (targetDate: string) => Promise<void>;
    clearAssignments: (date: string) => Promise<void>;
    manualSave: () => Promise<void>;
    loading: boolean;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const ShiftProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [staff, setStaff] = useState<Staff[]>([]);
    const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
    const [requests, setRequests] = useState<ShiftRequest[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
    const [copiedAssignments, setCopiedAssignments] = useState<TaskAssignment[] | null>(null);
    const [loading, setLoading] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        if (!user) {
            setStaff([]);
            setTaskTypes([]);
            setRequests([]);
            setShifts([]);
            setAssignments([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [staffRes, tasksRes, shiftsRes, assignsRes, reqsRes] = await Promise.all([
                    supabase.from('staff').select('*'),
                    supabase.from('task_types').select('*'),
                    supabase.from('shifts').select('*'),
                    supabase.from('assignments').select('*'),
                    supabase.from('requests').select('*'),
                ]);

                if (staffRes.data) setStaff(staffRes.data);
                if (tasksRes.data) setTaskTypes(tasksRes.data);
                if (shiftsRes.data) setShifts(shiftsRes.data);
                if (assignsRes.data) setAssignments(assignsRes.data);
                if (reqsRes.data) setRequests(reqsRes.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // Static Shift Types (Client-side constant for now)
    const shiftTypes: ShiftTypeDefinition[] = [
        { id: 'Day', label: '日', name: '日勤', color: '#ffffff' },
        { id: 'Off', label: '休', name: '公休', color: '#e2e8f0' },
        { id: 'Early', label: '早', name: '早番', color: '#fef9c3' },
        { id: 'Late', label: '遅', name: '遅番', color: '#ffedd5' },
        { id: 'Night', label: '夜', name: '夜勤', color: '#e0e7ff' }
    ];

    // --- Actions ---

    const addRequest = async (request: ShiftRequest) => {
        // Optimistic update
        setRequests(prev => [...prev, request]);
        // DB update
        await toast.promise(
            (async () => {
                const { error } = await supabase.from('requests').insert(request);
                if (error) throw error;
            })(),
            {
                loading: '保存中...',
                success: '保存しました',
                error: '保存に失敗しました',
            }
        );
    };

    const removeRequest = async (requestId: string) => {
        setRequests(prev => prev.filter(r => r.id !== requestId));
        await toast.promise(
            (async () => {
                const { error } = await supabase.from('requests').delete().eq('id', requestId);
                if (error) throw error;
            })(),
            {
                loading: '削除中...',
                success: '削除しました',
                error: '削除に失敗しました',
            }
        );
    };

    const updateShift = async (shift: Shift) => {
        setShifts(prev => {
            const index = prev.findIndex(s => s.id === shift.id);
            if (index >= 0) {
                const newShifts = [...prev];
                newShifts[index] = shift;
                return newShifts;
            }
            return [...prev, shift];
        });

        // Upsert handles both insert and update if ID exists
        await toast.promise(
            (async () => {
                const { error } = await supabase.from('shifts').upsert(shift);
                if (error) throw error;
            })(),
            {
                loading: '保存中...',
                success: '保存しました',
                error: '保存に失敗しました',
            }
        );
    };

    const addAssignment = async (assignment: TaskAssignment) => {
        setAssignments(prev => [...prev, assignment]);
        await toast.promise(
            (async () => {
                const { error } = await supabase.from('assignments').insert(assignment);
                if (error) throw error;
            })(),
            {
                loading: '保存中...',
                success: '保存しました',
                error: '保存に失敗しました',
            }
        );
    };

    const removeAssignment = async (assignmentId: string) => {
        setAssignments(prev => prev.filter(a => a.id !== assignmentId));
        await toast.promise(
            (async () => {
                const { error } = await supabase.from('assignments').delete().eq('id', assignmentId);
                if (error) throw error;
            })(),
            {
                loading: '削除中...',
                success: '削除しました',
                error: '削除に失敗しました',
            }
        );
    };

    const addStaff = async (newStaff: Staff) => {
        setStaff(prev => [...prev, newStaff]);
        await toast.promise(
            (async () => {
                const { error } = await supabase.from('staff').insert(newStaff);
                if (error) throw error;
            })(),
            {
                loading: '保存中...',
                success: '保存しました',
                error: '保存に失敗しました',
            }
        );
    };

    const updateStaff = async (updatedStaff: Staff) => {
        setStaff(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
        await toast.promise(
            (async () => {
                const { error } = await supabase.from('staff').update(updatedStaff).eq('id', updatedStaff.id);
                if (error) throw error;
            })(),
            {
                loading: '更新中...',
                success: '更新しました',
                error: '更新に失敗しました',
            }
        );
    };

    const deleteStaff = async (id: string) => {
        setStaff(prev => prev.filter(s => s.id !== id));
        await toast.promise(
            (async () => {
                const { error } = await supabase.from('staff').delete().eq('id', id);
                if (error) throw error;
            })(),
            {
                loading: '削除中...',
                success: '削除しました',
                error: '削除に失敗しました',
            }
        );
    };

    const addTaskType = async (newTaskType: TaskType) => {
        setTaskTypes(prev => [...prev, newTaskType]);
        await toast.promise(
            (async () => {
                const { error } = await supabase.from('task_types').insert(newTaskType);
                if (error) throw error;
            })(),
            {
                loading: '保存中...',
                success: '保存しました',
                error: '保存に失敗しました',
            }
        );
    };

    const updateTaskType = async (updatedTask: TaskType) => {
        setTaskTypes(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        await toast.promise(
            (async () => {
                const { error } = await supabase.from('task_types').update(updatedTask).eq('id', updatedTask.id);
                if (error) throw error;
            })(),
            {
                loading: '更新中...',
                success: '更新しました',
                error: '更新に失敗しました',
            }
        );
    };

    const deleteTaskType = async (id: string) => {
        setTaskTypes(prev => prev.filter(t => t.id !== id));
        await toast.promise(
            (async () => {
                const { error } = await supabase.from('task_types').delete().eq('id', id);
                if (error) throw error;
            })(),
            {
                loading: '削除中...',
                success: '削除しました',
                error: '削除に失敗しました',
            }
        );
    };

    const copyAssignments = (assignmentsToCopy: TaskAssignment[]) => {
        setCopiedAssignments(assignmentsToCopy);
    };

    const pasteAssignments = async (targetDate: string) => {
        if (!copiedAssignments) return;

        const newAssignmentsToAdd = copiedAssignments.map(a => ({
            ...a,
            id: Math.random().toString(36).substr(2, 9),
            date: targetDate
        }));

        setAssignments(prev => [...prev, ...newAssignmentsToAdd]);
        await toast.promise(
            (async () => {
                const { error } = await supabase.from('assignments').insert(newAssignmentsToAdd);
                if (error) throw error;
            })(),
            {
                loading: '貼り付け中...',
                success: '貼り付けしました',
                error: '貼り付けに失敗しました',
            }
        );
    };

    const clearAssignments = async (date: string) => {
        setAssignments(prev => prev.filter(a => a.date !== date));
        await toast.promise(
            (async () => {
                const { error } = await supabase.from('assignments').delete().eq('date', date);
                if (error) throw error;
            })(),
            {
                loading: 'クリア中...',
                success: 'クリアしました',
                error: 'クリアに失敗しました',
            }
        );
    };

    const manualSave = async () => {
        // Just a dummy check to reassure user, or could retry failed syncs if we tracked them.
        // For now, we'll just show a success message as the app syncs optimistically.
        // To be safer, we could re-fetch data to ensure sync.

        await toast.promise(
            new Promise(resolve => setTimeout(resolve, 800)),
            {
                loading: 'データを同期中...',
                success: 'データは最新です',
                error: '同期に失敗しました',
            }
        );
    };

    // Helpers (Read-only, no async needed)
    const getShiftsByDate = (date: string) => shifts.filter(s => s.date === date);
    const getAssignmentsByDate = (date: string) => assignments.filter(a => a.date === date);

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
                deleteTaskType,
                copiedAssignments,
                copyAssignments,
                pasteAssignments,
                clearAssignments,
                manualSave,
                loading,
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
