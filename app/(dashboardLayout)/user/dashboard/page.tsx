import { Suspense } from "react";
import { getMyBookingStats } from "@/services/booking.service";
import UserDashboardContent from "@/components/module/Dashboard/UserDashboardContent";
import { DashboardSkeleton } from "@/components/shared/DashboardSkeleton";
import { getMyReviews } from "@/services/review.service";

async function DashboardData() {
  const [bookingStatsRes, reviewsRes] = await Promise.all([
    getMyBookingStats(),
    getMyReviews()
  ]);

  const bookingStats = bookingStatsRes?.data;
  const reviews = reviewsRes?.data || [];

  if (!bookingStats) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 bg-white rounded-[40px] border-2 border-dashed border-gray-100 animate-in fade-in duration-700">
        <div className="h-20 w-20 rounded-[30px] bg-red-50 flex items-center justify-center text-red-500 mb-6 font-black text-2xl shadow-sm italic transition-transform hover:scale-110">!</div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Sync Interrupted</h2>
        <p className="text-gray-400 font-bold uppercase text-xs tracking-widest text-center max-w-xs">We encountered an issue while retrieving your expedition data. Please refresh the protocol.</p>
      </div>
    );
  }

  return <UserDashboardContent bookingStats={bookingStats} reviews={reviews} />;
}

export default function UserDashboardPage() {
  return (
    <div className="p-2 sm:p-0">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />
      </Suspense>
    </div>
  );
}
