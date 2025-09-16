'use client';

import { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ClockIcon,
  StarIcon,
  PhotoIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface VenueInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  openingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  amenities: string[];
  images: string[];
  averageRating: number;
  totalReviews: number;
  priceRange: number;
  capacity: number;
  isActive: boolean;
  isVerified: boolean;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export default function VenuePage() {
  const [venue, setVenue] = useState<VenueInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setVenue({
        id: '1',
        name: 'Le Rooftop Abidjan',
        description: 'Un restaurant-bar élégant avec une vue panoramique sur la ville d\'Abidjan. Spécialisé dans la cuisine française et africaine fusion.',
        category: 'restaurant',
        address: '123 Avenue Franchet d\'Esperey',
        city: 'Abidjan',
        country: 'Côte d\'Ivoire',
        postalCode: '00225',
        phone: '+2250701234567',
        email: 'contact@lerooftopabidjan.com',
        website: 'https://lerooftopabidjan.com',
        openingHours: {
          monday: { open: '11:00', close: '23:00', closed: false },
          tuesday: { open: '11:00', close: '23:00', closed: false },
          wednesday: { open: '11:00', close: '23:00', closed: false },
          thursday: { open: '11:00', close: '23:00', closed: false },
          friday: { open: '11:00', close: '01:00', closed: false },
          saturday: { open: '11:00', close: '01:00', closed: false },
          sunday: { open: '12:00', close: '22:00', closed: false }
        },
        amenities: ['WiFi', 'Parking', 'Climatisation', 'Terrasse', 'Bar', 'Musique live'],
        images: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
          'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800'
        ],
        averageRating: 4.5,
        totalReviews: 89,
        priceRange: 25000,
        capacity: 120,
        isActive: true,
        isVerified: true,
        socialMedia: {
          facebook: 'https://facebook.com/lerooftopabidjan',
          instagram: 'https://instagram.com/lerooftopabidjan',
          twitter: 'https://twitter.com/lerooftopabidjan'
        }
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount);
  };

  const getDayName = (day: string) => {
    const days = {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche'
    };
    return days[day as keyof typeof days];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="text-center py-12">
        <BuildingOfficeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun établissement trouvé</h3>
        <p className="text-gray-500">Vous n'avez pas encore créé d'établissement.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{venue.name}</h1>
          <p className="mt-2 text-gray-600">
            Gérez les informations de votre établissement
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-outline"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            {isEditing ? 'Annuler' : 'Modifier'}
          </button>
          <button className="btn-primary">
            <EyeIcon className="w-4 h-4 mr-2" />
            Aperçu public
          </button>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex space-x-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          venue.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {venue.isActive ? 'Actif' : 'Inactif'}
        </span>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          venue.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {venue.isVerified ? 'Vérifié' : 'En attente de vérification'}
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Vue d\'ensemble' },
            { id: 'details', name: 'Détails' },
            { id: 'images', name: 'Images' },
            { id: 'hours', name: 'Horaires' },
            { id: 'amenities', name: 'Équipements' },
            { id: 'social', name: 'Réseaux sociaux' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'overview' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Adresse</p>
                      <p className="text-sm text-gray-600">
                        {venue.address}, {venue.postalCode} {venue.city}, {venue.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <PhoneIcon className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Téléphone</p>
                      <p className="text-sm text-gray-600">{venue.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{venue.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <GlobeAltIcon className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Site web</p>
                      <p className="text-sm text-gray-600">
                        <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                          {venue.website}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <StarIcon className="w-5 h-5 text-yellow-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{venue.averageRating}/5</p>
                        <p className="text-xs text-gray-600">{venue.totalReviews} avis</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="w-5 h-5 text-blue-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{venue.capacity}</p>
                        <p className="text-xs text-gray-600">places</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-green-600 mr-2">₣</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(venue.priceRange)}</p>
                        <p className="text-xs text-gray-600">prix moyen</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <ClockIcon className="w-5 h-5 text-purple-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">7j/7</p>
                        <p className="text-xs text-gray-600">ouvert</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed">{venue.description}</p>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Détails de l'établissement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'établissement</label>
                <input
                  type="text"
                  value={venue.name}
                  disabled={!isEditing}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={venue.category}
                  disabled={!isEditing}
                  className="input"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="bar">Bar</option>
                  <option value="club">Club</option>
                  <option value="cinema">Cinéma</option>
                  <option value="theater">Théâtre</option>
                  <option value="lounge">Lounge</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={venue.description}
                  disabled={!isEditing}
                  rows={4}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <input
                  type="text"
                  value={venue.address}
                  disabled={!isEditing}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                <input
                  type="text"
                  value={venue.city}
                  disabled={!isEditing}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                <input
                  type="text"
                  value={venue.postalCode}
                  disabled={!isEditing}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                <input
                  type="text"
                  value={venue.country}
                  disabled={!isEditing}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={venue.phone}
                  disabled={!isEditing}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={venue.email}
                  disabled={!isEditing}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                <input
                  type="url"
                  value={venue.website}
                  disabled={!isEditing}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacité</label>
                <input
                  type="number"
                  value={venue.capacity}
                  disabled={!isEditing}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gamme de prix (FCFA)</label>
                <input
                  type="number"
                  value={venue.priceRange}
                  disabled={!isEditing}
                  className="input"
                />
              </div>
            </div>
            {isEditing && (
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-outline"
                >
                  Annuler
                </button>
                <button className="btn-primary">
                  Sauvegarder
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'images' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Images de l'établissement</h3>
              <button className="btn-primary">
                <PlusIcon className="w-4 h-4 mr-2" />
                Ajouter des images
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {venue.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`${venue.name} ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                      <button className="p-2 bg-white rounded-full text-gray-600 hover:text-gray-900">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white rounded-full text-gray-600 hover:text-gray-900">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white rounded-full text-red-600 hover:text-red-700">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hours' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Horaires d'ouverture</h3>
            <div className="space-y-4">
              {Object.entries(venue.openingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="w-24">
                      <span className="text-sm font-medium text-gray-900">{getDayName(day)}</span>
                    </div>
                    {hours.closed ? (
                      <span className="text-sm text-gray-500">Fermé</span>
                    ) : (
                      <span className="text-sm text-gray-900">
                        {hours.open} - {hours.close}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!hours.closed}
                      disabled={!isEditing}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <input
                      type="time"
                      value={hours.open}
                      disabled={!isEditing || hours.closed}
                      className="ml-2 input w-24"
                    />
                    <span className="mx-2 text-gray-500">-</span>
                    <input
                      type="time"
                      value={hours.close}
                      disabled={!isEditing || hours.closed}
                      className="input w-24"
                    />
                  </div>
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-outline"
                >
                  Annuler
                </button>
                <button className="btn-primary">
                  Sauvegarder
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'amenities' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Équipements et services</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                'WiFi', 'Parking', 'Climatisation', 'Terrasse', 'Bar', 'Musique live',
                'Air conditionné', 'Cuisine', 'Service de table', 'Réservation en ligne',
                'Paiement mobile', 'Accessible PMR', 'Animaux acceptés', 'Fumeur'
              ].map((amenity) => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={venue.amenities.includes(amenity)}
                    disabled={!isEditing}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-900">{amenity}</span>
                </label>
              ))}
            </div>
            {isEditing && (
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-outline"
                >
                  Annuler
                </button>
                <button className="btn-primary">
                  Sauvegarder
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'social' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Réseaux sociaux</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="url"
                  value={venue.socialMedia.facebook || ''}
                  disabled={!isEditing}
                  placeholder="https://facebook.com/votre-page"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="url"
                  value={venue.socialMedia.instagram || ''}
                  disabled={!isEditing}
                  placeholder="https://instagram.com/votre-compte"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="url"
                  value={venue.socialMedia.twitter || ''}
                  disabled={!isEditing}
                  placeholder="https://twitter.com/votre-compte"
                  className="input"
                />
              </div>
            </div>
            {isEditing && (
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-outline"
                >
                  Annuler
                </button>
                <button className="btn-primary">
                  Sauvegarder
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}