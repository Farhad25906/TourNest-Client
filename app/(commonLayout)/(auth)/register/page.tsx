"use client";

import RegisterForm from "@/components/module/Auth/register-form";
import { Compass, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-white flex overflow-hidden flex-row-reverse">
      {/* Right Side: Dynamic Image Section - Hidden on Mobile */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden group">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000"
          alt="Tropical Adventure"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#138bc9]/90 via-[#138bc9]/20 to-transparent" />

        <div className="absolute bottom-20 left-20 right-20 text-white z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="px-5 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">
              Start Your Journey
            </span>
            <h1 className="text-6xl font-black mb-6 tracking-tighter leading-none text-white">
              Create Your <br />
              <span className="text-blue-200">Travel Legacy</span>
            </h1>
            <p className="text-xl text-blue-50 font-medium max-w-md">
              Join thousands of travelers exploring the world with TourNest. Your next story begins here.
            </p>
          </motion.div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-10 right-10 z-20">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white font-bold hover:bg-white/20 transition-all border border-white/20">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Left Side: Register Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 bg-gray-50/50 relative">
        {/* Decorative background for mobile */}
        <div className="lg:hidden absolute top-0 left-0 w-64 h-64 bg-[#138bc9]/5 rounded-full blur-3xl -ml-32 -mt-32" />
        <div className="lg:hidden absolute bottom-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mb-32" />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-2xl space-y-8 relative z-10"
        >
          <div className="text-center lg:text-left">
            <Link href="/" className="inline-flex items-center justify-center lg:justify-start gap-3 mb-8 group">
              <div className="w-14 h-14 bg-[#138bc9] rounded-2xl flex items-center justify-center shadow-xl shadow-[#138bc9]/20 transform group-hover:-rotate-12 transition-all duration-300">
                <Compass className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-black text-gray-900 tracking-tighter">Tour<span className="text-[#138bc9]">Nest</span></span>
            </Link>

            <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight mb-3">
              Join the Expedition
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              Sign up today and get exclusive access to hand-picked destinations and local experts.
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white">
            <RegisterForm />
          </div>

          <p className="text-center text-gray-400 font-medium text-sm">
            By creating an account, you agree to our terms of service and adventure guidelines.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;