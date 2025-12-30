import { useState, useEffect, useRef } from 'react';
import { Code2, Smartphone, Brain, Palette, ShoppingCart, Globe, Settings, Zap, Layers, ArrowRight, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  gradient: string;
  isActive: boolean;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Code2, Smartphone, Brain, Palette, ShoppingCart, Globe, Settings, Zap, Layers
};

const fallbackServices = [
  { _id: '1', icon: 'Code2', title: 'Web Development', description: 'Modern, scalable web solutions built with cutting-edge technologies. SEO-optimized and designed to convert.', features: ['Responsive Design', 'SEO Optimized', 'High Performance', 'Secure Architecture'], gradient: 'from-blue-500 to-blue-700', isActive: true },
  { _id: '2', icon: 'Smartphone', title: 'Mobile Apps', description: 'Native and cross-platform mobile applications for iOS and Android with intuitive user experiences.', features: ['iOS & Android', 'Cross-Platform', 'Cloud Integration', 'Scalable'], gradient: 'from-cyan-500 to-blue-600', isActive: true },
  { _id: '3', icon: 'Brain', title: 'AI Solutions', description: 'Transform your business with intelligent automation and data-driven insights.', features: ['Machine Learning', 'Automation', 'Data Analytics', 'Predictive Models'], gradient: 'from-violet-500 to-purple-700', isActive: true },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/services`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 0) {
          setServices(data);
        } else {
          setServices(fallbackServices);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices(fallbackServices);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Premium GSAP Animations
  useEffect(() => {
    if (isLoading || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header with text split effect
      const headerItems = headerRef.current?.children;
      if (headerItems) {
        gsap.fromTo(
          headerItems,
          { opacity: 0, y: 40, rotateX: -15 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Cards with staggered 3D flip reveal
      const cards = cardsRef.current?.children;
      if (cards) {
        Array.from(cards).forEach((card, index) => {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              rotateY: 90,
              scale: 0.8,
              transformPerspective: 1000,
            },
            {
              opacity: 1,
              rotateY: 0,
              scale: 1,
              duration: 0.8,
              delay: index * 0.15,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          );

          // Icon spin on card reveal
          const icon = card.querySelector('.service-icon');
          if (icon) {
            gsap.fromTo(
              icon,
              { rotate: -180, scale: 0 },
              {
                rotate: 0,
                scale: 1,
                duration: 0.6,
                delay: 0.3 + index * 0.15,
                ease: 'back.out(2)',
                scrollTrigger: {
                  trigger: cardsRef.current,
                  start: 'top 80%',
                  toggleActions: 'play none none none',
                },
              }
            );
          }

          // Feature items stagger
          const features = card.querySelectorAll('.feature-item');
          if (features.length) {
            gsap.fromTo(
              features,
              { opacity: 0, x: -20 },
              {
                opacity: 1,
                x: 0,
                duration: 0.4,
                stagger: 0.08,
                delay: 0.5 + index * 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: cardsRef.current,
                  start: 'top 80%',
                  toggleActions: 'play none none none',
                },
              }
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading]);

  // 3D Magnetic card hover effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  if (isLoading) {
    return (
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="services" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16" style={{ perspective: '1000px' }}>
          <p className="text-blue-600 font-medium text-sm uppercase tracking-wide mb-2 opacity-0">What We Do</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 opacity-0">Our Services</h2>
          <p className="text-gray-600 opacity-0">
            Comprehensive solutions designed to accelerate your digital transformation and drive measurable results.
          </p>
        </div>

        {/* Services Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: '1000px' }}>
          {services.map((service) => {
            const Icon = iconMap[service.icon] || Code2;
            return (
              <div
                key={service._id}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="group relative bg-white border border-gray-200 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:border-blue-200 opacity-0"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                {/* Icon */}
                <div className={`service-icon relative w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <Icon className="text-white" size={28} />
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{service.description}</p>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {service.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="feature-item flex items-center text-sm text-gray-600">
                      <div className={`w-2 h-2 bg-gradient-to-r ${service.gradient} rounded-full mr-3`} />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Link */}
                <a
                  href="#contact"
                  className="relative inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors overflow-hidden group/link"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Learn More
                    <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 group-hover/link:w-full transition-all duration-300" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
