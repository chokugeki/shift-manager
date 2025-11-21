import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/storage';
import { Shift, ShiftRequest, TaskAssignment } from '@/types';

const SHIFTS_FILE = 'shifts.json';
const REQUESTS_FILE = 'requests.json';
const ASSIGNMENTS_FILE = 'assignments.json';

export async function GET() {
    const shifts = await readJSON<Shift[]>(SHIFTS_FILE, []);
    const requests = await readJSON<ShiftRequest[]>(REQUESTS_FILE, []);
    const assignments = await readJSON<TaskAssignment[]>(ASSIGNMENTS_FILE, []);

    return NextResponse.json({ shifts, requests, assignments });
}

export async function POST(request: Request) {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'shift') {
        const shifts = await readJSON<Shift[]>(SHIFTS_FILE, []);
        // Update or add shift
        const index = shifts.findIndex(s => s.id === data.id);
        if (index >= 0) {
            shifts[index] = data;
        } else {
            shifts.push(data);
        }
        await writeJSON(SHIFTS_FILE, shifts);
    } else if (type === 'request') {
        const requests = await readJSON<ShiftRequest[]>(REQUESTS_FILE, []);
        if (data.action === 'remove') {
            const filtered = requests.filter(r => r.id !== data.id);
            await writeJSON(REQUESTS_FILE, filtered);
        } else {
            requests.push(data);
            await writeJSON(REQUESTS_FILE, requests);
        }
    } else if (type === 'assignment') {
        const assignments = await readJSON<TaskAssignment[]>(ASSIGNMENTS_FILE, []);
        if (data.action === 'remove') {
            const filtered = assignments.filter(a => a.id !== data.id);
            await writeJSON(ASSIGNMENTS_FILE, filtered);
        } else {
            assignments.push(data);
            await writeJSON(ASSIGNMENTS_FILE, assignments);
        }
    }

    return NextResponse.json({ success: true });
}
