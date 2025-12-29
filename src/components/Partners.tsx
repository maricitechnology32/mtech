import { Building2 } from 'lucide-react';

const partners = [
  { name: 'TechCorp Global', industry: 'Technology' },
  { name: 'FinanceFirst', industry: 'Financial Services' },
  { name: 'HealthCare Plus', industry: 'Healthcare' },
  { name: 'RetailMax', industry: 'Retail' },
  { name: 'EduTech Solutions', industry: 'Education' },
  { name: 'LogiTrans', industry: 'Logistics' },
  { name: 'EnergyFlow', industry: 'Energy' },
  { name: 'MediaStream', industry: 'Media' },
];

export default function Partners() {
  return (
    <section id="partners" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're proud to partner with forward-thinking organizations across diverse industries, helping
            them achieve digital excellence.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col items-center justify-center text-center animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="text-blue-900" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{partner.name}</h3>
              <p className="text-sm text-gray-500">{partner.industry}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-blue-50 rounded-2xl px-8 py-6 border border-blue-100">
            <p className="text-gray-700 font-medium mb-2">Join our growing network of successful partners</p>
            <div className="flex items-center justify-center space-x-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-900">500+</div>
                <div className="text-sm text-gray-600">Projects Completed</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <div className="text-3xl font-bold text-blue-900">200+</div>
                <div className="text-sm text-gray-600">Enterprise Clients</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div>
                <div className="text-3xl font-bold text-blue-900">15+</div>
                <div className="text-sm text-gray-600">Countries Served</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
