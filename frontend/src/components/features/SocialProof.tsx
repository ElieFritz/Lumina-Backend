'use client';

import { useState, useEffect } from 'react';
import { 
  StarIcon, 
  UserGroupIcon, 
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

interface SocialProof {
  id: string;
  type: 'testimonial' | 'stat' | 'achievement';
  content: string;
  author?: string;
  role?: string;
  company?: string;
  rating?: number;
  metric?: string;
  icon?: React.ComponentType<any>;
  color?: string;
}

export function SocialProof() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials: SocialProof[] = [
    {
      id: '1',
      type: 'testimonial',
      content: "Lumina Africa a transformé mon business. Mes revenus ont augmenté de 60% en 6 mois grâce à la visibilité sur la plateforme.",
      author: "Marie Kouamé",
      role: "Propriétaire de restaurant",
      company: "Le Bistrot Parisien",
      rating: 5
    },
    {
      id: '2',
      type: 'testimonial',
      content: "En tant qu'étudiant, je peux maintenant découvrir de nouveaux endroits sans me ruiner. Les réductions sont incroyables !",
      author: "Koffi Traoré",
      role: "Étudiant en informatique",
      company: "Université Félix Houphouët-Boigny",
      rating: 5
    },
    {
      id: '3',
      type: 'testimonial',
      content: "L'application est intuitive et les paiements Mobile Money sont très pratiques. Parfait pour l'Afrique !",
      author: "Fatou Diallo",
      role: "Entrepreneure",
      company: "Startup Tech",
      rating: 5
    }
  ];

  const achievements: SocialProof[] = [
    {
      id: 'a1',
      type: 'achievement',
      content: "Prix de l'Innovation Digitale 2024",
      icon: CheckBadgeIcon,
      color: 'text-blue-600'
    },
    {
      id: 'a2',
      type: 'achievement',
      content: "Meilleure App Lifestyle - Afrique de l'Ouest",
      icon: StarIcon,
      color: 'text-yellow-600'
    },
    {
      id: 'a3',
      type: 'achievement',
      content: "Certification ISO 27001 - Sécurité des données",
      icon: CheckBadgeIcon,
      color: 'text-green-600'
    }
  ];

  const stats: SocialProof[] = [
    {
      id: 's1',
      type: 'stat',
      metric: '4.8/5',
      content: 'Note moyenne sur les stores',
      icon: StarIcon,
      color: 'text-yellow-600'
    },
    {
      id: 's2',
      type: 'stat',
      metric: '98%',
      content: 'Taux de satisfaction client',
      icon: UserGroupIcon,
      color: 'text-green-600'
    },
    {
      id: 's3',
      type: 'stat',
      metric: '500+',
      content: 'Partenaires satisfaits',
      icon: BuildingOfficeIcon,
      color: 'text-blue-600'
    },
    {
      id: 's4',
      type: 'stat',
      metric: '2M+',
      content: 'FCFA économisés par nos utilisateurs',
      icon: CurrencyDollarIcon,
      color: 'text-green-600'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Des milliers d'utilisateurs et d'entrepreneurs nous font confiance pour transformer 
            l'économie des sorties en Afrique
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="mb-16">
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="w-6 h-6 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <blockquote className="text-xl text-gray-700 mb-6 italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {testimonials[currentTestimonial].author?.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">
                      {testimonials[currentTestimonial].author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonials[currentTestimonial].role}
                    </div>
                    <div className="text-sm text-primary-600">
                      {testimonials[currentTestimonial].company}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => {
            const Icon = stat.icon!;
            return (
              <div key={stat.id} className="text-center">
                <div className={`w-16 h-16 ${stat.color?.replace('text-', 'bg-').replace('-600', '-100')} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.metric}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievements */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Reconnaissances et certifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement) => {
              const Icon = achievement.icon!;
              return (
                <div key={achievement.id} className="flex items-center space-x-4 bg-white rounded-lg p-4 shadow-sm">
                  <div className={`w-12 h-12 ${achievement.color?.replace('text-', 'bg-').replace('-600', '-100')} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${achievement.color}`} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {achievement.content}
                    </div>
                    <div className="text-sm text-gray-600">
                      Certifié et vérifié
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-8">
            Partenaires et intégrations
          </h3>
          <div className="flex flex-wrap justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Orange Money</div>
            <div className="text-2xl font-bold text-gray-400">MTN Mobile Money</div>
            <div className="text-2xl font-bold text-gray-400">Paystack</div>
            <div className="text-2xl font-bold text-gray-400">Stripe</div>
            <div className="text-2xl font-bold text-gray-400">Google Maps</div>
            <div className="text-2xl font-bold text-gray-400">Facebook</div>
          </div>
        </div>
      </div>
    </section>
  );
}
