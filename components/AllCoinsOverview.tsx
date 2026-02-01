import React from 'react';
import { Coin, CoinMarketData } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface AllCoinsOverviewProps {
  coins: Coin[];
  marketData: Record<string, CoinMarketData | null>;
  selectedCoinId: string;
  onSelectCoin: (id: string, name: string) => void;
  loading: boolean;
  error: string | null;
  className?: string;
}

const AllCoinsOverview: React.FC<AllCoinsOverviewProps> = ({
  coins,
  marketData,
  selectedCoinId,
  onSelectCoin,
  loading,
  error,
  className
}) => {
  if (loading) {
    return <LoadingSpinner message="Loading all coin prices..." className={className} />;
  }

  if (error) {
    return <ErrorMessage message={`Error loading coin overview: ${error}`} className={className} />;
  }

  if (coins.length === 0) {
    return <div className={`text-center text-gray-400 p-4 ${className}`}>No coins available to display.</div>;
  }

  return (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-xl overflow-x-auto ${className}`} aria-live="polite">
      <h2 className="text-2xl font-bold text-gray-300 mb-4">Live Coin Prices</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {coins.map((coin) => {
          const data = marketData[coin.id];
          const isSelected = coin.id === selectedCoinId;
          const priceChangeColor = data && data.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500';
          const priceChangeSign = data && data.priceChange24h >= 0 ? '+' : '';
          const cardClasses = `p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200 
                               ${isSelected ? 'bg-blue-600 border-2 border-blue-400 ring-2 ring-blue-300' : 'bg-gray-700 hover:bg-gray-600'} 
                               ${isSelected ? 'transform scale-105' : ''}`;

          return (
            <div
              key={coin.id}
              className={cardClasses}
              onClick={() => onSelectCoin(coin.id, coin.name)}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={`Select ${coin.name} for detailed view`}
            >
              <h3 className={`text-xl font-semibold mb-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                {coin.name} <span className="text-sm text-gray-400">({coin.symbol.toUpperCase()})</span>
              </h3>
              {data ? (
                <>
                  <p className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-green-400'}`}>
                    ${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className={`text-lg font-medium ${priceChangeColor}`}>
                    {priceChangeSign}{data.priceChange24h.toFixed(2)}% (24h)
                  </p>
                  <p className={`text-sm ${isSelected ? 'text-gray-200' : 'text-gray-400'} mt-1`}>
                    Vol: ${data.volume24h.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                </>
              ) : (
                <p className={`${isSelected ? 'text-white' : 'text-gray-400'}`}>Data N/A</p>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-4 text-right">Click a coin to view its detailed charts</p>
    </div>
  );
};

export default AllCoinsOverview;