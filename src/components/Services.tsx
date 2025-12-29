import { Code2, Smartphone, Brain, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Code2,
    title: 'Website Development',
    description:
      'Modern, scalable, and secure web solutions built with cutting-edge technologies. SEO-optimized, responsive, and designed to convert visitors into customers.',
    features: ['Responsive Design', 'SEO Optimized', 'High Performance', 'Secure Architecture'],
    gradient: 'from-blue-500 to-blue-700',
  },
  {
    icon: Smartphone,
    title: 'Mobile Application Development',
    description:
      'Native and cross-platform mobile applications for Android and iOS. Intuitive user experiences that drive engagement and business growth.',
    features: ['iOS & Android', 'Cross-Platform', 'Cloud Integration', 'Scalable Solutions'],
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Brain,
    title: 'Artificial Intelligence Solutions',
    description:
      'Transform your business with intelligent automation, data-driven insights, and machine learning solutions that provide competitive advantages.',
    features: ['Machine Learning', 'Automation', 'Data Analytics', 'Predictive Models'],
    gradient: 'from-blue-600 to-slate-700',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Enterprise-Grade Technology Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive solutions designed to accelerate your digital transformation and drive measurable
            business results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
              >
                <div className={`h-2 bg-gradient-to-r ${service.gradient}`}></div>
                <div className="p-8">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button className="flex items-center text-blue-900 font-semibold group-hover:text-blue-700 transition-colors">
                    Learn More
                    <ArrowRight
                      className="ml-2 group-hover:translate-x-2 transition-transform"
                      size={18}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
