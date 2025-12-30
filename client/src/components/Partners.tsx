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
    projectsCount: '500+',
    projectsLabel: 'Projects',
    clientsCount: '200+',
    clientsLabel: 'Clients',
    experienceCount: '15+',
    experienceLabel: 'Countries',
    ratingCount: '98%',
    ratingLabel: 'Satisfaction',
  });

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

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
              projectsCount: data.stats.projectsCount || '500+',
              projectsLabel: 'Projects',
              clientsCount: data.stats.clientsCount || '200+',
              clientsLabel: 'Clients',
              experienceCount: data.stats.experienceCount || '15+',
              experienceLabel: 'Countries',
              ratingCount: data.stats.ratingCount || '98%',
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

      // Grid items stagger
      const gridItems = gridRef.current?.children;
      if (gridItems) {
        gsap.fromTo(
          gridItems,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Stats section animation
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Stats numbers stagger
      const statItems = statsRef.current?.querySelectorAll('.stat-item');
      if (statItems) {
        gsap.fromTo(
          statItems,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
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

  return (
    <section ref={sectionRef} id="partners" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16 opacity-0">
          <p className="text-blue-600 font-medium text-sm uppercase tracking-wide mb-2">Our Clients</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
          <p className="text-gray-600">We partner with forward-thinking organizations across diverse industries</p>
        </div>

        {/* Clients Grid */}
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {clients.map((client) => (
            <div
              key={client._id}
              className="group bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center text-center opacity-0"
            >
              <div className="w-14 h-14 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 overflow-hidden">
                {client.logo?.url ? (
                  <img src={client.logo.url} alt={client.name} className="w-full h-full object-contain p-2" />
                ) : (
                  <Building2 className="text-gray-400 group-hover:text-blue-600 transition-colors" size={24} />
                )}
              </div>
              <h3 className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{client.name}</h3>
              <p className="text-xs text-gray-500">{client.industry}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div ref={statsRef} className="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-8 opacity-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="stat-item">
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">{stats.projectsCount}</p>
              <p className="text-sm text-gray-500 mt-1">{stats.projectsLabel}</p>
            </div>
            <div className="stat-item">
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">{stats.clientsCount}</p>
              <p className="text-sm text-gray-500 mt-1">{stats.clientsLabel}</p>
            </div>
            <div className="stat-item">
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">{stats.experienceCount}</p>
              <p className="text-sm text-gray-500 mt-1">{stats.experienceLabel}</p>
            </div>
            <div className="stat-item">
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">{stats.ratingCount}</p>
              <p className="text-sm text-gray-500 mt-1">{stats.ratingLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
