"use client";

import { registerPatient } from "@/services/auth/auth.services";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerPatient, null);
  const router = useRouter();

  useEffect(() => {
    if (state) {
      if (state.success) {
        toast.success(state.message || "Account created successfully!");
        // Redirect to home page after successful registration
        router.push("/");
      } else if (state.message) {
        toast.error(state.message);
      }
    }
  }, [state, router]);

  // Get server-side validation errors
  const serverErrors = state?.errors || {};

  return (
    <form action={formAction} noValidate>
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <Field>
            <FieldLabel htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name *</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              className="h-12 rounded-xl border-gray-200 focus:border-[#138bc9] focus:ring-2 focus:ring-[#138bc9]/20 transition-all"
              aria-invalid={!!serverErrors.name}
              aria-describedby={serverErrors.name ? "name-error" : undefined}
              required
            />
            {serverErrors.name && (
              <p id="name-error" className="text-sm text-red-600 mt-1">
                {serverErrors.name}
              </p>
            )}
          </Field>

          {/* Address */}
          <Field>
            <FieldLabel htmlFor="address" className="text-sm font-semibold text-gray-700">Address *</FieldLabel>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="123 Main St, City, Country"
              className="h-12 rounded-xl border-gray-200 focus:border-[#138bc9] focus:ring-2 focus:ring-[#138bc9]/20 transition-all"
              aria-invalid={!!serverErrors.address}
              aria-describedby={serverErrors.address ? "address-error" : undefined}
              required
            />
            {serverErrors.address && (
              <p id="address-error" className="text-sm text-red-600 mt-1">
                {serverErrors.address}
              </p>
            )}
          </Field>

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
              aria-describedby={serverErrors.password ? "password-error" : undefined}
              required
            />
            {serverErrors.password && (
              <p id="password-error" className="text-sm text-red-600 mt-1">
                {serverErrors.password}
              </p>
            )}
          </Field>

          {/* Confirm Password */}
          <Field className="md:col-span-2">
            <FieldLabel htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm Password *</FieldLabel>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="h-12 rounded-xl border-gray-200 focus:border-[#138bc9] focus:ring-2 focus:ring-[#138bc9]/20 transition-all"
              aria-invalid={!!serverErrors.confirmPassword}
              aria-describedby={serverErrors.confirmPassword ? "confirmPassword-error" : undefined}
              required
            />
            {serverErrors.confirmPassword && (
              <p id="confirmPassword-error" className="text-sm text-red-600 mt-1">
                {serverErrors.confirmPassword}
              </p>
            )}
          </Field>
        </div>

        <FieldGroup className="mt-6">
          <Field>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 rounded-xl bg-[#138bc9] hover:bg-[#138bc9]/90 text-white font-bold shadow-lg shadow-[#138bc9]/20 transition-all"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : "Create Account"}
            </Button>

            <FieldDescription className="px-6 text-center mt-6">
              Already have an account?{" "}
              <a href="/login" className="text-[#138bc9] font-bold hover:underline">
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