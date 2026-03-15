/**
 * Bitcoin Historical Chart Component
 * 
 * This component demonstrates:
 * - Professional data visualization with Recharts
 * - Responsive chart design for dashboards
 * - Interactive tooltips and legends
 * - Web3-aligned analytics presentation
 * - Performance optimization with data processing
 */

import React, { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush
} from 'recharts'
import { fetchBitcoinMarket } from '../services/api'

// Custom tooltip component for better UX
const CustomTooltip = ({ active, payload, _label }) => {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload
  const price = payload[0].value
  const marketCap = payload[1]?.value

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <div className="text-sm font-medium text-gray-900 mb-2">
        {new Date(data.timestamp).toLocaleDateString()}
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between space-x-4">
          <span className="text-sm text-gray-600">Price:</span>
          <span className="text-sm font-medium text-gray-900">
            ₹{price?.toLocaleString('en-IN')}
          </span>
        </div>
        {marketCap && (
          <div className="flex items-center justify-between space-x-4">
            <span className="text-sm text-gray-600">Market Cap:</span>
            <span className="text-sm font-medium text-gray-900">
              ₹{(marketCap / 1e9).toFixed(2)}B
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// Loading skeleton for chart
const ChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="h-64 bg-gray-200 rounded-lg"></div>
  </div>
)

// Error display for chart
const ChartError = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <div className="text-gray-400 mb-4">
      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Chart Data Unavailable</h3>
    <p className="text-gray-600 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Retry
    </button>
  </div>
)

// Process historical data for chart consumption
const processChartData = (historicalData) => {
  if (!historicalData || !historicalData.prices) {
    return []
  }

  return historicalData.prices.map(item => ({
    ...item,
    // Format date for better display
    displayDate: new Date(item.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
    // Round values for cleaner chart
    price: Math.round(item.price),
    marketCap: Math.round(item.marketCap / 1e9) // Convert to billions
  }))
}

// Calculate chart statistics
const calculateStats = (data) => {
  if (!data || data.length === 0) {
    return { highest: 0, lowest: 0, average: 0, volatility: 0 }
  }

  const prices = data.map(d => d.price)
  const highest = Math.max(...prices)
  const lowest = Math.min(...prices)
  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length
  
  // Simple volatility calculation (standard deviation)
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - average, 2), 0) / prices.length
  const volatility = Math.sqrt(variance)

  return {
    highest: highest.toLocaleString(),
    lowest: lowest.toLocaleString(),
    average: average.toLocaleString(),
    volatility: volatility.toFixed(2)
  }
}

const BitcoinHistoricalChart = ({ height = 400 }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [timeRange, setTimeRange] = useState('30d')

  // Fetch historical data
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetchBitcoinMarket()
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch historical data')
      }
      
      const processedData = processChartData(response.data.historical)
      setData(processedData)
      setStats(calculateStats(processedData))
      
    } catch (err) {
      console.error('Historical chart data error:', err)
      setError(err.message || 'Unable to load chart data')
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
  if (loading && data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <ChartSkeleton />
      </div>
    )
  }

  // Render error state
  if (error && data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <ChartError error={error} onRetry={fetchData} />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      {/* Chart header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl mb-1">Bitcoin Price History</h2>
          <p className="text-xs text-gray-500 sm:text-sm">
            30-day performance with market capitalization
          </p>
        </div>
        
        {/* Time range selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 sm:text-sm">Period:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-xs sm:text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="30d">30 Days</option>
            <option value="7d">7 Days</option>
            <option value="24h">24 Hours</option>
          </select>
        </div>
      </div>

      {/* Statistics cards */}
      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-lg bg-gray-50 p-2 sm:p-3">
            <div className="mb-1 text-xs text-gray-600">Highest</div>
            <div className="text-xs font-semibold text-gray-900 sm:text-sm">₹{stats.highest}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-2 sm:p-3">
            <div className="mb-1 text-xs text-gray-600">Lowest</div>
            <div className="text-xs font-semibold text-gray-900 sm:text-sm">₹{stats.lowest}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-2 sm:p-3">
            <div className="mb-1 text-xs text-gray-600">Average</div>
            <div className="text-xs font-semibold text-gray-900 sm:text-sm">₹{stats.average}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-2 sm:p-3">
            <div className="mb-1 text-xs text-gray-600">Volatility</div>
            <div className="text-xs font-semibold text-gray-900 sm:text-sm">₹{stats.volatility}</div>
          </div>
        </div>
      )}

      {/* Chart container */}
      <div className="mb-4" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorMarketCap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="displayDate" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              wrapperStyle={{
                paddingTop: '20px'
              }}
            />
            
            <Area
              type="monotone"
              dataKey="price"
              stroke="#f97316"
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={2}
              name="Price (INR)"
            />
            
            <Area
              type="monotone"
              dataKey="marketCap"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorMarketCap)"
              strokeWidth={1}
              name="Market Cap (B)"
              yAxisId="right"
            />
            
            {/* Second Y-axis for market cap */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `₹${value}B`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Brush for interactive navigation */}
      {data.length > 10 && (
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <Area
                type="monotone"
                dataKey="price"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.3}
              />
              <Brush
                dataKey="displayDate"
                height={30}
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
        <div>
          Data source: CoinGecko API • Updated every 60 seconds
        </div>
        <button
          onClick={fetchData}
          className="text-blue-600 hover:text-blue-700 font-medium"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Refresh Chart'}
        </button>
      </div>

      {/* Error overlay */}
      {error && data.length > 0 && (
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

export default BitcoinHistoricalChart
