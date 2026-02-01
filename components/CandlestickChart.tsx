import React, { useRef, useEffect, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickSeriesPartialOptions, Time, ColorType } from 'lightweight-charts';
import { OHLCData } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface CandlestickChartProps {
  data: OHLCData[];
  loading: boolean;
  error: string | null;
  title: string;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, loading, error, title }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [chartReady, setChartReady] = useState(false);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clear any existing chart to prevent re-initialization issues
    if (chartRef.current) {
      chartRef.current.remove();
    }

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400, // Fixed height for consistency
      layout: {
        background: { type: ColorType.Solid, color: '#111827' }, // bg-gray-900
        textColor: '#e0e7ff', // text-indigo-100 (for readability against dark background)
      },
      grid: {
        vertLines: { color: '#374151' }, // gray-700
        horzLines: { color: '#374151' }, // gray-700
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderVisible: false,
        barSpacing: 10, // Adjust bar spacing for better visualization
      },
      rightPriceScale: {
        borderColor: '#4b5563', // gray-600
      },
      crosshair: {
        mode: 0, // Magnet mode
      },
    });

    chart.timeScale().fitContent();

    const newSeries = chart.addCandlestickSeries({
      upColor: '#10B981', // green-500
      downColor: '#EF4444', // red-500
      borderUpColor: '#10B981',
      borderDownColor: '#EF4444',
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    } as CandlestickSeriesPartialOptions); // Cast to PartialOptions to suppress type warnings

    chartRef.current = chart;
    candlestickSeriesRef.current = newSeries;
    setChartReady(true);

    // Handle responsiveness
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
      }
    };
  }, []);

  // Update chart data
  useEffect(() => {
    if (chartReady && candlestickSeriesRef.current && data.length > 0) {
      candlestickSeriesRef.current.setData(data as any); // Type assertion for Time
      chartRef.current?.timeScale().fitContent(); // Fit content whenever data changes
    } else if (chartReady && candlestickSeriesRef.current && data.length === 0) {
      // If data is empty, clear the series to avoid showing stale data
      candlestickSeriesRef.current.setData([]);
    }
  }, [data, chartReady]);


  if (loading && (!data || data.length === 0)) { // Only show loading spinner if no data is present yet
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-800 rounded-lg shadow-md">
        <LoadingSpinner message={`Loading ${title.toLowerCase()}...`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96">
        <ErrorMessage message={`Error loading ${title.toLowerCase()}: ${error}`} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-800 rounded-lg shadow-md text-gray-400">
        <p>No historical data available for this coin and time range.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-auto">
      <div ref={chartContainerRef} className="w-full h-[400px]" role="img" aria-label={`${title} candlestick chart`} />
    </div>
  );
};

export default CandlestickChart;