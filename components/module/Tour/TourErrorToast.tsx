"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner"; // or react-hot-toast

export default function TourErrorToast() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "inactive") {
      toast.error("This tour is not active right now.");
    }

    if (error === "expired") {
      toast.error("This tour date has already expired.");
    }
  }, [error]);

  return null;
}
