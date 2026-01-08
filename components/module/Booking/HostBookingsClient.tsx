/* eslint-disable @typescript-eslint/no-explicit-any */
// app/host/dashboard/bookings/HostBookingsClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams as useNextSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import BookingStats from "@/components/module/Booking/HostBookingStats";
import { HostBookingsTable } from "@/components/module/Booking/HostBookingsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getHostBookings, getHostBookingStats } from "@/services/booking/booking";

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
          status: searchParams.status as string,
          page: searchParams.page ? parseInt(searchParams.page as string) : 1,
          limit: searchParams.limit ? parseInt(searchParams.limit as string) : 10,
          sortBy: (searchParams.sortBy as string) || "bookingDate",
          sortOrder: (searchParams.sortOrder as string) || "desc",
        };

        const [bookingsResponse, statsResponse] = await Promise.all([
          getHostBookings(),
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
    switch (activeTab) {
      case "pending":
        return bookings.filter((b) => b.status === "PENDING");
      case "confirmed":
        return bookings.filter((b) => b.status === "CONFIRMED");
      case "completed":
        return bookings.filter((b) => b.status === "COMPLETED");
      case "cancelled":
        return bookings.filter((b) => b.status === "CANCELLED");
      default:
        return bookings;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Host Bookings</h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all bookings for your tours
          </p>
        </div>
      </div>

      {/* {stats && <BookingStats stats={stats} />} */}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                Manage bookings, update status, and track payments
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tours or customers..."
                  className="pl-9 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={!nextSearchParams.get("status")}
                    onCheckedChange={() => handleStatusFilter("all")}
                  >
                    All
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={nextSearchParams.get("status") === "PENDING"}
                    onCheckedChange={() => handleStatusFilter("PENDING")}
                  >
                    Pending
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={nextSearchParams.get("status") === "CONFIRMED"}
                    onCheckedChange={() => handleStatusFilter("CONFIRMED")}
                  >
                    Confirmed
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={nextSearchParams.get("status") === "COMPLETED"}
                    onCheckedChange={() => handleStatusFilter("COMPLETED")}
                  >
                    Completed
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={nextSearchParams.get("status") === "CANCELLED"}
                    onCheckedChange={() => handleStatusFilter("CANCELLED")}
                  >
                    Cancelled
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="all"
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <HostBookingsTable bookings={getFilteredBookings()} />
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              <HostBookingsTable bookings={getFilteredBookings()} />
            </TabsContent>

            <TabsContent value="confirmed" className="mt-0">
              <HostBookingsTable bookings={getFilteredBookings()} />
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <HostBookingsTable bookings={getFilteredBookings()} />
            </TabsContent>

            <TabsContent value="cancelled" className="mt-0">
              <HostBookingsTable bookings={getFilteredBookings()} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}