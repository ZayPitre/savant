import axios from 'axios';
import yahooFinanceApi from './yahooFinanceApi';

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const ALPHA_VANTAGE_API_KEY = 'TBS5LVAN47XQBBO4';

// Error messages
const ERROR_MESSAGES = {
  API_LIMIT: 'API call frequency limit reached. Switching to Yahoo Finance...',
  INVALID_API_KEY: 'Invalid API key. Please check your configuration.',
  NO_DATA: 'No data available for this request.',
};

// Helper function to check for API errors
const checkForApiErrors = (data) => {
  if (data?.Note?.includes('API call frequency') || data?.Information?.includes('API key')) {
    throw new Error(ERROR_MESSAGES.API_LIMIT);
  }
  if (data?.['Error Message']?.includes('Invalid API call')) {
    throw new Error(ERROR_MESSAGES.INVALID_API_KEY);
  }
  if (!data || Object.keys(data).length === 0) {
    throw new Error(ERROR_MESSAGES.NO_DATA);
  }
  return { ...data, source: 'Alpha Vantage' };
};

export const stockApi = {
  // Get company overview with fallback to Yahoo Finance
  getCompanyOverview: async (symbol) => {
    try {
      // Try Alpha Vantage first
      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'OVERVIEW',
          symbol,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      });
      return checkForApiErrors(response.data);
    } catch (error) {
      console.log('Alpha Vantage API failed, switching to Yahoo Finance...', error.message);
      // If Alpha Vantage fails, try Yahoo Finance
      return yahooFinanceApi.getCompanyOverview(symbol);
    }
  },

  // Get daily time series data
  getDailyTimeSeries: async (symbol) => {
    try {
      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol,
          apikey: ALPHA_VANTAGE_API_KEY,
          outputsize: 'compact',
        },
      });
      return checkForApiErrors(response.data);
    } catch (error) {
      throw new Error(`Failed to fetch daily time series: ${error.message}`);
    }
  },

  // Get global market status
  getGlobalMarketStatus: async (symbol = 'SPY') => {
    try {
      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      });
      return checkForApiErrors(response.data);
    } catch (error) {
      throw new Error(`Failed to fetch market status: ${error.message}`);
    }
  },

  // Get news for multiple symbols
  getNews: async (symbols = []) => {
    try {
      const tickers = symbols.join(',');
      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'NEWS_SENTIMENT',
          tickers,
          apikey: ALPHA_VANTAGE_API_KEY,
          limit: 50,
          sort: 'LATEST',
        },
      });
      return checkForApiErrors(response.data);
    } catch (error) {
      throw new Error(`Failed to fetch news: ${error.message}`);
    }
  },

  // Search stocks
  searchStocks: async (keywords) => {
    try {
      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      });
      return checkForApiErrors(response.data);
    } catch (error) {
      throw new Error(`Failed to search stocks: ${error.message}`);
    }
  },
};

export default stockApi; 