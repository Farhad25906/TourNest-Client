/* eslint-disable @typescript-eslint/no-explicit-any */
// app/tours/[id]/reviews/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, Filter, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getTourReviews } from "@/services/review.service";
import { getSingleTour } from "@/services/tour/tour.service";
// import { getSingleBooking } from "@/services/booking.service";

import { ReviewCard } from "@/components/module/Review/ReviewCard";
import { ReviewStats } from "@/components/module/Review/ReviewStats";

export default function TourReviewsPage() {
  const params = useParams();
  const tourId = params?.id as string;
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [tourDetails, setTourDetails] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minRating: "",
    maxRating: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (!tourId) return;

      try {
        setLoading(true);
        
        // Fetch tour details
        const tourResponse = await getSingleTour(tourId);
        if (tourResponse.success) {
          setTourDetails(tourResponse.data);
        }

        // Fetch reviews with filters
        const reviewResponse = await getTourReviews(tourId);
        if (reviewResponse.success) {
          setReviews(reviewResponse.data?.reviews || []);
          setStats(reviewResponse.data?.summary);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tourId, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/tours/${tourId}`}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Tour
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Reviews for {tourDetails?.title}
        </h1>
        <p className="text-muted-foreground mt-2">
          See what other travelers have to say about this tour
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats & Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Review Statistics */}
          {stats && <ReviewStats stats={stats} />}

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter Reviews
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Minimum Rating
                      </label>
                      <Select
                        value={filters.minRating}
                        onValueChange={(value) => handleFilterChange("minRating", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any rating</SelectItem>
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <SelectItem key={rating} value={rating.toString()}>
                              {rating} stars & above
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Sort By
                      </label>
                      <Select
                        value={filters.sortBy}
                        onValueChange={(value) => handleFilterChange("sortBy", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="createdAt">Most Recent</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Order
                      </label>
                      <Select
                        value={filters.sortOrder}
                        onValueChange={(value) => handleFilterChange("sortOrder", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Order" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desc">Descending</SelectItem>
                          <SelectItem value="asc">Ascending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setFilters({
                      minRating: "",
                      maxRating: "",
                      sortBy: "createdAt",
                      sortOrder: "desc",
                      page: 1,
                      limit: 10,
                    });
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Reviews */}
        <div className="lg:col-span-2">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search reviews..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Star className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold">No reviews yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Be the first to review this tour!
                  </p>
                </CardContent>
              </Card>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>

          {/* Pagination */}
          {reviews.length > 0 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filters.page === 1}
                  onClick={() => handleFilterChange("page", (filters.page - 1).toString())}
                >
                  Previous
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={reviews.length < filters.limit}
                  onClick={() => handleFilterChange("page", (filters.page + 1).toString())}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}