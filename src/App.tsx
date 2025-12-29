import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Partners from './components/Partners';
import ValueProposition from './components/ValueProposition';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Services />
      <WhyChooseUs />
      <Partners />
      <ValueProposition />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
