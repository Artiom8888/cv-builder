import { createSlice } from '@reduxjs/toolkit';

const experienceSlice = createSlice({
  name: 'experience',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addExperience: (state,action) => {
      const exp = {
        id: state.items.length + 1,
        jobRole: '',
        startDate: '2022-04-17',
        endDate: '2022-04-17',
        keyResponsibilities: [{
          scope: '',
          techStack: [],
          responsibilities: [''],
          newTechStack: '',
        }],
      }
      state.items.push(exp);
    },
    addTechStack: (state, action) => {
      const { experienceId, scopeIndex } = action.payload;
      const exp = state.items.find(exp => exp.id === experienceId);
      if (exp && exp.keyResponsibilities[scopeIndex] && !exp.keyResponsibilities[scopeIndex].techStack.some(tech => tech === exp.keyResponsibilities[scopeIndex].newTechStack.trim())) {
        exp.keyResponsibilities[scopeIndex].techStack.push(exp.keyResponsibilities[scopeIndex].newTechStack.trim());
        exp.keyResponsibilities[scopeIndex].newTechStack = '';
      }
    },
    addScope: (state, action) => {
      const experienceId = action.payload;
      const exp = state.items.find(exp => exp.id === experienceId);
      if (exp) {
        exp.keyResponsibilities.push({ scope: '', techStack: [], newTechStack: '', responsibilities: [''] });
      }
    },
    addResponsibility: (state, action) => {
      const { experienceId, scopeIndex } = action.payload;
      const exp = state.items.find(exp => exp.id === experienceId);
      if (exp && exp.keyResponsibilities[scopeIndex]) {
        exp.keyResponsibilities[scopeIndex].responsibilities.push('');
      }
    },
    updateExperienceField: (state, action) => {
      const { id, field, value } = action.payload;
      const exp = state.items.find(exp => exp.id === id);
      if (exp) {
        exp[field] = value;
      }
    },
    updateScope: (state, action) => {
      const { experienceId, scopeIndex, value } = action.payload;
      const exp = state.items.find(exp => exp.id === experienceId);
      if (exp && exp.keyResponsibilities[scopeIndex]) {
        exp.keyResponsibilities[scopeIndex].scope = value;
      }
    },
    updateResponsibility: (state, action) => {
      const { experienceId, scopeIndex, responsibilityIndex, value } = action.payload;
      const exp = state.items.find(exp => exp.id === experienceId);
      if (exp && exp.keyResponsibilities[scopeIndex]) {
        exp.keyResponsibilities[scopeIndex].responsibilities[responsibilityIndex] = value;
      }
    },
    updateNewTechStack: (state, action) => {
      const { experienceId, scopeIndex, value } = action.payload;
      const exp = state.items.find(exp => exp.id === experienceId);
      if (exp && exp.keyResponsibilities[scopeIndex]) {
        exp.keyResponsibilities[scopeIndex].newTechStack = value;
      }
    },
    removeExperience: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    removeTechStack: (state, action) => {
      const { experienceId, scopeIndex, techToRemove } = action.payload;
      const exp = state.items.find(exp => exp.id === experienceId);
      if (exp) {
        exp.keyResponsibilities[scopeIndex].techStack = exp.keyResponsibilities[scopeIndex].techStack.filter(tech => tech !== techToRemove);
      }
    },
    removeScope: (state, action) => {
      const { experienceId, scopeIndex } = action.payload;
      const exp = state.items.find(exp => exp.id === experienceId);
      if (exp) {
        exp.keyResponsibilities = exp.keyResponsibilities.filter((_, idx) => idx !== scopeIndex);
      }
    },
    removeResponsibility: (state, action) => {
      const { experienceId, scopeIndex, responsibilityIndex } = action.payload;
      const exp = state.items.find(exp => exp.id === experienceId);
      if (exp && exp.keyResponsibilities[scopeIndex]) {
        exp.keyResponsibilities[scopeIndex].responsibilities = exp.keyResponsibilities[scopeIndex].responsibilities.filter(
          (_, idx) => idx !== responsibilityIndex
        );
      }
    },
  },
});

export const { addExperience,
               addScope,
               addTechStack,
               addResponsibility,
               updateExperienceField,
               updateScope,
               updateResponsibility,
               updateNewTechStack,
               removeExperience, 
               removeTechStack,
               removeScope,
               removeResponsibility,
               } = experienceSlice.actions;
export default experienceSlice.reducer;

// Selectors
export const selectExperiences = (state) => state.experience.items;