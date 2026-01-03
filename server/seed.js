const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Settings = require('./models/Settings');
const Testimonial = require('./models/Testimonial');
const Service = require('./models/Service');
const Project = require('./models/Project');
const Team = require('./models/Team');
const Blog = require('./models/Blog');
const Career = require('./models/Career');
const Client = require('./models/Client');

dotenv.config();

// Testimonials Data
const testimonials = [
    {
        name: "Sarah Johnson",
        position: "CTO",
        company: "TechFlow Inc.",
        testimonial: "Marici Technology transformed our legacy systems into a modern, scalable cloud infrastructure. Their team's expertise is unmatched.",
        rating: 5,
        image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        name: "Michael Chen",
        position: "Founder",
        company: "StartUp Vision",
        testimonial: "We were able to launch our MVP in record time thanks to their agile development process. Highly recommended!",
        rating: 5,
        image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        name: "Emily Davis",
        position: "Marketing Director",
        company: "Global Reach",
        testimonial: "The new website they built has increased our conversion rates by 150%. The design is stunning and user-friendly.",
        rating: 5,
        image: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
        name: "David Rodriguez",
        position: "CEO",
        company: "InnovateCorp",
        testimonial: "Outstanding work on our mobile app! The attention to detail and user experience design exceeded our expectations.",
        rating: 5,
        image: "https://randomuser.me/api/portraits/men/46.jpg"
    }
];

// Hero Slides Data
const heroSlides = [
    {
        title: 'Transform Your Business with Technology',
        subtitle: 'We build cutting-edge digital solutions that drive growth, enhance efficiency, and deliver exceptional user experiences.',
        badge: 'Enterprise Solutions',
        ctaPrimary: 'Start Your Project',
        ctaSecondary: 'View Our Work',
        image: '/images/hero/hero_tech.png'
    },
    {
        title: 'AI-Powered Innovation',
        subtitle: 'Leverage the power of Artificial Intelligence to automate processes and gain actionable insights.',
        badge: 'Future Ready',
        ctaPrimary: 'Explore AI',
        ctaSecondary: 'Case Studies',
        image: '/images/hero/hero_ai.png'
    },
    {
        title: 'Mobile First Experiences',
        subtitle: 'Engage your customers with intuitive and high-performance mobile applications.',
        badge: 'Mobile Development',
        ctaPrimary: 'Build App',
        ctaSecondary: 'Learn More',
        image: '/images/hero/hero_mobile.png'
    }
];

// Services Data
const services = [
    {
        title: "Web Development",
        description: "We build responsive, scalable, and high-performance web applications using modern frameworks and best practices. From simple landing pages to complex enterprise applications, we deliver solutions that drive results.",
        shortDescription: "Custom web solutions built with modern technologies and best practices for optimal performance.",
        icon: "Code2",
        features: [
            "Responsive Design",
            "Progressive Web Apps",
            "Custom CMS Integration",
            "E-commerce Solutions",
            "API Development",
            "Performance Optimization"
        ],
        gradient: "from-blue-500 to-blue-700",
        image: {
            url: "/images/services/web_dev.png"
        },
        isActive: true,
        order: 1
    },
    {
        title: "Mobile App Development",
        description: "Create stunning native and cross-platform mobile applications with seamless user experiences. We specialize in iOS, Android, and React Native development to reach your audience everywhere.",
        shortDescription: "Native and cross-platform mobile apps that deliver exceptional user experiences.",
        icon: "Smartphone",
        features: [
            "iOS Development",
            "Android Development",
            "React Native Apps",
            "Flutter Development",
            "App Store Optimization",
            "Push Notifications"
        ],
        gradient: "from-purple-500 to-purple-700",
        image: {
            url: "/images/services/mobile_app.png"
        },
        isActive: true,
        order: 2
    },
    {
        title: "AI & Machine Learning",
        description: "Harness the power of artificial intelligence to automate processes, gain insights, and create intelligent solutions. From chatbots to predictive analytics, we make AI accessible and practical.",
        shortDescription: "Intelligent solutions powered by AI and machine learning for automation and insights.",
        icon: "Brain",
        features: [
            "Natural Language Processing",
            "Computer Vision",
            "Predictive Analytics",
            "Chatbot Development",
            "Recommendation Systems",
            "AI Consulting"
        ],
        gradient: "from-cyan-500 to-cyan-700",
        image: {
            url: "/images/services/ai_ml.png"
        },
        isActive: true,
        order: 3
    },
    {
        title: "Cloud Solutions",
        description: "Migrate to the cloud with confidence. We provide comprehensive cloud services including architecture design, migration, optimization, and ongoing management for AWS, Azure, and Google Cloud.",
        shortDescription: "Comprehensive cloud services for migration, optimization, and management.",
        icon: "Cloud",
        features: [
            "Cloud Migration",
            "AWS/Azure/GCP",
            "DevOps & CI/CD",
            "Container Orchestration",
            "Cloud Security",
            "Cost Optimization"
        ],
        gradient: "from-indigo-500 to-indigo-700",
        image: {
            url: "/images/services/cloud.png"
        },
        isActive: true,
        order: 4
    }
];

