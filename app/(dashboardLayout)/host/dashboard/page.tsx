import { Suspense } from "react";
import { getMyTourStats } from "@/services/tour/tour.service";
import { getHostBookingStats } from "@/services/booking.service";
import HostDashboardContent from "@/components/module/Dashboard/HostDashboardContent";
import { DashboardSkeleton } from "@/components/shared/DashboardSkeleton";
import { getMyReviews } from "@/services/review.service";

async function DashboardData() {
  const [tourStatsRes, bookingStatsRes, reviewsRes] = await Promise.all([
    getMyTourStats(),
    getHostBookingStats(),
    getMyReviews()
  ]);

  const tourStats = tourStatsRes?.data;
  const bookingStats = bookingStatsRes?.data;
  const reviews = reviewsRes?.data || [];

  if (!tourStats || !bookingStats) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 bg-white rounded-3xl border-2 border-dashed border-gray-100">
        <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 font-black text-2xl">!</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load statistics</h2>
        <p className="text-gray-500 text-center max-w-sm">There was an error fetching your dashboard data. Please refresh the page or contact support if the problem persists.</p>
      </div>
    );
  }

  return <HostDashboardContent tourStats={tourStats} bookingStats={bookingStats} reviews={reviews} />;
}

export default function HostDashboardPage() {
  return (
    <div className="p-2 sm:p-0">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />
      </Suspense>
    </div>
  );
}
