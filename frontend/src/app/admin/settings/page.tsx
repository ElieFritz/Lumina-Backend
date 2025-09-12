'use client';

import { useState, useEffect } from 'react';
import { 
  Cog6ToothIcon, 
  ShieldCheckIcon,
  BellIcon,
  CreditCardIcon,
  GlobeAltIcon,
  KeyIcon,
  WrenchScrewdriverIcon,
  CloudIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Settings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    language: string;
    currency: string;
  };
  security: {
    enableTwoFactor: boolean;
    sessionTimeout: number;
    passwordMinLength: number;
    requireEmailVerification: boolean;
    allowRegistration: boolean;
    maxLoginAttempts: number;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    adminNotifications: boolean;
    userNotifications: boolean;
  };
  payment: {
    enablePayments: boolean;
    defaultCurrency: string;
    commissionRate: number;
    paymentMethods: string[];
    refundPolicy: string;
  };
  api: {
    googlePlacesApiKey: string;
    googleMapsApiKey: string;
    stripeApiKey: string;
    smsApiKey: string;
    emailApiKey: string;
  };
  maintenance: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    allowedIps: string[];
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    general: {
      siteName: 'Lumina Africa',
      siteDescription: 'Plateforme de réservation d\'événements en Afrique',
      siteUrl: 'https://lumina.africa',
      adminEmail: 'admin@lumina.africa',
      timezone: 'Africa/Abidjan',
      language: 'fr',
      currency: 'XOF',
    },
    security: {
      enableTwoFactor: true,
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireEmailVerification: true,
      allowRegistration: true,
      maxLoginAttempts: 5,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      adminNotifications: true,
      userNotifications: true,
    },
    payment: {
      enablePayments: true,
      defaultCurrency: 'XOF',
      commissionRate: 5,
      paymentMethods: ['mobile_money', 'card', 'bank_transfer'],
      refundPolicy: 'Remboursement possible jusqu\'à 24h avant l\'événement',
    },
    api: {
      googlePlacesApiKey: 'AIzaSyA65He8HtRvO3GsZq_p1swrJH9GmSmWuU',
      googleMapsApiKey: 'AIzaSyA65He8HtRvO3GsZq_p1swrJH9GmSmWuU',
      stripeApiKey: '',
      smsApiKey: '',
      emailApiKey: '',
    },
    maintenance: {
      maintenanceMode: false,
      maintenanceMessage: 'Le site est temporairement en maintenance. Nous serons bientôt de retour !',
      allowedIps: ['127.0.0.1', '::1'],
    },
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const tabs = [
    { id: 'general', name: 'Général', icon: Cog6ToothIcon },
    { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'payment', name: 'Paiements', icon: CreditCardIcon },
    { id: 'api', name: 'API & Intégrations', icon: KeyIcon },
    { id: 'maintenance', name: 'Maintenance', icon: WrenchScrewdriverIcon },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    setSaveStatus('saving');
    
    // Simuler la sauvegarde
    setTimeout(() => {
      setIsLoading(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleInputChange = (section: keyof Settings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (section: keyof Settings, field: string, value: string[]) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom du site</label>
        <input
          type="text"
          value={settings.general.siteName}
          onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Description du site</label>
        <textarea
          rows={3}
          value={settings.general.siteDescription}
          onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">URL du site</label>
        <input
          type="url"
          value={settings.general.siteUrl}
          onChange={(e) => handleInputChange('general', 'siteUrl', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Email administrateur</label>
        <input
          type="email"
          value={settings.general.adminEmail}
          onChange={(e) => handleInputChange('general', 'adminEmail', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fuseau horaire</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Africa/Abidjan">Abidjan (GMT+0)</option>
            <option value="Africa/Dakar">Dakar (GMT+0)</option>
            <option value="Africa/Lagos">Lagos (GMT+1)</option>
            <option value="Africa/Cairo">Le Caire (GMT+2)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Langue</label>
          <select
            value={settings.general.language}
            onChange={(e) => handleInputChange('general', 'language', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Devise</label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="XOF">Franc CFA (XOF)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">Dollar US (USD)</option>
            <option value="NGN">Naira (NGN)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Authentification à deux facteurs</label>
          <p className="text-sm text-gray-500">Exiger la 2FA pour les administrateurs</p>
        </div>
        <button
          onClick={() => handleInputChange('security', 'enableTwoFactor', !settings.security.enableTwoFactor)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            settings.security.enableTwoFactor ? 'bg-primary-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings.security.enableTwoFactor ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Délai d'expiration de session (minutes)</label>
        <input
          type="number"
          value={settings.security.sessionTimeout}
          onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Longueur minimale du mot de passe</label>
        <input
          type="number"
          value={settings.security.passwordMinLength}
          onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Vérification email obligatoire</label>
          <p className="text-sm text-gray-500">Exiger la vérification email pour les nouveaux comptes</p>
        </div>
        <button
          onClick={() => handleInputChange('security', 'requireEmailVerification', !settings.security.requireEmailVerification)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            settings.security.requireEmailVerification ? 'bg-primary-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings.security.requireEmailVerification ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Autoriser l'inscription</label>
          <p className="text-sm text-gray-500">Permettre aux utilisateurs de s'inscrire</p>
        </div>
        <button
          onClick={() => handleInputChange('security', 'allowRegistration', !settings.security.allowRegistration)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            settings.security.allowRegistration ? 'bg-primary-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings.security.allowRegistration ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Tentatives de connexion max</label>
        <input
          type="number"
          value={settings.security.maxLoginAttempts}
          onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Notifications email</label>
          <p className="text-sm text-gray-500">Activer les notifications par email</p>
        </div>
        <button
          onClick={() => handleInputChange('notifications', 'emailNotifications', !settings.notifications.emailNotifications)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            settings.notifications.emailNotifications ? 'bg-primary-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings.notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Notifications SMS</label>
          <p className="text-sm text-gray-500">Activer les notifications par SMS</p>
        </div>
        <button
          onClick={() => handleInputChange('notifications', 'smsNotifications', !settings.notifications.smsNotifications)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            settings.notifications.smsNotifications ? 'bg-primary-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings.notifications.smsNotifications ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Notifications push</label>
          <p className="text-sm text-gray-500">Activer les notifications push</p>
        </div>
        <button
          onClick={() => handleInputChange('notifications', 'pushNotifications', !settings.notifications.pushNotifications)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            settings.notifications.pushNotifications ? 'bg-primary-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings.notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Notifications admin</label>
          <p className="text-sm text-gray-500">Notifications pour les administrateurs</p>
        </div>
        <button
          onClick={() => handleInputChange('notifications', 'adminNotifications', !settings.notifications.adminNotifications)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            settings.notifications.adminNotifications ? 'bg-primary-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings.notifications.adminNotifications ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Notifications utilisateurs</label>
          <p className="text-sm text-gray-500">Notifications pour les utilisateurs</p>
        </div>
        <button
          onClick={() => handleInputChange('notifications', 'userNotifications', !settings.notifications.userNotifications)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            settings.notifications.userNotifications ? 'bg-primary-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings.notifications.userNotifications ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Activer les paiements</label>
          <p className="text-sm text-gray-500">Permettre les paiements en ligne</p>
        </div>
        <button
          onClick={() => handleInputChange('payment', 'enablePayments', !settings.payment.enablePayments)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            settings.payment.enablePayments ? 'bg-primary-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings.payment.enablePayments ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Devise par défaut</label>
        <select
          value={settings.payment.defaultCurrency}
          onChange={(e) => handleInputChange('payment', 'defaultCurrency', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="XOF">Franc CFA (XOF)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="USD">Dollar US (USD)</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Taux de commission (%)</label>
        <input
          type="number"
          step="0.1"
          value={settings.payment.commissionRate}
          onChange={(e) => handleInputChange('payment', 'commissionRate', parseFloat(e.target.value))}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Méthodes de paiement</label>
        <div className="mt-2 space-y-2">
          {['mobile_money', 'card', 'bank_transfer', 'cash'].map((method) => (
            <label key={method} className="flex items-center">
              <input
                type="checkbox"
                checked={settings.payment.paymentMethods.includes(method)}
                onChange={(e) => {
                  const methods = e.target.checked
                    ? [...settings.payment.paymentMethods, method]
                    : settings.payment.paymentMethods.filter(m => m !== method);
                  handleArrayChange('payment', 'paymentMethods', methods);
                }}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {method === 'mobile_money' ? 'Mobile Money' :
                 method === 'card' ? 'Carte bancaire' :
                 method === 'bank_transfer' ? 'Virement bancaire' :
                 'Espèces'}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Politique de remboursement</label>
        <textarea
          rows={3}
          value={settings.payment.refundPolicy}
          onChange={(e) => handleInputChange('payment', 'refundPolicy', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  );

  const renderApiSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Clé API Google Places</label>
        <input
          type="password"
          value={settings.api.googlePlacesApiKey}
          onChange={(e) => handleInputChange('api', 'googlePlacesApiKey', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Clé API Google Maps</label>
        <input
          type="password"
          value={settings.api.googleMapsApiKey}
          onChange={(e) => handleInputChange('api', 'googleMapsApiKey', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Clé API Stripe</label>
        <input
          type="password"
          value={settings.api.stripeApiKey}
          onChange={(e) => handleInputChange('api', 'stripeApiKey', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Clé API SMS</label>
        <input
          type="password"
          value={settings.api.smsApiKey}
          onChange={(e) => handleInputChange('api', 'smsApiKey', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Clé API Email</label>
        <input
          type="password"
          value={settings.api.emailApiKey}
          onChange={(e) => handleInputChange('api', 'emailApiKey', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  );

  const renderMaintenanceSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700">Mode maintenance</label>
          <p className="text-sm text-gray-500">Activer le mode maintenance</p>
        </div>
        <button
          onClick={() => handleInputChange('maintenance', 'maintenanceMode', !settings.maintenance.maintenanceMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
            settings.maintenance.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              settings.maintenance.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      {settings.maintenance.maintenanceMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Mode maintenance activé
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Le site est actuellement en mode maintenance. Seuls les administrateurs peuvent y accéder.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Message de maintenance</label>
        <textarea
          rows={3}
          value={settings.maintenance.maintenanceMessage}
          onChange={(e) => handleInputChange('maintenance', 'maintenanceMessage', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">IPs autorisées</label>
        <textarea
          rows={3}
          value={settings.maintenance.allowedIps.join('\n')}
          onChange={(e) => handleArrayChange('maintenance', 'allowedIps', e.target.value.split('\n').filter(ip => ip.trim()))}
          placeholder="Une IP par ligne"
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Liste des adresses IP autorisées à accéder au site en mode maintenance
        </p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'api':
        return renderApiSettings();
      case 'maintenance':
        return renderMaintenanceSettings();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="mt-2 text-gray-600">
            Configurez les paramètres de la plateforme
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {saveStatus === 'saved' && (
            <div className="flex items-center text-green-600">
              <CheckIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Sauvegardé</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center text-red-600">
              <XMarkIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Erreur</span>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sauvegarde...
              </>
            ) : (
              'Sauvegarder'
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
