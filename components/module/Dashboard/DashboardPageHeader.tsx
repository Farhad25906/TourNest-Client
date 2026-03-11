import React from "react";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DashboardPageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    badge?: string;
    className?: string;
    children?: React.ReactNode;
}

const DashboardPageHeader = ({
    title,
    subtitle,
    icon: Icon,
    badge,
    className,
    children,
}: DashboardPageHeaderProps) => {
    return (
        <div
            className={cn(
                "relative flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 overflow-hidden",
                className
            )}
        >
            {/* Animated background gradient */}
            <div className="absolute inset-0 -z-10 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-[#138ac8] via-transparent to-[#138ac8] animate-gradient-x" />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#138ac8] rounded-full opacity-20 animate-float-slow" />
                <div className="absolute top-3/4 left-1/2 w-1.5 h-1.5 bg-[#138ac8] rounded-full opacity-30 animate-float-medium" />
                <div className="absolute top-1/2 right-1/4 w-2.5 h-2.5 bg-[#138ac8] rounded-full opacity-15 animate-float-fast" />
            </div>

            <div className="space-y-2 relative">
                {/* Animated underline */}
                <div className="relative inline-block">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-none relative z-10">
                        {title.split("").map((char, index) => (
                            <span
                                key={index}
                                className="inline-block hover:text-[#138ac8] transition-colors duration-300 hover:scale-110 hover:-translate-y-1 transform"
                                style={{
                                    animation: `fadeInUp 0.5s ease-out ${index * 0.05}s backwards`,
                                }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </h1>
                    {/* Animated gradient underline */}
                    <div className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-[#138ac8] to-transparent w-0 animate-expand-width rounded-full" />
                </div>

                {subtitle && (
                    <div className="flex items-center gap-2 animate-fade-in-delay">
                        {Icon && (
                            <div className="relative">
                                <Icon className="h-4 w-4 text-[#138ac8] animate-spin-slow" />
                                <div className="absolute inset-0 h-4 w-4 text-[#138ac8] animate-ping opacity-20">
                                    <Icon className="h-4 w-4" />
                                </div>
                            </div>
                        )}
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.15em]">
                            {subtitle}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 animate-slide-in-right">
                {badge && (
                    <Badge
                        className={cn(
                            "relative border-2 border-[#138ac8] bg-white px-5 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-2.5 overflow-hidden group cursor-default hover:shadow-lg hover:shadow-[#138ac8]/20 transition-all duration-300"
                        )}
                    >
                        {/* Animated background on hover */}
                        <div className="absolute inset-0 bg-[#138ac8] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

                        {/* Pulsing dot */}
                        <div className="relative z-10 flex items-center gap-2.5">
                            <div className="relative">
                                <div className="h-2.5 w-2.5 rounded-full bg-[#138ac8] group-hover:bg-white transition-colors duration-300" />
                                <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-[#138ac8] animate-ping opacity-40" />
                            </div>
                            <span className="text-[#138ac8] group-hover:text-white transition-colors duration-300 relative z-10">
                                {badge}
                            </span>
                        </div>
                    </Badge>
                )}
                {children}
            </div>

        </div>
    );
};

export default DashboardPageHeader;