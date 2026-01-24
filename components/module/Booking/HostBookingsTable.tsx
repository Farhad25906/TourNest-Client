"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  User,
  UserCircle,
  ShieldCheck,
  ArrowUpRight,
  MapPin,
  Briefcase,
  Activity,
  Clock,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { updateBookingStatus } from "@/services/booking.service";
import { cn } from "@/lib/utils";

interface HostBookingsTableProps {
  bookings: any[];
}

export function HostBookingsTable({ bookings }: HostBookingsTableProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    setIsProcessing(bookingId);
    try {
      const result = await updateBookingStatus(bookingId, status);
      if (result.success) {
        toast.success(`Mission protocol updated to ${status}`);
        router.refresh();
      } else {
        toast.error(`Update failed`, { description: result.message });
      }
    } finally { setIsProcessing(null); }
  };

  const navigateToAction = (bookingId: string, action: "complete" | "cancel") => {
    router.push(`/host/dashboard/bookings/${bookingId}/${action}`);
  };

  const formatDate = (dateString: string) => {
    try { return format(new Date(dateString), "MMM dd, yyyy"); }
    catch { return "N/A"; }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  return (
    <div className="rounded-[40px] border border-gray-100 overflow-hidden bg-white shadow-xl shadow-gray-200/40">
      <Table>
        <TableHeader className="bg-gray-50/50 border-b border-gray-50 text-gray-400">
          <TableRow className="hover:bg-transparent">
            <th className="px-8 py-5 text-left font-black text-[10px] uppercase tracking-widest pl-10">Reservation Node</th>
            <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Global Scout</th>
            <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Expedition Journey</th>
            <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Protocol</th>
            <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Settlement</th>
            <th className="px-8 py-5 text-right font-black text-[10px] uppercase tracking-widest pr-10">Ops</th>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-50">
          {bookings.map((booking) => (
            <TableRow key={booking.id} className="hover:bg-gray-50/30 transition-all duration-300 group border-gray-50">
              <TableCell className="py-5 pl-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-tighter bg-gray-50 w-fit px-2 py-0.5 rounded-md">HASH_{booking.id.slice(0, 8).toUpperCase()}</p>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase italic">
                    <Clock className="h-2.5 w-2.5" />
                    Logged: {formatDate(booking.createdAt)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-100 group-hover:scale-110 transition-transform">
                    <UserCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-gray-900 text-sm truncate uppercase tracking-tighter">{booking.tourist?.name || booking.user?.name || "Scout"}</p>
                    <p className="text-[10px] font-bold text-gray-400 truncate mt-0.5">{booking.tourist?.email || booking.user?.email || "No email relay"}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="min-w-[150px]">
                  <p className="font-black text-gray-900 text-sm line-clamp-1 group-hover:text-[#138bc9] transition-colors">{booking.tour?.title || "Unknown Horizon"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black text-[#138bc9] flex items-center gap-1 uppercase tracking-widest">
                      <Sparkles className="h-3 w-3" />
                      {booking.numberOfPeople} Pers. Payload
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1.5">
                  <Badge className={cn(
                    "w-fit rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none shadow-none",
                    booking.status === 'CONFIRMED' ? "bg-emerald-50 text-emerald-600" :
                      booking.status === 'PENDING' ? "bg-amber-50 text-amber-600" :
                        booking.status === 'CANCELLED' ? "bg-rose-50 text-rose-600" :
                          "bg-blue-50 text-blue-600"
                  )}>
                    {booking.status}
                  </Badge>
                  <div className="flex items-center gap-1.5 px-1">
                    <Badge variant="outline" className={cn(
                      "text-[7px] font-black uppercase px-1.5 py-0 border-none shadow-none",
                      booking.paymentStatus === 'COMPLETED' ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
                    )}>
                      {booking.paymentStatus === 'COMPLETED' ? 'Settled' : 'Unpaid'}
                    </Badge>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-black text-gray-900 text-base">
                  {formatCurrency(booking.totalAmount)}
                </div>
                <div className="text-[9px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tighter mt-0.5">
                  <DollarSign className="h-2.5 w-2.5" />
                  Cleared Funds
                </div>
              </TableCell>
              <TableCell className="text-right pr-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-gray-50 transition-all duration-300">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl border-gray-100 shadow-2xl p-2 font-bold">
                    <DropdownMenuLabel className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2">Mission Management</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-50" />
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-3 transition-colors focus:bg-[#138bc9]/10 focus:text-[#138bc9]">
                      <Link href={`/host/dashboard/bookings/${booking.id}`} className="flex items-center w-full">
                        <Eye className="h-4 w-4 mr-3" />
                        <span>View Manifest</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-50" />

                    {booking.status === "PENDING" && (
                      <DropdownMenuItem
                        onClick={() => handleUpdateStatus(booking.id, "CONFIRMED")}
                        disabled={isProcessing === booking.id}
                        className="rounded-xl cursor-pointer py-3 transition-colors focus:bg-emerald-50 focus:text-emerald-600 text-emerald-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-3" />
                        <span>Confirm Mission</span>
                      </DropdownMenuItem>
                    )}

                    {booking.status === "CONFIRMED" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => navigateToAction(booking.id, "complete")}
                          className="rounded-xl cursor-pointer py-3 transition-colors focus:bg-[#138bc9]/10 focus:text-[#138bc9]"
                        >
                          <CheckCircle className="h-4 w-4 mr-3" />
                          <span>Complete Protocol</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigateToAction(booking.id, "cancel")}
                          className="rounded-xl cursor-pointer py-3 transition-colors focus:bg-rose-50 focus:text-rose-600 text-rose-600"
                        >
                          <XCircle className="h-4 w-4 mr-3" />
                          <span>Abort Mission</span>
                        </DropdownMenuItem>
                      </>
                    )}

                    {booking.status === "CANCELLED" && (
                      <DropdownMenuItem
                        onClick={() => handleUpdateStatus(booking.id, "CONFIRMED")}
                        disabled={isProcessing === booking.id}
                        className="rounded-xl cursor-pointer py-3 transition-colors focus:bg-[#138bc9]/10 focus:text-[#138bc9]"
                      >
                        <CheckCircle className="h-4 w-4 mr-3" />
                        <span>Re-initialize</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}