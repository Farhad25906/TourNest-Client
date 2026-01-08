// // app/user/dashboard/bookings/[id]/page.tsx
// import { Suspense } from "react";
// import { notFound, redirect } from "next/navigation";
// import { getSingleBooking } from "@/services/booking.service";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import BookingDetailsContent from "./BookingDetailsContent";
// import { CardSkeleton } from "@/components/shared";

// async function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
//   const session = await getServerSession(authOptions);
  
//   if (!session?.user?.email) {
//     redirect("/auth/signin");
//   }

//   const { id } = await params;
  
//   return (
//     <Suspense fallback={<CardSkeleton />}>
//       <BookingDetailsContent bookingId={id} />
//     </Suspense>
//   );
// }

// async function BookingDetailsContent({ bookingId }: { bookingId: string }) {
//   const bookingResponse = await getSingleBooking(bookingId);
  
//   if (!bookingResponse.success || !bookingResponse.data) {
//     notFound();
//   }

//   const booking = bookingResponse.data;

//   return (
//     <div className="container mx-auto py-6">
//       <BookingDetails booking={booking} />
//     </div>
//   );
// }

// export default BookingDetailsPage;

import React from 'react';

const page = () => {
  return (
    <div>
      Hello
    </div>
  );
};

export default page;