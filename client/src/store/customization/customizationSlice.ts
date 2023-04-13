import { createSlice } from '@reduxjs/toolkit';

//
const initialState = {
  fontFamily: `'Roboto', sans-serif`,
  fontSize: 16,
  borderRadius: 6,
  mode: 'light',
  direction: 'left',
  primary: '#2065D1',
  secondary: '#3366FF',
};

//
const customizationSlice = createSlice({
  name: 'customization',
  initialState,
  reducers: {
    setCustomization(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setCustomization } = customizationSlice.actions;

export default customizationSlice.reducer;
