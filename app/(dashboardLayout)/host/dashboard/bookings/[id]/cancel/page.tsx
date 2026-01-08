"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { updateBookingStatus } from "@/services/booking.service";
import { toast } from "sonner";

export default function CancelBookingPage() {
  const router = useRouter();
  const params = useParams(); // Use useParams hook
  const [isLoading, setIsLoading] = useState(false);

  const bookingId = params?.id as string;

  const handleCancelBooking = async () => {
    if (!bookingId) {
      toast.error("Booking ID not found");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await updateBookingStatus(bookingId, "CANCELLED");
      
      if (result.success) {
        toast.success("Booking cancelled successfully!", {
          description: "The booking has been cancelled.",
        });
        router.push(`/host/dashboard/bookings/${bookingId}`);
        router.refresh();
      } else {
        toast.error("Failed to cancel booking", {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Something went wrong", {
        description: "Failed to cancel the booking. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/host/dashboard/bookings/${bookingId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Booking
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Cancel Booking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-medium text-red-800">
                    Warning: Cancelling Booking
                  </h4>
                  <p className="text-sm text-red-700">
                    Are you sure you want to cancel this booking? 
                    This action cannot be undone. Cancelling may:
                  </p>
                  <ul className="text-sm text-red-700 list-disc list-inside mt-2 space-y-1">
                    <li>Disappoint the customer</li>
                    <li>Affect your host rating</li>
                    <li>Require refund processing if payment was made</li>
                    <li>Free up spots for this tour</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                asChild
                disabled={isLoading}
              >
                <Link href={`/host/dashboard/bookings/${bookingId}`}>
                  Go Back
                </Link>
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleCancelBooking}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Cancel Booking"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}