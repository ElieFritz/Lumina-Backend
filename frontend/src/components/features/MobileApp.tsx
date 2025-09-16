'use client';

import { useState } from 'react';
import { 
  DevicePhoneMobileIcon, 
  QrCodeIcon, 
  MapPinIcon, 
  BellIcon,
  CreditCardIcon,
  ShareIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface AppFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

export function MobileApp() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features: AppFeature[] = [
    {
      id: 'qr',
      title: 'QR Code instantané',
      description: 'Présentez votre QR code à l\'entrée, plus besoin d\'imprimer vos billets',
      icon: QrCodeIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'location',
      title: 'Géolocalisation intelligente',
      description: 'Trouvez les meilleurs endroits près de vous avec des recommandations personnalisées',
      icon: MapPinIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'notifications',
      title: 'Notifications push',
      description: 'Recevez des alertes sur les nouveaux événements et offres spéciales',
      icon: BellIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'payment',
      title: 'Paiement mobile',
      description: 'Payez avec Mobile Money, Orange Money ou votre carte bancaire',
      icon: CreditCardIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 'social',
      title: 'Partage social',
      description: 'Partagez vos expériences et invitez vos amis facilement',
      icon: ShareIcon,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      id: 'rewards',
      title: 'Programme de récompenses',
      description: 'Gagnez des points et débloquez des avantages exclusifs',
      icon: StarIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const stats = [
    { label: 'Téléchargements', value: '50K+', icon: DevicePhoneMobileIcon },
    { label: 'Note moyenne', value: '4.8/5', icon: StarIcon },
    { label: 'Temps d\'ouverture', value: '< 2s', icon: ClockIcon }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 rounded-full px-4 py-2 mb-6">
              <DevicePhoneMobileIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Application Mobile</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
              Votre sortie parfaite dans votre poche
            </h2>
            
            <p className="text-xl text-gray-600 mb-8">
              L'application Lumina Africa vous donne accès à tous les meilleurs endroits 
              d'Afrique avec des fonctionnalités exclusives conçues pour la classe émergente.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                      activeFeature === index
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 bg-white hover:border-primary-300'
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${feature.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-xs">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center space-x-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Télécharger sur</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
              
              <button className="flex items-center justify-center space-x-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Télécharger sur</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative">
            <div className="relative mx-auto w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 py-3 bg-primary-600 text-white text-sm">
                  <span>9:41</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                
                {/* App Content */}
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-2xl">E</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Lumina Africa</h3>
                    <p className="text-gray-600 text-sm">Découvrez les meilleures sorties</p>
                  </div>
                  
                  {/* Feature Highlight */}
                  <div className="bg-primary-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <QrCodeIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">QR Code prêt</h4>
                        <p className="text-sm text-gray-600">Présentez à l'entrée</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-gray-100 rounded-lg p-3 text-center">
                      <MapPinIcon className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                      <span className="text-xs text-gray-700">Près de moi</span>
                    </button>
                    <button className="bg-gray-100 rounded-lg p-3 text-center">
                      <StarIcon className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                      <span className="text-xs text-gray-700">Favoris</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-white text-sm">✨</span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-xs">💚</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
