const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@Marici Technology.com' });

        if (existingAdmin) {
            console.log('Admin user already exists:');
            console.log('  Email: admin@Marici Technology.com');
            console.log('  Username:', existingAdmin.username);
            await mongoose.connection.close();
            process.exit(0);
        }

        // Create admin user
        const admin = await Admin.create({
            username: 'admin',
            email: 'admin@Marici Technology.com',
            password: 'admin123', // Change this in production!
        });

        console.log('');
        console.log('=================================');
        console.log('   Admin user created successfully!');
        console.log('=================================');
        console.log('');
        console.log('  Email:    admin@Marici Technology.com');
        console.log('  Password: admin123');
        console.log('');
        console.log('  ⚠️  Please change the password after first login!');
        console.log('');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedAdmin();
