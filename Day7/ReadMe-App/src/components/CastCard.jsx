import React from 'react';
import { formatDate } from '../utils/formatters';

const CastCard = ({ cast }) => {
  // Safely extract properties with fallbacks for undefined values
  const author = cast?.author || {};
  const text = cast?.text || '';
  const timestamp = cast?.timestamp;
  const reactions = cast?.reactions || {};
  const replies = cast?.replies || { count: 0 };
  const embeds = cast?.embeds || [];
  
  // Extract image URLs from embeds
  const images = embeds
    .filter(embed => embed.url && (embed.url.endsWith('.jpg') || embed.url.endsWith('.jpeg') || 
                                  embed.url.endsWith('.png') || embed.url.endsWith('.gif') ||
                                  embed.url.endsWith('.webp')))
    .map(embed => embed.url);
  
  // Extract other media like OpenGraph cards
  const openGraphCards = embeds
    .filter(embed => embed.metadata && embed.metadata.openGraph)
    .map(embed => embed.metadata.openGraph);
  
  // Function to highlight hashtags in text
  const highlightHashtags = (text) => {
    if (!text) return '';
    
    // Split by hashtags and map to JSX elements
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-primary-600 font-medium">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sleek mb-5 hover:shadow-sleek-lg transition-all border-l-2 border-gray-100 hover:border-primary-300">
      <div className="flex items-start mb-3">
        {author.pfp_url && (
          <img 
            src={author.pfp_url} 
            alt={`${author.display_name || author.username}'s profile`}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-sleek-sm mr-2 sm:mr-3 object-cover"
            loading="lazy"
          />
        )}
        <div className="flex-1 min-w-0"> {/* min-width prevents overflow on small screens */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="truncate"> {/* Truncate long usernames on mobile */}
              <div className="font-bold text-base sm:text-lg truncate">{author.display_name || author.username}</div>
              <div className="text-neutral-500 text-xs sm:text-sm truncate">@{author.username}</div>
            </div>
            <div className="text-neutral-400 text-xs mt-1 sm:mt-0">
              {formatDate(timestamp)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="my-3 sm:my-4 whitespace-pre-wrap text-base sm:text-lg break-words"> {/* break-words prevents overflow */}
        {highlightHashtags(text)}
      </div>
      
      {/* Display images if available */}
      {images.length > 0 && (
        <div className={`mt-3 ${images.length > 1 ? 'grid grid-cols-2 gap-2' : ''}`}>
          {images.map((imageUrl, index) => (
            <div key={index} className="relative overflow-hidden rounded-lg">
              <img 
                src={imageUrl} 
                alt="Cast attachment" 
                className="w-full h-auto object-cover rounded-lg hover:opacity-95 transition-opacity"
                loading="lazy"
                onClick={() => window.open(imageUrl, '_blank')}
                style={{ cursor: 'pointer', maxHeight: '400px' }}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Display OpenGraph cards if available and no images */}
      {images.length === 0 && openGraphCards.length > 0 && openGraphCards.map((og, index) => (
        <a 
          key={index}
          href={og.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-3 block border border-gray-200 rounded-lg overflow-hidden hover:shadow-sleek transition-shadow"
        >
          {og.image && (
            <div className="relative w-full" style={{ maxHeight: '200px', overflow: 'hidden' }}>
              <img 
                src={og.image} 
                alt={og.title || 'Link preview'} 
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="p-3">
            {og.title && <div className="font-medium text-sm">{og.title}</div>}
            {og.description && <div className="text-xs text-gray-600 mt-1 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{og.description}</div>}
            <div className="text-xs text-gray-500 mt-1 truncate">{og.url}</div>
          </div>
        </a>
      ))}
      
      {/* Engagement Stats - only show if we have valid data */}
      {(cast && (Number(reactions.likes_count) > 0 || Number(reactions.recasts_count) > 0 || Number(replies.count) > 0 || author.username)) && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
          {/* Engagement Metrics */}
          <div className="flex items-center gap-2">
            {/* Likes */}
            <div className="flex items-center gap-1 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-medium">{Number(reactions.likes_count || 0).toLocaleString()}</span>
            </div>
            
            {/* Recasts */}
            <div className="flex items-center gap-1 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="font-medium">{Number(reactions.recasts_count || 0).toLocaleString()}</span>
            </div>
            
            {/* Replies */}
            <div className="flex items-center gap-1 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="font-medium">{Number(replies.count || 0).toLocaleString()}</span>
            </div>
          </div>
          
          {/* Add a link to view on Farcaster */}
          <div className="ml-auto">
            <a 
              href={`https://warpcast.com/${author.username || ''}/${cast?.hash?.substring(0, 10) || ''}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-700 transition-colors font-medium flex items-center gap-1"
              aria-label="View on Farcaster"
            >
              <span className="hidden sm:inline">View</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default CastCard;
