'use client';

import { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  FireIcon, 
  GiftIcon, 
  UsersIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface UrgencyOffer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discount: number;
  timeLeft: string;
  spotsLeft: number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

export function UrgencySection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  const [currentOffer, setCurrentOffer] = useState(0);

  const urgencyOffers: UrgencyOffer[] = [
    {
      id: '1',
      title: 'Soirée VIP - Club Nocturne',
      description: 'Accès VIP + boissons illimitées + parking gratuit',
      originalPrice: 15000,
      discountPrice: 7500,
      discount: 50,
      timeLeft: '23:45:30',
      spotsLeft: 12,
      icon: FireIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      id: '2',
      title: 'Dîner gastronomique - Restaurant Le Bistrot',
      description: 'Menu dégustation 5 services + vin d\'honneur',
      originalPrice: 25000,
      discountPrice: 15000,
      discount: 40,
      timeLeft: '18:30:15',
      spotsLeft: 8,
      icon: GiftIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: '3',
      title: 'Concert privé - Salle des Fêtes',
      description: 'Concert acoustique + cocktail + rencontre artiste',
      originalPrice: 20000,
      discountPrice: 10000,
      discount: 50,
      timeLeft: '12:15:45',
      spotsLeft: 5,
      icon: UsersIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % urgencyOffers.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [urgencyOffers.length]);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Offres limitées</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            ⚡ Offres flash - Dernières places !
          </h2>
          <p className="text-xl text-red-100 max-w-3xl mx-auto">
            Des réductions exceptionnelles qui expirent bientôt. Ne ratez pas ces opportunités uniques !
          </p>
        </div>

        {/* Main Offer Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 ${urgencyOffers[currentOffer].bgColor} rounded-xl flex items-center justify-center`}>
                  <FireIcon className={`w-8 h-8 ${urgencyOffers[currentOffer].color}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    {urgencyOffers[currentOffer].title}
                  </h3>
                  <p className="text-red-100">
                    {urgencyOffers[currentOffer].description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-yellow-300">
                  -{urgencyOffers[currentOffer].discount}%
                </div>
                <div className="text-sm text-red-100">Réduction</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Price */}
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">
                  {urgencyOffers[currentOffer].discountPrice.toLocaleString()} FCFA
                </div>
                <div className="text-lg text-red-100 line-through">
                  {urgencyOffers[currentOffer].originalPrice.toLocaleString()} FCFA
                </div>
                <div className="text-sm text-red-200">
                  Économisez {urgencyOffers[currentOffer].originalPrice - urgencyOffers[currentOffer].discountPrice} FCFA
                </div>
              </div>

              {/* Time Left */}
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">
                  {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                </div>
                <div className="text-sm text-red-100">Temps restant</div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${((timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds) / (24 * 3600)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Spots Left */}
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">
                  {urgencyOffers[currentOffer].spotsLeft}
                </div>
                <div className="text-sm text-red-100">Places restantes</div>
                <div className="text-xs text-red-200 mt-1">
                  {urgencyOffers[currentOffer].spotsLeft < 10 ? '⚠️ Plus que quelques places !' : 'Disponible'}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center space-x-2">
                <GiftIcon className="w-5 h-5" />
                <span>Réserver maintenant</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-red-600 transition-colors">
                Voir les détails
              </button>
            </div>
          </div>
        </div>

        {/* Other Offers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {urgencyOffers.slice(1).map((offer, index) => {
            const Icon = offer.icon;
            return (
              <div key={offer.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${offer.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${offer.color}`} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-300">
                      -{offer.discount}%
                    </div>
                    <div className="text-xs text-red-100">Réduction</div>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-white mb-2">
                  {offer.title}
                </h4>
                <p className="text-red-100 text-sm mb-4">
                  {offer.description}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-xl font-bold text-yellow-300">
                      {offer.discountPrice.toLocaleString()} FCFA
                    </div>
                    <div className="text-sm text-red-100 line-through">
                      {offer.originalPrice.toLocaleString()} FCFA
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white">
                      {offer.spotsLeft} places
                    </div>
                    <div className="text-xs text-red-200">
                      {offer.timeLeft}
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-white/20 text-white font-semibold py-2 rounded-lg hover:bg-white/30 transition-colors">
                  Réserver
                </button>
              </div>
            );
          })}
        </div>

        {/* Urgency CTA */}
        <div className="mt-12 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              🚨 Ne ratez pas ces offres exceptionnelles !
            </h3>
            <p className="text-lg text-red-100 mb-6">
              Ces réductions ne reviendront pas. Réservez maintenant et économisez des milliers de FCFA !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition-colors">
                Voir toutes les offres
              </button>
              <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-red-600 transition-colors">
                S'abonner aux alertes
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
