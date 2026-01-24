"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Users,
  DollarSign,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MapPin,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  Briefcase,
  ShieldCheck,
  UserCircle,
  Activity,
  Search,
  ChevronDown
} from "lucide-react";
import { IBooking, IBookingStats } from "@/types/booking.interface";
import { getAllBookings, deleteBooking, updateBookingStatus } from "@/services/booking.service";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function AdminBookingManagement() {
  const router = useRouter();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBookings();
      if (res.success) {
        setBookings(res.data || []);
        // Compute local stats for visual richness
        const totalRevenue = res.data?.reduce((sum: number, b: any) => sum + (b.totalAmount || 0), 0) || 0;
        setStats({
          total: res.data?.length || 0,
          confirmed: res.data?.filter((b: any) => b.status === 'CONFIRMED').length || 0,
          pending: res.data?.filter((b: any) => b.status === 'PENDING').length || 0,
          revenue: totalRevenue
        });
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await updateBookingStatus(id, status);
      if (res.success) { toast.success("Expedition protocol updated"); fetchBookings(); setStatusDialogOpen(false); }
    } catch { toast.error("Status update failure"); }
  };

  const handleDelete = async () => {
    if (!selectedBooking) return;
    try {
      const res = await deleteBooking(selectedBooking.id);
      if (res.success) { toast.success("Reservation redacted"); fetchBookings(); setDeleteDialogOpen(false); }
    } catch { toast.error("Redaction failure"); }
  };

  const formatDate = (d: any) => d ? format(new Date(d), "MMM dd, yyyy") : "N/A";

  if (loading && bookings.length === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-gray-50 animate-pulse rounded-[30px]" />)}
        </div>
        <TableSkeleton columnCount={7} rowCount={10} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Booking Pipeline</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#138bc9]" />
            Global reservation audit and protocol orchestration
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchBookings} variant="outline" className="rounded-2xl border-gray-100 font-bold text-gray-500 gap-2 hover:bg-gray-50 h-11 px-6">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Sync Registry
          </Button>
          <Button variant="outline" className="rounded-2xl border-gray-100 font-bold text-gray-500 gap-2 hover:bg-gray-50 h-11 px-6">
            <Download className="h-4 w-4" />
            Audit Log
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total Volume", value: stats?.total || 0, icon: Briefcase, color: "text-[#138bc9]", bg: "bg-blue-50" },
          { label: "Pipeline Revenue", value: `$${(stats?.revenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Active Missions", value: stats?.confirmed || 0, icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Pending Audit", value: stats?.pending || 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" }
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden group transition-all duration-300 hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <h3 className="text-2xl font-black text-gray-900 leading-none">{item.value}</h3>
                </div>
                <div className={cn("p-3 rounded-xl transition-all duration-300 group-hover:scale-110", item.bg, item.color)}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Registry Table */}
      <div className="rounded-[40px] border border-gray-100 overflow-hidden bg-white shadow-xl shadow-gray-200/40">
        <table className="w-full">
          <thead className="bg-gray-50/50 border-b border-gray-50 text-gray-400">
            <tr>
              <th className="px-8 py-5 text-left font-black text-[10px] uppercase tracking-widest pl-10">Identifier / Scout</th>
              <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Expedition Node</th>
              <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Settlement</th>
              <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Protocol</th>
              <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Chronicle</th>
              <th className="px-8 py-5 text-right font-black text-[10px] uppercase tracking-widest pr-10">Ops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/30 transition-all group">
                  <td className="px-8 py-5 pl-10">
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono font-black text-gray-400 uppercase">HASH_{booking.id.slice(0, 8)}</p>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <UserCircle className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black text-gray-800 uppercase tracking-tighter">{booking.tourist?.name || "ANONYMOUS"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-50 shadow-sm">
                        {booking.tour?.images?.length ? (
                          <Image src={booking.tour.images[0]} alt="" fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-200">
                            <Briefcase className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate max-w-[150px] group-hover:text-[#138bc9] transition-colors">{booking.tour?.title || "UNRESOLVED"}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <Users className="h-2.5 w-2.5" />
                          {booking.numberOfPeople} Passengers
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-emerald-600">${booking.totalAmount}</p>
                      <Badge variant="outline" className={cn(
                        "px-1.5 py-0 rounded text-[7px] font-black uppercase border-none shadow-none",
                        booking.paymentStatus === 'PAID' ? "bg-emerald-50 text-emerald-600 font-black" : "bg-gray-50 text-gray-400"
                      )}>
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge className={cn(
                      "rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest border-none shadow-none",
                      booking.status === 'CONFIRMED' ? "bg-blue-50 text-[#138bc9]" :
                        booking.status === 'COMPLETED' ? "bg-emerald-50 text-emerald-600" :
                          booking.status === 'PENDING' ? "bg-amber-50 text-amber-600" :
                            "bg-gray-100 text-gray-400"
                    )}>
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-black text-gray-800 uppercase tracking-tighter">
                        <Calendar className="h-3 w-3 text-[#138bc9]" />
                        {formatDate(booking.bookingDate)}
                      </div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">Booked On</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right pr-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-gray-50 transition-all">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-2xl border-gray-100 shadow-2xl p-2 font-bold">
                        <DropdownMenuLabel className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2">Mission Control</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-50" />
                        <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/bookings/${booking.id}`)} className="rounded-xl cursor-pointer py-3 transition-colors focus:bg-[#138bc9]/10 focus:text-[#138bc9]">
                          <Eye className="h-4 w-4 mr-3" />
                          <span>Full Manifest</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => { setSelectedBooking(booking); setStatusDialogOpen(true); }}
                          className="rounded-xl cursor-pointer py-3 transition-colors focus:bg-[#138bc9]/10 focus:text-[#138bc9]"
                        >
                          <Activity className="h-4 w-4 mr-3" />
                          <span>Orchestrate Status</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-50" />
                        <DropdownMenuItem
                          onClick={() => { setSelectedBooking(booking); setDeleteDialogOpen(true); }}
                          className="rounded-xl cursor-pointer py-3 transition-colors focus:bg-red-50 focus:text-red-600 text-red-500"
                        >
                          <Trash2 className="h-4 w-4 mr-3" />
                          <span>Purge Record</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-32 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-20 w-20 rounded-[35px] bg-gray-50 flex items-center justify-center text-gray-200">
                      <Briefcase className="h-10 w-10" />
                    </div>
                    <p className="text-sm font-black uppercase tracking-widest">Pipeline Clear</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Status Orchestration Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-md rounded-[40px] border-none shadow-2xl p-0 overflow-hidden">
          <div className="p-10 space-y-8 animate-in zoom-in-95">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Orchestrate Protocol</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Update reservation terminal status</p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((status) => (
                <Button
                  key={status}
                  variant="outline"
                  onClick={() => handleStatusUpdate(selectedBooking!.id, status)}
                  className={cn(
                    "h-14 rounded-2xl border-gray-100 font-black uppercase tracking-widest text-[10px] justify-between px-6 hover:bg-[#138bc9] hover:text-white transition-all group",
                    selectedBooking?.status === status && "bg-[#138bc9] text-white border-[#138bc9]"
                  )}
                >
                  {status}
                  {selectedBooking?.status === status ? <CheckCircle className="h-4 w-4" /> : <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </Button>
              ))}
            </div>

            <Button variant="ghost" onClick={() => setStatusDialogOpen(false)} className="w-full h-12 rounded-2xl font-black uppercase text-[10px] text-gray-400">Abort Protocol</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-[40px] border-none shadow-2xl p-0 overflow-hidden">
          <div className="p-10 text-center space-y-8">
            <div className="mx-auto h-20 w-20 rounded-[35px] bg-red-50 flex items-center justify-center text-red-500">
              <Trash2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900">Purge Reservation?</h3>
              <p className="text-sm font-medium text-gray-500 leading-relaxed uppercase tracking-tighter">This will permanently redact the expedition HASH_{selectedBooking?.id.slice(0, 8)} from all system ledgers.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="h-12 rounded-2xl font-black uppercase text-[10px] border-gray-100">Keep</Button>
              <Button onClick={handleDelete} className="h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] shadow-lg shadow-red-200">Purge Registry</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}