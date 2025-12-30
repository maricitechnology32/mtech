const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
    {
        // Company Info
        companyName: {
            type: String,
            default: 'Marici Technology',
        },
        tagline: {
            type: String,
            default: 'Building digital solutions that drive growth and innovation.',
        },
        // Contact Information
        email: {
            type: String,
            default: 'hello@maricitechnology.com',
        },
        phone: {
            type: String,
            default: '+1 (234) 567-890',
        },
        address: {
            type: String,
            default: '123 Tech Street, Innovation City',
        },
        // Social Links
        socialLinks: {
            linkedin: { type: String, default: '' },
            github: { type: String, default: '' },
            twitter: { type: String, default: '' },
            facebook: { type: String, default: '' },
            instagram: { type: String, default: '' },
        },
        // Business Hours
        businessHours: {
            type: String,
            default: 'Mon-Fri: 9:00 AM - 6:00 PM',
        },
        // Maps
        googleMapsUrl: {
            type: String,
            default: '',
        },
        // Footer
        footerText: {
            type: String,
            default: '© 2024 Marici Technology. All rights reserved.',
        },
        // SEO
        seoTitle: {
            type: String,
            default: 'Marici Technology - Enterprise IT Solutions',
        },
        seoDescription: {
            type: String,
            default: 'We build cutting-edge digital solutions that drive growth and deliver exceptional user experiences.',
        },
        // Company Stats
        stats: {
            projectsCount: { type: String, default: '500+' },
            projectsLabel: { type: String, default: 'Projects Delivered' },
            clientsCount: { type: String, default: '200+' },
            clientsLabel: { type: String, default: 'Happy Clients' },
            experienceCount: { type: String, default: '15+' },
            experienceLabel: { type: String, default: 'Years Experience' },
            ratingCount: { type: String, default: '4.9' },
            ratingLabel: { type: String, default: 'Client Rating' },
        },
    },
    {
        timestamps: true,
    }
);

// Ensure only one settings document exists
SettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model('Settings', SettingsSchema);
