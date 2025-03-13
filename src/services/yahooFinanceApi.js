import axios from 'axios';

const BASE_URL = 'https://query1.finance.yahoo.com/v10/finance';

const yahooFinanceApi = {
  getCompanyOverview: async (symbol) => {
    try {
      // Fetch multiple endpoints in parallel for efficiency
      const [quoteSummary, statistics] = await Promise.all([
        axios.get(`${BASE_URL}/quoteSummary/${symbol}`, {
          params: {
            modules: 'assetProfile,price,summaryDetail,defaultKeyStatistics',
          },
        }),
        axios.get(`${BASE_URL}/quoteSummary/${symbol}`, {
          params: {
            modules: 'financialData',
          },
        }),
      ]);

      const profile = quoteSummary.data.quoteSummary.result[0];
      const stats = statistics.data.quoteSummary.result[0];

      // Transform Yahoo Finance data to match our format
      return {
        Symbol: symbol,
        Name: profile.price.shortName,
        Description: profile.assetProfile.longBusinessSummary,
        Exchange: profile.price.exchangeName,
        Industry: profile.assetProfile.industry,
        Sector: profile.assetProfile.sector,
        MarketCapitalization: profile.price.marketCap.raw,
        PERatio: profile.summaryDetail.forwardPE?.raw || profile.summaryDetail.trailingPE?.raw,
        PEGRatio: profile.defaultKeyStatistics.pegRatio?.raw,
        PriceToBookRatio: profile.defaultKeyStatistics.priceToBook?.raw,
        PriceToSalesRatioTTM: profile.summaryDetail.priceToSalesTrailing12Months?.raw,
        ReturnOnEquityTTM: (stats.financialData.returnOnEquity?.raw * 100)?.toFixed(2),
        ReturnOnAssetsTTM: (profile.defaultKeyStatistics.returnOnAssets?.raw * 100)?.toFixed(2),
        OperatingMarginTTM: (stats.financialData.operatingMargins?.raw * 100)?.toFixed(2),
        QuickRatio: stats.financialData.quickRatio?.raw,
        source: 'Yahoo Finance',
      };
    } catch (error) {
      throw new Error(`Yahoo Finance API Error: ${error.response?.data?.error || error.message}`);
    }
  },
};

export default yahooFinanceApi; 