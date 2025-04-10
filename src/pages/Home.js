import React from 'react';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useNavigate } from 'react-router-dom';

const MotionPaper = motion(Paper);

const Home = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Market Overview',
      description: 'Get real-time market insights with interactive charts and comprehensive market data.',
      path: '/market-overview'
    },
    {
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      title: 'Advanced Stock Screener',
      description: 'Filter stocks using multiple technical and fundamental indicators.',
      path: '/screener'
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      title: 'In-depth Analysis',
      description: 'Access detailed financial metrics, technical analysis, and AI-powered insights.',
      path: '/analysis'
    },
  ];

  const handleGetStarted = () => {
    navigate('/market-overview');
  };

  const handleFeatureClick = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: 4 }}>
      <Container>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Welcome to StockSavant
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
              Your intelligent companion for stock market analysis
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                onClick={() => handleFeatureClick(feature.path)}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    transition: 'transform 0.3s ease-in-out',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">{feature.description}</Typography>
              </MotionPaper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              px: 4,
              py: 2,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px rgba(33, 150, 243, 0.4)',
                transition: 'all 0.3s ease-in-out',
              },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 