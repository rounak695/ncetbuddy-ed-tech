import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Mentors } from "@/components/landing/Mentors";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Hero />
      <Features />
      <Mentors />
      <Footer />
    </main>
  );
}
