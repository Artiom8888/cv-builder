const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    photo: {
        type: Buffer,
        required: false
    },
    templateId: {
        type: String,
        required: false,
        trim: true
    },
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    experience: [{ 
        position: {
            type: String,
            required: false,
            trim: true
        },
        keyResponsibilities: [{
            scope: {
                type: String,
                required: false,
                trim: true
            },
            techStack: [{
                type: String,
                trim: true
            }],
            responsibilities: [{
                type: String,
                required: false,
                trim: true
            }]
        }],
        startDate: {
            type: Date,
            required: false
        },
        endDate: {
            type: Date,
            required: false
        }
    }],
    contactInfo: { 
        phone: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: false,
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        linkedIn: {
            type: String,
            trim: true
        }
    },
    education: [{ 
        institution: {
            type: String,
            required: false,
            trim: true
        },
        degree: {
            type: String,
            required: false,
            trim: true
        },
        fieldOfStudy: {
            type: String,
            required: false,
            trim: true
        },
        startDate: {
            type: Date,
            required: false
        },
        endDate: {
            type: Date,
            required: false
        }
    }],
    skills: [{ 
        skillName: {
            type: String,
            required: false,
            trim: true
        },
        level: {
            type: String,
            required: false,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
        }
    }],
    projects: [{ 
        projectName: {
            type: String,
            required: false,
            trim: false
        },
        description: {
            type: String,
            required: false,
            trim: false
        },
        technologies: [{
            type: String,
            trim: false
        }],
        gitHubLink: {
            type: String,
            trim: false
        },
        demoLink: {
            type: String,
            trim: false
        },
        image: {
            type: Buffer,
            required: false
        }
    }],
    languages: [{ 
        language: {
            type: String,
            required: false,
            trim: true
        },
        level: {
            type: String,
            required: false,
            enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native']
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for frequently queried fields
ResumeSchema.index({ firstName: 1, lastName: 1 });
ResumeSchema.index({ 'experience.position': 1 });
ResumeSchema.index({ 'skills.skillName': 1 });

module.exports = mongoose.model("Resume", ResumeSchema);