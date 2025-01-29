export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
    id?: number;
    title: string;
    description?: string;
    status: TaskStatus;
    createdAt: Date;
    updatedAt?: Date;
    dueDate?: string;
    importance?: 'low' | 'medium' | 'high';
}
