import { createSlice } from '@reduxjs/toolkit';

const resumeStatusSlice = createSlice({
  name: 'resumeStatus',
  initialState: {
    isSaving: false,
    lastSaved: null,
    error: null,
    activeTab: 0,
    hasPreviewed: false,
  },
  reducers: {
    setSaving: (state, action) => {
      state.isSaving = action.payload;
    },
    setLastSaved: (state, action) => {
      state.lastSaved = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setHasPreviewed: (state, action) => {
      state.hasPreviewed = action.payload;
    },
  },
});

export const { setSaving, setLastSaved, setError, setActiveTab, setHasPreviewed } = resumeStatusSlice.actions;
export default resumeStatusSlice.reducer;