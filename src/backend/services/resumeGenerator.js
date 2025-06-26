const PDFDocument = require('pdfkit');
const { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, Packer } = require('docx');
const fs = require('fs');
const path = require('path');
const html_to_pdf = require('html-pdf-node');

class ResumeGenerator {
    static async generatePDF(resumeData) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument();
                const chunks = [];

                doc.on('data', chunk => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));

                // Header
                doc.fontSize(24).text(`${resumeData.firstName} ${resumeData.lastName}`, { align: 'center' });
                doc.fontSize(16).text(resumeData.jobTitle, { align: 'center' });
                doc.moveDown();

                // Contact Info
                doc.fontSize(12);
                if (resumeData.contactInfo) {
                    doc.text(`Email: ${resumeData.contactInfo.email || ''}`);
                    doc.text(`Phone: ${resumeData.contactInfo.phone || ''}`);
                    doc.text(`LinkedIn: ${resumeData.contactInfo.linkedIn || ''}`);
                }
                doc.moveDown();

                // Skills
                doc.fontSize(14).text('Skills', { underline: true });
                doc.fontSize(12);
                if (resumeData.skills && resumeData.skills.length > 0) {
                    resumeData.skills.forEach(skill => {
                        doc.text(`• ${skill.skillName} - ${skill.level}`);
                    });
                }
                doc.moveDown();

                // Experience
                doc.fontSize(14).text('Experience', { underline: true });
                doc.fontSize(12);
                if (resumeData.experience && resumeData.experience.length > 0) {
                    resumeData.experience.forEach(exp => {
                        doc.text(exp.position);
                        doc.text(`${new Date(exp.startDate).toLocaleDateString()} - ${exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}`);
                        if (exp.keyResponsibilities) {
                            exp.keyResponsibilities.forEach(kr => {
                                doc.text(`• ${kr.scope}`);
                                kr.responsibilities.forEach(r => {
                                    doc.text(`  - ${r}`);
                                });
                            });
                        }
                        doc.moveDown();
                    });
                }

                // Education
                doc.fontSize(14).text('Education', { underline: true });
                doc.fontSize(12);
                if (resumeData.education && resumeData.education.length > 0) {
                    resumeData.education.forEach(edu => {
                        doc.text(edu.institution);
                        doc.text(`${edu.degree} in ${edu.fieldOfStudy}`);
                        doc.text(`${new Date(edu.startDate).toLocaleDateString()} - ${edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}`);
                        doc.moveDown();
                    });
                }

                // Languages
                doc.fontSize(14).text('Languages', { underline: true });
                doc.fontSize(12);
                if (resumeData.languages && resumeData.languages.length > 0) {
                    resumeData.languages.forEach(lang => {
                        doc.text(`• ${lang.language} - ${lang.level}`);
                    });
                }

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    static async generateDOCX(resumeData) {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    // Header
                    new Paragraph({
                        text: `${resumeData.firstName} ${resumeData.lastName}`,
                        heading: HeadingLevel.HEADING_1,
                        alignment: 'center'
                    }),
                    new Paragraph({
                        text: resumeData.jobTitle,
                        heading: HeadingLevel.HEADING_2,
                        alignment: 'center'
                    }),

                    // Contact Info
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Contact Information', bold: true, size: 28 }),
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun(`Email: ${resumeData.contactInfo?.email || ''}\n`),
                            new TextRun(`Phone: ${resumeData.contactInfo?.phone || ''}\n`),
                            new TextRun(`LinkedIn: ${resumeData.contactInfo?.linkedIn || ''}\n`),
                        ]
                    }),

                    // Skills
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Skills', bold: true, size: 28 }),
                        ]
                    }),
                    ...(resumeData.skills || []).map(skill => 
                        new Paragraph({
                            children: [
                                new TextRun(`• ${skill.skillName} - ${skill.level}`),
                            ]
                        })
                    ),

                    // Experience
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Experience', bold: true, size: 28 }),
                        ]
                    }),
                    ...(resumeData.experience || []).flatMap(exp => [
                        new Paragraph({
                            children: [
                                new TextRun({ text: exp.position, bold: true }),
                            ]
                        }),
                        new Paragraph({
                            children: [
                                new TextRun(`${new Date(exp.startDate).toLocaleDateString()} - ${exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}`),
                            ]
                        }),
                        ...(exp.keyResponsibilities || []).flatMap(kr => [
                            new Paragraph({
                                children: [
                                    new TextRun(`• ${kr.scope}`),
                                ]
                            }),
                            ...(kr.responsibilities || []).map(r => 
                                new Paragraph({
                                    children: [
                                        new TextRun(`  - ${r}`),
                                    ]
                                })
                            )
                        ])
                    ]),

                    // Education
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Education', bold: true, size: 28 }),
                        ]
                    }),
                    ...(resumeData.education || []).flatMap(edu => [
                        new Paragraph({
                            children: [
                                new TextRun({ text: edu.institution, bold: true }),
                            ]
                        }),
                        new Paragraph({
                            children: [
                                new TextRun(`${edu.degree} in ${edu.fieldOfStudy}`),
                            ]
                        }),
                        new Paragraph({
                            children: [
                                new TextRun(`${new Date(edu.startDate).toLocaleDateString()} - ${edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}`),
                            ]
                        })
                    ]),

                    // Languages
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Languages', bold: true, size: 28 }),
                        ]
                    }),
                    ...(resumeData.languages || []).map(lang => 
                        new Paragraph({
                            children: [
                                new TextRun(`• ${lang.language} - ${lang.level}`),
                            ]
                        })
                    )
                ]
            }]
        });

        return await Packer.toBuffer(doc);
    }
}

module.exports = ResumeGenerator; 