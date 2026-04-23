import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { LogoBar } from "@/components/LogoBar";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { FAQSection } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { getTestimonials, getFAQs } from "@/lib/queries";

export default async function LandingPage() {
  const [testimonials, faqs] = await Promise.all([
    getTestimonials(),
    getFAQs(),
  ]);

  return (
    <>
      <Nav />
      <main className="min-h-screen">
        <Hero />
        <LogoBar />
        <Features />
        <Pricing />
        <Testimonials testimonials={testimonials} />
        <FAQSection faqs={faqs} />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
