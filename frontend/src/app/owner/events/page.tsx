'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as ClockIconSolid
} from '@heroicons/react/24/outline';

interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  address: string;
  price: number;
  capacity: number;
  currentBookings: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  category: string;
  images: string[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Soirée Jazz au Rooftop',
          description: 'Une soirée inoubliable avec les meilleurs musiciens de jazz d\'Abidjan. Ambiance chaleureuse et vue panoramique sur la ville.',
          eventDate: '2024-01-20',
          startTime: '19:30',
          endTime: '23:00',
          venue: 'Le Rooftop Abidjan',
          address: '123 Avenue Franchet d\'Esperey, Abidjan',
          price: 25000,
          capacity: 120,
          currentBookings: 45,
          status: 'published',
          category: 'musique',
          images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'],
          averageRating: 4.5,
          totalReviews: 23,
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          title: 'Déjeuner d\'affaires',
          description: 'Menu spécial business avec des plats raffinés dans un cadre professionnel.',
          eventDate: '2024-01-18',
          startTime: '12:00',
          endTime: '14:00',
          venue: 'Restaurant Le Bistrot',
          address: '456 Boulevard de la République, Abidjan',
          price: 15000,
          capacity: 50,
          currentBookings: 12,
          status: 'published',
          category: 'restaurant',
          images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
          averageRating: 4.2,
          totalReviews: 8,
          createdAt: '2024-01-12T00:00:00Z',
          updatedAt: '2024-01-14T00:00:00Z'
        },
        {
          id: '3',
          title: 'Anniversaire Fatou',
          description: 'Célébration privée avec musique live et menu personnalisé.',
          eventDate: '2024-01-22',
          startTime: '21:00',
          endTime: '02:00',
          venue: 'Club Le VIP',
          address: '789 Rue des Jardins, Abidjan',
          price: 35000,
          capacity: 80,
          currentBookings: 6,
          status: 'published',
          category: 'privé',
          images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'],
          averageRating: 0,
          totalReviews: 0,
          createdAt: '2024-01-14T00:00:00Z',
          updatedAt: '2024-01-14T00:00:00Z'
        },
        {
          id: '4',
          title: 'Soirée Hip-Hop',
          description: 'Concert de hip-hop avec les artistes locaux les plus talentueux.',
          eventDate: '2024-01-19',
          startTime: '22:00',
          endTime: '04:00',
          venue: 'Théâtre National',
          address: '321 Avenue de la Paix, Abidjan',
          price: 20000,
          capacity: 200,
          currentBookings: 0,
          status: 'cancelled',
          category: 'musique',
          images: ['https://images.unsplash.com/photo-1571266022943-4f6767a3d179?w=800'],
          averageRating: 0,
          totalReviews: 0,
          createdAt: '2024-01-13T00:00:00Z',
          updatedAt: '2024-01-13T00:00:00Z'
        },
        {
          id: '5',
          title: 'Pièce de théâtre',
          description: 'Représentation de la pièce "Les Noces" de Tchicaya U Tam\'si.',
          eventDate: '2024-01-25',
          startTime: '19:00',
          endTime: '21:30',
          venue: 'Théâtre National',
          address: '321 Avenue de la Paix, Abidjan',
          price: 15000,
          capacity: 150,
          currentBookings: 2,
          status: 'draft',
          category: 'théâtre',
          images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'],
          averageRating: 0,
          totalReviews: 0,
          createdAt: '2024-01-12T00:00:00Z',
          updatedAt: '2024-01-12T00:00:00Z'
        }
      ];
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, statusFilter, categoryFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'gray', text: 'Brouillon', icon: PencilIcon },
      published: { color: 'green', text: 'Publié', icon: CheckCircleIcon },
      cancelled: { color: 'red', text: 'Annulé', icon: XCircleIcon },
      completed: { color: 'blue', text: 'Terminé', icon: ClockIconSolid },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      musique: { color: 'purple', text: 'Musique' },
      restaurant: { color: 'orange', text: 'Restaurant' },
      privé: { color: 'pink', text: 'Privé' },
      théâtre: { color: 'indigo', text: 'Théâtre' },
      sport: { color: 'green', text: 'Sport' },
      culture: { color: 'blue', text: 'Culture' },
    };

    const config = categoryConfig[category as keyof typeof categoryConfig] || { color: 'gray', text: category };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.text}
      </span>
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map(event => event.id));
    }
  };

  const handleSelectEvent = (eventId: string) => {
    setSelectedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on events:`, selectedEvents);
    // Implémenter les actions en lot
  };

  const handlePublishEvent = (eventId: string) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? { ...event, status: 'published' as const, updatedAt: new Date().toISOString() }
          : event
      )
    );
  };

  const handleCancelEvent = (eventId: string) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? { ...event, status: 'cancelled' as const, updatedAt: new Date().toISOString() }
          : event
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des événements</h1>
          <p className="mt-2 text-gray-600">
            Créez et gérez les événements de votre établissement
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="btn-outline">
            <FunnelIcon className="w-4 h-4 mr-2" />
            Exporter
          </button>
          <button className="btn-primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Créer un événement
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total événements</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Publiés</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === 'published').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Brouillons</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <UserIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Réservations</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.reduce((sum, e) => sum + e.currentBookings, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Titre, description, lieu..."
                className="input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="cancelled">Annulé</option>
              <option value="completed">Terminé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input"
            >
              <option value="all">Toutes les catégories</option>
              <option value="musique">Musique</option>
              <option value="restaurant">Restaurant</option>
              <option value="privé">Privé</option>
              <option value="théâtre">Théâtre</option>
              <option value="sport">Sport</option>
              <option value="culture">Culture</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="btn-outline w-full"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedEvents.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedEvents.length} événement(s) sélectionné(s)
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('publish')}
                className="btn-sm bg-green-600 text-white hover:bg-green-700"
              >
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Publier
              </button>
              <button
                onClick={() => handleBulkAction('cancel')}
                className="btn-sm bg-red-600 text-white hover:bg-red-700"
              >
                <XCircleIcon className="w-4 h-4 mr-1" />
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative">
              <img
                src={event.images[0] || 'https://via.placeholder.com/400x200'}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                {getStatusBadge(event.status)}
              </div>
              <div className="absolute top-4 right-4">
                {getCategoryBadge(event.category)}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarDaysIcon className="w-4 h-4 mr-2" />
                  {new Date(event.eventDate).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  {event.startTime} - {event.endTime}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  {event.venue}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                  {formatCurrency(event.price)}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {event.currentBookings}/{event.capacity} places
                </div>
              </div>

              {event.averageRating > 0 && (
                <div className="flex items-center mb-4">
                  <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium text-gray-900">{event.averageRating}/5</span>
                  <span className="text-sm text-gray-500 ml-1">({event.totalReviews} avis)</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button className="text-primary-600 hover:text-primary-900">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                {event.status === 'draft' && (
                  <button
                    onClick={() => handlePublishEvent(event.id)}
                    className="btn-sm bg-green-600 text-white hover:bg-green-700"
                  >
                    Publier
                  </button>
                )}
                {event.status === 'published' && (
                  <button
                    onClick={() => handleCancelEvent(event.id)}
                    className="btn-sm bg-red-600 text-white hover:bg-red-700"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <CalendarDaysIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement trouvé</h3>
          <p className="text-gray-500">Aucun événement ne correspond à vos critères de recherche.</p>
        </div>
      )}
    </div>
  );
}