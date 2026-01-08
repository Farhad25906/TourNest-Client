// components/forms/create-host-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createHost } from "@/services/auth/auth.services";
import Link from "next/link";
import { toast } from "sonner";

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-3 px-4 rounded-lg font-medium ${
        pending
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      } text-white transition-colors duration-200`}
    >
      {pending ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
          Creating Host...
        </div>
      ) : (
        "Create Host"
      )}
    </button>
  );
}

export default function CreateHostForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createHost, null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");

  // Handle profile photo file change
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePhotoFile(file);
    
    // Create preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);
    } else {
      setProfilePreview("");
    }
  };

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  // Handle form success
  useEffect(() => {
    console.log(state);
    
    if (state?.success) {
      toast.success("Host created successfully!");
      // router.push("/dashboard/hosts");
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Host</h1>
          <p className="mt-2 text-gray-600">
            Fill in the details below to create a new host account.
          </p>
        </div>

        {/* Error Messages */}
        {state?.errors?.map((error, index) => (
          <div key={index} className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error.message}</p>
          </div>
        ))}

        {/* Form */}
        <form action={formAction} className="space-y-6 bg-white rounded-xl shadow-sm p-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="John Doe"
                  defaultValue={state?.formData?.host?.name}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="john@example.com"
                  defaultValue={state?.formData?.host?.email}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="At least 6 characters"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="+1 (555) 123-4567"
                  defaultValue={state?.formData?.host?.phone}
                />
              </div>
            </div>

            {/* Hometown */}
            <div>
              <label htmlFor="hometown" className="block text-sm font-medium text-gray-700 mb-1">
                Hometown
              </label>
              <input
                type="text"
                id="hometown"
                name="hometown"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="e.g., New York, USA"
                defaultValue={state?.formData?.host?.hometown}
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                placeholder="Tell us about yourself, your experience, and why you'd make a great host..."
                defaultValue={state?.formData?.host?.bio}
              />
            </div>
          </div>

          {/* Profile Photo */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
              Profile Photo
            </h2>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">No photo</span>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Profile Photo
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Optional. Upload a clear profile photo (JPG, PNG, max 5MB).
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t">
            <div className="flex justify-end space-x-4">
              <Link
                href="/dashboard/hosts"
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <SubmitButton pending={isPending} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}