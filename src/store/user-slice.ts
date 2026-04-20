import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../const.ts';
import { checkAuth, login, logout } from './api-actions.ts';

export type UserState = {
  authorizationStatus: AuthorizationStatus;
  authToken: string | null;
  email: string | null;
  loading: boolean;
};

const initialState: UserState = {
  authorizationStatus: AuthorizationStatus.NoAuth,
  authToken: null,
  email: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthorizationStatus: (
      state,
      action: PayloadAction<AuthorizationStatus>,
    ) => {
      state.authorizationStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.authToken = action.payload.token;
        state.email = action.payload.email;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.authorizationStatus = AuthorizationStatus.NoAuth;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.authToken = action.payload.token;
        state.email = action.payload.email;
      })
      .addCase(login.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
      })
      .addCase(logout.fulfilled, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.authToken = null;
        state.email = null;
      });
  },
});

export const { setAuthorizationStatus } = userSlice.actions;
export const userReducer = userSlice.reducer;
