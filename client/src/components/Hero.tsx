import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

export default function Hero() {
  const [stats, setStats] = useState<Stats>({
    projectsCount: '500+',
    projectsLabel: 'Projects Delivered',
    clientsCount: '200+',
    clientsLabel: 'Happy Clients',
    experienceCount: '15+',
    experienceLabel: 'Years Experience',
    ratingCount: '4.9',
    ratingLabel: 'Client Rating',
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/settings`);
        if (response.ok) {
          const data = await response.json();
          if (data.stats) {
            setStats({
              projectsCount: data.stats.projectsCount || '500+',
              projectsLabel: data.stats.projectsLabel || 'Projects Delivered',
              clientsCount: data.stats.clientsCount || '200+',
              clientsLabel: data.stats.clientsLabel || 'Happy Clients',
              experienceCount: data.stats.experienceCount || '15+',
              experienceLabel: data.stats.experienceLabel || 'Years Experience',
              ratingCount: data.stats.ratingCount || '4.9',
              ratingLabel: data.stats.ratingLabel || 'Client Rating',
            });
          }
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  // Premium GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating orbs animation (continuous)
      gsap.to(orb1Ref.current, {
        x: 50,
        y: -30,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to(orb2Ref.current, {
        x: -40,
        y: 40,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Parallax background on scroll
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // Badge - elastic pop
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0, rotate: -10 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' }
      );

      // Heading - split text reveal from bottom with clip
      if (headingRef.current) {
        // Wrap each line in a clip container
        tl.fromTo(
          headingRef.current,
          {
            opacity: 0,
            y: 80,
            clipPath: 'inset(100% 0% 0% 0%)'
          },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1,
            ease: 'power4.out'
          },
          '-=0.3'
        );
      }

      // Subheading - blur fade in
      tl.fromTo(
        subheadingRef.current,
        { opacity: 0, y: 30, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 },
        '-=0.5'
      );

      // CTAs - slide in from different directions
      const ctaButtons = ctaRef.current?.children;
      if (ctaButtons) {
        tl.fromTo(
          ctaButtons[0],
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.6 },
          '-=0.4'
        );
        if (ctaButtons[1]) {
          tl.fromTo(
            ctaButtons[1],
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 0.6 },
            '-=0.5'
          );
        }
      }

      // Stats - counter animation with stagger
      const statItems = statsRef.current?.children;
      if (statItems) {
        tl.fromTo(
          statItems,
          { opacity: 0, y: 40, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.12,
            ease: 'back.out(1.7)'
          },
          '-=0.3'
        );

        // Animate counter numbers
        Array.from(statItems).forEach((item, index) => {
          const numberEl = item.querySelector('.stat-number');
          if (numberEl) {
            const text = numberEl.textContent || '';
            const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
            const suffix = text.replace(/[0-9.]/g, '');

            if (!isNaN(numericValue)) {
              const counter = { value: 0 };
              gsap.to(counter, {
                value: numericValue,
                duration: 2,
                delay: 1.5 + (index * 0.15),
                ease: 'power2.out',
                onUpdate: () => {
                  if (text.includes('.')) {
                    numberEl.textContent = counter.value.toFixed(1) + suffix;
                  } else {
                    numberEl.textContent = Math.round(counter.value) + suffix;
                  }
                },
              });
            }
          }
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      gsap.to(orb1Ref.current, {
        x: xPercent * 30,
        y: yPercent * 20,
        duration: 1,
        ease: 'power2.out',
      });

      gsap.to(orb2Ref.current, {
        x: -xPercent * 25,
        y: -yPercent * 15,
        duration: 1,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated Background Pattern */}
      <div ref={bgRef} className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Floating orbs with mouse parallax */}
      <div ref={orb1Ref} className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-cyan-500/20 rounded-full blur-3xl" />
      <div ref={orb2Ref} className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-full blur-3xl" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm mb-8 backdrop-blur-sm opacity-0"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
            </span>
            Enterprise Solutions
          </div>

          {/* Heading */}
          <h1
            ref={headingRef}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 opacity-0"
          >
            Transform Your Business with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 animate-gradient bg-[length:200%_auto]"> Technology</span>
          </h1>

          {/* Subheading */}
          <p
            ref={subheadingRef}
            className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-2xl opacity-0"
          >
            We build cutting-edge digital solutions that drive growth, enhance efficiency,
            and deliver exceptional user experiences for forward-thinking companies.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-blue-500/30 opacity-0"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                Start Your Project
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a
              href="#projects"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white font-medium rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden transition-all hover:bg-white/10 hover:border-white/20 opacity-0"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Play size={18} className="group-hover:scale-110 transition-transform" />
              View Our Work
            </a>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="flex flex-wrap gap-8 lg:gap-12 mt-20 pt-10 border-t border-white/10">
            <div className="opacity-0">
              <p className="stat-number text-4xl font-bold text-white">{stats.projectsCount}</p>
              <p className="text-sm text-gray-400 mt-1">{stats.projectsLabel}</p>
            </div>
            <div className="opacity-0">
              <p className="stat-number text-4xl font-bold text-white">{stats.clientsCount}</p>
              <p className="text-sm text-gray-400 mt-1">{stats.clientsLabel}</p>
            </div>
            <div className="opacity-0">
              <p className="stat-number text-4xl font-bold text-white">{stats.experienceCount}</p>
              <p className="text-sm text-gray-400 mt-1">{stats.experienceLabel}</p>
            </div>
            <div className="opacity-0">
              <p className="stat-number text-4xl font-bold text-white">{stats.ratingCount}</p>
              <p className="text-sm text-gray-400 mt-1">{stats.ratingLabel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-white/50 uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
