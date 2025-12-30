import { Shield, Clock, Users, Award, Headphones, Zap } from 'lucide-react';

const features = [
  { icon: Shield, title: 'Secure & Reliable', description: 'Enterprise-grade security with 99.9% uptime guarantee' },
  { icon: Clock, title: 'On-Time Delivery', description: 'We meet deadlines and deliver projects on schedule' },
  { icon: Users, title: 'Expert Team', description: 'Senior developers with 10+ years of experience' },
  { icon: Award, title: 'Quality First', description: 'Rigorous testing and code review standards' },
  { icon: Headphones, title: '24/7 Support', description: 'Round-the-clock technical support and maintenance' },
  { icon: Zap, title: 'Fast Performance', description: 'Optimized solutions for speed and efficiency' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-blue-400 font-medium text-sm uppercase tracking-wide mb-2">Why Choose Us</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for Excellence</h2>
          <p className="text-gray-300">
            We combine technical expertise with a commitment to delivering exceptional results
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="text-blue-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
