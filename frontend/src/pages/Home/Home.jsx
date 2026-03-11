import { useSelector } from 'react-redux';
import HeroSection from './sections/HeroSection';
import ComparisonSection from './sections/ComparisonSection';
import TrustSection from './sections/TrustSection';
import TutorialsSection from './sections/TutorialsSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';

const Home = () => {
  // Los productos ya están cargados en App.jsx, solo los usamos aquí
  const { items: products, loading } = useSelector((state) => state.products);

  return (
    <div className="home-page">
      <HeroSection />
      <ComparisonSection />
      <TrustSection />
      <TutorialsSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
};

export default Home;
