/**
 * Bitcoin Market Card Component
 * 
 * This component demonstrates:
 * - Real-time data display with professional UI
 * - Dynamic color coding for market changes
 * - Loading states and error handling
 * - Web3-aligned financial presentation
 * - Responsive design with Tailwind CSS
 */

import React, { useState, useEffect } from 'react'
import { fetchBitcoinMarket } from '../services/api'

// Bitcoin logo component (inline SVG for performance)
const BitcoinLogo = () => (
  <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.045 2.5c-5.463 0-9.89 4.426-9.89 9.889 0 4.523 3.025 8.332 7.159 9.514.523.095.714-.227.714-.505 0-.249-.009-.909-.014-1.784-2.912.632-3.531-1.405-3.531-1.405-.476-1.209-1.162-1.533-1.162-1.533-.951-.65.072-.637.072-.637 1.051.074 1.605 1.078 1.605 1.078.934 1.6 2.453 1.138 3.051.87.095-.677.365-1.138.665-1.398-2.329-.265-4.775-1.164-4.775-5.181 0-1.144.409-2.083 1.08-2.819-.109-.265-.468-1.329.102-2.769 0 0 .88-.282 2.882 1.073a10.04 10.04 0 012.617-.352c.889.004 1.783.12 2.618.352 2.001-.79 2.879-1.073 2.879-1.073.572 1.44.213 2.504.104 2.769.672.736 1.08 1.675 1.08 2.819 0 4.03-2.451 4.913-4.788 5.171.376.324.711.964.711 1.942 0 1.403-.013 2.537-.013 2.879 0 .281.188.605.72.502 4.124-1.187 7.144-4.991 7.144-9.511 0-5.463-4.427-9.889-9.89-9.889z"/>
  </svg>
)

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
)

// Error display component
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="text-center py-6">
    <div className="text-red-500 mb-4">
      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Market Data Unavailable</h3>
    <p className="text-gray-600 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Retry
    </button>
  </div>
)

// Format number with appropriate suffix (K, M, B)
const formatLargeNumber = (num) => {
  if (!num) return 'N/A'
  
  if (num >= 1e12) {
    return `₹${(num / 1e12).toFixed(2)}T`
  } else if (num >= 1e9) {
    return `₹${(num / 1e9).toFixed(2)}B`
  } else if (num >= 1e7) {
    return `₹${(num / 1e7).toFixed(2)}Cr`
  } else if (num >= 1e5) {
    return `₹${(num / 1e5).toFixed(2)}L`
  } else if (num >= 1e3) {
    return `₹${(num / 1e3).toFixed(2)}K`
  }
  
  return `₹${num.toFixed(2)}`
}

// Format price with proper decimal places
const formatPrice = (price) => {
  if (!price) return 'N/A'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: price < 1 ? 4 : 2
  }).format(price)
}

// Format percentage with color indication
const formatPercentage = (change) => {
  if (change === null || change === undefined) return 'N/A'
  
  const isPositive = change >= 0
  const color = isPositive ? 'text-green-600' : 'text-red-600'
  const sign = isPositive ? '+' : ''
  
  return (
    <span className={color}>
      {sign}{change.toFixed(2)}%
    </span>
  )
}

const BitcoinMarketCard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Fetch Bitcoin market data
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetchBitcoinMarket()
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch market data')
      }
      
      setData(response.data)
      setLastUpdated(new Date())
      
    } catch (err) {
      console.error('Bitcoin market data error:', err)
      setError(err.message || 'Unable to load market data')
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh data every 60 seconds
  useEffect(() => {
    fetchData()
    
    const interval = setInterval(fetchData, 60000)
    
    return () => clearInterval(interval)
  }, [])

  // Render loading state
  if (loading && !data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <LoadingSkeleton />
      </div>
    )
  }

  // Render error state
  if (error && !data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <ErrorDisplay error={error} onRetry={fetchData} />
      </div>
    )
  }

  // Render market data
  const { current } = data || {}

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
      {/* Header with logo and title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BitcoinLogo />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{current?.name || 'Bitcoin'}</h2>
            <p className="text-sm text-gray-500">{current?.symbol || 'BTC'}</p>
          </div>
        </div>
        
        {/* Auto-refresh indicator */}
        <div className="flex items-center text-sm text-gray-500">
          <div className={`w-2 h-2 rounded-full mr-2 ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
          {loading ? 'Updating...' : 'Live'}
        </div>
      </div>

      {/* Current price display */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {formatPrice(current?.price)}
        </div>
        <div className="text-lg">
          {formatPercentage(current?.priceChange24h)}
          <span className="text-gray-500 ml-2">24h</span>
        </div>
      </div>

      {/* Market statistics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Market Cap</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatLargeNumber(current?.marketCap)}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">24h Volume</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatLargeNumber(current?.volume24h)}
          </div>
        </div>
      </div>

      {/* Footer with last updated time */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
        <div>
          Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : 'Never'}
        </div>
        <div className="flex items-center space-x-2">
          <span>Auto-refresh: 60s</span>
          <button
            onClick={fetchData}
            className="text-blue-600 hover:text-blue-700 font-medium"
            disabled={loading}
          >
            {loading ? '...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error overlay (if data exists but refresh fails) */}
      {error && data && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center text-sm text-yellow-800">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Latest update failed. Showing cached data.</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default BitcoinMarketCard
