import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Mail, Phone, MapPin, Check, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SiteSettings {
  email: string;
  phone: string;
  address: string;
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings>({
    email: 'hello@maricitechnology.com',
    phone: '+1 (234) 567-890',
    address: '123 Tech Street, Innovation City',
  });

  const sectionRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/settings`);
        if (response.ok) {
          const data = await response.json();
          setSettings({
            email: data.email || 'hello@maricitechnology.com',
            phone: data.phone || '+1 (234) 567-890',
            address: data.address || '123 Tech Street, Innovation City',
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  // Premium GSAP Animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Info section - slide from left with stagger
      gsap.fromTo(
        infoRef.current,
        { opacity: 0, x: -80, rotateY: 15 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Contact info items with bounce stagger
      const infoItems = infoRef.current?.querySelectorAll('.contact-info-item');
      if (infoItems) {
        gsap.fromTo(
          infoItems,
          { opacity: 0, y: 40, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            delay: 0.3,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: infoRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Form section - slide from right
      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: 80, rotateY: -15 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Form fields stagger
      const formFields = formRef.current?.querySelectorAll('.form-field');
      if (formFields) {
        gsap.fromTo(
          formFields,
          { opacity: 0, y: 20, x: 20 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Success animation
  useEffect(() => {
    if (isSuccess && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }
      );

      // Confetti-like particles
      const particles = successRef.current.querySelectorAll('.success-particle');
      gsap.fromTo(
        particles,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          x: () => (Math.random() - 0.5) * 200,
          y: () => (Math.random() - 0.5) * 200,
          rotation: () => Math.random() * 360,
          duration: 1,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );
    }
  }, [isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Magnetic hover effect for contact items
  const handleItemHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const item = e.currentTarget;
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(item, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleItemLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  return (
    <section ref={sectionRef} id="contact" className="py-24 bg-white overflow-hidden" style={{ perspective: '1000px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Info */}
          <div ref={infoRef} className="opacity-0" style={{ transformStyle: 'preserve-3d' }}>
            <p className="text-blue-600 font-medium text-sm uppercase tracking-wide mb-2">Contact Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Let's Start a <span className="text-gradient-animate">Project</span>
            </h2>
            <p className="text-gray-600 mb-10 text-lg">
              Ready to transform your business? Get in touch and let's discuss how we can help you achieve your goals.
            </p>

            <div className="space-y-5">
              <div
                className="contact-info-item flex items-center gap-5 p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group"
                onMouseMove={handleItemHover}
                onMouseLeave={handleItemLeave}
              >
                <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Mail className="text-white" size={24} />
                  <div className="absolute inset-0 rounded-2xl bg-blue-600 blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <a href={`mailto:${settings.email}`} className="text-gray-900 font-semibold hover:text-blue-600 transition-colors text-lg">{settings.email}</a>
                </div>
              </div>

              <div
                className="contact-info-item flex items-center gap-5 p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group"
                onMouseMove={handleItemHover}
                onMouseLeave={handleItemLeave}
              >
                <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Phone className="text-white" size={24} />
                  <div className="absolute inset-0 rounded-2xl bg-cyan-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <a href={`tel:${settings.phone.replace(/\D/g, '')}`} className="text-gray-900 font-semibold hover:text-blue-600 transition-colors text-lg">{settings.phone}</a>
                </div>
              </div>

              <div
                className="contact-info-item flex items-center gap-5 p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group"
                onMouseMove={handleItemHover}
                onMouseLeave={handleItemLeave}
              >
                <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <MapPin className="text-white" size={24} />
                  <div className="absolute inset-0 rounded-2xl bg-purple-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  <p className="text-gray-900 font-semibold text-lg">{settings.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div ref={formRef} className="relative opacity-0" style={{ transformStyle: 'preserve-3d' }}>
            {/* Decorative background */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl blur-2xl" />

            <div className="relative bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
              {isSuccess ? (
                <div ref={successRef} className="text-center py-12 relative">
                  {/* Success particles */}
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="success-particle absolute top-1/2 left-1/2 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  ))}

                  <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Check className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
                      <Sparkles size={16} />
                      {error}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="form-field relative">
                      <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'name' || formData.name ? 'top-2 text-xs text-blue-600' : 'top-4 text-gray-400'
                        }`}>
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="w-full border-2 border-gray-200 rounded-xl pt-6 pb-3 px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div className="form-field relative">
                      <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'email' || formData.email ? 'top-2 text-xs text-blue-600' : 'top-4 text-gray-400'
                        }`}>
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="w-full border-2 border-gray-200 rounded-xl pt-6 pb-3 px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="form-field relative">
                      <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'phone' || formData.phone ? 'top-2 text-xs text-blue-600' : 'top-4 text-gray-400'
                        }`}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full border-2 border-gray-200 rounded-xl pt-6 pb-3 px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div className="form-field">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                      >
                        <option value="">Select a service</option>
                        <option value="Website Development">Web Development</option>
                        <option value="Mobile Application Development">Mobile App</option>
                        <option value="Artificial Intelligence Solutions">AI Solutions</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Consulting">Consulting</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field relative">
                    <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedField === 'message' || formData.message ? 'top-2 text-xs text-blue-600' : 'top-4 text-gray-400'
                      }`}>
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={4}
                      className="w-full border-2 border-gray-200 rounded-xl pt-7 pb-3 px-4 text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="form-field relative w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl overflow-hidden group transition-all hover:shadow-2xl hover:shadow-blue-500/30 disabled:opacity-50"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-600 to-blue-700 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative flex items-center justify-center gap-2">
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={20} />}
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
