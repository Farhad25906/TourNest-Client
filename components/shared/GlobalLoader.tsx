"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logo from "../../assets/logo/logo.png";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GlobalLoader() {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timeout);
    }, [pathname, searchParams]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md"
                >
                    {/* Responsive container — scales with viewport */}
                    <div
                        className="relative flex items-center justify-center"
                        style={{
                            width: "clamp(100px, 20vw, 140px)",
                            height: "clamp(100px, 20vw, 140px)",
                        }}
                    >
                        {/* Outermost slow pulse ring */}
                        <motion.div
                            animate={{ scale: [1, 1.35, 1], opacity: [0.15, 0, 0.15] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 rounded-full border border-[#138bc9]/30"
                        />

                        {/* Middle pulse ring */}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0, 0.25] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                            className="absolute inset-[12%] rounded-full border border-[#138bc9]/40"
                        />

                        {/* Spinning dashed ring */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[6%] rounded-full"
                            style={{ border: "2px dashed rgba(19, 139, 201, 0.25)" }}
                        />

                        {/* Main spinning gradient arc */}
                        <motion.svg
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 104 104"
                            fill="none"
                        >
                            <circle
                                cx="52"
                                cy="52"
                                r="46"
                                stroke="url(#arcGrad)"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeDasharray="72 218"
                            />
                            <defs>
                                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#138bc9" stopOpacity="0" />
                                    <stop offset="100%" stopColor="#138bc9" stopOpacity="1" />
                                </linearGradient>
                            </defs>
                        </motion.svg>

                        {/* Counter-spinning thin arc */}
                        <motion.svg
                            animate={{ rotate: -360 }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[80%] h-[80%]"
                            viewBox="0 0 84 84"
                            fill="none"
                        >
                            <circle
                                cx="42"
                                cy="42"
                                r="36"
                                stroke="url(#arcGrad2)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeDasharray="40 186"
                            />
                            <defs>
                                <linearGradient id="arcGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
                                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.7" />
                                </linearGradient>
                            </defs>
                        </motion.svg>

                        {/* Orbiting dot — rides the outer arc */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#138bc9] shadow-[0_0_8px_2px_rgba(19,139,201,0.6)]" />
                        </motion.div>

                        {/* Logo — uses `fill` so Next.js handles all sizing */}
                        <motion.div
                            animate={{ scale: [1, 1.06, 1] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10 rounded-full overflow-hidden"
                            style={{
                                width: "clamp(36px, 7vw, 52px)",
                                height: "clamp(36px, 7vw, 52px)",
                                boxShadow:
                                    "0 0 0 2px rgba(19,139,201,0.15), 0 4px 20px rgba(19,139,201,0.2)",
                            }}
                        >
                            <Image
                                src={logo}
                                alt="Loading"
                                fill
                                sizes="(max-width: 640px) 36px, 52px"
                                className="rounded-full object-contain"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}