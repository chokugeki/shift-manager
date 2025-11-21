import { NextResponse } from 'next/server';
import { readJSON, writeJSON } from '@/lib/storage';
import { TaskType } from '@/types';

const FILE_NAME = 'tasks.json';

export async function GET() {
    const tasks = await readJSON<TaskType[]>(FILE_NAME, []);
    return NextResponse.json(tasks);
}

export async function POST(request: Request) {
    const newTask = await request.json();
    const tasks = await readJSON<TaskType[]>(FILE_NAME, []);

    const updatedTasks = [...tasks, newTask];
    await writeJSON(FILE_NAME, updatedTasks);

    return NextResponse.json(newTask);
}

export async function PUT(request: Request) {
    const updatedItem = await request.json();
    const tasks = await readJSON<TaskType[]>(FILE_NAME, []);

    const index = tasks.findIndex(t => t.id === updatedItem.id);
    if (index === -1) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    tasks[index] = updatedItem;
    await writeJSON(FILE_NAME, tasks);

    return NextResponse.json(updatedItem);
}
