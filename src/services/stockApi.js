import axios from 'axios';
import yahooFinanceApi from './yahooFinanceApi';
import polygonApi from './polygonApi';
import mockData from '../utils/mockData/stockData';
import { USE_MOCK_DATA, MOCK_CONFIG } from '../utils/mockData';

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
  return data;
};

export const stockApi = {
  // Get company overview with fallback to Yahoo Finance
  getCompanyOverview: async (symbol) => {
    // Use mock data if enabled
    if (USE_MOCK_DATA && MOCK_CONFIG.useCompanyOverview) {
      console.log('Using mock data for company overview:', symbol);
      
      // Check if we have data for this specific symbol
      if (mockData.companyDetails[symbol]) {
        // Return symbol-specific data
        return {
          ...mockData.stocks[symbol] || {},
          ...mockData.companyDetails[symbol]
        };
      } else {
        // If we don't have data for this symbol, create a generic response
        // based on the requested symbol
        console.log(`No mock data for ${symbol}, creating generic data`);
        
        // Create a generic company profile based on the symbol
        const genericCompanyData = {
          Symbol: symbol,
          Name: `${symbol} Inc.`,
          Description: `This is a generic company profile for ${symbol}. In a production environment, this would contain real company data.`,
          Industry: "Technology",
          Sector: "Information Technology",
          Exchange: "NASDAQ",
          MarketCapitalization: "10000000000", // $10B
          PERatio: "25.5",
          EPS: "2.5",
          RevenueTTM: "5000000000", // $5B
          RevenueGrowth: "15.5",
          PriceToBookRatio: "3.2",
          Cash: "2000000000", // $2B
          DebtToEquity: "45.2",
          ProfitMargin: "18.5",
          OperatingMarginTTM: "22.3",
          ReturnOnEquityTTM: "15.7",
          GrossProfitTTM: "3000000000", // $3B
          source: "Mock Data"
        };
        
        return genericCompanyData;
      }
    }
    
    // Use real API if mock data is disabled
    try {
      // Use Polygon as primary source
      return await polygonApi.getCompanyOverview(symbol);
    } catch (error) {
      console.log('Polygon API failed, switching to Yahoo Finance...', error.message);
      try {
        // If Polygon fails, try Yahoo Finance
        return await yahooFinanceApi.getCompanyOverview(symbol);
      } catch (yahooError) {
        console.log('Yahoo Finance API also failed:', yahooError.message);
        throw new Error(`Failed to fetch company overview: ${error.message}. Fallback also failed: ${yahooError.message}`);
      }
    }
  },

  // Get daily time series data
  getDailyTimeSeries: async (symbol) => {
    // Use mock data if enabled
    if (USE_MOCK_DATA && MOCK_CONFIG.useDailyTimeSeries) {
      console.log('Using mock data for time series:', symbol);
      
      // Return mock time series data if available, otherwise use Apple's data
      return mockData.timeSeriesData[symbol] || mockData.timeSeriesData.AAPL;
    }
    
    // Use real API if mock data is disabled
    try {
      return await polygonApi.getDailyTimeSeries(symbol);
    } catch (error) {
      console.log('Polygon API failed for time series:', error.message);
      throw new Error(`Failed to fetch daily time series: ${error.message}`);
    }
  },

  // Get global market status
  getGlobalMarketStatus: async (symbol = 'SPY') => {
    // Use mock data if enabled
    if (USE_MOCK_DATA && MOCK_CONFIG.useMarketStatus) {
      console.log('Using mock data for market status:', symbol);
      
      // Return symbol-specific data from mockIndices or mockStocks
      if (mockData.indices[symbol]) {
        return mockData.indices[symbol];
      } else if (mockData.stocks[symbol]) {
        return mockData.stocks[symbol];
      } else {
        // Fallback to SPY if the symbol doesn't exist in our mock data
        return mockData.indices.SPY;
      }
    }
    
    // Use real API if mock data is disabled
    try {
      return await polygonApi.getGlobalMarketStatus(symbol);
    } catch (error) {
      console.log('Polygon API failed for market status:', error.message);
      throw new Error(`Failed to fetch market status: ${error.message}`);
    }
  },

  // Get news for multiple symbols
  getNews: async (symbols = []) => {
    // Use mock data if enabled
    if (USE_MOCK_DATA && MOCK_CONFIG.useNews) {
      console.log('Using mock data for news');
      
      // If symbols are provided, filter news to those symbols
      if (symbols && symbols.length > 0) {
        return mockData.news.filter(news => 
          news.symbols.some(sym => symbols.includes(sym))
        );
      }
      
      // Otherwise return all news
      return mockData.news;
    }
    
    // Use real API if mock data is disabled
    try {
      return await polygonApi.getNews(symbols);
    } catch (error) {
      console.log('Polygon API failed for news:', error.message);
      throw new Error(`Failed to fetch news: ${error.message}`);
    }
  },

  // Get stock data for major indices
  getMajorIndices: async () => {
    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      console.log('Using mock data for major indices');
      return mockData.indices;
    }
    
    // Use real API if mock data is disabled
    try {
      // Get data for major indices
      const indices = ['SPY', 'QQQ', 'DIA', 'IWM'];
      const results = {};
      
      // Sequential requests to avoid rate limiting
      for (const symbol of indices) {
        try {
          results[symbol] = await polygonApi.getQuote(symbol);
        } catch (error) {
          console.log(`Failed to fetch ${symbol}:`, error.message);
        }
      }
      
      return results;
    } catch (error) {
      console.log('Failed to fetch major indices:', error.message);
      throw new Error(`Failed to fetch major indices: ${error.message}`);
    }
  },

  // Get stock data for popular stocks
  getPopularStocks: async () => {
    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      console.log('Using mock data for popular stocks');
      return mockData.stocks;
    }
    
    // Use real API if mock data is disabled
    try {
      // Get data for popular tech stocks
      const stocks = ['AAPL', 'MSFT', 'GOOGL'];
      const results = {};
      
      // Sequential requests to avoid rate limiting
      for (const symbol of stocks) {
        try {
          results[symbol] = await polygonApi.getQuote(symbol);
        } catch (error) {
          console.log(`Failed to fetch ${symbol}:`, error.message);
        }
      }
      
      return results;
    } catch (error) {
      console.log('Failed to fetch popular stocks:', error.message);
      throw new Error(`Failed to fetch popular stocks: ${error.message}`);
    }
  },

  // Search stocks
  searchStocks: async (keywords) => {
    // Use mock data if enabled
    if (USE_MOCK_DATA && MOCK_CONFIG.useSearch) {
      console.log('Using mock data for search:', keywords);
      
      // Find the closest match in our mock search results
      const matchKey = Object.keys(mockData.searchResults)
        .find(key => keywords.toLowerCase().includes(key.toLowerCase())) || Object.keys(mockData.searchResults)[0];
      
      return mockData.searchResults[matchKey];
    }
    
    // Use real API if mock data is disabled
    try {
      return await polygonApi.searchStocks(keywords);
    } catch (error) {
      console.log('Polygon API failed for stock search:', error.message);
      throw new Error(`Failed to search stocks: ${error.message}`);
    }
  },
};

export default stockApi; 