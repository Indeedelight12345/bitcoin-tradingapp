import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import VolumeChart from '../components/VolumeChart';
import ExchangeComparisonTable from '../components/ExchangeComparisonTable';
import LoadingSpinner from '../components/LoadingSpinner';
import AllCoinsOverview from '../components/AllCoinsOverview';
import ErrorMessage from '../components/ErrorMessage';
import CandlestickChart from '../components/CandlestickChart';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { marketDataService } from '../services/marketDataService';
import { REFRESH_INTERVAL_MS } from '../constants';
import { CoinMarketData, ExchangeTicker, HistoricalVolumeData, OHLCData, Coin, CandleTimeRange } from '../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedCoinId, setSelectedCoinId] = useState<string>('bitcoin');
  const [selectedCoinName, setSelectedCoinName] = useState<string>('Bitcoin');
  const [availableCoins, setAvailableCoins] = useState<Coin[]>([]);
  const [availableCoinsLoading, setAvailableCoinsLoading] = useState<boolean>(true);
  
  const [allCoinsMarketData, setAllCoinsMarketData] = useState<Record<string, CoinMarketData | null>>({});
  const [allCoinsMarketDataLoading, setAllCoinsMarketDataLoading] = useState<boolean>(true);

  const [exchangeTickers, setExchangeTickers] = useState<ExchangeTicker[]>([]);
  const [historicalVolume, setHistoricalVolume] = useState<HistoricalVolumeData[]>([]);
  const [ohlcData, setOhlcData] = useState<OHLCData[]>([]);
  const [selectedCandleTimeRange, setSelectedCandleTimeRange] = useState<CandleTimeRange>('1D');

  const [detailsLoading, setDetailsLoading] = useState<boolean>(true);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  const getTimeRangeDays = (range: CandleTimeRange): number => {
    switch (range) {
      case '1D': return 1;
      case '1W': return 7;
      case '1M': return 30;
      default: return 1;
    }
  };

  // 1. Fetch available coins
  useEffect(() => {
    const fetchCoins = async () => {
      setAvailableCoinsLoading(true);
      try {
        const coins = await marketDataService.fetchCoinsList();
        setAvailableCoins(coins);
        const current = coins.find(c => c.id === selectedCoinId);
        if (current) setSelectedCoinName(current.name);
      } catch (err) {
        console.error("Coins fetch error", err);
      } finally {
        setAvailableCoinsLoading(false);
      }
    };
    fetchCoins();
  }, []);

  // 2. Fetch all live prices
  useEffect(() => {
    const fetchAllPrices = async () => {
      if (availableCoins.length === 0) return;
      setAllCoinsMarketDataLoading(true);
      try {
        const data = await marketDataService.fetchMarketData(availableCoins.map(c => c.id));
        setAllCoinsMarketData(data);
      } catch (err) {
        console.error("Prices fetch error", err);
      } finally {
        setAllCoinsMarketDataLoading(false);
      }
    };

    if (!availableCoinsLoading) {
      fetchAllPrices();
      const id = setInterval(fetchAllPrices, REFRESH_INTERVAL_MS);
      return () => clearInterval(id);
    }
  }, [availableCoins, availableCoinsLoading]);

  // 3. Fetch detailed coin data
  const fetchDetails = useCallback(async (id: string, range: CandleTimeRange) => {
    setDetailsLoading(true);
    try {
      const [tickers, volume, ohlc] = await Promise.all([
        marketDataService.fetchExchangeTickers(id),
        marketDataService.fetchHistoricalVolume(id, 1),
        marketDataService.fetchHistoricalOHLC(id, getTimeRangeDays(range))
      ]);
      setExchangeTickers(tickers);
      setHistoricalVolume(volume);
      setOhlcData(ohlc);
    } catch (err) {
      console.error("Details fetch error", err);
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCoinId) {
      fetchDetails(selectedCoinId, selectedCandleTimeRange);
      const id = setInterval(() => fetchDetails(selectedCoinId, selectedCandleTimeRange), REFRESH_INTERVAL_MS * 4);
      return () => clearInterval(id);
    }
  }, [selectedCoinId, selectedCandleTimeRange, fetchDetails]);

  const handleCoinSelect = (id: string, name: string) => {
    setSelectedCoinId(id);
    setSelectedCoinName(name);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar userName={user} />
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-white text-center sm:text-left">
            Market Dashboard
          </h1>
          <div className="mt-4 sm:mt-0 flex items-center bg-gray-800 px-4 py-2 rounded-full border border-gray-700">
            <div className={`h-3 w-3 rounded-full mr-2 ${allCoinsMarketDataLoading ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></div>
            <span className="text-xs font-medium text-gray-300">
              {allCoinsMarketDataLoading ? 'Refreshing...' : 'Live System Active'}
            </span>
          </div>
        </div>

        {availableCoinsLoading ? (
          <LoadingSpinner message="Initializing market connection..." className="mb-8" />
        ) : (
          <AllCoinsOverview
            coins={availableCoins}
            marketData={allCoinsMarketData}
            selectedCoinId={selectedCoinId}
            onSelectCoin={handleCoinSelect}
            loading={allCoinsMarketDataLoading}
            error={null}
            className="mb-8"
          />
        )}

        <div className="border-t border-gray-800 pt-8 mt-8">
          <h2 className="text-3xl font-extrabold text-white mb-6">
              Analytics for {selectedCoinName}
          </h2>

          <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6 relative overflow-hidden">
            {detailsLoading && !ohlcData.length && (
              <div className="absolute inset-0 bg-gray-800/80 z-20 flex items-center justify-center">
                <LoadingSpinner message="Updating Chart..." />
              </div>
            )}
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-300">Price Action (OHLC)</h3>
              <div className="flex bg-gray-900 p-1 rounded-lg">
                {(['1D', '1W', '1M'] as CandleTimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedCandleTimeRange(range)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                      selectedCandleTimeRange === range 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            
            <CandlestickChart
              data={ohlcData}
              loading={detailsLoading && !ohlcData.length}
              error={null}
              title={`${selectedCoinName} Chart`}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <VolumeChart
              historicalVolume={historicalVolume}
              loading={detailsLoading && !historicalVolume.length}
              error={null}
              coinName={selectedCoinName}
            />
            <ExchangeComparisonTable
              tickers={exchangeTickers}
              loading={detailsLoading && !exchangeTickers.length}
              error={null}
              coinName={selectedCoinName}
            />
          </div>
        </div>
      </div>
      
      <footer className="container mx-auto p-8 text-center border-t border-gray-800 mt-12">
        <p className="text-gray-500 text-sm">
          Resilience Mode Active. Automatic fallback enabled for API rate limits.
        </p>
      </footer>
    </div>
  );
};

export default DashboardPage;