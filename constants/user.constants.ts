export const USER_ROLES = {
  ADMIN: 'ADMIN',
  HOST: 'HOST',
  TOURIST: 'TOURIST',
  USER: 'USER',
} as const;

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  INACTIVE: 'INACTIVE',
} as const;

export const userSearchableFields = ["email", "role", "status"];
export const userFilterableFields = ["status", "role", "email", "searchTerm"];

export const DEFAULT_USER_LIMITS = {
  HOST_TOUR_LIMIT: 3,
  HOST_CURRENT_TOUR_COUNT: 0,
  HOST_IS_VERIFIED: false,
} as const;