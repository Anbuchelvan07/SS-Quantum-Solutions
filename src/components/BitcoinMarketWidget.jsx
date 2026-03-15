import { useEffect, useState } from 'react'
import { fetchBitcoinMarket } from '../services/api'

export default function BitcoinMarketWidget() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await fetchBitcoinMarket()
        if (!cancelled) {
          setData(result)
        }
      } catch (_err) {
        if (!cancelled) {
          setError('Unable to load Bitcoin market data at the moment.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    const intervalId = setInterval(load, 30000) // refresh every 30s

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [])

  const renderBody = () => {
    if (loading && !data) {
      return (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Fetching latest Bitcoin market data…
        </p>
      )
    }

    if (error) {
      return (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )
    }

    if (!data) {
      return (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No market data available.
        </p>
      )
    }

    const market = data.data?.current
    const change = market?.priceChange24h
    const isPositive = typeof change === 'number' && change >= 0

    return (
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {market?.name || 'Bitcoin'} market snapshot
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">
              ₹{market?.price?.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {isPositive ? '▲' : '▼'}{' '}
            {typeof change === 'number'
              ? `${change.toFixed(2)}%`
              : 'N/A'}
          </span>
        </div>
        <p className="text-[0.7rem] text-slate-500 dark:text-slate-400">
          Updated{' '}
          {market?.lastUpdated
            ? new Date(market.lastUpdated).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'recently'}
        </p>
      </div>
    )
  }

  return (
    <section
      aria-label="Bitcoin market data"
      className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5"
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Bitcoin market overview
        </h2>
        {loading && data && (
          <span className="text-[0.7rem] text-slate-500 dark:text-slate-400">
            Refreshing…
          </span>
        )}
      </header>
      {renderBody()}
    </section>
  )
}

