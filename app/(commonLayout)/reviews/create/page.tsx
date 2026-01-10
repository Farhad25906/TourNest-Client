"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Star, Loader2, Calendar, Users, MapPin } from "lucide-react";
import Link from "next/link";
import { createReview } from "@/services/review.service";
import { toast } from "sonner";
import { getSingleBooking } from "@/services/booking.service";
import { getSingleTour } from "@/services/tour/tour.service";

// Create a component that uses useSearchParams
function CreateReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [tourDetails, setTourDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const bookingId = searchParams.get("bookingId") as string;
  const tourId = searchParams.get("tourId") as string;

  useEffect(() => {
    async function fetchData() {
      if (!bookingId || !tourId) {
        setError("Missing required parameters");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch booking and tour details
        const bookingResponse = await getSingleBooking(bookingId);
        const tourResponse = await getSingleTour(tourId);

        if (!bookingResponse.success || !bookingResponse.data) {
          setError("Failed to load booking details");
          return;
        }

        if (!tourResponse.success || !tourResponse.data) {
          setError("Failed to load tour details");
          return;
        }

        const booking = bookingResponse.data;
        const tour = tourResponse.data;

        // Check if booking is completed
        if (booking.status !== "COMPLETED") {
          setError("You can only review completed tours");
          return;
        }

        // Check if booking belongs to current user (you might want to add this check)
        // Check if review already exists
        if (booking.isReviewed) {
          setError("You have already reviewed this booking");
          return;
        }

        setBookingDetails(booking);
        setTourDetails(tour);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load booking and tour information");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [bookingId, tourId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingId || !tourId) {
      toast.error("Missing required information");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please provide a comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        bookingId,
        rating,
        comment: comment.trim(),
      };

      const result = await createReview(reviewData);

      if (result.success) {
        toast.success("Review submitted successfully!", {
          description: "Thank you for your feedback!",
        });
        
        // Redirect to booking details or tour page
        router.push(`/bookings/${bookingId}`);
      } else {
        toast.error("Failed to submit review", {
          description: result.message,
        });
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error("Something went wrong", {
        description: error.message || "Failed to submit review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/bookings">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Bookings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href={`/bookings/${bookingId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Booking
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Write a Review</h1>
          <p className="text-muted-foreground mt-2">
            Share your experience to help other travelers
          </p>
        </div>

        {/* Tour & Booking Info */}
        {tourDetails && bookingDetails && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Tour Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{tourDetails.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {tourDetails.destination}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(tourDetails.startDate)} - {formatDate(tourDetails.endDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {bookingDetails.numberOfPeople} people
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Booking Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Booking Date</p>
                      <p className="font-medium">{formatDate(bookingDetails.bookingDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Booking ID</p>
                      <p className="font-medium">#{bookingId.slice(0, 8)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Review</CardTitle>
            <CardDescription>
              Rate your experience and share your thoughts with the host
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div className="space-y-3">
                <Label htmlFor="rating">Overall Rating</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="p-1 focus:outline-none"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-lg font-medium">
                    {rating}.0 out of 5
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Click on the stars to select your rating
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-3">
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  placeholder="Share details of your experience with this tour and host..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={6}
                  className="resize-none"
                  required
                />
                <div className="text-sm text-muted-foreground">
                  Be honest and specific about what you liked or didn't like
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">
                  Review Guidelines
                </h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Be honest and specific about your experience</li>
                  <li>Focus on the tour content, guide, and overall experience</li>
                  <li>Avoid personal attacks or offensive language</li>
                  <li>Your review will be visible to other travelers</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  asChild
                  disabled={isSubmitting}
                >
                  <Link href={`/bookings/${bookingId}`}>Cancel</Link>
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting || !comment.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main component with Suspense
export default function CreateReviewPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </div>
      </div>
    }>
      <CreateReviewContent />
    </Suspense>
  );
}

// Make this page dynamic to avoid static generation issues
export const dynamic = 'force-dynamic';