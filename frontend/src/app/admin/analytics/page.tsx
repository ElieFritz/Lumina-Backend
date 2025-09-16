'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  UsersIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalEvents: number;
    totalVenues: number;
    totalRevenue: number;
    userGrowth: number;
    eventGrowth: number;
    revenueGrowth: number;
    venueGrowth: number;
  };
  userStats: {
    newUsers: number;
    activeUsers: number;
    userRetention: number;
    userSatisfaction: number;
  };
  eventStats: {
    totalEvents: number;
    publishedEvents: number;
    cancelledEvents: number;
    averageAttendance: number;
  };
  revenueStats: {
    totalRevenue: number;
    monthlyRevenue: number;
    averageTicketPrice: number;
    commissionEarned: number;
  };
  topVenues: {
    id: string;
    name: string;
    city: string;
    eventsCount: number;
    revenue: number;
    rating: number;
  }[];
  topEvents: {
    id: string;
    title: string;
    venue: string;
    attendance: number;
    revenue: number;
    date: string;
  }[];
  monthlyData: {
    month: string;
    users: number;
    events: number;
    revenue: number;
  }[];
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setAnalyticsData({
        overview: {
          totalUsers: 2847,
          totalEvents: 156,
          totalVenues: 89,
          totalRevenue: 2450000,
          userGrowth: 15.2,
          eventGrowth: 8.5,
          revenueGrowth: 23.1,
          venueGrowth: 12.3,
        },
        userStats: {
          newUsers: 156,
          activeUsers: 1847,
          userRetention: 78.5,
          userSatisfaction: 4.2,
        },
        eventStats: {
          totalEvents: 156,
          publishedEvents: 142,
          cancelledEvents: 14,
          averageAttendance: 67.8,
        },
        revenueStats: {
          totalRevenue: 2450000,
          monthlyRevenue: 456000,
          averageTicketPrice: 18500,
          commissionEarned: 122500,
        },
        topVenues: [
          {
            id: '1',
            name: 'Restaurant Le Baobab',
            city: 'Abidjan',
            eventsCount: 23,
            revenue: 456000,
            rating: 4.5,
          },
          {
            id: '2',
            name: 'Cinéma Canal Olympia',
            city: 'Abidjan',
            eventsCount: 18,
            revenue: 234000,
            rating: 4.2,
          },
          {
            id: '3',
            name: 'Lounge Sky Bar',
            city: 'Abidjan',
            eventsCount: 15,
            revenue: 189000,
            rating: 4.7,
          },
        ],
        topEvents: [
          {
            id: '1',
            title: 'Concert Youssou N\'Dour',
            venue: 'Restaurant Le Baobab',
            attendance: 95,
            revenue: 2375000,
            date: '2024-12-15',
          },
          {
            id: '2',
            title: 'Soirée Jazz au Lounge',
            venue: 'Lounge Sky Bar',
            attendance: 45,
            revenue: 675000,
            date: '2024-12-18',
          },
          {
            id: '3',
            title: 'Avant-première Black Panther 3',
            venue: 'Cinéma Canal Olympia',
            attendance: 120,
            revenue: 600000,
            date: '2024-12-20',
          },
        ],
        monthlyData: [
          { month: 'Jan', users: 2100, events: 45, revenue: 1800000 },
          { month: 'Fév', users: 2300, events: 52, revenue: 1950000 },
          { month: 'Mar', users: 2500, events: 48, revenue: 2100000 },
          { month: 'Avr', users: 2650, events: 55, revenue: 2200000 },
          { month: 'Mai', users: 2800, events: 62, revenue: 2350000 },
          { month: 'Juin', users: 2847, events: 156, revenue: 2450000 },
        ],
      });
      setIsLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune donnée disponible</h3>
        <p className="mt-1 text-sm text-gray-500">
          Les données d'analyse ne sont pas encore disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Rapports</h1>
          <p className="mt-2 text-gray-600">
            Analysez les performances de la plateforme
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="1y">1 an</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.overview.totalUsers)}
              </p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analyticsData.overview.userGrowth)}
                <span className={`text-sm ${getGrowthColor(analyticsData.overview.userGrowth)}`}>
                  {analyticsData.overview.userGrowth}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <CalendarDaysIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Événements</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.overview.totalEvents)}
              </p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analyticsData.overview.eventGrowth)}
                <span className={`text-sm ${getGrowthColor(analyticsData.overview.eventGrowth)}`}>
                  {analyticsData.overview.eventGrowth}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lieux</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.overview.totalVenues)}
              </p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analyticsData.overview.venueGrowth)}
                <span className={`text-sm ${getGrowthColor(analyticsData.overview.venueGrowth)}`}>
                  {analyticsData.overview.venueGrowth}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100">
              <CreditCardIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenus</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsData.overview.totalRevenue)}
              </p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analyticsData.overview.revenueGrowth)}
                <span className={`text-sm ${getGrowthColor(analyticsData.overview.revenueGrowth)}`}>
                  {analyticsData.overview.revenueGrowth}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Utilisateurs</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Nouveaux utilisateurs</span>
              <span className="font-semibold text-gray-900">{formatNumber(analyticsData.userStats.newUsers)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Utilisateurs actifs</span>
              <span className="font-semibold text-gray-900">{formatNumber(analyticsData.userStats.activeUsers)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rétention</span>
              <span className="font-semibold text-gray-900">{analyticsData.userStats.userRetention}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Satisfaction</span>
              <span className="font-semibold text-gray-900">{analyticsData.userStats.userSatisfaction}/5</span>
            </div>
          </div>
        </div>

        {/* Event Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Événements</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total événements</span>
              <span className="font-semibold text-gray-900">{formatNumber(analyticsData.eventStats.totalEvents)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Publiés</span>
              <span className="font-semibold text-gray-900">{formatNumber(analyticsData.eventStats.publishedEvents)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Annulés</span>
              <span className="font-semibold text-gray-900">{formatNumber(analyticsData.eventStats.cancelledEvents)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taux d'occupation moyen</span>
              <span className="font-semibold text-gray-900">{analyticsData.eventStats.averageAttendance}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Analytics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Revenus</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Revenus totaux</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.revenueStats.totalRevenue)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Revenus mensuels</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.revenueStats.monthlyRevenue)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Prix moyen billet</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.revenueStats.averageTicketPrice)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Commissions gagnées</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.revenueStats.commissionEarned)}</p>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Venues */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Lieux</h3>
          <div className="space-y-4">
            {analyticsData.topVenues.map((venue, index) => (
              <div key={venue.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-primary-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{venue.name}</p>
                    <p className="text-sm text-gray-600">{venue.city}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(venue.revenue)}</p>
                  <p className="text-sm text-gray-600">{venue.eventsCount} événements</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Événements</h3>
          <div className="space-y-4">
            {analyticsData.topEvents.map((event, index) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-primary-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.venue}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(event.revenue)}</p>
                  <p className="text-sm text-gray-600">{event.attendance} participants</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendances Mensuelles</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mois
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateurs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Événements
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenus
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.monthlyData.map((data, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {data.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(data.users)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(data.events)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(data.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

