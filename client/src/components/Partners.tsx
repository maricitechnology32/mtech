import { useState, useEffect, useRef } from 'react';
import { Building2, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Client {
  _id: string;
  name: string;
  industry: string;
  logo?: { url: string };
  isActive: boolean;
}

interface Stats {
  projectsCount: string;
  projectsLabel: string;
  clientsCount: string;
  clientsLabel: string;
  experienceCount: string;
  experienceLabel: string;
  ratingCount: string;
  ratingLabel: string;
}

const fallbackPartners = [
  { _id: '1', name: 'TechCorp', industry: 'Technology', isActive: true },
  { _id: '2', name: 'FinanceFirst', industry: 'Finance', isActive: true },
  { _id: '3', name: 'HealthPlus', industry: 'Healthcare', isActive: true },
  { _id: '4', name: 'RetailMax', industry: 'Retail', isActive: true },
  { _id: '5', name: 'EduTech', industry: 'Education', isActive: true },
  { _id: '6', name: 'LogiFlow', industry: 'Logistics', isActive: true },
];

export default function Partners() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    projectsCount: '5+',
    projectsLabel: 'Projects',
    clientsCount: '20+',
    clientsLabel: 'Clients',
    experienceCount: '5+',
    experienceLabel: 'Years Experience',
    ratingCount: '4.9',
    ratingLabel: 'Satisfaction',
  });

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      // Fetch clients
      try {
        const response = await fetch(`${apiUrl}/clients`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 0) {
          setClients(data);
        } else {
          setClients(fallbackPartners);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        setClients(fallbackPartners);
      }

      // Fetch settings for stats
      try {
        const response = await fetch(`${apiUrl}/settings`);
        if (response.ok) {
          const data = await response.json();
          if (data.stats) {
            setStats({
              projectsCount: data.stats.projectsCount || '5+',
              projectsLabel: 'Projects',
              clientsCount: data.stats.clientsCount || '20+',
              clientsLabel: 'Clients',
              experienceCount: data.stats.experienceCount || '5+',
              experienceLabel: data.stats.experienceLabel || 'Years Experience',
              ratingCount: data.stats.ratingCount || '4.9',
              ratingLabel: 'Satisfaction',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }

      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Auto-scroll carousel animation
  useEffect(() => {
    if (isLoading || !carouselRef.current || clients.length === 0) return;

    const carousel = carouselRef.current;
    const firstChild = carousel.firstElementChild as HTMLElement;
    if (!firstChild) return;

    // Calculate the width of one set of items
    const itemWidth = firstChild.offsetWidth + 24; // width + gap
    const totalWidth = itemWidth * clients.length;

    // Set initial position off-screen to the left
    gsap.set(carousel, { x: -totalWidth });

    // Create infinite loop animation (LEFT TO RIGHT, seamless)
    animationRef.current = gsap.to(carousel, {
      x: 0,
      duration: 30, // Adjust speed here (higher = slower)
      ease: 'none',
      repeat: -1,
      onRepeat: () => {
        // Reset position seamlessly when animation repeats
        gsap.set(carousel, { x: -totalWidth });
      },
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isLoading, clients]);

  // Pause on hover
  const handleMouseEnter = () => {
    if (animationRef.current) {
      animationRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  };

  // GSAP Animations
  useEffect(() => {
    if (isLoading || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading]);

  if (isLoading) {
    return (
      <section id="partners" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
        </div>
      </section>
    );
  }

  // Duplicate clients for infinite scroll effect
  const duplicatedClients = [...clients, ...clients, ...clients];

  return (
    <section ref={sectionRef} id="partners" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16 opacity-0">
          <p className="text-blue-600 font-medium text-sm uppercase tracking-wide mb-2">Our Clients</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
          <p className="text-gray-600">We partner with forward-thinking organizations across diverse industries</p>
        </div>

        {/* Auto-scrolling Carousel */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="overflow-hidden">
            <div
              ref={carouselRef}
              className="flex gap-6"
              style={{ width: 'fit-content' }}
            >
              {duplicatedClients.map((client, index) => (
                <div
                  key={`${client._id}-${index}`}
                  className="group min-w-[160px] md:min-w-[200px] lg:min-w-[220px] flex-shrink-0
                     border border-gray-200 rounded-xl p-6
                     hover:border-blue-200 hover:shadow-lg
                     transition-all duration-300 hover:-translate-y-1
                     flex flex-col items-center justify-center text-center"
                >
                  <div className="w-14 h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 overflow-hidden">
                    {client.logo?.url ? (
                      <img
                        src={client.logo.url}
                        alt={client.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <Building2
                        className="text-gray-400 group-hover:text-blue-600 transition-colors"
                        size={24}
                      />
                    )}
                  </div>

                  <h3 className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                    {client.name}
                  </h3>
                  <p className="text-xs text-gray-500">{client.industry}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gradient overlays for smooth edge fade */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>

        {/* Pause hint */}
      </div>
    </section>
  );
}
