"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IBooking } from "@/types/booking.interface";
import { cancelBooking, getBookingPaymentInfo, initiateBookingPayment } from "@/services/booking.service";
import CancelBookingDialog from "./CancelBookingDialog";


interface BookingActionsProps {
  booking: IBooking;
}

export default function BookingActions({ booking }: BookingActionsProps) {
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const canCancel = () => {
    // Allow cancellation for PENDING and CONFIRMED bookings
    if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
      return false;
    }
    
    // Check if tour hasn't started yet
    const tourStartDate = booking.tour?.startDate ? new Date(booking.tour.startDate) : null;
    if (tourStartDate) {
      const now = new Date();
      return tourStartDate > now;
    }
    
    return true;
  };

  const canPay = () => {
    // Check if payment is pending and booking is confirmed
    return booking.paymentStatus === 'PENDING' && booking.status === 'CONFIRMED';
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const result = await cancelBooking(booking.id);
      
      if (result.success) {
        toast.success("Booking cancelled successfully!");
        setShowCancelDialog(false);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Cancel booking error:", error);
      toast.error("Failed to cancel booking");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // First check if booking can be paid
      const paymentInfo = await getBookingPaymentInfo(booking.id);
      
      if (!paymentInfo.success || !paymentInfo.data?.canPay) {
        toast.error("Payment is not available for this booking");
        return;
      }

      // Initiate payment
      const result = await initiateBookingPayment(booking.id);
      
      if (result.success && result.data?.paymentUrl) {
        // Redirect to payment URL
        window.location.href = result.data.paymentUrl;
      } else {
        toast.error(result.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Failed to initiate payment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactHost = () => {
    if (booking.tour?.host?.email) {
      window.location.href = `mailto:${booking.tour.host.email}?subject=Regarding booking: ${booking.tour.title}`;
    }
  };

  const handleViewTour = () => {
    if (booking.tour?.id) {
      router.push(`/tours/${booking.tour.id}`);
    }
  };

  const handleLeaveReview = () => {
    if (booking.status === 'COMPLETED' && !booking.isReviewed) {
      router.push(`/reviews/create?bookingId=${booking.id}&tourId=${booking.tourId}`);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6 space-y-3">
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleViewTour}
            disabled={isLoading}
          >
            View Tour Details
          </Button>

          {canPay() && (
            <Button 
              className="w-full" 
              variant="default"
              onClick={handlePayment}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Make Payment"}
            </Button>
          )}

          {canCancel() && (
            <Button 
              className="w-full" 
              variant="destructive"
              onClick={() => setShowCancelDialog(true)}
              disabled={isLoading}
            >
              Cancel Booking
            </Button>
          )}

          {booking.status === 'COMPLETED' && !booking.isReviewed && (
            <Button 
              className="w-full" 
              variant="secondary"
              onClick={handleLeaveReview}
              disabled={isLoading}
            >
              Leave a Review
            </Button>
          )}

          <Button 
            className="w-full" 
            variant="secondary"
            onClick={handleContactHost}
            disabled={isLoading}
          >
            Contact Host
          </Button>

          <Button 
            className="w-full" 
            variant="ghost"
            onClick={() => router.push("/user/dashboard/my-bookings")}
            disabled={isLoading}
          >
            Back to My Bookings
          </Button>
        </CardContent>
      </Card>

      {/* Cancel Booking Dialog */}
      {showCancelDialog && (
        <CancelBookingDialog
          booking={booking}
          open={showCancelDialog}
          onClose={() => setShowCancelDialog(false)}
          onConfirm={handleCancel}
          isLoading={isLoading}
        />
      )}
    </>
  );
}