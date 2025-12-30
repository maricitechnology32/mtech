const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Testimonial = require('./models/Testimonial');

dotenv.config();

const testimonials = [
    {
        name: 'Sarah Mitchell',
        position: 'CTO, TechCorp Global',
        company: 'Technology',
        testimonial: 'Working with Marici Technology transformed our entire digital infrastructure. (From DB)',
        rating: 5,
    },
    {
        name: 'James Rodriguez',
        position: 'VP of Digital Innovation, FinanceFirst',
        company: 'Financial Services',
        testimonial: 'The mobile application they developed increased our customer engagement by 300%. (From DB)',
        rating: 5,
    },
    {
        name: 'Emily Chen',
        position: 'CEO, RetailMax',
        company: 'Retail',
        testimonial: 'Our e-commerce platform built by Marici Technology handles millions of transactions seamlessly. (From DB)',
        rating: 5,
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Marici Technology');
        console.log('MongoDB Connected for Seeding');

        await Testimonial.deleteMany({});
        console.log('Cleared existing testimonials');

        await Testimonial.insertMany(testimonials);
        console.log('Added sample testimonials');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDB();
