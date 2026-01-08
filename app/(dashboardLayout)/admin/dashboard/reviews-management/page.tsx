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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Filter,
  MoreHorizontal,
  Star,
  User,
  Calendar,
  MapPin,
  Eye,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  RefreshCw,
} from "lucide-react";
import {
  getAllReviews,
  deleteReview,
  approveReview,
  updateReview,
} from "@/services/review.service";
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
  host?: {
    id: string;
    name: string;
    profilePhoto?: string;
  };
  tour?: {
    id: string;
    title: string;
    destination: string;
    images?: string[];
  };
  booking?: {
    id: string;
    bookingDate: string;
    numberOfPeople: number;
    totalAmount: number;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    rating: "",
    isApproved: "",
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    rating: 5,
    comment: "",
    isApproved: true,
  });

  const loadReviews = async () => {
    try {
      setLoading(true);
      const params: any = {
        ...filters,
        searchTerm: searchTerm || undefined,
        rating: filters.rating || undefined,
        isApproved: filters.isApproved || undefined,
      };

      const result = await getAllReviews(params);

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

  useEffect(() => {
    loadReviews();
  }, [filters]);

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleApprove = async (reviewId: string, approve: boolean) => {
    try {
      const result = await approveReview(reviewId, approve);
      if (result.success) {
        toast.success(
          `Review ${approve ? "approved" : "unapproved"} successfully`
        );
        loadReviews();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update review status");
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const result = await deleteReview(reviewId);
      if (result.success) {
        toast.success("Review deleted successfully");
        loadReviews();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setEditData({
      rating: review.rating,
      comment: review.comment,
      isApproved: review.isApproved,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedReview) return;

    try {
      const result = await updateReview(selectedReview.id, editData);
      if (result.success) {
        toast.success("Review updated successfully");
        setIsEditDialogOpen(false);
        loadReviews();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update review");
    }
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
        <h1 className="text-3xl font-bold tracking-tight">
          Reviews Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage all reviews from tourists and hosts
        </p>
      </div>

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
                value={filters.rating}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, rating: value, page: 1 }))
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Ratings</SelectItem>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} Star{rating > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.isApproved}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    isApproved: value,
                    page: 1,
                  }))
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="true">Approved</SelectItem>
                  <SelectItem value="false">Pending</SelectItem>
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
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
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
                          <p className="font-medium">
                            {review.tourist?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Tourist
                          </p>
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
                      <p className="line-clamp-2 max-w-[300px]">
                        {review.comment}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={review.isApproved ? "default" : "secondary"}
                        className={
                          review.isApproved
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        }
                      >
                        {review.isApproved ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approved
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Pending
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(review.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleView(review)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(review)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {!review.isApproved && (
                            <DropdownMenuItem
                              onClick={() => handleApprove(review.id, true)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                          )}
                          {review.isApproved && (
                            <DropdownMenuItem
                              onClick={() => handleApprove(review.id, false)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Unapprove
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(review.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                      onClick={() =>
                        handlePageChange(Math.max(1, filters.page - 1))
                      }
                      className={
                        filters.page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from(
                    { length: Math.min(5, meta.totalPages) },
                    (_, i) => {
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
                    }
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(
                          Math.min(meta.totalPages, filters.page + 1)
                        )
                      }
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
              Complete information about this review
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Tourist</Label>
                  <p className="font-medium">
                    {selectedReview.tourist?.name || "Unknown"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Host</Label>
                  <p className="font-medium">
                    {selectedReview.host?.name || "Unknown"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tour</Label>
                  <p className="font-medium">
                    {selectedReview.tour?.title || "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedReview.tour?.destination}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Booking Date</Label>
                  <p className="font-medium">
                    {selectedReview.booking?.bookingDate
                      ? formatDate(selectedReview.booking.bookingDate)
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Rating</Label>
                <div className="mt-2">{renderStars(selectedReview.rating)}</div>
              </div>

              <div>
                <Label className="text-muted-foreground">Comment</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-wrap">
                    {selectedReview.comment}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge
                    variant={
                      selectedReview.isApproved ? "default" : "secondary"
                    }
                    className={
                      selectedReview.isApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {selectedReview.isApproved ? "Approved" : "Pending"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created Date</Label>
                  <p className="font-medium">
                    {formatDate(selectedReview.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>Update review details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setEditData((prev) => ({ ...prev, rating: star }))
                    }
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= editData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-medium">
                  {editData.rating}.0 out of 5
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={editData.comment}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, comment: e.target.value }))
                }
                rows={4}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="isApproved">Status</Label>
              <Select
                value={editData.isApproved.toString()}
                onValueChange={(value) =>
                  setEditData((prev) => ({
                    ...prev,
                    isApproved: value === "true",
                  }))
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Approved</SelectItem>
                  <SelectItem value="false">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
