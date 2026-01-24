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
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  Calendar,
  MapPin,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  User,
  AlertTriangle,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Clock
} from "lucide-react";
import { getMyReviews, updateReview, deleteReview } from "@/services/review.service";
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
  host?: {
    id: string;
    name: string;
    profilePhoto?: string;
  };
  tour?: {
    id: string;
    title: string;
    destination: string;
  };
}

export default function UserReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ rating: 5, comment: "" });

  const loadReviews = async () => {
    try {
      setLoading(true);
      const result = await getMyReviews();
      if (result.success) setReviews(result.data || []);
    } catch (error) {
      toast.error("Failed to sync feedback ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, []);

  const handleDeleteConfirm = async () => {
    if (!selectedReview) return;
    try {
      const result = await deleteReview(selectedReview.id);
      if (result.success) {
        toast.success("Feedback redacted successfully");
        setIsDeleteDialogOpen(false);
        loadReviews();
      }
    } catch (error) {
      toast.error("Redaction protocol failed");
    }
  };

  const handleUpdate = async () => {
    if (!selectedReview) return;
    try {
      const result = await updateReview(selectedReview.id, editData);
      if (result.success) {
        toast.success("Feedback updated & queued for review");
        setIsEditDialogOpen(false);
        loadReviews();
      }
    } catch (error) {
      toast.error("Update protocol failed");
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setEditData(prev => ({ ...prev, rating: star }))}
            className={cn("focus:outline-none transition-transform active:scale-95", interactive && "hover:scale-110")}
          >
            <Star
              className={cn(
                "w-4 h-4",
                star <= (interactive ? editData.rating : rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"
              )}
            />
          </button>
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

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col gap-2">
          <div className="h-10 w-64 bg-gray-100 animate-pulse rounded-2xl" />
          <div className="h-5 w-96 bg-gray-50 animate-pulse rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-28 bg-gray-50 animate-pulse rounded-[30px]" />)}
        </div>
        <TableSkeleton columnCount={6} rowCount={8} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Feedback Ledger</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#138bc9]" />
            Manage the stories you've shared with the community
          </p>
        </div>
        <Button onClick={loadReviews} variant="outline" className="rounded-2xl border-gray-100 font-bold text-gray-500 gap-2 hover:bg-[#138bc9]/5 hover:text-[#138bc9] transition-all">
          <RefreshCw className="h-4 w-4" />
          Sync Records
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Testimony", value: reviews.length, sub: "Experiences documented", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Verified Posts", value: reviews.filter(r => r.isApproved).length, sub: "Publicly visible", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending Audit", value: reviews.filter(r => !r.isApproved).length, sub: "In verification queue", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white group overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-gray-900 leading-none">{stat.value}</h3>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-2">{stat.sub}</p>
                </div>
                <div className={cn("p-3 rounded-[20px] transition-all duration-300 group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-[30px] border border-gray-100 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-50 text-gray-400">
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 pl-8">Expedition Host</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-5">Score</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-5">Snippet</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-5">Status</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-5">Documented</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest py-5 text-right pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 rounded-[25px] bg-gray-50 flex items-center justify-center text-gray-200">
                      <MessageSquare className="h-8 w-8" />
                    </div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No feedback documented</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id} className="hover:bg-gray-50/30 transition-all duration-300 group border-gray-50">
                  <TableCell className="py-5 pl-8">
                    <div className="max-w-[200px]">
                      <p className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-[#138bc9] transition-colors">{review.tour?.title || "Journey"}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <User className="h-3 w-3" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase truncate">
                          Lead: {review.host?.name || "Member"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      {renderStars(review.rating)}
                      <span className="text-[9px] font-black text-amber-600">{review.rating}.0 SCORE</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs font-medium text-gray-500 line-clamp-2 max-w-[250px] italic">
                      "{review.comment.length > 80 ? review.comment.slice(0, 80) + "..." : review.comment}"
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "rounded-full px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest border-none shadow-none",
                      review.isApproved ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {review.isApproved ? "Public" : "Awaiting"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-black text-gray-800 uppercase tracking-tighter">
                      <Calendar className="h-3 w-3 text-[#138bc9]" />
                      {formatDate(review.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-[#138bc9]/10 hover:text-[#138bc9] transition-all"
                        onClick={() => { setSelectedReview(review); setIsViewDialogOpen(true); }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-[#138bc9]/10 hover:text-[#138bc9] transition-all"
                        onClick={() => {
                          setSelectedReview(review);
                          setEditData({ rating: review.rating, comment: review.comment });
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all text-gray-300"
                        onClick={() => { setSelectedReview(review); setIsDeleteDialogOpen(true); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden">
          {selectedReview && (
            <div className="animate-in zoom-in-95 duration-300">
              <div className="bg-[#138bc9] p-8 text-white">
                <div className="flex items-center gap-2 mb-2 opacity-80">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Traveler Memoir</span>
                </div>
                <h2 className="text-2xl font-black">Feedback Registry</h2>
                <p className="text-blue-100 font-medium text-sm mt-1">Expedition memoirs for {selectedReview.tour?.title}</p>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Lead Guide</Label>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-[#138bc9]">
                        <User className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-black text-gray-900">{selectedReview.host?.name || "Community Member"}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <Label className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Logged Date</Label>
                    <div className="flex items-center justify-end gap-2 h-10">
                      <span className="text-sm font-black text-gray-800">{formatDate(selectedReview.createdAt)}</span>
                      <Calendar className="h-4 w-4 text-[#138bc9]" />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-[30px] border border-gray-100 italic text-gray-700 leading-relaxed font-medium">
                  "{selectedReview.comment}"
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50/30 rounded-2xl">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Memoir Score</p>
                    {renderStars(selectedReview.rating)}
                  </div>
                  <Badge className={cn("rounded-full px-4 h-8 font-black uppercase tracking-widest border-none", selectedReview.isApproved ? "bg-emerald-500 text-white" : "bg-amber-500 text-white")}>
                    {selectedReview.isApproved ? "Verified public" : "Pending audit"}
                  </Badge>
                </div>

                <Button onClick={() => setIsViewDialogOpen(false)} className="w-full h-12 bg-gray-900 hover:bg-black text-white font-black rounded-2xl uppercase tracking-widest text-[10px]">Close Document</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden">
          {selectedReview && (
            <div className="animate-in slide-in-from-bottom-4 duration-300">
              <div className="bg-gray-900 p-8 text-white">
                <h2 className="text-2xl font-black">Edit Memoir</h2>
                <p className="text-gray-400 font-medium text-sm mt-1">Enhance your feedback for the guide</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Expedition Rating</Label>
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    {renderStars(0, true)}
                    <span className="text-xs font-black text-amber-600 uppercase tracking-tighter">{editData.rating}.0 SATISFACTION</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Narrative Description</Label>
                  <Textarea
                    value={editData.comment}
                    onChange={(e) => setEditData(prev => ({ ...prev, comment: e.target.value }))}
                    rows={6}
                    className="rounded-[30px] border-gray-100 bg-gray-50/50 p-6 focus:ring-[#138bc9] font-medium leading-relaxed"
                    placeholder="Describe your journey in detail..."
                  />
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                  <p className="text-[10px] font-bold text-amber-700 leading-normal uppercase">Modifying this ledger will re-initialize the manual verification protocol by our admin team.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="h-14 rounded-2xl font-black uppercase text-[10px] border-gray-100">Abort</Button>
                  <Button onClick={handleUpdate} className="h-14 rounded-2xl bg-[#138bc9] hover:bg-[#138bc9]/90 text-white font-black uppercase text-[10px] shadow-lg shadow-[#138bc9]/20">Update Ledger</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-[40px] border-none shadow-2xl p-0 overflow-hidden">
          <div className="p-10 text-center space-y-6">
            <div className="mx-auto h-20 w-20 rounded-[30px] bg-red-50 flex items-center justify-center text-red-500 mb-2">
              <Trash2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Redact Memoir?</h3>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">This action will permanently purge this feedback from the public registry and expedition guide's record. This cannot be undone.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="h-12 rounded-2xl font-black uppercase text-[10px] border-gray-100">Keep</Button>
              <Button onClick={handleDeleteConfirm} className="h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] shadow-lg shadow-red-200">Purge Record</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}