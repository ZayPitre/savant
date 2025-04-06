import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import stockApi from '../services/stockApi';

// Example sectors for filtering
const SECTORS = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Consumer Cyclical',
  'Industrials',
  'Communication Services',
  'Energy',
  'Consumer Defensive',
  'Basic Materials',
  'Real Estate',
  'Utilities',
];

// Predefined screener filters
const PREDEFINED_FILTERS = {
  value: {
    name: 'Value Stocks',
    description: 'Stocks with low P/E ratio, low P/B ratio, and positive earnings',
    filters: {
      peRatioMin: 0,
      peRatioMax: 15,
      pbRatioMax: 1.5,
    },
  },
  growth: {
    name: 'Growth Stocks',
    description: 'Stocks with high revenue growth and earnings growth',
    filters: {
      revenueGrowthMin: 15,
      epsGrowthMin: 15,
    },
  },
  dividend: {
    name: 'Dividend Stocks',
    description: 'Stocks with high dividend yields and strong dividend history',
    filters: {
      dividendYieldMin: 3,
    },
  },
  largeCapStable: {
    name: 'Large Cap Stable',
    description: 'Large cap stocks with stable earnings and low volatility',
    filters: {
      marketCapMin: 10000000000,
      beta: [0, 1],
    },
  },
};

// Sample data for demonstration (in a real app, this would come from the API)
const SAMPLE_RESULTS = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    price: 175.43,
    marketCap: 2800000000000,
    peRatio: 28.7,
    pbRatio: 45.6,
    revenueGrowth: 8.1,
    epsGrowth: 9.2,
    dividendYield: 0.5,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    sector: 'Technology',
    price: 340.12,
    marketCap: 2500000000000,
    peRatio: 32.4,
    pbRatio: 15.2,
    revenueGrowth: 12.3,
    epsGrowth: 14.1,
    dividendYield: 0.8,
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    sector: 'Financial Services',
    price: 152.76,
    marketCap: 450000000000,
    peRatio: 12.1,
    pbRatio: 1.8,
    revenueGrowth: 5.2,
    epsGrowth: 7.3,
    dividendYield: 2.5,
  },
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    sector: 'Healthcare',
    price: 160.21,
    marketCap: 420000000000,
    peRatio: 16.8,
    pbRatio: 5.1,
    revenueGrowth: 3.2,
    epsGrowth: 4.5,
    dividendYield: 2.7,
  },
  {
    symbol: 'PG',
    name: 'Procter & Gamble Co.',
    sector: 'Consumer Defensive',
    price: 145.34,
    marketCap: 350000000000,
    peRatio: 24.3,
    pbRatio: 7.2,
    revenueGrowth: 2.1,
    epsGrowth: 3.5,
    dividendYield: 2.4,
  },
];

