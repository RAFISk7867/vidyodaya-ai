import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { FeatureShowcase } from '../components/landing/FeatureShowcase';
import { HowItWorks } from '../components/landing/HowItWorks';
import { BenefitsSection } from '../components/landing/BenefitsSection';
import { CTASection } from '../components/landing/CTASection';
import { Footer } from '../components/common/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureShowcase />
        <HowItWorks />
        <BenefitsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

