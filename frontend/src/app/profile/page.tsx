'use client';

import { useState, useEffect } from 'react';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  HeartIcon,
  ShoppingBagIcon,
  StarIcon,
  PencilIcon,
  CameraIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private';
      showLocation: boolean;
      showBookings: boolean;
    };
    language: string;
    currency: string;
  };
  stats: {
    totalBookings: number;
    totalSpent: number;
    favoriteVenues: number;
    reviewsGiven: number;
    averageRating: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'booking' | 'review' | 'favorite' | 'visit';
    title: string;
    description: string;
    date: string;
    venue?: string;
  }>;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setProfile({
        id: '1',
        firstName: 'Marie',
        lastName: 'Koné',
        email: 'marie.kone@email.com',
        phone: '+2250701234567',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
        dateOfBirth: '1990-05-15',
        location: {
          lat: 5.3167,
          lng: -4.0333,
          address: '123 Rue des Cocotiers',
          city: 'Abidjan',
          country: 'Côte d\'Ivoire'
        },
        preferences: {
          notifications: {
            email: true,
            sms: true,
            push: true
          },
          privacy: {
            profileVisibility: 'public',
            showLocation: true,
            showBookings: false
          },
          language: 'fr',
          currency: 'XOF'
        },
        stats: {
          totalBookings: 12,
          totalSpent: 150000,
          favoriteVenues: 8,
          reviewsGiven: 5,
          averageRating: 4.2
        },
        recentActivity: [
          {
            id: '1',
            type: 'booking',
            title: 'Réservation confirmée',
            description: 'Le Rooftop Abidjan - Soirée Jazz',
            date: '2024-01-20T19:30:00Z',
            venue: 'Le Rooftop Abidjan'
          },
          {
            id: '2',
            type: 'review',
            title: 'Avis publié',
            description: '5 étoiles - Excellent service !',
            date: '2024-01-18T15:45:00Z',
            venue: 'Restaurant Le Bistrot'
          },
          {
            id: '3',
            type: 'favorite',
            title: 'Ajouté aux favoris',
            description: 'Cinéma Pathé Cocody',
            date: '2024-01-15T10:30:00Z',
            venue: 'Cinéma Pathé Cocody'
          },
          {
            id: '4',
            type: 'visit',
            title: 'Visite enregistrée',
            description: 'Club Le VIP - Soirée Hip-Hop',
            date: '2024-01-12T22:00:00Z',
            venue: 'Club Le VIP'
          }
        ]
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <ShoppingBagIcon className="w-5 h-5 text-blue-600" />;
      case 'review':
        return <StarIcon className="w-5 h-5 text-yellow-600" />;
      case 'favorite':
        return <HeartIcon className="w-5 h-5 text-red-600" />;
      case 'visit':
        return <MapPinIcon className="w-5 h-5 text-green-600" />;
      default:
        return <CalendarDaysIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'favorite':
        return 'bg-red-100 text-red-800';
      case 'visit':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (!profile) return;
    
    const keys = field.split('.');
    if (keys.length === 1) {
      setProfile(prev => prev ? { ...prev, [field]: value } : null);
    } else if (keys.length === 2) {
      setProfile(prev => prev ? {
        ...prev,
        [keys[0]]: {
          ...prev[keys[0] as keyof UserProfile],
          [keys[1]]: value
        }
      } : null);
    } else if (keys.length === 3) {
      setProfile(prev => prev ? {
        ...prev,
        [keys[0]]: {
          ...prev[keys[0] as keyof UserProfile],
          [keys[1]]: {
            ...prev[keys[0] as keyof UserProfile][keys[1] as keyof any],
            [keys[2]]: value
          }
        }
      } : null);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simuler la sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    setIsLoading(true);
    // Simuler le changement de mot de passe
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Profil non trouvé</h3>
        <p className="text-gray-500">Impossible de charger votre profil.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos informations personnelles et préférences
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
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {[
              { id: 'overview', name: 'Vue d\'ensemble', icon: UserIcon },
              { id: 'personal', name: 'Informations personnelles', icon: UserIcon },
              { id: 'notifications', name: 'Notifications', icon: BellIcon },
              { id: 'privacy', name: 'Confidentialité', icon: ShieldCheckIcon },
              { id: 'preferences', name: 'Préférences', icon: GlobeAltIcon },
              { id: 'security', name: 'Sécurité', icon: KeyIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="p-6">
                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt="Avatar"
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-primary-600 font-medium text-3xl">
                          {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                        </span>
                      )}
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md">
                        <CameraIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    <p className="text-gray-600">{profile.email}</p>
                    {profile.phone && (
                      <p className="text-gray-600">{profile.phone}</p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <ShoppingBagIcon className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Réservations</p>
                        <p className="text-2xl font-bold text-gray-900">{profile.stats.totalBookings}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-green-600 mr-3">₣</span>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Dépensé</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(profile.stats.totalSpent)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <HeartIcon className="w-8 h-8 text-red-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Favoris</p>
                        <p className="text-2xl font-bold text-gray-900">{profile.stats.favoriteVenues}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <StarIcon className="w-8 h-8 text-yellow-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avis donnés</p>
                        <p className="text-2xl font-bold text-gray-900">{profile.stats.reviewsGiven}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
                  <div className="space-y-4">
                    {profile.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          {activity.venue && (
                            <p className="text-xs text-gray-500 mt-1">Lieu: {activity.venue}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Personal Tab */}
            {activeTab === 'personal' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations personnelles</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                      <input
                        type="date"
                        value={profile.dateOfBirth || ''}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        disabled={!isEditing}
                        className="input"
                      />
                    </div>
                  </div>

                  {profile.location && (
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">Localisation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                          <input
                            type="text"
                            value={profile.location.address}
                            onChange={(e) => handleInputChange('location.address', e.target.value)}
                            disabled={!isEditing}
                            className="input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                          <input
                            type="text"
                            value={profile.location.city}
                            onChange={(e) => handleInputChange('location.city', e.target.value)}
                            disabled={!isEditing}
                            className="input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                          <input
                            type="text"
                            value={profile.location.country}
                            onChange={(e) => handleInputChange('location.country', e.target.value)}
                            disabled={!isEditing}
                            className="input"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Préférences de notification</h2>
                <div className="space-y-4">
                  {Object.entries(profile.preferences.notifications).map(([key, value]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleInputChange(`preferences.notifications.${key}`, e.target.checked)}
                        disabled={!isEditing}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-900">
                        {key === 'email' && 'Notifications par email'}
                        {key === 'sms' && 'Notifications par SMS'}
                        {key === 'push' && 'Notifications push'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Paramètres de confidentialité</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Visibilité du profil</label>
                    <select
                      value={profile.preferences.privacy.profileVisibility}
                      onChange={(e) => handleInputChange('preferences.privacy.profileVisibility', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    >
                      <option value="public">Public</option>
                      <option value="private">Privé</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profile.preferences.privacy.showLocation}
                        onChange={(e) => handleInputChange('preferences.privacy.showLocation', e.target.checked)}
                        disabled={!isEditing}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-900">Afficher ma localisation</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profile.preferences.privacy.showBookings}
                        onChange={(e) => handleInputChange('preferences.privacy.showBookings', e.target.checked)}
                        disabled={!isEditing}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-900">Afficher mes réservations</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Préférences</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                    <select
                      value={profile.preferences.language}
                      onChange={(e) => handleInputChange('preferences.language', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
                    <select
                      value={profile.preferences.currency}
                      onChange={(e) => handleInputChange('preferences.currency', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    >
                      <option value="XOF">Franc CFA (XOF)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="USD">Dollar US (USD)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Sécurité du compte</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="btn-outline"
                    >
                      <KeyIcon className="w-4 h-4 mr-2" />
                      Modifier le mot de passe
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Changer le mot de passe</h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="input"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="btn-outline"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? 'Changement...' : 'Changer le mot de passe'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}