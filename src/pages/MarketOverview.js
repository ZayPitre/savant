import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  CircularProgress, 
  Alert, 
  Divider,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Snackbar,
} from '@mui/material';
import { useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import stockApi from '../services/stockApi';
import NewsSection from '../components/NewsSection';

const MAJOR_INDICES = [
  { symbol: 'SPY', name: 'S&P 500' },
  { symbol: 'QQQ', name: 'NASDAQ' },
  { symbol: 'DIA', name: 'Dow Jones' },
  { symbol: 'IWM', name: 'Russell 2000' },
];

// Default watchlist if none saved in localStorage
const DEFAULT_WATCHLIST = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'GOOGL', name: 'Alphabet' },
];

const MarketCard = ({ data, name, onViewDetails, onRemove, isWatchlist }) => {
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {name}
          </Typography>
          {isWatchlist && (
            <IconButton size="small" color="error" onClick={onRemove}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
        
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
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<InfoIcon />}
          onClick={onViewDetails}
          sx={{ mt: 2 }}
        >
          View Details
        </Button>
      </Paper>
    </Grid>
  );
};

const MarketOverview = () => {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [newName, setNewName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    } else {
      setWatchlist(DEFAULT_WATCHLIST);
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (watchlist.length > 0) {
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist]);

  // Create queries configuration for all symbols
  const allItems = [...MAJOR_INDICES, ...watchlist];
  const allQueries = allItems.map(item => ({
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
  const allSymbols = allItems.map(item => item.symbol);

  // Check for loading states
  const isLoading = results.some(result => result.isLoading);
  
  // Check for errors
  const errors = results
    .map((result, index) => {
      const item = allItems[index];
      return result.error ? `${item.name}: ${result.error.message}` : null;
    })
    .filter(Boolean);

  // Split results into indices and watchlist
  const indicesResults = results.slice(0, MAJOR_INDICES.length);
  const watchlistResults = results.slice(MAJOR_INDICES.length);

  const handleAddToWatchlist = () => {
    // Basic validation
    if (!newSymbol.trim()) {
      setSnackbarMessage('Please enter a valid symbol');
      setSnackbarOpen(true);
      return;
    }

    const symbolUpper = newSymbol.toUpperCase();
    
    // Check for duplicates
    if (watchlist.some(item => item.symbol === symbolUpper)) {
      setSnackbarMessage(`${symbolUpper} is already in your watchlist`);
      setSnackbarOpen(true);
      return;
    }

    // Add to watchlist
    const newItem = {
      symbol: symbolUpper,
      name: newName.trim() || symbolUpper, // Use symbol as name if none provided
    };

    setWatchlist(prev => [...prev, newItem]);
    setDialogOpen(false);
    setNewSymbol('');
    setNewName('');
    setSnackbarMessage(`Added ${symbolUpper} to your watchlist`);
    setSnackbarOpen(true);
  };

  const handleRemoveFromWatchlist = (symbol) => {
    setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
    setSnackbarMessage(`Removed ${symbol} from your watchlist`);
    setSnackbarOpen(true);
  };

  const handleViewDetails = (symbol) => {
    navigate(`/analysis?symbol=${symbol}`);
  };

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
              onViewDetails={() => handleViewDetails(MAJOR_INDICES[index].symbol)}
              isWatchlist={false}
            />
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Watchlist Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
            Your Watchlist
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Add Stock
          </Button>
        </Box>
        
        {watchlist.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            Your watchlist is empty. Add stocks to track them here.
          </Alert>
        ) : (
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {watchlistResults.map((result, index) => {
              const stockIndex = index < watchlist.length ? index : 0;
              return (
                <MarketCard
                  key={watchlist[stockIndex].symbol}
                  data={result.data}
                  name={`${watchlist[stockIndex].name} (${watchlist[stockIndex].symbol})`}
                  onViewDetails={() => handleViewDetails(watchlist[stockIndex].symbol)}
                  onRemove={() => handleRemoveFromWatchlist(watchlist[stockIndex].symbol)}
                  isWatchlist={true}
                />
              );
            })}
          </Grid>
        )}

        <Divider sx={{ my: 4 }} />

        {/* News Section */}
        <NewsSection symbols={allSymbols} />

        {/* Add to Watchlist Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Add to Watchlist</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Stock Symbol"
              fullWidth
              variant="outlined"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="e.g., AAPL"
              helperText="Required. Enter the stock ticker symbol."
            />
            <TextField
              margin="dense"
              label="Display Name (Optional)"
              fullWidth
              variant="outlined"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Apple Inc."
              helperText="Optional. Enter a name to display for this stock."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddToWatchlist} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Container>
    </Box>
  );
};

export default MarketOverview; 