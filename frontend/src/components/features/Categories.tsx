import Link from 'next/link';
import { VenueCategory } from '@/types/venue';

const categories = [
  {
    id: VenueCategory.RESTAURANT,
    name: 'Restaurants',
    emoji: '🍽️',
    description: 'Découvrez les meilleures tables',
    color: 'bg-red-500',
    href: '/venues?category=restaurant'
  },
  {
    id: VenueCategory.CINEMA,
    name: 'Cinémas',
    emoji: '🎬',
    description: 'Films et séances',
    color: 'bg-blue-500',
    href: '/venues?category=cinema'
  },
  {
    id: VenueCategory.LOUNGE,
    name: 'Lounges',
    emoji: '🍸',
    description: 'Ambiance détendue',
    color: 'bg-purple-500',
    href: '/venues?category=lounge'
  },
  {
    id: VenueCategory.CONCERT_HALL,
    name: 'Concerts',
    emoji: '🎵',
    description: 'Musique live',
    color: 'bg-green-500',
    href: '/venues?category=concert_hall'
  },
  {
    id: VenueCategory.BAR,
    name: 'Bars',
    emoji: '🍺',
    description: 'Soirées entre amis',
    color: 'bg-yellow-500',
    href: '/venues?category=bar'
  },
  {
    id: VenueCategory.CLUB,
    name: 'Clubs',
    emoji: '🕺',
    description: 'Danse et fête',
    color: 'bg-pink-500',
    href: '/venues?category=club'
  },
  {
    id: VenueCategory.THEATER,
    name: 'Théâtres',
    emoji: '🎭',
    description: 'Spectacles et culture',
    color: 'bg-indigo-500',
    href: '/venues?category=theater'
  },
  {
    id: VenueCategory.SPORTS,
    name: 'Sports',
    emoji: '⚽',
    description: 'Activités sportives',
    color: 'bg-orange-500',
    href: '/venues?category=sports'
  }
];

export function Categories() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Explorez par catégorie
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trouvez exactement ce que vous cherchez
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl">{category.emoji}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

