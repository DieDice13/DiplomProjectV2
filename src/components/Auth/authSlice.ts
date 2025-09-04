import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthInitialized = true;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthInitialized = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthInitialized = false;
      localStorage.removeItem('token');
    },
  },
});

export const { setUser, clearUser, logout } = authSlice.actions;
export default authSlice.reducer;
