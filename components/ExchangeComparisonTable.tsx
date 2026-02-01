import React from 'react';
import { ExchangeTicker } from '../types';

interface ExchangeComparisonTableProps {
  tickers: ExchangeTicker[];
  loading: boolean;
  error: string | null;
  coinName: string; // New prop
}

const ExchangeComparisonTable: React.FC<ExchangeComparisonTableProps> = ({ tickers, loading, error, coinName }) => {
  if (loading) {
    return <div className="text-center text-gray-400 p-4">Loading exchange data...</div>;
  }

  // Return null if there's an error or no tickers to suppress messages
  if (error || !tickers || tickers.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full overflow-x-auto">
      <h2 className="text-xl font-bold text-gray-300 mb-4">{coinName} Exchange Comparison</h2>
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Exchange
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Price (USD)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              24h Volume (USD)
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Last Updated
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {tickers.map((ticker) => (
            <tr key={ticker.exchangeName} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{ticker.exchangeName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                ${ticker.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                ${ticker.volume.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {new Date(ticker.lastUpdated).toLocaleTimeString('en-US')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-4">Data from CoinGecko API</p>
    </div>
  );
};

export default ExchangeComparisonTable;