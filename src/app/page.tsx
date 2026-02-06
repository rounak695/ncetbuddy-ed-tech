import { LandingCarousel } from "@/components/landing/LandingCarousel";
import { Footer } from "@/components/landing/Footer";
import { Proctoring } from "@/components/landing/Proctoring";
import { Differentiation } from "@/components/landing/Differentiation";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <LandingCarousel />
      <Proctoring />
      <Differentiation />
      <Footer />
    </main>
  );
}
