// components/admin/booking/AdminBookingDetail.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Users,
  DollarSign,
  MapPin,
  User,
  CreditCard,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Edit,
  Download,
} from "lucide-react";
import { IBooking } from "@/types/booking.interface";
import { updateBookingStatus } from "@/services/booking.service";
import Image from "next/image";

interface AdminBookingDetailProps {
  booking: IBooking;
}

export default function AdminBookingDetail({ booking }: AdminBookingDetailProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleStatusUpdate = async (status: string) => {
    setLoading(true);
    try {
      const result = await updateBookingStatus(booking.id, status);
      if (result.success) {
        toast.success("Booking status updated successfully");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update booking status");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    toast.info("Invoice download coming soon!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/bookings")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Booking Details</h1>
            <p className="text-muted-foreground">
              Booking ID: {booking.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleDownloadInvoice}>
            <Download className="mr-2 h-4 w-4" />
            Invoice
          </Button>
          <Button onClick={() => router.push(`/admin/bookings/${booking.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Booking Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      className={
                        booking.status === 'CONFIRMED'
                          ? "bg-green-100 text-green-800"
                          : booking.status === 'PENDING'
                          ? "bg-amber-100 text-amber-800"
                          : booking.status === 'CANCELLED'
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {booking.status}
                    </Badge>
                    <p className="text-sm">
                      Last updated: {formatDate(booking.updatedAt || booking.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
                    <Button
                      key={status}
                      variant={booking.status === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusUpdate(status)}
                      disabled={loading || booking.status === status}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tour Details */}
          <Card>
            <CardHeader>
              <CardTitle>Tour Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {booking.tour?.images && booking.tour.images.length > 0 && (
                  <div className="relative h-32 w-48 rounded-lg overflow-hidden">
                    <Image
                      src={booking.tour.images[0]}
                      alt={booking.tour.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{booking.tour?.title || "N/A"}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Destination:</span>
                      </div>
                      <p>{booking.tour?.destination}, {booking.tour?.city}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Dates:</span>
                      </div>
                      <p>
                        {booking.tour?.startDate
                          ? formatDate(booking.tour.startDate)
                          : "N/A"} -{" "}
                        {booking.tour?.endDate
                          ? formatDate(booking.tour.endDate)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Group Size:</span>
                      </div>
                      <p>{booking.tour?.currentGroupSize || 0} / {booking.tour?.maxGroupSize || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Price per person:</span>
                      </div>
                      <p>{formatCurrency(booking.tour?.price || 0)}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => router.push(`/tours/${booking.tourId}`)}
                  >
                    View Tour Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Requests */}
          {booking.specialRequests && (
            <Card>
              <CardHeader>
                <CardTitle>Special Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="whitespace-pre-line">{booking.specialRequests}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - User & Payment */}
        <div className="space-y-6">
          {/* Tourist Info */}
          <Card>
            <CardHeader>
              <CardTitle>Tourist Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{booking.tourist?.name || "Unknown"}</h3>
                  <p className="text-sm text-muted-foreground">Tourist</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.tourist?.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.tourist?.phone || "N/A"}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={() => {
                if (booking.tourist?.email) {
                  window.location.href = `mailto:${booking.tourist.email}`;
                }
              }}>
                <Mail className="mr-2 h-4 w-4" />
                Contact Tourist
              </Button>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Status:</span>
                  <Badge
                    className={
                      booking.paymentStatus === 'PAID'
                        ? "bg-green-100 text-green-800"
                        : booking.paymentStatus === 'PENDING'
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {booking.paymentStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Method:</span>
                  <span className="font-medium">{booking.paymentMethod || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Date:</span>
                  <span>
                    {booking.paymentDate
                      ? formatDate(booking.paymentDate)
                      : "Not paid yet"}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Number of People:</span>
                  <span>{booking.numberOfPeople}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Price per Person:</span>
                  <span>{formatCurrency(booking.tour?.price || 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(booking.totalAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Booking Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>
                {booking.updatedAt !== booking.createdAt && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <Edit className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(booking.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
                {booking.cancellationDate && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-red-100 p-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Cancelled</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(booking.cancellationDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}