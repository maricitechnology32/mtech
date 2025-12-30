import { useState, useEffect } from 'react';
import { Rocket, Target, LineChart } from 'lucide-react';

const values = [
  { icon: Rocket, title: 'Innovation', description: 'Cutting-edge technologies and modern development practices' },
  { icon: Target, title: 'Precision', description: 'Pixel-perfect execution with attention to every detail' },
  { icon: LineChart, title: 'Growth', description: 'Solutions that scale with your business needs' },
];

export default function ValueProposition() {
  const [stats, setStats] = useState({
    projectsCount: '500+',
    clientsCount: '200+',
    experienceCount: '15+',
    ratingCount: '4.9',
  });

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
              clientsCount: data.stats.clientsCount || '200+',
              experienceCount: data.stats.experienceCount || '15+',
              ratingCount: data.stats.ratingCount || '4.9',
            });
          }
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <p className="text-blue-600 font-medium text-sm uppercase tracking-wide mb-2">Our Approach</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Technology That Drives Results
            </h2>
            <p className="text-gray-600 mb-8">
              We don't just build software – we create solutions that transform businesses.
              Our approach combines deep technical expertise with strategic thinking to deliver
              measurable outcomes.
            </p>

            <div className="space-y-6">
              {values.map((value, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <value.icon className="text-blue-600" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Stats Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Our Impact</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-gray-600">Projects Completed</span>
                <span className="text-2xl font-bold text-gray-900">{stats.projectsCount}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-gray-600">Happy Clients</span>
                <span className="text-2xl font-bold text-gray-900">{stats.clientsCount}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-gray-600">Client Rating</span>
                <span className="text-2xl font-bold text-gray-900">{stats.ratingCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Years Experience</span>
                <span className="text-2xl font-bold text-gray-900">{stats.experienceCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
