import React, { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp, AlertCircle, X } from 'lucide-react';
import { fetchLiveCurrency } from '../api';
import { LiveCurrencyData } from '../types';

interface LiveCurrencyBarProps {
  rates?: any;
}

export const LiveCurrencyBar: React.FC<LiveCurrencyBarProps> = () => {
  const [data, setData] = useState<LiveCurrencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  const loadCurrency = async () => {
    setLoading(true);
    try {
      const res = await fetchLiveCurrency();
      setData(res);
    } catch {
      setData({ status: 'unavailable', message: 'Live data currently unavailable.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrency();
  }, []);

  if (dismissed) return null;

  return (
    <div className="bg-slate-900 text-slate-100 border-y border-slate-800 py-2.5 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Title / Status */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-200">
            Live Forex Rates (INR per 1 Foreign Unit):
          </span>
          <button
            onClick={loadCurrency}
            disabled={loading}
            className="text-slate-400 hover:text-white transition-colors p-1"
            title="Refresh rates"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Currency ticker or status */}
        <div className="flex-1 w-full overflow-x-auto no-scrollbar">
          {loading ? (
            <div className="flex items-center gap-4 text-slate-400 animate-pulse">
              <span>Fetching verified live forex data...</span>
            </div>
          ) : data?.status === 'live' && data.rates && data.rates.length > 0 ? (
            <div className="flex items-center gap-5 whitespace-nowrap text-slate-300">
              {data.rates.map((c) => (
                <div key={c.code} className="inline-flex items-center gap-1.5 font-mono">
                  <span className="font-bold text-white">{c.code}:</span>
                  <span className="text-emerald-400 font-semibold">₹{c.rateInr.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{data?.message || 'Live data currently unavailable.'}</span>
            </div>
          )}
        </div>

        {/* Actions & Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          {data?.status === 'live' && data.source && (
            <div className="text-slate-400 text-[11px] hidden xl:block mr-1">
              <span>Source: {data.source}</span>
            </div>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
            title="Close / dismiss forex rates bar"
            aria-label="Close currency ticker"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
