import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

export async function readJSON<T>(filename: string, defaultValue: T): Promise<T> {
    const filePath = path.join(DATA_DIR, filename);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) as T;
    } catch (error) {
        // If file doesn't exist, return default value
        return defaultValue;
    }
}

export async function writeJSON<T>(filename: string, data: T): Promise<void> {
    const filePath = path.join(DATA_DIR, filename);
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error writing to ${filename}:`, error);
        throw error;
    }
}

export async function getShiftTypes() {
    return readJSON('data/shift-types.json', []);
}

export async function saveShiftTypes(data: any[]) {
    return writeJSON('data/shift-types.json', data);
}
