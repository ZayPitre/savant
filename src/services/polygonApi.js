import axios from 'axios';

const BASE_URL = 'https://api.polygon.io';
// Use environment variable for API key with fallback
const API_KEY = process.env.REACT_APP_POLYGON_API_KEY || 'o3UP3piFt3ZS2G6AEDMnXh8E9pumwvOh';

/**
 * Polygon.io API Service
 * Documentation: https://polygon.io/docs
 */
const polygonApi = {
  /**
   * Get company details, ticker details, and metrics
   */
  getCompanyOverview: async (symbol) => {
    try {
      // Fetch multiple endpoints in parallel for efficiency
      const [tickerDetails, companyDetails, financials] = await Promise.all([
        axios.get(`${BASE_URL}/v3/reference/tickers/${symbol}`, {
          params: { apiKey: API_KEY }
        }),
        axios.get(`${BASE_URL}/v1/meta/symbols/${symbol}/company`, {
          params: { apiKey: API_KEY }
        }),
        axios.get(`${BASE_URL}/v2/reference/financials/${symbol}`, {
          params: { 
            apiKey: API_KEY,
            limit: 1,
            sort: 'filing_date' 
          }
        })
      ]);

      const ticker = tickerDetails.data.results;
      const company = companyDetails.data;
      const financial = financials.data.results?.[0] || {};

      // Transform response to match our app's format
      return {
        Symbol: symbol,
        Name: ticker.name,
        Description: company.description,
        Exchange: ticker.primary_exchange,
        Industry: company.industry,
        Sector: company.sector,
        MarketCapitalization: ticker.market_cap,
        PERatio: financial.ratios?.priceToEarningsRatio || ticker.pe_ratio,
        PEGRatio: financial.ratios?.pegRatio,
        PriceToBookRatio: financial.ratios?.priceToBookRatio,
        PriceToSalesRatioTTM: financial.ratios?.priceToSalesRatio,
        ReturnOnEquityTTM: financial.ratios?.roe ? (financial.ratios.roe * 100).toFixed(2) : null,
        ReturnOnAssetsTTM: financial.ratios?.roa ? (financial.ratios.roa * 100).toFixed(2) : null,
        OperatingMarginTTM: financial.ratios?.operatingMargin ? (financial.ratios.operatingMargin * 100).toFixed(2) : null,
        QuickRatio: financial.ratios?.quickRatio,
        RevenueTTM: financial.financials?.income_statement?.revenues?.value,
        GrossProfitTTM: financial.financials?.income_statement?.gross_profit?.value,
        EPS: financial.financials?.income_statement?.basic_earnings_per_share?.value,
        ProfitMargin: financial.ratios?.netProfitMargin ? (financial.ratios.netProfitMargin * 100).toFixed(2) : null,
        source: 'Polygon.io',
      };
    } catch (error) {
      console.error('Polygon API error:', error.response?.data || error.message);
      throw new Error(`Polygon API Error: ${error.response?.data?.error || error.message}`);
    }
  },

  /**
   * Get current market data for a symbol
   */
  getGlobalMarketStatus: async (symbol) => {
    try {
      const [quote, prevClose] = await Promise.all([
        axios.get(`${BASE_URL}/v2/snapshot/locale/us/markets/stocks/tickers/${symbol}`, {
          params: { apiKey: API_KEY }
        }),
        axios.get(`${BASE_URL}/v2/aggs/ticker/${symbol}/prev`, {
          params: { apiKey: API_KEY }
        })
      ]);

      const tickerData = quote.data.ticker;
      const dayData = quote.data.ticker?.day;
      const lastQuote = quote.data.ticker?.lastQuote;
      const lastTrade = quote.data.ticker?.lastTrade;
      const prevData = prevClose.data.results?.[0];

      if (!lastTrade || !dayData) {
        throw new Error('No current market data available');
      }

      const currentPrice = lastTrade.p;
      const prevClosePrice = prevData?.c || 0;
      const changePercent = prevClosePrice ? ((currentPrice - prevClosePrice) / prevClosePrice * 100) : 0;

      // Transform to match Alpha Vantage format
      return {
        'Global Quote': {
          '01. symbol': symbol,
          '02. open': dayData.o,
          '03. high': dayData.h,
          '04. low': dayData.l,
          '05. price': currentPrice,
          '06. volume': dayData.v,
          '07. latest trading day': new Date().toISOString().split('T')[0],
          '08. previous close': prevClosePrice,
          '09. change': (currentPrice - prevClosePrice).toFixed(2),
          '10. change percent': `${changePercent.toFixed(2)}%`,
        },
        source: 'Polygon.io'
      };
    } catch (error) {
      console.error('Polygon API error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch market status: ${error.response?.data?.error || error.message}`);
    }
  },

  /**
   * Get news for a symbol or multiple symbols
   */
  getNews: async (symbols = []) => {
    try {
      const ticker = symbols.join(',');
      const response = await axios.get(`${BASE_URL}/v2/reference/news`, {
        params: {
          ticker: ticker || undefined, // Only include if we have symbols
          limit: 50,
          order: 'desc',
          sort: 'published_utc',
          apiKey: API_KEY
        }
      });

      // Transform to match our expected format
      return {
        feed: response.data.results.map(article => ({
          title: article.title,
          url: article.article_url,
          summary: article.description,
          time_published: article.published_utc,
          source: article.publisher.name,
          // Estimated sentiment based on keywords (Polygon doesn't provide sentiment)
          ticker_sentiment: symbols.map(sym => {
            // Simple sentiment estimation
            const content = (article.title + ' ' + article.description).toLowerCase();
            const hasPositiveWords = ['up', 'rise', 'gain', 'bull', 'growth', 'positive', 'beat'].some(word => content.includes(word));
            const hasNegativeWords = ['down', 'fall', 'drop', 'bear', 'decline', 'negative', 'miss'].some(word => content.includes(word));
            let sentiment = 0;
            if (hasPositiveWords && !hasNegativeWords) sentiment = 0.5;
            if (hasNegativeWords && !hasPositiveWords) sentiment = -0.3;
            
            return {
              ticker: sym,
              relevance_score: article.tickers.includes(sym) ? 0.9 : 0.5,
              sentiment_score: sentiment,
              sentiment_label: sentiment > 0 ? 'Positive' : sentiment < 0 ? 'Negative' : 'Neutral'
            };
          }).filter(item => item.relevance_score > 0.1) // Only include relevant mentions
        })),
        source: 'Polygon.io'
      };
    } catch (error) {
      console.error('Polygon API error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch news: ${error.response?.data?.error || error.message}`);
    }
  },

  /**
   * Search for stocks
   */
  searchStocks: async (query) => {
    try {
      const response = await axios.get(`${BASE_URL}/v3/reference/tickers`, {
        params: {
          search: query,
          active: true,
          sort: 'ticker',
          order: 'asc',
          limit: 20,
          apiKey: API_KEY
        }
      });
      
      return {
        bestMatches: response.data.results.map(item => ({
          '1. symbol': item.ticker,
          '2. name': item.name,
          '3. type': item.market,
          '4. region': item.locale,
          '5. marketOpen': '09:30',
          '6. marketClose': '16:00',
          '7. timezone': 'UTC-05',
          '8. currency': 'USD',
          '9. matchScore': '1.0000'
        })),
        source: 'Polygon.io'
      };
    } catch (error) {
      console.error('Polygon API error:', error.response?.data || error.message);
      throw new Error(`Failed to search stocks: ${error.response?.data?.error || error.message}`);
    }
  },

  /**
   * Get daily time series data
   */
  getDailyTimeSeries: async (symbol) => {
    try {
      const response = await axios.get(`${BASE_URL}/v2/aggs/ticker/${symbol}/range/1/day/2020-01-01/${new Date().toISOString().split('T')[0]}`, {
        params: {
          adjusted: true,
          sort: 'desc',
          limit: 100,
          apiKey: API_KEY
        }
      });

      // Restructure data to match Alpha Vantage format
      const timeSeries = {};
      response.data.results.forEach(item => {
        // Convert timestamp to date format (YYYY-MM-DD)
        const date = new Date(item.t).toISOString().split('T')[0];
        timeSeries[date] = {
          '1. open': item.o,
          '2. high': item.h,
          '3. low': item.l,
          '4. close': item.c,
          '5. volume': item.v
        };
      });

      return {
        'Meta Data': {
          '1. Information': `Daily Prices for ${symbol}`,
          '2. Symbol': symbol,
          '3. Last Refreshed': new Date().toISOString().split('T')[0],
          '4. Output Size': 'Compact',
          '5. Time Zone': 'US/Eastern'
        },
        'Time Series (Daily)': timeSeries,
        source: 'Polygon.io'
      };
    } catch (error) {
      console.error('Polygon API error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch daily time series: ${error.response?.data?.error || error.message}`);
    }
  }
};

export default polygonApi; 