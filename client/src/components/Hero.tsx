

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroSlide {
  _id?: string;
  title: string;
  subtitle: string;
  image?: string;
  gradient?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  badge?: string;
}

const defaultGradients = [
  'from-blue-500/20 via-purple-500/10 to-transparent',
  'from-emerald-500/20 via-cyan-500/10 to-transparent',
  'from-violet-500/20 via-fuchsia-500/10 to-transparent',
  'from-orange-500/20 via-rose-500/10 to-transparent',
];

const fallbackSlides: HeroSlide[] = [
  {
    title: 'Transform Your Business with Technology',
    subtitle: 'We build cutting-edge digital solutions that drive growth, enhance efficiency, and deliver exceptional user experiences.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    gradient: 'from-blue-500/20 via-purple-500/10 to-transparent',
    ctaPrimary: 'Start Your Project',
    ctaSecondary: 'View Case Studies'
  },
  {
    title: 'AI-Powered Solutions for Tomorrow',
    subtitle: 'Harness the power of artificial intelligence to revolutionize your operations and stay ahead of the competition.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    gradient: 'from-emerald-500/20 via-cyan-500/10 to-transparent',
    ctaPrimary: 'Explore AI Solutions',
    ctaSecondary: 'Watch Demo'
  },
  {
    title: 'Seamless Digital Experiences',
    subtitle: 'Create intuitive, responsive interfaces that engage users and drive conversions across all platforms.',
    image: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    gradient: 'from-violet-500/20 via-fuchsia-500/10 to-transparent',
    ctaPrimary: 'Design Sprint',
    ctaSecondary: 'See Portfolio'
  }
];

