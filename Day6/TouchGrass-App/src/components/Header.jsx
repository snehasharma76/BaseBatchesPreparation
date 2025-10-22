import { Link } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="py-3 sm:py-4 bg-neo-red fixed top-0 left-0 right-0 z-10 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 flex justify-center items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 sm:gap-3 hover:scale-105 transition-transform duration-300"
          aria-label="Go to home page"
        >
          <FaLeaf className="text-neo-white text-xl sm:text-2xl" />
          <span className="font-display text-lg sm:text-xl text-neo-white font-bold tracking-wider">
            TOUCHGRASS
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
