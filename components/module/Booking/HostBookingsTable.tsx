/* eslint-disable @typescript-eslint/no-explicit-any */
// app/components/module/Booking/HostBookingsTable.tsx
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
import { MoreHorizontal, Eye, CheckCircle, XCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { updateBookingStatus } from "@/services/booking.service";

interface HostBookingsTableProps {
  bookings: any[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return "Invalid date";
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function HostBookingsTable({ bookings }: HostBookingsTableProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    setIsProcessing(bookingId);
    try {
      const result = await updateBookingStatus(bookingId, status);
      if (result.success) {
        toast.success(`Booking ${status.toLowerCase()} successfully!`);
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        toast.error(`Failed to ${status.toLowerCase()} booking`, {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(null);
    }
  };

  const navigateToAction = (bookingId: string, action: "complete" | "cancel") => {
    router.push(`/host/dashboard/bookings/${bookingId}/${action}`);
  };



  if (bookings.length === 0) {
    return (
      <div className="text-center py-10">
        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold">No bookings found</h3>
        <p className="text-gray-500">No bookings match your current filters</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Tour</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/host/dashboard/bookings/${booking.id}`}
                  className="hover:underline text-blue-600"
                >
                  #{booking.id.slice(0, 8)}
                </Link>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{booking.tourist?.name || booking.user?.name || "N/A"}</p>
                  <p className="text-sm text-gray-500">{booking.tourist?.email || booking.user?.email || ""}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{booking.tour?.title || "N/A"}</p>
                  <p className="text-sm text-gray-500">{booking.tour?.destination || ""}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(booking.startDate || booking.bookingDate)}
                </div>
              </TableCell>
              <TableCell>{booking.numberOfPeople}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(booking.totalAmount)}
              </TableCell>
              <TableCell>
                <Badge className={statusColors[booking.status] || "bg-gray-100"}>
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    booking.paymentStatus === "COMPLETED"
                      ? "default"
                      : booking.paymentStatus === "FAILED"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {booking.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* View Details Button */}
                  {/* <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0"
                    asChild
                  >
                    <Link href={`/host/dashboard/bookings/${booking.id}`}>
                      <Eye className="w-3 h-3" />
                      <span className="sr-only">View details</span>
                    </Link>
                  </Button> */}

                  {/* Action Buttons */}
                  {/* {getActionButtons(booking)} */}

                  {/* More Actions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/host/dashboard/bookings/${booking.id}`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      {booking.status === "PENDING" && (
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(booking.id, "CONFIRMED")}
                          disabled={isProcessing === booking.id}
                        >
                          Confirm Booking
                        </DropdownMenuItem>
                      )}
                      {booking.status === "CONFIRMED" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => navigateToAction(booking.id, "complete")}
                          >
                            Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigateToAction(booking.id, "cancel")}
                            className="text-red-600"
                          >
                            Cancel Booking
                          </DropdownMenuItem>
                        </>
                      )}
                      {booking.status === "COMPLETED" && (
                        <DropdownMenuItem disabled>
                          Already Completed
                        </DropdownMenuItem>
                      )}
                      {booking.status === "CANCELLED" && (
                        <DropdownMenuItem
                          onClick={() => handleUpdateStatus(booking.id, "CONFIRMED")}
                          disabled={isProcessing === booking.id}
                        >
                          Re-activate Booking
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}