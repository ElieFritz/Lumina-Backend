import { Hero } from '@/components/features/Hero';
import { FeaturedVenues } from '@/components/features/FeaturedVenues';
import { Categories } from '@/components/features/Categories';
import { HowItWorks } from '@/components/features/HowItWorks';
import { Testimonials } from '@/components/features/Testimonials';
import { Newsletter } from '@/components/features/Newsletter';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturedVenues />
        <Categories />
        <HowItWorks />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

