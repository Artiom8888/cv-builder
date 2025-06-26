import { configureStore } from '@reduxjs/toolkit';
import personalInfoReducer from './slices/personalInfoSlice';
import experienceReducer from './slices/experienceSlice';
import skillsReducer from './slices/skillsSlice';
import educationReducer from './slices/educationSlice';
import languagesReducer from './slices/languageSlice';
import projectsReducer from './slices/projectsSlice';
import resumeStatusReducer from './slices/resumeStatusSlice';
import resumeReducer from './slices/resumeSlice';

export const store = configureStore({
  reducer: {
    personalInfo: personalInfoReducer,
    experience: experienceReducer,
    skills: skillsReducer,
    education: educationReducer,
    languages: languagesReducer,
    projects: projectsReducer,
    resumeStatus: resumeStatusReducer,
    resume: resumeReducer
  },
});