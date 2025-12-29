import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    position: 'CTO, TechCorp Global',
    company: 'Technology',
    testimonial:
      'Working with TechVision transformed our entire digital infrastructure. Their AI solutions reduced our operational costs by 45% while improving service quality. The team\'s expertise and professionalism are unmatched.',
    rating: 5,
  },
  {
    name: 'James Rodriguez',
    position: 'VP of Digital Innovation, FinanceFirst',
    company: 'Financial Services',
    testimonial:
      'The mobile application they developed increased our customer engagement by 300%. Their attention to security and compliance in the financial sector demonstrated true expertise. A partnership we value immensely.',
    rating: 5,
  },
  {
    name: 'Emily Chen',
    position: 'CEO, RetailMax',
    company: 'Retail',
    testimonial:
      'Our e-commerce platform built by TechVision handles millions of transactions seamlessly. The scalability and performance have been outstanding. They\'ve been instrumental in our 10x growth over the past two years.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Partners Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Hear from the business leaders who've experienced the
            TechVision difference.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-6">
                <Quote className="text-blue-900 opacity-20" size={48} />
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={18} />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.testimonial}"</p>
              <div className="border-t border-gray-200 pt-6">
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.position}</p>
                <p className="text-sm text-blue-900 font-semibold mt-1">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-12 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-current" size={24} />
              ))}
            </div>
            <h3 className="text-3xl font-bold mb-4">4.9/5 Average Client Rating</h3>
            <p className="text-blue-200 text-lg">
              Based on 500+ client reviews and project evaluations. Our commitment to excellence drives
              everything we do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
