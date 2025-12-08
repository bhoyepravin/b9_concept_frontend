import React from "react";
import HeroSection from "./HeroSection";
import SufferingSection from "./SufferingSection";
import SufferingBreakdownSection from "./SufferingBreakdownSection";
import SolutionSection from "./SolutionSection";
import GlobalPresenceSection from "./GlobalPresenceSection";
import WhyChooseSection from "./WhyChooseSection";
import ResearchSection from "./ResearchSection";
import ComparisonSection from "./ComparisonSection";
import TestimonialSection from "./TestimonialSection";
import TruthSection from "./TruthSection";
import PackagesSection from "./PackagesSection";
import PackageComparison from "./PackageComparison";
import BookingSection from "./BookingSection";
import VideoHeroSection from "./VideoHeroSection";
import ContactSection from "./ContactSection";

function Home() {
  return (
    <div>
      <VideoHeroSection />
      <HeroSection />
      <SufferingSection />
      {/* <SufferingBreakdownSection /> */}
      <SolutionSection />
      <GlobalPresenceSection />
      <WhyChooseSection />
      <ResearchSection />
      <ComparisonSection />
      <TestimonialSection />
      <TruthSection />
      {/* <PackagesSection /> */}
      <PackageComparison />
      <ContactSection />
      <BookingSection />
    </div>
  );
}

export default Home;
