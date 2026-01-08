export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  needPasswordChange: boolean;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  password: string;
  id?: string;
  token?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: Record<string, unknown>;
  errors?: Array<{ field: string; message: string }>;
  formData?: Record<string, unknown>;
  redirectToLogin?: boolean;
}

export interface RefreshTokenResponse {
  accessToken: string;
  needPasswordChange: boolean;
}

export interface MeResponse {
  id: string;
  email: string;
  role: string;
  needPasswordChange: boolean;
  status: string;
}