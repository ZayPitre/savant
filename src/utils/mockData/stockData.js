/**
 * Mock Stock Data
 * 
 * This file contains placeholder data to use during development
 * instead of making real API calls to Polygon.io
 */

// Mock data for major indices - formatted for the market overview component
export const mockIndices = {
  "SPY": {
    "Global Quote": {
      "01. symbol": "SPY",
      "02. open": "518.20",
      "03. high": "521.30",
      "04. low": "516.90",
      "05. price": "520.45",
      "06. volume": "45789230",
      "07. latest trading day": new Date().toISOString().split('T')[0],
      "08. previous close": "517.70",
      "09. change": "2.75",
      "10. change percent": "0.53%"
    },
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    price: 520.45,
    change: 2.75,
    changePercent: 0.53,
    previousClose: 517.70,
    open: 518.20,
    high: 521.30,
    low: 516.90,
    volume: 45789230,
    marketCap: 492758000000,
    pe: 23.5,
    dividend: 1.45,
    dividendYield: 1.32,
  },
  "QQQ": {
    "Global Quote": {
      "01. symbol": "QQQ",
      "02. open": "436.20",
      "03. high": "440.12",
      "04. low": "435.10",
      "05. price": "438.78",
      "06. volume": "32567890",
      "07. latest trading day": new Date().toISOString().split('T')[0],
      "08. previous close": "435.57",
      "09. change": "3.21",
      "10. change percent": "0.74%"
    },
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    price: 438.78,
    change: 3.21,
    changePercent: 0.74,
    previousClose: 435.57,
    open: 436.20,
    high: 440.12,
    low: 435.10,
    volume: 32567890,
    marketCap: 221345000000,
    pe: 28.7,
    dividend: 0.72,
    dividendYield: 0.58,
  },
  "DIA": {
    "Global Quote": {
      "01. symbol": "DIA",
      "02. open": "391.75",
      "03. high": "393.05",
      "04. low": "389.50",
      "05. price": "390.25",
      "06. volume": "18934520",
      "07. latest trading day": new Date().toISOString().split('T')[0],
      "08. previous close": "392.10",
      "09. change": "-1.85",
      "10. change percent": "-0.47%"
    },
    symbol: "DIA",
    name: "SPDR Dow Jones Industrial Average ETF",
    price: 390.25,
    change: -1.85,
    changePercent: -0.47,
    previousClose: 392.10,
    open: 391.75,
    high: 393.05,
    low: 389.50,
    volume: 18934520,
    marketCap: 143267000000,
    pe: 21.2,
    dividend: 2.15,
    dividendYield: 1.95,
  },
  "IWM": {
    "Global Quote": {
      "01. symbol": "IWM",
      "02. open": "214.60",
      "03. high": "216.40",
      "04. low": "213.85",
      "05. price": "215.30",
      "06. volume": "26745300",
      "07. latest trading day": new Date().toISOString().split('T')[0],
      "08. previous close": "214.25",
      "09. change": "1.05",
      "10. change percent": "0.49%"
    },
    symbol: "IWM",
    name: "iShares Russell 2000 ETF",
    price: 215.30,
    change: 1.05,
    changePercent: 0.49,
    previousClose: 214.25,
    open: 214.60,
    high: 216.40,
    low: 213.85,
    volume: 26745300,
    marketCap: 87652000000,
    pe: 18.9,
    dividend: 1.28,
    dividendYield: 1.16,
  }
};

