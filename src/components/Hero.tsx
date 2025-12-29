import { ArrowRight, Code2, Smartphone, Brain } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="absolute top-20 left-10 animate-float">
        <Code2 size={60} className="text-blue-400 opacity-20" />
      </div>
      <div className="absolute top-40 right-20 animate-float-delayed">
        <Smartphone size={50} className="text-blue-300 opacity-20" />
      </div>
      <div className="absolute bottom-40 right-40 animate-float">
        <Brain size={70} className="text-blue-500 opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div
            className={`transform transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
            }`}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Transform Your Business with
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mt-2">
                Enterprise Technology
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Partner with the most trusted IT services company. We deliver faster, build better, and help
              your organization achieve measurable growth through cutting-edge technology solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="group bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                Let's Build Together
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </a>
              <a
                href="#services"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                Explore Services
              </a>
            </div>
          </div>

          <div
            className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
            }`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 animate-slide-right">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Code2 className="text-blue-300" size={24} />
                    </div>
                    <div className="flex-1 bg-white/10 h-4 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center space-x-4 animate-slide-right delay-100">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <Smartphone className="text-cyan-300" size={24} />
                    </div>
                    <div className="flex-1 bg-white/10 h-4 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center space-x-4 animate-slide-right delay-200">
                    <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center">
                      <Brain className="text-blue-200" size={24} />
                    </div>
                    <div className="flex-1 bg-white/10 h-4 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
