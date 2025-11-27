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

const STORAGE_KEYS = {
    STAFF: 'shift_manager_staff',
    TASKS: 'shift_manager_tasks',
    REQUESTS: 'shift_manager_requests',
    SHIFTS: 'shift_manager_shifts',
    ASSIGNMENTS: 'shift_manager_assignments'
};

export const ShiftProvider = ({ children }: { children: ReactNode }) => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
    const [requests, setRequests] = useState<ShiftRequest[]>([]);
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
    const [copiedAssignments, setCopiedAssignments] = useState<TaskAssignment[] | null>(null);

    // Load initial data from localStorage
    useEffect(() => {
        const loadData = () => {
            try {
                const storedStaff = localStorage.getItem(STORAGE_KEYS.STAFF);
                const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
                const storedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
                const storedShifts = localStorage.getItem(STORAGE_KEYS.SHIFTS);
                const storedAssignments = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);

                if (storedStaff) setStaff(JSON.parse(storedStaff));
                if (storedTasks) setTaskTypes(JSON.parse(storedTasks));
                if (storedRequests) setRequests(JSON.parse(storedRequests));
                if (storedShifts) setShifts(JSON.parse(storedShifts));
                if (storedAssignments) setAssignments(JSON.parse(storedAssignments));
            } catch (error) {
                console.error('Failed to load data from localStorage:', error);
            }
        };
        loadData();
    }, []);

    // Helper to save to localStorage
    const saveToStorage = (key: string, data: any) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Failed to save to ${key}:`, error);
        }
    };

    // Static Shift Types
    const shiftTypes: ShiftTypeDefinition[] = [
        { id: 'Day', label: '日', name: '日勤', color: '#ffffff' },
        { id: 'Off', label: '休', name: '公休', color: '#e2e8f0' },
        { id: 'Early', label: '早', name: '早番', color: '#fef9c3' },
        { id: 'Late', label: '遅', name: '遅番', color: '#ffedd5' },
        { id: 'Night', label: '夜', name: '夜勤', color: '#e0e7ff' }
    ];

    const addRequest = (request: ShiftRequest) => {
        const newRequests = [...requests, request];
        setRequests(newRequests);
        saveToStorage(STORAGE_KEYS.REQUESTS, newRequests);
    };

    const removeRequest = (requestId: string) => {
        const newRequests = requests.filter((r) => r.id !== requestId);
        setRequests(newRequests);
        saveToStorage(STORAGE_KEYS.REQUESTS, newRequests);
    };

    const updateShift = (shift: Shift) => {
        let newShifts = [...shifts];
        const existingIndex = newShifts.findIndex((s) => s.id === shift.id);

        if (existingIndex >= 0) {
            newShifts[existingIndex] = shift;
        } else {
            newShifts.push(shift);
        }

        setShifts(newShifts);
        saveToStorage(STORAGE_KEYS.SHIFTS, newShifts);
    };

    const addAssignment = (assignment: TaskAssignment) => {
        const newAssignments = [...assignments, assignment];
        setAssignments(newAssignments);
        saveToStorage(STORAGE_KEYS.ASSIGNMENTS, newAssignments);
    };

    const removeAssignment = (assignmentId: string) => {
        const newAssignments = assignments.filter((a) => a.id !== assignmentId);
        setAssignments(newAssignments);
        saveToStorage(STORAGE_KEYS.ASSIGNMENTS, newAssignments);
    };

    const getShiftsByDate = (date: string) => {
        return shifts.filter((s) => s.date === date);
    };

    const getAssignmentsByDate = (date: string) => {
        return assignments.filter((a) => a.date === date);
    };

    const addStaff = (newStaff: Staff) => {
        const updatedStaff = [...staff, newStaff];
        setStaff(updatedStaff);
        saveToStorage(STORAGE_KEYS.STAFF, updatedStaff);
    };

    const updateStaff = (updatedStaffItem: Staff) => {
        const updatedStaff = staff.map(s => s.id === updatedStaffItem.id ? updatedStaffItem : s);
        setStaff(updatedStaff);
        saveToStorage(STORAGE_KEYS.STAFF, updatedStaff);
    };

    const deleteStaff = (id: string) => {
        const updatedStaff = staff.filter(s => s.id !== id);
        setStaff(updatedStaff);
        saveToStorage(STORAGE_KEYS.STAFF, updatedStaff);
    };

    const addTaskType = (newTaskType: TaskType) => {
        const updatedTasks = [...taskTypes, newTaskType];
        setTaskTypes(updatedTasks);
        saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);
    };

    const updateTaskType = (updatedTask: TaskType) => {
        const updatedTasks = taskTypes.map(t => t.id === updatedTask.id ? updatedTask : t);
        setTaskTypes(updatedTasks);
        saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);
    };

    const copyAssignments = (assignmentsToCopy: TaskAssignment[]) => {
        setCopiedAssignments(assignmentsToCopy);
    };

    const pasteAssignments = (targetDate: string) => {
        if (!copiedAssignments) return;

        const newAssignmentsToAdd = copiedAssignments.map(a => ({
            ...a,
            id: Math.random().toString(36).substr(2, 9),
            date: targetDate
        }));

        const updatedAssignments = [...assignments, ...newAssignmentsToAdd];
        setAssignments(updatedAssignments);
        saveToStorage(STORAGE_KEYS.ASSIGNMENTS, updatedAssignments);
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
