'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  UsersIcon,
  StarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EventStatus } from '@/types';

interface UiEvent {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  endDate?: string;
  price: number;
  maxCapacity?: number;
  currentBookings: number;
  status: EventStatus;
  images?: string[];
  tags?: string[];
  venue: {
    id: string;
    name: string;
    location: string;
    category: string;
  };
  organizer: {
    id: string;
    firstName: string;
    lastName: string;
  };
  averageRating?: number;
  totalReviews: number;
}

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<UiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [location, setLocation] = useState(searchParams?.get('location') || '');
  const [date, setDate] = useState(searchParams?.get('date') || '');
  const [priceRange, setPriceRange] = useState(searchParams?.get('price') || '');
  const [sortBy, setSortBy] = useState('date');

  // Données mockées pour la démonstration
  const mockEvents: UiEvent[] = [
    {
      id: '1',
      title: 'Concert Jazz au Rooftop',
      description: 'Soirée jazz avec des artistes locaux dans un cadre exceptionnel',
      eventDate: '2024-02-15T20:00:00Z',
      endDate: '2024-02-15T23:00:00Z',
      price: 15000,
      maxCapacity: 100,
      currentBookings: 67,
      status: EventStatus.PUBLISHED,
      images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'],
      tags: ['jazz', 'concert', 'rooftop'],
      venue: {
        id: '1',
        name: 'Le Rooftop Abidjan',
        location: 'Plateau, Abidjan',
        category: 'lounge'
      },
      organizer: {
        id: '1',
        firstName: 'Jean',
        lastName: 'Kouamé'
      },
      averageRating: 4.5,
      totalReviews: 23
    },
    {
      id: '2',
      title: 'Dîner Gastronomique',
      description: 'Menu dégustation avec des chefs étoilés',
      eventDate: '2024-02-20T19:00:00Z',
      endDate: '2024-02-20T22:00:00Z',
      price: 25000,
      maxCapacity: 50,
      currentBookings: 42,
      status: EventStatus.PUBLISHED,
      images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'],
      tags: ['gastronomie', 'dîner', 'chef'],
      venue: {
        id: '2',
        name: 'Restaurant Le Bistrot',
        location: 'Cocody, Abidjan',
        category: 'restaurant'
      },
      organizer: {
        id: '2',
        firstName: 'Marie',
        lastName: 'Diallo'
      },
      averageRating: 4.8,
      totalReviews: 15
    },
    {
      id: '3',
      title: 'Soirée Cinéma en Plein Air',
      description: 'Projection de films africains sous les étoiles',
      eventDate: '2024-02-25T19:30:00Z',
      endDate: '2024-02-25T22:30:00Z',
      price: 5000,
      maxCapacity: 200,
      currentBookings: 156,
      status: EventStatus.PUBLISHED,
      images: ['https://images.unsplash.com/photo-1489599803001-0b0b0b0b0b0b?w=400'],
      tags: ['cinéma', 'plein air', 'films africains'],
      venue: {
        id: '3',
        name: 'Parc du Cinéma',
        location: 'Marcory, Abidjan',
        category: 'cinema'
      },
      organizer: {
        id: '3',
        firstName: 'Koffi',
        lastName: 'Traoré'
      },
      averageRating: 4.3,
      totalReviews: 31
    },
    {
      id: '4',
      title: 'Workshop Cuisine Africaine',
      description: 'Apprenez à cuisiner les plats traditionnels',
      eventDate: '2024-03-01T10:00:00Z',
      endDate: '2024-03-01T16:00:00Z',
      price: 12000,
      maxCapacity: 30,
      currentBookings: 18,
      status: EventStatus.PUBLISHED,
      images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'],
      tags: ['cuisine', 'workshop', 'traditionnel'],
      venue: {
        id: '4',
        name: 'École de Cuisine',
        location: 'Riviera, Abidjan',
        category: 'restaurant'
      },
      organizer: {
        id: '4',
        firstName: 'Aïcha',
        lastName: 'Ouattara'
      },
      averageRating: 4.7,
      totalReviews: 12
    }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filtrer les événements selon les critères de recherche
      let filteredEvents = mockEvents;
      
      if (searchQuery) {
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      if (location) {
        filteredEvents = filteredEvents.filter(event =>
          event.venue.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      if (date) {
        const searchDate = new Date(date);
        filteredEvents = filteredEvents.filter(event => {
          const eventDate = new Date(event.eventDate);
          return eventDate.toDateString() === searchDate.toDateString();
        });
      }
      
      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        filteredEvents = filteredEvents.filter(event => {
          if (max) {
            return event.price >= min && event.price <= max;
          }
          return event.price >= min;
        });
      }
      
      // Trier les résultats
      filteredEvents.sort((a, b) => {
        switch (sortBy) {
          case 'date':
            return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
          case 'price':
            return a.price - b.price;
          case 'rating':
            return (b.averageRating || 0) - (a.averageRating || 0);
          case 'popularity':
            return b.currentBookings - a.currentBookings;
          default:
            return 0;
        }
      });
      
      setEvents(filteredEvents);
      setLoading(false);
    };

    fetchEvents();
  }, [searchQuery, location, date, priceRange, sortBy]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    if (date) params.set('date', date);
    if (priceRange) params.set('price', priceRange);
    
    window.history.pushState({}, '', `/events?${params.toString()}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getAvailabilityColor = (current: number, max?: number) => {
    if (!max) return 'text-gray-600';
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* En-tête de recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Découvrir les événements</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                  placeholder="Concert, dîner, workshop..."
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

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Quand ?
              </label>
              <div className="relative">
                <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Prix */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Prix
              </label>
              <select
                id="price"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tous les prix</option>
                <option value="0-5000">Gratuit - 5,000 FCFA</option>
                <option value="5000-15000">5,000 - 15,000 FCFA</option>
                <option value="15000-30000">15,000 - 30,000 FCFA</option>
                <option value="30000-">30,000+ FCFA</option>
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
                <option value="date">Date</option>
                <option value="price">Prix</option>
                <option value="rating">Note</option>
                <option value="popularity">Popularité</option>
              </select>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {loading ? 'Recherche en cours...' : `${events.length} événement(s) trouvé(s)`}
          </h2>
          {searchQuery && (
            <p className="text-gray-600 mt-1">
              Résultats pour "{searchQuery}" {location && `à ${location}`}
            </p>
          )}
        </div>

        {/* Liste des événements */}
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
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={event.images?.[0] || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium">
                      {formatPrice(event.price)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      event.status === EventStatus.PUBLISHED 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status === EventStatus.PUBLISHED ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="flex items-center text-gray-500 mb-2">
                    <CalendarDaysIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm">{formatDate(event.eventDate)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm">{event.venue.name}, {event.venue.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{event.averageRating || 'N/A'}</span>
                      <span className="text-sm text-gray-500 ml-1">({event.totalReviews})</span>
                    </div>
                    <div className={`text-sm font-medium ${getAvailabilityColor(event.currentBookings, event.maxCapacity)}`}>
                      {event.currentBookings}/{event.maxCapacity || '∞'} places
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-500 mb-4">
                    <UsersIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm">Organisé par {event.organizer.firstName} {event.organizer.lastName}</span>
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
            <CalendarDaysIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun événement trouvé</h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche ou de supprimer certains filtres.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setLocation('');
                setDate('');
                setPriceRange('');
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
