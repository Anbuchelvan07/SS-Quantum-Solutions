import React from 'react'

const InsightCard = ({ title, titleColor, description }) => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600'
  }

  return (
    <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-2 ${colorClasses[titleColor]}`}>
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

const MarketInsights = () => {
  const insights = [
    {
      title: 'Web3 Integration',
      titleColor: 'blue',
      description: 'Real-time blockchain data integration demonstrates modern consultancy capabilities'
    },
    {
      title: 'Dynamic Analytics',
      titleColor: 'green',
      description: 'Live market data feeds showcase scalable backend architecture and frontend performance'
    },
    {
      title: 'Professional Dashboards',
      titleColor: 'purple',
      description: 'Enterprise-grade visualization components for comprehensive market analysis'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Market Insights
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <InsightCard
              key={index}
              title={insight.title}
              titleColor={insight.titleColor}
              description={insight.description}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarketInsights
