'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  UsersIcon,
  BuildingOfficeIcon, 
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  totalRevenue: number;
    totalUsers: number;
  totalVenues: number;
    totalEvents: number;
  revenueGrowth: number;
    userGrowth: number;
  venueGrowth: number;
    eventGrowth: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  topVenues: Array<{ name: string; revenue: number; bookings: number }>;
  userActivity: Array<{ date: string; activeUsers: number; newUsers: number }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalUsers: 0,
    totalVenues: 0,
    totalEvents: 0,
    revenueGrowth: 0,
    userGrowth: 0,
    venueGrowth: 0,
    eventGrowth: 0,
    monthlyRevenue: [],
    topVenues: [],
    userActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setAnalytics({
        totalRevenue: 12500000,
          totalUsers: 2847,
        totalVenues: 156,
        totalEvents: 89,
        revenueGrowth: 15.2,
        userGrowth: 23.5,
        venueGrowth: 8.7,
        eventGrowth: 12.3,
        monthlyRevenue: [
          { month: 'Jan', revenue: 8500000 },
          { month: 'Fév', revenue: 9200000 },
          { month: 'Mar', revenue: 10800000 },
          { month: 'Avr', revenue: 11500000 },
          { month: 'Mai', revenue: 12000000 },
          { month: 'Juin', revenue: 12500000 }
        ],
        topVenues: [
          { name: 'Le Rooftop Abidjan', revenue: 2500000, bookings: 145 },
          { name: 'Cinéma Pathé Cocody', revenue: 1800000, bookings: 98 },
          { name: 'Restaurant Le Bistrot', revenue: 1500000, bookings: 87 },
          { name: 'Club Le VIP', revenue: 1200000, bookings: 76 },
          { name: 'Théâtre National', revenue: 900000, bookings: 54 }
        ],
        userActivity: [
          { date: '2024-01-01', activeUsers: 1200, newUsers: 45 },
          { date: '2024-01-02', activeUsers: 1350, newUsers: 52 },
          { date: '2024-01-03', activeUsers: 1420, newUsers: 38 },
          { date: '2024-01-04', activeUsers: 1380, newUsers: 41 },
          { date: '2024-01-05', activeUsers: 1500, newUsers: 67 }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">
            Vue d'ensemble des performances de la plateforme
          </p>
        </div>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="1y">1 an</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenus totaux</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analytics.revenueGrowth)}
                <span className={`text-sm ml-1 ${getGrowthColor(analytics.revenueGrowth)}`}>
                  {analytics.revenueGrowth}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analytics.userGrowth)}
                <span className={`text-sm ml-1 ${getGrowthColor(analytics.userGrowth)}`}>
                  {analytics.userGrowth}%
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
              <p className="text-sm font-medium text-gray-600">Établissements</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalVenues}</p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analytics.venueGrowth)}
                <span className={`text-sm ml-1 ${getGrowthColor(analytics.venueGrowth)}`}>
                  {analytics.venueGrowth}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100">
              <CalendarDaysIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Événements</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalEvents}</p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analytics.eventGrowth)}
                <span className={`text-sm ml-1 ${getGrowthColor(analytics.eventGrowth)}`}>
                  {analytics.eventGrowth}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Évolution des revenus</h2>
          <div className="h-64 flex items-end space-x-2">
            {analytics.monthlyRevenue.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t"
                  style={{ height: `${(data.revenue / Math.max(...analytics.monthlyRevenue.map(d => d.revenue))) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                <span className="text-xs text-gray-500">{formatCurrency(data.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Venues */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top établissements</h2>
          <div className="space-y-4">
            {analytics.topVenues.map((venue, index) => (
              <div key={venue.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-600">
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{venue.name}</p>
                    <p className="text-xs text-gray-500">{venue.bookings} réservations</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(venue.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Activity Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité des utilisateurs</h2>
        <div className="h-64 flex items-end space-x-1">
          {analytics.userActivity.map((data, index) => (
            <div key={data.date} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col space-y-1">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${(data.activeUsers / Math.max(...analytics.userActivity.map(d => d.activeUsers))) * 150}px` }}
                  title={`Utilisateurs actifs: ${data.activeUsers}`}
                ></div>
                <div
                  className="w-full bg-green-500 rounded-b"
                  style={{ height: `${(data.newUsers / Math.max(...analytics.userActivity.map(d => d.newUsers))) * 50}px` }}
                  title={`Nouveaux utilisateurs: ${data.newUsers}`}
                ></div>
              </div>
              <span className="text-xs text-gray-600 mt-2">{new Date(data.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Utilisateurs actifs</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Nouveaux utilisateurs</span>
          </div>
        </div>
      </div>
    </div>
  );
}