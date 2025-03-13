import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Link,
  Chip,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import stockApi from '../services/stockApi';

const NewsCard = ({ article }) => {
  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          p: 2,
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease-in-out',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            <Typography variant="h6">{article.title}</Typography>
          </Link>
          
          <Typography variant="body2" color="text.secondary">
            {article.summary}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            {article.ticker_sentiment && article.ticker_sentiment.map((ticker, index) => (
              <Chip
                key={index}
                label={`${ticker.ticker}: ${ticker.sentiment_score.toFixed(2)}`}
                size="small"
                color={ticker.sentiment_score > 0 ? 'success' : 'error'}
              />
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {new Date(article.time_published).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Source: {article.source}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

const NewsSection = ({ symbols }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['news', symbols.join(',')],
    queryFn: () => stockApi.getNews(symbols),
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Error loading news: {error.message}
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const articles = data?.feed || [];

  if (articles.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 4 }}>
        No news articles available at the moment.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Latest News
      </Typography>
      <Grid container spacing={2}>
        {articles.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </Grid>
    </Box>
  );
};

export default NewsSection; 