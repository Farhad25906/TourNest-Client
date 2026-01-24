// app/host/dashboard/bookings/page.tsx
import { Suspense } from "react";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import HostBookingsClient from "@/components/module/Booking/HostBookingsClient";


// This is the default export that Next.js expects
export default async function HostBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await the searchParams Promise
  const params = await searchParams;

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<TableSkeleton columnCount={7} rowCount={10} />}>
        <HostBookingsClient searchParams={params} />
      </Suspense>
    </div>
  );
}