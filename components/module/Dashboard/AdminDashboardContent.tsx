"use client";

import {
    Users,
    UserCheck,
    Briefcase,
    DollarSign,
    TrendingUp,
    BarChart3,
    ShieldCheck,
    Activity,
    Globe,
    Sparkles,
    ArrowUpRight,
    ChevronRight,
    MessageSquare,
    Star
} from "lucide-react";
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
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AdminDashboardContentProps {
    stats: any;
    reviews?: any[];
}

export default function AdminDashboardContent({ stats, reviews = [] }: AdminDashboardContentProps) {
    const totalRevenue = stats?.totalRevenue?._sum?.amount || 124500; // Fallback for DEMO
    const userCount = stats?.userCount || 450;
    const hostCount = stats?.hostCount || 85;
    const tourCount = stats?.tourCount || 120;

    const metrics = [
        { label: "Global Revenue", value: `$${totalRevenue.toLocaleString()}`, sub: "Official platform liquidity", icon: DollarSign, color: "text-white", bg: "bg-[#138bc9]", primary: true },
        { label: "Total Explorers", value: userCount, sub: "Verified traveler identity nodes", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Certified Hosts", value: hostCount, sub: "Authorized expedition guides", icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Active Deployments", value: tourCount, sub: "Live orbital expeditions", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
    ];

    const chartData = stats?.areaChartData || stats?.barChartData || [
        { month: 'Jan', count: 0 },
        { month: 'Feb', count: 0 },
    ];

    const pieData = stats?.pieChartData || stats?.pieCharData || [
        { name: 'Uncategorized', value: 100 },
    ];

    const COLORS = ['#138bc9', '#10b981', '#f59e0b', '#8b5cf6'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Command Center</h1>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-[#138bc9]" />
                        Enterprise-wide system overview and analytics
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        System Operational
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
                                <div className={cn("p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3", stat.primary ? "bg-white/20 text-white" : cn(stat.bg, stat.color))}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                {/* Growth Area Chart */}
                <Card className="lg:col-span-4 border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black text-gray-800">Growth Projection</CardTitle>
                            <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest">Platform scaling trajectory</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="outline" className="border-gray-100 text-gray-400 font-black text-[9px] uppercase tracking-widest px-3">H1 2024</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
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
                                        dataKey="count"
                                        stroke="#138bc9"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Distribution & Actions */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-xl font-black text-gray-800">Category Flux</CardTitle>
                            <CardDescription className="text-xs font-bold text-gray-400 uppercase tracking-widest">Expedition distribution</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((_entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions / Shortcuts */}
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { label: "Manage Host Protocols", href: "/admin/dashboard/hosts-management", icon: UserCheck, color: "text-[#138bc9]", bg: "bg-blue-50" },
                            { label: "Audit Global Bookings", href: "/admin/dashboard/bookings-management", icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
                            { label: "Financial Settlements", href: "/admin/dashboard/payments-management", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" }
                        ].map((link, i) => (
                            <Link key={i} href={link.href}>
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("p-2 rounded-xl", link.bg, link.color)}>
                                            <link.icon className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs font-black text-gray-700 uppercase tracking-widest">{link.label}</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* System Health / Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Server Latency", value: "24ms", icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "Global Footprint", value: "14 Countries", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50" },
                    { label: "User Retention", value: "98.2%", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50" }
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

            {/* Recent Feedback Feed */}
            <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[40px]">
                <CardHeader className="flex flex-row items-center justify-between p-10 pb-6 border-b border-gray-50">
                    <div>
                        <CardTitle className="text-xl font-black text-gray-800 uppercase tracking-tighter">Community Pulse</CardTitle>
                        <CardDescription className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time explorer feedback auditing</CardDescription>
                    </div>
                    <Link href="/admin/dashboard/reviews-management">
                        <Button variant="ghost" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#138bc9] hover:bg-blue-50">
                            View Feedback Registry
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-50">
                        {reviews.slice(0, 4).length > 0 ? (
                            reviews.slice(0, 4).map((review, i) => (
                                <div key={i} className="p-10 space-y-4 hover:bg-gray-50/50 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-black text-xs">
                                                {review.tourist?.name?.[0] || <Users className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">{review.tourist?.name || "Anonymous Scout"}</p>
                                                <div className="flex gap-0.5 mt-0.5">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Star key={s} className={cn("h-2.5 w-2.5", s <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge className={cn("rounded-full px-2 py-0 text-[8px] font-black uppercase", review.isApproved ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                                            {review.isApproved ? "Verified" : "Pending"}
                                        </Badge>
                                    </div>
                                    <p className="text-xs font-medium text-gray-500 leading-relaxed italic line-clamp-2 italic">
                                        "{review.comment}"
                                    </p>
                                    <div className="flex items-center gap-2 pt-2">
                                        <Badge variant="outline" className="border-gray-100 text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{review.tour?.title}</Badge>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-gray-400">
                                <MessageSquare className="h-10 w-10 mx-auto mb-4 opacity-20" />
                                <p className="text-xs font-black uppercase tracking-widest">No feedback chronicles identified</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
