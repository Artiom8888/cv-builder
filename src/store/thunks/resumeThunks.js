import { createAsyncThunk } from '@reduxjs/toolkit';
import { setSaving, setLastSaved, setError } from '../slices/resumeStatusSlice';
import { setSelectedResumeId } from '../slices/resumeSlice';
import resumeApi from '../../backend/api';

export const saveResumeDataBySection = createAsyncThunk(
  'resume/saveTabData',
  async ({ sectionName }, { getState, dispatch, rejectWithValue }) => {
    const state = getState(); // Get the current state

    // Access the relevant parts of the state
    const personalInfo = state.personalInfo; 
    const skills = state.skills.items; 
    const experiences = state.experience.items; 
    const projects = state.projects.items; 
    const education = state.education.items; 
    const languages = state.languages.items;
    const resume = state.resume;

    try {
      const resumeData = {
        userId: personalInfo.userId || '1',
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        jobTitle: personalInfo.jobTitle,
        photo: personalInfo.photo,
        contactInfo: {
          phone: personalInfo.phone || '',
          email: personalInfo.email || '',
          linkedIn: personalInfo.linkedin || ''
        }
      };

      switch (sectionName) {
        case 'skills': // Skills tab
          resumeData.skills = skills.map(skill => ({
            skillName: skill.name,
            level: ['Beginner', 'Intermediate', 'Advanced', 'Expert'][Math.floor(skill.level / 25)]
          }));
          break;
        case 'experience': // Experience tab
          resumeData.experience = experiences.map(exp => ({
            position: exp.jobRole,
            techStack: exp.techStack || [],
            keyResponsibilities: exp.keyResponsibilities || [],
            startDate: exp.startDate,
            endDate: exp.endDate
          }));
          break;
        case 'portfolio': // Portfolio tab
          resumeData.projects = projects.map(project => ({
            projectName: project.name,
            description: project.description,
            technologies: project.technologies || [],
            gitHubLink: project.githubUrl,
            demoLink: project.liveDemoUrl,
            image: project.image
          }));
          break;
        case 'education': // Education tab
          resumeData.education = education.map(edu => ({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.field,
            startDate: edu.startDate,
            endDate: edu.endDate
          }));
          break;
        case 'languages': // Languages tab
          resumeData.languages = languages.map(lang => ({
            language: lang.language,
            level: lang.level || 'A1'
          }));
          break;
        default:
          break;
      }

      if (resume.selectedResumeId) {
        // Update existing resume
        await resumeApi.updateResume(resume.selectedResumeId, resumeData);
        dispatch(setLastSaved(new Date().toISOString()));
      } else {
        // Create new resume
        const response = await resumeApi.createResume(resumeData);
        dispatch(setLastSaved(new Date().toISOString()));
        dispatch(setSelectedResumeId(response._id));
      }
    } catch (error) {
      dispatch(setError(error.message));
      console.error('Error saving tab data:', error);
      return rejectWithValue('Failed to save changes. Please try again.'); // Handle error
    } finally {
      dispatch(setSaving(false));
    }
  }
);