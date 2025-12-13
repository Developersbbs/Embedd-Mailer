"use client";

import Hero from '@/components/landing/Hero';
import SocialProof from '@/components/landing/SocialProof';
import WebFeatureGrid from '@/components/landing/WebFeatureGrid';
import Steps from '@/components/landing/Steps';
import SecurityHighlight from '@/components/landing/SecurityHighlight';
import AnalyticsPreview from '@/components/landing/AnalyticsPreview';
import DeveloperSection from '@/components/landing/DeveloperSection';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <SocialProof />
      <WebFeatureGrid />
      <Steps />
      <SecurityHighlight />
      <AnalyticsPreview />
      <DeveloperSection />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
