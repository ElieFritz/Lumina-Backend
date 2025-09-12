'use client';

import { useState, useEffect } from 'react';
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  PauseIcon,
  CalendarDaysIcon,
  UsersIcon,
  ChartBarIcon,
  ShareIcon,
  MegaphoneIcon,
  CurrencyDollarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Campaign {
  id: string;
  title: string;
  description: string;
  type: 'promotion' | 'event' | 'newsletter' | 'social';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  targetAudience: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  reach: number;
  clicks: number;
  conversions: number;
  createdAt: string;
  scheduledAt?: string;
  publishedAt?: string;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
  usedCount: number;
  status: 'active' | 'inactive' | 'expired';
  eventId?: string;
  eventTitle?: string;
}

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'promotions'>('campaigns');

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setCampaigns([
        {
          id: '1',
          title: 'Soirée Jazz - Promotion Spéciale',
          description: 'Campagne pour promouvoir la soirée jazz avec réduction de 20%',
          type: 'promotion',
          status: 'active',
          targetAudience: 'Clients fidèles',
          startDate: '2024-01-15',
          endDate: '2024-01-20',
          budget: 50000,
          currency: 'XOF',
          reach: 1250,
          clicks: 89,
          conversions: 12,
          createdAt: '2024-01-10T10:00:00',
          publishedAt: '2024-01-15T09:00:00',
        },
        {
          id: '2',
          title: 'Newsletter Mensuelle',
          description: 'Newsletter avec les événements du mois de février',
          type: 'newsletter',
          status: 'scheduled',
          targetAudience: 'Tous les clients',
          startDate: '2024-02-01',
          endDate: '2024-02-28',
          budget: 0,
          currency: 'XOF',
          reach: 0,
          clicks: 0,
          conversions: 0,
          createdAt: '2024-01-12T14:30:00',
          scheduledAt: '2024-02-01T08:00:00',
        },
        {
          id: '3',
          title: 'Happy Hour - Réseaux Sociaux',
          description: 'Campagne sur Facebook et Instagram pour le happy hour',
          type: 'social',
          status: 'completed',
          targetAudience: '18-35 ans, Abidjan',
          startDate: '2024-01-05',
          endDate: '2024-01-12',
          budget: 25000,
          currency: 'XOF',
          reach: 3200,
          clicks: 156,
          conversions: 23,
          createdAt: '2024-01-03T16:20:00',
          publishedAt: '2024-01-05T10:00:00',
        },
        {
          id: '4',
          title: 'Nouvel Événement - Concert Live',
          description: 'Annonce du nouveau concert live avec groupe local',
          type: 'event',
          status: 'draft',
          targetAudience: 'Amateurs de musique',
          startDate: '2024-02-15',
          endDate: '2024-02-15',
          budget: 75000,
          currency: 'XOF',
          reach: 0,
          clicks: 0,
          conversions: 0,
          createdAt: '2024-01-14T11:45:00',
        },
      ]);

      setPromotions([
        {
          id: '1',
          title: 'Réduction Soirée Jazz',
          description: '20% de réduction sur tous les billets de la soirée jazz',
          discountType: 'percentage',
          discountValue: 20,
          minOrderAmount: 10000,
          maxDiscountAmount: 5000,
          validFrom: '2024-01-15',
          validTo: '2024-01-20',
          usageLimit: 50,
          usedCount: 12,
          status: 'active',
          eventId: '1',
          eventTitle: 'Soirée Jazz au Lounge',
        },
        {
          id: '2',
          title: 'Happy Hour Gratuit',
          description: 'Boisson gratuite pour toute commande de 2 cocktails',
          discountType: 'fixed',
          discountValue: 5000,
          validFrom: '2024-01-20',
          validTo: '2024-01-20',
          usageLimit: 30,
          usedCount: 8,
          status: 'active',
          eventId: '2',
          eventTitle: 'Happy Hour Spécial',
        },
        {
          id: '3',
          title: 'Première Visite',
          description: '10% de réduction pour les nouveaux clients',
          discountType: 'percentage',
          discountValue: 10,
          validFrom: '2024-01-01',
          validTo: '2024-12-31',
          usageLimit: 100,
          usedCount: 25,
          status: 'active',
        },
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = campaigns;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.targetAudience.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    // Filtre par type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign.type === typeFilter);
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm, statusFilter, typeFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'green', text: 'Actif' },
      draft: { color: 'gray', text: 'Brouillon' },
      scheduled: { color: 'blue', text: 'Programmé' },
      paused: { color: 'yellow', text: 'En pause' },
      completed: { color: 'purple', text: 'Terminé' },
      cancelled: { color: 'red', text: 'Annulé' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.text}
      </span>
    );
  };

  const getTypeLabel = (type: string) => {
    const types = {
      promotion: 'Promotion',
      event: 'Événement',
      newsletter: 'Newsletter',
      social: 'Réseaux sociaux',
    };
    return types[type as keyof typeof types] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      promotion: MegaphoneIcon,
      event: CalendarDaysIcon,
      newsletter: BellIcon,
      social: ShareIcon,
    };
    return icons[type as keyof typeof icons] || BellIcon;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'XOF' ? 'XOF' : 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusChange = (campaignId: string, newStatus: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { 
            ...campaign, 
            status: newStatus as any,
            ...(newStatus === 'active' && !campaign.publishedAt ? { publishedAt: new Date().toISOString() } : {}),
          }
        : campaign
    ));
  };

  const calculateROI = (campaign: Campaign) => {
    if (campaign.budget === 0) return 'N/A';
    const revenue = campaign.conversions * 15000; // Estimation du revenu par conversion
    const roi = ((revenue - campaign.budget) / campaign.budget) * 100;
    return `${roi.toFixed(1)}%`;
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
          <h1 className="text-3xl font-bold text-gray-900">Communication & Marketing</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos campagnes et promotions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ShareIcon className="h-5 w-5 mr-2" />
            Réseaux sociaux
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouvelle campagne
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
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
            <button
              onClick={() => setActiveTab('promotions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'promotions'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Promotions
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'campaigns' && (
        <>
          {/* Campaign Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <BellIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Campagnes actives</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {campaigns.filter(c => c.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <UsersIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Portée totale</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {campaigns.reduce((sum, c) => sum + c.reach, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <ChartBarIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Conversions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {campaigns.reduce((sum, c) => sum + c.conversions, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100">
                  <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Budget total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(campaigns.reduce((sum, c) => sum + c.budget, 0), 'XOF')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une campagne..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="draft">Brouillon</option>
                <option value="scheduled">Programmé</option>
                <option value="paused">En pause</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="promotion">Promotion</option>
                <option value="event">Événement</option>
                <option value="newsletter">Newsletter</option>
                <option value="social">Réseaux sociaux</option>
              </select>

              {/* Results count */}
              <div className="flex items-center text-sm text-gray-600">
                <FunnelIcon className="h-4 w-4 mr-2" />
                {filteredCampaigns.length} campagne{filteredCampaigns.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => {
              const TypeIcon = getTypeIcon(campaign.type);
              return (
                <div key={campaign.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <TypeIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-600">
                          {getTypeLabel(campaign.type)}
                        </span>
                      </div>
                      {getStatusBadge(campaign.status)}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{campaign.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cible:</span>
                        <span className="text-gray-900">{campaign.targetAudience}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Budget:</span>
                        <span className="text-gray-900">{formatCurrency(campaign.budget, campaign.currency)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Portée:</span>
                        <span className="text-gray-900">{campaign.reach.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Conversions:</span>
                        <span className="text-gray-900">{campaign.conversions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">ROI:</span>
                        <span className="text-gray-900">{calculateROI(campaign)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {campaign.status === 'draft' && (
                          <button
                            onClick={() => handleStatusChange(campaign.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <PlayIcon className="h-4 w-4" />
                          </button>
                        )}
                        {campaign.status === 'active' && (
                          <button
                            onClick={() => handleStatusChange(campaign.id, 'paused')}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <PauseIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'promotions' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Promotions actives</h2>
            <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouvelle promotion
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promotion) => (
              <div key={promotion.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{promotion.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    promotion.status === 'active' ? 'bg-green-100 text-green-800' :
                    promotion.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {promotion.status === 'active' ? 'Actif' :
                     promotion.status === 'inactive' ? 'Inactif' : 'Expiré'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{promotion.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Réduction:</span>
                    <span className="text-gray-900">
                      {promotion.discountType === 'percentage' 
                        ? `${promotion.discountValue}%` 
                        : formatCurrency(promotion.discountValue, 'XOF')
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Valide jusqu'au:</span>
                    <span className="text-gray-900">{formatDate(promotion.validTo)}</span>
                  </div>
                  {promotion.usageLimit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Utilisations:</span>
                      <span className="text-gray-900">{promotion.usedCount}/{promotion.usageLimit}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaign Details Modal */}
      {showModal && selectedCampaign && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails de la campagne
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
                    {selectedCampaign.title}
                  </h4>
                  <p className="text-gray-600 mt-1">{selectedCampaign.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="text-sm text-gray-900">{getTypeLabel(selectedCampaign.type)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <div className="mt-1">{getStatusBadge(selectedCampaign.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cible</label>
                    <p className="text-sm text-gray-900">{selectedCampaign.targetAudience}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Budget</label>
                    <p className="text-sm text-gray-900">{formatCurrency(selectedCampaign.budget, selectedCampaign.currency)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de début</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedCampaign.startDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedCampaign.endDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Portée</label>
                    <p className="text-sm text-gray-900">{selectedCampaign.reach.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Clics</label>
                    <p className="text-sm text-gray-900">{selectedCampaign.clicks}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Conversions</label>
                    <p className="text-sm text-gray-900">{selectedCampaign.conversions}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ROI</label>
                    <p className="text-sm text-gray-900">{calculateROI(selectedCampaign)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
                {selectedCampaign.status === 'draft' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedCampaign.id, 'active');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Publier
                  </button>
                )}
                {selectedCampaign.status === 'active' && (
                  <button
                    onClick={() => {
                      handleStatusChange(selectedCampaign.id, 'paused');
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700"
                  >
                    Mettre en pause
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
