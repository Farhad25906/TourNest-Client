// components/module/Booking/PaymentDialog.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IBooking } from "@/types/booking.interface";
import { initiateBookingPayment } from "@/services/booking.service";
import { CreditCard, DollarSign, Calendar, Users, AlertCircle } from "lucide-react";

interface PaymentDialogProps {
  booking: IBooking;
  open: boolean;
  onClose: () => void;
}

export default function PaymentDialog({
  booking,
  open,
  onClose,
}: PaymentDialogProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      console.log("Initiating payment for booking:", booking.id);
      
      const result = await initiateBookingPayment(booking.id);
      console.log("Payment initiation result:", result);

      if (result.success && result.data?.paymentUrl) {
        toast.success("Redirecting to payment page...");
        
        // Redirect to payment URL
        window.location.href = result.data.paymentUrl;
      } else {
        toast.error(result.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Failed to initiate payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Complete Payment</DialogTitle>
              <DialogDescription>
                Securely pay for your booking using our payment gateway
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Booking Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{booking.tour?.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Booking ID: {booking.id.slice(0, 8)}...
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Amount:</span>
                  </div>
                  <p className="text-xl font-bold">
                    {formatCurrency(booking.totalAmount)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">People:</span>
                  </div>
                  <p className="text-lg font-medium">
                    {booking.numberOfPeople} person{booking.numberOfPeople > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {booking.tour?.startDate && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Tour Date:</span>
                  </div>
                  <p className="text-sm">
                    {formatDate(booking.tour.startDate)}
                  </p>
                </div>
              )}

              {booking.specialRequests && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Special Requests:</p>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                    {booking.specialRequests}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800">Payment Security</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your payment is processed securely via Stripe</li>
                <li>• We don't store your credit card information</li>
                <li>• Your booking will be confirmed immediately after successful payment</li>
                <li>• You'll receive a confirmation email with all details</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="sm:w-auto w-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="sm:w-auto w-full bg-blue-600 hover:bg-blue-700"
          >
            {isProcessing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}