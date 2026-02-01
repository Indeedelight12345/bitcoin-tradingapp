export interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
}

export interface Coin {
  id: string;
  name: string;
  symbol: string;
}

export interface CoinMarketData {
  price: number;
  priceChange24h: number;
  volume24h: number;
}

export interface ExchangeTicker {
  exchangeName: string;
  price: number;
  volume: number;
  lastUpdated: number; // Unix timestamp
}

export interface HistoricalVolumeData {
  time: number; // Unix timestamp
  volume: number;
}

export interface HistoricalPriceData {
  time: number; // Unix timestamp
  price: number;
}

export interface OHLCData {
  time: number; // Unix timestamp in seconds for lightweight-charts
  open: number;
  high: number;
  low: number;
  close: number;
}

export type CandleTimeRange = '1D' | '1W' | '1M';

export interface VolumeBreakdown {
  time: number;
  buyVolume: number;
  sellVolume: number;
}