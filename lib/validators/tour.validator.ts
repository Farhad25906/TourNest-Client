// lib/validators/tour.validator.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  createTourFrontendValidationSchema, 
  updateTourFrontendValidationSchema 
} from "@/zod/tour.validation";
import { ApiResponse } from "@/types/tour.interface";

export const validateCreateTourData = (data: any): { 
  success: boolean; 
  data?: any; 
  errors?: Record<string, string[]> 
} => {
  const result = createTourFrontendValidationSchema.safeParse(data);
  
  if (!result.success) {
    const errors: Record<string, string[]> = {};
    result.error.issues.forEach(issue => {
      const field = issue.path[0] as string;
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(issue.message);
    });

    return {
      success: false,
      errors
    };
  }

  return {
    success: true,
    data: result.data,
  };
};

export const validateUpdateTourData = (data: any): { 
  success: boolean; 
  data?: any; 
  errors?: Record<string, string[]> 
} => {
  const result = updateTourFrontendValidationSchema.safeParse(data);
  
  if (!result.success) {
    const errors: Record<string, string[]> = {};
    result.error.issues.forEach(issue => {
      const field = issue.path[0] as string;
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(issue.message);
    });

    return {
      success: false,
      errors
    };
  }

  return {
    success: true,
    data: result.data,
  };
};