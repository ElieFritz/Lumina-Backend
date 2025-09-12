'use client';

import { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Venue {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  rating: number;
  reviewCount: number;
  status: 'active' | 'pending' | 'inactive' | 'rejected';
  isVerified: boolean;
  createdAt: string;
  owner: {
    name: string;
    email: string;
  };
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setVenues([
        {
          id: '1',
          name: 'Restaurant Le Baobab',
          category: 'restaurant',
          address: '123 Avenue de la République',
          city: 'Abidjan',
          rating: 4.5,
          reviewCount: 127,
          status: 'active',
          isVerified: true,
          createdAt: '2024-01-10',
          owner: { name: 'Marie Koné', email: 'marie.kone@example.com' },
        },
        {
          id: '2',
          name: 'Cinéma Canal Olympia',
          category: 'cinema',
          address: '456 Boulevard de la Paix',
          city: 'Abidjan',
          rating: 4.2,
          reviewCount: 89,
          status: 'pending',
          isVerified: false,
          createdAt: '2024-01-15',
          owner: { name: 'John Doe', email: 'john.doe@example.com' },
        },
        {
          id: '3',
          name: 'Lounge Sky Bar',
          category: 'lounge',
          address: '789 Rue des Cocotiers',
          city: 'Abidjan',
          rating: 4.7,
          reviewCount: 156,
          status: 'active',
          isVerified: true,
          createdAt: '2024-01-08',
          owner: { name: 'Admin User', email: 'admin@lumina.africa' },
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = venues;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.owner.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(venue => venue.status === statusFilter);
    }

    // Filtre par catégorie
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(venue => venue.category === categoryFilter);
    }

    setFilteredVenues(filtered);
  }, [venues, searchTerm, statusFilter, categoryFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'green', text: 'Actif', icon: CheckIcon },
      pending: { color: 'yellow', text: 'En attente', icon: ClockIcon },
      inactive: { color: 'gray', text: 'Inactif', icon: XMarkIcon },
      rejected: { color: 'red', text: 'Rejeté', icon: XMarkIcon },
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
      cinema: 'Cinéma',
      lounge: 'Lounge',
      bar: 'Bar',
      club: 'Club',
      theater: 'Théâtre',
    };
    return categories[category as keyof typeof categories] || category;
  };

  const handleStatusChange = (venueId: string, newStatus: string) => {
    setVenues(prev => prev.map(venue => 
      venue.id === venueId ? { ...venue, status: newStatus as any } : venue
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Lieux</h1>
          <p className="mt-2 text-gray-600">
            Gérez et validez les lieux de la plateforme
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <PlusIcon className="h-5 w-5 mr-2" />
          Créer un lieu
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
              placeholder="Rechercher un lieu..."
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
            <option value="active">Actif</option>
            <option value="pending">En attente</option>
            <option value="inactive">Inactif</option>
            <option value="rejected">Rejeté</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Toutes les catégories</option>
            <option value="restaurant">Restaurant</option>
            <option value="cinema">Cinéma</option>
            <option value="lounge">Lounge</option>
            <option value="bar">Bar</option>
            <option value="club">Club</option>
            <option value="theater">Théâtre</option>
          </select>

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-600">
            <FunnelIcon className="h-4 w-4 mr-2" />
            {filteredVenues.length} lieu{filteredVenues.length > 1 ? 'x' : ''} trouvé{filteredVenues.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Venues Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lieu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propriétaire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVenues.map((venue) => (
                <tr key={venue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {venue.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Créé le {new Date(venue.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getCategoryLabel(venue.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {venue.city}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {venue.owner.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {venue.owner.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(venue.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {venue.rating}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({venue.reviewCount} avis)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedVenue(venue);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {venue.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(venue.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(venue.id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Venue Details Modal */}
      {showModal && selectedVenue && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails du lieu
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
                    {selectedVenue.name}
                  </h4>
                  <p className="text-gray-600">{selectedVenue.address}, {selectedVenue.city}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <p className="text-sm text-gray-900">{getCategoryLabel(selectedVenue.category)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <div className="mt-1">{getStatusBadge(selectedVenue.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Note</label>
                    <p className="text-sm text-gray-900">{selectedVenue.rating}/5 ({selectedVenue.reviewCount} avis)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vérifié</label>
                    <p className="text-sm text-gray-900">{selectedVenue.isVerified ? 'Oui' : 'Non'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Propriétaire</label>
                  <p className="text-sm text-gray-900">{selectedVenue.owner.name}</p>
                  <p className="text-sm text-gray-600">{selectedVenue.owner.email}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
                {selectedVenue.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedVenue.id, 'active');
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                    >
                      Valider
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedVenue.id, 'rejected');
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                    >
                      Rejeter
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
