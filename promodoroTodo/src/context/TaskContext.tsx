import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  incrementPomodoroCount: (id: string) => void;
  tasksToday: number;
  completedTasksToday: number;
  totalPomodorosToday: number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('pomodoroTodo-tasks', []);
  
  // Calculate today's statistics
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTimestamp = todayStart.getTime();
  
  const tasksToday = tasks.filter(task => task.createdAt >= todayTimestamp).length;
  const completedTasksToday = tasks.filter(task => task.completedAt && task.completedAt >= todayTimestamp).length;
  const totalPomodorosToday = tasks.reduce((total, task) => total + task.pomodorosCompleted, 0);

  // Add a new task
  const addTask = (title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: Date.now(),
      pomodorosCompleted: 0
    };
    
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  // Update an existing task
  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  // Mark a task as completed
  const completeTask = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? Date.now() : undefined } 
          : task
      )
    );
  };

  // Reorder tasks using drag and drop
  const reorderTasks = (startIndex: number, endIndex: number) => {
    setTasks(prevTasks => {
      const result = Array.from(prevTasks);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  // Increment the pomodoro count for a task
  const incrementPomodoroCount = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, pomodorosCompleted: task.pomodorosCompleted + 1 } 
          : task
      )
    );
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    reorderTasks,
    incrementPomodoroCount,
    tasksToday,
    completedTasksToday,
    totalPomodorosToday
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};