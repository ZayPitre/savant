import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  CircularProgress,
  Alert,
  Tooltip,
  Button,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import stockApi from '../services/stockApi';

// Metrics we want to display in percentile bubbles
const METRICS = [
  { key: 'PERatio', label: 'P/E Ratio', description: 'Price to Earnings Ratio - Lower is generally better' },
  { key: 'EPS', label: 'EPS', description: 'Earnings Per Share - Higher is better' },
  { key: 'RevenueTTM', label: 'Revenue', description: 'Trailing 12 Month Revenue - Higher is better' },
  { key: 'RevenueGrowth', label: 'Rev Growth %', description: 'Year-over-Year Revenue Growth - Higher is better' },
  { key: 'PriceToBookRatio', label: 'P/B Ratio', description: 'Price to Book Ratio - Lower indicates more value' },
  { key: 'MarketCapitalization', label: 'Market Cap', description: 'Total Market Value - Size indicator' },
  { key: 'Cash', label: 'Cash on Hand', description: 'Available Cash & Equivalents - Higher is better' },
  { key: 'DebtToEquity', label: 'Debt/Equity', description: 'Debt to Equity Ratio - Lower is generally better' },
];

const getPercentileColor = (percentile) => {
  // Updated color scheme: red is good, grey is medium, blue is bad
  if (percentile >= 85) return '#e53935'; // Deep red for excellent (85-100)
  if (percentile >= 70) return '#ef5350'; // Red for very good (70-84)
  if (percentile >= 60) return '#f44336'; // Light red for good (60-69)
  if (percentile >= 40) return '#9e9e9e'; // Grey for average (40-59)
  if (percentile >= 25) return '#64b5f6'; // Light blue for below average (25-39)
  if (percentile >= 10) return '#2196f3'; // Blue for poor (10-24)
  return '#1565c0'; // Deep blue for very poor (0-9)
};

const PercentileBubble = ({ percentile, color, value }) => {
  return (
    <Tooltip 
      title={
        <Box sx={{ p: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Percentile: {Math.round(percentile)}
          </Typography>
          <Typography variant="body2">
            Value: {value}
          </Typography>
        </Box>
      }
      arrow
      placement="top"
    >
      <Box
        sx={{
          position: 'absolute',
          left: `${percentile}%`,
          top: '-16px',
          transform: 'translateX(-50%)',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          bgcolor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          zIndex: 2,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateX(-50%) scale(1.1)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
          }
        }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            fontSize: '0.85rem',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
          }}
        >
          {Math.round(percentile)}
        </Typography>
      </Box>
    </Tooltip>
  );
};

const ChartPlaceholder = ({ symbol }) => {
  return (
    <Paper sx={{ 
      p: 3, 
      mb: 4, 
      minHeight: '300px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backdropFilter: 'blur(10px)',
      background: 'rgba(26, 32, 53, 0.7)',
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom color="primary.light">
          Stock Chart for {symbol}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is a placeholder for a chart component. In a production app, this would show price history, volume, 
          and moving averages using a library like Recharts or Chart.js.
        </Typography>
      </Box>
    </Paper>
  );
};

// Add a utility function to format large numbers
const formatLargeNumber = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return 'N/A';
  
  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(2)}T`; // Trillions
  } else if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`; // Billions
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`; // Millions
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`; // Thousands
  } else {
    return `$${num.toFixed(2)}`;
  }
};

