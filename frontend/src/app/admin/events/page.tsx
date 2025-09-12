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
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  venue: {
    name: string;
    city: string;
  };
  organizer: {
    name: string;
    email: string;
  };
  totalTickets: number;
  availableTickets: number;
  soldTickets: number;
  price: number;
  currency: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  isActive: boolean;
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
          title: 'Concert Youssou N\'Dour',
          description: 'Concert exceptionnel du légendaire chanteur sénégalais',
          category: 'concert',
          startDate: '2024-12-15T20:00:00',
          endDate: '2024-12-15T23:00:00',
          venue: { name: 'Restaurant Le Baobab', city: 'Abidjan' },
          organizer: { name: 'Marie Koné', email: 'marie.kone@example.com' },
          totalTickets: 100,
          availableTickets: 45,
          soldTickets: 55,
          price: 25000,
          currency: 'XOF',
          status: 'published',
          isActive: true,
          createdAt: '2024-01-10',
        },
        {
          id: '2',
          title: 'Avant-première Black Panther 3',
          description: 'Projection en avant-première du nouveau film Marvel',
          category: 'cinema',
          startDate: '2024-12-20T19:30:00',
          endDate: '2024-12-20T22:00:00',
          venue: { name: 'Cinéma Canal Olympia', city: 'Abidjan' },
          organizer: { name: 'John Doe', email: 'john.doe@example.com' },
          totalTickets: 150,
          availableTickets: 120,
          soldTickets: 30,
          price: 5000,
          currency: 'XOF',
          status: 'draft',
          isActive: false,
          createdAt: '2024-01-15',
        },
        {
          id: '3',
          title: 'Soirée Jazz au Lounge',
          description: 'Soirée jazz avec groupe local et cocktails signature',
          category: 'lounge',
          startDate: '2024-12-18T21:00:00',
          endDate: '2024-12-18T01:00:00',
          venue: { name: 'Lounge Sky Bar', city: 'Abidjan' },
          organizer: { name: 'Admin User', email: 'admin@lumina.africa' },
          totalTickets: 50,
          availableTickets: 25,
          soldTickets: 25,
          price: 15000,
          currency: 'XOF',
          status: 'published',
          isActive: true,
          createdAt: '2024-01-08',
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
        event.venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      concert: 'Concert',
      cinema: 'Cinéma',
      lounge: 'Lounge',
      theater: 'Théâtre',
      sport: 'Sport',
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Événements</h1>
          <p className="mt-2 text-gray-600">
            Gérez et publiez les événements de la plateforme
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
            <option value="concert">Concert</option>
            <option value="cinema">Cinéma</option>
            <option value="lounge">Lounge</option>
            <option value="theater">Théâtre</option>
            <option value="sport">Sport</option>
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

      {/* Events Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Événement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lieu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {event.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getCategoryLabel(event.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(event.startDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.venue.name}
                    <div className="text-xs text-gray-500">{event.venue.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {event.organizer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.organizer.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{event.soldTickets}/{event.totalTickets}</div>
                      <div className="text-xs text-gray-500">
                        {event.availableTickets} disponibles
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(event.price, event.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(event.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                    <label className="block text-sm font-medium text-gray-700">Lieu</label>
                    <p className="text-sm text-gray-900">{selectedEvent.venue.name}</p>
                    <p className="text-sm text-gray-600">{selectedEvent.venue.city}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prix</label>
                    <p className="text-sm text-gray-900">{formatPrice(selectedEvent.price, selectedEvent.currency)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Billets totaux</label>
                    <p className="text-sm text-gray-900">{selectedEvent.totalTickets}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vendus</label>
                    <p className="text-sm text-gray-900">{selectedEvent.soldTickets}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Disponibles</label>
                    <p className="text-sm text-gray-900">{selectedEvent.availableTickets}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Organisateur</label>
                  <p className="text-sm text-gray-900">{selectedEvent.organizer.name}</p>
                  <p className="text-sm text-gray-600">{selectedEvent.organizer.email}</p>
                </div>
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
