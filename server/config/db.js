const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Marici Technology');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('*** MongoDB Connection Error ***');
        console.error(error); // Log full error object
        console.error(`Error Message: ${error.message}`);
        console.error(`Error Code: ${error.code}`);
        console.error(`Error Name: ${error.name}`);
        process.exit(1);
    }
};

module.exports = connectDB;
