// app/host/dashboard/bookings/[id]/page.tsx
import BookingDetailsContent from "@/components/module/Booking/BookingDetailsContent";
import { Suspense } from "react";

export default async function HostBookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params Promise
  const { id } = await params;

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={
        <div className="space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-64 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      }>
        <BookingDetailsContent bookingId={id} />
      </Suspense>
    </div>
  );
}