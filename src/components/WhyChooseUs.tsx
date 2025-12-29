import { Shield, Zap, Award, HeadphonesIcon } from 'lucide-react';

const reasons = [
  {
    icon: Shield,
    title: 'Most Trusted Technology Partner',
    description:
      'Proven track record of delivering enterprise solutions with 99.9% client satisfaction. Your success is our commitment.',
    stat: '500+',
    statLabel: 'Projects Delivered',
  },
  {
    icon: Zap,
    title: 'Faster Delivery with Proven Processes',
    description:
      'Agile methodologies and streamlined workflows ensure your projects are delivered on time, every time.',
    stat: '40%',
    statLabel: 'Faster Than Industry Average',
  },
  {
    icon: Award,
    title: 'Quality-Driven Products',
    description:
      'Rigorous testing, code reviews, and quality assurance processes guarantee robust, scalable solutions.',
    stat: '99.9%',
    statLabel: 'Uptime Guarantee',
  },
  {
    icon: HeadphonesIcon,
    title: 'Best-in-Class Customer Support',
    description:
      'Dedicated support teams available around the clock to ensure your business never misses a beat.',
    stat: '24/7',
    statLabel: 'Support Available',
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Leading Organizations Choose Us
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We don't just build technology—we build long-term partnerships that drive sustainable growth
            and competitive advantage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-white" size={28} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{reason.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{reason.description}</p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                        {reason.stat}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">{reason.statLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
