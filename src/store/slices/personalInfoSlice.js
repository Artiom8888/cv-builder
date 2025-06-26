import { createSlice } from '@reduxjs/toolkit';

const personalInfoSlice = createSlice({
  name: 'personalInfo',
  initialState: {
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    linkedin: '',
    photo: null,
  },
  reducers: {
    updatePersonalInfo: (state, action) => {
      const {field, value} = action.payload;
      state[field] = value;
    },
    setPhoto: (state, action) => {
      state.photo = action.payload;
    },
  },
});

export const { updatePersonalInfo, setPhoto } = personalInfoSlice.actions;
export default personalInfoSlice.reducer;

// Selectors
export const selectPersonalInfo = (state) => state.personalInfo;