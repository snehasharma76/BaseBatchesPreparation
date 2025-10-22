import { FaLeaf } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-3 sm:py-4 mt-auto bg-neo-red border-t border-neo-white border-opacity-20">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <div className="flex items-center">
            <FaLeaf className="text-neo-white text-sm mr-2 opacity-80" />
            <span className="text-neo-white text-sm font-display tracking-wide opacity-80">
              TOUCHGRASS
            </span>
          </div>
          <span className="text-neo-white text-xs opacity-60">
            &copy; {currentYear} TouchGrass App
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
