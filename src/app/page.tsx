import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/layout/HeroSection";
import PortfolioSection from "../components/shared/PortfolioSection";
import NewsletterSignup from "../components/shared/NewsletterSignup";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--gray-black)]">
      <Navbar />
      <HeroSection />
      <PortfolioSection />
      {/* <NewsletterSignup /> */}
      <Footer />
    </div>
  );
}