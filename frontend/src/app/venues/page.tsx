'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, MapPinIcon, StarIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { VenueCategory } from '@/types/venue';

interface Venue {
  id: string;
  name: string;
  description: string;
  category: VenueCategory;
  location: string;
  rating: number;
  priceRange: string;
  imageUrl: string;
  isOpen: boolean;
  openingHours: string;
}

export default function VenuesPage() {
  const searchParams = useSearchParams();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('rating');

  const categories = [
    { value: '', label: 'Toutes les catégories' },
    { value: VenueCategory.RESTAURANT, label: 'Restaurants' },
    { value: VenueCategory.CINEMA, label: 'Cinémas' },
    { value: VenueCategory.LOUNGE, label: 'Lounges' },
    { value: VenueCategory.CONCERT_HALL, label: 'Salles de concert' },
    { value: VenueCategory.BAR, label: 'Bars' },
    { value: VenueCategory.CLUB, label: 'Clubs' },
    { value: VenueCategory.THEATER, label: 'Théâtres' },
    { value: VenueCategory.SPORTS, label: 'Sports' },
  ];

  // Données mockées pour la démonstration
  const mockVenues: Venue[] = [
    {
      id: '1',
      name: 'Le Bistrot Parisien',
      description: 'Cuisine française authentique dans un cadre chaleureux',
      category: VenueCategory.RESTAURANT,
      location: 'Plateau, Abidjan',
      rating: 4.5,
      priceRange: '€€',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      isOpen: true,
      openingHours: '11h30 - 23h00'
    },
    {
      id: '2',
      name: 'Cinéma Cocody',
      description: 'Cinéma moderne avec les dernières sorties',
      category: VenueCategory.CINEMA,
      location: 'Cocody, Abidjan',
      rating: 4.2,
      priceRange: '€',
      imageUrl: 'https://images.unsplash.com/photo-1489599803001-0b0b0b0b0b0b?w=400',
      isOpen: true,
      openingHours: '10h00 - 23h00'
    },
    {
      id: '3',
      name: 'Lounge Bar Riviera',
      description: 'Bar lounge avec vue sur la lagune',
      category: VenueCategory.LOUNGE,
      location: 'Riviera, Abidjan',
      rating: 4.7,
      priceRange: '€€€',
      imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400',
      isOpen: true,
      openingHours: '18h00 - 02h00'
    },
    {
      id: '4',
      name: 'Salle des Fêtes Treichville',
      description: 'Salle de concert et événements',
      category: VenueCategory.CONCERT_HALL,
      location: 'Treichville, Abidjan',
      rating: 4.3,
      priceRange: '€€',
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
      isOpen: false,
      openingHours: '19h00 - 01h00'
    },
    {
      id: '5',
      name: 'Bar Sportif Marcory',
      description: 'Bar pour regarder les matchs de football',
      category: VenueCategory.BAR,
      location: 'Marcory, Abidjan',
      rating: 4.1,
      priceRange: '€',
      imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400',
      isOpen: true,
      openingHours: '16h00 - 01h00'
    },
    {
      id: '6',
      name: 'Club Nocturne Yopougon',
      description: 'Club de nuit avec DJ et piste de danse',
      category: VenueCategory.CLUB,
      location: 'Yopougon, Abidjan',
      rating: 4.4,
      priceRange: '€€',
      imageUrl: 'https://images.unsplash.com/photo-1571266028243-e68f96b1f2c0?w=400',
      isOpen: false,
      openingHours: '22h00 - 05h00'
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
          venue.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (location) {
        filteredVenues = filteredVenues.filter(venue =>
          venue.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      if (category) {
        filteredVenues = filteredVenues.filter(venue => venue.category === category);
      }
      
      // Trier les résultats
      filteredVenues.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price':
            return a.priceRange.length - b.priceRange.length;
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

  const getCategoryEmoji = (category: VenueCategory) => {
    const emojis: Record<VenueCategory, string> = {
      [VenueCategory.RESTAURANT]: '🍽️',
      [VenueCategory.CINEMA]: '🎬',
      [VenueCategory.LOUNGE]: '🍸',
      [VenueCategory.CONCERT_HALL]: '🎵',
      [VenueCategory.BAR]: '🍺',
      [VenueCategory.CLUB]: '🕺',
      [VenueCategory.THEATER]: '🎭',
      [VenueCategory.SPORTS]: '⚽',
      [VenueCategory.OTHER]: '📍',
    };
    return emojis[category] ?? '📍';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* En-tête de recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Rechercher des établissements</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Que recherchez-vous ?
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Restaurant, concert, événement..."
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Localisation */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Où ?
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ville, quartier..."
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Catégorie */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button onClick={handleSearch} className="bg-primary-600 hover:bg-primary-700">
              <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
              Rechercher
            </Button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Trier par:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="rating">Note</option>
                <option value="name">Nom</option>
                <option value="price">Prix</option>
              </select>
            </div>
          </div>
        </div>

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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : venues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div key={venue.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={venue.imageUrl}
                    alt={venue.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                      {getCategoryEmoji(venue.category)} {categories.find(c => c.value === venue.category)?.label}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      venue.isOpen 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {venue.isOpen ? 'Ouvert' : 'Fermé'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{venue.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{venue.description}</p>
                  
                  <div className="flex items-center text-gray-500 mb-4">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm">{venue.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{venue.rating}</span>
                    </div>
                    <div className="text-sm text-gray-500">{venue.priceRange}</div>
                  </div>
                  
                  <div className="flex items-center text-gray-500 mb-4">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm">{venue.openingHours}</span>
                  </div>
                  
                  <Button className="w-full bg-primary-600 hover:bg-primary-700">
                    Voir les détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun résultat trouvé</h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche ou de supprimer certains filtres.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setLocation('');
                setCategory('');
              }}
              variant="outline"
            >
              Effacer les filtres
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
