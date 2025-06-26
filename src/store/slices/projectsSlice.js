import { createSlice } from "@reduxjs/toolkit";

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addProject:(state, action) => {
      state.items.push({
        id: state.items.length + 1,
        name: '',
        description: '',
        technologies: [],
        githubUrl: '',
        liveDemoUrl: '',
        newTechnology: '',
        image: null,
      });
    },
    addTechnology: (state, action) => {
      const { projectId, technology } = action.payload;
      const project = state.items.find(proj => proj.id === projectId);
      if (project && technology.trim() && !project.technologies.includes(technology.trim())) {
        project.technologies.push(technology.trim()); // Add the new technology
        project.newTechnology = ''; // Reset the newTechnology field
      }
    },
    updateProject: (state, action) => {
      const { id, field, value } = action.payload;
      const project = state.items.find(proj => proj.id === id);
      if (project) {
        project[field] = value;
      }
    },
    uploadProjectImage: (state, action) => {
      const { projectId, image } = action.payload;
      const project = state.items.find(proj => proj.id === projectId);
      if (project) {
        project.image = image; // Update the image field with the new image
      }
    },
    removeProject:(state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    removeTechnology: (state, action) => {
      const { projectId, techToRemove } = action.payload;
      const project = state.items.find(proj => proj.id === projectId);
      if (project) {
        project.technologies = project.technologies.filter(tech => tech !== techToRemove); // Remove the specified technology
      }
    },
  }
});

export const { addProject, 
               addTechnology, 
               updateProject,
               uploadProjectImage, 
               removeProject, 
               removeTechnology 
              } = projectsSlice.actions;
export default projectsSlice.reducer;

// Selectors
export const selectProject = (state) => state.projects.items;