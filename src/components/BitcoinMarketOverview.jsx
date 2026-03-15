/**
 * Bitcoin Market Overview Module
 * 
 * This component demonstrates:
 * - Comprehensive dashboard integration for Web3 consultancy
 * - Real-time data aggregation and presentation
 * - Professional financial analytics display
 * - Modular component architecture for scalability
 * - Academic value: Dynamic dashboards and real-time integration
 */

import React from 'react'
import BitcoinMarketCard from './BitcoinMarketCard'
import BitcoinHistoricalChart from './BitcoinHistoricalChart'

const BitcoinMarketOverview = () => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Real Time Bitcoin
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Real-time cryptocurrency market data and analytics for informed consultancy decisions
        </p>
      </div>

      {/* Market Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Market Card - takes 1 column on large screens */}
        <div className="lg:col-span-1">
          <BitcoinMarketCard />
        </div>
        
        {/* Historical Chart - takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <BitcoinHistoricalChart height={400} />
        </div>
      </div>
    </div>
  )
}

export default BitcoinMarketOverview
