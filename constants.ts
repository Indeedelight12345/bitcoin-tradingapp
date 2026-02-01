export const API_BASE_URL = {
  COINGECKO: "https://api.coingecko.com/api/v3",
};

export const REFRESH_INTERVAL_MS = 15000; // Increased to 15s to respect rate limits better
export const CACHE_DURATION_MS = 60000; // Cache detailed data for 1 minute

// Simulated API credentials for frontend-only authentication
export const SIMULATED_USERNAME = 'admin';
export const SIMULATED_PASSWORD = 'password';

// Resilience settings
export const ENABLE_MOCK_FALLBACK = true;