import { API_BASE_URL, ENABLE_MOCK_FALLBACK, CACHE_DURATION_MS } from '../constants';
import { Coin, CoinMarketData, ExchangeTicker, HistoricalVolumeData, HistoricalPriceData, OHLCData } from '../types';

// Simple in-memory cache
const cache: Record<string, { data: any; timestamp: number }> = {};

const getFromCache = (key: string) => {
  const cached = cache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    return cached.data;
  }
  return null;
};

const setToCache = (key: string, data: any) => {
  cache[key] = { data, timestamp: Date.now() };
};

// --- Mock Data Generators ---
const generateMockOHLC = (days: number): OHLCData[] => {
  const data: OHLCData[] = [];
  const now = Math.floor(Date.now() / 1000);
  const points = days === 1 ? 24 : days === 7 ? 42 : 60;
  const interval = (days * 24 * 60 * 60) / points;
  let lastClose = 45000 + Math.random() * 20000;

  for (let i = points; i >= 0; i--) {
    const open = lastClose;
    const close = open + (Math.random() - 0.5) * (open * 0.02);
    const high = Math.max(open, close) + Math.random() * (open * 0.01);
    const low = Math.min(open, close) - Math.random() * (open * 0.01);
    data.push({
      time: (now - i * interval) as any,
      open,
      high,
      low,
      close
    });
    lastClose = close;
  }
  return data;
};

const generateMockTickers = (coinId: string): ExchangeTicker[] => {
  const exchanges = ['Binance', 'Coinbase', 'Kraken', 'Bybit', 'OKX'];
  const basePrice = coinId === 'bitcoin' ? 65000 : coinId === 'ethereum' ? 3500 : 100;
  return exchanges.map(name => ({
    exchangeName: name,
    price: basePrice + (Math.random() - 0.5) * (basePrice * 0.01),
    volume: Math.random() * 1000000000,
    lastUpdated: Date.now()
  }));
};

const generateMockVolume = (days: number): HistoricalVolumeData[] => {
  const data: HistoricalVolumeData[] = [];
  const now = Date.now();
  for (let i = 24; i >= 0; i--) {
    data.push({
      time: now - i * 3600000,
      volume: 1000000000 + Math.random() * 5000000000
    });
  }
  return data;
};

export const marketDataService = {
  fetchCoinsList: async (): Promise<Coin[]> => {
    const cacheKey = 'coins_list';
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    const url = `${API_BASE_URL.COINGECKO}/coins/list?include_platform=false`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      const popularCoinIds = new Set(['bitcoin', 'ethereum', 'ripple', 'cardano', 'solana', 'dogecoin', 'polkadot', 'litecoin', 'chainlink', 'tron', 'binancecoin', 'usd-coin', 'tether', 'shiba-inu']);
      const filtered = data
        .filter((coin: any) => popularCoinIds.has(coin.id))
        .map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
        }));
      setToCache(cacheKey, filtered);
      return filtered;
    } catch (error) {
      console.warn("Using mock coin list due to API error");
      return [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc' },
        { id: 'ethereum', name: 'Ethereum', symbol: 'eth' },
        { id: 'solana', name: 'Solana', symbol: 'sol' },
        { id: 'binancecoin', name: 'BNB', symbol: 'bnb' },
        { id: 'cardano', name: 'Cardano', symbol: 'ada' },
        { id: 'ripple', name: 'XRP', symbol: 'xrp' },
        { id: 'dogecoin', name: 'Dogecoin', symbol: 'doge' }
      ];
    }
  },

  fetchMarketData: async (coinIds: string[]): Promise<Record<string, CoinMarketData>> => {
    const ids = coinIds.join(',');
    const url = `${API_BASE_URL.COINGECKO}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      const marketData: Record<string, CoinMarketData> = {};
      for (const id of coinIds) {
        if (data[id]) {
          marketData[id] = {
            price: data[id].usd,
            priceChange24h: data[id].usd_24h_change,
            volume24h: data[id].usd_24h_vol,
          };
        }
      }
      return marketData;
    } catch (error) {
      console.warn("Using mock market data due to API error:", error);
      const mockData: Record<string, CoinMarketData> = {};
      coinIds.forEach(id => {
        mockData[id] = {
          price: id === 'bitcoin' ? 64230.50 : id === 'ethereum' ? 3450.20 : 1.50,
          priceChange24h: (Math.random() - 0.4) * 5,
          volume24h: 1500000000 + Math.random() * 1000000000
        };
      });
      return mockData;
    }
  },

  fetchExchangeTickers: async (coinId: string): Promise<ExchangeTicker[]> => {
    const cacheKey = `tickers_${coinId}`;
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    const url = `${API_BASE_URL.COINGECKO}/coins/${coinId}/tickers`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      const majorExchanges = ['binance', 'coinbase', 'kraken', 'bybit', 'okx'];
      const filtered = data.tickers
        .filter((ticker: any) => majorExchanges.includes(ticker.market.identifier) && ticker.target === 'USD')
        .map((ticker: any) => ({
          exchangeName: ticker.market.name,
          price: ticker.last,
          volume: ticker.volume,
          lastUpdated: ticker.timestamp ? new Date(ticker.timestamp).getTime() : Date.now(),
        })).slice(0, 5);
      
      const result = filtered.length > 0 ? filtered : generateMockTickers(coinId);
      setToCache(cacheKey, result);
      return result;
    } catch (error) {
      console.warn(`Fallback to mock tickers for ${coinId}`);
      return generateMockTickers(coinId);
    }
  },

  fetchHistoricalVolume: async (coinId: string, days: number = 1): Promise<HistoricalVolumeData[]> => {
    const url = `${API_BASE_URL.COINGECKO}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=hourly`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      return data.total_volumes.map((item: [number, number]) => ({
        time: item[0],
        volume: item[1],
      }));
    } catch (error) {
      console.warn(`Fallback to mock volume for ${coinId}`);
      return generateMockVolume(days);
    }
  },

  fetchHistoricalOHLC: async (coinId: string, days: number): Promise<OHLCData[]> => {
    const cacheKey = `ohlc_${coinId}_${days}`;
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    const url = `${API_BASE_URL.COINGECKO}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      const mapped = data.map((item: any) => ({
        time: item[0] / 1000,
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
      }));
      setToCache(cacheKey, mapped);
      return mapped;
    } catch (error) {
      console.warn(`Fallback to mock OHLC for ${coinId}`);
      const mock = generateMockOHLC(days);
      setToCache(cacheKey, mock);
      return mock;
    }
  },
};