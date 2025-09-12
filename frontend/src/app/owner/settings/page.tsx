'use client';

import { useState, useEffect } from 'react';
import { 
  CogIcon,
  UserIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

interface BusinessSettings {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  businessLicense: string;
  openingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  timezone: string;
  currency: string;
  language: string;
}

interface PaymentSettings {
  stripeEnabled: boolean;
  paystackEnabled: boolean;
  mobileMoneyEnabled: boolean;
  bankTransferEnabled: boolean;
  cashEnabled: boolean;
  stripePublicKey: string;
  paystackPublicKey: string;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  commissionRate: number;
  payoutSchedule: 'daily' | 'weekly' | 'monthly';
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  reservationAlerts: boolean;
  paymentAlerts: boolean;
  reviewAlerts: boolean;
  marketingEmails: boolean;
  weeklyReports: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginAttempts: number;
  ipWhitelist: string[];
  auditLogs: boolean;
}

interface ComplianceSettings {
  gdprCompliant: boolean;
  dataRetentionPeriod: number;
  cookieConsent: boolean;
  privacyPolicy: string;
  termsOfService: string;
  refundPolicy: string;
  cancellationPolicy: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business');
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [complianceSettings, setComplianceSettings] = useState<ComplianceSettings | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Données de test
  useEffect(() => {
    const mockBusinessSettings: BusinessSettings = {
      name: 'Restaurant Le Bistrot',
      description: 'Restaurant gastronomique spécialisé dans la cuisine française et africaine',
      address: '123 Avenue de la République, Cocody, Abidjan, Côte d\'Ivoire',
      phone: '+225 20 30 40 50',
      email: 'contact@lebistrot.ci',
      website: 'https://www.lebistrot.ci',
      taxId: 'CI123456789',
      businessLicense: 'LIC-2024-001',
      openingHours: {
        monday: { open: '08:00', close: '22:00', closed: false },
        tuesday: { open: '08:00', close: '22:00', closed: false },
        wednesday: { open: '08:00', close: '22:00', closed: false },
        thursday: { open: '08:00', close: '22:00', closed: false },
        friday: { open: '08:00', close: '23:00', closed: false },
        saturday: { open: '09:00', close: '23:00', closed: false },
        sunday: { open: '10:00', close: '21:00', closed: false }
      },
      timezone: 'Africa/Abidjan',
      currency: 'XOF',
      language: 'fr'
    };

    const mockPaymentSettings: PaymentSettings = {
      stripeEnabled: true,
      paystackEnabled: true,
      mobileMoneyEnabled: true,
      bankTransferEnabled: true,
      cashEnabled: true,
      stripePublicKey: 'pk_test_...',
      paystackPublicKey: 'pk_test_...',
      bankAccount: {
        bankName: 'SGBCI',
        accountNumber: '1234567890',
        accountName: 'Restaurant Le Bistrot'
      },
      commissionRate: 2.5,
      payoutSchedule: 'weekly'
    };

    const mockNotificationSettings: NotificationSettings = {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      reservationAlerts: true,
      paymentAlerts: true,
      reviewAlerts: true,
      marketingEmails: false,
      weeklyReports: true
    };

    const mockSecuritySettings: SecuritySettings = {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipWhitelist: ['192.168.1.1', '10.0.0.1'],
      auditLogs: true
    };

    const mockComplianceSettings: ComplianceSettings = {
      gdprCompliant: true,
      dataRetentionPeriod: 365,
      cookieConsent: true,
      privacyPolicy: 'https://www.lebistrot.ci/privacy',
      termsOfService: 'https://www.lebistrot.ci/terms',
      refundPolicy: 'https://www.lebistrot.ci/refund',
      cancellationPolicy: 'https://www.lebistrot.ci/cancellation'
    };

    setBusinessSettings(mockBusinessSettings);
    setPaymentSettings(mockPaymentSettings);
    setNotificationSettings(mockNotificationSettings);
    setSecuritySettings(mockSecuritySettings);
    setComplianceSettings(mockComplianceSettings);
  }, []);

  const tabs = [
    { id: 'business', name: 'Informations', icon: BuildingOfficeIcon },
    { id: 'payment', name: 'Paiements', icon: CreditCardIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon },
    { id: 'compliance', name: 'Conformité', icon: DocumentTextIcon }
  ];

  const renderBusinessSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Informations de l'établissement</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-outline"
        >
          <PencilIcon className="w-4 h-4 mr-2" />
          {isEditing ? 'Annuler' : 'Modifier'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'établissement</label>
          <input
            type="text"
            value={businessSettings?.name || ''}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={businessSettings?.email || ''}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
          <input
            type="tel"
            value={businessSettings?.phone || ''}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
          <input
            type="url"
            value={businessSettings?.website || ''}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
          <textarea
            value={businessSettings?.address || ''}
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={businessSettings?.description || ''}
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>
      </div>

      {/* Horaires d'ouverture */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-4">Horaires d'ouverture</h3>
        <div className="space-y-3">
          {Object.entries(businessSettings?.openingHours || {}).map(([day, hours]) => (
            <div key={day} className="flex items-center space-x-4">
              <div className="w-24">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {day === 'monday' ? 'Lundi' :
                   day === 'tuesday' ? 'Mardi' :
                   day === 'wednesday' ? 'Mercredi' :
                   day === 'thursday' ? 'Jeudi' :
                   day === 'friday' ? 'Vendredi' :
                   day === 'saturday' ? 'Samedi' : 'Dimanche'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={!hours.closed}
                  disabled={!isEditing}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">Ouvert</span>
              </div>
              {!hours.closed && (
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={hours.open}
                    disabled={!isEditing}
                    className="px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-50"
                  />
                  <span className="text-sm text-gray-600">à</span>
                  <input
                    type="time"
                    value={hours.close}
                    disabled={!isEditing}
                    className="px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-50"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Paramètres de paiement</h2>

      {/* Méthodes de paiement */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-4">Méthodes de paiement acceptées</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <input type="checkbox" checked={paymentSettings?.stripeEnabled} className="rounded border-gray-300" />
              <span className="text-sm font-medium text-gray-900">Stripe (Cartes bancaires)</span>
            </div>
            <span className="text-xs text-gray-500">2.9% + 0.30€</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <input type="checkbox" checked={paymentSettings?.paystackEnabled} className="rounded border-gray-300" />
              <span className="text-sm font-medium text-gray-900">Paystack (Mobile Money)</span>
            </div>
            <span className="text-xs text-gray-500">1.5%</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <input type="checkbox" checked={paymentSettings?.mobileMoneyEnabled} className="rounded border-gray-300" />
              <span className="text-sm font-medium text-gray-900">Mobile Money</span>
            </div>
            <span className="text-xs text-gray-500">1.0%</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <input type="checkbox" checked={paymentSettings?.bankTransferEnabled} className="rounded border-gray-300" />
              <span className="text-sm font-medium text-gray-900">Virement bancaire</span>
            </div>
            <span className="text-xs text-gray-500">Gratuit</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <input type="checkbox" checked={paymentSettings?.cashEnabled} className="rounded border-gray-300" />
              <span className="text-sm font-medium text-gray-900">Espèces</span>
            </div>
            <span className="text-xs text-gray-500">Gratuit</span>
          </div>
        </div>
      </div>

      {/* Compte bancaire */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-4">Compte bancaire</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Banque</label>
            <input
              type="text"
              value={paymentSettings?.bankAccount.bankName || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de compte</label>
            <input
              type="text"
              value={paymentSettings?.bankAccount.accountNumber || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom du compte</label>
            <input
              type="text"
              value={paymentSettings?.bankAccount.accountName || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Paramètres de versement */}
      <div>
        <h3 className="text-md font-semibold text-gray-900 mb-4">Paramètres de versement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Taux de commission Lumina</label>
            <div className="relative">
              <input
                type="number"
                value={paymentSettings?.commissionRate || 0}
                step="0.1"
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-2 text-sm text-gray-500">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fréquence de versement</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="daily">Quotidien</option>
              <option value="weekly" selected>Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Paramètres de notifications</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Notifications par email</h3>
            <p className="text-sm text-gray-600">Recevoir les notifications importantes par email</p>
          </div>
          <input type="checkbox" checked={notificationSettings?.emailNotifications} className="rounded border-gray-300" />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Notifications SMS</h3>
            <p className="text-sm text-gray-600">Recevoir les alertes urgentes par SMS</p>
          </div>
          <input type="checkbox" checked={notificationSettings?.smsNotifications} className="rounded border-gray-300" />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Notifications push</h3>
            <p className="text-sm text-gray-600">Recevoir les notifications sur votre appareil</p>
          </div>
          <input type="checkbox" checked={notificationSettings?.pushNotifications} className="rounded border-gray-300" />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Alertes de réservation</h3>
            <p className="text-sm text-gray-600">Être notifié des nouvelles réservations</p>
          </div>
          <input type="checkbox" checked={notificationSettings?.reservationAlerts} className="rounded border-gray-300" />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Alertes de paiement</h3>
            <p className="text-sm text-gray-600">Être notifié des paiements reçus</p>
          </div>
          <input type="checkbox" checked={notificationSettings?.paymentAlerts} className="rounded border-gray-300" />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Alertes d'avis</h3>
            <p className="text-sm text-gray-600">Être notifié des nouveaux avis clients</p>
          </div>
          <input type="checkbox" checked={notificationSettings?.reviewAlerts} className="rounded border-gray-300" />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Emails marketing</h3>
            <p className="text-sm text-gray-600">Recevoir les offres et promotions Lumina</p>
          </div>
          <input type="checkbox" checked={notificationSettings?.marketingEmails} className="rounded border-gray-300" />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Rapports hebdomadaires</h3>
            <p className="text-sm text-gray-600">Recevoir un résumé hebdomadaire de vos performances</p>
          </div>
          <input type="checkbox" checked={notificationSettings?.weeklyReports} className="rounded border-gray-300" />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Paramètres de sécurité</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Authentification à deux facteurs</h3>
            <p className="text-sm text-gray-600">Ajouter une couche de sécurité supplémentaire</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${securitySettings?.twoFactorEnabled ? 'text-green-600' : 'text-gray-500'}`}>
              {securitySettings?.twoFactorEnabled ? 'Activé' : 'Désactivé'}
            </span>
            <button className="btn-outline text-sm">
              {securitySettings?.twoFactorEnabled ? 'Désactiver' : 'Activer'}
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Délai d'expiration de session</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Expire après</span>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="15">15 minutes</option>
              <option value="30" selected>30 minutes</option>
              <option value="60">1 heure</option>
              <option value="120">2 heures</option>
            </select>
            <span className="text-sm text-gray-600">d'inactivité</span>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Expiration du mot de passe</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Expire après</span>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="30">30 jours</option>
              <option value="60">60 jours</option>
              <option value="90" selected>90 jours</option>
              <option value="180">180 jours</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Tentatives de connexion</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Bloquer après</span>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="3">3 tentatives</option>
              <option value="5" selected>5 tentatives</option>
              <option value="10">10 tentatives</option>
            </select>
            <span className="text-sm text-gray-600">échouées</span>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Liste blanche IP</h3>
          <div className="space-y-2">
            {securitySettings?.ipWhitelist.map((ip, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={ip}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button className="btn-outline text-sm">
              <PlusIcon className="w-4 h-4 mr-2" />
              Ajouter une IP
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Journal d'audit</h3>
            <p className="text-sm text-gray-600">Enregistrer toutes les activités du compte</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${securitySettings?.auditLogs ? 'text-green-600' : 'text-gray-500'}`}>
              {securitySettings?.auditLogs ? 'Activé' : 'Désactivé'}
            </span>
            <button className="btn-outline text-sm">
              {securitySettings?.auditLogs ? 'Désactiver' : 'Activer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComplianceSettings = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Conformité et légal</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Conformité RGPD</h3>
            <p className="text-sm text-gray-600">Respect des réglementations sur la protection des données</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-600">Conforme</span>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Période de rétention des données</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Conserver les données pendant</span>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="90">90 jours</option>
              <option value="180">180 jours</option>
              <option value="365" selected>1 an</option>
              <option value="730">2 ans</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Consentement aux cookies</h3>
            <p className="text-sm text-gray-600">Afficher le banner de consentement aux cookies</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${complianceSettings?.cookieConsent ? 'text-green-600' : 'text-gray-500'}`}>
              {complianceSettings?.cookieConsent ? 'Activé' : 'Désactivé'}
            </span>
            <button className="btn-outline text-sm">
              {complianceSettings?.cookieConsent ? 'Désactiver' : 'Activer'}
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Politiques légales</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Politique de confidentialité</span>
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={complianceSettings?.privacyPolicy || ''}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="btn-outline text-sm">Modifier</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Conditions d'utilisation</span>
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={complianceSettings?.termsOfService || ''}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="btn-outline text-sm">Modifier</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Politique de remboursement</span>
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={complianceSettings?.refundPolicy || ''}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="btn-outline text-sm">Modifier</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Politique d'annulation</span>
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  value={complianceSettings?.cancellationPolicy || ''}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="btn-outline text-sm">Modifier</button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Conseil juridique</h3>
              <p className="text-sm text-blue-700 mt-1">
                Nous recommandons de faire vérifier vos politiques légales par un avocat spécialisé 
                pour vous assurer de leur conformité avec la législation locale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres & Conformité</h1>
          <p className="text-gray-600">Gérez les paramètres de votre établissement et assurez la conformité</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-outline">
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Exporter
          </button>
          <button className="btn-primary">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Sauvegarder
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'business' && renderBusinessSettings()}
          {activeTab === 'payment' && renderPaymentSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'compliance' && renderComplianceSettings()}
        </div>
      </div>
    </div>
  );
}