const CompanyProfile = ({ data }) => {
  if (!data) return null;

  // Get market cap from various possible sources
  const marketCap = parseFloat(data.MarketCapitalization || data.marketCap || data.profile?.marketCap || 0);

  return (
    <Paper sx={{ 
      p: 3, 
      mb: 4,
      backdropFilter: 'blur(10px)',
      background: 'rgba(26, 32, 53, 0.8)',
      borderRadius: 4,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h5" gutterBottom color="primary.light">
          {data.Name || data.name || data.Symbol || 'Unknown Company'} ({data.Symbol || data.symbol})
        </Typography>
        <Chip 
          label={data.source || 'Polygon.io'} 
          size="small" 
          color={data.source === 'Yahoo Finance' ? 'secondary' : 'primary'}
          sx={{ backdropFilter: 'blur(5px)', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        />
      </Box>
      <Typography variant="body1" paragraph>
        {data.Description || data.description || data.profile?.description || 'No company description available.'}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="primary.light">Industry</Typography>
          <Typography variant="body2" paragraph>{data.Industry || data.industry || data.profile?.industry || 'N/A'}</Typography>
          
          <Typography variant="subtitle2" color="primary.light">Sector</Typography>
          <Typography variant="body2" paragraph>{data.Sector || data.sector || data.profile?.sector || 'N/A'}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="primary.light">Exchange</Typography>
          <Typography variant="body2" paragraph>{data.Exchange || data.exchange || data.profile?.exchange || 'N/A'}</Typography>
          
          <Typography variant="subtitle2" color="primary.light">Market Cap</Typography>
          <Typography variant="body2" paragraph>
            {formatLargeNumber(marketCap)}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Add sector-specific ranges for more accurate percentile calculations
const SECTOR_RANGES = {
  'Technology': {
    PERatio: { min: 15, max: 60, lowerIsBetter: true },
    EPS: { min: 0.5, max: 20, lowerIsBetter: false },
    RevenueTTM: { min: 1e9, max: 500e9, lowerIsBetter: false },
    RevenueGrowth: { min: -5, max: 50, lowerIsBetter: false },
    PriceToBookRatio: { min: 2, max: 50, lowerIsBetter: true },
    MarketCapitalization: { min: 10e9, max: 3000e9, lowerIsBetter: false },
    Cash: { min: 1e9, max: 150e9, lowerIsBetter: false },
    DebtToEquity: { min: 0, max: 150, lowerIsBetter: true }
  },
  'Financial Services': {
    PERatio: { min: 8, max: 25, lowerIsBetter: true },
    EPS: { min: 1, max: 10, lowerIsBetter: false },
    RevenueTTM: { min: 1e9, max: 200e9, lowerIsBetter: false },
    RevenueGrowth: { min: -8, max: 30, lowerIsBetter: false },
    PriceToBookRatio: { min: 0.8, max: 3, lowerIsBetter: true },
    MarketCapitalization: { min: 5e9, max: 1000e9, lowerIsBetter: false },
    Cash: { min: 0.5e9, max: 50e9, lowerIsBetter: false },
    DebtToEquity: { min: 50, max: 300, lowerIsBetter: true }
  },
  'Healthcare': {
    PERatio: { min: 10, max: 35, lowerIsBetter: true },
    EPS: { min: 0.5, max: 15, lowerIsBetter: false },
    RevenueTTM: { min: 0.5e9, max: 100e9, lowerIsBetter: false },
    RevenueGrowth: { min: -10, max: 40, lowerIsBetter: false },
    PriceToBookRatio: { min: 1, max: 8, lowerIsBetter: true },
    MarketCapitalization: { min: 5e9, max: 800e9, lowerIsBetter: false },
    Cash: { min: 0.5e9, max: 30e9, lowerIsBetter: false },
    DebtToEquity: { min: 0, max: 200, lowerIsBetter: true }
  },
  'Consumer Cyclical': {
    PERatio: { min: 12, max: 40, lowerIsBetter: true },
    EPS: { min: 0.5, max: 12, lowerIsBetter: false },
    RevenueTTM: { min: 0.5e9, max: 300e9, lowerIsBetter: false },
    RevenueGrowth: { min: -15, max: 35, lowerIsBetter: false },
    PriceToBookRatio: { min: 1, max: 10, lowerIsBetter: true },
    MarketCapitalization: { min: 5e9, max: 1000e9, lowerIsBetter: false },
    Cash: { min: 0.5e9, max: 40e9, lowerIsBetter: false },
    DebtToEquity: { min: 0, max: 250, lowerIsBetter: true }
  },
  'Communication Services': {
    PERatio: { min: 15, max: 45, lowerIsBetter: true },
    EPS: { min: 0.5, max: 18, lowerIsBetter: false },
    RevenueTTM: { min: 1e9, max: 400e9, lowerIsBetter: false },
    RevenueGrowth: { min: -8, max: 45, lowerIsBetter: false },
    PriceToBookRatio: { min: 1.5, max: 15, lowerIsBetter: true },
    MarketCapitalization: { min: 10e9, max: 2000e9, lowerIsBetter: false },
    Cash: { min: 1e9, max: 80e9, lowerIsBetter: false },
    DebtToEquity: { min: 0, max: 180, lowerIsBetter: true }
  },
  'Energy': {
    PERatio: { min: 8, max: 25, lowerIsBetter: true },
    EPS: { min: 0.5, max: 8, lowerIsBetter: false },
    RevenueTTM: { min: 0.5e9, max: 200e9, lowerIsBetter: false },
    RevenueGrowth: { min: -20, max: 30, lowerIsBetter: false },
    PriceToBookRatio: { min: 0.8, max: 5, lowerIsBetter: true },
    MarketCapitalization: { min: 5e9, max: 500e9, lowerIsBetter: false },
    Cash: { min: 0.5e9, max: 30e9, lowerIsBetter: false },
    DebtToEquity: { min: 30, max: 250, lowerIsBetter: true }
  },
  'Industrials': {
    PERatio: { min: 10, max: 30, lowerIsBetter: true },
    EPS: { min: 0.5, max: 10, lowerIsBetter: false },
    RevenueTTM: { min: 0.5e9, max: 150e9, lowerIsBetter: false },
    RevenueGrowth: { min: -12, max: 25, lowerIsBetter: false },
    PriceToBookRatio: { min: 1, max: 6, lowerIsBetter: true },
    MarketCapitalization: { min: 5e9, max: 300e9, lowerIsBetter: false },
    Cash: { min: 0.5e9, max: 20e9, lowerIsBetter: false },
    DebtToEquity: { min: 20, max: 200, lowerIsBetter: true }
  },
  'Consumer Defensive': {
    PERatio: { min: 15, max: 35, lowerIsBetter: true },
    EPS: { min: 0.5, max: 8, lowerIsBetter: false },
    RevenueTTM: { min: 0.5e9, max: 100e9, lowerIsBetter: false },
    RevenueGrowth: { min: -5, max: 20, lowerIsBetter: false },
    PriceToBookRatio: { min: 1, max: 8, lowerIsBetter: true },
    MarketCapitalization: { min: 5e9, max: 400e9, lowerIsBetter: false },
    Cash: { min: 0.5e9, max: 25e9, lowerIsBetter: false },
    DebtToEquity: { min: 0, max: 180, lowerIsBetter: true }
  },
  'Real Estate': {
    PERatio: { min: 12, max: 30, lowerIsBetter: true },
    EPS: { min: 0.5, max: 6, lowerIsBetter: false },
    RevenueTTM: { min: 0.2e9, max: 50e9, lowerIsBetter: false },
    RevenueGrowth: { min: -10, max: 25, lowerIsBetter: false },
    PriceToBookRatio: { min: 0.8, max: 3, lowerIsBetter: true },
    MarketCapitalization: { min: 1e9, max: 100e9, lowerIsBetter: false },
    Cash: { min: 0.2e9, max: 10e9, lowerIsBetter: false },
    DebtToEquity: { min: 50, max: 300, lowerIsBetter: true }
  },
  'Utilities': {
    PERatio: { min: 12, max: 25, lowerIsBetter: true },
    EPS: { min: 0.5, max: 5, lowerIsBetter: false },
    RevenueTTM: { min: 0.2e9, max: 30e9, lowerIsBetter: false },
    RevenueGrowth: { min: -8, max: 15, lowerIsBetter: false },
    PriceToBookRatio: { min: 1, max: 4, lowerIsBetter: true },
    MarketCapitalization: { min: 1e9, max: 100e9, lowerIsBetter: false },
    Cash: { min: 0.2e9, max: 5e9, lowerIsBetter: false },
    DebtToEquity: { min: 80, max: 350, lowerIsBetter: true }
  },
  'Basic Materials': {
    PERatio: { min: 8, max: 25, lowerIsBetter: true },
    EPS: { min: 0.5, max: 8, lowerIsBetter: false },
    RevenueTTM: { min: 0.5e9, max: 80e9, lowerIsBetter: false },
    RevenueGrowth: { min: -15, max: 30, lowerIsBetter: false },
    PriceToBookRatio: { min: 0.8, max: 5, lowerIsBetter: true },
    MarketCapitalization: { min: 1e9, max: 200e9, lowerIsBetter: false },
    Cash: { min: 0.2e9, max: 15e9, lowerIsBetter: false },
    DebtToEquity: { min: 30, max: 250, lowerIsBetter: true }
  }
};

// Default ranges to use if sector-specific ranges are not available
const DEFAULT_RANGES = {
  PERatio: { min: 5, max: 45, lowerIsBetter: true },
  EPS: { min: 0, max: 15, lowerIsBetter: false },
  RevenueTTM: { min: 1e9, max: 400e9, lowerIsBetter: false },
  RevenueGrowth: { min: -10, max: 40, lowerIsBetter: false },
  PriceToBookRatio: { min: 1, max: 40, lowerIsBetter: true },
  MarketCapitalization: { min: 10e9, max: 2500e9, lowerIsBetter: false },
  Cash: { min: 1e9, max: 100e9, lowerIsBetter: false },
  DebtToEquity: { min: 0, max: 200, lowerIsBetter: true }
};

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [symbol, setSymbol] = useState('');
  const [searchSymbol, setSearchSymbol] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  // Extract symbol from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const symbolParam = params.get('symbol');
    if (symbolParam) {
      setSymbol(symbolParam);
      setSearchSymbol(symbolParam);
    }
  }, [location]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['companyOverview', searchSymbol],
    queryFn: () => stockApi.getCompanyOverview(searchSymbol),
    enabled: !!searchSymbol,
    staleTime: 300000, // Cache for 5 minutes
    retry: false, // Don't retry on failure
  });

  const handleSearch = (e) => {
    // Prevent default only if an event is provided
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (!symbol) return;
    
    // Update URL with the new symbol
    navigate(`/analysis?symbol=${symbol.toUpperCase()}`);
    setSearchSymbol(symbol.toUpperCase());
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Check if we hit the rate limit or other API errors
  const isApiError = error?.message?.includes('API call frequency') || 
                     error?.message?.includes('API Error') ||
                     data?.Note?.includes('API call frequency') ||
                     data?.Information?.includes('API key');

  // Update the getMetricPercentile function to use sector-specific ranges
  const getMetricPercentile = (value, metric, sector) => {
    // Convert value to number and handle invalid inputs
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return { percentile: 0, color: '#666', actualValue: 'N/A' };
    }

    // Get sector-specific ranges if available, otherwise use default ranges
    const sectorRanges = sector && SECTOR_RANGES[sector] ? SECTOR_RANGES[sector][metric] : null;
    const ranges = sectorRanges || DEFAULT_RANGES[metric];
    
    if (!ranges) {
      return { percentile: 50, color: '#666', actualValue: formatValue(numValue, metric) };
    }

    const { min, max, lowerIsBetter } = ranges;
    
    // Clamp value to range
    const clampedValue = Math.max(min, Math.min(max, numValue));
    
    // Calculate percentile (0-100)
    let percentile = ((clampedValue - min) / (max - min)) * 100;
    
    // Invert percentile if lower values are better
    if (lowerIsBetter) {
      percentile = 100 - percentile;
    }
    
    // Get color based on percentile
    const color = getPercentileColor(percentile);
    
    // Format the actual value for display using helper function
    const actualValue = formatValue(numValue, metric);
    
    return { percentile, color, actualValue };
  };

  // Helper function to format values based on metric type
  const formatValue = (value, metric) => {
    if (isNaN(value)) return 'N/A';
    
    switch (metric) {
      case 'PERatio':
      case 'PriceToBookRatio':
        return value.toFixed(2);
      case 'DebtToEquity':
        return `${value.toFixed(2)}`;
      case 'EPS':
        return `$${value.toFixed(2)}`;
      case 'RevenueTTM':
      case 'MarketCapitalization':
      case 'Cash':
        return formatLargeNumber(value);
      case 'RevenueGrowth':
        return `${value.toFixed(1)}%`;
      default:
        return value.toFixed(2);
    }
  };
  
  const renderTabContent = () => {
    if (!data || error) return null;
    
    switch(activeTab) {
      case 0: // Overview
        return (
          <Box>
            <Typography variant="h6" gutterBottom color="primary.light" sx={{ mb: 3 }}>
              Financial Percentile Rankings - {new Date().getFullYear()}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Comparing {data.Symbol} to market averages. Higher percentiles indicate better performance.
            </Typography>
            
            <Grid container spacing={3}>
              {METRICS.map((metric) => {
                const value = data[metric.key];
                const { percentile, color, actualValue } = getMetricPercentile(value, metric.key, data.Sector);
                
                return (
                  <Grid item xs={12} md={6} key={metric.key}>
                    <Box sx={{ position: 'relative', mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {metric.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {actualValue}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        position: 'relative', 
                        height: '10px',
                        bgcolor: 'rgba(255, 255, 255, 0.1)', 
                        borderRadius: '5px',
                        overflow: 'visible',
                        mt: 2,
                        mb: 3
                      }}>
                        <Box sx={{ 
                          position: 'absolute', 
                          left: 0, 
                          right: 0, 
                          top: 0, 
                          bottom: 0,
                          display: 'flex',
                          justifyContent: 'space-between',
                          px: 1
                        }}>
                          {[0, 25, 50, 75, 100].map((mark) => (
                            <Box 
                              key={mark} 
                              sx={{ 
                                width: '1px', 
                                height: '100%', 
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                opacity: mark % 25 === 0 ? 0.5 : 0.2
                              }} 
                            />
                          ))}
                        </Box>
                        <PercentileBubble 
                          percentile={percentile} 
                          color={color} 
                          value={actualValue}
                        />
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
            
            <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary.light">
                Sector Context
              </Typography>
              <Typography variant="body2" paragraph>
                {data.Symbol} is in the <strong>{data.Sector}</strong> sector. The percentiles above compare {data.Symbol} to other companies in this sector, providing a more accurate assessment of its performance relative to its peers.
              </Typography>
              <Typography variant="body2">
                Different sectors have different typical ranges for financial metrics. For example, technology companies typically have higher P/E ratios than utility companies. By comparing {data.Symbol} to others in its sector, you get a more meaningful context for evaluation.
              </Typography>
            </Box>
            
            <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary.light">
                Historical Performance
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Chart placeholder - Historical performance data will be displayed here
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      case 1: // Financials
        return (
          <Paper sx={{ 
            p: 3,
            backdropFilter: 'blur(10px)',
            background: 'rgba(26, 32, 53, 0.7)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <Typography variant="h6" gutterBottom color="primary.light">
              Financial Data
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  height: '100%'
                }}>
                  <Typography variant="subtitle2" color="primary.light">Revenue (TTM)</Typography>
                  <Typography variant="body1">{formatLargeNumber(data.RevenueTTM || 0)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  height: '100%'
                }}>
                  <Typography variant="subtitle2" color="primary.light">Gross Profit (TTM)</Typography>
                  <Typography variant="body1">{formatLargeNumber(data.GrossProfitTTM || 0)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  height: '100%'
                }}>
                  <Typography variant="subtitle2" color="primary.light">Diluted EPS (TTM)</Typography>
                  <Typography variant="body1">${parseFloat(data.EPS || 0).toFixed(2)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  height: '100%'
                }}>
                  <Typography variant="subtitle2" color="primary.light">Profit Margin</Typography>
                  <Typography variant="body1">{parseFloat(data.ProfitMargin || 0).toFixed(2)}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  height: '100%'
                }}>
                  <Typography variant="subtitle2" color="primary.light">Operating Margin (TTM)</Typography>
                  <Typography variant="body1">{parseFloat(data.OperatingMarginTTM || 0).toFixed(2)}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  height: '100%'
                }}>
                  <Typography variant="subtitle2" color="primary.light">Return on Equity (TTM)</Typography>
                  <Typography variant="body1">{parseFloat(data.ReturnOnEquityTTM || 0).toFixed(2)}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  height: '100%'
                }}>
                  <Typography variant="subtitle2" color="primary.light">Cash & Equivalents</Typography>
                  <Typography variant="body1">{formatLargeNumber(data.Cash || data.financials?.balanceSheet?.cash || 0)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  height: '100%'
                }}>
                  <Typography variant="subtitle2" color="primary.light">Debt to Equity</Typography>
                  <Typography variant="body1">{parseFloat(data.DebtToEquity || 0).toFixed(2)}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  height: '100%'
                }}>
                  <Typography variant="subtitle2" color="primary.light">Revenue Growth</Typography>
                  <Typography variant="body1">{parseFloat(data.RevenueGrowth || 0).toFixed(2)}%</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        );
      case 2: // News
        return (
          <Paper sx={{ 
            p: 3,
            backdropFilter: 'blur(10px)',
            background: 'rgba(26, 32, 53, 0.7)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <Typography variant="h6" gutterBottom color="primary.light">
              Latest News
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This tab would display company-specific news articles. In the full app, this would integrate
              with the NewsSection component to show filtered news for this specific stock.
            </Typography>
          </Paper>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Add a gradient background effect to the entire page */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: -1,
        background: 'radial-gradient(circle at 20% 20%, rgba(25, 118, 210, 0.15), transparent 70%), ' +
                   'radial-gradient(circle at 80% 80%, rgba(240, 98, 146, 0.1), transparent 70%)',
        pointerEvents: 'none'
      }} />
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ 
          mt: 4, 
          background: 'rgba(211, 47, 47, 0.1)', 
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(211, 47, 47, 0.3)'
        }}>
          {error}
        </Alert>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.light' }}>
              Company Analysis
            </Typography>
            <TextField
              variant="outlined"
              label="Symbol"
              size="small"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                endAdornment: (
                  <Button 
                    color="primary" 
                    variant="contained" 
                    onClick={handleSearch}
                    sx={{ 
                      ml: 1, 
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                    }}
                  >
                    Analyze
                  </Button>
                ),
                sx: { 
                  borderRadius: 3,
                  backdropFilter: 'blur(5px)',
                  bgcolor: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }
              }}
            />
          </Box>

          {data ? (
            <>
              <CompanyProfile data={data} />
              
              <Paper 
                sx={{ 
                  mb: 4, 
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: 'rgba(26, 32, 53, 0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange} 
                  variant="fullWidth"
                  textColor="primary"
                  indicatorColor="primary"
                  sx={{ 
                    bgcolor: 'rgba(0, 0, 0, 0.2)',
                    '& .MuiTab-root': {
                      py: 2,
                      fontWeight: 500
                    }
                  }}
                >
                  <Tab label="Overview" />
                  <Tab label="Financials" />
                  <Tab label="News" />
                </Tabs>

                <Box sx={{ p: 2 }}>
                  {renderTabContent()}
                </Box>
              </Paper>
            </>
          ) : (
            <Paper 
              sx={{ 
                p: 4, 
                borderRadius: 4,
                background: 'rgba(26, 32, 53, 0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'center'
              }}
            >
              <Typography variant="h5" gutterBottom color="primary.light" sx={{ mb: 3 }}>
                Stock Analysis Dashboard
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
                Enter a stock symbol above to access comprehensive financial analysis, including:
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <Typography variant="h6" gutterBottom color="primary.light">
                      Financial Percentile Rankings
                    </Typography>
                    <Typography variant="body2">
                      See how a company ranks against market averages across key metrics like PE Ratio, 
                      Revenue Growth, and Market Cap using our Baseball Savant-style visualization.
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <Typography variant="h6" gutterBottom color="primary.light">
                      Detailed Financial Metrics
                    </Typography>
                    <Typography variant="body2">
                      Access comprehensive financial data including Revenue, EPS, Profit Margins, 
                      Cash & Equivalents, and Debt to Equity ratios.
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <Typography variant="h6" gutterBottom color="primary.light">
                      Company Profile
                    </Typography>
                    <Typography variant="body2">
                      View detailed company information including industry, sector, exchange listing, 
                      market capitalization, and company description.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Try entering symbols like AAPL, MSFT, GOOGL, or TSLA to see detailed analysis.
              </Typography>
              
              <Button 
                variant="contained" 
                onClick={() => {
                  setSymbol('AAPL');
                  navigate('/analysis?symbol=AAPL');
                  setSearchSymbol('AAPL');
                }}
                sx={{ 
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                  }
                }}
              >
                Analyze AAPL
              </Button>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default Analysis; 