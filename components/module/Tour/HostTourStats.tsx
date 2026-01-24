"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  Eye,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  Sparkles
} from "lucide-react";
import type { HostTourStats as HostTourStatsType } from "@/types/tour.interface";
import { cn } from "@/lib/utils";

interface HostTourStatsProps {
  stats: HostTourStatsType;
}

export default function HostTourStats({ stats }: HostTourStatsProps) {
  const {
    totalTours,
    activeTours,
    featuredTours,
    totalViews,
    upcomingTours,
    pastTours,
    totalBookings,
    confirmedBookings,
    toursByCategory,
    tourLimit,
    currentTourCount,
    tourCreationAvailable,
  } = stats;

  const tourUsagePercentage = Math.round((currentTourCount / tourLimit) * 100);

  const statsCards = [
    {
      title: "Total Tours",
      value: totalTours.toString(),
      icon: BarChart3,
      description: `${activeTours} active tours`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      description: "Across all listings",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Confirmed Bookings",
      value: confirmedBookings.toString(),
      icon: Users,
      description: `Out of ${totalBookings} total`,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Upcoming Tours",
      value: upcomingTours.toString(),
      icon: Calendar,
      description: `${pastTours} already completed`,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm bg-white overflow-hidden group">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-black text-gray-900 mt-2">{stat.value}</h3>
                  <p className="text-[10px] font-semibold text-gray-500 mt-1 uppercase tracking-tighter">
                    {stat.description}
                  </p>
                </div>
                <div className={cn("p-3.5 rounded-2xl transition-transform duration-300 group-hover:scale-110", stat.bgColor, stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tour Limit Progress */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Listing Capacity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-500">Usage Status</span>
                <span className="text-gray-900">
                  {currentTourCount} / {tourLimit}
                </span>
              </div>
              <div className="relative pt-1">
                <Progress value={tourUsagePercentage} className="h-3 bg-gray-100" />
              </div>
              <div className={cn(
                "p-3 rounded-xl text-xs font-bold text-center border transition-colors",
                tourCreationAvailable
                  ? "bg-blue-50 text-blue-700 border-blue-100"
                  : "bg-red-50 text-red-700 border-red-100"
              )}>
                {tourCreationAvailable
                  ? `You can list ${tourLimit - currentTourCount} more tour${tourLimit - currentTourCount === 1 ? "" : "s"}`
                  : "Listing limit reached. Please upgrade your plan."}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Distribution */}
        <Card className="border-none shadow-sm bg-white lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-gray-800">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(toursByCategory).length > 0 ? (
                Object.entries(toursByCategory).map(([category, count]) => (
                  <Badge
                    key={category}
                    variant="outline"
                    className="px-4 py-2 rounded-2xl bg-gray-50 border-gray-100 flex items-center gap-2 group hover:bg-white hover:border-[#138bc9]/20 transition-all duration-300"
                  >
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#138bc9]">{category}</span>
                    <Badge className="bg-[#138bc9] text-white rounded-lg px-2 h-5 text-[10px] font-black border-none">
                      {count}
                    </Badge>
                  </Badge>
                ))
              ) : (
                <p className="text-sm font-medium text-gray-400 italic">No categorized tours yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Active Listing Rate",
            value: totalTours > 0 ? Math.round((activeTours / totalTours) * 100) : 0,
            unit: "%",
            icon: CheckCircle,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            description: "Percentage of tours live"
          },
          {
            title: "Engagement Score",
            value: totalTours > 0 ? Math.round(totalViews / totalTours) : 0,
            unit: "",
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
            description: "Average views per tour"
          },
          {
            title: "Upcoming Ratio",
            value: totalTours > 0 ? Math.round((upcomingTours / totalTours) * 100) : 0,
            unit: "%",
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
            description: "Future tours scheduled"
          }
        ].map((indicator, i) => (
          <Card key={i} className="border-none shadow-sm bg-white group overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110", indicator.bgColor)}>
                  <indicator.icon className={cn("h-5 w-5", indicator.color)} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                    {indicator.title}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-2xl font-black text-gray-900 leading-tight">
                      {indicator.value}
                    </h3>
                    <span className="text-sm font-bold text-gray-400">{indicator.unit}</span>
                  </div>
                  <p className="text-[9px] font-semibold text-gray-400 mt-0.5">
                    {indicator.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}