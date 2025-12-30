const Blog = require('../models/Blog');
const cloudinary = require('../config/cloudinary');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
    try {
        const { published, category, featured, limit = 20 } = req.query;
        let query = {};

        if (published !== 'false') query.isPublished = true;
        if (category) query.category = category;
        if (featured === 'true') query.isFeatured = true;

        const blogs = await Blog.find(query)
            .select('-content')
            .sort({ isFeatured: -1, publishedAt: -1, createdAt: -1 })
            .limit(parseInt(limit));

        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving blogs.' });
    }
};

// @desc    Get single blog by slug or id
// @route   GET /api/blogs/:identifier
// @access  Public
const getBlogBySlug = async (req, res) => {
    try {
        const { identifier } = req.params;
        let blog;

        // Check if identifier is a MongoDB ObjectId or slug
        if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
            blog = await Blog.findById(identifier);
        } else {
            blog = await Blog.findOne({ slug: identifier, isPublished: true });
        }

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Increment views
        await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private (Admin)
const createBlog = async (req, res) => {
    try {
        const {
            title, excerpt, content, category, tags, authorName,
            isPublished, isFeatured, metaTitle, metaDescription, slug
        } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const blogData = {
            title,
            excerpt: excerpt || '',
            content,
            category: category || 'Technology',
            tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(t => t)) : [],
            author: { name: authorName || 'Admin' },
            isPublished: isPublished === 'true' || isPublished === true,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || excerpt,
            publishedAt: (isPublished === 'true' || isPublished === true) ? new Date() : null,
        };

        if (slug) blogData.slug = slug;

        // Handle featured image upload
        if (req.files?.featuredImage) {
            const result = await cloudinary.uploader.upload(req.files.featuredImage[0].path, {
                folder: 'Marici Technology/blogs',
                transformation: [{ width: 1200, height: 630, crop: 'fill' }],
            });
            blogData.featuredImage = { url: result.secure_url, publicId: result.public_id };
        }

        const blog = await Blog.create(blogData);
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (Admin)
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const {
            title, slug, excerpt, content, category, tags, authorName,
            isPublished, isFeatured, metaTitle, metaDescription
        } = req.body;

        if (title) blog.title = title;
        if (slug) blog.slug = slug;
        if (excerpt !== undefined) blog.excerpt = excerpt;
        if (content) blog.content = content;
        if (category) blog.category = category;
        if (tags) blog.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(t => t);
        if (authorName) blog.author.name = authorName;
        if (metaTitle) blog.metaTitle = metaTitle;
        if (metaDescription) blog.metaDescription = metaDescription;

        if (isPublished !== undefined) {
            const shouldPublish = isPublished === 'true' || isPublished === true;
            if (shouldPublish && !blog.isPublished) {
                blog.publishedAt = new Date();
            }
            blog.isPublished = shouldPublish;
        }

        if (isFeatured !== undefined) {
            blog.isFeatured = isFeatured === 'true' || isFeatured === true;
        }

        // Handle featured image update
        if (req.files?.featuredImage) {
            // Delete old image
            if (blog.featuredImage?.publicId) {
                await cloudinary.uploader.destroy(blog.featuredImage.publicId);
            }
            const result = await cloudinary.uploader.upload(req.files.featuredImage[0].path, {
                folder: 'Marici Technology/blogs',
                transformation: [{ width: 1200, height: 630, crop: 'fill' }],
            });
            blog.featuredImage = { url: result.secure_url, publicId: result.public_id };
        }

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload image for blog content
// @route   POST /api/blogs/upload-image
// @access  Private (Admin)
const uploadContentImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'Marici Technology/blogs/content',
            transformation: [{ width: 1000, quality: 'auto:good' }],
        });

        res.json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private (Admin)
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Delete featured image
        if (blog.featuredImage?.publicId) {
            await cloudinary.uploader.destroy(blog.featuredImage.publicId);
        }

        // Delete content images
        if (blog.images?.length > 0) {
            for (const img of blog.images) {
                if (img.publicId) {
                    await cloudinary.uploader.destroy(img.publicId);
                }
            }
        }

        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog deleted successfully', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get blog stats
// @route   GET /api/blogs/stats
// @access  Private (Admin)
const getBlogStats = async (req, res) => {
    try {
        const total = await Blog.countDocuments();
        const published = await Blog.countDocuments({ isPublished: true });
        const drafts = await Blog.countDocuments({ isPublished: false });
        const featured = await Blog.countDocuments({ isFeatured: true });
        const totalViews = await Blog.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]);

        res.json({
            total,
            published,
            drafts,
            featured,
            totalViews: totalViews[0]?.total || 0,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving stats.' });
    }
};

module.exports = {
    getBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    uploadContentImage,
    deleteBlog,
    getBlogStats,
};
