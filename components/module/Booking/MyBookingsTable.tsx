"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  MoreHorizontal,
  Eye,
  Edit,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Star,
  XCircle,
  Clock,
  CheckCircle,
  FileText
} from "lucide-react";
import Image from "next/image";
import { IBooking } from "@/types/booking.interface";
import { cancelBooking } from "@/services/booking.service";
import { cn } from "@/lib/utils";
import PaymentDialog from "./PaymentDialog";
import UpdateBookingDialog from "./UpdateBookingDialog";
import CancelBookingDialog from "./CancelBookingDialog";

interface MyBookingsTableProps {
  bookings: IBooking[];
}

export function MyBookingsTable({ bookings = [] }: MyBookingsTableProps) {
  const router = useRouter();
  const [cancellingBooking, setCancellingBooking] = useState<IBooking | null>(null);
  const [updatingBooking, setUpdatingBooking] = useState<IBooking | null>(null);
  const [payingBooking, setPayingBooking] = useState<IBooking | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleViewTour = (booking: IBooking) => {
    if (booking.tour?.id) router.push(`/tour/${booking.tour.id}`);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;
    setIsLoading(cancellingBooking.id);
    try {
      const result = await cancelBooking(cancellingBooking.id);
      if (result.success) {
        toast.success("Expedition withdrawal successful");
        setCancellingBooking(null);
        router.refresh();
      } else {
        toast.error(result.message || "Withdrawal protocol failed");
      }
    } catch (error) {
      toast.error("Critial system error during cancellation");
    } finally {
      setIsLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return "N/A";
    }
  };

  if (bookings.length === 0) {
    return (
      <Card className="border-none shadow-sm bg-gray-50/50">
        <CardContent className="py-20">
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 rounded-[30px] bg-white shadow-sm flex items-center justify-center border border-gray-100">
              <Calendar className="h-10 w-10 text-gray-300" />
            </div>
            <div className="max-w-xs mx-auto">
              <h3 className="text-xl font-black text-gray-900">No active passports</h3>
              <p className="text-sm font-medium text-gray-500 mt-2 uppercase tracking-tight">
                Your journey hasn't started yet. Initialize your first expedition to see it here.
              </p>
            </div>
            <Button
              onClick={() => router.push("/tours")}
              className="bg-[#138bc9] hover:bg-[#138bc9]/90 text-white font-bold rounded-2xl px-10 h-12 shadow-lg shadow-[#138bc9]/20 transition-all duration-300 hover:scale-105"
            >
              Explore Horizon
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="rounded-[30px] border border-gray-100 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-50">
              <TableHead className="font-black text-[10px] text-gray-400 uppercase tracking-widest py-5 pl-8">Expedition</TableHead>
              <TableHead className="font-black text-[10px] text-gray-400 uppercase tracking-widest py-5">Status</TableHead>
              <TableHead className="font-black text-[10px] text-gray-400 uppercase tracking-widest py-5">Settlement</TableHead>
              <th className="font-black text-[10px] text-gray-400 uppercase tracking-widest py-5 text-left">Passengers</th>
              <TableHead className="font-black text-[10px] text-gray-400 uppercase tracking-widest py-5">Launch Date</TableHead>
              <TableHead className="font-black text-[10px] text-gray-400 uppercase tracking-widest py-5 text-right pr-8">Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-gray-50/30 transition-all duration-300 group border-gray-50">
                <TableCell className="py-5 pl-8">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-20 rounded-2xl overflow-hidden shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300">
                      {booking.tour?.images?.length ? (
                        <Image
                          src={booking.tour.images[0]}
                          alt={booking.tour.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-300">
                          <MapPin className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-[#138bc9] transition-colors">
                        {booking.tour?.title || "Unknown Expedition"}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="h-3 w-3 text-[#138bc9]" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase truncate">
                          {booking.tour?.destination}, {booking.tour?.city}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn(
                    "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none",
                    booking.status === 'CONFIRMED' ? "bg-emerald-50 text-emerald-600" :
                      booking.status === 'PENDING' ? "bg-amber-50 text-amber-600" :
                        booking.status === 'COMPLETED' ? "bg-blue-50 text-blue-600" :
                          "bg-gray-100 text-gray-500"
                  )}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    <Badge variant="outline" className={cn(
                      "rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-tighter border-none",
                      booking.paymentStatus === 'PAID' ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
                    )}>
                      {booking.paymentStatus}
                    </Badge>
                    <div className="font-black text-gray-900 text-sm ml-1">
                      ${booking.totalAmount}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                      <Users className="h-4 w-4" />
                    </div>
                    <span className="font-black text-gray-900 text-sm">{booking.numberOfPeople}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black text-gray-800 uppercase tracking-tighter">
                      <Calendar className="h-3 w-3 text-[#138bc9]" />
                      {formatDate(booking.tour?.startDate || "")}
                    </div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Departure</p>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-[#138bc9]/10 hover:text-[#138bc9] transition-all duration-300">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl border-gray-100 shadow-xl p-2 font-bold">
                      <DropdownMenuLabel className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 py-2">Management</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-50" />
                      <DropdownMenuItem onClick={() => handleViewTour(booking)} className="rounded-xl cursor-pointer py-2.5 transition-colors focus:bg-[#138bc9]/10 focus:text-[#138bc9]">
                        <Eye className="h-4 w-4 mr-3" />
                        <span className="text-sm">Public View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/user/dashboard/bookings/${booking.id}`)} className="rounded-xl cursor-pointer py-2.5 transition-colors focus:bg-[#138bc9]/10 focus:text-[#138bc9]">
                        <FileText className="h-4 w-4 mr-3" />
                        <span className="text-sm">Reservation Details</span>
                      </DropdownMenuItem>

                      {booking.status === 'PENDING' && (
                        <DropdownMenuItem onClick={() => setUpdatingBooking(booking)} className="rounded-xl cursor-pointer py-2.5 transition-colors focus:bg-[#138bc9]/10 focus:text-[#138bc9]">
                          <Edit className="h-4 w-4 mr-3" />
                          <span className="text-sm">Modify Request</span>
                        </DropdownMenuItem>
                      )}

                      {booking.paymentStatus === 'PENDING' && (
                        <DropdownMenuItem onClick={() => setPayingBooking(booking)} className="rounded-xl cursor-pointer py-2.5 transition-colors focus:bg-[#138bc9]/10 focus:text-[#138bc9] text-[#138bc9]">
                          <CreditCard className="h-4 w-4 mr-3" />
                          <span className="text-sm">Finalize Settlement</span>
                        </DropdownMenuItem>
                      )}

                      {booking.status === 'COMPLETED' && !booking.isReviewed && (
                        <DropdownMenuItem onClick={() => router.push(`/reviews/create?bookingId=${booking.id}&tourId=${booking.tourId}`)} className="rounded-xl cursor-pointer py-2.5 transition-colors focus:bg-amber-50 focus:text-amber-500">
                          <Star className="h-4 w-4 mr-3" />
                          <span className="text-sm">Post Feedback</span>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator className="bg-gray-50" />
                      {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                        <DropdownMenuItem
                          onClick={() => setCancellingBooking(booking)}
                          className="rounded-xl cursor-pointer py-2.5 transition-colors focus:bg-red-50 focus:text-red-600 text-red-500"
                        >
                          <XCircle className="h-4 w-4 mr-3" />
                          <span className="text-sm">Cancel Invitation</span>
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

      {cancellingBooking && (
        <CancelBookingDialog
          booking={cancellingBooking}
          open={!!cancellingBooking}
          onClose={() => setCancellingBooking(null)}
          onConfirm={handleConfirmCancel}
          isLoading={isLoading === cancellingBooking.id}
        />
      )}

      {updatingBooking && (
        <UpdateBookingDialog
          booking={updatingBooking}
          open={!!updatingBooking}
          onClose={() => setUpdatingBooking(null)}
        />
      )}

      {payingBooking && (
        <PaymentDialog
          booking={payingBooking}
          open={!!payingBooking}
          onClose={() => setPayingBooking(null)}
        />
      )}
    </>
  );
}