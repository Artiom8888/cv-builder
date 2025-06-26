import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
  name: 'languages',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addLanguage:(state, action) => {
      state.items.push({
        id: state.items.length + 1,
        language: '',
        level: '',
        newLanguage: '',
      });
    },
    updateLanguage:(state, action) => {
      const { id, field, value } = action.payload;
      const language = state.items.find(lang => lang.id === id);
      if (language) {
        language[field] = value; // Update the specific field
      }
    },
    removeLanguage:(state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    }
  }
});

export const { addLanguage, updateLanguage, removeLanguage } = languageSlice.actions;
export default languageSlice.reducer;

// Selectors
export const selectLanguage = (state) => state.languages.items;