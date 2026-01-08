// lib/zodValidator.ts
import { z } from "zod"

// Updated to accept ZodTypeAny instead of ZodObject
export const zodValidator = <T>(payload: T, schema: z.ZodTypeAny) => {
    const validatedPayload = schema.safeParse(payload)

    if (!validatedPayload.success) {
        // Transform errors into the expected format
        const errors: Record<string, string[]> = {};
        validatedPayload.error.issues.forEach(issue => {
            const field = issue.path[0] as string;
            if (!errors[field]) {
                errors[field] = [];
            }
            errors[field].push(issue.message);
        });

        return {
            success: false,
            errors: errors
        }
    }

    return {
        success: true,
        data: validatedPayload.data,
    };
}