// Projects Data
const projects = [
    {
        title: "E-Commerce Platform",
        description: "A full-featured e-commerce platform with advanced product filtering, secure payment integration, real-time inventory management, and comprehensive analytics dashboard. Built to scale for thousands of products and concurrent users.",
        shortDescription: "Modern e-commerce solution with advanced features and seamless user experience.",
        client: "RetailCo",
        category: "E-Commerce",
        technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
        featuredImage: {
            url: "/images/projects/ecommerce.png"
        },
        images: [
            { url: "/images/projects/ecommerce.png" }
        ],
        liveUrl: "https://example.com",
        isFeatured: true,
        isActive: true,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-05-30'),
        order: 1
    },
    {
        title: "SaaS Analytics Dashboard",
        description: "Enterprise-grade analytics platform providing real-time data visualization, custom reporting, and AI-powered insights. Handles millions of data points with sub-second query performance.",
        shortDescription: "Real-time analytics platform with powerful data visualization and insights.",
        client: "DataInsights Inc.",
        category: "Web Development",
        technologies: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Chart.js"],
        featuredImage: {
            url: "/images/projects/saas.png"
        },
        images: [
            { url: "/images/projects/saas.png" }
        ],
        liveUrl: "https://example.com",
        isFeatured: true,
        isActive: true,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-07-15'),
        order: 2
    },
    {
        title: "Fitness Tracking Mobile App",
        description: "Cross-platform fitness application with workout tracking, nutrition logging, progress visualization, and social features. Integrates with wearable devices for comprehensive health monitoring.",
        shortDescription: "Comprehensive fitness app with workout tracking and health monitoring features.",
        client: "FitLife",
        category: "Mobile App",
        technologies: ["React Native", "Firebase", "HealthKit", "Google Fit"],
        featuredImage: {
            url: "/images/projects/fitness.png"
        },
        images: [
            { url: "/images/projects/fitness.png" }
        ],
        liveUrl: "https://example.com",
        isFeatured: true,
        isActive: true,
        startDate: new Date('2024-02-10'),
        endDate: new Date('2024-06-20'),
        order: 3
    }
];

