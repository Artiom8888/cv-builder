import React from 'react';
import './ResumePreview.css'; // Import the CSS file
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import dayjs from 'dayjs';
import { getSkillLevelLabel } from '../../../utils/skillUtils';
import { useSelector } from 'react-redux';
import { selectSkills } from '../../../store/slices/skillsSlice';
import { selectPersonalInfo } from '../../../store/slices/personalInfoSlice';
import { selectEducation } from '../../../store/slices/educationSlice';
import { selectExperiences } from '../../../store/slices/experienceSlice';
import { selectProject } from '../../../store/slices/projectsSlice';
import { selectLanguage } from '../../../store/slices/languageSlice';

const ResumePreview = () => {
  // Limit the number of items shown
  const skills = useSelector(selectSkills);
  const languages = useSelector(selectLanguage);
  const projects = useSelector(selectProject);
  const education = useSelector(selectEducation);
  const experiences = useSelector(selectExperiences);
  const personalInfo = useSelector(selectPersonalInfo);
  // const limitedExperiences = experiences?.slice(0, 2) || [];
  // const limitedEducation = education?.slice(0, 2) || [];
  // const limitedProjects = projects?.slice(0, 2) || [];
  // const limitedLanguages = languages?.slice(0, 3) || [];
  // const limitedSkills = skills?.slice(0, 8) || [];

  return (
    <Box className="preview-container">
      <Box className="header">
        <Avatar variant="square" 
                sx={{width: '110px', height: '150px'}} 
                src={personalInfo.photo|| ''} 
                alt="Profile" 
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h2" gutterBottom sx={{ fontSize: '24px' }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </Typography>
          <Typography variant="h3" color="text.secondary" gutterBottom sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
            {personalInfo.jobTitle}
          </Typography>
          <Box className="contact-info">
            {personalInfo.linkedin && (
              <Box className="contact-item">
                <LinkedInIcon fontSize="small" />
                <Typography variant="body2">{personalInfo.linkedin}</Typography>
              </Box>
            )}
            {personalInfo.email && (
              <Box className="contact-item">
                <EmailIcon fontSize="small" />
                <Typography variant="body2">{personalInfo.email}</Typography>
              </Box>
            )}
            {personalInfo.phone && (
              <Box className="contact-item">
                <PhoneIcon fontSize="small" />
                <Typography variant="body2">{personalInfo.phone}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {skills.length > 0 && (
           <Box className="section">
           <Typography className="section-title">Skills</Typography>
           <Box className="tech-stack">
             {skills.map((skill, index) => (
               <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '4px', paddingBottom:'5px', paddingRight:'2px' }}>
                 <Chip 
                   key={index} 
                   label={<><span style={{color:'red'}}>{skill.name}</span> - <span>{getSkillLevelLabel(skill.level)}</span></> } 
                   size="small"
                   sx={{ fontSize: '16px', fontWeight: 'bold' }}
                 />
               </Box>
             ))}
           </Box>
         </Box>
      )}

      {experiences.length > 0 && (
        <Box className="section">
          <Typography className="section-title">Experience</Typography>
          {experiences.map((exp, index) => (
            <Box key={index} sx={{ mb: 0.75 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '16px', textDecoration:'underline', fontStyle: 'italic', marginBottom: '10px' }}>
                <span>
                  {exp.jobRole} : {dayjs(exp.startDate).format('MMM YYYY')} - {dayjs(exp.endDate).format('MMM YYYY')}
                </span>
              </Typography>
              {exp.keyResponsibilities?.map((scope, scopeIndex) => (
                <Box key={scopeIndex} sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '16px', color: '#228be6' }}>
                    {scope.scope}
                  </Typography>
                  {scope.techStack && scope.techStack.length > 0 && (
                    <Box className="tech-stack">
                      <Typography variant="body2" fontWeight="bold" sx={{fontSize: '16px', fontStyle:'italic', textAlign: 'center', marginTop: '10px'}}>Tech Stack:</Typography>
                      {scope.techStack.map((tech, techIndex) => (
                        <Chip 
                          key={techIndex} 
                          label={tech} 
                          size="small"
                          sx={{ fontSize: '14px' }}
                        />
                      ))}
                    </Box>
                  )}
                  <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '16px', textAlign: 'center', marginTop: '10px' }}>
                    Key Responsibilities:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mb: 1, ml: 4 }}>
                    {scope.responsibilities.map((responsibility, respIndex) => (
                      <Typography
                        key={respIndex}
                        component="li"
                        variant="body2"
                        sx={{ fontSize: '14px', mb: 0.5, fontStyle: 'italic', fontWeight: '700' }}
                      >
                        {responsibility}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}        
            </Box>
          ))}
        </Box>
      )}

      {education.length > 0 && (
        <Box className="section">
          <Typography className="section-title">Education</Typography>
          {education.map((edu, index) => (
            <Box key={index} sx={{ mb: 0.75 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '0.8rem' }}>
                {edu.institution}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {edu.degree} in {edu.field}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {dayjs(edu.startDate).format('MMM YYYY')} - {dayjs(edu.endDate).format('MMM YYYY')}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {projects.length > 0 && (
        <Box className="section">
          <Typography className="section-title">Projects</Typography>
          <Grid container spacing={1}>
            {projects.map((project, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ mb: 0.75 }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '0.8rem' }}>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ fontSize: '0.7rem' }}>
                    {project.description}
                  </Typography>
                  {project.technologies && project.technologies.length > 0 && (
                    <Box className="tech-stack">
                      {project.technologies.slice(0, 2).map((tech, techIndex) => (
                        <Chip 
                          key={techIndex} 
                          label={tech} 
                          variant="outlined" 
                          size="small"
                          sx={{ fontSize: '0.65rem' }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {languages.length > 0 && (
        <Box className="section">
          <Typography className="section-title">Languages</Typography>
          <Grid container spacing={1}>
            {languages.map((lang, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ fontSize: '0.7rem' }}>{lang.language}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {lang.level}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ResumePreview; 