import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center py-12">
      <div className="relative">
        {/* Colorful spinner */}
        <div className="w-16 h-16 border-4 border-primary-300 border-t-primary-600 border-r-accent-500 border-b-accent-400 rounded-full animate-spin"></div>
        
        {/* Inner circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-white border-2 border-black rounded-full"></div>
        </div>
      </div>
      
      <div className="mt-4 neo-brutal-box py-2 px-4 bg-gradient-to-r from-primary-100 to-accent-100">
        <div className="text-center font-bold text-primary-800">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
