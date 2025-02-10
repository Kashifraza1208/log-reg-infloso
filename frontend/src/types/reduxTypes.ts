import store from "../store";

import { User } from "./userTypes";

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  loading: boolean;
  refreshingToken: boolean;
  isUpdated: boolean;
  success: boolean;
  activeUsers: User | null;
  error: {
    message: string | null;
  };
  message: string | null;
  accessToken: string;
}

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
