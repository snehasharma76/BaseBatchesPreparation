import { Link } from 'react-router-dom';
import { FaClock, FaLeaf } from 'react-icons/fa';
import { useTimer } from '../context/TimerContext';

const Home = () => {
  const { timeLimit } = useTimer();

  return (
    <div className="neo-container px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-lg text-center mx-auto">
        {/* Improved heading with icon and responsive text sizes */}
        <div className="mb-8 sm:mb-12 animate-fadeIn">
          <div className="flex items-center justify-center mb-4 space-x-3">
            <FaLeaf className="text-neo-white text-3xl sm:text-4xl" />
            <h1 className="text-neo-white font-display text-4xl sm:text-5xl font-bold tracking-wider">
              TOUCHGRASS
            </h1>
          </div>
          <div className="neo-card inline-block mt-6 transform hover:rotate-1 transition-transform">
            <p className="text-neo-black text-xl sm:text-2xl">
              Current limit: <span className="font-bold">{timeLimit} MIN</span>
            </p>
          </div>
        </div>
        
        {/* Responsive button with improved hover effects */}
        <Link 
          to="/timer" 
          className="bg-neo-white border-3 border-neo-black py-6 sm:py-10 px-8 sm:px-16 mx-auto flex items-center justify-center hover:translate-y-[-6px] hover:shadow-neo-lg transition-all duration-300 transform hover:scale-105"
          aria-label="Start timer"
        >
          <FaClock className="text-3xl sm:text-4xl mr-4 sm:mr-6" />
          <span className="text-2xl sm:text-3xl font-bold tracking-widest uppercase">START</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
