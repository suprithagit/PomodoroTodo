import { useState, useEffect, useRef } from 'react';
import { TimerType } from '../types';

interface UseTimerProps {
  duration: number;
  type: TimerType;
  onComplete: () => void;
  autoStart?: boolean;
}

function useTimer({ duration, type, onComplete, autoStart = false }: UseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isActive, setIsActive] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Clean up interval when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update timer when duration changes
  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  // Start or stop the timer when isActive changes
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            // Timer completed
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
            }
            onComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, onComplete]);

  const start = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pause = () => {
    setIsPaused(true);
  };

  const resume = () => {
    setIsPaused(false);
  };

  const reset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(duration * 60);
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  };

  return {
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
  };
}

export default useTimer;