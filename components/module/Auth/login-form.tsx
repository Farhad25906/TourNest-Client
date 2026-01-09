"use client";

import { loginUser } from "@/services/auth/auth.services";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";

const LoginForm = ({ redirect }: { redirect?: string }) => {
  const [state, formAction, isPending] = useActionState(loginUser, null);

  useEffect(() => {
    if (state) {
      if (state.success) {
        toast.success(state.message || "Login successful!");
      } else if (state.message) {
        toast.error(state.message);
      }
    }
  }, [state]);

  // Get server-side validation errors if they exist
  const serverErrors = state?.errors || {};

  return (
    <form action={formAction} noValidate>
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
              aria-invalid={!!serverErrors.email}
              aria-describedby={serverErrors.email ? "email-error" : undefined}
              required
            />
            {serverErrors.email && (
              <p id="email-error" className="text-sm text-red-600 mt-1">
                {serverErrors.email}
              </p>
            )}
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Password *</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              aria-invalid={!!serverErrors.password}
              aria-describedby={serverErrors.password ? "password-error" : undefined}
              required
            />
            {serverErrors.password && (
              <p id="password-error" className="text-sm text-red-600 mt-1">
                {serverErrors.password}
              </p>
            )}
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