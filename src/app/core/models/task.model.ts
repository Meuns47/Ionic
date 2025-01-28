/**
 * Interface représentant une tâche dans l'application
 */
export interface Task {
  /** Identifiant unique de la tâche */
  id: number;
  /** Titre de la tâche */
  title: string;
  /** Description détaillée de la tâche */
  description: string;
  /** Niveau d'importance de la tâche */
  importance: 'low' | 'medium' | 'high';
  /** État de complétion de la tâche */
  completed: boolean;
  /** Date d'échéance optionnelle de la tâche */
  dueDate?: string;
}
