import { useState, useEffect } from 'react';
import { useTimer } from '../context/TimerContext';
import { FaPlay, FaPause, FaRedo, FaClock, FaCheck } from 'react-icons/fa';

const TimerDisplay = () => {
  const { 
    timeRemaining, 
    isRunning, 
    startTimer, 
    pauseTimer, 
    resetTimer,
    timeLimit,
    updateTimeLimit
  } = useTimer();
  
  const [isEditing, setIsEditing] = useState(false);
  const [minutes, setMinutes] = useState(timeLimit);
  
  // Update minutes state when timeLimit changes
  useEffect(() => {
    setMinutes(timeLimit);
  }, [timeLimit]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Save the new time limit
  const saveTimeLimit = () => {
    updateTimeLimit(minutes);
    setIsEditing(false);
  };
  
  // Handle quick preset time selection
  const handlePresetTime = (time) => {
    setMinutes(time);
    updateTimeLimit(time);
    setIsEditing(false);
  };
  
  // Start timer after editing
  const handleStartTimer = () => {
    if (isEditing) {
      saveTimeLimit();
    }
    startTimer();
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6">
      <div className="w-full text-center">
        {/* Timer Display with Edit Functionality */}
        <div className="mb-6 sm:mb-10">
          {isEditing ? (
            <div className="border-3 sm:border-4 border-neo-white p-4 sm:p-8 mb-4 flex items-center justify-center rounded-lg">
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  max="240"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value, 10) || 1)}
                  className="w-24 sm:w-32 text-center bg-transparent border-none outline-none font-mono font-bold text-neo-white text-4xl sm:text-6xl"
                  autoFocus
                />
                <span className="text-neo-white text-4xl sm:text-6xl font-mono font-bold">:00</span>
                <button 
                  onClick={saveTimeLimit}
                  className="ml-4 sm:ml-6 text-neo-white hover:text-neo-accent transition-colors"
                  aria-label="Save time limit"
                >
                  <FaCheck size={24} className="sm:w-8 sm:h-8" />
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="border-3 sm:border-4 border-neo-white p-4 sm:p-8 mb-4 cursor-pointer flex items-center justify-center rounded-lg shadow-neo transition-all hover:shadow-neo-lg"
              onClick={() => !isRunning && setIsEditing(true)}
              aria-label={!isRunning ? "Edit timer" : "Current timer"}
            >
              <span className="font-mono font-bold text-neo-white text-5xl sm:text-7xl">{formatTime(timeRemaining)}</span>
              {!isRunning && (
                <FaClock className="ml-4 sm:ml-6 text-neo-white opacity-50" size={24} />
              )}
            </div>
          )}
        </div>
        
        {/* Quick Preset Times - Only show when editing and not running */}
        {isEditing && !isRunning && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-10">
            {[15, 30, 45, 60, 90, 120].map(time => (
              <button
                key={time}
                onClick={() => handlePresetTime(time)}
                className="py-2 sm:py-3 border-2 sm:border-3 border-neo-white font-mono text-lg sm:text-xl font-bold transition-all hover:bg-neo-white hover:text-neo-black rounded"
                aria-label={`Set timer to ${time} minutes`}
              >
                {time}
              </button>
            ))}
          </div>
        )}
        
        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8">
          {!isRunning ? (
            <button 
              onClick={handleStartTimer}
              className="bg-neo-white border-3 sm:border-4 border-neo-black py-3 sm:py-5 text-xl sm:text-2xl font-bold tracking-widest uppercase hover:translate-y-[-4px] hover:shadow-neo transition-all rounded-lg"
              aria-label="Start timer"
            >
              START
            </button>
          ) : (
            <button 
              onClick={pauseTimer}
              className="bg-neo-white border-3 sm:border-4 border-neo-black py-3 sm:py-5 text-xl sm:text-2xl font-bold tracking-widest uppercase hover:translate-y-[-4px] hover:shadow-neo transition-all rounded-lg"
              aria-label="Pause timer"
            >
              PAUSE
            </button>
          )}
          
          <button 
            onClick={resetTimer}
            className="border-3 sm:border-4 border-neo-white py-3 sm:py-5 text-xl sm:text-2xl font-bold tracking-widest uppercase hover:translate-y-[-4px] transition-all rounded-lg"
            aria-label="Reset timer"
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
