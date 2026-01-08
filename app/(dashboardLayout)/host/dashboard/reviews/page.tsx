/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Filter,
  Star,
  User,
  Calendar,
  MapPin,
  Eye,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import { getHostReviews, getReviewStats } from "@/services/review.service";
import { toast } from "sonner";
import { format } from "date-fns";

interface Review {
  id: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  tourist?: {
    id: string;
    name: string;
    profilePhoto?: string;
  };
  tour?: {
    id: string;
    title: string;
    destination: string;
  };
  booking?: {
    bookingDate: string;
  };
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recentReviews: any[];
}

export default function HostReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    minRating: "",
    maxRating: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });
  const [meta, setMeta] = useState({
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 10,
  });
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // In a real app, you'd get this from auth context or session
  const hostId = "current-host-id"; // Replace with actual host ID from auth

  const loadReviews = async () => {
    try {
      setLoading(true);
      const params: any = {
        ...filters,
        minRating: filters.minRating || undefined,
        maxRating: filters.maxRating || undefined,
      };

      const result = await getHostReviews(hostId, params);

      if (result.success) {
        setReviews(result.data || []);
        if (result.meta) {
          setMeta(result.meta);
        }
      } else {
        toast.error("Failed to load reviews", {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("Error loading reviews");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await getReviewStats(hostId, undefined);
      if (result.success) {
        setStats(result.data || null);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [filters]);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleView = (review: Review) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}.0</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Host Reviews</h1>
        <p className="text-muted-foreground mt-2">
          Reviews received from tourists about your tours
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</div>
                <div className="flex items-center mt-2">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Average Rating</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl font-bold">{stats.totalReviews}</div>
                <p className="text-sm text-muted-foreground mt-2">Total Reviews</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl font-bold">
                  {stats.ratingDistribution[5] + stats.ratingDistribution[4]}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Positive Reviews (4-5 stars)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl font-bold">{stats.ratingDistribution[1]}</div>
                <p className="text-sm text-muted-foreground mt-2">Critical Reviews (1 star)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {/* <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by comment or tourist name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select
                value={filters.minRating}
                onValueChange={(value) =>
                  setFilters(prev => ({ ...prev, minRating: value, page: 1 }))
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Min Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Rating</SelectItem>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating}+ Stars
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleSearch}>
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Reviews ({meta.total})</CardTitle>
          <CardDescription>
            Showing {reviews.length} of {meta.total} reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tourist</TableHead>
                <TableHead>Tour</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No reviews found
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{review.tourist?.name || "Unknown"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium line-clamp-1">
                          {review.tour?.title || "Unknown Tour"}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {review.tour?.destination || "Unknown"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell>
                      <div className="max-w-[300px]">
                        <p className="line-clamp-2">
                          {review.comment}
                        </p>
                        {review.comment.length > 100 && (
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={() => handleView(review)}
                          >
                            Read more
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(review.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(review)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                      className={
                        filters.page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                    let pageNum;
                    if (meta.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (filters.page <= 3) {
                      pageNum = i + 1;
                    } else if (filters.page >= meta.totalPages - 2) {
                      pageNum = meta.totalPages - 4 + i;
                    } else {
                      pageNum = filters.page - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={filters.page === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(meta.totalPages, filters.page + 1))}
                      className={
                        filters.page === meta.totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Complete review from tourist
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Tourist</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedReview.tourist?.name || "Unknown"}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tour</Label>
                  <p className="font-medium mt-2">{selectedReview.tour?.title || "Unknown"}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedReview.tour?.destination}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Rating</Label>
                <div className="mt-2">{renderStars(selectedReview.rating)}</div>
              </div>

              <div>
                <Label className="text-muted-foreground">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Comment
                </Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedReview.comment}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Booking Date</Label>
                  <p className="font-medium mt-2">
                    {selectedReview.booking?.bookingDate
                      ? formatDate(selectedReview.booking.bookingDate)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Review Date</Label>
                  <p className="font-medium mt-2">{formatDate(selectedReview.createdAt)}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}