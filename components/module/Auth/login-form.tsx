"use client";

import { loginUser } from "@/services/auth/auth.services";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import InputFieldError from "../../shared/InputFieldError";
import { Button } from "../../ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";

interface ValidationErrors {
  email?: string;
  password?: string;
}

const LoginForm = ({ redirect }: { redirect?: string }) => {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (state) {
      if (state.success) {
        toast.success(state.message || "Login successful!");
      } else if (state.message) {
        toast.error(state.message);
      }
    }
  }, [state]);

  const validateForm = (formData: FormData): boolean => {
    const errors: ValidationErrors = {};
    
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Email validation
    if (!email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    } else if (email.length > 100) {
      errors.email = "Email must not exceed 100 characters";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);

    // Show first error in toast
    const firstError = Object.values(errors)[0];
    if (firstError) {
      toast.error(firstError);
      return false;
    }

    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    // Clear previous errors
    setValidationErrors({});
    
    // Validate form
    if (!validateForm(formData)) {
      return;
    }

    // If validation passes, submit the form
    formAction(formData);
  };

  // Get server-side validation errors if they exist
  const serverErrors = state?.errors || {};
  const displayErrors = Object.keys(validationErrors).length > 0 ? validationErrors : serverErrors;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {redirect && <input type="hidden" name="redirect" value={redirect} />}
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4">
          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email *</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              aria-invalid={!!displayErrors.email}
              aria-describedby={displayErrors.email ? "email-error" : undefined}
            />
            {displayErrors.email && (
              <p id="email-error" className="text-sm text-red-600 mt-1">
                {displayErrors.email}
              </p>
            )}
            <InputFieldError field="email" state={state} />
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Password *</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              aria-invalid={!!displayErrors.password}
              aria-describedby={displayErrors.password ? "password-error" : undefined}
            />
            {displayErrors.password && (
              <p id="password-error" className="text-sm text-red-600 mt-1">
                {displayErrors.password}
              </p>
            )}
            <InputFieldError field="password" state={state} />
          </Field>
        </div>

        <FieldGroup className="mt-4">
          <Field>
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>

            <FieldDescription className="px-6 text-center mt-4">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </FieldDescription>
            
            <FieldDescription className="px-6 text-center mt-2">
              <a
                href="/forget-password"
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;