const Screener = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeFilter, setActiveFilter] = useState(null);
  const [filters, setFilters] = useState({
    sectors: [],
    peRatioMin: 0,
    peRatioMax: 100,
    pbRatioMin: 0,
    pbRatioMax: 50,
    marketCapMin: 0,
    marketCapMax: 3000000000000, // 3 trillion
    dividendYieldMin: 0,
    dividendYieldMax: 10,
  });

  // In a real app, we would fetch data based on filters
  // For now, we'll just use sample data
  const { data, isLoading, error } = useQuery({
    queryKey: ['screenedStocks', filters],
    queryFn: () => {
      // This would call an API with the filters
      // For demo purposes, return sample data after a delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            results: SAMPLE_RESULTS.filter(stock => {
              if (filters.sectors.length > 0 && !filters.sectors.includes(stock.sector)) {
                return false;
              }
              if (stock.peRatio < filters.peRatioMin || stock.peRatio > filters.peRatioMax) {
                return false;
              }
              if (stock.pbRatio < filters.pbRatioMin || stock.pbRatio > filters.pbRatioMax) {
                return false;
              }
              if (stock.marketCap < filters.marketCapMin || stock.marketCap > filters.marketCapMax) {
                return false;
              }
              if (stock.dividendYield < filters.dividendYieldMin || stock.dividendYield > filters.dividendYieldMax) {
                return false;
              }
              return true;
            }),
            total: SAMPLE_RESULTS.length,
          });
        }, 500);
      });
    },
    staleTime: 60000, // 1 minute
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSectorChange = (event) => {
    setFilters({
      ...filters,
      sectors: event.target.value,
    });
  };

  const handleApplyPredefinedFilter = (filterKey) => {
    const predefinedFilter = PREDEFINED_FILTERS[filterKey];
    setActiveFilter(filterKey);
    setFilters({
      ...filters,
      ...predefinedFilter.filters,
    });
  };

  const handleResetFilters = () => {
    setActiveFilter(null);
    setFilters({
      sectors: [],
      peRatioMin: 0,
      peRatioMax: 100,
      pbRatioMin: 0,
      pbRatioMax: 50,
      marketCapMin: 0,
      marketCapMax: 3000000000000,
      dividendYieldMin: 0,
      dividendYieldMax: 10,
    });
  };

  const handleStockSelect = (symbol) => {
    navigate(`/analysis?symbol=${symbol}`);
  };

  const formatMarketCap = (value) => {
    if (value >= 1000000000000) {
      return `$${(value / 1000000000000).toFixed(1)}T`;
    } else if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${value}`;
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Stock Screener
      </Typography>

      {/* Predefined Filter Chips */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Object.entries(PREDEFINED_FILTERS).map(([key, filter]) => (
          <Chip
            key={key}
            label={filter.name}
            onClick={() => handleApplyPredefinedFilter(key)}
            color={activeFilter === key ? 'primary' : 'default'}
            variant={activeFilter === key ? 'filled' : 'outlined'}
            sx={{ m: 0.5 }}
          />
        ))}
        <Chip 
          label="Reset Filters" 
          onClick={handleResetFilters} 
          variant="outlined" 
          color="secondary" 
          sx={{ m: 0.5 }}
        />
      </Box>

      {/* Filter Controls */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Sectors</InputLabel>
              <Select
                multiple
                value={filters.sectors}
                onChange={handleSectorChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {SECTORS.map((sector) => (
                  <MenuItem key={sector} value={sector}>
                    {sector}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Market Cap Range</Typography>
            <Slider
              value={[filters.marketCapMin, filters.marketCapMax]}
              onChange={(e, newValue) => setFilters({
                ...filters,
                marketCapMin: newValue[0],
                marketCapMax: newValue[1]
              })}
              valueLabelFormat={formatMarketCap}
              valueLabelDisplay="auto"
              min={0}
              max={3000000000000}
              step={100000000}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">$0</Typography>
              <Typography variant="caption">$3T</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography gutterBottom>P/E Ratio Range</Typography>
            <Slider
              value={[filters.peRatioMin, filters.peRatioMax]}
              onChange={(e, newValue) => setFilters({
                ...filters,
                peRatioMin: newValue[0],
                peRatioMax: newValue[1]
              })}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">0</Typography>
              <Typography variant="caption">100</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography gutterBottom>P/B Ratio Range</Typography>
            <Slider
              value={[filters.pbRatioMin, filters.pbRatioMax]}
              onChange={(e, newValue) => setFilters({
                ...filters,
                pbRatioMin: newValue[0],
                pbRatioMax: newValue[1]
              })}
              valueLabelDisplay="auto"
              min={0}
              max={50}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">0</Typography>
              <Typography variant="caption">50</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Dividend Yield Range (%)</Typography>
            <Slider
              value={[filters.dividendYieldMin, filters.dividendYieldMax]}
              onChange={(e, newValue) => setFilters({
                ...filters,
                dividendYieldMin: newValue[0],
                dividendYieldMax: newValue[1]
              })}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.1}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">0%</Typography>
              <Typography variant="caption">10%</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Table */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Results
        </Typography>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            Error loading results: {error.message}
          </Alert>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Sector</TableCell>
                    <TableCell align="right">Price ($)</TableCell>
                    <TableCell align="right">Market Cap</TableCell>
                    <TableCell align="right">P/E</TableCell>
                    <TableCell align="right">P/B</TableCell>
                    <TableCell align="right">Rev Growth (%)</TableCell>
                    <TableCell align="right">EPS Growth (%)</TableCell>
                    <TableCell align="right">Dividend (%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.results
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((stock) => (
                      <TableRow 
                        key={stock.symbol}
                        hover
                        onClick={() => handleStockSelect(stock.symbol)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell component="th" scope="row">
                          <Typography sx={{ fontWeight: 'bold' }}>{stock.symbol}</Typography>
                        </TableCell>
                        <TableCell>{stock.name}</TableCell>
                        <TableCell>{stock.sector}</TableCell>
                        <TableCell align="right">{stock.price.toFixed(2)}</TableCell>
                        <TableCell align="right">{formatMarketCap(stock.marketCap)}</TableCell>
                        <TableCell align="right">{stock.peRatio.toFixed(1)}</TableCell>
                        <TableCell align="right">{stock.pbRatio.toFixed(1)}</TableCell>
                        <TableCell align="right">{stock.revenueGrowth.toFixed(1)}%</TableCell>
                        <TableCell align="right">{stock.epsGrowth.toFixed(1)}%</TableCell>
                        <TableCell align="right">{stock.dividendYield.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data?.total || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Screener; 