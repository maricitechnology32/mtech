import { useRef, useEffect } from 'react';
import { Rocket, Target, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const growthSteps = [
    {
        icon: Target,
        title: 'Strategic Planning',
        description: 'We analyze your business goals and market position to create a tailored roadmap for digital success.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Rocket,
        title: 'Digital Acceleration',
        description: 'Leveraging cutting-edge technology to speed up your operations and enhance customer experiences.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: Users,
        title: 'Customer Engagement',
        description: 'Building intuitive interfaces ensuring your users stay longer and convert more frequently.',
        color: 'from-orange-500 to-red-500',
    },
    {
        icon: TrendingUp,
        title: 'Data-Driven Growth',
        description: 'Using advanced analytics to continuously optimize performance and maximize ROI.',
        color: 'from-green-500 to-emerald-500',
    },
];

export default function BusinessGrowth() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const stepsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Header animation
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );

            // Steps stagger animation
            const steps = stepsRef.current?.children;
            if (steps) {
                gsap.fromTo(
                    steps,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.15,
                        ease: 'back.out(1.5)',
                        scrollTrigger: {
                            trigger: stepsRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div ref={headerRef} className="opacity-0">
                        <p className="text-blue-600 font-medium text-sm uppercase tracking-wide mb-2 flex items-center justify-center gap-2">
                            <span className="w-8 h-[2px] bg-blue-600"></span>
                            Why Choose Us
                            <span className="w-8 h-[2px] bg-blue-600"></span>
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            How We Help <span className="text-gradient-animate">Grow</span> Your Business
                        </h2>
                        <p className="text-gray-600 text-lg">
                            We don't just build software; we build solutions that drive real business results. Here is how we transform your vision into value.
                        </p>
                    </div>
                </div>

                <div ref={stepsRef} className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {growthSteps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="flex gap-6 group cursor-default opacity-0 p-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300 border border-transparent hover:border-gray-100">
                                <div className={`relative flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="text-white relative z-10" size={28} />
                                    <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        {step.description}
                                    </p>
                                    <div className="flex items-center text-blue-600 font-medium text-sm opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        Learn more <ArrowRight size={16} className="ml-1" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 text-center">
                    <a href="#contact" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg hover:shadow-blue-500/30">
                        Start Your Growth Journey <ArrowRight size={20} />
                    </a>
                </div>
            </div>
        </section>
    );
}
