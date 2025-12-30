const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Route files
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const projectRoutes = require('./routes/projectRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const teamRoutes = require('./routes/teamRoutes');
const clientRoutes = require('./routes/clientRoutes');
const careerRoutes = require('./routes/careerRoutes');
const blogRoutes = require('./routes/blogRoutes');
const jobApplicationRoutes = require('./routes/jobApplicationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/applications', jobApplicationRoutes);
app.use('/api/settings', settingsRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Marici Technology API is running...');
});

// Error Middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
