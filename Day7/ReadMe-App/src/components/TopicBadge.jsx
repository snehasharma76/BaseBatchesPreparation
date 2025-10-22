import React from 'react';
import { formatNumber } from '../utils/formatters';

const TopicBadge = ({ topic, isSelected, onClick }) => {
  // Generate a consistent color based on the topic name
  const getTopicColor = (name) => {
    const colors = [
      'badge-blue',
      'badge-purple',
      'badge-green',
      'badge-yellow',
      'badge-coral',
    ];
    
    // Simple hash function to get a consistent index
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  const colorClass = getTopicColor(topic.name);
  
  return (
    <button 
      onClick={() => onClick(topic)}
      className={`
        m-1 text-xs transition-all px-2.5 py-1 rounded-full font-medium
        ${colorClass} border border-current
        ${isSelected ? 'ring-1 ring-primary-400 ring-offset-1' : ''}
        hover:shadow-sleek hover:scale-105 active:scale-95
      `}
      aria-label={`Search for topic ${topic.name}`}
    >
      #{topic.name}
      {topic.count > 0 && (
        <span className="ml-1 px-1.5 py-0.5 bg-white text-gray-700 rounded-full text-xs font-medium">
          {formatNumber(topic.count)}
        </span>
      )}
    </button>
  );
};

export default TopicBadge;
