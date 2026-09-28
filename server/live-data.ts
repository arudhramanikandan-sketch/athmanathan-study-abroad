// Live Information Service
// Complies strictly with Rule 14: Never fabricate live data.
// If API fails or is offline, returns status: 'unavailable' and message: "Live data currently unavailable."

export interface CurrencyRate {
  code: string;
  name: string;
  rateInr: number; // 1 unit of foreign currency in INR
}

export interface LiveCurrencyResponse {
  status: 'live' | 'unavailable';
  rates?: CurrencyRate[];
  timestamp?: string;
  source?: string;
  message?: string;
}

export interface WeatherDayForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
}

export interface LiveWeatherResponse {
  status: 'live' | 'unavailable';
  city?: string;
  country?: string;
  temperature?: number;
  feelsLike?: number;
  humidity?: number;
  windSpeed?: number;
  condition?: string;
  forecast?: WeatherDayForecast[];
  timestamp?: string;
  message?: string;
}

// In-memory cache for 30 minutes to reduce external rate limits
let cachedCurrency: { data: LiveCurrencyResponse; expiry: number } | null = null;
const weatherCache = new Map<string, { data: LiveWeatherResponse; expiry: number }>();

export async function fetchLiveCurrency(): Promise<LiveCurrencyResponse> {
  if (cachedCurrency && Date.now() < cachedCurrency.expiry) {
    return cachedCurrency.data;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    // Free open exchange rate endpoint with INR base
    const res = await fetch('https://open.er-api.com/v6/latest/INR', {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json.result !== 'success' || !json.rates) {
      throw new Error('Invalid rate response');
    }

    // In this API, json.rates[CUR] is units of CUR per 1 INR.
    // Therefore, 1 unit of CUR in INR = 1 / json.rates[CUR].
    const targetCurrencies = [
      { code: 'GBP', name: 'British Pound' },
      { code: 'USD', name: 'US Dollar' },
      { code: 'EUR', name: 'Euro' },
      { code: 'CAD', name: 'Canadian Dollar' },
      { code: 'AUD', name: 'Australian Dollar' },
      { code: 'NZD', name: 'New Zealand Dollar' },
      { code: 'SGD', name: 'Singapore Dollar' },
      { code: 'AED', name: 'UAE Dirham' },
      { code: 'MYR', name: 'Malaysian Ringgit' },
    ];

    const rates: CurrencyRate[] = [];
    for (const item of targetCurrencies) {
      const valPerInr = json.rates[item.code];
      if (typeof valPerInr === 'number' && valPerInr > 0) {
        rates.push({
          code: item.code,
          name: item.name,
          rateInr: Number((1 / valPerInr).toFixed(2)),
        });
      }
    }

    const result: LiveCurrencyResponse = {
      status: 'live',
      rates,
      timestamp: json.time_last_update_utc || new Date().toISOString(),
      source: 'Open Exchange Rates (Global Foreign Exchange Markets)',
    };

    cachedCurrency = {
      data: result,
      expiry: Date.now() + 30 * 60 * 1000, // cache for 30 minutes
    };

    return result;
  } catch (err) {
    console.warn('Currency API currently unavailable:', (err as Error).message);
    return {
      status: 'unavailable',
      message: 'Live data currently unavailable.',
    };
  }
}

const CITY_COORDINATES: Record<string, { lat: number; lon: number; name: string; country: string }> = {
  london: { lat: 51.5074, lon: -0.1278, name: 'London', country: 'United Kingdom' },
  berlin: { lat: 52.52, lon: 13.405, name: 'Berlin', country: 'Germany' },
  toronto: { lat: 43.6532, lon: -79.3832, name: 'Toronto', country: 'Canada' },
  sydney: { lat: -33.8688, lon: 151.2093, name: 'Sydney', country: 'Australia' },
  newyork: { lat: 40.7128, lon: -74.006, name: 'New York', country: 'United States' },
  dublin: { lat: 53.3498, lon: -6.2603, name: 'Dublin', country: 'Ireland' },
  paris: { lat: 48.8566, lon: 2.3522, name: 'Paris', country: 'France' },
  singapore: { lat: 1.3521, lon: 103.8198, name: 'Singapore', country: 'Singapore' },
  auckland: { lat: -36.8485, lon: 174.7633, name: 'Auckland', country: 'New Zealand' },
  dubai: { lat: 25.2048, lon: 55.2708, name: 'Dubai', country: 'UAE' },
};

function decodeWmoWeatherCode(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Light Drizzle';
  if (code >= 61 && code <= 65) return 'Rain Showers';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Heavy Rain Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Cloudy';
}

export async function fetchLiveWeather(cityKey: string): Promise<LiveWeatherResponse> {
  const normalizedKey = cityKey.toLowerCase().replace(/[^a-z]/g, '');
  const cityInfo = CITY_COORDINATES[normalizedKey] || CITY_COORDINATES.london;

  const cached = weatherCache.get(normalizedKey);
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityInfo.lat}&longitude=${cityInfo.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    const forecast: WeatherDayForecast[] = [];
    if (daily && daily.time) {
      for (let i = 0; i < Math.min(5, daily.time.length); i++) {
        forecast.push({
          date: daily.time[i],
          maxTemp: Math.round(daily.temperature_2m_max[i]),
          minTemp: Math.round(daily.temperature_2m_min[i]),
          condition: decodeWmoWeatherCode(daily.weather_code[i]),
        });
      }
    }

    const result: LiveWeatherResponse = {
      status: 'live',
      city: cityInfo.name,
      country: cityInfo.country,
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: Math.round(current.relative_humidity_2m),
      windSpeed: Math.round(current.wind_speed_10m),
      condition: decodeWmoWeatherCode(current.weather_code),
      forecast,
      timestamp: new Date().toISOString(),
    };

    weatherCache.set(normalizedKey, {
      data: result,
      expiry: Date.now() + 15 * 60 * 1000, // cache for 15 min
    });

    return result;
  } catch (err) {
    console.warn('Weather API currently unavailable:', (err as Error).message);
    return {
      status: 'unavailable',
      message: 'Live data currently unavailable.',
    };
  }
}
