import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UpdatePasswordPayload, User } from "../types/userTypes";
import { UserState } from "../types/reduxTypes";
import { DataBody } from "../types/signup";
import customAxios from "../api/axios";
import { toast } from "react-toastify";
import storage from "redux-persist/lib/storage";
const baseUrl = import.meta.env.VITE_APP_BASE_URL;

// Initial State
const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  refreshingToken: false,
  isCheckingAuth: false,
  isUpdated: false,
  success: false,
  activeUsers: null,
  error: {
    message: null,
  },
  message: null,
  accessToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Login Actions
    loginStart(state) {
      state.loading = true;
      state.error.message = null;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loginFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error.message = action.payload ?? "Login failed";
    },

    // Register Actions
    registerStart(state) {
      state.loading = true;
      state.error.message = null;
    },
    registerSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = action.payload;
    },
    registerFailure(state, action: PayloadAction<string | undefined>) {
      state.isAuthenticated = false;
      state.loading = false;
      state.error.message = action.payload || "Registration failed";
    },

    // Load User Actions
    loadUserStart(state) {
      state.loading = true;
    },
    loadUserSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loadUserFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;

      state.error.message = action.payload || "Failed to load user";
    },

    // Refresh Token Actions
    refreshTokenStart(state) {
      state.refreshingToken = true;
      state.loading = true;
    },
    refreshTokenSuccess(state, action: PayloadAction<{ accessToken: string }>) {
      state.refreshingToken = false;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.loading = false;
    },
    refreshTokenFailure(state, action: PayloadAction<string | undefined>) {
      state.refreshingToken = false;
      state.isAuthenticated = false;
      state.loading = false;
      state.error.message = action.payload || "Token refresh failed";
    },

    // Logout Action
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;

      storage.removeItem("persist:root"); // Clear persisted state on logout
    },

    // Update Profile Actions
    updateProfileStart(state) {
      state.loading = true;
      state.error.message = null;
    },
    updateProfileSuccess(state, action: PayloadAction<boolean>) {
      state.loading = false;
      state.isUpdated = action.payload;
    },
    updateProfileFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error.message = action.payload || "Failed to update profile";
    },

    // Update Password Actions
    updatePasswordStart(state) {
      state.loading = true;
      state.error.message = null;
    },
    updatePasswordSuccess(state, action: PayloadAction<boolean>) {
      state.loading = false;
      state.isUpdated = action.payload;
    },
    updatePasswordFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error.message = action.payload || "Failed to update password";
    },

    // Forgot Password Actions
    forgotPasswordStart(state) {
      state.loading = true;
      state.error.message = null;
    },
    forgotPasswordSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.message = action.payload;
    },
    forgotPasswordFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error.message = action.payload || "An error occurred";
    },

    // Reset Password Actions
    resetPasswordStart(state) {
      state.loading = true;
      state.error.message = null;
    },
    resetPasswordSuccess(state, action: PayloadAction<boolean>) {
      state.loading = false;
      state.message = action.payload ? "Password reset successfully" : null;
    },
    resetPasswordFailure(state, action: PayloadAction<string | undefined>) {
      state.loading = false;
      state.error.message = action.payload || "An error occurred";
    },

    // Clear Errors and Reset Update
    clearErrors(state) {
      state.error.message = null;
    },
    resetUpdate(state) {
      state.isUpdated = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  loadUserStart,
  loadUserSuccess,
  loadUserFailure,
  refreshTokenStart,
  refreshTokenSuccess,
  refreshTokenFailure,
  logoutSuccess,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  updatePasswordStart,
  updatePasswordSuccess,
  updatePasswordFailure,
  forgotPasswordStart,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
  clearErrors,
  resetUpdate,
} = userSlice.actions;

