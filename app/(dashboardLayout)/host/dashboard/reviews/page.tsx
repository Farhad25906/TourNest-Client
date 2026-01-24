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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Star,
  User,
  Calendar,
  MapPin,
  Eye,
  RefreshCw,
  MessageSquare,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { getHostReviews, getReviewStats } from "@/services/review.service";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

interface Review {
  id: string;
  rating: number;
  comment: string;
  isApproved: boolean;
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
}

export default function HostReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // In a real app, you'd get this from auth context or session
  const hostId = ""; // Service should handle current user if empty

  const loadData = async () => {
    try {
      setLoading(true);
      const [reviewsRes, statsRes] = await Promise.all([
        getHostReviews(hostId),
        getReviewStats(hostId)
      ]);

      if (reviewsRes.success) setReviews(reviewsRes.data || []);
      if (statsRes.success) setStats(statsRes.data || null);

    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("Failed to synchronize reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-3 h-3",
              star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
            )}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "N/A";
    }
  };

  const calculateStats = () => {
    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }
    const total = reviews.length;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
    const dist = {
      1: reviews.filter((r) => r.rating === 1).length,
      2: reviews.filter((r) => r.rating === 2).length,
      3: reviews.filter((r) => r.rating === 3).length,
      4: reviews.filter((r) => r.rating === 4).length,
      5: reviews.filter((r) => r.rating === 5).length,
    };
    return { totalReviews: total, averageRating: avg, ratingDistribution: dist };
  };

  const displayStats = stats || calculateStats();

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col gap-2">
          <div className="h-10 w-64 bg-gray-100 animate-pulse rounded-2xl" />
          <div className="h-5 w-96 bg-gray-50 animate-pulse rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-50 animate-pulse rounded-[30px]" />)}
        </div>
        <TableSkeleton columnCount={6} rowCount={8} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Guest Feedback</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#138bc9]" />
            What travelers are saying about your expeditions
          </p>
        </div>
        <Button onClick={loadData} variant="outline" className="rounded-2xl border-gray-100 font-bold text-gray-500 gap-2 hover:bg-[#138bc9]/5 hover:text-[#138bc9] transition-all">
          <RefreshCw className="h-4 w-4" />
          Sync Reviews
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Overall Rating", value: displayStats.averageRating.toFixed(1), icon: Star, color: "text-amber-500", bgColor: "bg-amber-50", sub: "Out of 5 stars" },
          { label: "Total Reviews", value: displayStats.totalReviews, icon: MessageSquare, color: "text-blue-500", bgColor: "bg-blue-50", sub: "Growth in feedback" },
          { label: "Satisfied Guests", value: (displayStats.ratingDistribution?.[5] || 0) + (displayStats.ratingDistribution?.[4] || 0), icon: CheckCircle2, color: "text-emerald-500", bgColor: "bg-emerald-50", sub: "4-5 star reviews" },
          { label: "Needs Attention", value: displayStats.ratingDistribution?.[1] || 0, icon: AlertCircle, color: "text-rose-500", bgColor: "bg-rose-50", sub: "1 star responses" }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden group">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-gray-900 leading-none">{stat.value}</h3>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-2">{stat.sub}</p>
                </div>
                <div className={cn("p-3 rounded-[20px] transition-all duration-300 group-hover:scale-110", stat.bgColor, stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Distribution Chart */}
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-black text-gray-800">Distrubution</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-gray-400">Score segmentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = displayStats.ratingDistribution?.[rating as keyof typeof displayStats.ratingDistribution] || 0;
                const percentage = displayStats.totalReviews > 0 ? (count / displayStats.totalReviews) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center gap-4 group">
                    <div className="flex items-center gap-1.5 w-16 shrink-0">
                      <span className="text-xs font-black text-gray-900">{rating}</span>
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2.5 bg-gray-50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-1000 group-hover:brightness-110"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-10 text-right">
                      <span className="text-[10px] font-black text-gray-400">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* List Table */}
        <div className="lg:col-span-2">
          <div className="rounded-[30px] border border-gray-50 overflow-hidden bg-white shadow-sm h-full">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="hover:bg-transparent border-gray-50 text-gray-400">
                  <TableHead className="font-black text-[10px] uppercase tracking-widest py-4">Traveler</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest py-4">Tour</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 text-center">Score</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest py-4">Feedback Snippet</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest py-4 text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20">
                      <div className="flex flex-col items-center gap-2">
                        <MessageSquare className="h-10 w-10 text-gray-200" />
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No reviews synchronized</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review) => (
                    <TableRow key={review.id} className="hover:bg-gray-50/50 transition-all duration-300 group border-gray-50">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-50">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                          <p className="font-bold text-gray-900 text-sm truncate max-w-[100px]">
                            {review.tourist?.name || "Member"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[140px]">
                          <p className="font-bold text-gray-700 text-xs line-clamp-1 group-hover:text-[#138bc9] transition-colors">{review.tour?.title || "Unknown"}</p>
                          <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">
                            <MapPin className="w-2.5 h-2.5 text-[#138bc9]" />
                            {review.tour?.destination || "Global"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          {renderStars(review.rating)}
                          <span className="text-[10px] font-black text-amber-600">{review.rating}.0</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-medium text-gray-500 line-clamp-2 italic max-w-[200px]">
                          "{review.comment}"
                        </p>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl hover:bg-[#138bc9]/10 hover:text-[#138bc9] transition-all"
                          onClick={() => { setSelectedReview(review); setIsViewDialogOpen(true); }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden">
          {selectedReview && (
            <div className="animate-in zoom-in-95 duration-300">
              <div className="bg-[#138bc9] p-8 text-white">
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2 opacity-80">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Traveler Insight</span>
                  </div>
                  <DialogTitle className="text-2xl font-black leading-tight">Expedition Feedback</DialogTitle>
                  <DialogDescription className="text-blue-100 font-medium">
                    Complete details regarding the review submitted on {formatDate(selectedReview.createdAt)}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-8 font-bold">
                  <div className="space-y-2">
                    <Label className="text-[10px] text-gray-400 uppercase tracking-widest">Expedition Guest</Label>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-[#138bc9]">
                        <User className="h-5 w-5" />
                      </div>
                      <p className="text-gray-900 border-b-2 border-gray-50 pb-1">{selectedReview.tourist?.name || "Anonymous Traveler"}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] text-gray-400 uppercase tracking-widest">Expedition Date</Label>
                    <div className="flex items-center gap-3 h-10">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <p className="text-gray-900">{formatDate(selectedReview.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                    <div>
                      <Label className="text-[10px] text-gray-400 uppercase tracking-widest">Satisfaction Score</Label>
                      <div className="mt-1">{renderStars(selectedReview.rating)}</div>
                    </div>
                    <Badge className={cn(
                      "rounded-full px-4 h-8 font-black uppercase tracking-widest border-none shadow-sm",
                      selectedReview.rating >= 4 ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                    )}>
                      {selectedReview.rating}.0 Rating
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare className="h-3 w-3" />
                      Full Commentary
                    </Label>
                    <div className="p-6 bg-blue-50/30 border border-blue-50 rounded-[30px] italic text-gray-700 leading-relaxed font-medium">
                      "{selectedReview.comment}"
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#138bc9]" />
                    <span className="text-xs font-black text-gray-800 uppercase tracking-tighter">
                      {selectedReview.tour?.title}
                    </span>
                  </div>
                  <Badge variant="outline" className="rounded-full border-gray-200 text-gray-400 font-bold text-[10px] uppercase">
                    Expedition ID: {selectedReview.id.slice(0, 6)}
                  </Badge>
                </div>

                <Button
                  onClick={() => setIsViewDialogOpen(false)}
                  className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-black rounded-2xl uppercase tracking-widest text-xs transition-all shadow-xl"
                >
                  Dismiss Overlay
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
