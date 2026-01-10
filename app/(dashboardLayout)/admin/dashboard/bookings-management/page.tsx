/* eslint-disable @typescript-eslint/no-explicit-any */
// components/admin/booking/AdminBookingManagement.tsx
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import {
  IBooking,
  IBookingStats,
} from "@/types/booking.interface";
import {
  getAllBookings,
  deleteBooking,
  updateBookingStatus,
} from "@/services/booking.service";
import Image from "next/image";

interface AdminBookingManagementProps {
  initialBookings?: IBooking[];
  stats?: IBookingStats;
}

export default function AdminBookingManagement({
  initialBookings = [],
  stats,
}: AdminBookingManagementProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState<IBooking[]>(initialBookings);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  // Fetch bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const result = await getAllBookings();

      if (result.success) {
        setBookings(result.data || []);
      } else {
        toast.error(result.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      const result = await updateBookingStatus(bookingId, status);
      if (result.success) {
        toast.success("Booking status updated successfully");
        fetchBookings();
        setStatusDialogOpen(false);
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update booking status");
    }
  };

  // Handle delete booking
  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;

    try {
      const result = await deleteBooking(selectedBooking.id);
      if (result.success) {
        toast.success("Booking deleted successfully");
        fetchBookings();
        setDeleteDialogOpen(false);
        setSelectedBooking(null);
      } else {
        toast.error(result.message || "Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
    }
  };

  // Get status badge
  const getStatusBadge = (status: IBooking["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Confirmed
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-300">
            Pending
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Cancelled
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status: IBooking["paymentStatus"]) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Paid
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-300">
            Pending
          </Badge>
        );
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
      case "REFUNDED":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Refunded
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Export data (placeholder)
  const handleExportData = () => {
    toast.info("Export functionality coming soon!");
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchBookings();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Booking Management
          </h1>
          <p className="text-muted-foreground">
            Manage all bookings, view statistics, and update booking status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleRefresh} disabled={loading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">All-time bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalSpent?.toFixed(2) || "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                Total booking amount
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.confirmedBookings}
              </div>
              <p className="text-xs text-muted-foreground">Active bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingBookings}</div>
              <p className="text-xs text-muted-foreground">Awaiting action</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            {bookings.length} total bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Tourist</TableHead>
                      <TableHead>Tour Details</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-sm">
                          {booking.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {booking.tourist?.name || "Unknown"}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {booking.tourist?.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-16 rounded-md overflow-hidden">
                              {booking.tour?.images &&
                              booking.tour.images.length > 0 ? (
                                <Image
                                  src={booking.tour.images[0]}
                                  alt={booking.tour.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-muted flex items-center justify-center">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium line-clamp-1">
                                {booking.tour?.title || "N/A"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                <Users className="inline h-3 w-3 mr-1" />
                                {booking.numberOfPeople} people
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(booking.totalAmount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          {getPaymentStatusBadge(booking.paymentStatus)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(booking.bookingDate)}
                            </div>
                            {booking.tour?.startDate && (
                              <div className="text-xs text-muted-foreground">
                                Tour: {formatDate(booking.tour.startDate)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/admin/bookings/${booking.id}`)
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/tours/${booking.tourId}`)
                                }
                              >
                                <MapPin className="h-4 w-4 mr-2" />
                                View Tour
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setStatusDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Update Status
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Booking
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {bookings.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No bookings found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="p-4 border rounded-md">
              <p className="font-medium">
                {selectedBooking.tour?.title || "Booking"}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Booking ID:</span>
                  <p className="font-mono">
                    {selectedBooking.id.slice(0, 10)}...
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <p>{formatCurrency(selectedBooking.totalAmount)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p>{selectedBooking.status}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tourist:</span>
                  <p>{selectedBooking.tourist?.name || "Unknown"}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBooking}>
              Delete Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
            <DialogDescription>
              Change the status of this booking
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <p className="font-medium">
                    {selectedBooking.tour?.title || "Booking"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Current status: <Badge>{selectedBooking.status}</Badge>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Select New Status</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(
                      (status) => (
                        <Button
                          key={status}
                          variant={
                            selectedBooking.status === status
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            handleStatusUpdate(selectedBooking.id, status)
                          }
                          className="justify-start"
                        >
                          {status}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setStatusDialogOpen(false)}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}