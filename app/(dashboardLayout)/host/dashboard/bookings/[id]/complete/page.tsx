"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { updateBookingStatus } from "@/services/booking.service";
import { toast } from "sonner";

export default function CompleteBookingPage() {
  const router = useRouter();
  const params = useParams(); // This is the correct way in client components
  const [isLoading, setIsLoading] = useState(false);

  const bookingId = params?.id as string;

  const handleCompleteBooking = async () => {
    if (!bookingId) {
      toast.error("Booking ID not found");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await updateBookingStatus(bookingId, "COMPLETED");
      
      if (result.success) {
        toast.success("Booking marked as completed!", {
          description: "The booking has been successfully completed.",
        });
        router.push(`/host/dashboard/bookings/${bookingId}`);
        router.refresh();
      } else {
        toast.error("Failed to complete booking", {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error completing booking:", error);
      toast.error("Something went wrong", {
        description: "Failed to complete the booking. Please try again.",
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
              <CheckCircle className="w-5 h-5" />
              Complete Booking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-medium text-yellow-800">
                    Confirm Completion
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Are you sure you want to mark this booking as completed? 
                    This action cannot be undone. Please ensure that:
                  </p>
                  <ul className="text-sm text-yellow-700 list-disc list-inside mt-2 space-y-1">
                    <li>The tour has been completed</li>
                    <li>All services have been provided</li>
                    <li>The customer has been satisfied</li>
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
                  Cancel
                </Link>
              </Button>
              <Button
                className="flex-1"
                onClick={handleCompleteBooking}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm Completion"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}