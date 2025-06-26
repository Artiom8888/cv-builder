const express = require("express");
const Resume = require("../models/Resume");
const mongoose = require("mongoose");
const multer = require("multer");
const ResumeGenerator = require("../services/resumeGenerator");

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Create a resume with image
router.post("/resumes", upload.single('photo'), async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            jobTitle,
            userId,
            email,
            phone,
            location,
            summary,
            keyResponsibilities,
            techStack
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !jobTitle || !userId) {
            return res.status(400).json({ 
                message: 'Missing required fields: firstName, lastName, jobTitle, and userId are required.' 
            });
        }

        // Parse nested arrays if they exist
        const parsedKeyResponsibilities = keyResponsibilities ? JSON.parse(keyResponsibilities) : [];
        const parsedTechStack = techStack ? JSON.parse(techStack) : [];

        // Create resume data with the buffer from multer
        const resumeData = {
            firstName,
            lastName,
            jobTitle,
            userId,
            email,
            phone,
            location,
            summary,
            keyResponsibilities: parsedKeyResponsibilities,
            techStack: parsedTechStack,
            photo: req.file ? req.file.buffer : null // Store the buffer directly
        };
        console.log(resumeData);
        const resume = new Resume(resumeData);
        await resume.save();
        res.status(201).json(resume);
    } catch (error) {
        console.error('Error creating resume:', error);
        res.status(500).json({ message: 'Error creating resume', error: error.message });
    }
});

// Get all resumes
router.get("/resumes", async (req, res) => {
    try {
        const resumes = await Resume.find();
        res.json(resumes);
    } catch (error) {
        console.error('Error fetching resumes:', error);
        res.status(500).json({ error: 'Error fetching resumes' });
    }
});

// Get a single resume by ID with image
router.get("/resumes/:id", async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        // If the resume has a photo, convert it to base64
        if (resume.photo) {
            const base64Photo = resume.photo.toString('base64');
            resume.photo = `data:image/jpeg;base64,${base64Photo}`;
        }

        res.json(resume);
    } catch (error) {
        console.error('Error fetching resume:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid resume ID' });
        }
        res.status(500).json({ error: 'Error fetching resume' });
    }
});

// Update a resume with image (PUT)
router.put("/resumes/:id", upload.single('photo'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        // If a new photo was uploaded, include it in the update
        if (req.file) {
            updateData.photo = req.file.buffer;
        }

        // Parse all nested objects and arrays
        const fieldsToParse = [
            'skills',
            'experience',
            'projects',
            'education',
            'languages',
            'contactInfo',
            'keyResponsibilities',
            'techStack'
        ];

        fieldsToParse.forEach(field => {
            if (updateData[field]) {
                try {
                    updateData[field] = JSON.parse(updateData[field]);
                } catch (e) {
                    console.error(`Error parsing ${field}:`, e);
                }
            }
        });

        // Ensure dates are properly formatted
        if (updateData.experience) {
            updateData.experience = updateData.experience.map(exp => ({
                ...exp,
                startDate: exp.startDate ? new Date(exp.startDate) : null,
                endDate: exp.endDate ? new Date(exp.endDate) : null
            }));
        }

        if (updateData.education) {
            updateData.education = updateData.education.map(edu => ({
                ...edu,
                startDate: edu.startDate ? new Date(edu.startDate) : null,
                endDate: edu.endDate ? new Date(edu.endDate) : null
            }));
        }

        const resume = await Resume.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        // If the resume has a photo, convert it to base64
        if (resume.photo) {
            const base64Photo = resume.photo.toString('base64');
            resume.photo = `data:image/jpeg;base64,${base64Photo}`;
        }

        res.json(resume);
    } catch (error) {
        console.error('Error updating resume:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid resume ID' });
        }
        res.status(500).json({ error: 'Error updating resume' });
    }
});

// Delete a resume
router.delete("/resumes/:id", async (req, res) => {
    try {
        const resume = await Resume.findByIdAndDelete(req.params.id);
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('Error deleting resume:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid resume ID' });
        }
        res.status(500).json({ error: 'Error deleting resume' });
    }
});

// Get resumes by user ID
router.get("/users/:userId/resumes", async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.params.userId });
        res.json(resumes);
    } catch (error) {
        console.error('Error fetching user resumes:', error);
        res.status(500).json({ error: 'Error fetching user resumes' });
    }
});

// Download resume as PDF
router.get("/resumes/:id/download/pdf", async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        const pdfBuffer = await ResumeGenerator.generatePDF(resume);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${resume.firstName}_${resume.lastName}_Resume.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Error generating PDF' });
    }
});

// Download resume as DOCX
router.get("/resumes/:id/download/docx", async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        const docxBuffer = await ResumeGenerator.generateDOCX(resume);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=${resume.firstName}_${resume.lastName}_Resume.docx`);
        res.send(docxBuffer);
    } catch (error) {
        console.error('Error generating DOCX:', error);
        res.status(500).json({ error: 'Error generating DOCX' });
    }
});

module.exports = router;