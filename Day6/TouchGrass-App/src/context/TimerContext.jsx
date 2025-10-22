import { createContext, useState, useEffect, useContext } from 'react';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ children }) => {
  const [timeLimit, setTimeLimit] = useState(() => {
    const saved = localStorage.getItem('timeLimit');
    return saved ? parseInt(saved, 10) : 30; // Default 30 minutes
  });
  
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  // Save time limit to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('timeLimit', timeLimit.toString());
  }, [timeLimit]);

  // Timer logic
  useEffect(() => {
    let interval;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      setIsRunning(false);
      setIsAlarmActive(true);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  // Start timer
  const startTimer = () => {
    if (timeRemaining === 0) {
      // Reset timer if it's finished
      setTimeRemaining(timeLimit * 60);
    }
    setIsRunning(true);
  };

  // Pause timer
  const pauseTimer = () => {
    setIsRunning(false);
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(timeLimit * 60);
    setIsAlarmActive(false);
  };

  // Update time limit (in minutes)
  const updateTimeLimit = (minutes) => {
    setTimeLimit(minutes);
    setTimeRemaining(minutes * 60);
    setIsAlarmActive(false); // Reset alarm state when time limit is updated
  };

  // Stop alarm after challenge is completed
  const stopAlarm = () => {
    setIsAlarmActive(false);
    resetTimer();
  };

  const value = {
    timeLimit,
    timeRemaining,
    isRunning,
    isAlarmActive,
    startTimer,
    pauseTimer,
    resetTimer,
    updateTimeLimit,
    stopAlarm,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};
