import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Mentors } from "@/components/landing/Mentors";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Mentors />
      <Footer />
    </main>
  );
}
