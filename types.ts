
export type Role = 'MANAGER' | 'STAFF';

export enum TaskCategory {
  TEMPERATURE = 'Temperature Check',
  CLEANING = 'Cleaning & Sanitation',
  EQUIPMENT = 'Equipment Maintenance',
  RECEIVING = 'Food Receiving',
  OPENING = 'Opening Tasks',
  CLOSING = 'Closing Tasks'
}

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface ChecklistTask {
  id: string;
  category: TaskCategory;
  title: string;
  description: string;
  required: boolean;
  type: 'CHECKBOX' | 'TEMPERATURE' | 'TEXT';
  minTemp?: number;
  maxTemp?: number;
}

export interface LogEntry {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  timestamp: string;
  value: string | number | boolean;
  notes?: string;
  photoUrl?: string;
}

export interface DailyReport {
  date: string;
  totalTasks: number;
  completedTasks: number;
  violations: number;
}
