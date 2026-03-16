/**
 * Bitcoin Market Data Service
 * 
 * This service demonstrates:
 * - Real-time data integration from external APIs
 * - In-memory caching to prevent rate limiting
 * - Professional error handling for production environments
 * - Web3-aligned analytics for consultancy platforms
 * - Scalable backend design with modular architecture
 */

import axios from 'axios'

// Cache configuration - prevents API rate limiting and improves performance
const CACHE_DURATION = 60000 // 60 seconds
const cache = new Map()

/**
 * In-memory cache with TTL support
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds
 */
const setCache = (key, data, ttl = CACHE_DURATION) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  })
}

/**
 * Get cached data if still valid
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if expired/not found
 */
const getCache = (key) => {
  const cached = cache.get(key)
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key)
    return null
  }
  
  return cached.data
}

/**
 * Fetches comprehensive Bitcoin market data from CoinGecko API
 * Implements caching, error handling, retries, and data transformation
 * 
 * @returns {Promise<Object>} Bitcoin market data with current stats and historical data
 * @throws {Error} When API fails or returns invalid data
 */
export const fetchBitcoinMarketData = async () => {
  const cacheKey = 'bitcoin-market-data'
  const cachedData = getCache(cacheKey)
  
  // Return cached data if still valid (demonstrates performance optimization)
  if (cachedData) {
    console.log('📊 Serving Bitcoin data from cache')
    return cachedData
  }
  
  // Get API URL - with better logging for debugging
  const apiUrl = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3'
  console.log(`🔄 Fetching fresh Bitcoin data from: ${apiUrl}`)
  
  let lastError = null
  const maxRetries = 2
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📡 API Call Attempt ${attempt}/${maxRetries}`)
      
      // Execute parallel API calls for efficiency
      const [currentData, historicalData] = await Promise.all([
        // Current market statistics
        axios.get(`${apiUrl}/simple/price`, {
          params: {
            ids: 'bitcoin',
            vs_currencies: 'inr',
            include_24hr_change: true,
            include_market_cap: true,
            include_24hr_vol: true,
            include_last_updated_at: true
          },
          timeout: 8000,
          headers: {
            'User-Agent': 'HR-Consultancy-Platform/1.0'
          }
        }),
        
        // Historical price data (last 30 days for professional charting)
        axios.get(`${apiUrl}/coins/bitcoin/market_chart`, {
          params: {
            vs_currency: 'inr',
            days: 30,
            interval: 'daily'
          },
          timeout: 10000,
          headers: {
            'User-Agent': 'HR-Consultancy-Platform/1.0'
          }
        })
      ])
      
      // Validate and transform current market data
      const current = currentData.data.bitcoin
      if (!current || typeof current.inr !== 'number') {
        throw new Error('Invalid current market data structure')
      }
      
      // Process historical data for frontend consumption
      const historical = historicalData.data
      const processedHistorical = historical.prices.map(([timestamp, price]) => ({
        timestamp,
        date: new Date(timestamp).toISOString().split('T')[0], // YYYY-MM-DD format
        price: Number(price.toFixed(2)),
        // Calculate market cap approximation (price * estimated supply)
        marketCap: Number((price * 19500000).toFixed(2)) // Approximate BTC supply
      }))
      
      // Construct comprehensive response object
      const marketData = {
        success: true,
        data: {
          // Current market statistics
          current: {
            name: 'Bitcoin',
            symbol: 'BTC',
            price: current.inr,
            priceChange24h: current.inr_24h_change || 0,
            marketCap: current.inr_market_cap || 0,
            volume24h: current.inr_24h_vol || 0,
            lastUpdated: new Date((current.last_updated_at || Date.now()) * 1000).toISOString()
          },
          
          // Historical data for charting (30 days)
          historical: {
            prices: processedHistorical,
            period: '30 days',
            granularity: 'daily'
          },
          
          // Metadata for frontend display
          metadata: {
            dataSource: 'CoinGecko',
            cacheExpiry: new Date(Date.now() + CACHE_DURATION).toISOString(),
            refreshInterval: `${CACHE_DURATION / 1000} seconds`,
            isLive: true
          }
        }
      }
      
      // Cache the successful response
      setCache(cacheKey, marketData)
      
      console.log('✅ Bitcoin data fetched and cached successfully on attempt', attempt)
      return marketData
      
    } catch (error) {
      lastError = error
      console.error(`⚠️ Attempt ${attempt} failed:`, error.message)
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000
        console.log(`⏳ Waiting ${delay}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  // All retries failed - check if we have cached data as fallback
  console.error(`❌ All API attempts failed after ${maxRetries} tries:`, lastError?.message)
  
  // Try to return stale cache if available
  const staleCacheKey = cacheKey
  const staleCache = cache.get(staleCacheKey)
  if (staleCache && staleCache.data) {
    console.log('⚠️ Returning stale cached data due to API failure')
    return {
      ...staleCache.data,
      isStale: true,
      warning: 'Data is from cache. Latest update failed. Showing cached data.'
    }
  }

  // No cache available - return error response
  let errorMessage = 'Unable to fetch Bitcoin market data'
  let statusCode = 500
  
  if (lastError?.response) {
    // API responded with error status
    statusCode = lastError.response.status
    if (lastError.response.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later. Using cached data if available.'
    } else if (lastError.response.status >= 500) {
      errorMessage = 'External service temporarily unavailable'
    } else {
      errorMessage = 'Invalid API request configuration'
    }
  } else if (lastError?.request) {
    // Network error - no response received
    errorMessage = 'Network connection failed. Please check your internet connection.'
  } else if (lastError?.code === 'ENOTFOUND') {
    errorMessage = 'DNS resolution failed. Unable to reach API server.'
  }
  
  // Return structured error response for frontend handling
  return {
    success: false,
    error: {
      message: errorMessage,
      statusCode,
      timestamp: new Date().toISOString(),
      type: lastError?.response ? 'API_ERROR' : 'NETWORK_ERROR'
    },
    // Provide fallback data for graceful degradation
    fallback: {
      current: {
        name: 'Bitcoin',
        symbol: 'BTC',
        price: null,
        priceChange24h: null,
        marketCap: null,
        volume24h: null,
        lastUpdated: null
      },
      historical: {
        prices: [],
        period: '30 days',
        granularity: 'daily'
      }
    }
  }
}

/**
 * Clear cache manually (useful for testing or forced refresh)
 * @param {string} key - Specific cache key to clear (optional)
 */
export const clearCache = (key = null) => {
  if (key) {
    cache.delete(key)
    console.log(`🧹 Cache cleared for key: ${key}`)
  } else {
    cache.clear()
    console.log('🧹 All cache cleared')
  }
}

/**
 * Get cache statistics for monitoring
 * @returns {Object} Cache performance metrics
 */
export const getCacheStats = () => {
  const now = Date.now()
  const stats = {
    totalEntries: cache.size,
    validEntries: 0,
    expiredEntries: 0
  }
  
  cache.forEach((value) => {
    if (now - value.timestamp > value.ttl) {
      stats.expiredEntries++
    } else {
      stats.validEntries++
    }
  })
  
  return stats
}
