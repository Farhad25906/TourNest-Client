"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams as useNextSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HostBookingsTable } from "@/components/module/Booking/HostBookingsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Filter, CalendarCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getHostBookings, getHostBookingStats } from "@/services/booking.service";
import { BookingStatus } from "@/types/booking.interface";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { cn } from "@/lib/utils";

interface HostBookingsClientProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function HostBookingsClient({ searchParams }: HostBookingsClientProps) {
  const router = useRouter();
  const nextSearchParams = useNextSearchParams();

  const [searchTerm, setSearchTerm] = useState<string>(searchParams.search as string || "");
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const filters = {
          searchTerm: searchParams.search as string,
          status: searchParams.status as BookingStatus,
          page: searchParams.page ? parseInt(searchParams.page as string) : 1,
          limit: searchParams.limit ? parseInt(searchParams.limit as string) : 50,
        };

        const [bookingsResponse, statsResponse] = await Promise.all([
          getHostBookings(filters),
          getHostBookingStats(),
        ]);

        setBookings(bookingsResponse?.data || []);
        setStats(statsResponse?.data || null);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams(nextSearchParams.toString());
    if (searchTerm.trim()) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(nextSearchParams.toString());
    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    router.push(`?${params.toString()}`);
  };

  const getFilteredBookings = () => {
    if (activeTab === "all") return bookings;
    return bookings.filter((b) => b.status.toLowerCase() === activeTab);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="h-10 w-64 bg-gray-100 animate-pulse rounded-2xl" />
          <div className="h-5 w-96 bg-gray-50 animate-pulse rounded-xl" />
        </div>
        <TableSkeleton columnCount={7} rowCount={8} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Reservations</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-[#138bc9]" />
            Manage all bookings across your tours
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-1 flex items-center shadow-sm">
            <Search className="ml-3 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tour title or customer email..."
              className="border-none focus-visible:ring-0 w-[240px] h-10 font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button
              onClick={handleSearch}
              className="bg-[#138bc9] hover:bg-[#138bc9]/90 text-white rounded-xl h-9 px-4 font-bold text-xs transition-all duration-300"
            >
              Search
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-2xl border-gray-100 h-12 px-4 font-bold text-gray-600 gap-2 hover:bg-[#138bc9]/5 hover:border-[#138bc9]/20 transition-all duration-300">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl border-gray-100 shadow-xl p-2">
              <DropdownMenuLabel className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 py-2">Status Filtration</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-50" />
              {["all", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  className="rounded-xl cursor-pointer py-2.5 transition-colors focus:bg-[#138bc9]/10 focus:text-[#138bc9] font-bold text-sm"
                  checked={(!nextSearchParams.get("status") && status === "all") || nextSearchParams.get("status") === status}
                  onCheckedChange={() => handleStatusFilter(status)}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Tabs
          defaultValue="all"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="flex items-center justify-between mb-6 bg-white p-1.5 rounded-[20px] border border-gray-100 shadow-sm w-fit">
            <TabsList className="bg-transparent h-auto p-0 gap-1">
              {[
                { label: "All Reservations", value: "all" },
                { label: "Pending", value: "pending" },
                { label: "Confirmed", value: "confirmed" },
                { label: "Finished", value: "completed" },
                { label: "Cancelled", value: "cancelled" }
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "rounded-2xl px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-500",
                    "data-[state=active]:bg-[#138bc9] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#138bc9]/20 font-black",
                    "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <Card className="border-none shadow-sm overflow-hidden bg-transparent">
            <CardContent className="p-0">
              <TabsContent value={activeTab} className="mt-0 focus-visible:ring-0">
                <HostBookingsTable bookings={getFilteredBookings()} />
                {getFilteredBookings().length === 0 && (
                  <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-gray-50 text-center space-y-4 mt-4">
                    <div className="h-16 w-16 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300">
                      <Info className="h-8 w-8" />
                    </div>
                    <div className="max-w-xs">
                      <p className="text-lg font-black text-gray-900">Nothing found here</p>
                      <p className="text-sm font-medium text-gray-400 mt-1">No bookings match the current filter criteria or tab selection.</p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}