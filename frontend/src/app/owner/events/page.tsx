'use client';

import { useState, useEffect } from 'react';
import { 
  CalendarDaysIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  totalTickets: number;
  availableTickets: number;
  soldTickets: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  isRecurring: boolean;
  recurrencePattern?: string;
  images: string[];
  createdAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setEvents([
        {
          id: '1',
          title: 'Soirée Jazz au Lounge',
          description: 'Soirée jazz avec groupe local et cocktails signature',
          category: 'lounge',
          startDate: '2024-12-18T21:00:00',
          endDate: '2024-12-18T01:00:00',
          price: 15000,
          currency: 'XOF',
          totalTickets: 50,
          availableTickets: 25,
          soldTickets: 25,
          status: 'published',
          isRecurring: false,
          images: ['/images/event-1.jpg'],
          createdAt: '2024-01-08',
        },
        {
          id: '2',
          title: 'Happy Hour Spécial',
          description: 'Happy hour avec 50% de réduction sur tous les cocktails',
          category: 'bar',
          startDate: '2024-12-20T17:00:00',
          endDate: '2024-12-20T19:00:00',
          price: 0,
          currency: 'XOF',
          totalTickets: 100,
          availableTickets: 80,
          soldTickets: 20,
          status: 'published',
          isRecurring: true,
          recurrencePattern: 'weekly',
          images: ['/images/event-2.jpg'],
          createdAt: '2024-01-10',
        },
        {
          id: '3',
          title: 'Dîner Romantique',
          description: 'Menu spécial pour couples avec musique d\'ambiance',
          category: 'restaurant',
          startDate: '2024-12-25T19:00:00',
          endDate: '2024-12-25T23:00:00',
          price: 25000,
          currency: 'XOF',
          totalTickets: 20,
          availableTickets: 20,
          soldTickets: 0,
          status: 'draft',
          isRecurring: false,
          images: ['/images/event-3.jpg'],
          createdAt: '2024-01-12',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Filtre par catégorie
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter, categoryFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { color: 'green', text: 'Publié', icon: CheckIcon },
      draft: { color: 'yellow', text: 'Brouillon', icon: DocumentTextIcon },
      cancelled: { color: 'red', text: 'Annulé', icon: XMarkIcon },
      completed: { color: 'gray', text: 'Terminé', icon: ClockIcon },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      restaurant: 'Restaurant',
      bar: 'Bar',
      lounge: 'Lounge',
      club: 'Club',
      concert: 'Concert',
      conference: 'Conférence',
      festival: 'Festival',
    };
    return categories[category as keyof typeof categories] || category;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Gratuit';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'XOF' ? 'XOF' : 'EUR',
    }).format(price);
  };

  const handleStatusChange = (eventId: string, newStatus: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, status: newStatus as any } : event
    ));
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Événements</h1>
          <p className="mt-2 text-gray-600">
            Gérez et organisez vos événements
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <PlusIcon className="h-5 w-5 mr-2" />
          Créer un événement
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un événement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="cancelled">Annulé</option>
            <option value="completed">Terminé</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Toutes les catégories</option>
            <option value="restaurant">Restaurant</option>
            <option value="bar">Bar</option>
            <option value="lounge">Lounge</option>
            <option value="club">Club</option>
            <option value="concert">Concert</option>
            <option value="conference">Conférence</option>
            <option value="festival">Festival</option>
          </select>

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-600">
            <FunnelIcon className="h-4 w-4 mr-2" />
            {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} trouvé{filteredEvents.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <div className="flex items-center justify-center h-48 bg-gradient-to-r from-primary-400 to-primary-600">
                <CalendarDaysIcon className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getCategoryLabel(event.category)}
                </span>
                {getStatusBadge(event.status)}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarDaysIcon className="h-4 w-4 mr-2" />
                  {formatDate(event.startDate)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                  {formatPrice(event.price, event.currency)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UsersIcon className="h-4 w-4 mr-2" />
                  {event.soldTickets}/{event.totalTickets} billets vendus
                </div>
                {event.isRecurring && (
                  <div className="flex items-center text-sm text-blue-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Événement récurrent
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  {event.status === 'draft' && (
                    <button
                      onClick={() => handleStatusChange(event.id, 'published')}
                      className="text-green-600 hover:text-green-900"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                  )}
                  {event.status === 'published' && (
                    <button
                      onClick={() => handleStatusChange(event.id, 'cancelled')}
                      className="text-red-600 hover:text-red-900"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails de l'événement
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {selectedEvent.title}
                  </h4>
                  <p className="text-gray-600 mt-1">{selectedEvent.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <p className="text-sm text-gray-900">{getCategoryLabel(selectedEvent.category)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <div className="mt-1">{getStatusBadge(selectedEvent.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de début</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedEvent.startDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedEvent.endDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prix</label>
                    <p className="text-sm text-gray-900">{formatPrice(selectedEvent.price, selectedEvent.currency)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Billets</label>
                    <p className="text-sm text-gray-900">{selectedEvent.soldTickets}/{selectedEvent.totalTickets}</p>
                  </div>
                </div>
                
                {selectedEvent.isRecurring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Récurrence</label>
                    <p className="text-sm text-gray-900">Événement récurrent - {selectedEvent.recurrencePattern}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
                {selectedEvent.status === 'draft' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedEvent.id, 'published');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Publier
                  </button>
                )}
                {selectedEvent.status === 'published' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedEvent.id, 'cancelled');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
