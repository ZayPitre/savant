/**
 * Mock Data Configuration
 * 
 * Controls whether the application uses mock data or real API calls
 */

// Set this to true to use mock data instead of real API calls
export const USE_MOCK_DATA = true;

// Set individual feature flags if you want to mix real and mock data
export const MOCK_CONFIG = {
  useCompanyOverview: true,
  useDailyTimeSeries: true,
  useMarketStatus: true,
  useNews: true,
  useSearch: true
};

export default {
  USE_MOCK_DATA,
  MOCK_CONFIG
}; 