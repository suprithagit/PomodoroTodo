import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TaskList from './components/TaskList';
import PomodoroTimer from './components/PomodoroTimer';
import SettingsModal from './components/SettingsModal';
import ProgressDashboard from './components/ProgressDashboard';
import { TaskProvider } from './context/TaskContext';
import { SettingsProvider } from './context/SettingsContext';
import { TimerProvider } from './context/TimerContext';
import { useTimerContext } from './context/TimerContext';
import { useTaskContext } from './context/TaskContext';

// Wrapper component to use contexts
const AppContent: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  
  const { timerState } = useTimerContext();
  const { tasks } = useTaskContext();
  
  // Show timer when timerState is active
  useEffect(() => {
    if (timerState.isActive) {
      setShowTimer(true);
    }
  }, [timerState.isActive]);
  
  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 's' && e.target === document.body) {
        setShowSettings(prev => !prev);
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Find the current task being worked on
  const currentTask = timerState.currentTaskId 
    ? tasks.find(task => task.id === timerState.currentTaskId)
    : undefined;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header openSettings={() => setShowSettings(true)} />
      
      <main className="container mx-auto py-6 px-4 flex-grow">
        <ProgressDashboard />
        <TaskList />
      </main>
      
      {showTimer && (
        <PomodoroTimer 
          onClose={() => setShowTimer(false)} 
          taskTitle={currentTask?.title}
        />
      )}
      
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

function App() {
  return (
    <SettingsProvider>
      <TaskProvider>
        <TimerProvider>
          <AppContent />
        </TimerProvider>
      </TaskProvider>
    </SettingsProvider>
  );
}

export default App;