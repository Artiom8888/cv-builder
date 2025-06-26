import { createSlice } from '@reduxjs/toolkit';

const skillsSlice = createSlice({
  name: 'skills',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addSkill: (state, action) => {
      const skillName = action.payload;

      // Check if skillName is defined and is a string
      if (typeof skillName === 'string' && skillName.trim()) {
        state.items.push(
          {
            id: state.items.length + 1,
            name: skillName.trim(),
            level: 50,
          }
        );
      } else {
        console.error('Invalid skill name:', skillName);
        // Optionally, you can handle the error case here, e.g., by throwing an error or returning early
      }
    },
    updateSkill: (state, action) => {
      const { id, field, value } = action.payload;
      const skill = state.items.find(skill => skill.id === id);
      if (skill) {
        skill[field] = value;
      }
    },
    removeSkill: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const { addSkill, updateSkill, removeSkill, resetSkills } = skillsSlice.actions;
export default skillsSlice.reducer;
// Selectors
export const selectSkills = (state) => state.skills.items;
