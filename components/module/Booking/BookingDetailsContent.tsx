// app/host/dashboard/bookings/[id]/BookingDetailsContent.tsx
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getSingleBooking } from "@/services/booking.service";
import { format } from "date-fns";
import {
  Calendar,
  Users,
  DollarSign,
  MapPin,
  User,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default async function BookingDetailsContent({ bookingId }: { bookingId: string }) {
  const bookingResponse = await getSingleBooking(bookingId);
  
  if (!bookingResponse.success || !bookingResponse.data) {
    notFound();
  }

  const booking = bookingResponse.data;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy, hh:mm a");
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "CONFIRMED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "COMPLETED":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
      case "CANCELLED":
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
       
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Booking Details</h1>
          <p className="text-muted-foreground mt-2">
            Booking ID: {booking.id}
          </p>
        </div>

         <Button variant="ghost" size="sm" asChild>
          <Link href="/host/dashboard/bookings">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Booking Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tour Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    Tour
                  </div>
                  <p className="font-medium">{booking.tour?.title}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    Destination
                  </div>
                  <p className="font-medium">{booking.tour?.destination}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Start Date
                  </div>
                  <p className="font-medium">{formatDate(booking.tour?.startDate || "")}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    End Date
                  </div>
                  <p className="font-medium">{formatDate(booking.tour?.endDate || "")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    Customer Name
                  </div>
                  <p className="font-medium">{ booking.tourist?.name || "N/A"}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                  <p className="font-medium">{booking.user?.email || booking.tourist?.email || "N/A"}</p>
                </div>

                {booking.tourist?.phone && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      Phone
                    </div>
                    <p className="font-medium">{booking.tourist.phone}</p>
                  </div>
                )}

                {booking.tourist?.location && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      Location
                    </div>
                    <p className="font-medium">{booking.tourist.location}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  {getStatusBadge(booking.status)}
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payment Status</span>
                  {getPaymentStatusBadge(booking.paymentStatus)}
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    Participants
                  </span>
                  <span className="font-medium">{booking.numberOfPeople}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    Total Amount
                  </span>
                  <span className="font-medium">{formatCurrency(booking.totalAmount)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Booking Date</span>
                  <span className="font-medium">{formatDate(booking.bookingDate)}</span>
                </div>
              </div>

              {booking.specialRequests && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Special Requests</div>
                    <p className="text-sm">{booking.specialRequests}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {booking.status === "CONFIRMED" && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full"
                  variant="default"
                  asChild
                >
                  <Link href={`/host/dashboard/bookings/${booking.id}/complete`}>
                    Mark as Completed
                  </Link>
                </Button>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  asChild
                >
                  <Link href={`/host/dashboard/bookings/${booking.id}/cancel`}>
                    Cancel Booking
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Payment History */}
      {booking.payments && booking.payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {booking.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {formatCurrency(payment.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {payment.paymentMethod} • {payment.status}
                    </div>
                    {payment.paidAt && (
                      <div className="text-xs text-muted-foreground">
                        Paid on {formatDate(payment.paidAt)}
                      </div>
                    )}
                  </div>
                  <div>
                    {payment.status === "COMPLETED" ? (
                      <Badge className="bg-green-500">Completed</Badge>
                    ) : (
                      <Badge variant="outline">{payment.status}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}