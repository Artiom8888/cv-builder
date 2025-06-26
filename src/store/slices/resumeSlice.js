import { createSlice } from "@reduxjs/toolkit";

const resumeSlices = createSlice({
  name:'resume',
  initialState: {
    items:[],
    selectedResumeId: null,
    status: 'idle',
    error: null,
  },
  reducers:{
    setSelectedResumeId: (state, action) => {
      state.selectedResumeId = action.payload;
    },
    addResume: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.items = action.payload;
      }

      if (typeof action.payload === 'object') {
        state.items.push(action.payload);
      }
    }
  }
})

export const { setSelectedResumeId } = resumeSlices.actions;
export default resumeSlices.reducer;

// Selectors
export const selectResumeId = (state) => state.resume.selectedResumeId;