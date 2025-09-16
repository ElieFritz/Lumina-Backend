'use client';

import { useState } from 'react';
import { 
  GiftIcon, 
  ShareIcon, 
  UserPlusIcon, 
  CurrencyDollarIcon,
  SparklesIcon,
  TrophyIcon,
  FireIcon,
  StarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface GrowthHack {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  reward: string;
  participants: string;
  status: 'active' | 'coming-soon' | 'limited';
}

export function GrowthHacking() {
  const [activeHack, setActiveHack] = useState(0);

  const growthHacks: GrowthHack[] = [
    {
      id: 'referral',
      title: 'Programme de parrainage',
      description: 'Invitez vos amis et gagnez 1000 FCFA par inscription + 500 FCFA pour chaque réservation',
      icon: UserPlusIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      reward: '1000 FCFA + 500 FCFA',
      participants: '2,500+ participants',
      status: 'active'
    },
    {
      id: 'social',
      title: 'Défi social viral',
      description: 'Partagez votre sortie sur les réseaux sociaux avec #LuminaAfrica et gagnez des réductions',
      icon: ShareIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      reward: 'Jusqu\'à 50% de réduction',
      participants: '5,000+ posts',
      status: 'active'
    },
    {
      id: 'loyalty',
      title: 'Programme de fidélité',
      description: 'Cumulez des points à chaque réservation et échangez-les contre des avantages exclusifs',
      icon: StarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      reward: 'Points + avantages VIP',
      participants: '8,000+ membres',
      status: 'active'
    },
    {
      id: 'early-bird',
      title: 'Early Bird Special',
      description: 'Réservez 48h à l\'avance et bénéficiez de 30% de réduction sur tous les événements',
      icon: FireIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      reward: '30% de réduction',
      participants: '1,200+ utilisateurs',
      status: 'limited'
    },
    {
      id: 'group',
      title: 'Réductions de groupe',
      description: 'Plus vous êtes nombreux, plus vous économisez ! Jusqu\'à 40% pour les groupes de 5+',
      icon: UserGroupIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      reward: 'Jusqu\'à 40% de réduction',
      participants: '500+ groupes',
      status: 'active'
    },
    {
      id: 'first-time',
      title: 'Première sortie gratuite',
      description: 'Votre première réservation est offerte ! Découvrez Lumina Africa sans risque',
      icon: GiftIcon,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      reward: '100% gratuit',
      participants: '3,000+ nouveaux',
      status: 'coming-soon'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Actif</span>;
      case 'limited':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Limité</span>;
      case 'coming-soon':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Bientôt</span>;
      default:
        return null;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <SparklesIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Growth Hacking</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Stratégies de croissance intelligentes
          </h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Des mécanismes conçus pour maximiser vos économies et créer une communauté engagée
          </p>
        </div>

        {/* Featured Growth Hack */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-yellow-500 rounded-xl flex items-center justify-center">
                <TrophyIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Programme de parrainage</h3>
                <p className="text-primary-100">Stratégie #1 recommandée</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-300">1000 FCFA</div>
              <div className="text-sm text-primary-100">+ 500 FCFA par réservation</div>
            </div>
          </div>
          <p className="text-lg text-primary-100 mb-6">
            Invitez vos amis et gagnez de l'argent à chaque inscription et réservation. 
            Plus vous parrainez, plus vous gagnez !
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-yellow-500 text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-colors">
              Commencer maintenant
            </button>
            <button className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-colors">
              Voir le classement
            </button>
          </div>
        </div>

        {/* Growth Hacks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {growthHacks.map((hack, index) => {
            const Icon = hack.icon;
            return (
              <div
                key={hack.id}
                className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer ${
                  activeHack === index ? 'ring-2 ring-yellow-400' : ''
                }`}
                onClick={() => setActiveHack(index)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${hack.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${hack.color}`} />
                  </div>
                  {getStatusBadge(hack.status)}
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">
                  {hack.title}
                </h3>
                <p className="text-primary-100 text-sm mb-4">
                  {hack.description}
                </p>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-yellow-300 font-semibold">
                    {hack.reward}
                  </span>
                  <span className="text-primary-200">
                    {hack.participants}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              Prêt à maximiser vos économies ?
            </h3>
            <p className="text-lg text-primary-100 mb-6">
              Rejoignez des milliers d'utilisateurs qui économisent déjà avec nos stratégies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                Démarrer gratuitement
              </button>
              <button className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-colors">
                Télécharger l'app
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
