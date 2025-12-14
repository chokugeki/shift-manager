'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Shift, ShiftRequest, TaskAssignment, Staff, TaskType, ShiftTypeDefinition } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';

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
        await supabase.from('requests').insert(request);
    };

    const removeRequest = async (requestId: string) => {
        setRequests(prev => prev.filter(r => r.id !== requestId));
        await supabase.from('requests').delete().eq('id', requestId);
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
        await supabase.from('shifts').upsert(shift);
    };

    const addAssignment = async (assignment: TaskAssignment) => {
        setAssignments(prev => [...prev, assignment]);
        await supabase.from('assignments').insert(assignment);
    };

    const removeAssignment = async (assignmentId: string) => {
        setAssignments(prev => prev.filter(a => a.id !== assignmentId));
        await supabase.from('assignments').delete().eq('id', assignmentId);
    };

    const addStaff = async (newStaff: Staff) => {
        setStaff(prev => [...prev, newStaff]);
        await supabase.from('staff').insert(newStaff);
    };

    const updateStaff = async (updatedStaff: Staff) => {
        setStaff(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
        await supabase.from('staff').update(updatedStaff).eq('id', updatedStaff.id);
    };

    const deleteStaff = async (id: string) => {
        setStaff(prev => prev.filter(s => s.id !== id));
        await supabase.from('staff').delete().eq('id', id);
    };

    const addTaskType = async (newTaskType: TaskType) => {
        setTaskTypes(prev => [...prev, newTaskType]);
        await supabase.from('task_types').insert(newTaskType);
    };

    const updateTaskType = async (updatedTask: TaskType) => {
        setTaskTypes(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        await supabase.from('task_types').update(updatedTask).eq('id', updatedTask.id);
    };

    const deleteTaskType = async (id: string) => {
        setTaskTypes(prev => prev.filter(t => t.id !== id));
        await supabase.from('task_types').delete().eq('id', id);
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
        await supabase.from('assignments').insert(newAssignmentsToAdd);
    };

    const clearAssignments = async (date: string) => {
        setAssignments(prev => prev.filter(a => a.date !== date));
        await supabase.from('assignments').delete().eq('date', date);
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
