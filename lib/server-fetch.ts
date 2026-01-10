

import { getCookie } from "@/services/auth/tokenHandlers";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "https://tournest-server.onrender.com/api/v1";

// Define custom type
interface ServerFetchOptions extends RequestInit {
  useRefreshToken?: boolean;
}

const serverFetchHelper = async (
  endpoint: string,
  options: ServerFetchOptions = {}
): Promise<Response> => {
  const { headers, useRefreshToken, ...restOptions } = options;
  
  // Get the appropriate token based on the flag
  const tokenName = useRefreshToken ? "refreshToken" : "accessToken";
  const token = await getCookie(tokenName);

  const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
    headers: {
      ...headers,
      ...(token ? { Cookie: `${tokenName}=${token}` } : {}),
    },
    credentials: 'include', // Important for cookie handling
    ...restOptions,
  });

  return response;
};

export const serverFetch = {
  get: async (endpoint: string, options: ServerFetchOptions = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "GET" }),

  post: async (
    endpoint: string,
    options: ServerFetchOptions = {}
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "POST" }),

  put: async (endpoint: string, options: ServerFetchOptions = {}): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "PUT" }),

  patch: async (
    endpoint: string,
    options: ServerFetchOptions = {}
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

  delete: async (
    endpoint: string,
    options: ServerFetchOptions = {}
  ): Promise<Response> =>
    serverFetchHelper(endpoint, { ...options, method: "DELETE" }),
};