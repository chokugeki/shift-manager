import { Staff, TaskType } from '../types';

export const MOCK_STAFF: Staff[] = Array.from({ length: 40 }, (_, i) => ({
    id: `staff-${i + 1}`,
    name: `職員 ${i + 1}`,
}));

export const TASK_TYPES: TaskType[] = [
    { id: 'task-1', name: '食事介助 (朝)', color: '#FFB74D', duration: 60 },
    { id: 'task-2', name: '食事介助 (昼)', color: '#FFB74D', duration: 60 },
    { id: 'task-3', name: '食事介助 (夕)', color: '#FFB74D', duration: 60 },
    { id: 'task-4', name: '入浴介助', color: '#4FC3F7', duration: 60 },
    { id: 'task-5', name: '排泄介助', color: '#81C784', duration: 30 },
    { id: 'task-6', name: 'レクリエーション', color: '#BA68C8', duration: 60 },
    { id: 'task-7', name: 'バイタルチェック', color: '#E57373', duration: 60 },
    { id: 'task-8', name: '巡回', color: '#90A4AE', duration: 30 },
    { id: 'task-9', name: '記録作成', color: '#7986CB', duration: 60 },
    { id: 'task-10', name: '清掃・消毒', color: '#4DB6AC', duration: 30 },
];
