import TimerDisplay from '../components/TimerDisplay';
import { useTimer } from '../context/TimerContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';

const Timer = () => {
  const { isAlarmActive } = useTimer();
  const navigate = useNavigate();

  // If alarm becomes active, navigate to challenge page
  useEffect(() => {
    if (isAlarmActive) {
      navigate('/challenge');
    }
  }, [isAlarmActive, navigate]);

  return (
    <div className="w-full max-w-xl mx-auto text-center px-4 sm:px-6">
      <TimerDisplay />
    </div>
  );
};

export default Timer;
