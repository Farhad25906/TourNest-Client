"use client";

import {
    Briefcase,
    DollarSign,
    Users,
    Star,
    TrendingUp,
    Globe,
    Clock,
    ShieldCheck,
    Sparkles,
    ArrowUpRight,
    ChevronRight,
    MessageSquare,
    Calendar,
    Activity
} from "lucide-react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Legend
} from "recharts";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HostDashboardContentProps {
    tourStats: any;
    bookingStats: any;
    reviews?: any[];
}

export default function HostDashboardContent({ tourStats, bookingStats, reviews = [] }: HostDashboardContentProps) {
    const totalRevenue = bookingStats?.totalRevenue?._sum?.totalAmount || 0;
    const metrics = [
        { label: "Expedition Revenue", value: `$${totalRevenue.toLocaleString()}`, sub: "Lifetime guide earnings", icon: DollarSign, color: "text-white", bg: "bg-[#138bc9]", primary: true },
        { label: "Total Bookings", value: bookingStats?.totalBookings || 0, sub: "Confirmed travelers", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Active Tours", value: tourStats?.activeTours || 0, sub: "Currently deployed", icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Avg. Rating", value: "4.9", sub: "Guide excellence score", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    const chartData = [
        { month: 'Jan', revenue: 1200, bookings: 12 },
        { month: 'Feb', revenue: 1900, bookings: 18 },
        { month: 'Mar', revenue: 1500, bookings: 15 },
        { month: 'Apr', revenue: 2400, bookings: 22 },
        { month: 'May', revenue: 2100, bookings: 19 },
        { month: 'Jun', revenue: 2800, bookings: 26 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Guide Command</h1>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-[#138bc9]" />
                        Official expedition guide dashboard and telemetry
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge className="bg-[#138bc9]/10 text-[#138bc9] border-none px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[#138bc9] animate-pulse" />
                        Guide Console Active
                    </Badge>
                </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((stat, i) => (
                    <Card key={i} className={cn("border-none shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-md hover:-translate-y-1", stat.primary ? stat.bg : "bg-white")}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className={cn("text-[10px] font-black uppercase tracking-widest leading-none", stat.primary ? "text-white/60" : "text-gray-400")}>{stat.label}</p>
                                    <h3 className={cn("text-3xl font-black leading-tight", stat.primary ? "text-white" : "text-gray-900")}>{stat.value}</h3>
                                    <p className={cn("text-[9px] font-bold uppercase tracking-tighter", stat.primary ? "text-white/50" : "text-gray-400")}>{stat.sub}</p>
                                </div>
                                <div className={cn("p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-110", stat.primary ? "bg-white/20 text-white" : cn(stat.bg, stat.color))}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                {/* Revenue & Bookings Chart */}
                <Card className="lg:col-span-4 border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black text-gray-800">Performance Analytics</CardTitle>
                            <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest">Revenue vs Booking Velocity</CardDescription>
                        </div>
                        <Button variant="ghost" className="h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest text-[#138bc9]">Full Report</Button>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#138bc9" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#138bc9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '15px',
                                            border: 'none',
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                            padding: '12px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#138bc9"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorRev)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Interaction Summary */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="border-none shadow-sm bg-white overflow-hidden h-full">
                        <CardHeader>
                            <CardTitle className="text-xl font-black text-gray-800">Interaction Log</CardTitle>
                            <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest">Latest traveler activity</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {reviews.length > 0 ? (
                                reviews.slice(0, 4).map((review, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center font-black text-xs transition-transform group-hover:scale-110 bg-blue-50 text-[#138bc9]")}>
                                                {review.tourist?.name?.[0] || "?"}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 leading-none">{review.tourist?.name || "Scout Identity"}</p>
                                                <div className="flex gap-0.5 mt-1">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Star key={s} className={cn("h-2 w-2", s <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">
                                            {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center text-gray-300 space-y-2">
                                    <MessageSquare className="h-8 w-8 mx-auto opacity-20" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No Interaction Recorded</p>
                                </div>
                            )}
                            <Link href="/host/dashboard/reviews">
                                <Button variant="outline" className="w-full h-11 rounded-xl border-gray-100 font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-[#138bc9] hover:bg-blue-50 transition-all mt-4">Expand Operations</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* System Health / Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Network Presence", value: "Global", icon: Globe, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "Response Velocity", value: "< 15min", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "Guide Lifecycle", value: "Level 4", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-50" }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-[30px] border border-gray-100 flex items-center gap-5 hover:shadow-xl hover:shadow-gray-100/30 transition-all duration-500">
                        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                            <item.icon className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-xl font-black text-gray-900">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
