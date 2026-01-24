"use client";

import { IBookingStats } from "@/types/booking.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Briefcase as ToursIcon,
    BookOpen as BookingIcon,
    DollarSign as RevenueIcon,
    TrendingUp as TrendingUpIcon,
    Calendar as CalendarIcon,
    MapPin,
    Heart,
    Award,
    Clock,
    MessageSquare,
    Star
} from "lucide-react";
import Link from "next/link";
import {
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis
} from "recharts";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface UserDashboardContentProps {
    bookingStats: IBookingStats;
    reviews?: any[];
}

export default function UserDashboardContent({ bookingStats, reviews = [] }: UserDashboardContentProps) {
    const totalSpent = bookingStats.totalSpent || 0;
    const totalBookings = bookingStats.totalBookings || 0;
    const upcomingTrips = bookingStats.upcomingTrips || 0;
    const pastTrips = bookingStats.pastTrips || 0;

    const statCards = [
        {
            title: "Total Investment",
            value: `$${totalSpent.toLocaleString()}`,
            description: "Total spent on expeditions",
            icon: <RevenueIcon className="h-5 w-5" />,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            title: "Expeditions",
            value: totalBookings,
            description: `${bookingStats.confirmedBookings || 0} confirmed bookings`,
            icon: <ToursIcon className="h-5 w-5" />,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Upcoming",
            value: upcomingTrips,
            description: "Next adventures scheduled",
            icon: <CalendarIcon className="h-5 w-5" />,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            title: "Journeys Done",
            value: pastTrips,
            description: "Completed travel milestones",
            icon: <Award className="h-5 w-5" />,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
    ];

    // Placeholder for chart data if not provided
    const chartData = (bookingStats as any).spendingByMonth || [
        { month: 'Jan', amount: totalSpent * 0.1 },
        { month: 'Feb', amount: totalSpent * 0.2 },
        { month: 'Mar', amount: totalSpent * 0.15 },
        { month: 'Apr', amount: totalSpent * 0.25 },
        { month: 'May', amount: totalSpent * 0.3 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase italic">Traveler Dashboard</h1>
                <p className="text-sm font-medium text-gray-400 tracking-widest uppercase">Capture your journey. Plan your next great expedition.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card, i) => (
                    <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                {card.title}
                            </CardTitle>
                            <div className={cn("p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110", card.bgColor, card.color)}>
                                {card.icon}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-gray-900 mb-1">{card.value}</div>
                            <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tighter">
                                {card.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
                {/* Spending Chart */}
                <Card className="lg:col-span-4 border-none shadow-sm bg-white overflow-hidden rounded-[40px]">
                    <CardHeader className="flex flex-row items-center justify-between p-8">
                        <div>
                            <CardTitle className="text-xl font-black text-gray-800 uppercase tracking-tighter">Adventure Analytics</CardTitle>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Spending trends over period</p>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-[#138bc9] border-none font-black px-4 py-1.5 text-[9px] uppercase tracking-widest rounded-full">
                            Growth Projection
                        </Badge>
                    </CardHeader>
                    <CardContent className="pt-0 p-8">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#138bc9" stopOpacity={0.1} />
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
                                        dataKey="amount"
                                        stroke="#138bc9"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorAmount)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Adventures */}
                <Card className="lg:col-span-3 border-none shadow-sm bg-white overflow-hidden rounded-[40px]">
                    <CardHeader className="p-8">
                        <CardTitle className="text-xl font-black text-gray-800 uppercase tracking-tighter">Recent Passports</CardTitle>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global expedition registry</p>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="space-y-6">
                            {bookingStats.recentBookings?.length ? (
                                bookingStats.recentBookings.map((booking: any) => (
                                    <div key={booking.id} className="flex items-center gap-4 group cursor-pointer p-0 rounded-2xl hover:bg-gray-50/50 transition-colors duration-300">
                                        <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 font-black text-lg shrink-0 group-hover:scale-110 group-hover:bg-[#138bc9]/10 group-hover:text-[#138bc9] transition-all">
                                            {booking.tourTitle?.[0] || 'T'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-black text-gray-900 truncate uppercase tracking-tighter">{booking.tourTitle}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-widest">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    {format(new Date(booking.bookingDate), "MMM dd, yyyy")}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge className={cn(
                                            "rounded-full text-[8px] px-2 py-0.5 font-black uppercase tracking-widest border-none shadow-none",
                                            booking.status === 'CONFIRMED' ? "bg-emerald-50 text-emerald-600" :
                                                booking.status === 'PENDING' ? "bg-amber-50 text-amber-600" :
                                                    "bg-gray-100 text-gray-500"
                                        )}>
                                            {booking.status}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4 text-center">
                                    <div className="h-14 w-14 rounded-[25px] bg-gray-50 flex items-center justify-center text-gray-200">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div className="max-w-[200px]">
                                        <p className="text-[10px] font-black uppercase tracking-widest">No Active Passports</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Suggested Landmarks / Milestones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Milestones Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { title: "Loyalty Tier", value: "Silver Explorer", icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
                        { title: "Time Traveling", value: "142 Hours", icon: Clock, color: "text-[#138bc9]", bg: "bg-blue-50" }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 flex items-center gap-5 hover:shadow-xl hover:shadow-gray-100/30 transition-all duration-500">
                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0", item.bg, item.color)}>
                                <item.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.title}</p>
                                <p className="text-xl font-black text-gray-900 italic tracking-tighter uppercase">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Feedback Snapshot */}
                <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[40px]">
                    <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                        <div>
                            <CardTitle className="text-lg font-black text-gray-800 uppercase tracking-tighter">Your Memoirs</CardTitle>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Stories Shared</p>
                        </div>
                        <Link href="/user/dashboard/my-reviews">
                            <Button variant="ghost" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#138bc9] hover:bg-blue-50">
                                View Registry
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-4">
                        {reviews.length > 0 ? (
                            reviews.slice(0, 2).map((review, i) => (
                                <div key={i} className="p-5 rounded-[25px] bg-gray-50/50 border border-gray-50 flex flex-col gap-3 group hover:bg-white hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} className={cn("h-3 w-3", s <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                                            ))}
                                        </div>
                                        <Badge className={cn("rounded-full px-2 py-0 text-[8px] font-black uppercase tracking-tighter", review.isApproved ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                                            {review.isApproved ? "Public" : "Awaiting Audit"}
                                        </Badge>
                                    </div>
                                    <p className="text-xs font-medium text-gray-500 line-clamp-1 italic group-hover:text-gray-800 transition-colors">"{review.comment}"</p>
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center text-gray-300">
                                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                <p className="text-[9px] font-black uppercase tracking-widest">No Memoirs Logged</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
