import { Quote, Star, Loader2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialData {
  _id?: string;
  name: string;
  position: string;
  company: string;
  testimonial: string;
  rating: number;
  image?: { url: string };
}

const defaultTestimonials: TestimonialData[] = [
  { name: 'Sarah Mitchell', position: 'CTO', company: 'TechCorp', testimonial: 'Working with Marici Technology transformed our digital infrastructure. Their AI solutions reduced costs by 45% while improving service quality.', rating: 5 },
  { name: 'James Rodriguez', position: 'VP Digital', company: 'FinanceFirst', testimonial: 'The mobile app they developed increased our customer engagement by 300%. Outstanding expertise in financial sector compliance.', rating: 5 },
  { name: 'Emily Chen', position: 'CEO', company: 'RetailMax', testimonial: 'Our e-commerce platform handles millions of transactions seamlessly. The scalability has been instrumental in our 10x growth.', rating: 5 },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>(defaultTestimonials);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/testimonials`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) setTestimonials(data);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Premium GSAP Animations
  useEffect(() => {
    if (isLoading || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Floating quote decoration
      const floatingQuotes = sectionRef.current?.querySelectorAll('.floating-quote');
      floatingQuotes?.forEach((quote, i) => {
        gsap.to(quote, {
          y: -20,
          rotation: i % 2 === 0 ? 15 : -15,
          duration: 3 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      // Header with typewriter-style reveal
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards container with horizontal scroll-like effect
      const cards = cardsContainerRef.current?.children;
      if (cards) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            x: (i) => (i % 2 === 0 ? -100 : 100),
            rotateY: 45,
            scale: 0.8
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Banner with scale and glow
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: bannerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Star rating counter animation
      const stars = bannerRef.current?.querySelectorAll('.rating-star');
      if (stars) {
        gsap.fromTo(
          stars,
          { scale: 0, rotate: -180 },
          {
            scale: 1,
            rotate: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: 'back.out(3)',
            scrollTrigger: {
              trigger: bannerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading]);

  // Card hover magnetic effect
  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(card, {
      x: x * 0.1,
      y: y * 0.1,
      rotateX: -y * 0.05,
      rotateY: x * 0.05,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  if (isLoading) {
    return (
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="testimonials" className="py-24 bg-gray-50 overflow-hidden relative">
      {/* Floating decorative quotes */}
      <div className="floating-quote absolute top-20 left-10 text-blue-100 opacity-30">
        <Quote size={80} />
      </div>
      <div className="floating-quote absolute bottom-40 right-10 text-blue-100 opacity-20">
        <Quote size={120} />
      </div>
      <div className="floating-quote absolute top-1/2 left-1/4 text-purple-100 opacity-20">
        <Quote size={60} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16 opacity-0">
          <p className="text-blue-600 font-medium text-sm uppercase tracking-wide mb-2">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our <span className="text-gradient-animate">Clients</span> Say
          </h2>
          <p className="text-gray-600">Don't take our word for it. Here's what our clients have to say.</p>
        </div>

        {/* Testimonials Grid */}
        <div ref={cardsContainerRef} className="grid md:grid-cols-3 gap-8" style={{ perspective: '1000px' }}>
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial._id || index}
              onMouseMove={handleCardHover}
              onMouseLeave={handleCardLeave}
              className="group relative bg-white border border-gray-200 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:border-blue-200 opacity-0"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Quote & Rating */}
              <div className="flex items-center justify-between mb-6">
                <div className="relative">
                  <Quote className="text-blue-500/20" size={40} />
                  <Quote className="absolute top-0 left-0 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" size={40} />
                </div>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-amber-400 fill-amber-400 group-hover:animate-pulse" size={16} style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>

              {/* Quote Text */}
              <p className="text-gray-600 text-base leading-relaxed mb-8 italic relative">
                <span className="relative z-10">"{testimonial.testimonial}"</span>
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                {testimonial.image?.url ? (
                  <div className="relative">
                    <img src={testimonial.image.url} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-lg" />
                    <div className="absolute inset-0 rounded-full ring-2 ring-blue-500 opacity-0 group-hover:opacity-100 transition-opacity scale-110" />
                  </div>
                ) : (
                  <div className="relative w-14 h-14">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div className="absolute inset-0 rounded-full ring-2 ring-blue-500 opacity-0 group-hover:opacity-100 transition-opacity scale-110" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.position}, <span className="text-blue-600">{testimonial.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rating Banner */}
        <div ref={bannerRef} className="mt-20 relative opacity-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-3xl blur-xl opacity-50" />
          <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-3xl p-10 text-center text-white overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }} />
            </div>

            {/* Floating elements */}
            <div className="absolute top-4 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-4 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="rating-star text-yellow-300 fill-yellow-300" size={32} />
                ))}
              </div>
              <h3 className="text-4xl font-bold mb-3">4.9/5 Average Rating</h3>
              <p className="text-blue-100">Based on 500+ client reviews across all platforms</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
