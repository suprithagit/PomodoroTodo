import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Coffee } from 'lucide-react';
import { useTimerContext } from '../context/TimerContext';
import { useSettingsContext } from '../context/SettingsContext';
import useTimer from '../hooks/useTimer';

interface PomodoroTimerProps {
  onClose: () => void;
  taskTitle?: string;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onClose, taskTitle }) => {
  const { timerState, completeTimer } = useTimerContext();
  const { settings } = useSettingsContext();
  
  const duration = timerState.type === 'work' ? settings.workDuration : settings.breakDuration;
  
  const {
    timeLeft,
    isActive,
    isPaused,
    start,
    pause,
    resume,
    reset,
    formatTime,
    getProgressPercentage,
    type
  } = useTimer({
    duration,
    type: timerState.type,
    onComplete: completeTimer,
    autoStart: timerState.isActive
  });

  // Set document title with timer
  useEffect(() => {
    const timerType = type === 'work' ? 'Work' : 'Break';
    document.title = `${formatTime()} - ${timerType} | PomodoroTodo`;
    
    return () => {
      document.title = 'PomodoroTodo';
    };
  }, [timeLeft, type, formatTime]);

  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (isActive && !isPaused) {
          pause();
        } else if (isPaused) {
          resume();
        } else {
          start();
        }
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, isPaused, start, pause, resume]);

  const progressDegrees = (getProgressPercentage() / 100) * 360;
  
  // Theme colors based on timer type
  const bgColor = timerState.type === 'work' 
    ? 'bg-red-500' 
    : 'bg-green-500';
  
  const textColor = timerState.type === 'work'
    ? 'text-red-500'
    : 'text-green-500';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          aria-label="Close timer"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {timerState.type === 'work' ? 'Focus Time' : 'Break Time'}
          </h2>
          {taskTitle && timerState.type === 'work' && (
            <p className="text-gray-600 mt-1">{taskTitle}</p>
          )}
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="relative w-56 h-56">
            {/* Timer background */}
            <div className={`${bgColor} bg-opacity-15 w-full h-full rounded-full flex items-center justify-center`}>
              {/* Progress circle */}
              <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#e5e7eb" 
                    strokeWidth="8"
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke={timerState.type === 'work' ? '#ef4444' : '#10b981'} 
                    strokeWidth="8"
                    strokeDasharray="282.7"
                    strokeDashoffset={282.7 - ((282.7 * getProgressPercentage()) / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              
              {/* Timer content */}
              <div className="z-10 text-center">
                <div className={`text-4xl font-bold ${textColor}`}>
                  {formatTime()}
                </div>
                <div className="mt-2">
                  {timerState.type === 'work' ? (
                    <span className="text-red-500">Focus</span>
                  ) : (
                    <div className="flex items-center justify-center text-green-500">
                      <Coffee size={18} className="mr-1" />
                      <span>Break</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {isActive && !isPaused ? (
            <button 
              onClick={pause}
              className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-700 transition-colors duration-200"
              aria-label="Pause timer"
            >
              <Pause size={24} />
            </button>
          ) : (
            <button 
              onClick={isPaused ? resume : start}
              className={`p-3 rounded-full text-white transition-colors duration-200 ${
                timerState.type === 'work' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
              aria-label={isPaused ? "Resume timer" : "Start timer"}
            >
              <Play size={24} />
            </button>
          )}
          
          <button 
            onClick={reset}
            className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-700 transition-colors duration-200"
            aria-label="Reset timer"
          >
            <RotateCcw size={24} />
          </button>
        </div>
        
        <div className="text-center text-gray-500 text-sm mt-4">
          <p>Press Space to start/pause</p>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;