import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import Header from '../components/Header';
import TopicBadge from '../components/TopicBadge';
import CastCard from '../components/CastCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar from '../components/SearchBar';
import SortControls from '../components/SortControls';
import { cryptoKeywords } from '../utils/cryptoKeywords';

const HomePage = () => {
  const { 
    suggestedTopics,
    selectedTopic, 
    searchResults, 
    loading, 
    error, 
    sortBy,
    searchByTopic,
    selectTopic,
    refreshSuggestedTopics,
    sortResults
  } = useAppContext();

  return (
    <div className="container-custom py-8">
      <Header />
      
      {/* Search Section */}
      <div className="sleek-card mb-8 bg-white shadow-sleek border-b-2 border-primary-500">
        <h2 className="text-2xl font-bold mb-4 text-primary-600">Search Crypto Topics</h2>
        <SearchBar 
          onSearch={searchByTopic} 
          isLoading={loading} 
          initialSearchTerm={selectedTopic ? selectedTopic.name : ''}
        />
      </div>
      
      {error && <ErrorMessage message={error} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Sidebar with Suggested Topics */}
        <div className="lg:col-span-1">
          {/* Suggested Topics Section */}
          <div className="sleek-card bg-white shadow-sleek border-l-2 border-primary-500 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-primary-600">Suggested Topics</h2>
              <button 
                onClick={refreshSuggestedTopics}
                className="text-sm py-1 px-3 bg-white border border-primary-500 text-primary-600 hover:bg-primary-50 rounded-md"
                disabled={loading}
              >
                Refresh
              </button>
            </div>
            
            <div className="mb-4 text-sm text-neutral-600">
              Click on any topic to see related conversations
            </div>
            
            <div className="flex flex-wrap">
              {suggestedTopics.map((topic) => (
                <TopicBadge
                  key={topic.name}
                  topic={topic}
                  isSelected={selectedTopic?.name === topic.name}
                  onClick={selectTopic}
                />
              ))}
            </div>
          </div>
          

        </div>
        
        {/* Results Section */}
        <div className="lg:col-span-3">
          {selectedTopic ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-dark">
                  Casts about <span className="text-primary-600">#{selectedTopic.name}</span>
                </h2>
                
                {/* Sort Controls */}
                <div className="flex-shrink-0">
                  <SortControls sortBy={sortBy} onSort={sortResults} />
                </div>
              </div>
              
              {loading ? (
                <LoadingSpinner />
              ) : searchResults.length > 0 ? (
                <div className="space-y-6">
                  {searchResults.map((cast) => (
                    <CastCard key={cast.hash} cast={cast} />
                  ))}
                </div>
              ) : (
                <div className="sleek-card bg-white">
                  <div className="text-center py-8">
                    <h3 className="text-xl font-bold mb-2">No casts found</h3>
                    <p className="text-gray-600">
                      Try searching for a different topic
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="sleek-card bg-white shadow-sleek h-64 flex items-center justify-center border-l-2 border-primary-500">
              <div className="text-center px-4">
                <h3 className="text-2xl font-bold mb-3 text-primary-600">Discover Crypto Conversations</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Use the search bar above or click on a suggested topic to see the latest discussions from Farcaster
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
