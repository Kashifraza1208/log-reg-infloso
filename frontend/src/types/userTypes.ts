export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  user_type: string;
  auth_type: string;
  status: string;
  created_at: string;
  last_login_at: string;
  country: string;
  reset_password_token: string | null;
  reset_password_token_expires: string | null;
  [key: string]: any;
}

export interface UpdateProfileResponse {
  success: boolean;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordPayload {
  token: string | undefined;
  passwords: {
    password: string;
    confirmPassword: string;
  };
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ForgotPasswordBody {
  email: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

export interface ResetPasswordResponse {
  success: boolean;
}
