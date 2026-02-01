import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { HistoricalVolumeData, VolumeBreakdown } from '../types';

interface VolumeChartProps {
  historicalVolume: HistoricalVolumeData[];
  loading: boolean;
  error: string | null;
  coinName: string; // New prop
}

// Helper to simulate buy/sell volume from total volume
const simulateVolumeBreakdown = (data: HistoricalVolumeData[]): VolumeBreakdown[] => {
  return data.map((item, index) => {
    // Simple simulation: vary buy/sell volume slightly around a 50/50 split
    // based on an arbitrary factor or previous data points.
    // For a real app, this would come from an API that provides such data.
    const variation = Math.sin(index / 5) * 0.1 + 0.5; // Oscillates between 0.4 and 0.6
    const buyVolume = item.volume * variation;
    const sellVolume = item.volume * (1 - variation);
    return {
      time: item.time,
      buyVolume: buyVolume,
      sellVolume: sellVolume,
    };
  });
};

const VolumeChart: React.FC<VolumeChartProps> = ({ historicalVolume, loading, error, coinName }) => {
  if (loading) {
    return <div className="text-center text-gray-400 p-4">Loading volume chart...</div>;
  }

  // Return null if there's an error or no historical volume data to suppress messages
  if (error || !historicalVolume || historicalVolume.length === 0) {
    return null;
  }

  const volumeBreakdown = simulateVolumeBreakdown(historicalVolume);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md h-80 sm:h-96 w-full">
      <h2 className="text-xl font-bold text-gray-300 mb-4">{coinName} 24h Trading Volume (USD)</h2>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={volumeBreakdown}
          margin={{
            top: 10, right: 0, left: 0, bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
          <XAxis
            dataKey="time"
            tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            stroke="#cbd5e0"
            fontSize={12}
          />
          <YAxis
            tickFormatter={(value) => `$${(value / 1e9).toFixed(1)}B`}
            stroke="#cbd5e0"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#2d3748', border: 'none', borderRadius: '4px' }}
            labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
            itemStyle={{ color: '#e2e8f0' }}
            formatter={(value: number, name: string) => {
              if (name === 'buyVolume') return [`$${(value / 1e6).toFixed(2)}M`, 'Buy Volume'];
              if (name === 'sellVolume') return [`$${(value / 1e6).toFixed(2)}M`, 'Sell Volume'];
              return value;
            }}
            labelFormatter={(label) => new Date(label).toLocaleString()}
          />
          <Area type="monotone" dataKey="buyVolume" stackId="1" stroke="#34D399" fill="#10B981" fillOpacity={0.8} name="Buy Volume" />
          <Area type="monotone" dataKey="sellVolume" stackId="1" stroke="#EF4444" fill="#DC2626" fillOpacity={0.8} name="Sell Volume" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VolumeChart;