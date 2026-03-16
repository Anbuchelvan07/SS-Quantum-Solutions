import express from 'express'
import { fetchBitcoinMarketData, clearCache } from '../services/bitcoinService.js'

const router = express.Router()

/**
 * GET /api/market/bitcoin
 * 
 * Comprehensive Bitcoin market data endpoint
 * Returns current statistics and 30-day historical data
 * 
 * Response Structure:
 * {
 *   success: boolean,
 *   data: {
 *     current: { name, symbol, price, priceChange24h, marketCap, volume24h, lastUpdated },
 *     historical: { prices: [{timestamp, date, price, marketCap}], period, granularity },
 *     metadata: { dataSource, cacheExpiry, refreshInterval }
 *   },
 *   error?: { message, statusCode, timestamp, type },
 *   fallback?: { current, historical }
 * }
 */
router.get('/bitcoin', async (req, res) => {
  try {
    const marketData = await fetchBitcoinMarketData()
    
    // Set appropriate headers for frontend consumption
    res.set({
      'Cache-Control': 'public, max-age=60', // Allow browser caching for 60s
      'Content-Type': 'application/json'
    })
    
    // Return appropriate status code based on API response
    const statusCode = marketData.success ? 200 : 503
    res.status(statusCode).json(marketData)
    
  } catch (error) {
    // Last resort error handling - should rarely be reached due to service-level handling
    console.error('🚨 Unhandled Bitcoin route error:', error)
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error while fetching Bitcoin data',
        statusCode: 500,
        timestamp: new Date().toISOString(),
        type: 'INTERNAL_ERROR'
      },
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
    })
  }
})

/**
 * POST /api/market/bitcoin/refresh
 * Force clear cache and fetch fresh Bitcoin data
 * (Use with admin authentication in production)
 */
router.post('/bitcoin/refresh', async (req, res) => {
  try {
    console.log('🔄 Manual Bitcoin cache refresh requested')
    clearCache('bitcoin-market-data')
    
    const freshData = await fetchBitcoinMarketData()
    res.json({
      success: true,
      message: 'Cache cleared and fresh data fetched',
      data: freshData
    })
  } catch (error) {
    console.error('❌ Error during manual refresh:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to refresh Bitcoin data',
      error: error.message
    })
  }
})

export default router

