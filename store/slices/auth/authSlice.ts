import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/apis/auth/types";
import {
  loginUser,
  logoutUser,
  changePasswordUser,
  forgotPasswordUser,
  resetPasswordUser,
  registerUser,
  createUserProfile,
} from "./authThunks";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  registerLoading: boolean;
  profileLoading: boolean;
  logoutLoading: boolean;
  changePasswordLoading: boolean;
  forgotPasswordLoading: boolean;
  resetPasswordLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  registerLoading: false,
  profileLoading: false,
  logoutLoading: false,
  changePasswordLoading: false,
  forgotPasswordLoading: false,
  resetPasswordLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    resetAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload || "Login failed";
      })
      .addCase(logoutUser.pending, (state) => {
        state.logoutLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutLoading = false;
        state.error = action.payload || "Logout failed";
      })
      .addCase(changePasswordUser.pending, (state) => {
        state.changePasswordLoading = true;
        state.error = null;
      })
      .addCase(changePasswordUser.fulfilled, (state) => {
        state.changePasswordLoading = false;
        state.error = null;
      })
      .addCase(changePasswordUser.rejected, (state, action) => {
        state.changePasswordLoading = false;
        state.error = action.payload || "Change password failed";
      })
      .addCase(forgotPasswordUser.pending, (state) => {
        state.forgotPasswordLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordUser.fulfilled, (state) => {
        state.forgotPasswordLoading = false;
        state.error = null;
      })
      .addCase(forgotPasswordUser.rejected, (state, action) => {
        state.forgotPasswordLoading = false;
        state.error = action.payload || "Forgot password request failed";
      })
      .addCase(resetPasswordUser.pending, (state) => {
        state.resetPasswordLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordUser.fulfilled, (state) => {
        state.resetPasswordLoading = false;
        state.error = null;
      })
      .addCase(resetPasswordUser.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.error = action.payload || "Reset password failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload || "Registration failed";
      })
      .addCase(createUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(createUserProfile.fulfilled, (state) => {
        state.profileLoading = false;
        state.error = null;
      })
      .addCase(createUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload || "Failed to create profile";
      });
  },
});

export const { setCredentials, setUser, clearAuth, logout, resetAuthError } =
  authSlice.actions;

export default authSlice.reducer;
