import axios from "axios";
import { logout, refreshToken } from "../redux/userSlice";
import { AppDispatch } from "../types/reduxTypes";

const customAxios = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  withCredentials: true,
});

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: any) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });
  failedQueue = [];
};

export const setupInterceptors = (dispatch: AppDispatch) => {
  customAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if the error is due to an expired access token
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If a token refresh is already in progress, add the request to the queue
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return customAxios(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        // Mark the request as retried to avoid infinite loops
        originalRequest._retry = true;
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

        // Limit the number of retries to prevent infinite loops
        if (originalRequest._retryCount > 2) {
          dispatch(logout());
          return Promise.reject(error);
        }

        // Start the token refresh process
        isRefreshing = true;

        try {
          // Dispatch the refreshToken action to get a new access token
          const resultAction: any = await dispatch<any>(refreshToken());
          let newAccessToken = "";

          // Extract the new access token from the response
          if (resultAction?.payload?.accessToken) {
            newAccessToken = resultAction.payload.accessToken;
          }

          // Update the default Authorization header
          customAxios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;

          // Retry all queued requests with the new token
          processQueue(null, newAccessToken);
          isRefreshing = false;

          // Retry the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return customAxios(originalRequest);
        } catch (refreshError) {
          // If the token refresh fails, clear the queue and log the user out
          processQueue(refreshError, null);
          isRefreshing = false;
          dispatch(logout());
          return Promise.reject(refreshError);
        }
      }

      // If the error is not a 401, reject the request
      return Promise.reject(error);
    }
  );
};
export default customAxios;
