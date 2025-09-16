'use client';

import { useState, useEffect } from 'react';
import { 
  UserIcon,
  BuildingOfficeIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  GlobeAltIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Settings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
  };
  venue: {
  name: string;
  description: string;
  address: string;
    city: string;
    country: string;
  phone: string;
  email: string;
  website: string;
  };
  notifications: {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
    marketingEmails: boolean;
    bookingAlerts: boolean;
    reviewAlerts: boolean;
  paymentAlerts: boolean;
  };
  security: {
  twoFactorEnabled: boolean;
    loginAlerts: boolean;
  sessionTimeout: number;
  };
  payment: {
    stripeAccountId: string;
    paystackAccountId: string;
    mobileMoneyEnabled: boolean;
    bankTransferEnabled: boolean;
    cashEnabled: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showContactInfo: boolean;
    showBookingHistory: boolean;
    dataSharing: boolean;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    profile: {
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      phone: '+2250701234567',
      avatar: ''
    },
    venue: {
      name: 'Le Rooftop Abidjan',
      description: 'Un restaurant-bar élégant avec une vue panoramique sur la ville d\'Abidjan.',
      address: '123 Avenue Franchet d\'Esperey',
      city: 'Abidjan',
      country: 'Côte d\'Ivoire',
      phone: '+2250701234567',
      email: 'contact@lerooftopabidjan.com',
      website: 'https://lerooftopabidjan.com'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      bookingAlerts: true,
      reviewAlerts: true,
      paymentAlerts: true
    },
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
      sessionTimeout: 30
    },
    payment: {
      stripeAccountId: 'acct_1234567890',
      paystackAccountId: 'pk_test_1234567890',
      mobileMoneyEnabled: true,
      bankTransferEnabled: true,
      cashEnabled: true
    },
    privacy: {
      profileVisibility: 'public',
      showContactInfo: true,
      showBookingHistory: false,
      dataSharing: false
    }
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (section: keyof Settings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async (section: keyof Settings) => {
    setIsLoading(true);
    // Simuler la sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Afficher un message de succès
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

  const tabs = [
    { id: 'profile', name: 'Profil', icon: UserIcon },
    { id: 'venue', name: 'Établissement', icon: BuildingOfficeIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon },
    { id: 'payment', name: 'Paiements', icon: CreditCardIcon },
    { id: 'privacy', name: 'Confidentialité', icon: GlobeAltIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="mt-2 text-gray-600">
          Gérez vos préférences et la configuration de votre compte
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
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
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations du profil</h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                      {settings.profile.avatar ? (
                        <img
                          src={settings.profile.avatar}
                          alt="Avatar"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-primary-600 font-medium text-2xl">
                          {settings.profile.firstName.charAt(0)}{settings.profile.lastName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <button className="btn-outline">Changer la photo</button>
                      <p className="text-sm text-gray-500 mt-1">JPG, PNG jusqu'à 2MB</p>
                    </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                      <input
                        type="text"
                        value={settings.profile.firstName}
                        onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
          <input
            type="text"
                        value={settings.profile.lastName}
                        onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                        className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
                        value={settings.profile.email}
                        onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                        className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
          <input
            type="tel"
                        value={settings.profile.phone}
                        onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                        className="input"
          />
        </div>
        </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleSave('profile')}
                      disabled={isLoading}
                      className="btn-primary"
                    >
                      {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Venue Tab */}
            {activeTab === 'venue' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations de l'établissement</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'établissement</label>
                      <input
                        type="text"
                        value={settings.venue.name}
                        onChange={(e) => handleInputChange('venue', 'name', e.target.value)}
                        className="input"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
                        value={settings.venue.description}
                        onChange={(e) => handleInputChange('venue', 'description', e.target.value)}
                        rows={4}
                        className="input"
          />
        </div>
      <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <input
                        type="text"
                        value={settings.venue.address}
                        onChange={(e) => handleInputChange('venue', 'address', e.target.value)}
                        className="input"
                  />
                </div>
      <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
            <input
              type="text"
                        value={settings.venue.city}
                        onChange={(e) => handleInputChange('venue', 'city', e.target.value)}
                        className="input"
            />
          </div>
          <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
            <input
              type="text"
                        value={settings.venue.country}
                        onChange={(e) => handleInputChange('venue', 'country', e.target.value)}
                        className="input"
            />
          </div>
          <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <input
                        type="tel"
                        value={settings.venue.phone}
                        onChange={(e) => handleInputChange('venue', 'phone', e.target.value)}
                        className="input"
            />
          </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={settings.venue.email}
                        onChange={(e) => handleInputChange('venue', 'email', e.target.value)}
                        className="input"
                      />
        </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
              <input
                        type="url"
                        value={settings.venue.website}
                        onChange={(e) => handleInputChange('venue', 'website', e.target.value)}
                        className="input"
                      />
            </div>
          </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleSave('venue')}
                      disabled={isLoading}
                      className="btn-primary"
                    >
                      {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
          </div>
        </div>
      </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Préférences de notification</h2>
    <div className="space-y-6">
      <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-900">Notifications par email</h3>
                    <div className="space-y-3">
                      {Object.entries(settings.notifications).map(([key, value]) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleInputChange('notifications', key, e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-900">
                            {key === 'emailNotifications' && 'Notifications par email'}
                            {key === 'smsNotifications' && 'Notifications par SMS'}
                            {key === 'pushNotifications' && 'Notifications push'}
                            {key === 'marketingEmails' && 'Emails marketing'}
                            {key === 'bookingAlerts' && 'Alertes de réservation'}
                            {key === 'reviewAlerts' && 'Alertes d\'avis'}
                            {key === 'paymentAlerts' && 'Alertes de paiement'}
                          </span>
                        </label>
                      ))}
          </div>
        </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleSave('notifications')}
                      disabled={isLoading}
                      className="btn-primary"
                    >
                      {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
          </div>
        </div>
          </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Sécurité du compte</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
          <div>
                        <h3 className="text-md font-medium text-gray-900">Authentification à deux facteurs</h3>
                        <p className="text-sm text-gray-500">Ajoutez une couche de sécurité supplémentaire à votre compte</p>
          </div>
                      <button
                        onClick={() => handleInputChange('security', 'twoFactorEnabled', !settings.security.twoFactorEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          settings.security.twoFactorEnabled ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            settings.security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
        </div>

                    <div className="flex items-center justify-between">
          <div>
                        <h3 className="text-md font-medium text-gray-900">Alertes de connexion</h3>
                        <p className="text-sm text-gray-500">Recevez une notification lors de nouvelles connexions</p>
          </div>
                      <button
                        onClick={() => handleInputChange('security', 'loginAlerts', !settings.security.loginAlerts)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          settings.security.loginAlerts ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            settings.security.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
        </div>

          <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Délai d'expiration de session (minutes)</label>
                      <select
                        value={settings.security.sessionTimeout}
                        onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="input"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 heure</option>
                        <option value={120}>2 heures</option>
                        <option value={480}>8 heures</option>
                      </select>
          </div>
        </div>

                  <div className="border-t pt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="btn-outline"
                    >
                      <KeyIcon className="w-4 h-4 mr-2" />
                      Modifier le mot de passe
                    </button>
        </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleSave('security')}
                      disabled={isLoading}
                      className="btn-primary"
                    >
                      {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
        </div>
      </div>
    </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Configuration des paiements</h2>
    <div className="space-y-6">
      <div className="space-y-4">
          <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Account ID</label>
                      <input
                        type="text"
                        value={settings.payment.stripeAccountId}
                        onChange={(e) => handleInputChange('payment', 'stripeAccountId', e.target.value)}
                        className="input"
                      />
          </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Paystack Account ID</label>
                      <input
                        type="text"
                        value={settings.payment.paystackAccountId}
                        onChange={(e) => handleInputChange('payment', 'paystackAccountId', e.target.value)}
                        className="input"
                      />
          </div>
        </div>

                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-900">Méthodes de paiement acceptées</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.payment.mobileMoneyEnabled}
                          onChange={(e) => handleInputChange('payment', 'mobileMoneyEnabled', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-900">Mobile Money</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.payment.bankTransferEnabled}
                          onChange={(e) => handleInputChange('payment', 'bankTransferEnabled', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-900">Virement bancaire</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.payment.cashEnabled}
                          onChange={(e) => handleInputChange('payment', 'cashEnabled', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-900">Espèces</span>
                      </label>
          </div>
        </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleSave('payment')}
                      disabled={isLoading}
                      className="btn-primary"
                    >
                      {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                  </div>
          </div>
        </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Paramètres de confidentialité</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Visibilité du profil</label>
                      <select
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => handleInputChange('privacy', 'profileVisibility', e.target.value)}
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
                          checked={settings.privacy.showContactInfo}
                          onChange={(e) => handleInputChange('privacy', 'showContactInfo', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-900">Afficher les informations de contact</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.privacy.showBookingHistory}
                          onChange={(e) => handleInputChange('privacy', 'showBookingHistory', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-900">Afficher l'historique des réservations</span>
                      </label>
                      <label className="flex items-center">
                <input
                          type="checkbox"
                          checked={settings.privacy.dataSharing}
                          onChange={(e) => handleInputChange('privacy', 'dataSharing', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-900">Partager les données avec des partenaires</span>
                      </label>
          </div>
        </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleSave('privacy')}
                      disabled={isLoading}
                      className="btn-primary"
                    >
                      {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
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