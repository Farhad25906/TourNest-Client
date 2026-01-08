export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface IJWTPayload {
  email: string;
  role: string;
  name?: string;
  iat?: number;
  exp?: number;
}

export interface FileUploadResponse {
  secure_url: string;
  public_id: string;
  [key: string]: string | number | boolean | object;
}