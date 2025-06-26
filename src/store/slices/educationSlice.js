import { createSlice } from "@reduxjs/toolkit";

const educationSlice = createSlice({
  name: 'education',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addEducation:(state, action) => {
      state.items.push({
        id: state.items.length + 1,
        institution: '',
        degree: '',
        field: '',
        startDate: '2022-04-17',
        endDate: '2022-04-17',
      });
    },
    updateEducation: (state, action) => {
      const { id, field, value } = action.payload;
      const edu = state.items.find(edu => edu.id === id);
      if (edu) {
        edu[field] = value; // Update the specific field
      }
    },
    removeEducation:(state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  }
});

export const { addEducation, updateEducation, removeEducation } = educationSlice.actions;
export default educationSlice.reducer;

// Selectors
export const selectEducation = (state) => state.education.items;