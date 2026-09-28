import React, { useEffect, useState } from 'react';
import { Cloud, Sun, Wind, Droplets, Thermometer, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchLiveWeather } from '../api';
import { LiveWeatherData } from '../types';

export const LiveWeatherCard: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('london');
  const [data, setData] = useState<LiveWeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const popularDestinations = [
    { key: 'london', label: 'London, UK' },
    { key: 'berlin', label: 'Berlin, Germany' },
    { key: 'toronto', label: 'Toronto, Canada' },
    { key: 'sydney', label: 'Sydney, Australia' },
    { key: 'dublin', label: 'Dublin, Ireland' },
    { key: 'newyork', label: 'New York, USA' },
    { key: 'paris', label: 'Paris, France' },
    { key: 'singapore', label: 'Singapore' },
    { key: 'auckland', label: 'Auckland, NZ' },
    { key: 'dubai', label: 'Dubai, UAE' },
  ];

  const loadWeather = async (cityKey: string) => {
    setLoading(true);
    try {
      const res = await fetchLiveWeather(cityKey);
      setData(res);
    } catch {
      setData({ status: 'unavailable', message: 'Live data currently unavailable.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity]);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 block mb-1">
            Real-Time Destination Climate
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            Study Destination Live Weather
          </h3>
        </div>

        {/* City selection pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {popularDestinations.slice(0, 5).map((d) => (
            <button
              key={d.key}
              onClick={() => setSelectedCity(d.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCity === d.key
                  ? 'bg-blue-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main weather body */}
      <div className="mt-5">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-700" />
            <span className="text-xs">Fetching live meteorological data...</span>
          </div>
        ) : data?.status === 'live' ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Main Temp & Condition */}
              <div className="md:col-span-2 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                  <Sun className="w-9 h-9" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900">
                      {data.temperature}°C
                    </span>
                    <span className="text-xs text-slate-500">
                      Feels like {data.feelsLike}°C
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">
                    {data.condition} in {data.city}, {data.country}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <Droplets className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-slate-500 block">Humidity</span>
                  <span className="font-bold text-slate-800">{data.humidity}%</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <Wind className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-slate-500 block">Wind Speed</span>
                  <span className="font-bold text-slate-800">{data.windSpeed} km/h</span>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast Strip */}
            {data.forecast && data.forecast.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 block mb-3">
                  5-Day Temperature Outlook:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                  {data.forecast.map((day, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                      <span className="text-[11px] text-slate-500 block">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 block my-1">
                        {day.condition}
                      </span>
                      <span className="text-xs font-bold text-blue-900">
                        {day.maxTemp}° / <span className="text-slate-500 font-normal">{day.minTemp}°</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-amber-700 bg-amber-50 rounded-xl border border-amber-200">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-amber-600" />
            <p className="text-sm font-semibold">{data?.message || 'Live data currently unavailable.'}</p>
            <p className="text-xs text-slate-600 mt-1">
              Live weather server is momentarily offline or connecting. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
