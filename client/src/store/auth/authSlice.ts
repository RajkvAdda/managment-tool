import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: {},
  refreshTokenInvoked: false,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginData(state, action) {
      return { ...state, ...action.payload };
    },
    setUserData(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setLoginData, setUserData } = authSlice.actions;

export default authSlice.reducer;
