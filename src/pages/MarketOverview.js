import React from 'react';
import { Box, Container, Grid, Paper, Typography, CircularProgress, Alert, Divider } from '@mui/material';
import { useQueries } from '@tanstack/react-query';
import stockApi from '../services/stockApi';
import NewsSection from '../components/NewsSection';

const MAJOR_INDICES = [
  { symbol: 'SPY', name: 'S&P 500' },
  { symbol: 'QQQ', name: 'NASDAQ' },
  { symbol: 'DIA', name: 'Dow Jones' },
  { symbol: 'IWM', name: 'Russell 2000' },
];

// Temporary watchlist - will be replaced with actual user data later
const TEMP_WATCHLIST = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'GOOGL', name: 'Alphabet' },
];

const MarketCard = ({ data, name }) => {
  const quote = data?.['Global Quote'];
  const hasData = quote && Object.keys(quote).length > 0;
  const isError = data?.Information || data?.Note; // Check for API limit or other issues
  
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Paper
        sx={{
          p: 3,
          textAlign: 'center',
          bgcolor: 'background.paper',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-4px)',
            transition: 'all 0.3s ease-in-out',
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        
        {hasData ? (
          <>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              ${parseFloat(quote['05. price']).toFixed(2)}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: quote['10. change percent'].startsWith('-') ? 'error.main' : 'success.main',
                fontWeight: 'bold',
              }}
            >
              {quote['10. change percent']}
            </Typography>
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                High: ${parseFloat(quote['03. high']).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Low: ${parseFloat(quote['04. low']).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Volume: {parseInt(quote['06. volume']).toLocaleString()}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                Last updated: {new Date(quote['07. latest trading day']).toLocaleDateString()}
              </Typography>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {isError ? 'API limit reached' : 'Market data unavailable'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {isError ? 'Please try again in a few minutes' : 'Market might be closed'}
            </Typography>
          </Box>
        )}
      </Paper>
    </Grid>
  );
};

const MarketOverview = () => {
  // Create queries configuration for all symbols
  const allQueries = [...MAJOR_INDICES, ...TEMP_WATCHLIST].map(item => ({
    queryKey: ['marketStatus', item.symbol],
    queryFn: () => stockApi.getGlobalMarketStatus(item.symbol),
    refetchInterval: 60000,
    retry: 3,
    staleTime: Infinity, // Keep the data forever until manually invalidated
    cacheTime: Infinity, // Never delete from cache
  }));

  // Use useQueries hook to handle multiple queries
  const results = useQueries({ queries: allQueries });

  // Get all symbols for news
  const allSymbols = [...MAJOR_INDICES, ...TEMP_WATCHLIST].map(item => item.symbol);

  // Check for loading states
  const isLoading = results.some(result => result.isLoading);
  
  // Check for errors
  const errors = results
    .map((result, index) => {
      const item = [...MAJOR_INDICES, ...TEMP_WATCHLIST][index];
      return result.error ? `${item.name}: ${result.error.message}` : null;
    })
    .filter(Boolean);

  if (errors.length > 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Error loading market data:
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Split results into indices and watchlist
  const indicesResults = results.slice(0, MAJOR_INDICES.length);
  const watchlistResults = results.slice(MAJOR_INDICES.length);

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Market Overview
        </Typography>

        {/* Major Indices Section */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Major Indices
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {indicesResults.map((result, index) => (
            <MarketCard
              key={MAJOR_INDICES[index].symbol}
              data={result.data}
              name={`${MAJOR_INDICES[index].name} (${MAJOR_INDICES[index].symbol})`}
            />
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Watchlist Section */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Your Watchlist
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {watchlistResults.map((result, index) => (
            <MarketCard
              key={TEMP_WATCHLIST[index].symbol}
              data={result.data}
              name={`${TEMP_WATCHLIST[index].name} (${TEMP_WATCHLIST[index].symbol})`}
            />
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* News Section */}
        <NewsSection symbols={allSymbols} />
      </Container>
    </Box>
  );
};

export default MarketOverview; 