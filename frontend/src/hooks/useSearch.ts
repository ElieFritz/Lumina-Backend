import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface UseSearchOptions {
  searchQuery: string;
  location: string;
  category?: string;
  date?: string;
  priceRange?: string;
  sortBy?: string;
}

export function useSearch(initialData: any[], filterFn: (data: any[], filters: any) => any[]) {
  const searchParams = useSearchParams();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [location, setLocation] = useState(searchParams?.get('location') || '');
  const [category, setCategory] = useState(searchParams?.get('category') || '');
  const [date, setDate] = useState(searchParams?.get('date') || '');
  const [priceRange, setPriceRange] = useState(searchParams?.get('price') || '');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filtrer les données selon les critères de recherche
      const filteredData = filterFn(initialData, {
        searchQuery,
        location,
        category,
        date,
        priceRange,
        sortBy
      });
      
      setData(filteredData);
      setLoading(false);
    };

    fetchData();
  }, [searchQuery, location, category, date, priceRange, sortBy, initialData, filterFn]);

  const handleSearchChange = (field: string, value: string) => {
    switch (field) {
      case 'search':
        setSearchQuery(value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'category':
        setCategory(value);
        break;
      case 'date':
        setDate(value);
        break;
      case 'price':
        setPriceRange(value);
        break;
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    if (category) params.set('category', category);
    if (date) params.set('date', date);
    if (priceRange) params.set('price', priceRange);
    
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setCategory('');
    setDate('');
    setPriceRange('');
  };

  return {
    data,
    loading,
    searchQuery,
    location,
    category,
    date,
    priceRange,
    sortBy,
    setSortBy,
    handleSearchChange,
    handleSearch,
    handleClearFilters
  };
}
