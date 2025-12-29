import { TrendingUp, Target, Rocket, BarChart3 } from 'lucide-react';

const values = [
  {
    icon: TrendingUp,
    title: 'Improve Operational Efficiency',
    description:
      'Streamline workflows, automate repetitive tasks, and optimize resource allocation with intelligent technology solutions.',
    impact: 'Up to 60% reduction in operational costs',
  },
  {
    icon: Target,
    title: 'Enhance Digital Presence',
    description:
      'Build compelling digital experiences that engage customers, strengthen your brand, and drive conversions across all channels.',
    impact: 'Average 3x increase in digital engagement',
  },
  {
    icon: Rocket,
    title: 'Increase Brand Value',
    description:
      'Elevate your brand perception through cutting-edge technology, superior user experiences, and innovative solutions.',
    impact: 'Measurable brand equity growth',
  },
  {
    icon: BarChart3,
    title: 'Support Scalable Growth',
    description:
      'Future-proof infrastructure and solutions designed to scale seamlessly with your business ambitions and market expansion.',
    impact: 'Built for 10x growth capacity',
  },
];

export default function ValueProposition() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-900 via-slate-900 to-blue-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Transform Your Business with Measurable Impact
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Our technology partnerships deliver tangible results that directly impact your bottom line and
            market position.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-white" size={26} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                    <p className="text-blue-100 mb-4 leading-relaxed">{value.description}</p>
                    <div className="inline-block bg-cyan-500/20 rounded-lg px-4 py-2 border border-cyan-400/30">
                      <span className="text-sm font-semibold text-cyan-300">{value.impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-lg rounded-2xl px-12 py-8 border border-white/20">
            <p className="text-2xl font-bold mb-2">Ready to accelerate your growth?</p>
            <p className="text-blue-200 mb-6">
              Let's discuss how our solutions can deliver measurable value to your organization.
            </p>
            <a
              href="#contact"
              className="inline-block bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:shadow-xl transform hover:-translate-y-1"
            >
              Schedule a Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
