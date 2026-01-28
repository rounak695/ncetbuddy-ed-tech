import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Mentors } from "@/components/landing/Mentors";
import { Footer } from "@/components/landing/Footer";
import { Segmentation } from "@/components/landing/Segmentation";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Hero />
      <Segmentation />
      <Features />
      <Mentors />
      <Footer />
    </main>
  );
}
