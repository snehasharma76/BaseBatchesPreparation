import React from 'react';

const SortControls = ({ sortBy, onSort }) => {
  const sortOptions = [
    { id: 'recent', label: 'Recent', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: 'likes', label: 'Likes', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )},
    { id: 'recasts', label: 'Recasts', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )},
    { id: 'replies', label: 'Comments', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    )}
  ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {sortOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => onSort(option.id)}
          className={`
            flex items-center gap-1.5 px-2.5 py-1 text-xs sm:text-sm font-medium transition-all rounded-md
            ${sortBy === option.id 
              ? 'bg-primary-500 text-white shadow-sleek' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}
          `}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SortControls;
