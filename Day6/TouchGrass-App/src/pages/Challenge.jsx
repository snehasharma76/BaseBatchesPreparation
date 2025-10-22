import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimer } from '../context/TimerContext';
import { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const Challenge = () => {
  const { isAlarmActive, stopAlarm } = useTimer();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  
  // Math challenge state
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState('+');
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  
  // If the alarm is not active, redirect to the timer page
  useEffect(() => {
    if (!isAlarmActive) {
      navigate('/timer');
    }
  }, [isAlarmActive, navigate]);

  // Generate a new math problem
  const generateProblem = () => {
    const operations = ['+', '-', '*'];
    const randomOp = operations[Math.floor(Math.random() * operations.length)];
    
    let a, b;
    
    switch (randomOp) {
      case '+':
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * 50) + 1;
        break;
      case '-':
        a = Math.floor(Math.random() * 50) + 25;
        b = Math.floor(Math.random() * 25) + 1;
        break;
      case '*':
        a = Math.floor(Math.random() * 12) + 1;
        b = Math.floor(Math.random() * 12) + 1;
        break;
      default:
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
    }
    
    setNum1(a);
    setNum2(b);
    setOperation(randomOp);
    setAnswer('');
    setIsCorrect(null);
  };

  // Calculate the correct answer
  const calculateCorrectAnswer = () => {
    switch (operation) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '*': return num1 * num2;
      default: return 0;
    }
  };

  // Check the user's answer
  const checkAnswer = (e) => {
    e.preventDefault();
    
    const userAnswer = parseInt(answer, 10);
    const correctAnswer = calculateCorrectAnswer();
    
    if (userAnswer === correctAnswer) {
      setIsCorrect(true);
      // Stop the alarm and redirect to home immediately
      setTimeout(() => {
        stopAlarm();
        navigate('/');
      }, 1000);
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        setIsCorrect(null);
      }, 1000);
    }
  };

  // Generate a problem when component mounts or alarm becomes active
  useEffect(() => {
    if (isAlarmActive) {
      generateProblem();
      
      // Load YouTube IFrame API
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
      // Initialize YouTube player when API is ready
      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player('youtube-player', {
          events: {
            'onReady': (event) => {
              event.target.playVideo();
              event.target.setVolume(100);
            },
            'onStateChange': (event) => {
              // If video ends or is paused, restart it
              if (event.data === window.YT.PlayerState.ENDED || 
                  event.data === window.YT.PlayerState.PAUSED) {
                event.target.playVideo();
              }
            }
          }
        });
      };
      
      // Cleanup function
      return () => {
        window.onYouTubeIframeAPIReady = null;
        if (playerRef.current) {
          try {
            playerRef.current.destroy();
          } catch (e) {
            console.error('Error destroying YouTube player:', e);
          }
        }
      };
    }
  }, [isAlarmActive]);

  // Display operation symbol
  const getOperationSymbol = () => {
    switch (operation) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      default: return '+';
    }
  };

  if (!isAlarmActive) {
    return null;
  }

  // Use the specific YouTube video with enhanced autoplay settings
  const youtubeEmbedUrl = "https://www.youtube.com/embed/l60MnDJklnM?autoplay=1&loop=1&playlist=l60MnDJklnM&controls=0&mute=0&enablejsapi=1&playsinline=1&rel=0";
  
  // Backup method to ensure video plays
  useEffect(() => {
    if (isAlarmActive) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const iframe = document.getElementById('youtube-player');
        if (iframe) {
          // Force iframe refresh to trigger autoplay
          const currentSrc = iframe.src;
          iframe.src = '';
          setTimeout(() => {
            iframe.src = currentSrc;
          }, 100);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isAlarmActive]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="w-full">
        {/* YouTube Video Player */}
        <div className="border-3 sm:border-4 border-neo-black shadow-neo overflow-hidden mb-6 sm:mb-10 rounded-lg">
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={youtubeEmbedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="eager"
              id="youtube-player"
            ></iframe>
          </div>
        </div>
        
        {/* Math Challenge */}
        <div className="bg-neo-red p-4 sm:p-6 border-3 sm:border-4 border-neo-black shadow-neo-lg max-w-md mx-auto rounded-lg">
          <div className="bg-neo-white border-3 sm:border-4 border-neo-black p-3 sm:p-4 mb-4 rounded-lg">
            <div className="font-mono text-2xl sm:text-3xl md:text-4xl text-center font-bold flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span>{num1}</span>
              <span>{getOperationSymbol()}</span>
              <span>{num2}</span>
              <span>=</span>
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-16 sm:w-20 text-center bg-transparent border-b-3 sm:border-b-4 border-neo-black outline-none font-mono"
                placeholder="?"
                autoFocus
                aria-label="Enter your answer"
              />
            </div>
          </div>
          
          <form onSubmit={checkAnswer} className="flex justify-center">
            <button 
              type="submit"
              className="bg-neo-white border-3 sm:border-4 border-neo-black py-2 sm:py-3 px-6 sm:px-8 text-lg sm:text-xl font-bold tracking-widest uppercase hover:translate-y-[-4px] hover:shadow-neo transition-all rounded-lg"
              aria-label="Submit your answer"
            >
              SOLVE
            </button>
          </form>
          
          {isCorrect === true && (
            <div className="bg-neo-white border-3 sm:border-4 border-neo-black p-2 sm:p-3 mt-4 text-center rounded-lg animate-pulse">
              <div className="flex items-center justify-center gap-2">
                <FaCheck className="text-green-600" />
                <p className="font-bold text-neo-black uppercase text-lg sm:text-xl">
                  Correct!
                </p>
              </div>
            </div>
          )}
          
          {isCorrect === false && (
            <div className="bg-neo-darkRed border-3 sm:border-4 border-neo-black p-2 sm:p-3 mt-4 text-center rounded-lg animate-pulse">
              <div className="flex items-center justify-center gap-2">
                <FaTimes className="text-neo-white" />
                <p className="font-bold text-neo-white uppercase text-lg sm:text-xl">
                  Try Again
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Challenge;
