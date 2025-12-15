export interface Staff {
  id: string;
  name: string;
}

export interface TaskType {
  id: string;
  name: string;
  color: string;
  textColor?: string;
  duration: number; // in minutes
}

export interface ShiftTypeDefinition {
  id: string;
  label: string;
  name: string;
  color: string;
}

export type ShiftType = string;

export interface Shift {
  id: string;
  date: string; // YYYY-MM-DD
  staffId: string;
  shiftType: ShiftType;
}

export interface ShiftRequest {
  id: string;
  date: string; // YYYY-MM-DD
  staffId: string;
  type: 'Off';
}

export interface TaskAssignment {
  id: string;
  date: string; // YYYY-MM-DD
  staffId: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  taskTypeId: string;
}
