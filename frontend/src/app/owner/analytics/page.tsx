'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  HeartIcon,
  ShoppingBagIcon,
  ClockIcon,
  MapPinIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  RefreshIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: number;
    daily: number;
    growth: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    growth: number;
  };
  reservations: {
    total: number;
    confirmed: number;
    cancelled: number;
    noShow: number;
    growth: number;
  };
  reviews: {
    average: number;
    total: number;
    positive: number;
    negative: number;
    growth: number;
  };
  traffic: {
    total: number;
    organic: number;
    direct: number;
    social: number;
    referral: number;
  };
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  topEvents: Array<{
    id: string;
    name: string;
    reservations: number;
    revenue: number;
  }>;
  topCustomers: Array<{
    id: string;
    name: string;
    visits: number;
    totalSpent: number;
    lastVisit: string;
  }>;
  monthlyData: Array<{
    month: string;
    revenue: number;
    reservations: number;
    customers: number;
  }>;
}

interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  pointsPerVisit: number;
  pointsPerSpent: number;
  rewards: Array<{
    id: string;
    name: string;
    pointsRequired: number;
    description: string;
  }>;
  totalMembers: number;
  activeMembers: number;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Données de test
  useEffect(() => {
    const mockAnalytics: AnalyticsData = {
      revenue: {
        total: 1250000,
        monthly: 85000,
        daily: 2800,
        growth: 12.5
      },
      customers: {
        total: 1250,
        new: 85,
        returning: 1165,
        growth: 8.3
      },
      reservations: {
        total: 2100,
        confirmed: 1950,
        cancelled: 100,
        noShow: 50,
        growth: 15.2
      },
      reviews: {
        average: 4.3,
        total: 245,
        positive: 198,
        negative: 47,
        growth: 5.7
      },
      traffic: {
        total: 15420,
        organic: 6200,
        direct: 4800,
        social: 2800,
        referral: 1620
      },
      devices: {
        mobile: 65,
        desktop: 30,
        tablet: 5
      },
      topEvents: [
        { id: '1', name: 'Dîner romantique', reservations: 45, revenue: 13500 },
        { id: '2', name: 'Déjeuner d\'affaires', reservations: 38, revenue: 11400 },
        { id: '3', name: 'Brunch dominical', reservations: 52, revenue: 10400 },
        { id: '4', name: 'Soirée dégustation', reservations: 28, revenue: 8400 }
      ],
      topCustomers: [
        { id: '1', name: 'Fatou Diallo', visits: 12, totalSpent: 2400, lastVisit: '2024-01-15' },
        { id: '2', name: 'Moussa Traoré', visits: 10, totalSpent: 1800, lastVisit: '2024-01-14' },
        { id: '3', name: 'Aminata Koné', visits: 8, totalSpent: 1600, lastVisit: '2024-01-13' },
        { id: '4', name: 'Ibrahim Ouattara', visits: 7, totalSpent: 1400, lastVisit: '2024-01-12' }
      ],
      monthlyData: [
        { month: 'Jan', revenue: 75000, reservations: 1800, customers: 1100 },
        { month: 'Fév', revenue: 82000, reservations: 1950, customers: 1200 },
        { month: 'Mar', revenue: 78000, reservations: 1850, customers: 1150 },
        { month: 'Avr', revenue: 85000, reservations: 2100, customers: 1250 }
      ]
    };

    const mockLoyaltyProgram: LoyaltyProgram = {
      id: '1',
      name: 'Programme Fidélité Lumina',
      description: 'Gagnez des points à chaque visite et échangez-les contre des récompenses exclusives',
      pointsPerVisit: 10,
      pointsPerSpent: 1,
      totalMembers: 450,
      activeMembers: 320,
      rewards: [
        { id: '1', name: 'Boisson gratuite', pointsRequired: 50, description: 'Une boisson au choix' },
        { id: '2', name: 'Dessert offert', pointsRequired: 100, description: 'Un dessert de la carte' },
        { id: '3', name: 'Réduction 10%', pointsRequired: 200, description: '10% de réduction sur votre facture' },
        { id: '4', name: 'Repas gratuit', pointsRequired: 500, description: 'Un repas complet pour 2 personnes' }
      ]
    };

    setAnalyticsData(mockAnalytics);
    setLoyaltyProgram(mockLoyaltyProgram);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (!analyticsData || !loyaltyProgram) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ArrowPathIcon className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Fidélisation</h1>
          <p className="text-gray-600">Analysez vos performances et gérez votre programme de fidélité</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="1y">1 an</option>
          </select>
          <button className="btn-outline">
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsData.revenue.monthly)}
              </p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analyticsData.revenue.growth)}
                <span className={`text-sm ml-1 ${getGrowthColor(analyticsData.revenue.growth)}`}>
                  {analyticsData.revenue.growth > 0 ? '+' : ''}{analyticsData.revenue.growth}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clients</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.customers.total)}
              </p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analyticsData.customers.growth)}
                <span className={`text-sm ml-1 ${getGrowthColor(analyticsData.customers.growth)}`}>
                  {analyticsData.customers.growth > 0 ? '+' : ''}{analyticsData.customers.growth}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Réservations</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.reservations.total)}
              </p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analyticsData.reservations.growth)}
                <span className={`text-sm ml-1 ${getGrowthColor(analyticsData.reservations.growth)}`}>
                  {analyticsData.reservations.growth > 0 ? '+' : ''}{analyticsData.reservations.growth}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CalendarDaysIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Note moyenne</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.reviews.average}/5
              </p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analyticsData.reviews.growth)}
                <span className={`text-sm ml-1 ${getGrowthColor(analyticsData.reviews.growth)}`}>
                  {analyticsData.reviews.growth > 0 ? '+' : ''}{analyticsData.reviews.growth}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <StarIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des revenus */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Évolution des revenus</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded">Revenus</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">Réservations</button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.monthlyData.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-primary-500 rounded-t"
                  style={{ height: `${(data.revenue / 100000) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                <span className="text-xs text-gray-500">{formatCurrency(data.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sources de trafic */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Sources de trafic</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-700">Recherche organique</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(analyticsData.traffic.organic)} ({Math.round((analyticsData.traffic.organic / analyticsData.traffic.total) * 100)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-700">Accès direct</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(analyticsData.traffic.direct)} ({Math.round((analyticsData.traffic.direct / analyticsData.traffic.total) * 100)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-sm text-gray-700">Réseaux sociaux</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(analyticsData.traffic.social)} ({Math.round((analyticsData.traffic.social / analyticsData.traffic.total) * 100)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm text-gray-700">Référencement</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatNumber(analyticsData.traffic.referral)} ({Math.round((analyticsData.traffic.referral / analyticsData.traffic.total) * 100)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top événements */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top événements</h2>
          <div className="space-y-4">
            {analyticsData.topEvents.map((event, index) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{event.name}</h3>
                    <p className="text-sm text-gray-600">{event.reservations} réservations</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(event.revenue)}</p>
                  <p className="text-sm text-gray-600">CA</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top clients */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top clients</h2>
          <div className="space-y-4">
            {analyticsData.topCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-600">{customer.visits} visites</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(customer.totalSpent)}</p>
                  <p className="text-sm text-gray-600">Total dépensé</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Programme de fidélité */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Programme de fidélité</h2>
          <button className="btn-primary">
            <HeartIcon className="w-5 h-5 mr-2" />
            Gérer le programme
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <UsersIcon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{loyaltyProgram.totalMembers}</p>
            <p className="text-sm text-gray-600">Membres total</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <HeartIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{loyaltyProgram.activeMembers}</p>
            <p className="text-sm text-gray-600">Membres actifs</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <StarIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{loyaltyProgram.rewards.length}</p>
            <p className="text-sm text-gray-600">Récompenses</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loyaltyProgram.rewards.map((reward) => (
            <div key={reward.id} className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">{reward.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary-600">{reward.pointsRequired} pts</span>
                <button className="text-sm text-gray-500 hover:text-gray-700">Modifier</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
