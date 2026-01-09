"use client";

import { registerPatient } from "@/services/auth/auth.services";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import InputFieldError from "../../shared/InputFieldError";
import { Button } from "../../ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
}

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerPatient, null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const router = useRouter();

  useEffect(() => {
    if (state) {
      if (state.success) {
        toast.success(state.message || "Account created successfully!");
        
        // Redirect to login or dashboard after 1.5 seconds
        const redirectTimer = setTimeout(() => {
          router.push("/login");
        }, 1500);
        
        return () => clearTimeout(redirectTimer);
      } else if (state.message) {
        toast.error(state.message);
      }
    }
  }, [state, router]);

  const validateForm = (formData: FormData): boolean => {
    const errors: ValidationErrors = {};
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const address = formData.get("address") as string;

    // Name validation
    if (!name?.trim()) {
      errors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    } else if (name.trim().length > 100) {
      errors.name = "Name must not exceed 100 characters";
    }

    // Address validation
    if (!address?.trim()) {
      errors.address = "Address is required";
    } else if (address.trim().length < 5) {
      errors.address = "Please enter a complete address";
    } else if (address.trim().length > 200) {
      errors.address = "Address must not exceed 200 characters";
    }
    
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
    } else if (password.length > 128) {
      errors.password = "Password must not exceed 128 characters";
    } else if (!/(?=.*[a-z])/.test(password)) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(password)) {
      errors.password = "Password must contain at least one number";
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <Field>
            <FieldLabel htmlFor="name">Full Name *</FieldLabel>
            <Input 
              id="name" 
              name="name" 
              type="text" 
              placeholder="John Doe"
              aria-invalid={!!displayErrors.name}
              aria-describedby={displayErrors.name ? "name-error" : undefined}
            />
            {displayErrors.name && (
              <p id="name-error" className="text-sm text-red-600 mt-1">
                {displayErrors.name}
              </p>
            )}
            <InputFieldError field="name" state={state} />
          </Field>
          
          {/* Address */}
          <Field>
            <FieldLabel htmlFor="address">Address *</FieldLabel>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="123 Main St, City, Country"
              aria-invalid={!!displayErrors.address}
              aria-describedby={displayErrors.address ? "address-error" : undefined}
            />
            {displayErrors.address && (
              <p id="address-error" className="text-sm text-red-600 mt-1">
                {displayErrors.address}
              </p>
            )}
            <InputFieldError field="address" state={state} />
          </Field>
          
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
              placeholder="Min. 6 characters with uppercase, lowercase & number"
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
          
          {/* Confirm Password */}
          <Field className="md:col-span-2">
            <FieldLabel htmlFor="confirmPassword">Confirm Password *</FieldLabel>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              aria-invalid={!!displayErrors.confirmPassword}
              aria-describedby={displayErrors.confirmPassword ? "confirmPassword-error" : undefined}
            />
            {displayErrors.confirmPassword && (
              <p id="confirmPassword-error" className="text-sm text-red-600 mt-1">
                {displayErrors.confirmPassword}
              </p>
            )}
            <InputFieldError field="confirmPassword" state={state} />
          </Field>
        </div>
        
        <FieldGroup className="mt-4">
          <Field>
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>

            <FieldDescription className="px-6 text-center mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;