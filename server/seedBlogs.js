const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Blog = require('./models/Blog');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mtech';

const blogs = [
    {
        title: 'The Future of Artificial Intelligence in Enterprise Software',
        slug: 'future-of-ai-enterprise-software',
        excerpt: 'Discover how AI is transforming enterprise software development and what businesses need to prepare for in the coming years.',
        content: `
            <h2>Introduction to AI in Enterprise</h2>
            <p>Artificial Intelligence is no longer a futuristic concept—it's reshaping how enterprises operate today. From automating routine tasks to providing deep insights through data analysis, AI is becoming an integral part of business operations.</p>
            
            <h2>Key Applications of AI</h2>
            <p>AI applications in enterprise software span across various domains including customer service automation, predictive analytics, supply chain optimization, and intelligent document processing. Companies leveraging these technologies are seeing significant improvements in efficiency and cost reduction.</p>
            
            <h2>Machine Learning Models</h2>
            <p>Modern enterprise AI relies heavily on machine learning models that can learn from historical data to make predictions and automate decision-making. These models are becoming more sophisticated and accessible, allowing businesses of all sizes to benefit from AI capabilities.</p>
            
            <h2>Implementation Challenges</h2>
            <p>While AI offers tremendous benefits, implementation comes with challenges including data quality, integration with existing systems, and the need for skilled talent. Organizations must carefully plan their AI strategy to overcome these hurdles.</p>
            
            <h2>Looking Ahead</h2>
            <p>The future of AI in enterprise software looks promising with advancements in natural language processing, computer vision, and autonomous systems. Companies that invest in AI today will be better positioned to compete in the digital economy of tomorrow.</p>
        `,
        featuredImage: {
            url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
            publicId: 'seed-blog-1-featured',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop',
                publicId: 'seed-blog-1-img1',
                caption: 'AI-powered robotics transforming manufacturing',
            },
            {
                url: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=500&fit=crop',
                publicId: 'seed-blog-1-img2',
                caption: 'Neural network visualization',
            },
            {
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop',
                publicId: 'seed-blog-1-img3',
                caption: 'Data center powering AI computations',
            },
            {
                url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=500&fit=crop',
                publicId: 'seed-blog-1-img4',
                caption: 'AI assistant helping with productivity',
            },
        ],
        category: 'Technology',
        tags: ['AI', 'Machine Learning', 'Enterprise', 'Digital Transformation', 'Automation'],
        author: {
            name: 'Dr. Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        },
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date('2024-12-15'),
        metaTitle: 'AI in Enterprise Software - Future Trends 2025',
        metaDescription: 'Learn about the future of AI in enterprise software and how it will transform business operations.',
    },
    {
        title: 'Building Scalable Web Applications with Modern Architecture',
        slug: 'building-scalable-web-applications-modern-architecture',
        excerpt: 'Learn the best practices for building web applications that can scale to millions of users while maintaining performance.',
        content: `
            <h2>Why Scalability Matters</h2>
            <p>In today's digital landscape, applications must be prepared to handle sudden spikes in traffic and growing user bases. Scalability is not just about handling more users—it's about maintaining performance, reliability, and user experience as your application grows.</p>
            
            <h2>Microservices Architecture</h2>
            <p>Microservices have become the go-to architecture for scalable applications. By breaking down applications into smaller, independent services, teams can develop, deploy, and scale components independently. This approach offers flexibility and resilience that monolithic architectures cannot match.</p>
            
            <h2>Cloud-Native Development</h2>
            <p>Embracing cloud-native principles means designing applications specifically for cloud environments. This includes containerization with Docker, orchestration with Kubernetes, and leveraging managed services for databases, caching, and messaging.</p>
            
            <h2>Database Strategies</h2>
            <p>Choosing the right database strategy is crucial for scalability. This includes using read replicas, implementing caching layers with Redis, and considering NoSQL databases for specific use cases. Database sharding and partitioning are also essential techniques for handling large datasets.</p>
            
            <h2>Performance Optimization</h2>
            <p>Optimization should be built into the development process from the start. This includes implementing CDNs for static assets, lazy loading, code splitting, and efficient API design. Monitoring and profiling tools help identify bottlenecks before they impact users.</p>
        `,
        featuredImage: {
            url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop',
            publicId: 'seed-blog-2-featured',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop',
                publicId: 'seed-blog-2-img1',
                caption: 'Global network infrastructure',
            },
            {
                url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=500&fit=crop',
                publicId: 'seed-blog-2-img2',
                caption: 'Cloud server architecture',
            },
            {
                url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop',
                publicId: 'seed-blog-2-img3',
                caption: 'Modern technology stack',
            },
            {
                url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=500&fit=crop',
                publicId: 'seed-blog-2-img4',
                caption: 'Developer working on scalable solutions',
            },
        ],
        category: 'Development',
        tags: ['Web Development', 'Microservices', 'Cloud', 'Scalability', 'Architecture'],
        author: {
            name: 'Michael Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        },
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date('2024-12-10'),
        metaTitle: 'Scalable Web Applications - Modern Architecture Guide',
        metaDescription: 'Best practices for building web applications that scale to millions of users.',
    },
    {
        title: 'UI/UX Design Trends That Will Dominate 2025',
        slug: 'ui-ux-design-trends-2025',
        excerpt: 'Explore the latest design trends shaping user experiences, from AI-powered personalization to immersive 3D elements.',
        content: `
            <h2>The Evolution of Digital Design</h2>
            <p>Design trends are constantly evolving, driven by new technologies, changing user expectations, and creative innovation. As we look ahead to 2025, several exciting trends are emerging that will define how we create digital experiences.</p>
            
            <h2>AI-Driven Personalization</h2>
            <p>Artificial intelligence is enabling unprecedented levels of personalization in UI design. From dynamically adapting layouts to user preferences to generating personalized content recommendations, AI is making interfaces smarter and more intuitive.</p>
            
            <h2>Immersive 3D Elements</h2>
            <p>With improving browser capabilities and WebGL, 3D elements are becoming more accessible in web design. Expect to see more immersive product showcases, interactive 3D graphics, and even spatial computing interfaces as AR and VR technologies mature.</p>
            
            <h2>Micro-Interactions and Animation</h2>
            <p>Thoughtful micro-interactions continue to elevate user experiences. Subtle animations provide feedback, guide users, and add personality to interfaces. The key is using animation purposefully without compromising performance.</p>
            
            <h2>Sustainable and Inclusive Design</h2>
            <p>Designers are increasingly focusing on accessibility and sustainability. This includes creating inclusive experiences for users with disabilities, reducing digital carbon footprints, and designing for diverse global audiences.</p>
        `,
        featuredImage: {
            url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
            publicId: 'seed-blog-3-featured',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop',
                publicId: 'seed-blog-3-img1',
                caption: 'Modern UI design workspace',
            },
            {
                url: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=500&fit=crop',
                publicId: 'seed-blog-3-img2',
                caption: 'Mobile app design mockups',
            },
            {
                url: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=500&fit=crop',
                publicId: 'seed-blog-3-img3',
                caption: 'UX research and wireframing',
            },
            {
                url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&h=500&fit=crop',
                publicId: 'seed-blog-3-img4',
                caption: 'Design system components',
            },
        ],
        category: 'Design',
        tags: ['UI Design', 'UX Design', 'Design Trends', '3D Design', 'Accessibility'],
        author: {
            name: 'Emma Thompson',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        },
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date('2024-12-05'),
        metaTitle: 'UI/UX Design Trends 2025 - What\'s Next',
        metaDescription: 'Explore the latest UI/UX design trends that will shape digital experiences in 2025.',
    },
    {
        title: 'Complete Guide to DevOps and CI/CD Implementation',
        slug: 'complete-guide-devops-cicd-implementation',
        excerpt: 'A comprehensive guide to implementing DevOps practices and setting up robust CI/CD pipelines for your development team.',
        content: `
            <h2>Understanding DevOps</h2>
            <p>DevOps is more than just tools and automation—it's a cultural shift that brings development and operations teams together. The goal is to reduce the time from development to deployment while maintaining high quality and reliability.</p>
            
            <h2>Setting Up CI/CD Pipelines</h2>
            <p>Continuous Integration and Continuous Deployment (CI/CD) pipelines automate the process of testing, building, and deploying code. Popular tools like GitHub Actions, Jenkins, and GitLab CI make it easier than ever to implement these practices.</p>
            
            <h2>Infrastructure as Code</h2>
            <p>Infrastructure as Code (IaC) treats infrastructure provisioning as software development. Tools like Terraform, Ansible, and Pulumi allow teams to version control their infrastructure, ensuring consistency and repeatability across environments.</p>
            
            <h2>Monitoring and Observability</h2>
            <p>Effective DevOps requires comprehensive monitoring and observability. This includes application performance monitoring, log aggregation, and distributed tracing. Tools like Prometheus, Grafana, and Datadog provide the visibility needed to maintain healthy systems.</p>
            
            <h2>Security in DevOps (DevSecOps)</h2>
            <p>Security should be integrated into every stage of the development lifecycle. DevSecOps practices include automated security scanning, dependency vulnerability checks, and implementing security policies as code.</p>
        `,
        featuredImage: {
            url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&h=600&fit=crop',
            publicId: 'seed-blog-4-featured',
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=500&fit=crop',
                publicId: 'seed-blog-4-img1',
                caption: 'DevOps workflow automation',
            },
            {
                url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=500&fit=crop',
                publicId: 'seed-blog-4-img2',
                caption: 'Container orchestration with Kubernetes',
            },
            {
                url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
                publicId: 'seed-blog-4-img3',
                caption: 'Monitoring dashboards and analytics',
            },
            {
                url: 'https://images.unsplash.com/photo-1592609931095-54a2168ae893?w=800&h=500&fit=crop',
                publicId: 'seed-blog-4-img4',
                caption: 'Team collaboration on DevOps practices',
            },
        ],
        category: 'Tutorial',
        tags: ['DevOps', 'CI/CD', 'Automation', 'Docker', 'Kubernetes', 'Infrastructure'],
        author: {
            name: 'James Wilson',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        },
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date('2024-11-28'),
        metaTitle: 'DevOps & CI/CD Implementation Guide 2024',
        metaDescription: 'Learn how to implement DevOps practices and set up CI/CD pipelines for your team.',
    },
];

async function seedBlogs() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing blogs
        await Blog.deleteMany({});
        console.log('Cleared existing blogs');

        // Insert new blogs
        const insertedBlogs = await Blog.insertMany(blogs);
        console.log(`Successfully seeded ${insertedBlogs.length} blogs`);

        // Log the blogs
        insertedBlogs.forEach((blog, index) => {
            console.log(`${index + 1}. "${blog.title}" - ${blog.images.length} images`);
        });

        mongoose.connection.close();
        console.log('\nDatabase connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding blogs:', error);
        mongoose.connection.close();
        process.exit(1);
    }
}

seedBlogs();
