import { createContext, useContext, useState } from 'react';
import { searchCasts } from '../services/neynarApi';
import { cryptoKeywords, getRandomKeywords } from '../utils/cryptoKeywords';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [suggestedTopics, setSuggestedTopics] = useState(getRandomKeywords(12));
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'likes', 'recasts', 'replies'

  // Search for casts by topic
  const searchByTopic = async (topic) => {
    setLoading(true);
    setError(null);
    
    try {
      // If topic doesn't start with #, add it
      const searchTerm = topic.startsWith('#') ? topic : `#${topic}`;
      const data = await searchCasts(searchTerm, 30);
      setSearchResults(data.casts || []);
      
      // Create a topic object and set it as selected
      setSelectedTopic({
        name: topic.startsWith('#') ? topic.substring(1) : topic,
        count: data.casts?.length || 0
      });
      
    } catch (err) {
      setError(`Failed to search for "${topic}". Please try again later.`);
      console.error(err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Select a topic from the suggested list
  const selectTopic = (topic) => {
    searchByTopic(topic.name);
  };

  // Refresh suggested topics with new random selection
  const refreshSuggestedTopics = () => {
    setSuggestedTopics(getRandomKeywords(12));
  };

  // Sort results based on selected criteria
  const sortResults = (criteria) => {
    setSortBy(criteria);
    
    const sortedResults = [...searchResults];
    
    switch (criteria) {
      case 'likes':
        sortedResults.sort((a, b) => 
          Number(b.reactions?.likes_count || 0) - Number(a.reactions?.likes_count || 0)
        );
        break;
      case 'recasts':
        sortedResults.sort((a, b) => 
          Number(b.reactions?.recasts_count || 0) - Number(a.reactions?.recasts_count || 0)
        );
        break;
      case 'replies':
        sortedResults.sort((a, b) => 
          Number(b.replies?.count || 0) - Number(a.replies?.count || 0)
        );
        break;
      case 'recent':
      default:
        // Already sorted by recency from API
        break;
    }
    
    setSearchResults(sortedResults);
  };

  const value = {
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
