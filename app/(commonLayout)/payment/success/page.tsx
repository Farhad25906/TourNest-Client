// app/(commonLayout)/payment/success/page.tsx
"use client";

import { Suspense } from "react";
import PaymentSuccessContent from "@/components/module/Payment/PaymentSuccessContent";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

// Make this page dynamic
export const dynamic = 'force-dynamic';