import { Hero } from '@/components/features/Hero';
import { ValueProposition } from '@/components/features/ValueProposition';
import { QuickSearch } from '@/components/features/QuickSearch';
import { UrgencySection } from '@/components/features/UrgencySection';
import { FeaturedVenues } from '@/components/features/FeaturedVenues';
import { Categories } from '@/components/features/Categories';
import { StatsSection } from '@/components/features/StatsSection';
import { HowItWorks } from '@/components/features/HowItWorks';
import { EconomicImpact } from '@/components/features/EconomicImpact';
import { SocialProof } from '@/components/features/SocialProof';
import { GrowthHacking } from '@/components/features/GrowthHacking';
import { MobileApp } from '@/components/features/MobileApp';
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
        <ValueProposition />
        <QuickSearch />
        <UrgencySection />
        <FeaturedVenues />
        <Categories />
        <StatsSection />
        <HowItWorks />
        <EconomicImpact />
        <SocialProof />
        <GrowthHacking />
        <MobileApp />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

