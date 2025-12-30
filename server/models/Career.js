const mongoose = require('mongoose');

const CareerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
        },
        department: {
            type: String,
            required: [true, 'Department is required'],
            enum: ['Engineering', 'Design', 'Marketing', 'Sales', 'Operations', 'HR', 'Finance', 'Other'],
            default: 'Engineering',
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        type: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
            default: 'Full-time',
        },
        experience: {
            type: String,
            enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager'],
            default: 'Mid Level',
        },
        salary: {
            min: { type: Number },
            max: { type: Number },
            currency: { type: String, default: 'USD' },
            isVisible: { type: Boolean, default: false },
        },
        description: {
            type: String,
            required: [true, 'Job description is required'],
        },
        requirements: [{
            type: String,
        }],
        responsibilities: [{
            type: String,
        }],
        benefits: [{
            type: String,
        }],
        skills: [{
            type: String,
        }],
        applicationEmail: {
            type: String,
            trim: true,
        },
        applicationUrl: {
            type: String,
            trim: true,
        },
        deadline: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Career', CareerSchema);