// Team Data
const team = [
    {
        name: "Alex Thompson",
        position: "CEO & Founder",
        bio: "Visionary leader with 15+ years of experience in software development and business strategy. Passionate about building innovative solutions that make a difference.",
        email: "alex@maricitechnology.com",
        photo: {
            url: "https://randomuser.me/api/portraits/men/75.jpg"
        },
        socialLinks: {
            linkedin: "https://linkedin.com/in/alexthompson",
            github: "https://github.com/alexthompson",
            twitter: "https://twitter.com/alextech"
        },
        department: "Leadership",
        isActive: true,
        order: 1
    },
    {
        name: "Sophia Martinez",
        position: "CTO",
        bio: "Technology expert specializing in cloud architecture and AI solutions. Led development teams at Fortune 500 companies before joining Marici.",
        email: "sophia@maricitechnology.com",
        photo: {
            url: "https://randomuser.me/api/portraits/women/65.jpg"
        },
        socialLinks: {
            linkedin: "https://linkedin.com/in/sophiamartinez",
            github: "https://github.com/sophiamart"
        },
        department: "Leadership",
        isActive: true,
        order: 2
    },
    {
        name: "James Wilson",
        position: "Lead Full-Stack Developer",
        bio: "Expert in React, Node.js, and cloud technologies. Passionate about clean code and scalable architectures.",
        email: "james@maricitechnology.com",
        photo: {
            url: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        socialLinks: {
            linkedin: "https://linkedin.com/in/jameswilson",
            github: "https://github.com/jameswils"
        },
        department: "Development",
        isActive: true,
        order: 3
    },
    {
        name: "Emma Brown",
        position: "UI/UX Designer",
        bio: "Creative designer with a user-centered approach. 8 years of experience crafting beautiful and intuitive digital experiences.",
        email: "emma@maricitechnology.com",
        photo: {
            url: "https://randomuser.me/api/portraits/women/90.jpg"
        },
        socialLinks: {
            linkedin: "https://linkedin.com/in/emmabrown"
        },
        department: "Design",
        isActive: true,
        order: 4
    }
];

const blogs = [
    {
        title: "The Future of AI in Software Development",
        slug: "the-future-of-ai-in-software-development",
        excerpt: "Explore how artificial intelligence is revolutionizing the way we build software, from code generation to automated testing and deployment.",
        content: `
            <h2>Introduction</h2>
            <p>Artificial Intelligence is transforming every aspect of software development. From intelligent code completion to automated bug detection, AI tools are making developers more productive than ever before.</p>
            
            <h2>AI-Powered Code Generation</h2>
            <p>Tools like GitHub Copilot and ChatGPT are changing how developers write code. These AI assistants can generate entire functions, suggest optimizations, and even explain complex code snippets.</p>
            
            <h2>Automated Testing and QA</h2>
            <p>Machine learning algorithms can now predict where bugs are most likely to occur and automatically generate test cases to catch them before they reach production.</p>
            
            <h2>The Road Ahead</h2>
            <p>As AI continues to evolve, we can expect even more sophisticated tools that will augment human creativity and problem-solving abilities, not replace them.</p>
        `,
        featuredImage: {
            url: "/images/blogs/ai_future.png"
        },
        category: "Technology",
        tags: ["AI", "Machine Learning", "Development", "Future Tech"],
        author: {
            name: "Sophia Martinez",
            avatar: "https://randomuser.me/api/portraits/women/65.jpg"
        },
        readTime: 8,
        views: 1250,
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date('2024-11-15')
    },
    {
        title: "Web Development Trends to Watch in 2025",
        slug: "web-development-trends-to-watch-in-2025",
        excerpt: "Stay ahead of the curve with these emerging web development trends that will shape the digital landscape in the coming year.",
        content: `
            <h2>Introduction</h2>
            <p>The web development landscape is constantly evolving. Here are the key trends that will dominate in 2025.</p>
            
            <h2>1. Progressive Web Apps (PWAs)</h2>
            <p>PWAs continue to blur the line between web and native applications, offering offline functionality and app-like experiences.</p>
            
            <h2>2. WebAssembly</h2>
            <p>High-performance applications are increasingly using WebAssembly to run near-native code in the browser.</p>
            
            <h2>3. Edge Computing</h2>
            <p>Moving computation closer to users is becoming standard practice for performance-critical applications.</p>
            
            <h2>Conclusion</h2>
            <p>Staying current with these trends will help you build faster, more capable web applications.</p>
        `,
        featuredImage: {
            url: "/images/blogs/web_trends.png"
        },
        category: "Development",
        tags: ["Web Development", "Trends", "PWA", "WebAssembly"],
        author: {
            name: "James Wilson",
            avatar: "https://randomuser.me/api/portraits/men/22.jpg"
        },
        readTime: 6,
        views: 980,
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date('2024-12-01')
    },
    {
        title: "Cloud Migration Best Practices",
        slug: "cloud-migration-best-practices",
        excerpt: "A comprehensive guide to successfully migrating your applications to the cloud while minimizing risks and maximizing benefits.",
        content: `
            <h2>Planning Your Migration</h2>
            <p>Successful cloud migration starts with thorough planning. Assess your current infrastructure, identify dependencies, and create a detailed migration roadmap.</p>
            
            <h2>Choosing the Right Cloud Provider</h2>
            <p>AWS, Azure, and Google Cloud each have their strengths. Choose based on your specific requirements, existing technology stack, and budget constraints.</p>
            
            <h2>Security Considerations</h2>
            <p>Cloud security requires a shared responsibility model. Ensure you understand your obligations and implement robust security measures.</p>
            
            <h2>Cost Optimization</h2>
            <p>Use cloud cost management tools and implement auto-scaling to avoid overspending while maintaining performance.</p>
        `,
        featuredImage: {
            url: "/images/blogs/cloud.png"
        },
        category: "Tutorial",
        tags: ["Cloud Computing", "AWS", "Azure", "Migration", "Best Practices"],
        author: {
            name: "Alex Thompson",
            avatar: "https://randomuser.me/api/portraits/men/75.jpg"
        },
        readTime: 10,
        views: 1420,
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date('2024-11-28')
    }
];

// Careers Data
const careers = [
    {
        title: "Senior Full-Stack Developer",
        department: "Engineering",
        location: "Remote / USA",
        type: "Full-time",
        experience: "Senior Level",
        description: "We're looking for an experienced Full-Stack Developer to join our growing team and help build cutting-edge web applications.",
        requirements: [
            "5+ years of experience with React and Node.js",
            "Strong understanding of database design (SQL and NoSQL)",
            "Experience with cloud platforms (AWS, Azure, or GCP)",
            "Excellent problem-solving and communication skills",
            "Experience with CI/CD pipelines and DevOps practices"
        ],
        responsibilities: [
            "Design and develop scalable web applications",
            "Collaborate with cross-functional teams",
            "Mentor junior developers",
            "Participate in code reviews and technical discussions",
            "Contribute to architecture decisions"
        ],
        benefits: [
            "Competitive salary",
            "Health, dental, and vision insurance",
            "401(k) matching",
            "Flexible work hours",
            "Professional development budget",
            "Remote work options"
        ],
        skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker"],
        applicationEmail: "careers@maricitechnology.com",
        isActive: true,
        isFeatured: true,
        order: 1
    },
    {
        title: "UI/UX Designer",
        department: "Design",
        location: "New York, NY / Remote",
        type: "Full-time",
        experience: "Mid Level",
        description: "Join our design team to create beautiful, user-centered digital experiences for our clients across various industries.",
        requirements: [
            "3+ years of UI/UX design experience",
            "Proficiency in Figma, Adobe XD, or Sketch",
            "Strong portfolio demonstrating design thinking",
            "Understanding of responsive and mobile-first design",
            "Experience with design systems"
        ],
        responsibilities: [
            "Create wireframes, prototypes, and high-fidelity designs",
            "Conduct user research and usability testing",
            "Collaborate with developers to ensure design implementation",
            "Maintain and evolve design systems",
            "Present design concepts to clients"
        ],
        benefits: [
            "Competitive salary",
            "Health benefits",
            "Creative environment",
            "Latest design tools",
            "Conference attendance",
            "Flexible schedule"
        ],
        skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research", "Design Systems"],
        applicationEmail: "careers@maricitechnology.com",
        isActive: true,
        isFeatured: true,
        order: 2
    },
    {
        title: "DevOps Engineer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        experience: "Mid Level",
        description: "Help us build and maintain robust CI/CD pipelines and infrastructure for our growing list of client projects.",
        requirements: [
            "3+ years of DevOps experience",
            "Strong knowledge of AWS or Azure",
            "Experience with Docker and Kubernetes",
            "Proficiency in scripting (Python, Bash, etc.)",
            "Understanding of security best practices"
        ],
        responsibilities: [
            "Build and maintain CI/CD pipelines",
            "Manage cloud infrastructure",
            "Implement monitoring and alerting",
            "Automate deployment processes",
            "Ensure system reliability and performance"
        ],
        benefits: [
            "Competitive compensation",
            "Health and wellness benefits",
            "Learning stipend",
            "Remote-first culture",
            "Cutting-edge technology stack"
        ],
        skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Python"],
        applicationEmail: "careers@maricitechnology.com",
        isActive: true,
        isFeatured: false,
        order: 3
    }
];

// Clients Data
const clients = [
    {
        name: "TechFlow Inc.",
        industry: "Technology",
        logo: {
            url: "https://via.placeholder.com/200x80/4F46E5/FFFFFF?text=TechFlow"
        },
        website: "https://techflow.example.com",
        description: "Leading enterprise software solutions provider",
        isFeatured: true,
        isActive: true,
        order: 1
    },
    {
        name: "RetailCo",
        industry: "E-Commerce",
        logo: {
            url: "https://via.placeholder.com/200x80/0891B2/FFFFFF?text=RetailCo"
        },
        website: "https://retailco.example.com",
        description: "Global retail and e-commerce platform",
        isFeatured: true,
        isActive: true,
        order: 2
    },
    {
        name: "FitLife",
        industry: "Health & Fitness",
        logo: {
            url: "https://via.placeholder.com/200x80/059669/FFFFFF?text=FitLife"
        },
        website: "https://fitlife.example.com",
        description: "Digital health and wellness solutions",
        isFeatured: true,
        isActive: true,
        order: 3
    },
    {
        name: "DataInsights Inc.",
        industry: "Analytics",
        logo: {
            url: "https://via.placeholder.com/200x80/7C3AED/FFFFFF?text=DataInsights"
        },
        website: "https://datainsights.example.com",
        description: "Business intelligence and analytics platform",
        isFeatured: true,
        isActive: true,
        order: 4
    },
    {
        name: "InnovateCorp",
        industry: "Software",
        logo: {
            url: "https://via.placeholder.com/200x80/DC2626/FFFFFF?text=Innovate"
        },
        website: "https://innovatecorp.example.com",
        description: "Innovation and digital transformation",
        isFeatured: true,
        isActive: true,
        order: 5
    }
];

// Seed Database
const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Marici Technology');
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await Testimonial.deleteMany({});
        await Service.deleteMany({});
        await Project.deleteMany({});
        await Team.deleteMany({});
        await Blog.deleteMany({});
        await Career.deleteMany({});
        await Client.deleteMany({});
        await Settings.deleteMany({});
        console.log('Cleared existing data');

        // Seed Testimonials
        await Testimonial.insertMany(testimonials);
        console.log(`✓ Added ${testimonials.length} testimonials`);

        // Seed Services
        await Service.insertMany(services);
        console.log(`✓ Added ${services.length} services`);

        // Seed Projects
        await Project.insertMany(projects);
        console.log(`✓ Added ${projects.length} projects`);

        // Seed Team
        await Team.insertMany(team);
        console.log(`✓ Added ${team.length} team members`);

        // Seed Blogs
        await Blog.insertMany(blogs);
        console.log(`✓ Added ${blogs.length} blog posts`);

        // Seed Careers
        await Career.insertMany(careers);
        console.log(`✓ Added ${careers.length} job openings`);

        // Seed Clients
        await Client.insertMany(clients);
        console.log(`✓ Added ${clients.length} clients`);

        // Seed Settings (Hero Slides)
        await Settings.create({
            heroSlides: heroSlides,
        });
        console.log(`✓ Added ${heroSlides.length} hero carousel slides`);

        console.log('\n✅ Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDB();