// Login User
export const login =
  (
    email: string,
    password: string,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    navigate: any,
    from: any,
    rememberMe: any
  ) =>
  async (dispatch: any) => {
    try {
      dispatch(loginStart());
      const response = await customAxios.post(
        `${baseUrl}/api/v1/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Login successful");
        navigate(from, { replace: true });

        if (rememberMe) {
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
        } else {
          sessionStorage.setItem("email", email);
          sessionStorage.setItem("password", password);
        }
      }
      dispatch(loginSuccess(response.data.user));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Login failed";
      setErrorMessage(errorMessage);
      dispatch(loginFailure(errorMessage));
    }
  };

// Register User
export const register =
  (
    data: DataBody,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
    setSuccessErrorMessage: React.Dispatch<React.SetStateAction<string>>
  ) =>
  async (dispatch: any) => {
    try {
      dispatch(registerStart());
      const response = await customAxios.post(
        `${baseUrl}/api/v1/register`,
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("password");
      }
      setSuccessErrorMessage(response.data.message);
      dispatch(registerSuccess(response.data.user));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Registration failed";
      setErrorMessage(errorMessage);
      dispatch(registerFailure(errorMessage));
    }
  };

// Load User
export const loadUser = () => async (dispatch: any) => {
  try {
    dispatch(loadUserStart());
    const response = await customAxios.get(`${baseUrl}/api/v1/me`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    console.log(response, "hello user");
    dispatch(loadUserSuccess(response.data));
  } catch (error: any) {
    dispatch(loadUserFailure(error.response?.data?.message));
  }
};

// Logout User
export const logout = () => async (dispatch: any) => {
  try {
    await customAxios.post(
      `${baseUrl}/api/v1/logout`,
      {},
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    dispatch(logoutSuccess());
  } catch (error: any) {}
};

// Refresh Token
export const refreshToken = () => async (dispatch: any) => {
  try {
    dispatch(refreshTokenStart());

    const response = await customAxios.post(
      `${baseUrl}/api/v1/refresh-token`,
      {},
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    dispatch(refreshTokenSuccess(response.data.accessToken));
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Token refresh failed";
    dispatch(refreshTokenFailure(errorMessage));
  }
};

export const updateProfile =
  (userData: Record<string, unknown>) => async (dispatch: any) => {
    try {
      dispatch(updateProfileStart());
      const response = await customAxios.put(
        `${baseUrl}/api/v1/me/update`,
        userData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      dispatch(updateProfileSuccess(response.data.success));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile.";
      dispatch(updateProfileFailure(errorMessage));
    }
  };

// Update password action
export const updatePassword =
  (passwords: UpdatePasswordPayload) => async (dispatch: any) => {
    try {
      dispatch(updatePasswordStart());
      const response = await customAxios.put(
        `${baseUrl}/api/v1/password/update`,
        passwords,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      dispatch(updatePasswordSuccess(response.data.success));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update password.";
      // toast.error(errorMessage);
      dispatch(updatePasswordFailure(errorMessage));
    }
  };

export const forgotPassword =
  (
    email: string,
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
  ) =>
  async (dispatch: any) => {
    dispatch(forgotPasswordStart());
    try {
      const response = await customAxios.post(
        `${baseUrl}/api/v1/forgot/password`,
        { email }
      );

      dispatch(forgotPasswordSuccess(response.data.message));
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message);
      dispatch(
        forgotPasswordFailure(
          error?.response?.data?.message || "Failed to request password reset"
        )
      );
    }
  };

export const resetPassword =
  (token: string, passwords: any, navigate: any) => async (dispatch: any) => {
    dispatch(resetPasswordStart());
    try {
      const response = await customAxios.put(
        `${baseUrl}/api/v1/reset/password/${token}`,
        passwords,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Password Updated Successfully");
        navigate("/login");
      }
      dispatch(resetPasswordSuccess(response.data.success));
    } catch (error: any) {
      dispatch(
        resetPasswordFailure(
          error?.response?.data?.message || "Failed to reset password"
        )
      );
    }
  };

export const { reducer } = userSlice;
export default userSlice;
