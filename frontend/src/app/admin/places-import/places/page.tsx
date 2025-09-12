'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

interface ImportedPlace {
  id: string;
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  website: string;
  categories: string[];
  rating: number;
  userRatingsTotal: number;
  status: 'imported' | 'claimed' | 'verified' | 'rejected' | 'pending_verification';
  source: 'google_places' | 'manual' | 'imported';
  importDate: string;
  claimDate?: string;
  claimContactEmail?: string;
  claimContactPhone?: string;
  claimJustification?: string;
  verifiedDate?: string;
  verificationNotes?: string;
  photoUrls: string[];
  openingHours?: {
    open_now: boolean;
    weekday_text: string[];
  };
}

export default function ImportedPlacesPage() {
  const [places, setPlaces] = useState<ImportedPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPlace, setSelectedPlace] = useState<ImportedPlace | null>(null);

  useEffect(() => {
    fetchPlaces();
  }, [currentPage, statusFilter, categoryFilter, searchTerm]);

  const fetchPlaces = async () => {
    setIsLoading(true);
    try {
      // Simuler des données pour la démo
      const mockPlaces: ImportedPlace[] = [
        {
          id: '1',
          placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'Restaurant Le Bistrot',
          address: '123 Avenue de la République, Abidjan, Côte d\'Ivoire',
          lat: 5.3600,
          lng: -4.0083,
          phone: '+225 20 30 40 50',
          website: 'https://lebistrot.ci',
          categories: ['restaurant', 'french'],
          rating: 4.5,
          userRatingsTotal: 127,
          status: 'verified',
          source: 'google_places',
          importDate: '2024-01-15T10:30:00Z',
          verifiedDate: '2024-01-16T14:20:00Z',
          verificationNotes: 'Vérifié par le propriétaire',
          photoUrls: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'],
          openingHours: {
            open_now: true,
            weekday_text: [
              'Lundi: 11h00 - 22h00',
              'Mardi: 11h00 - 22h00',
              'Mercredi: 11h00 - 22h00',
              'Jeudi: 11h00 - 22h00',
              'Vendredi: 11h00 - 23h00',
              'Samedi: 11h00 - 23h00',
              'Dimanche: 12h00 - 21h00'
            ]
          }
        },
        {
          id: '2',
          placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY5',
          name: 'Bar Le Sunset',
          address: '456 Boulevard de la Paix, Abidjan, Côte d\'Ivoire',
          lat: 5.3650,
          lng: -4.0120,
          phone: '+225 20 30 40 51',
          website: '',
          categories: ['bar', 'nightlife'],
          rating: 4.2,
          userRatingsTotal: 89,
          status: 'claimed',
          source: 'google_places',
          importDate: '2024-01-14T15:45:00Z',
          claimDate: '2024-01-15T09:15:00Z',
          claimContactEmail: 'owner@sunset.ci',
          claimContactPhone: '+225 20 30 40 51',
          claimJustification: 'Je suis le propriétaire de ce bar depuis 5 ans',
          photoUrls: ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400'],
          openingHours: {
            open_now: false,
            weekday_text: [
              'Lundi: Fermé',
              'Mardi: 18h00 - 02h00',
              'Mercredi: 18h00 - 02h00',
              'Jeudi: 18h00 - 02h00',
              'Vendredi: 18h00 - 03h00',
              'Samedi: 18h00 - 03h00',
              'Dimanche: 18h00 - 01h00'
            ]
          }
        },
        {
          id: '3',
          placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY6',
          name: 'Cinéma Le Palace',
          address: '789 Rue du Commerce, Abidjan, Côte d\'Ivoire',
          lat: 5.3700,
          lng: -4.0150,
          phone: '+225 20 30 40 52',
          website: 'https://cinemapalace.ci',
          categories: ['cinema', 'entertainment'],
          rating: 4.7,
          userRatingsTotal: 234,
          status: 'imported',
          source: 'google_places',
          importDate: '2024-01-13T12:20:00Z',
          photoUrls: ['https://images.unsplash.com/photo-1489599808421-1b0b5b5b5b5b?w=400'],
          openingHours: {
            open_now: true,
            weekday_text: [
              'Lundi: 14h00 - 23h00',
              'Mardi: 14h00 - 23h00',
              'Mercredi: 14h00 - 23h00',
              'Jeudi: 14h00 - 23h00',
              'Vendredi: 14h00 - 24h00',
              'Samedi: 12h00 - 24h00',
              'Dimanche: 12h00 - 22h00'
            ]
          }
        }
      ];

      // Filtrer les données
      let filteredPlaces = mockPlaces;

      if (searchTerm) {
        filteredPlaces = filteredPlaces.filter(place =>
          place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          place.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (statusFilter) {
        filteredPlaces = filteredPlaces.filter(place => place.status === statusFilter);
      }

      if (categoryFilter) {
        filteredPlaces = filteredPlaces.filter(place =>
          place.categories.includes(categoryFilter)
        );
      }

      setPlaces(filteredPlaces);
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'claimed':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'imported':
        return <ExclamationTriangleIcon className="w-5 h-5 text-blue-500" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'claimed':
        return 'bg-yellow-100 text-yellow-800';
      case 'imported':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Vérifié';
      case 'claimed':
        return 'Réclamé';
      case 'imported':
        return 'Importé';
      case 'rejected':
        return 'Rejeté';
      case 'pending_verification':
        return 'En attente';
      default:
        return status;
    }
  };

  const handleVerify = async (placeId: string, status: 'verified' | 'rejected', notes?: string) => {
    try {
      const response = await fetch(`/api/places-import/places/${placeId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });

      if (response.ok) {
        // Rafraîchir la liste
        await fetchPlaces();
        setSelectedPlace(null);
      }
    } catch (error) {
      console.error('Error verifying place:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Établissements Importés</h1>
          <p className="text-gray-600">Gérez les établissements importés depuis Google Places</p>
        </div>
        <div className="text-sm text-gray-500">
          {places.length} établissement{places.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom ou adresse..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les statuts</option>
              <option value="imported">Importé</option>
              <option value="claimed">Réclamé</option>
              <option value="verified">Vérifié</option>
              <option value="rejected">Rejeté</option>
              <option value="pending_verification">En attente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Toutes les catégories</option>
              <option value="restaurant">Restaurants</option>
              <option value="bar">Bars</option>
              <option value="cinema">Cinémas</option>
              <option value="nightlife">Nightlife</option>
              <option value="entertainment">Divertissement</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setCategoryFilter('');
              }}
              className="w-full flex items-center justify-center space-x-2"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Réinitialiser</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Liste des établissements */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Établissement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'import
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {places.map((place) => (
                <tr key={place.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      {place.photoUrls.length > 0 && (
                        <img
                          src={place.photoUrls[0]}
                          alt={place.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {place.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {place.address}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {place.categories.map((category) => (
                            <span
                              key={category}
                              className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(place.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(place.status)}`}>
                        {getStatusLabel(place.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {place.phone && (
                        <div className="flex items-center space-x-1">
                          <PhoneIcon className="w-3 h-3 text-gray-400" />
                          <span>{place.phone}</span>
                        </div>
                      )}
                      {place.website && (
                        <div className="flex items-center space-x-1 mt-1">
                          <GlobeAltIcon className="w-3 h-3 text-gray-400" />
                          <span className="truncate">{place.website}</span>
                        </div>
                      )}
                      {place.claimContactEmail && (
                        <div className="text-xs text-gray-500 mt-1">
                          {place.claimContactEmail}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {place.rating && (
                      <div className="flex items-center space-x-1">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{place.rating}</span>
                        <span className="text-sm text-gray-500">({place.userRatingsTotal})</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(place.importDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPlace(place)}
                      >
                        Voir
                      </Button>
                      {place.status === 'claimed' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerify(place.id, 'verified', 'Vérifié par l\'équipe')}
                            className="text-green-600 hover:text-green-700"
                          >
                            Vérifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerify(place.id, 'rejected', 'Informations insuffisantes')}
                            className="text-red-600 hover:text-red-700"
                          >
                            Rejeter
                          </Button>
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

      {/* Modal de détails */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{selectedPlace.name}</h3>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Informations générales</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Adresse:</strong> {selectedPlace.address}</div>
                  <div><strong>Catégories:</strong> {selectedPlace.categories.join(', ')}</div>
                  <div><strong>Statut:</strong> {getStatusLabel(selectedPlace.status)}</div>
                  <div><strong>Source:</strong> {selectedPlace.source}</div>
                </div>
              </div>

              {selectedPlace.claimJustification && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Justification de réclamation</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedPlace.claimJustification}
                  </p>
                </div>
              )}

              {selectedPlace.verificationNotes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Notes de vérification</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedPlace.verificationNotes}
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setSelectedPlace(null)}
                  variant="outline"
                >
                  Fermer
                </Button>
                {selectedPlace.status === 'claimed' && (
                  <>
                    <Button
                      onClick={() => {
                        handleVerify(selectedPlace.id, 'verified', 'Vérifié par l\'équipe');
                        setSelectedPlace(null);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Vérifier
                    </Button>
                    <Button
                      onClick={() => {
                        handleVerify(selectedPlace.id, 'rejected', 'Informations insuffisantes');
                        setSelectedPlace(null);
                      }}
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      Rejeter
                    </Button>
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
