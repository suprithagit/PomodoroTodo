export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  pomodorosCompleted: number;
}

export interface Settings {
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  autoStartBreak: boolean;
  theme: Theme;
}

export type Theme = 'tomato' | 'mint' | 'midnight';

export type TimerType = 'work' | 'break';

export interface TimerState {
  isActive: boolean;
  timeLeft: number; // in seconds
  type: TimerType;
  currentTaskId: string | null;
}

export interface ProgressStats {
  tasksToday: number;
  tasksCompleted: number;
  pomodorosCompleted: number;
  streak: number;
}