export default function ModernHero() {
  const [slides, setSlides] = useState<HeroSlide[]>(fallbackSlides);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState({
    projectsCount: '50+',
    clientsCount: '99%',
    experienceCount: '24/7',
    ratingCount: '5★',
    projectsLabel: 'Projects',
    clientsLabel: 'Client Satisfaction',
    experienceLabel: 'Support',
    ratingLabel: 'Rating'
  });
  const heroRef = useRef<HTMLDivElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch slides from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/settings`);

        if (response.ok) {
          const data = await response.json();

          if (data.heroSlides && Array.isArray(data.heroSlides) && data.heroSlides.length > 0) {
            // Map API slides to component format with defaults
            const apiSlides = data.heroSlides.map((slide: HeroSlide, index: number) => ({
              ...slide,
              gradient: slide.gradient || defaultGradients[index % defaultGradients.length],
              ctaPrimary: slide.ctaPrimary || 'Start Your Project',
              ctaSecondary: slide.ctaSecondary || 'Learn More',
              image: slide.image || fallbackSlides[index % fallbackSlides.length]?.image
            }));
            setSlides(apiSlides);
          }

          // Fetch stats
          if (data.stats) {
            setStats({
              projectsCount: data.stats.projectsCount || '50+',
              clientsCount: data.stats.clientsCount || '99%',
              experienceCount: data.stats.experienceCount || '24/7',
              ratingCount: data.stats.ratingCount || '5★',
              projectsLabel: data.stats.projectsLabel || 'Projects',
              clientsLabel: data.stats.clientsLabel || 'Client Satisfaction',
              experienceLabel: data.stats.experienceLabel || 'Support',
              ratingLabel: data.stats.ratingLabel || 'Rating'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error);
        // Keep fallback slides on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Initialize content refs
  useEffect(() => {
    contentRefs.current = contentRefs.current.slice(0, slides.length);
  }, [slides.length]);

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused || isLoading) return;

    autoScrollRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [isPaused, slides.length, isLoading]);

  // GSAP animations on slide change
  useEffect(() => {
    // Animate out current content
    const currentContent = contentRefs.current[currentSlide];
    const previousContent = contentRefs.current[(currentSlide - 1 + slides.length) % slides.length];

    if (previousContent) {
      gsap.to(previousContent, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power2.inOut'
      });
    }

    // Animate in new content
    if (currentContent) {
      gsap.fromTo(currentContent,
        { opacity: 0, y: -50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.2
        }
      );
    }

    // Animate progress bar
    if (progressBarRef.current) {
      gsap.killTweensOf(progressBarRef.current);
      gsap.set(progressBarRef.current, { width: '0%' });
      gsap.to(progressBarRef.current, {
        width: '100%',
        duration: 5,
        ease: 'linear'
      });
    }
  }, [currentSlide]);

  // Initial animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background floating elements
      gsap.fromTo('.floating-element',
        { y: -20, opacity: 0 },
        {
          y: 20,
          opacity: 0.1,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.5
        }
      );

      // Decorative elements animation
      gsap.fromTo('.decorative-element',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.3,
          duration: 1.5,
          ease: 'back.out(1.7)',
          stagger: 0.2
        }
      );

      // Initial slide content animation
      const initialContent = contentRefs.current[0];
      if (initialContent) {
        gsap.from(initialContent, {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: 'power3.out',
          delay: 0.5
        });
      }

      // Animated badge
      gsap.from('.animated-badge', {
        scale: 0,
        rotation: -180,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: 0.3
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    resetAutoScroll();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    resetAutoScroll();
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    resetAutoScroll();
  };

  const resetAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    if (progressBarRef.current) {
      gsap.killTweensOf(progressBarRef.current);
      gsap.set(progressBarRef.current, { width: '0%' });
      gsap.to(progressBarRef.current, {
        width: '100%',
        duration: 5,
        ease: 'linear'
      });
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (!isPaused && autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="floating-element absolute w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px),
                             linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }} />
        </div>

        {/* Decorative elements */}
        <div className="decorative-element absolute top-20 left-10 w-4 h-4 rounded-full bg-blue-500/30 blur-sm" />
        <div className="decorative-element absolute bottom-20 right-10 w-6 h-6 rounded-full bg-purple-500/30 blur-sm" />
        <div className="decorative-element absolute top-1/2 left-1/4 w-3 h-3 rounded-full bg-emerald-500/30 blur-sm" />
        <div className="decorative-element absolute top-1/3 right-1/3 w-5 h-5 rounded-full bg-amber-500/30 blur-sm" />
      </div>

      {/* Slides container */}
      <div ref={slidesContainerRef} className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide._id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            {/* Background image with gradient overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-7000 ease-out"
              style={{
                backgroundImage: `url(${slide.image})`,
                transform: `scale(${index === currentSlide ? 1.1 : 1})`
              }}
            />
            {/* Dark overlay for text contrast */}
            <div className="absolute inset-0 bg-black/60" />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          </div>
        ))}
      </div>

      {/* Content overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="relative">
            {/* Animated badge */}
            <div className="animated-badge inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium mb-6 md:mb-8">
              <Sparkles size={14} className="text-blue-400" />
              <span>Innovation & Excellence</span>
            </div>

            {/* Slide content */}
            <div className="relative h-64 md:h-80">
              {slides.map((slide, index) => (
                <div
                  key={slide._id || index}
                  ref={el => contentRefs.current[index] = el}
                  className={`absolute top-0 left-0 w-full ${index === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 md:mb-6">
                    {slide.title}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-200 leading-relaxed mb-8 md:mb-10 max-w-xl">
                    {slide.subtitle}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <a
                      href="#contact"
                      className="group relative inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-gray-900 font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-white/20"
                    >
                      <span className="absolute inset-0 bg-gray-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative flex items-center gap-2">
                        {slide.ctaPrimary}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </a>
                    <a
                      href="#projects"
                      className="group relative inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 overflow-hidden transition-all duration-300 hover:bg-white/20 hover:border-white/30"
                    >
                      <Play size={18} className="group-hover:scale-110 transition-transform" />
                      {slide.ctaSecondary}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel controls and progress */}
            <div className="mt-8 md:mt-12">
              {/* Progress bar */}
              <div className="relative h-1 bg-white/20 rounded-full mb-4 overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Slide indicators */}
                  <div className="flex items-center gap-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${index === currentSlide
                          ? 'w-8 h-2 bg-white'
                          : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                          }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Play/Pause button */}
                  <button
                    onClick={togglePause}
                    className="p-2 text-white/70 hover:text-white transition-colors"
                    aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
                  >
                    {isPaused ? (
                      <Play size={16} className="fill-current" />
                    ) : (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-3 bg-current" />
                        <div className="w-1 h-3 bg-current" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Slide numbers */}
                <div className="text-sm text-white/70 font-mono">
                  {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </div>

                {/* Navigation arrows */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right decorative/content area */}
          <div className="hidden lg:block relative">
            {/* Floating card previews */}
            <div className="relative h-96">
              {slides.map((slide, index) => (
                <div
                  key={slide._id || index}
                  className={`absolute w-64 h-80 rounded-2xl overflow-hidden transition-all duration-700 ease-out ${index === currentSlide
                    ? 'opacity-100 scale-100 rotate-0 right-0 top-0 z-10 shadow-2xl'
                    : 'opacity-0 scale-90 rotate-6 right-20 top-10 z-0'
                    }`}
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-t ${slide.gradient}`} />
                </div>
              ))}
            </div>

            {/* Stats preview */}
            <div className="absolute bottom-0 left-0 grid grid-cols-2 gap-4">
              {[
                { value: stats.clientsCount, label: stats.clientsLabel },
                { value: stats.experienceCount, label: stats.experienceLabel },
                { value: stats.projectsCount, label: stats.projectsLabel },
                { value: stats.ratingCount, label: stats.ratingLabel }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                >
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-white/50 font-medium">Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
