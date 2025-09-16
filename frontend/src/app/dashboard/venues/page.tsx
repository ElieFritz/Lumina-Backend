'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  BuildingOfficeIcon,
  MapPinIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CalendarDaysIcon,
  UsersIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/auth';

interface Venue {
  id: number;
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  status: 'active' | 'inactive' | 'pending';
  isVerified: boolean;
  isFeatured: boolean;
  capacity: number;
  averagePrice: number;
  currency: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export default function VenuesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Vérifier si l'utilisateur est un propriétaire de lieu ou organisateur
    if (user?.role !== UserRole.VENUE_OWNER && user?.role !== UserRole.ORGANIZER) {
      router.push('/dashboard');
      return;
    }

    fetchVenues();
  }, [isAuthenticated, user, router]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      // Simuler des données de lieux pour le propriétaire
      const mockVenues: Venue[] = [
        {
          id: 1,
          name: 'Restaurant Le Baobab',
          description: 'Cuisine africaine authentique dans un cadre chaleureux',
          category: 'restaurant',
          address: '123 Avenue de la République',
          city: 'Abidjan',
          country: 'Côte d\'Ivoire',
          rating: 4.5,
          reviewCount: 127,
          priceRange: '€€',
          status: 'active',
          isVerified: true,
          isFeatured: true,
          capacity: 80,
          averagePrice: 15000,
          currency: 'XOF',
          images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-12-01T15:30:00Z'
        },
        {
          id: 2,
          name: 'Cinéma Canal Olympia',
          description: 'Cinéma moderne avec les dernières sorties',
          category: 'cinema',
          address: '456 Boulevard de la Paix',
          city: 'Abidjan',
          country: 'Côte d\'Ivoire',
          rating: 4.2,
          reviewCount: 89,
          priceRange: '€€',
          status: 'active',
          isVerified: true,
          isFeatured: true,
          capacity: 200,
          averagePrice: 5000,
          currency: 'XOF',
          images: ['https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=500'],
          createdAt: '2024-02-20T14:00:00Z',
          updatedAt: '2024-11-28T09:15:00Z'
        },
        {
          id: 3,
          name: 'Lounge Sky Bar',
          description: 'Bar panoramique avec vue sur la ville',
          category: 'lounge',
          address: '789 Rue des Cocotiers',
          city: 'Abidjan',
          country: 'Côte d\'Ivoire',
          rating: 4.7,
          reviewCount: 156,
          priceRange: '€€€',
          status: 'active',
          isVerified: true,
          isFeatured: true,
          capacity: 50,
          averagePrice: 25000,
          currency: 'XOF',
          images: ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500'],
          createdAt: '2024-03-10T16:30:00Z',
          updatedAt: '2024-12-05T11:45:00Z'
        }
      ];

      setVenues(mockVenues);
    } catch (error) {
      console.error('Erreur lors du chargement des lieux:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVenues = venues.filter(venue => {
    if (filter === 'all') return true;
    return venue.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'restaurant':
        return 'Restaurant';
      case 'cinema':
        return 'Cinéma';
      case 'lounge':
        return 'Lounge/Bar';
      case 'hotel':
        return 'Hôtel';
      case 'event_space':
        return 'Espace événementiel';
      default:
        return category;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600">Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container-custom py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Mes Établissements
            </h1>
            <p className="text-gray-600">
              Gérez vos lieux et établissements sur Lumina Africa
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/venues/create')}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Ajouter un lieu
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total des lieux</p>
                <p className="text-2xl font-bold text-gray-900">{venues.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {venues.filter(v => v.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <StarIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Note moyenne</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(venues.reduce((acc, v) => acc + v.rating, 0) / venues.length || 0).toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <UsersIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total avis</p>
                <p className="text-2xl font-bold text-gray-900">
                  {venues.reduce((acc, v) => acc + v.reviewCount, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous ({venues.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Actifs ({venues.filter(v => v.status === 'active').length})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'inactive'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inactifs ({venues.filter(v => v.status === 'inactive').length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En attente ({venues.filter(v => v.status === 'pending').length})
            </button>
          </div>
        </div>

        {/* Venues List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="card p-12 text-center">
            <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun lieu trouvé</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Vous n\'avez pas encore ajouté de lieu à votre compte.'
                : `Aucun lieu avec le statut "${getStatusText(filter)}" trouvé.`
              }
            </p>
            <button
              onClick={() => router.push('/dashboard/venues/create')}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Ajouter votre premier lieu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => (
              <div key={venue.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {venue.images && venue.images.length > 0 ? (
                    <img
                      src={venue.images[0]}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PhotoIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(venue.status)}`}>
                      {getStatusText(venue.status)}
                    </span>
                  </div>

                  {/* Verification Badge */}
                  {venue.isVerified && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-green-500 text-white p-1 rounded-full">
                        <CheckCircleIcon className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  {/* Featured Badge */}
                  {venue.isFeatured && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                        ⭐ En vedette
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {venue.name}
                    </h3>
                    <div className="flex items-center ml-2">
                      <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {venue.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {venue.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span>{venue.city}, {venue.country}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {getCategoryText(venue.category)}
                    </span>
                    <span className="flex items-center">
                      <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                      {venue.averagePrice.toLocaleString()} {venue.currency}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <UsersIcon className="w-4 h-4 mr-1" />
                      {venue.capacity} places
                    </span>
                    <span className="flex items-center">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      {venue.reviewCount} avis
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/dashboard/venues/${venue.id}`)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      Voir
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/venues/${venue.id}/edit`)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Modifier
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/venues/${venue.id}/events`)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                    >
                      <CalendarDaysIcon className="w-4 h-4 mr-1" />
                      Événements
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
