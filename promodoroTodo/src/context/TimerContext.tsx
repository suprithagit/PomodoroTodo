import React, { createContext, useContext, useState } from 'react';
import { TimerState, TimerType } from '../types';
import { useTaskContext } from './TaskContext';
import { useSettingsContext } from './SettingsContext';

interface TimerContextType {
  timerState: TimerState;
  startTimer: (taskId: string | null) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  completeTimer: () => void;
  formatTimeLeft: () => string;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
};

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettingsContext();
  const { incrementPomodoroCount } = useTaskContext();

  const [timerState, setTimerState] = useState<TimerState>({
    isActive: false,
    timeLeft: settings.workDuration * 60, // Convert to seconds
    type: 'work',
    currentTaskId: null
  });

  // Start the timer for a specific task
  const startTimer = (taskId: string | null) => {
    setTimerState({
      isActive: true,
      timeLeft: settings.workDuration * 60,
      type: 'work',
      currentTaskId: taskId
    });
  };

  // Pause the timer
  const pauseTimer = () => {
    setTimerState(prev => ({ ...prev, isActive: false }));
  };

  // Resume the timer
  const resumeTimer = () => {
    setTimerState(prev => ({ ...prev, isActive: true }));
  };

  // Reset the timer
  const resetTimer = () => {
    const duration = timerState.type === 'work' ? settings.workDuration : settings.breakDuration;
    setTimerState(prev => ({
      ...prev,
      isActive: false,
      timeLeft: duration * 60
    }));
  };

  // Complete current timer and switch to the next phase
  const completeTimer = () => {
    // If it's a work timer, increment the pomodoro count
    if (timerState.type === 'work' && timerState.currentTaskId) {
      incrementPomodoroCount(timerState.currentTaskId);
    }

    // Switch the timer type
    const newType: TimerType = timerState.type === 'work' ? 'break' : 'work';
    const duration = newType === 'work' ? settings.workDuration : settings.breakDuration;
    const autoStart = newType === 'break' ? settings.autoStartBreak : false;

    setTimerState({
      isActive: autoStart,
      timeLeft: duration * 60,
      type: newType,
      currentTaskId: newType === 'work' ? null : timerState.currentTaskId
    });

    // Play sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.log('Error playing notification sound:', e));
  };

  // Format the time left
  const formatTimeLeft = () => {
    const minutes = Math.floor(timerState.timeLeft / 60);
    const seconds = timerState.timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <TimerContext.Provider
      value={{
        timerState,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        completeTimer,
        formatTimeLeft
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};