import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/storage';
import { Staff } from '@/types';

const FILE_NAME = 'staff.json';

export async function GET() {
    const staff = await readJSON<Staff[]>(FILE_NAME, []);
    return NextResponse.json(staff);
}

export async function POST(request: Request) {
    const newStaff = await request.json();
    const staff = await readJSON<Staff[]>(FILE_NAME, []);

    // Simple validation
    if (!newStaff.name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const updatedStaff = [...staff, newStaff];
    await writeJSON(FILE_NAME, updatedStaff);

    return NextResponse.json(newStaff);
}

export async function PUT(request: Request) {
    const updatedItem = await request.json();
    const staff = await readJSON<Staff[]>(FILE_NAME, []);

    const index = staff.findIndex(s => s.id === updatedItem.id);
    if (index === -1) {
        return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    staff[index] = updatedItem;
    await writeJSON(FILE_NAME, staff);

    return NextResponse.json(updatedItem);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const staff = await readJSON<Staff[]>(FILE_NAME, []);
    const filteredStaff = staff.filter(s => s.id !== id);

    await writeJSON(FILE_NAME, filteredStaff);

    return NextResponse.json({ success: true });
}
