import { Shift, ShiftRequest, ShiftType } from '@/types';
import { format, getDay } from 'date-fns';

export function getEffectiveShiftType(
    staffId: string,
    date: Date,
    shifts: Shift[],
    requests: ShiftRequest[]
): ShiftType {
    const dateStr = format(date, 'yyyy-MM-dd');

    // 1. Check for explicit shift assignment
    const shift = shifts.find(s => s.staffId === staffId && s.date === dateStr);
    if (shift) {
        return shift.shiftType;
    }

    // 2. Check for requests
    const request = requests.find(r => r.staffId === staffId && r.date === dateStr);
    if (request && request.type === 'Off') {
        return 'Off';
    }

    // 3. Check for Sunday (Default Off)
    if (getDay(date) === 0) {
        return 'Off';
    }

    // 4. Default to Day
    return 'Day';
}
