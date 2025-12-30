import { useState, useEffect, useRef } from 'react';
import { ExternalLink, Github, Loader2, FolderKanban, ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
    _id: string;
    title: string;
    description: string;
    shortDescription: string;
    client: string;
    category: string;
    technologies: string[];
    featuredImage?: { url: string };
    liveUrl: string;
    githubUrl: string;
    isFeatured: boolean;
    isActive: boolean;
}

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const filtersRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const response = await fetch(`${apiUrl}/projects`);
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                if (data && Array.isArray(data) && data.length > 0) {
                    setProjects(data);
                } else {
                    setProjects([]);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
                setProjects([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Premium GSAP Animations
    useEffect(() => {
        if (isLoading || !sectionRef.current || projects.length === 0) return;

        const ctx = gsap.context(() => {
            // Header with split effect
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: 50, clipPath: 'inset(100% 0 0 0)' },
                {
                    opacity: 1,
                    y: 0,
                    clipPath: 'inset(0% 0 0 0)',
                    duration: 1,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );

            // Filter buttons - elastic stagger
            const filterBtns = filtersRef.current?.children;
            if (filterBtns) {
                gsap.fromTo(
                    filterBtns,
                    { opacity: 0, scale: 0, y: 20 },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.08,
                        ease: 'back.out(2)',
                        scrollTrigger: {
                            trigger: filtersRef.current,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            }

            // Cards with varied animations per card (masonry-like)
            const cards = gridRef.current?.children;
            if (cards) {
                Array.from(cards).forEach((card, index) => {
                    const row = Math.floor(index / 3);
                    const col = index % 3;

                    // Varied directions based on position
                    const xFrom = col === 0 ? -100 : col === 2 ? 100 : 0;
                    const yFrom = 80;
                    const rotateFrom = col === 0 ? -10 : col === 2 ? 10 : 0;

                    gsap.fromTo(
                        card,
                        {
                            opacity: 0,
                            x: xFrom,
                            y: yFrom,
                            rotate: rotateFrom,
                            scale: 0.8
                        },
                        {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            rotate: 0,
                            scale: 1,
                            duration: 0.8,
                            delay: row * 0.1 + col * 0.15,
                            ease: 'power4.out',
                            scrollTrigger: {
                                trigger: gridRef.current,
                                start: 'top 80%',
                                toggleActions: 'play none none none',
                            },
                        }
                    );
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [isLoading, projects.length]);

    // Re-animate when category changes
    useEffect(() => {
        if (!gridRef.current) return;

        const cards = gridRef.current.children;
        gsap.fromTo(
            cards,
            { opacity: 0, y: 30, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power3.out',
            }
        );
    }, [activeCategory]);

    // Image parallax on hover
    const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
        const img = e.currentTarget.querySelector('img');
        if (!img) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(img, {
            x: x * 20,
            y: y * 20,
            scale: 1.15,
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    const handleImageLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const img = e.currentTarget.querySelector('img');
        if (!img) return;

        gsap.to(img, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
        });
    };

    if (!isLoading && projects.length === 0) return null;

    const categories = ['All', ...new Set(projects.map((p) => p.category))];
    const filteredProjects = activeCategory === 'All' ? projects : projects.filter((p) => p.category === activeCategory);

    if (isLoading) {
        return (
            <section id="projects" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} id="projects" className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-12 opacity-0">
                    <p className="text-blue-600 font-medium text-sm uppercase tracking-wide mb-2">Portfolio</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Our <span className="text-gradient-animate">Projects</span>
                    </h2>
                    <p className="text-gray-600">Explore our portfolio of successful projects and case studies</p>
                </div>

                {/* Category Filter */}
                <div ref={filtersRef} className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden opacity-0 ${activeCategory === category
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {activeCategory === category && (
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 animate-gradient bg-[length:200%_auto]" />
                            )}
                            <span className="relative">{category}</span>
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        <div
                            key={project._id}
                            onMouseEnter={() => setHoveredId(project._id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className="group relative bg-gray-50 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl opacity-0"
                        >
                            {/* Image */}
                            <div
                                className="relative h-56 bg-gray-100 overflow-hidden"
                                onMouseMove={handleImageHover}
                                onMouseLeave={handleImageLeave}
                            >
                                {project.featuredImage?.url ? (
                                    <img
                                        src={project.featuredImage.url}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                                        <FolderKanban className="w-16 h-16 text-gray-300" />
                                    </div>
                                )}

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Category Badge */}
                                <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 rounded-full shadow-sm">
                                    {project.category}
                                </span>

                                {/* Hover Action Buttons */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex items-center justify-center gap-3">
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-lg hover:scale-110 transition-transform"
                                            >
                                                <ExternalLink size={20} />
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-lg hover:scale-110 transition-transform"
                                            >
                                                <Github size={20} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {project.title}
                                    </h3>
                                    <ArrowUpRight
                                        className={`text-gray-400 transition-all duration-300 ${hoveredId === project._id ? 'translate-x-1 -translate-y-1 text-blue-600' : ''
                                            }`}
                                        size={20}
                                    />
                                </div>
                                {project.client && (
                                    <p className="text-blue-600 text-sm font-medium mb-2">{project.client}</p>
                                )}
                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                    {project.shortDescription || project.description}
                                </p>

                                {/* Technologies */}
                                {project.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies.slice(0, 3).map((tech, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {project.technologies.length > 3 && (
                                            <span className="text-xs text-gray-400 font-medium">
                                                +{project.technologies.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Bottom gradient line on hover */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
