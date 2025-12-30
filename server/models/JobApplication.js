const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema(
    {
        career: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Career',
            required: false, // Optional for general submissions
        },
        isGeneralSubmission: {
            type: Boolean,
            default: false,
        },
        // Applicant Info
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        // Resume & Cover Letter
        resume: {
            url: { type: String },
            publicId: { type: String },
            filename: { type: String },
        },
        coverLetter: {
            type: String,
        },
        // Additional Info
        linkedIn: {
            type: String,
            trim: true,
        },
        portfolio: {
            type: String,
            trim: true,
        },
        experience: {
            type: String,
            enum: ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'],
        },
        currentCompany: {
            type: String,
            trim: true,
        },
        noticePeriod: {
            type: String,
            trim: true,
        },
        expectedSalary: {
            type: String,
            trim: true,
        },
        howDidYouHear: {
            type: String,
            enum: ['LinkedIn', 'Indeed', 'Company Website', 'Referral', 'Job Board', 'Other'],
        },
        additionalNotes: {
            type: String,
        },
        // Application Status
        status: {
            type: String,
            enum: ['submitted', 'reviewing', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'],
            default: 'submitted',
        },
        // Tracking ID for applicants
        trackingId: {
            type: String,
            unique: true,
        },
        // Admin notes (internal)
        adminNotes: {
            type: String,
        },
        interviewDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Generate unique tracking ID before saving
JobApplicationSchema.pre('save', function (next) {
    if (!this.trackingId) {
        const date = new Date();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.trackingId = `APP-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${random}`;
    }
    next();
});

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
