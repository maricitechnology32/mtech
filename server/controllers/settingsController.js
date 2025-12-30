const Settings = require('../models/Settings');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving settings.' });
    }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private (Admin)
const updateSettings = async (req, res) => {
    try {
        let settings = await Settings.getSettings();

        const {
            companyName,
            tagline,
            email,
            phone,
            address,
            socialLinks,
            businessHours,
            googleMapsUrl,
            footerText,
            seoTitle,
            seoDescription,
        } = req.body;

        if (companyName !== undefined) settings.companyName = companyName;
        if (tagline !== undefined) settings.tagline = tagline;
        if (email !== undefined) settings.email = email;
        if (phone !== undefined) settings.phone = phone;
        if (address !== undefined) settings.address = address;
        if (businessHours !== undefined) settings.businessHours = businessHours;
        if (googleMapsUrl !== undefined) settings.googleMapsUrl = googleMapsUrl;
        if (footerText !== undefined) settings.footerText = footerText;
        if (seoTitle !== undefined) settings.seoTitle = seoTitle;
        if (seoDescription !== undefined) settings.seoDescription = seoDescription;

        if (socialLinks) {
            if (socialLinks.linkedin !== undefined) settings.socialLinks.linkedin = socialLinks.linkedin;
            if (socialLinks.github !== undefined) settings.socialLinks.github = socialLinks.github;
            if (socialLinks.twitter !== undefined) settings.socialLinks.twitter = socialLinks.twitter;
            if (socialLinks.facebook !== undefined) settings.socialLinks.facebook = socialLinks.facebook;
            if (socialLinks.instagram !== undefined) settings.socialLinks.instagram = socialLinks.instagram;
        }

        const { stats } = req.body;
        if (stats) {
            if (stats.projectsCount !== undefined) settings.stats.projectsCount = stats.projectsCount;
            if (stats.projectsLabel !== undefined) settings.stats.projectsLabel = stats.projectsLabel;
            if (stats.clientsCount !== undefined) settings.stats.clientsCount = stats.clientsCount;
            if (stats.clientsLabel !== undefined) settings.stats.clientsLabel = stats.clientsLabel;
            if (stats.experienceCount !== undefined) settings.stats.experienceCount = stats.experienceCount;
            if (stats.experienceLabel !== undefined) settings.stats.experienceLabel = stats.experienceLabel;
            if (stats.ratingCount !== undefined) settings.stats.ratingCount = stats.ratingCount;
            if (stats.ratingLabel !== undefined) settings.stats.ratingLabel = stats.ratingLabel;
        }

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings,
};
