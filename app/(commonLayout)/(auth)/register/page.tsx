"use client";

import RegisterForm from "@/components/module/Auth/register-form";
import { Compass } from "lucide-react";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-[#138bc9]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-50 rounded-full blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#138bc9] rounded-2xl flex items-center justify-center shadow-lg shadow-[#138bc9]/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <Compass className="w-10 h-10 text-white" />
          </div>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join TourNest and start your adventure today
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;