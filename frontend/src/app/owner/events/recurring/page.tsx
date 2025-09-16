'use client';

import { useState, useEffect } from 'react';
import { 
  CalendarDaysIcon, 
  PlusIcon, 
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface RecurringEvent {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  startTime: string;
  endTime: string;
  price: number;
  maxCapacity: number;
  isActive: boolean;
  nextOccurrence: string;
  totalOccurrences: number;
  createdOccurrences: number;
}

export default function RecurringEventsPage() {
  const [events, setEvents] = useState<RecurringEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<RecurringEvent | null>(null);

  useEffect(() => {
    // Simuler le chargement des événements récurrents
    setTimeout(() => {
      setEvents([
        {
          id: '1',
          title: 'Soirée Jazz Hebdomadaire',
          description: 'Concert de jazz tous les vendredis soir',
          frequency: 'weekly',
          dayOfWeek: 5, // Vendredi
          startTime: '20:00',
          endTime: '23:00',
          price: 15000,
          maxCapacity: 50,
          isActive: true,
          nextOccurrence: '2024-01-19',
          totalOccurrences: 52,
          createdOccurrences: 3
        },
        {
          id: '2',
          title: 'Brunch Dominical',
          description: 'Brunch traditionnel tous les dimanches',
          frequency: 'weekly',
          dayOfWeek: 0, // Dimanche
          startTime: '10:00',
          endTime: '14:00',
          price: 8000,
          maxCapacity: 30,
          isActive: true,
          nextOccurrence: '2024-01-21',
          totalOccurrences: 52,
          createdOccurrences: 2
        },
        {
          id: '3',
          title: 'Formation Culinaire Mensuelle',
          description: 'Atelier de cuisine le premier samedi de chaque mois',
          frequency: 'monthly',
          dayOfMonth: 1,
          startTime: '14:00',
          endTime: '17:00',
          price: 25000,
          maxCapacity: 15,
          isActive: false,
          nextOccurrence: '2024-02-03',
          totalOccurrences: 12,
          createdOccurrences: 0
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const toggleEventStatus = (id: string) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, isActive: !event.isActive } : event
    ));
  };

  const deleteEvent = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement récurrent ?')) {
      setEvents(prev => prev.filter(event => event.id !== id));
    }
  };

  const getFrequencyLabel = (frequency: string, dayOfWeek?: number, dayOfMonth?: number) => {
    switch (frequency) {
      case 'daily':
        return 'Quotidien';
      case 'weekly':
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        return `Hebdomadaire (${days[dayOfWeek || 0]})`;
      case 'monthly':
        return `Mensuel (${dayOfMonth || 1}er du mois)`;
      default:
        return frequency;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount);
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
          <h1 className="text-3xl font-bold text-gray-900">Événements récurrents</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos événements qui se répètent automatiquement
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Créer un événement récurrent
        </button>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mes événements récurrents</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {events.map((event) => (
            <div key={event.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  
                  <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                  
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Fréquence:</span>
                      <p className="text-gray-600">{getFrequencyLabel(event.frequency, event.dayOfWeek, event.dayOfMonth)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Horaires:</span>
                      <p className="text-gray-600">{event.startTime} - {event.endTime}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Prix:</span>
                      <p className="text-gray-600">{formatCurrency(event.price)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Capacité:</span>
                      <p className="text-gray-600">{event.maxCapacity} personnes</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center space-x-6 text-sm text-gray-500">
                    <span>Prochaine occurrence: {event.nextOccurrence}</span>
                    <span>Créés: {event.createdOccurrences}/{event.totalOccurrences}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleEventStatus(event.id)}
                    className={`p-2 rounded-lg ${
                      event.isActive 
                        ? 'text-yellow-600 hover:bg-yellow-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={event.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {event.isActive ? (
                      <XMarkIcon className="h-5 w-5" />
                    ) : (
                      <CheckIcon className="h-5 w-5" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setEditingEvent(event)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Modifier"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Supprimer"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Créer un événement récurrent</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ex: Soirée Jazz Hebdomadaire"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Décrivez votre événement récurrent..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fréquence</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="daily">Quotidien</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuel</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jour</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="0">Dimanche</option>
                    <option value="1">Lundi</option>
                    <option value="2">Mardi</option>
                    <option value="3">Mercredi</option>
                    <option value="4">Jeudi</option>
                    <option value="5">Vendredi</option>
                    <option value="6">Samedi</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heure de début</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heure de fin</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix (XOF)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacité</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="50"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Conseils pour les événements récurrents</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Les événements récurrents créent automatiquement des instances individuelles</li>
          <li>• Vous pouvez modifier ou annuler des occurrences spécifiques</li>
          <li>• Les réservations se font sur les instances individuelles, pas sur le modèle récurrent</li>
          <li>• Désactivez temporairement un événement récurrent sans le supprimer</li>
        </ul>
      </div>
    </div>
  );
}
