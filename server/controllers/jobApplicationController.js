const JobApplication = require('../models/JobApplication');
const Career = require('../models/Career');
const cloudinary = require('../config/cloudinary');

// @desc    Submit job application
// @route   POST /api/applications
// @access  Public
const submitApplication = async (req, res) => {
    try {
        const {
            careerId, firstName, lastName, email, phone,
            coverLetter, linkedIn, portfolio, experience,
            currentCompany, noticePeriod, expectedSalary,
            howDidYouHear, additionalNotes
        } = req.body;

        // Check if career exists and is active
        const career = await Career.findById(careerId);
        if (!career || !career.isActive) {
            return res.status(404).json({ message: 'Job position not found or no longer accepting applications' });
        }

        // Check for duplicate application
        const existingApplication = await JobApplication.findOne({
            career: careerId,
            email: email.toLowerCase(),
        });
        if (existingApplication) {
            return res.status(400).json({
                message: 'You have already applied for this position',
                trackingId: existingApplication.trackingId
            });
        }

        const applicationData = {
            career: careerId,
            firstName,
            lastName,
            email: email.toLowerCase(),
            phone,
            coverLetter,
            linkedIn,
            portfolio,
            experience,
            currentCompany,
            noticePeriod,
            expectedSalary,
            howDidYouHear,
            additionalNotes,
        };

        // Handle resume upload from memory buffer
        if (req.file) {
            // Upload buffer to Cloudinary using upload_stream
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'marici-technology/applications',
                        resource_type: 'raw',
                        public_id: `resume_${Date.now()}_${req.file.originalname.replace(/\.[^/.]+$/, '')}`,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });

            applicationData.resume = {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                filename: req.file.originalname,
            };
        }

        const application = await JobApplication.create(applicationData);

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            trackingId: application.trackingId,
        });
    } catch (error) {
        console.error('Application error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit general resume (no specific position)
// @route   POST /api/applications/general
// @access  Public
const submitGeneralResume = async (req, res) => {
    try {
        const {
            firstName, lastName, email, phone,
            coverLetter, linkedIn, portfolio, experience,
            currentCompany, noticePeriod, expectedSalary,
            howDidYouHear, additionalNotes
        } = req.body;

        // Check for existing general submission with same email
        const existingSubmission = await JobApplication.findOne({
            email: email.toLowerCase(),
            isGeneralSubmission: true,
        });
        if (existingSubmission) {
            return res.status(400).json({
                message: 'You have already submitted your resume. You can track your submission using your tracking ID.',
                trackingId: existingSubmission.trackingId
            });
        }

        const applicationData = {
            isGeneralSubmission: true,
            firstName,
            lastName,
            email: email.toLowerCase(),
            phone,
            coverLetter,
            linkedIn,
            portfolio,
            experience,
            currentCompany,
            noticePeriod,
            expectedSalary,
            howDidYouHear,
            additionalNotes,
        };

        // Handle resume upload from memory buffer
        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'marici-technology/general-resumes',
                        resource_type: 'raw',
                        public_id: `resume_${Date.now()}_${req.file.originalname.replace(/\.[^/.]+$/, '')}`,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });

            applicationData.resume = {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                filename: req.file.originalname,
            };
        }

        const application = await JobApplication.create(applicationData);

        res.status(201).json({
            success: true,
            message: 'Resume submitted successfully! We will contact you if there\'s a good fit.',
            trackingId: application.trackingId,
        });
    } catch (error) {
        console.error('General resume error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Track application by tracking ID and email
// @route   POST /api/applications/track
// @access  Public
const trackApplication = async (req, res) => {
    try {
        const { trackingId, email } = req.body;

        if (!trackingId || !email) {
            return res.status(400).json({ message: 'Tracking ID and email are required' });
        }

        const application = await JobApplication.findOne({
            trackingId: trackingId.toUpperCase(),
            email: email.toLowerCase(),
        }).populate('career', 'title department location type');

        if (!application) {
            return res.status(404).json({ message: 'Application not found. Please check your tracking ID and email.' });
        }

        // Return limited info for security
        res.json({
            trackingId: application.trackingId,
            status: application.status,
            position: application.career?.title,
            department: application.career?.department,
            location: application.career?.location,
            appliedAt: application.createdAt,
            interviewDate: application.interviewDate,
            updatedAt: application.updatedAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications by email
// @route   POST /api/applications/my-applications
// @access  Public
const getMyApplications = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const applications = await JobApplication.find({
            email: email.toLowerCase(),
        })
            .populate('career', 'title department location type')
            .sort({ createdAt: -1 });

        res.json(applications.map(app => ({
            trackingId: app.trackingId,
            status: app.status,
            position: app.career?.title,
            department: app.career?.department,
            location: app.career?.location,
            appliedAt: app.createdAt,
            interviewDate: app.interviewDate,
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications
// @access  Private (Admin)
const getAllApplications = async (req, res) => {
    try {
        const { status, career } = req.query;
        let query = {};

        if (status) query.status = status;
        if (career) query.career = career;

        const applications = await JobApplication.find(query)
            .populate('career', 'title department location type')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving applications.' });
    }
};

// @desc    Get single application (Admin)
// @route   GET /api/applications/:id
// @access  Private (Admin)
const getApplicationById = async (req, res) => {
    try {
        const application = await JobApplication.findById(req.params.id)
            .populate('career', 'title department location type experience');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status (Admin)
// @route   PUT /api/applications/:id
// @access  Private (Admin)
const updateApplication = async (req, res) => {
    try {
        const application = await JobApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const { status, adminNotes, interviewDate } = req.body;

        if (status) application.status = status;
        if (adminNotes !== undefined) application.adminNotes = adminNotes;
        if (interviewDate !== undefined) application.interviewDate = interviewDate ? new Date(interviewDate) : null;

        const updatedApplication = await application.save();
        await updatedApplication.populate('career', 'title department location type');

        res.json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete application (Admin)
// @route   DELETE /api/applications/:id
// @access  Private (Admin)
const deleteApplication = async (req, res) => {
    try {
        const application = await JobApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Delete resume from cloudinary
        if (application.resume?.publicId) {
            await cloudinary.uploader.destroy(application.resume.publicId);
        }

        await JobApplication.findByIdAndDelete(req.params.id);
        res.json({ message: 'Application deleted successfully', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get application stats (Admin)
// @route   GET /api/applications/stats
// @access  Private (Admin)
const getApplicationStats = async (req, res) => {
    try {
        const total = await JobApplication.countDocuments();
        const submitted = await JobApplication.countDocuments({ status: 'submitted' });
        const reviewing = await JobApplication.countDocuments({ status: 'reviewing' });
        const shortlisted = await JobApplication.countDocuments({ status: 'shortlisted' });
        const interview = await JobApplication.countDocuments({ status: 'interview' });
        const offered = await JobApplication.countDocuments({ status: 'offered' });
        const hired = await JobApplication.countDocuments({ status: 'hired' });
        const rejected = await JobApplication.countDocuments({ status: 'rejected' });

        res.json({
            total,
            submitted,
            reviewing,
            shortlisted,
            interview,
            offered,
            hired,
            rejected,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving stats.' });
    }
};

module.exports = {
    submitApplication,
    submitGeneralResume,
    trackApplication,
    getMyApplications,
    getAllApplications,
    getApplicationById,
    updateApplication,
    deleteApplication,
    getApplicationStats,
};