// Mock data for popular stocks
export const mockStocks = {
  "AAPL": {
    "Global Quote": {
      "01. symbol": "AAPL",
      "02. open": "188.32",
      "03. high": "190.21",
      "04. low": "187.95",
      "05. price": "189.50",
      "06. volume": "57892450",
      "07. latest trading day": new Date().toISOString().split('T')[0],
      "08. previous close": "187.16",
      "09. change": "2.34",
      "10. change percent": "1.25%"
    },
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 189.50,
    change: 2.34,
    changePercent: 1.25,
    previousClose: 187.16,
    open: 188.32,
    high: 190.21,
    low: 187.95,
    volume: 57892450,
    marketCap: 2950000000000,
    pe: 32.6,
    dividend: 0.96,
    dividendYield: 0.51,
    sector: "Technology",
    description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    ceo: "Tim Cook",
    employees: 164000,
    headquarters: "Cupertino, California",
    founded: 1976,
    website: "https://www.apple.com"
  },
  "MSFT": {
    "Global Quote": {
      "01. symbol": "MSFT",
      "02. open": "413.20",
      "03. high": "417.30",
      "04. low": "412.45",
      "05. price": "415.75",
      "06. volume": "39287640",
      "07. latest trading day": new Date().toISOString().split('T')[0],
      "08. previous close": "411.95",
      "09. change": "3.80",
      "10. change percent": "0.92%"
    },
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 415.75,
    change: 3.80,
    changePercent: 0.92,
    previousClose: 411.95,
    open: 413.20,
    high: 417.30,
    low: 412.45,
    volume: 39287640,
    marketCap: 3089000000000,
    pe: 37.2,
    dividend: 3.00,
    dividendYield: 0.72,
    sector: "Technology",
    description: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.",
    ceo: "Satya Nadella",
    employees: 221000,
    headquarters: "Redmond, Washington",
    founded: 1975,
    website: "https://www.microsoft.com"
  },
  "GOOGL": {
    "Global Quote": {
      "01. symbol": "GOOGL",
      "02. open": "148.50",
      "03. high": "150.20",
      "04. low": "147.85",
      "05. price": "149.32",
      "06. volume": "27358920",
      "07. latest trading day": new Date().toISOString().split('T')[0],
      "08. previous close": "148.09",
      "09. change": "1.23",
      "10. change percent": "0.83%"
    },
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 149.32,
    change: 1.23,
    changePercent: 0.83,
    previousClose: 148.09,
    open: 148.50,
    high: 150.20,
    low: 147.85,
    volume: 27358920,
    marketCap: 1870000000000,
    pe: 28.5,
    dividend: 0,
    dividendYield: 0,
    sector: "Technology",
    description: "Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.",
    ceo: "Sundar Pichai",
    employees: 156500,
    headquarters: "Mountain View, California",
    founded: 1998,
    website: "https://abc.xyz"
  }
};

// Mock time series data (one month of daily prices)
export const mockTimeSeriesData = {
  "AAPL": Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    const basePrice = 180;
    const randomChange = Math.random() * 10 - 5; // Random number between -5 and 5
    const price = basePrice + randomChange + (i * 0.3); // Slight upward trend
    
    return {
      date: date.toISOString().split('T')[0],
      close: parseFloat(price.toFixed(2)),
      open: parseFloat((price - (Math.random() * 2)).toFixed(2)),
      high: parseFloat((price + (Math.random() * 2)).toFixed(2)),
      low: parseFloat((price - (Math.random() * 3)).toFixed(2)),
      volume: Math.floor(Math.random() * 50000000) + 30000000
    };
  })
};

// Mock news data
export const mockNews = [
  {
    id: "1",
    title: "Apple Announces New Product Line",
    summary: "Apple Inc. announced its latest product line today, including next-generation iPhones and updates to its MacBook series.",
    url: "https://example.com/apple-news",
    source: "Tech News",
    publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    symbols: ["AAPL"],
    sentiment: "positive"
  },
  {
    id: "2",
    title: "Microsoft Reports Record Quarterly Earnings",
    summary: "Microsoft Corporation reported record quarterly earnings, exceeding analyst expectations by 15%, driven by cloud services growth.",
    url: "https://example.com/microsoft-earnings",
    source: "Financial Times",
    publishedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    symbols: ["MSFT"],
    sentiment: "positive"
  },
  {
    id: "3",
    title: "Market Indices Reach All-Time Highs",
    summary: "Major market indices including the S&P 500 and NASDAQ reached all-time highs today, with technology stocks leading the gains.",
    url: "https://example.com/market-highs",
    source: "Market Watch",
    publishedAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    symbols: ["SPY", "QQQ", "AAPL", "MSFT", "GOOGL"],
    sentiment: "positive"
  },
  {
    id: "4",
    title: "Federal Reserve Signals Potential Rate Cut",
    summary: "The Federal Reserve signaled a potential interest rate cut in the coming months, citing improving inflation data and economic conditions.",
    url: "https://example.com/fed-rate-cut",
    source: "Economic News",
    publishedAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    symbols: ["SPY", "QQQ", "DIA"],
    sentiment: "positive"
  },
  {
    id: "5",
    title: "Google's AI Advancements Raise Competitive Concerns",
    summary: "Alphabet Inc.'s latest AI developments have raised competitive concerns among industry experts, as the company pushes ahead in automation.",
    url: "https://example.com/google-ai",
    source: "Tech Insights",
    publishedAt: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
    symbols: ["GOOGL"],
    sentiment: "neutral"
  }
];

