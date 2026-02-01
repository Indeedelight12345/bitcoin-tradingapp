import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading...", className }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className || ''}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      {message && <p className="mt-3 text-gray-300">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;