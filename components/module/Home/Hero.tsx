"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  MapPin,
  Shield,
  Compass,
  Award,
  Users,
  Clock,
  Headphones,
  Globe
} from "lucide-react";
import Link from "next/link";
import React from "react";

const FEATURE_VARIANTS = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const FEATURE_RIGHT_VARIANTS = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const dx = useSpring(mouseX, springConfig);
  const dy = useSpring(mouseY, springConfig);

  const parallaxX = useTransform(dx, [0, 500], [5, -5]);
  const parallaxY = useTransform(dy, [0, 500], [5, -5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX - window.innerWidth / 2);
    mouseY.set(clientY - window.innerHeight / 2);
  };

  return (
    <div
      className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Stunning travel destination"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC9-SpzGiQ5UkLlJ2yU5G_ne0mIX-QN2SR408Z3ArjN-13qp8U3291jcCIsBi65np4kJaORGjx3tLAcEJv-rzJeYhJSa0R4DfWZ6r3DmLFmpEmCU_F7o7Ci5MPCV5WQXX-AM-gNC5VuxBu18Xr3ew8Q-rSyw7LdfYrfsIxmaeM2tVd4XnLKb_CBwFBhuibeyb6hT1ie1XUZEFay_Gg_zNbTrgaRO350zu1qDu90Gon9bJT5UIyTwlCNOxxSygLEj0w5rPIfsEnnmiM"
        />
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-none"></div>
      </div>

      {/* Unique Design Element: Animated Glow Blur */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#128bc8]/10 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] items-center gap-8">

        {/* Left Side Features */}
        <motion.div
          style={{ x: parallaxX, y: parallaxY }}
          className="hidden lg:flex flex-col gap-12 items-end pr-8 relative"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.15 }}
        >
          {/* Side Arc Decorative (Left) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-2/3 bg-gradient-to-b from-transparent via-[#128bc8]/30 to-transparent"></div>

          <motion.div variants={FEATURE_VARIANTS} className="flex items-center gap-4 group cursor-pointer">
            <div className="text-right">
              <h4 className="text-white font-semibold text-lg leading-tight">500+ Destinations</h4>
              <p className="text-white/50 text-sm">Worldwide Coverage</p>
            </div>
            <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-[#128bc8]/20 group-hover:border-[#128bc8]/50 transition-all duration-300">
              <Globe className="w-6 h-6 text-white group-hover:text-[#128bc8]" />
            </div>
          </motion.div>

          <motion.div variants={FEATURE_VARIANTS} className="flex items-center gap-4 group cursor-pointer mr-6">
            <div className="text-right">
              <h4 className="text-white font-semibold text-lg leading-tight">Expert Hosts</h4>
              <p className="text-white/50 text-sm">Local & Friendly</p>
            </div>
            <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-[#128bc8]/20 group-hover:border-[#128bc8]/50 transition-all duration-300">
              <Compass className="w-6 h-6 text-white group-hover:text-[#128bc8]" />
            </div>
          </motion.div>

          <motion.div variants={FEATURE_VARIANTS} className="flex items-center gap-4 group cursor-pointer">
            <div className="text-right">
              <h4 className="text-white font-semibold text-lg leading-tight">24/7 Support</h4>
              <p className="text-white/50 text-sm">Always Available</p>
            </div>
            <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-[#128bc8]/20 group-hover:border-[#128bc8]/50 transition-all duration-300">
              <Headphones className="w-6 h-6 text-white group-hover:text-[#128bc8]" />
            </div>
          </motion.div>
        </motion.div>

        {/* Center Content */}
        <motion.div
          className="text-center flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span
            className="text-[#128bc8] font-black text-2xl md:text-4xl mb-2 tracking-wide uppercase drop-shadow-lg"
            animate={{
              textShadow: [
                "0 0 20px rgba(18, 139, 200, 0.4)",
                "0 0 40px rgba(18, 139, 200, 0.6)",
                "0 0 20px rgba(18, 139, 200, 0.4)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Explore the World
          </motion.span>
          <h1 className="text-7xl md:text-9xl font-black text-white leading-none tracking-tight mb-6 filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            Tour<span className="text-[#128bc8]">Nest</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl font-medium tracking-wide max-w-lg">
            Your Gateway to Unforgettable Adventures and Expert-Curated Journeys
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative mt-8 group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#128bc8] to-[#3B82F6] rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <button className="relative px-10 py-5 bg-[#128bc8] text-white rounded-full font-bold text-lg shadow-2xl flex items-center gap-3 transition-colors">
              <MapPin className="w-5 h-5" />
              <Link href="/tours">Start Your Journey</Link>
            </button>
          </motion.div>
        </motion.div>

        {/* Right Side Features */}
        <motion.div
          style={{ x: useTransform(parallaxX, (v) => -v), y: useTransform(parallaxY, (v) => -v) }}
          className="hidden lg:flex flex-col gap-12 items-start pl-8 relative"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.15, delayChildren: 0.5 }}
        >
          {/* Side Arc Decorative (Right) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-2/3 bg-gradient-to-b from-transparent via-[#128bc8]/30 to-transparent"></div>

          <motion.div variants={FEATURE_RIGHT_VARIANTS} className="flex items-center gap-4 group cursor-pointer">
            <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-[#128bc8]/20 group-hover:border-[#128bc8]/50 transition-all duration-300">
              <Shield className="w-6 h-6 text-white group-hover:text-[#128bc8]" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg leading-tight">100% Secure</h4>
              <p className="text-white/50 text-sm">Safe Payments</p>
            </div>
          </motion.div>

          <motion.div variants={FEATURE_RIGHT_VARIANTS} className="flex items-center gap-4 group cursor-pointer ml-6">
            <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-[#128bc8]/20 group-hover:border-[#128bc8]/50 transition-all duration-300">
              <Users className="w-6 h-6 text-white group-hover:text-[#128bc8]" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg leading-tight">100K+ Travelers</h4>
              <p className="text-white/50 text-sm">Happy Customers</p>
            </div>
          </motion.div>

          <motion.div variants={FEATURE_RIGHT_VARIANTS} className="flex items-center gap-4 group cursor-pointer">
            <div className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-[#128bc8]/20 group-hover:border-[#128bc8]/50 transition-all duration-300">
              <Award className="w-6 h-6 text-white group-hover:text-[#128bc8]" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg leading-tight">Award Winning</h4>
              <p className="text-white/50 text-sm">Top Rated Service</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile View Features (Stacked) */}
        <div className="lg:hidden grid grid-cols-2 gap-6 mt-12">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#128bc8]/20 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#128bc8]" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">500+ Destinations</p>
                <p className="text-white/50 text-xs">Worldwide</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#128bc8]/20 rounded-lg flex items-center justify-center">
                <Compass className="w-5 h-5 text-[#128bc8]" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Expert Guides</p>
                <p className="text-white/50 text-xs">Licensed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#128bc8]/20 rounded-lg flex items-center justify-center">
                <Headphones className="w-5 h-5 text-[#128bc8]" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">24/7 Support</p>
                <p className="text-white/50 text-xs">Always Here</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#128bc8]/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#128bc8]" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">100% Secure</p>
                <p className="text-white/50 text-xs">Safe Payments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#128bc8]/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#128bc8]" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">100K+ Travelers</p>
                <p className="text-white/50 text-xs">Happy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#128bc8]/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-[#128bc8]" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Award Winning</p>
                <p className="text-white/50 text-xs">Top Rated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;