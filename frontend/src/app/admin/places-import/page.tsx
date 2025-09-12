'use client';

import { useState, useEffect } from 'react';
import { 
  CloudArrowDownIcon, 
  MapPinIcon, 
  BuildingOfficeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

interface ImportStats {
  totalPlaces: number;
  importedPlaces: number;
  pendingPlaces: number;
  verifiedPlaces: number;
  lastImportDate: string | null;
  importJobs: any[];
}

interface ImportJob {
  id: string;
  location: string;
  status: 'running' | 'completed' | 'failed';
  totalFound: number;
  newPlaces: number;
  updatedPlaces: number;
  skippedPlaces: number;
  errors: string[];
  duration: number;
  createdAt: Date;
}

interface ImportedPlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  rating: number;
  user_ratings_total: number;
  price_level: number;
  business_status: string;
  photos: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

export default function PlacesImportPage() {
  const [stats, setStats] = useState<ImportStats | null>(null);
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [recentPlaces, setRecentPlaces] = useState<ImportedPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [importForm, setImportForm] = useState({
    location: '',
    radius: 5000,
    type: '',
    maxResults: 20,
    dryRun: true
  });

  useEffect(() => {
    fetchStats();
    fetchImportJobs();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/places-import/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchImportJobs = async () => {
    try {
      // Simuler des jobs d'importation pour la démo
      const mockJobs: ImportJob[] = [
        {
          id: '1',
          location: 'Abidjan, Côte d\'Ivoire',
          status: 'completed',
          totalFound: 45,
          newPlaces: 38,
          updatedPlaces: 7,
          skippedPlaces: 0,
          errors: [],
          duration: 12000,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '2',
          location: 'Dakar, Sénégal',
          status: 'running',
          totalFound: 0,
          newPlaces: 0,
          updatedPlaces: 0,
          skippedPlaces: 0,
          errors: [],
          duration: 0,
          createdAt: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: '3',
          location: 'Lagos, Nigeria',
          status: 'failed',
          totalFound: 0,
          newPlaces: 0,
          updatedPlaces: 0,
          skippedPlaces: 0,
          errors: ['API quota exceeded'],
          duration: 5000,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
        }
      ];
      setImportJobs(mockJobs);
    } catch (error) {
      console.error('Error fetching import jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const response = await fetch('/api/places-import/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(importForm),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Import result:', result);
        
        // Sauvegarder les lieux importés pour l'affichage
        if (result.success && result.places) {
          setRecentPlaces(result.places);
        }
        
        // Rafraîchir les statistiques
        await fetchStats();
        await fetchImportJobs();
      } else {
        console.error('Import failed:', await response.text());
      }
    } catch (error) {
      console.error('Error during import:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'running':
        return <ClockIcon className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Importation Google Places</h1>
          <p className="text-gray-600">Gérez l'importation automatique d'établissements depuis Google Places API</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={fetchStats}
            className="flex items-center space-x-2"
          >
            <ChartBarIcon className="w-4 h-4" />
            <span>Actualiser</span>
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Établissements</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPlaces}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vérifiés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.verifiedPlaces || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingPlaces || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CloudArrowDownIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Importés (24h)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.importedPlaces || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lieux récemment importés */}
      {recentPlaces.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Lieux Récemment Importés</h2>
            <p className="text-sm text-gray-600">{recentPlaces.length} lieux trouvés</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentPlaces.map((place) => (
                <div key={place.place_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{place.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{place.formatted_address}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {place.rating > 0 && (
                          <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1">{place.rating}</span>
                            <span className="ml-1">({place.user_ratings_total})</span>
                          </div>
                        )}
                        
                        {place.price_level > 0 && (
                          <div className="text-green-600">
                            {'€'.repeat(place.price_level)}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {place.types.slice(0, 3).map((type) => (
                            <span 
                              key={type} 
                              className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                            >
                              {type.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        place.business_status === 'OPERATIONAL' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {place.business_status === 'OPERATIONAL' ? 'Ouvert' : 'Fermé'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Formulaire d'importation */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Nouvel Import</h2>
          <p className="text-sm text-gray-600">Importez des établissements depuis Google Places API</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localisation
              </label>
              <input
                type="text"
                value={importForm.location}
                onChange={(e) => setImportForm({ ...importForm, location: e.target.value })}
                placeholder="Abidjan, Côte d'Ivoire"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rayon (mètres)
              </label>
              <input
                type="number"
                value={importForm.radius || ''}
                onChange={(e) => setImportForm({ ...importForm, radius: parseInt(e.target.value) || 5000 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'établissement
              </label>
              <select
                value={importForm.type}
                onChange={(e) => setImportForm({ ...importForm, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tous les types</option>
                <option value="restaurant">Restaurants</option>
                <option value="bar">Bars</option>
                <option value="movie_theater">Cinémas</option>
                <option value="night_club">Clubs</option>
                <option value="theater">Théâtres</option>
                <option value="gym">Salles de sport</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre max de résultats
              </label>
              <input
                type="number"
                value={importForm.maxResults || ''}
                onChange={(e) => setImportForm({ ...importForm, maxResults: parseInt(e.target.value) || 20 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="dryRun"
                checked={importForm.dryRun}
                onChange={(e) => setImportForm({ ...importForm, dryRun: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="dryRun" className="ml-2 block text-sm text-gray-700">
                Mode test (dry run)
              </label>
            </div>
          </div>

          <div className="mt-6 flex items-center space-x-4">
            <Button
              onClick={handleImport}
              disabled={isImporting || !importForm.location}
              className="flex items-center space-x-2"
            >
              <CloudArrowDownIcon className="w-4 h-4" />
              <span>{isImporting ? 'Importation...' : 'Lancer l\'import'}</span>
            </Button>
            
            {importForm.dryRun && (
              <div className="flex items-center text-sm text-yellow-600">
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                Mode test activé - Aucune donnée ne sera importée
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historique des imports */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Historique des Imports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Résultats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {importJobs.map((job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{job.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(job.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.status === 'completed' ? (
                      <div>
                        <div>Nouveaux: {job.newPlaces}</div>
                        <div>Mis à jour: {job.updatedPlaces}</div>
                        <div>Ignorés: {job.skippedPlaces}</div>
                      </div>
                    ) : job.status === 'failed' ? (
                      <div className="text-red-600">
                        {job.errors.length > 0 ? job.errors[0] : 'Erreur inconnue'}
                      </div>
                    ) : (
                      <div className="text-gray-500">En cours...</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.duration > 0 ? `${(job.duration / 1000).toFixed(1)}s` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.createdAt.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
