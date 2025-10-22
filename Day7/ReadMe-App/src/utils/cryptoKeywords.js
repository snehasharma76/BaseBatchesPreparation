/**
 * List of popular cryptocurrency and web3 related keywords
 * These will be used as fallback topics if trending API doesn't return enough hashtags
 */
export const cryptoKeywords = [
  { name: 'bitcoin', count: 0 },
  { name: 'ethereum', count: 0 },
  { name: 'solana', count: 0 },
  { name: 'defi', count: 0 },
  { name: 'nft', count: 0 },
  { name: 'web3', count: 0 },
  { name: 'crypto', count: 0 },
  { name: 'blockchain', count: 0 },
  { name: 'dao', count: 0 },
  { name: 'altcoin', count: 0 },
  { name: 'stablecoin', count: 0 },
  { name: 'memecoin', count: 0 },
  { name: 'dex', count: 0 },
  { name: 'yield', count: 0 },
  { name: 'mining', count: 0 },
  { name: 'wallet', count: 0 },
  { name: 'token', count: 0 },
  { name: 'airdrop', count: 0 },
  { name: 'metaverse', count: 0 },
  { name: 'gamefi', count: 0 },
  { name: 'zk', count: 0 },
  { name: 'rollup', count: 0 },
  { name: 'l2', count: 0 },
  { name: 'farcaster', count: 0 },
  { name: 'base', count: 0 },
  { name: 'optimism', count: 0 },
  { name: 'arbitrum', count: 0 },
  { name: 'polygon', count: 0 },
  { name: 'avalanche', count: 0 },
  { name: 'cardano', count: 0 }
];

/**
 * Get a random selection of crypto keywords
 * @param {number} count - Number of keywords to return
 * @returns {Array} - Array of keyword objects
 */
export const getRandomKeywords = (count = 10) => {
  const shuffled = [...cryptoKeywords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default {
  cryptoKeywords,
  getRandomKeywords
};
