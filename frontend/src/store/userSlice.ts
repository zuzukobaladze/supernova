import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
    },
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
