"use client";

import { loginUser } from "@/services/auth/auth.services";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../../ui/field";
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

  // Function to auto-fill credentials
  const autoFillCredentials = (email: string, password: string) => {
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById(
      "password",
    ) as HTMLInputElement;

    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = password;

    // Dispatch input events to trigger React state updates if needed
    emailInput.dispatchEvent(new Event("input", { bubbles: true }));
    passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
  };

  return (
    <form action={formAction} noValidate>
      {redirect && <input type="hidden" name="redirect" value={redirect} />}
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4">
          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email" className="text-sm font-semibold text-gray-700">Email *</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="yourname@example.com"
              className="h-12 rounded-xl border-gray-200 focus:border-[#138bc9] focus:ring-2 focus:ring-[#138bc9]/20 transition-all"
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
            <FieldLabel htmlFor="password" className="text-sm font-semibold text-gray-700">Password *</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="h-12 rounded-xl border-gray-200 focus:border-[#138bc9] focus:ring-2 focus:ring-[#138bc9]/20 transition-all"
              aria-invalid={!!serverErrors.password}
              aria-describedby={
                serverErrors.password ? "password-error" : undefined
              }
              required
            />
            {serverErrors.password && (
              <p id="password-error" className="text-sm text-red-600 mt-1">
                {serverErrors.password}
              </p>
            )}
          </Field>

          {/* Auto-fill buttons */}
          <div className="mt-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
            <h3 className="text-xs font-bold text-[#138bc9] uppercase tracking-wider mb-3">
              Quick Autofill
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => autoFillCredentials("farhad@tournest.com", "123456")}
                className="flex-1 bg-white border-blue-200 text-blue-700 hover:bg-[#138bc9] hover:text-white hover:border-[#138bc9] rounded-xl transition-all h-10 font-semibold"
              >
                Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  autoFillCredentials("farhadhossen2590@gmail.com", "123456")
                }
                className="flex-1 bg-white border-blue-200 text-blue-700 hover:bg-[#138bc9] hover:text-white hover:border-[#138bc9] rounded-xl transition-all h-10 font-semibold"
              >
                Host
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  autoFillCredentials("farhadhossen9036@gmail.com", "123456")
                }
                className="flex-1 bg-white border-blue-200 text-blue-700 hover:bg-[#138bc9] hover:text-white hover:border-[#138bc9] rounded-xl transition-all h-10 font-semibold"
              >
                Tourist
              </Button>
            </div>
          </div>
        </div>

        <FieldGroup className="mt-4">
          <Field>
            <Button type="submit" disabled={isPending} className="w-full h-12 rounded-xl bg-[#138bc9] hover:bg-[#138bc9]/90 text-white font-bold shadow-lg shadow-[#138bc9]/20 transition-all">
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </div>
              ) : "Sign In"}
            </Button>

            <FieldDescription className="px-6 text-center mt-6">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-[#138bc9] font-bold hover:underline">
                Sign up
              </a>
            </FieldDescription>

            <FieldDescription className="px-6 text-center mt-2">
              <a
                href="/forget-password"
                className="text-[#138bc9] hover:underline"
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
