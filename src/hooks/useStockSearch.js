import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import stockApi from '../services/stockApi';

export const useStockSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['stockSearch', searchTerm],
    queryFn: () => stockApi.searchStocks(searchTerm),
    enabled: searchTerm.length >= 2, // Only search when there are at least 2 characters
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return {
    searchTerm,
    searchResults: searchResults?.bestMatches || [],
    isLoading,
    error,
    handleSearch,
  };
};

export default useStockSearch; 