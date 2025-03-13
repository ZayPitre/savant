import React, { useState } from 'react';
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
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import stockApi from '../services/stockApi';

// Metrics we want to display in percentile bubbles
const METRICS = [
  { key: 'PERatio', label: 'P/E Ratio', description: 'Price to Earnings Ratio - Lower is generally better' },
  { key: 'PEGRatio', label: 'PEG Ratio', description: 'Price/Earnings to Growth Ratio - Lower is generally better' },
  { key: 'PriceToBookRatio', label: 'P/B Ratio', description: 'Price to Book Ratio - Lower indicates more value' },
  { key: 'PriceToSalesRatioTTM', label: 'P/S Ratio', description: 'Price to Sales Ratio - Lower indicates more value' },
  { key: 'ReturnOnEquityTTM', label: 'ROE', description: 'Return on Equity - Higher is better' },
  { key: 'ReturnOnAssetsTTM', label: 'ROA', description: 'Return on Assets - Higher is better' },
  { key: 'OperatingMarginTTM', label: 'Operating Margin', description: 'Operating Margin - Higher is better' },
  { key: 'QuickRatio', label: 'Quick Ratio', description: 'Quick Ratio - Higher indicates better liquidity' },
];

const PercentileBubble = ({ value, label, description, color }) => {
  // Convert string percentage to number and handle edge cases
  const percentile = Math.min(Math.max(parseFloat(value) || 0, 0), 100);
  
  return (
    <Tooltip title={description} arrow placement="top">
      <Box
        sx={{
          position: 'relative',
          width: 60,
          height: 60,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: color || '#1976d2',
          color: 'white',
          cursor: 'help',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold', lineHeight: 1 }}>
            {percentile}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', fontSize: '0.6rem', lineHeight: 1 }}>
            {label}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
};

const CompanyProfile = ({ data }) => {
  if (!data) return null;

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          {data.Name} ({data.Symbol})
        </Typography>
        <Chip 
          label={data.source || 'Alpha Vantage'} 
          size="small" 
          color={data.source === 'IEX Cloud' ? 'secondary' : 'primary'}
        />
      </Box>
      <Typography variant="body1" paragraph>
        {data.Description}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2">Industry</Typography>
          <Typography variant="body2" paragraph>{data.Industry}</Typography>
          
          <Typography variant="subtitle2">Sector</Typography>
          <Typography variant="body2" paragraph>{data.Sector}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2">Exchange</Typography>
          <Typography variant="body2" paragraph>{data.Exchange}</Typography>
          
          <Typography variant="subtitle2">Market Cap</Typography>
          <Typography variant="body2" paragraph>
            ${parseFloat(data.MarketCapitalization).toLocaleString()}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

const Analysis = () => {
  const [symbol, setSymbol] = useState('');
  const [searchSymbol, setSearchSymbol] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['companyOverview', searchSymbol],
    queryFn: () => stockApi.getCompanyOverview(searchSymbol),
    enabled: !!searchSymbol,
    staleTime: 300000, // Cache for 5 minutes
    retry: false, // Don't retry on failure
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!symbol) return;
    setSearchSymbol(symbol.toUpperCase());
  };

  // Check if we hit the rate limit
  const isRateLimit = error?.message?.includes('API call frequency') || 
                     data?.Note?.includes('API call frequency') ||
                     data?.Information?.includes('API key');

  // Calculate percentiles and colors for metrics
  const getMetricPercentile = (value, metric) => {
    // This is a simplified percentile calculation
    // In a real app, you'd want to compare against industry averages
    let percentile;
    const numValue = parseFloat(value);

    // Reverse percentile for ratios where lower is better
    if (['PERatio', 'PEGRatio', 'PriceToBookRatio', 'PriceToSalesRatioTTM'].includes(metric)) {
      percentile = Math.max(0, Math.min(100, (1 - (numValue / 100)) * 100));
    } else {
      percentile = Math.max(0, Math.min(100, numValue));
    }

    return {
      value: percentile.toFixed(0),
      color: getPercentileColor(percentile),
    };
  };

  const getPercentileColor = (percentile) => {
    if (percentile >= 75) return '#2196f3'; // Blue for excellent
    if (percentile >= 50) return '#4caf50'; // Green for good
    if (percentile >= 25) return '#ff9800'; // Orange for average
    return '#f44336'; // Red for poor
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Company Analysis
      </Typography>

      <Paper component="form" onSubmit={handleSearch} sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Enter Stock Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="e.g., AAPL"
            variant="outlined"
            size="small"
          />
          <Button 
            type="submit" 
            variant="contained" 
            disabled={!symbol || isLoading}
            sx={{ minWidth: '120px' }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>
      </Paper>

      {isRateLimit && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            API Rate Limit Reached
          </Typography>
          <Typography variant="body2">
            We've hit the Alpha Vantage API rate limit (25 requests per day for free tier).
            To continue using the app, you can:
          </Typography>
          <ul style={{ marginTop: 8, marginBottom: 8 }}>
            <li>Wait for the rate limit to reset (usually 24 hours)</li>
            <li>Use a premium API key with higher limits</li>
          </ul>
        </Alert>
      )}

      {error && !isRateLimit && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Error loading company data: {error.message}
        </Alert>
      )}

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {data && !error && !data.Note && !data.Information && (
        <>
          <CompanyProfile data={data} />
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Key Metrics Percentiles
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {METRICS.map((metric) => {
                const { value, color } = getMetricPercentile(data[metric.key], metric.key);
                return (
                  <PercentileBubble
                    key={metric.key}
                    value={value}
                    label={metric.label}
                    description={metric.description}
                    color={color}
                  />
                );
              })}
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default Analysis; 