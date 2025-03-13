import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: 'background.paper' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 0, 
            cursor: 'pointer',
            fontWeight: 'bold',
            color: 'primary.main'
          }}
          onClick={() => navigate('/')}
        >
          StockSavant
        </Typography>
        
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, ml: 4 }}>
          <Button color="inherit" onClick={() => navigate('/market-overview')}>
            Market Overview
          </Button>
          <Button color="inherit" onClick={() => navigate('/screener')}>
            Stock Screener
          </Button>
          <Button color="inherit" onClick={() => navigate('/analysis')}>
            Analysis
          </Button>
          <Button color="inherit" onClick={() => navigate('/watchlist')}>
            Watchlist
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit">
            <DarkModeIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 