// Mock market status
export const mockMarketStatus = {
  serverTime: new Date().toISOString(),
  exchanges: {
    nyse: "open",
    nasdaq: "open",
    otc: "open"
  },
  currencies: {
    fx: "open",
    crypto: "open"
  },
  market: "open",
  earlyHours: false,
  afterHours: false,
  nextOpen: new Date(new Date().setHours(9, 30, 0, 0)).toISOString(),
  nextClose: new Date(new Date().setHours(16, 0, 0, 0)).toISOString()
};

// Mock search results
export const mockSearchResults = {
  "app": [
    { symbol: "AAPL", name: "Apple Inc.", primary_exchange: "NASDAQ", type: "CS" },
    { symbol: "APP", name: "AppLovin Corporation", primary_exchange: "NASDAQ", type: "CS" },
    { symbol: "APPS", name: "Digital Turbine, Inc.", primary_exchange: "NASDAQ", type: "CS" }
  ],
  "micro": [
    { symbol: "MSFT", name: "Microsoft Corporation", primary_exchange: "NASDAQ", type: "CS" },
    { symbol: "MCHP", name: "Microchip Technology Inc.", primary_exchange: "NASDAQ", type: "CS" },
    { symbol: "MU", name: "Micron Technology, Inc.", primary_exchange: "NASDAQ", type: "CS" }
  ],
  "goog": [
    { symbol: "GOOGL", name: "Alphabet Inc. Class A", primary_exchange: "NASDAQ", type: "CS" },
    { symbol: "GOOG", name: "Alphabet Inc. Class C", primary_exchange: "NASDAQ", type: "CS" }
  ]
};

