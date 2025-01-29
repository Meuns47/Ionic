export interface Task {
    id?: number;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: Date;
    updatedAt?: Date;
    dueDate?: string;
    importance?: 'low' | 'medium' | 'high';
}
