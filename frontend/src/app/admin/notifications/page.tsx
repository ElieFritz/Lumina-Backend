'use client';

import { useState, useEffect } from 'react';
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  PaperAirplaneIcon,
  UsersIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'promotion';
  target: 'all' | 'owners' | 'users' | 'specific';
  targetUsers?: string[];
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
  stats?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  };
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  notifications: Notification[];
  status: 'draft' | 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'campaigns'>('notifications');

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setNotifications([
        {
          id: '1',
          title: 'Nouveau lieu disponible',
          message: 'Découvrez le nouveau restaurant "Le Baobab" qui vient d\'ouvrir ses portes à Abidjan !',
          type: 'info',
          target: 'all',
          status: 'sent',
          sentAt: '2024-01-15T10:30:00',
          createdAt: '2024-01-15T10:00:00',
          createdBy: { name: 'Admin User', email: 'admin@lumina.africa' },
          stats: { sent: 2847, delivered: 2801, opened: 1456, clicked: 234 },
        },
        {
          id: '2',
          title: 'Promotion spéciale - 50% de réduction',
          message: 'Profitez de 50% de réduction sur tous les événements ce weekend ! Code: WEEKEND50',
          type: 'promotion',
          target: 'users',
          status: 'scheduled',
          scheduledAt: '2024-01-20T09:00:00',
          createdAt: '2024-01-15T14:20:00',
          createdBy: { name: 'Admin User', email: 'admin@lumina.africa' },
        },
        {
          id: '3',
          title: 'Maintenance programmée',
          message: 'Une maintenance est prévue le 22 janvier de 2h à 4h. Le service sera temporairement indisponible.',
          type: 'warning',
          target: 'all',
          status: 'draft',
          createdAt: '2024-01-15T16:45:00',
          createdBy: { name: 'Admin User', email: 'admin@lumina.africa' },
        },
        {
          id: '4',
          title: 'Bienvenue sur Lumina Africa',
          message: 'Merci de vous être inscrit ! Découvrez tous les événements disponibles dans votre ville.',
          type: 'success',
          target: 'users',
          status: 'sent',
          sentAt: '2024-01-14T08:15:00',
          createdAt: '2024-01-14T08:00:00',
          createdBy: { name: 'Admin User', email: 'admin@lumina.africa' },
          stats: { sent: 156, delivered: 152, opened: 98, clicked: 45 },
        },
        {
          id: '5',
          title: 'Erreur de paiement',
          message: 'Nous avons rencontré un problème avec votre paiement. Veuillez réessayer ou contacter le support.',
          type: 'error',
          target: 'specific',
          targetUsers: ['user1', 'user2'],
          status: 'failed',
          createdAt: '2024-01-15T11:30:00',
          createdBy: { name: 'Admin User', email: 'admin@lumina.africa' },
        },
      ]);

      setCampaigns([
        {
          id: '1',
          name: 'Campagne de lancement',
          description: 'Notifications de bienvenue pour les nouveaux utilisateurs',
          notifications: [],
          status: 'active',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15',
        },
        {
          id: '2',
          name: 'Promotions weekend',
          description: 'Campagne de promotions pour les weekends',
          notifications: [],
          status: 'draft',
          createdAt: '2024-01-10',
          updatedAt: '2024-01-15',
        },
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = notifications;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === typeFilter);
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(notification => notification.status === statusFilter);
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchTerm, typeFilter, statusFilter]);

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      info: { color: 'blue', text: 'Information', icon: BellIcon },
      warning: { color: 'yellow', text: 'Avertissement', icon: ClockIcon },
      error: { color: 'red', text: 'Erreur', icon: XMarkIcon },
      success: { color: 'green', text: 'Succès', icon: CheckIcon },
      promotion: { color: 'purple', text: 'Promotion', icon: PaperAirplaneIcon },
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'gray', text: 'Brouillon', icon: DocumentTextIcon },
      scheduled: { color: 'yellow', text: 'Programmé', icon: ClockIcon },
      sent: { color: 'green', text: 'Envoyé', icon: CheckIcon },
      failed: { color: 'red', text: 'Échoué', icon: XMarkIcon },
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

  const getTargetBadge = (target: string) => {
    const targetConfig = {
      all: { color: 'blue', text: 'Tous', icon: UsersIcon },
      owners: { color: 'purple', text: 'Propriétaires', icon: UsersIcon },
      users: { color: 'green', text: 'Utilisateurs', icon: UsersIcon },
      specific: { color: 'orange', text: 'Spécifique', icon: UsersIcon },
    };

    const config = targetConfig[target as keyof typeof targetConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusChange = (notificationId: string, newStatus: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId ? { ...notification, status: newStatus as any } : notification
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Notifications</h1>
          <p className="mt-2 text-gray-600">
            Créez et gérez les notifications et campagnes
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Créer une notification
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <BellIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Envoyées</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.status === 'sent').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Programmées</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100">
              <XMarkIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Échouées</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'campaigns'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Campagnes
            </button>
          </nav>
        </div>

        {activeTab === 'notifications' && (
          <div className="p-6">
            {/* Filters */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une notification..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Tous les types</option>
                  <option value="info">Information</option>
                  <option value="warning">Avertissement</option>
                  <option value="error">Erreur</option>
                  <option value="success">Succès</option>
                  <option value="promotion">Promotion</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="draft">Brouillon</option>
                  <option value="scheduled">Programmé</option>
                  <option value="sent">Envoyé</option>
                  <option value="failed">Échoué</option>
                </select>

                {/* Results count */}
                <div className="flex items-center text-sm text-gray-600">
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  {filteredNotifications.length} notification{filteredNotifications.length > 1 ? 's' : ''} trouvée{filteredNotifications.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Notifications Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notification
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cible
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statistiques
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNotifications.map((notification) => (
                    <tr key={notification.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BellIcon className="h-8 w-8 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {notification.message}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatDate(notification.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(notification.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTargetBadge(notification.target)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(notification.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.stats ? (
                          <div>
                            <div>Envoyées: {notification.stats.sent}</div>
                            <div>Ouvertes: {notification.stats.opened}</div>
                            <div className="text-xs text-gray-500">
                              Taux: {((notification.stats.opened / notification.stats.sent) * 100).toFixed(1)}%
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedNotification(notification);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          {notification.status === 'draft' && (
                            <button
                              onClick={() => handleStatusChange(notification.id, 'scheduled')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                          )}
                          {notification.status === 'scheduled' && (
                            <button
                              onClick={() => handleStatusChange(notification.id, 'sent')}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <PaperAirplaneIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="p-6">
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune campagne</h3>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par créer une nouvelle campagne de notifications.
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Créer une campagne
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification Details Modal */}
      {showModal && selectedNotification && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails de la notification
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
                    {selectedNotification.title}
                  </h4>
                  <p className="text-gray-600 mt-2">{selectedNotification.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <div className="mt-1">{getTypeBadge(selectedNotification.type)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <div className="mt-1">{getStatusBadge(selectedNotification.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cible</label>
                    <div className="mt-1">{getTargetBadge(selectedNotification.target)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Créé par</label>
                    <p className="text-sm text-gray-900">{selectedNotification.createdBy.name}</p>
                    <p className="text-sm text-gray-600">{selectedNotification.createdBy.email}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de création</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedNotification.createdAt)}</p>
                </div>
                
                {selectedNotification.scheduledAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date programmée</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedNotification.scheduledAt)}</p>
                  </div>
                )}
                
                {selectedNotification.sentAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date d'envoi</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedNotification.sentAt)}</p>
                  </div>
                )}
                
                {selectedNotification.stats && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statistiques</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Envoyées</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedNotification.stats.sent}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Livrées</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedNotification.stats.delivered}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ouvertes</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedNotification.stats.opened}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cliquées</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedNotification.stats.clicked}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
                {selectedNotification.status === 'draft' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedNotification.id, 'scheduled');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Programmer
                  </button>
                )}
                {selectedNotification.status === 'scheduled' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedNotification.id, 'sent');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Envoyer maintenant
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Créer une notification
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Titre</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Titre de la notification"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Contenu de la notification"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="info">Information</option>
                      <option value="warning">Avertissement</option>
                      <option value="error">Erreur</option>
                      <option value="success">Succès</option>
                      <option value="promotion">Promotion</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cible</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="all">Tous les utilisateurs</option>
                      <option value="owners">Propriétaires de lieux</option>
                      <option value="users">Utilisateurs uniquement</option>
                      <option value="specific">Utilisateurs spécifiques</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Programmer l'envoi (optionnel)</label>
                  <input
                    type="datetime-local"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
