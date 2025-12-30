import { useState, useEffect, useRef } from 'react';
import { Linkedin, Github, Twitter, Mail, Loader2, User } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
    _id: string;
    name: string;
    position: string;
    bio: string;
    photo?: { url: string };
    email?: string;
    socialLinks?: { linkedin?: string; github?: string; twitter?: string };
    department: string;
    isActive: boolean;
}

export default function Team() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const response = await fetch(`${apiUrl}/team`);
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                if (data && Array.isArray(data) && data.length > 0) {
                    setMembers(data);
                } else {
                    setMembers([]);
                }
            } catch (error) {
                console.error('Error fetching team:', error);
                setMembers([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeam();
    }, []);

    // GSAP Animations
    useEffect(() => {
        if (isLoading || !sectionRef.current || members.length === 0) return;

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

            // Team cards stagger animation
            const cards = gridRef.current?.children;
            if (cards) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 60, scale: 0.9 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [isLoading, members.length]);

    if (!isLoading && members.length === 0) return null;

    if (isLoading) {
        return (
            <section id="team" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} id="team" className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16 opacity-0">
                    <p className="text-blue-600 font-medium text-sm uppercase tracking-wide mb-2">Our Team</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet the Experts</h2>
                    <p className="text-gray-600">A talented group of professionals dedicated to delivering exceptional results</p>
                </div>

                {/* Team Grid */}
                <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {members.map((member) => (
                        <div
                            key={member._id}
                            className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 opacity-0"
                        >
                            {/* Photo */}
                            <div className="relative h-56 bg-gray-100 overflow-hidden">
                                {member.photo?.url ? (
                                    <img
                                        src={member.photo.url}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                        <User className="w-16 h-16 text-gray-300" />
                                    </div>
                                )}
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{member.name}</h3>
                                <p className="text-blue-600 text-sm mb-2">{member.position}</p>
                                {member.bio && <p className="text-gray-600 text-sm line-clamp-2 mb-3">{member.bio}</p>}

                                {/* Social Links */}
                                <div className="flex items-center gap-2">
                                    {member.socialLinks?.linkedin && (
                                        <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all">
                                            <Linkedin size={16} />
                                        </a>
                                    )}
                                    {member.socialLinks?.github && (
                                        <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:text-white hover:scale-110 transition-all">
                                            <Github size={16} />
                                        </a>
                                    )}
                                    {member.socialLinks?.twitter && (
                                        <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-cyan-500 hover:text-white hover:scale-110 transition-all">
                                            <Twitter size={16} />
                                        </a>
                                    )}
                                    {member.email && (
                                        <a href={`mailto:${member.email}`} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all">
                                            <Mail size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
