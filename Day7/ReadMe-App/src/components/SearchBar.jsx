import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, isLoading, initialSearchTerm = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  // Update search term when initialSearchTerm changes (e.g., when a tag is clicked)
  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search crypto topics..."
          className="border border-gray-200 rounded-lg pl-9 sm:pl-12 pr-12 sm:pr-24 py-2 sm:py-3 text-base w-full focus:outline-none focus:ring-1 focus:ring-primary-300 focus:border-primary-300 shadow-sleek"
          disabled={isLoading}
        />
        
        {/* Action buttons container */}
        <div className="absolute inset-y-0 right-0 flex items-center gap-0 sm:gap-1 pr-1 sm:pr-2">
          {/* Clear button - only show when there's text */}
          {searchTerm && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 p-1.5 sm:p-1 bg-white sm:border sm:border-gray-200 sm:rounded-full"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {/* Search button - different styles for mobile and desktop */}
          <button
            type="submit"
            className={`
              ${isLoading || !searchTerm.trim() ? 'opacity-50 cursor-not-allowed' : ''}
              sm:bg-primary-500 sm:text-white sm:px-3 md:px-4 sm:py-1.5 sm:text-sm md:text-base sm:rounded-md
              flex items-center justify-center
            `}
            disabled={isLoading || !searchTerm.trim()}
            aria-label="Search"
          >
            {/* Show icon on small screens, text on larger screens */}
            <span className="hidden sm:inline">{isLoading ? 'Searching...' : 'Search'}</span>
            <span className="sm:hidden p-2 text-primary-600">
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </span>
          </button>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Try: #bitcoin, #defi, #nft, #web3
      </div>
    </form>
  );
};

export default SearchBar;
