import { useState, useEffect } from 'react';
import { Github, Linkedin, Twitter, Mail, Facebook, Instagram } from 'lucide-react';

interface SiteSettings {
  companyName: string;
  tagline: string;
  email: string;
  socialLinks: {
    linkedin: string;
    github: string;
    twitter: string;
    facebook: string;
    instagram: string;
  };
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<SiteSettings>({
    companyName: 'Marici Technology',
    tagline: 'Building digital solutions that drive growth and innovation.',
    email: 'hello@maricitechnology.com',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      facebook: '',
      instagram: '',
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/settings`);
        if (response.ok) {
          const data = await response.json();
          setSettings({
            companyName: data.companyName || 'Marici Technology',
            tagline: data.tagline || 'Building digital solutions that drive growth and innovation.',
            email: data.email || 'hello@maricitechnology.com',
            socialLinks: {
              linkedin: data.socialLinks?.linkedin || '',
              github: data.socialLinks?.github || '',
              twitter: data.socialLinks?.twitter || '',
              facebook: data.socialLinks?.facebook || '',
              instagram: data.socialLinks?.instagram || '',
            },
          });
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const footerLinks = {
    company: [
      { label: 'About Us', href: '#hero' },
      { label: 'Team', href: '#team' },
      { label: 'Projects', href: '#projects' },
      { label: 'Careers', href: '#careers' },
      { label: 'Blog', href: '#blog' },
      { label: 'Contact', href: '#contact' },
    ],
    services: [
      { label: 'Web Development', href: '#services' },
      { label: 'Mobile Apps', href: '#services' },
      { label: 'AI Solutions', href: '#services' },
      { label: 'Consulting', href: '#services' },
    ],
    resources: [
      { label: 'Case Studies', href: '#projects' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  };

  const hasSocialLinks = Object.values(settings.socialLinks).some(link => link);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt={settings.companyName} className="h-20 w-auto bg-white rounded-lg p-1" />
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {settings.tagline}
            </p>
            <div className="flex items-center gap-3">
              {settings.socialLinks.linkedin && (
                <a href={settings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
                  <Linkedin size={16} />
                </a>
              )}
              {settings.socialLinks.github && (
                <a href={settings.socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                  <Github size={16} />
                </a>
              )}
              {settings.socialLinks.twitter && (
                <a href={settings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-cyan-500 hover:text-white transition-colors">
                  <Twitter size={16} />
                </a>
              )}
              {settings.socialLinks.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-colors">
                  <Facebook size={16} />
                </a>
              )}
              {settings.socialLinks.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-pink-500 hover:text-white transition-colors">
                  <Instagram size={16} />
                </a>
              )}
              {!hasSocialLinks && (
                <a href={`mailto:${settings.email}`} className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
                  <Mail size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-medium mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© {currentYear} {settings.companyName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300">Privacy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300">Terms</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
