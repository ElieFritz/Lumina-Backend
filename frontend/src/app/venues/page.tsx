'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchForm } from '@/components/ui/SearchForm';
import { VenueCard } from '@/components/ui/Card';
import { Grid } from '@/components/ui/Grid';
import { Venue, VenueCategory } from '@/types';

// Using Venue type from centralized types

export default function VenuesPage() {
  const searchParams = useSearchParams();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [location, setLocation] = useState(searchParams?.get('location') || '');
  const [category, setCategory] = useState(searchParams?.get('category') || '');
  const [sortBy, setSortBy] = useState('rating');

  // Categories moved to SearchForm component

  // Données mockées pour la démonstration
  const mockVenues: Venue[] = [
    {
      id: '1',
      name: 'Le Bistrot Parisien',
      description: 'Cuisine française authentique dans un cadre chaleureux',
      category: VenueCategory.RESTAURANT,
      address: 'Plateau, Abidjan',
      location: { lat: 5.3167, lng: -4.0333 },
      averageRating: 4.5,
      totalReviews: 23,
      priceRange: 15000,
      images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'],
      isActive: true,
      isVerified: true,
      owner: {
        id: '1',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@bistrot.com'
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Cinéma Cocody',
      description: 'Cinéma moderne avec les dernières sorties',
      category: VenueCategory.CINEMA,
      address: 'Cocody, Abidjan',
      location: { lat: 5.3167, lng: -4.0333 },
      averageRating: 4.2,
      totalReviews: 15,
      priceRange: 5000,
      images: ['https://images.unsplash.com/photo-1489599803001-0b0b0b0b0b0b?w=400'],
      isActive: true,
      isVerified: true,
      owner: {
        id: '2',
        firstName: 'Fritz',
        lastName: 'Enolla',
        email: 'marie@cinema.com'
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  useEffect(() => {
    // Simuler un appel API
    const fetchVenues = async () => {
      setLoading(true);
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filtrer les venues selon les critères de recherche
      let filteredVenues = mockVenues;
      
      if (searchQuery) {
        filteredVenues = filteredVenues.filter(venue =>
          venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (venue.description && venue.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      if (location) {
        filteredVenues = filteredVenues.filter(venue =>
          venue.address.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      if (category) {
        filteredVenues = filteredVenues.filter(venue => venue.category === category);
      }
      
      // Trier les résultats
      filteredVenues.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return (b.averageRating || 0) - (a.averageRating || 0);
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price':
            return (a.priceRange || 0) - (b.priceRange || 0);
          default:
            return 0;
        }
      });
      
      setVenues(filteredVenues);
      setLoading(false);
    };

    fetchVenues();
  }, [searchQuery, location, category, sortBy]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    if (category) params.set('category', category);
    
    window.history.pushState({}, '', `/venues?${params.toString()}`);
  };

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
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setCategory('');
  };

  const handleViewDetails = (id: string) => {
    // TODO: Navigate to venue details page
    console.log('View venue details:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* En-tête de recherche */}
        <SearchForm
          searchQuery={searchQuery}
          location={location}
          date=""
          priceRange=""
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          onClearFilters={handleClearFilters}
          showDateFilter={false}
          showPriceFilter={false}
          placeholder="Que recherchez-vous ?"
        />

        {/* Résultats */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {loading ? 'Recherche en cours...' : `${venues.length} établissement(s) trouvé(s)`}
          </h2>
          {searchQuery && (
            <p className="text-gray-600 mt-1">
              Résultats pour "{searchQuery}" {location && `à ${location}`}
            </p>
          )}
        </div>

        {/* Liste des venues */}
        <Grid
          loading={loading}
          emptyMessage="Aucun établissement trouvé"
          emptyIcon={<MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />}
          onClearFilters={handleClearFilters}
        >
          {venues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onViewDetails={handleViewDetails}
            />
          ))}
        </Grid>
      </main>
      
      <Footer />
    </div>
  );
}