// Deep company data for detailed views
export const mockCompanyDetails = {
  "AAPL": {
    // Add root-level financial metrics that Analysis.js expects
    Symbol: "AAPL",
    Name: "Apple Inc.",
    PERatio: "32.6",
    PEGRatio: "2.5",
    PriceToBookRatio: "36.8",
    PriceToSalesRatioTTM: "7.5",
    ReturnOnEquityTTM: "75.1",
    ReturnOnAssetsTTM: "28.0",
    OperatingMarginTTM: "30.2",
    QuickRatio: "1.2",
    CurrentRatio: "1.4",
    DebtToEquity: "195.2",
    GrossProfitTTM: "170782000000",
    DividendYield: "0.51",
    EPS: "5.81",
    RevenueTTM: "394328000000",
    RevenueGrowth: "7.8",
    MarketCapitalization: "2950000000000",
    Cash: "61630000000",
    Industry: "Consumer Electronics",
    Sector: "Technology",
    Exchange: "NASDAQ",
    Description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, and HomePod. It also provides AppleCare support and cloud services; and operates various platforms, including the App Store.",
    // Keep existing profile data
    profile: {
      ticker: "AAPL",
      name: "Apple Inc.",
      description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, and HomePod. It also provides AppleCare support and cloud services; and operates various platforms, including the App Store that allow customers to discover and download applications and digital content, such as books, music, video, games, and podcasts.",
      sector: "Technology",
      industry: "Consumer Electronics",
      employees: 164000,
      ceo: "Tim Cook",
      address: "One Apple Park Way, Cupertino, CA 95014, USA",
      phone: "(408) 996-1010",
      website: "https://www.apple.com",
      exchange: "NASDAQ",
      marketCap: 2950000000000,
      pe: 32.6,
      eps: 5.81,
      high52: 198.23,
      low52: 143.90,
      averageVolume: 58760000,
    },
    financials: {
      incomeStatement: {
        revenue: 394328000000,
        grossProfit: 170782000000,
        operatingIncome: 119437000000,
        netIncome: 96995000000,
      },
      balanceSheet: {
        totalAssets: 346720000000,
        totalLiabilities: 287912000000,
        totalEquity: 58808000000,
        cash: 61630000000,
      },
      cashFlow: {
        operatingCashFlow: 114480000000,
        capitalExpenditures: -11085000000,
        freeCashFlow: 103395000000,
      },
    },
    metrics: {
      revenueGrowth: 7.8,
      profitMargin: 24.6,
      debtToEquity: 195.2,
      returnOnEquity: 160.2,
      returnOnAssets: 28.0,
      dividendYield: 0.51,
    }
  },
  "MSFT": {
    // Add root-level financial metrics for Microsoft
    Symbol: "MSFT",
    Name: "Microsoft Corporation",
    PERatio: "37.2",
    PEGRatio: "2.1",
    PriceToBookRatio: "15.6",
    PriceToSalesRatioTTM: "12.8",
    ReturnOnEquityTTM: "42.5",
    ReturnOnAssetsTTM: "21.6",
    OperatingMarginTTM: "41.8",
    QuickRatio: "1.8",
    CurrentRatio: "1.9",
    DebtToEquity: "38.6",
    GrossProfitTTM: "143582000000",
    DividendYield: "0.72",
    EPS: "11.18",
    RevenueTTM: "236103000000",
    RevenueGrowth: "15.6",
    MarketCapitalization: "3089000000000",
    Cash: "93546000000",
    Industry: "Software—Infrastructure",
    Sector: "Technology",
    Exchange: "NASDAQ",
    Description: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates through three segments: Productivity and Business Processes, Intelligent Cloud, and More Personal Computing.",
    // Adding profile data structure
    profile: {
      ticker: "MSFT",
      name: "Microsoft Corporation",
      description: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates through three segments: Productivity and Business Processes, Intelligent Cloud, and More Personal Computing.",
      sector: "Technology",
      industry: "Software—Infrastructure",
      employees: 221000,
      ceo: "Satya Nadella",
      address: "One Microsoft Way, Redmond, WA 98052, USA",
      phone: "(425) 882-8080",
      website: "https://www.microsoft.com",
      exchange: "NASDAQ",
      marketCap: 3089000000000,
      pe: 37.2,
      eps: 11.18,
      high52: 420.82,
      low52: 310.54,
      averageVolume: 28950000,
    },
    financials: {
      incomeStatement: {
        revenue: 236103000000,
        grossProfit: 143582000000,
        operatingIncome: 98721000000,
        netIncome: 83364000000,
      },
      balanceSheet: {
        totalAssets: 411355000000,
        totalLiabilities: 192887000000,
        totalEquity: 218468000000,
        cash: 93546000000,
      },
      cashFlow: {
        operatingCashFlow: 94835000000,
        capitalExpenditures: -27078000000,
        freeCashFlow: 67757000000,
      },
    },
    metrics: {
      revenueGrowth: 15.6,
      profitMargin: 35.3,
      debtToEquity: 38.6,
      returnOnEquity: 42.5,
      returnOnAssets: 21.6,
      dividendYield: 0.72,
    }
  },
  "GOOGL": {
    // Add root-level financial metrics for Alphabet
    Symbol: "GOOGL",
    Name: "Alphabet Inc.",
    PERatio: "28.5",
    PEGRatio: "1.7",
    PriceToBookRatio: "6.2",
    PriceToSalesRatioTTM: "5.9",
    ReturnOnEquityTTM: "25.3",
    ReturnOnAssetsTTM: "17.8",
    OperatingMarginTTM: "28.9",
    QuickRatio: "2.4",
    CurrentRatio: "2.5",
    DebtToEquity: "11.8",
    GrossProfitTTM: "156562000000",
    DividendYield: "0",
    EPS: "5.24",
    RevenueTTM: "307394000000",
    RevenueGrowth: "13.9",
    MarketCapitalization: "1870000000000",
    Cash: "117884000000",
    Industry: "Internet Content & Information",
    Sector: "Technology",
    Exchange: "NASDAQ",
    Description: "Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments.",
    // Adding profile data structure
    profile: {
      ticker: "GOOGL",
      name: "Alphabet Inc.",
      description: "Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments.",
      sector: "Technology",
      industry: "Internet Content & Information",
      employees: 156500,
      ceo: "Sundar Pichai",
      address: "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
      phone: "(650) 253-0000",
      website: "https://abc.xyz",
      exchange: "NASDAQ",
      marketCap: 1870000000000,
      pe: 28.5,
      eps: 5.24,
      high52: 155.28,
      low52: 102.21,
      averageVolume: 32760000,
    },
    financials: {
      incomeStatement: {
        revenue: 307394000000,
        grossProfit: 156562000000,
        operatingIncome: 88848000000,
        netIncome: 72276000000,
      },
      balanceSheet: {
        totalAssets: 391639000000,
        totalLiabilities: 122690000000,
        totalEquity: 268949000000,
        cash: 117884000000,
      },
      cashFlow: {
        operatingCashFlow: 110707000000,
        capitalExpenditures: -30288000000,
        freeCashFlow: 80419000000,
      },
    },
    metrics: {
      revenueGrowth: 13.9,
      profitMargin: 23.5,
      debtToEquity: 11.8,
      returnOnEquity: 25.3,
      returnOnAssets: 17.8,
      dividendYield: 0,
    }
  }
};

export default {
  indices: mockIndices,
  stocks: mockStocks,
  timeSeriesData: mockTimeSeriesData,
  news: mockNews,
  marketStatus: mockMarketStatus,
  searchResults: mockSearchResults,
  companyDetails: mockCompanyDetails
}; 