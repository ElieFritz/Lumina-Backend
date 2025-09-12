'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  UserIcon, 
  HeartIcon, 
  ShoppingBagIcon, 
  MapPinIcon,
  CalendarDaysIcon,
  StarIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  MegaphoneIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600">Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Réservations',
      value: '12',
      icon: ShoppingBagIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Favoris',
      value: '8',
      icon: HeartIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      name: 'Événements à venir',
      value: '3',
      icon: CalendarDaysIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Avis donnés',
      value: '5',
      icon: StarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'reservation',
      title: 'Réservation confirmée',
      description: 'Le Rooftop Abidjan - 15 Janvier 2024',
      time: 'Il y a 2 heures',
      status: 'confirmed',
    },
    {
      id: 2,
      type: 'review',
      title: 'Avis publié',
      description: 'Cinéma Pathé Cocody - 5 étoiles',
      time: 'Il y a 1 jour',
      status: 'completed',
    },
    {
      id: 3,
      type: 'favorite',
      title: 'Ajouté aux favoris',
      description: 'Restaurant Le Bistrot',
      time: 'Il y a 3 jours',
      status: 'saved',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container-custom py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Bonjour, {user?.firstName} ! 👋
          </h1>
          <p className="text-gray-600">
            Voici un aperçu de votre activité sur Lumina Africa
          </p>
        </div>

        {/* Owner Dashboard Section */}
        {(user?.role === 'owner' || user?.role === 'manager') && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    🏢 Dashboard Propriétaire
                  </h2>
                  <p className="text-primary-100">
                    Gérez votre établissement et vos événements
                  </p>
                </div>
                <button
                  onClick={() => router.push('/owner')}
                  className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Accéder au Dashboard
                </button>
              </div>
            </div>
            
            {/* Owner Quick Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/owner/venue')}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Mon Établissement</h3>
                    <p className="text-sm text-gray-600">Gérer les informations</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/owner/events')}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CalendarIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Mes Événements</h3>
                    <p className="text-sm text-gray-600">Créer et gérer</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/owner/reservations')}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ClipboardDocumentListIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Réservations</h3>
                    <p className="text-sm text-gray-600">Voir et gérer</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/owner/payments')}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <CreditCardIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Paiements</h3>
                    <p className="text-sm text-gray-600">Suivre les transactions</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/owner/marketing')}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <MegaphoneIcon className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Marketing</h3>
                    <p className="text-sm text-gray-600">Campagnes et promotions</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/owner/reservations/floor-plan')}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <ChartBarIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Plan de Salle</h3>
                    <p className="text-sm text-gray-600">Gérer les tables</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/owner/reviews')}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <StarIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Avis & Réputation</h3>
                    <p className="text-sm text-gray-600">Gérer les avis clients</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/owner/staff')}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Staff & Équipe</h3>
                    <p className="text-sm text-gray-600">Gérer le personnel</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/owner/support')}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Support & Incidents</h3>
                    <p className="text-sm text-gray-600">Gérer les tickets</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/owner/analytics')}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ChartBarIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Analytics & Fidélisation</h3>
                    <p className="text-sm text-gray-600">Analyser les performances</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => router.push('/owner/settings')}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <CogIcon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Paramètres & Conformité</h3>
                    <p className="text-sm text-gray-600">Configurer l'établissement</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Activité récente
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === 'reservation' && (
                        <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
                      )}
                      {activity.type === 'review' && (
                        <StarIcon className="w-6 h-6 text-yellow-600" />
                      )}
                      {activity.type === 'favorite' && (
                        <HeartIcon className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.status === 'confirmed' ? 'Confirmé' :
                         activity.status === 'completed' ? 'Terminé' : 'Sauvegardé'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Actions rapides
              </h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Découvrir près de moi
                    </span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <CalendarDaysIcon className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Événements à venir
                    </span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <HeartIcon className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium text-gray-900">
                      Mes favoris
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Mon profil
              </h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-medium">
                      {user?.firstName?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              <button className="w-full btn-outline text-sm">
                Modifier le profil
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

