const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Blog title is required'],
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        excerpt: {
            type: String,
            maxlength: 500,
        },
        content: {
            type: String,
            required: [true, 'Blog content is required'],
        },
        featuredImage: {
            url: { type: String },
            publicId: { type: String },
        },
        images: [{
            url: { type: String },
            publicId: { type: String },
            caption: { type: String },
        }],
        category: {
            type: String,
            enum: ['Technology', 'Development', 'Design', 'Business', 'News', 'Tutorial', 'Case Study', 'Other'],
            default: 'Technology',
        },
        tags: [{
            type: String,
            trim: true,
        }],
        author: {
            name: { type: String, default: 'Admin' },
            avatar: { type: String },
        },
        readTime: {
            type: Number,
            default: 5,
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        publishedAt: {
            type: Date,
        },
        metaTitle: {
            type: String,
        },
        metaDescription: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Generate slug from title
BlogSchema.pre('save', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
    // Calculate read time (approx 200 words per minute)
    if (this.isModified('content')) {
        const wordCount = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        this.readTime = Math.ceil(wordCount / 200) || 1;
    }
    next();
});

module.exports = mongoose.model('Blog', BlogSchema);
