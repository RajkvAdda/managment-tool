import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  tourState: {
    run: false,
    steps: {},
    stepIndex: null,
  },
  quickSearch: {
    isOpen: false,
    search: '',
    screenList: [],
  },
};

const commonSlice = createSlice({
  name: 'commonstate',
  initialState,
  reducers: {
    // tour
    startTour(state, action) {
      state.tourState = { run: true, steps: action.payload };
    },
    setTourStep(state, action) {
      state.tourState.stepIndex = action.payload;
    },
    endTour(state) {
      state.tourState = { run: false };
    },
    setQuickSearch(state, action) {
      state.quickSearch = { ...state.quickSearch, ...action.payload };
    },
  },
});

export const { startTour, endTour, setQuickSearch } = commonSlice.actions;
export default commonSlice.reducer;
