'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { Venue } from '@/types/venue';
import { apiService, Venue as ApiVenue } from '@/services/api';

// Mock data - will be replaced with real API calls
const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Le Rooftop Abidjan',
    description: 'Un rooftop exceptionnel avec vue sur la lagune',
    category: 'lounge' as any,
    address: 'Cocody, Riviera 2, Abidjan',
    location: { lat: 5.3599, lng: -4.0083 },
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    phone: '+2250701234567',
    email: 'contact@rooftop.ci',
    website: 'https://rooftop.ci',
    images: ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500'],
    averageRating: 4.8,
    totalReviews: 127,
    priceRange: 15000,
    capacity: 200,
    isActive: true,
    isVerified: true,
    owner: {
      id: '1',
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@rooftop.ci'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Cinéma Pathé Cocody',
    description: 'Cinéma moderne avec les dernières technologies',
    category: 'cinema' as any,
    address: 'Cocody, Angré 8ème Tranche, Abidjan',
    location: { lat: 5.3600, lng: -4.0080 },
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    phone: '+2250701234568',
    images: ['https://images.unsplash.com/photo-1489599808421-5b2b3b3b3b3b?w=500'],
    averageRating: 4.5,
    totalReviews: 89,
    priceRange: 5000,
    capacity: 300,
    isActive: true,
    isVerified: true,
    owner: {
      id: '2',
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie@pathe.ci'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Restaurant Le Bistrot',
    description: 'Cuisine française raffinée au cœur d\'Abidjan',
    category: 'restaurant' as any,
    address: 'Plateau, Boulevard de la République, Abidjan',
    location: { lat: 5.3200, lng: -4.0200 },
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    phone: '+2250701234569',
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'],
    averageRating: 4.7,
    totalReviews: 156,
    priceRange: 25000,
    capacity: 80,
    isActive: true,
    isVerified: true,
    owner: {
      id: '3',
      firstName: 'Pierre',
      lastName: 'Durand',
      email: 'pierre@bistrot.ci'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export function FeaturedVenues() {
  const [venues, setVenues] = useState<ApiVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await apiService.getVenues();
        setVenues(response.data);
      } catch (err) {
        console.error('Error fetching venues:', err);
        setError('Erreur lors du chargement des établissements');
        // Fallback to mock data
        setVenues(mockVenues.map(v => ({
          id: parseInt(v.id),
          name: v.name,
          description: v.description || '',
          category: v.category,
          location: {
            address: v.address,
            city: v.city || '',
            coordinates: v.location
          },
          rating: v.averageRating || 0,
          priceRange: `€${v.priceRange ? Math.floor(v.priceRange / 10000) : 1}`,
          images: v.images || [],
          isOpen: v.isActive,
          openingHours: 'Ouvert'
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      restaurant: 'Restaurant',
      cinema: 'Cinéma',
      lounge: 'Lounge',
      concert_hall: 'Salle de concert',
      bar: 'Bar',
      club: 'Club',
      theater: 'Théâtre',
      sports: 'Sport',
      other: 'Autre'
    };
    return labels[category] || 'Autre';
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      restaurant: '🍽️',
      cinema: '🎬',
      lounge: '🍸',
      concert_hall: '🎵',
      bar: '🍺',
      club: '🕺',
      theater: '🎭',
      sports: '⚽',
      other: '📍'
    };
    return emojis[category] || '📍';
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Établissements en vedette
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les meilleurs endroits recommandés par notre communauté
          </p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600">Chargement des établissements...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((venue) => (
            <Link
              key={venue.id}
              href={`/venues/${venue.id}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={venue.images?.[0] || 'https://via.placeholder.com/400x250'}
                  alt={venue.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {getCategoryEmoji(venue.category)} {getCategoryLabel(venue.category)}
                  </span>
                </div>
                {venue.isVerified && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white p-1 rounded-full">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {venue.name}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {venue.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  <span>{venue.location.city}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(venue.averageRating || 0)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {venue.rating?.toFixed(1)} (0 avis)
                    </span>
                  </div>
                  
                  <div className="text-sm font-medium text-primary-600">
                    {venue.priceRange}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/venues">
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200">
              Voir tous les établissements
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

