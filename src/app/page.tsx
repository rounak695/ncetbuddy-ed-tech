import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { StatsBar } from "@/components/landing/StatsBar";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { TestimonialsGrid } from "@/components/landing/TestimonialsGrid";
import { UniversityLogos } from "@/components/landing/UniversityLogos";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { NRTBanner } from "@/components/landing/NRTBanner";
import JsonLd from "@/components/JsonLd";

const BASE_URL = "https://www.ncetbuddy.in";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NCET Buddy",
  url: BASE_URL,
  description:
    "India's #1 NCET preparation platform offering free and premium mock tests, syllabus, PYQs, and strategies for the National Common Entrance Test.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/dashboard/tests?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NCET Buddy",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    email: "connect@ncetbuddy.in",
    contactType: "customer support",
    availableLanguage: ["English", "Hindi"],
  },
  sameAs: [],
};

const homepageFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is NCET Buddy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NCET Buddy is India's #1 online platform for NCET (National Common Entrance Test) preparation. It offers free and premium NRT mock tests, previous year question papers (PYQs), syllabus guides, and expert preparation strategies for students aiming for ITEP seats in IITs, NITs, and RIEs.",
      },
    },
    {
      "@type": "Question",
      name: "Is NCET Buddy free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, NCET Buddy offers free mock tests including NRT DEMO. Premium full-length NRT mock tests are available at very affordable prices (starting from ₹10) to make quality NCET preparation accessible to all students.",
      },
    },
    {
      "@type": "Question",
      name: "How can I prepare for NCET 2025-26?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Start with understanding the NCET syllabus and exam pattern (160 Qs, 640 marks, 180 minutes). Practice PYQs, attempt full-length mock tests on NCET Buddy, and focus especially on Teaching Aptitude and General Awareness sections that decide ranks.",
      },
    },
    {
      "@type": "Question",
      name: "Which IITs offer ITEP through NCET?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The IITs offering ITEP via NCET include IIT Kharagpur, IIT Bhubaneswar, IIT Ropar, IIT Jodhpur, and IIT (ISM) Dhanbad, among others.",
      },
    },
  ],
};



export default function Home() {
  return (
    <main className="min-h-screen bg-white text-foreground selection:bg-primary/30">
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />
      <JsonLd data={homepageFaqSchema} />
      <Navbar />
      <Hero />
      <StatsBar />
      <NRTBanner />

      <FeaturesGrid />
      <TestimonialsGrid />
      <UniversityLogos />
      <FinalCTA />
      <Footer />
    </main>
  );
}
