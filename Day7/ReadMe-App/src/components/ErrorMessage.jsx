import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="neo-brutal-box mb-6 border-4 border-red-500 bg-red-50">
      <div className="flex items-start">
        <div className="mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <div className="font-bold text-red-700 mb-1 text-lg">Error</div>
          <div className="text-red-600">{message}</div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
