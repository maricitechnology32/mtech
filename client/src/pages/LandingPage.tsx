import React from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Services from '../components/Services';
import BusinessGrowth from '../components/BusinessGrowth';
import Projects from '../components/Projects';
import WhyChooseUs from '../components/WhyChooseUs';
import Team from '../components/Team';
import Partners from '../components/Partners';
import ValueProposition from '../components/ValueProposition';
import Testimonials from '../components/Testimonials';
import Careers from '../components/Careers';
import Blog from '../components/Blog';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen">
            <Navigation />
            <Hero />
            <Partners />
            <Projects />
            <Services />
            <BusinessGrowth />
            {/* <ValueProposition /> */}



            <Testimonials />
            <WhyChooseUs />
            <Team />
            <Blog />
            <Careers />
            <Contact />
            <Footer />
        </div>
    );
};

export default LandingPage;


