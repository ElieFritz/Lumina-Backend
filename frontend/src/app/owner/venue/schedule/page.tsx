'use client';

import { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  PlusIcon, 
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface OpeningHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  is24h: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price?: number;
  isActive: boolean;
}

export default function VenueSchedulePage() {
  const [openingHours, setOpeningHours] = useState<OpeningHours[]>([
    { day: 'Lundi', isOpen: true, openTime: '11:00', closeTime: '23:00', is24h: false },
    { day: 'Mardi', isOpen: true, openTime: '11:00', closeTime: '23:00', is24h: false },
    { day: 'Mercredi', isOpen: true, openTime: '11:00', closeTime: '23:00', is24h: false },
    { day: 'Jeudi', isOpen: true, openTime: '11:00', closeTime: '23:00', is24h: false },
    { day: 'Vendredi', isOpen: true, openTime: '11:00', closeTime: '00:00', is24h: false },
    { day: 'Samedi', isOpen: true, openTime: '11:00', closeTime: '00:00', is24h: false },
    { day: 'Dimanche', isOpen: true, openTime: '12:00', closeTime: '22:00', is24h: false },
  ]);

  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'WiFi gratuit',
      description: 'Connexion internet gratuite pour tous les clients',
      isActive: true
    },
    {
      id: '2',
      name: 'Parking',
      description: 'Parking gratuit disponible',
      isActive: true
    },
    {
      id: '3',
      name: 'Terrasse',
      description: 'Espace extérieur avec vue',
      isActive: true
    },
    {
      id: '4',
      name: 'Climatisation',
      description: 'Système de climatisation dans tout l\'établissement',
      isActive: true
    },
    {
      id: '5',
      name: 'Musique live',
      description: 'Concerts et spectacles en soirée',
      price: 5000,
      isActive: true
    }
  ]);

  const [newService, setNewService] = useState({ name: '', description: '', price: '' });
  const [showAddService, setShowAddService] = useState(false);

  const updateOpeningHours = (day: string, field: keyof OpeningHours, value: any) => {
    setOpeningHours(prev => prev.map(hour => 
      hour.day === day ? { ...hour, [field]: value } : hour
    ));
  };

  const addService = () => {
    if (newService.name.trim()) {
      const service: Service = {
        id: Date.now().toString(),
        name: newService.name,
        description: newService.description,
        price: newService.price ? parseFloat(newService.price) : undefined,
        isActive: true
      };
      setServices(prev => [...prev, service]);
      setNewService({ name: '', description: '', price: '' });
      setShowAddService(false);
    }
  };

  const toggleService = (id: string) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, isActive: !service.isActive } : service
    ));
  };

  const removeService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const saveChanges = () => {
    // Logique de sauvegarde
    console.log('Saving opening hours:', openingHours);
    console.log('Saving services:', services);
    // Ici, vous feriez un appel API pour sauvegarder
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Horaires & Services</h1>
          <p className="mt-2 text-gray-600">
            Gérez les horaires d'ouverture et les services de votre établissement
          </p>
        </div>
        <button
          onClick={saveChanges}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <CheckIcon className="h-5 w-5 mr-2" />
          Sauvegarder
        </button>
      </div>

      {/* Opening Hours */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          <ClockIcon className="h-5 w-5 inline mr-2" />
          Horaires d'ouverture
        </h2>
        
        <div className="space-y-4">
          {openingHours.map((hour) => (
            <div key={hour.day} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-20">
                <span className="text-sm font-medium text-gray-900">{hour.day}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={hour.isOpen}
                  onChange={(e) => updateOpeningHours(hour.day, 'isOpen', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Ouvert</span>
              </div>
              
              {hour.isOpen && (
                <>
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={hour.openTime}
                      onChange={(e) => updateOpeningHours(hour.day, 'openTime', e.target.value)}
                      disabled={hour.is24h}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="time"
                      value={hour.closeTime}
                      onChange={(e) => updateOpeningHours(hour.day, 'closeTime', e.target.value)}
                      disabled={hour.is24h}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={hour.is24h}
                      onChange={(e) => {
                        updateOpeningHours(hour.day, 'is24h', e.target.checked);
                        if (e.target.checked) {
                          updateOpeningHours(hour.day, 'openTime', '00:00');
                          updateOpeningHours(hour.day, 'closeTime', '23:59');
                        }
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">24h/24</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Services</h2>
          <button
            onClick={() => setShowAddService(true)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Ajouter un service
          </button>
        </div>

        {/* Add Service Form */}
        {showAddService && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Nouveau service</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du service</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ex: WiFi gratuit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Description du service"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (optionnel)</label>
                <input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={addService}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
              >
                Ajouter
              </button>
              <button
                onClick={() => setShowAddService(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Services List */}
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={service.isActive}
                    onChange={() => toggleService(service.id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                    {service.price && (
                      <p className="text-sm text-primary-600 font-medium">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XOF',
                        }).format(service.price)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeService(service.id)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-yellow-900 mb-2">Conseils pour vos horaires</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Assurez-vous que vos horaires correspondent à la réalité</li>
              <li>• Mettez à jour vos horaires en cas de fermeture exceptionnelle</li>
              <li>• Les clients peuvent réserver en fonction de vos horaires d'ouverture</li>
              <li>• Les services payants apparaîtront dans les détails de réservation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
