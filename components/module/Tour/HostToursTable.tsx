"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import UpdateTourModal from "./UpdateTourModal";
import DeleteTourDialog from "./DeleteTourDialog";
import { formatCurrency, formatDate } from "@/lib/date-utils";
import { ITour } from "@/types/tour.interface";
import CompleteTourDialog from "./CompleteTourDialog";
import { completeTour, updateTourStatus } from "@/services/tour/tour.service";
import { cn } from "@/lib/utils";

interface HostToursTableProps {
  tours: ITour[];
}

export function HostToursTable({ tours = [] }: HostToursTableProps) {
  const router = useRouter();
  const [updatingTour, setUpdatingTour] = useState<ITour | null>(null);
  const [deletingTour, setDeletingTour] = useState<ITour | null>(null);
  const [completingTour, setCompletingTour] = useState<ITour | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleView = (tour: ITour) => {
    router.push(`/host/dashboard/tours/${tour.id}`);
  };

  const handleEdit = (tour: ITour) => {
    setUpdatingTour(tour);
  };

  const handleDelete = (tour: ITour) => {
    setDeletingTour(tour);
  };

  const confirmCompleteTour = async (
    tour: ITour,
    option: "complete" | "deactivate"
  ) => {
    if (!tour || tour.isActive === false) return;

    try {
      setIsCompleting(true);

      if (option === "complete") {
        const result = await completeTour(tour.id);
        if (result.success) {
          toast.success(result.message || "Tour marked as completed!");
        } else {
          throw new Error(result.message || "Failed to complete tour");
        }
      } else {
        const result = await updateTourStatus(tour.id, false);
        if (result.success) {
          toast.success("Tour deactivated successfully!");
        } else {
          throw new Error(result.message || "Failed to deactivate tour");
        }
      }

      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to process tour");
    } finally {
      setIsCompleting(false);
      setCompletingTour(null);
    }
  };

  const handleStatusToggle = async (tour: ITour) => {
    if (tour.isActive) {
      setCompletingTour(tour);
    } else {
      try {
        const result = await updateTourStatus(tour.id, true);
        if (result.success) {
          toast.success("Tour activated successfully!");
          router.refresh();
        } else {
          throw new Error(result.message || "Failed to activate tour");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to activate tour");
      }
    }
  };

  const canCompleteTour = (tour: ITour) => {
    if (!tour.isActive) return false;
    return new Date(tour.endDate) <= new Date();
  };

  const isTourActiveAndNotEnded = (tour: ITour) => {
    if (!tour.isActive) return false;
    return new Date(tour.endDate) > new Date();
  };

  if (tours.length === 0) {
    return (
      <Card className="border-none shadow-sm bg-gray-50/50">
        <CardContent className="py-16">
          <div className="text-center space-y-6">
            <div className="mx-auto w-24 h-24 rounded-3xl bg-white shadow-sm flex items-center justify-center border border-gray-100">
              <MapPin className="h-10 w-10 text-gray-300" />
            </div>
            <div className="max-w-xs mx-auto">
              <h3 className="text-xl font-black text-gray-900">No tours yet</h3>
              <p className="text-sm font-medium text-gray-500 mt-2">
                Start by creating your first tour to showcase your expertise and start earning.
              </p>
            </div>
            <Button className="bg-[#138bc9] hover:bg-[#138bc9]/90 text-white font-bold rounded-2xl px-8 h-12 shadow-lg shadow-[#138bc9]/20 transition-all duration-300 hover:scale-105">
              Create Your First Tour
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-50 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-50">
              <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px] py-4">Tour details</TableHead>
              <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px] py-4">Status</TableHead>
              <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px] py-4">Pricing</TableHead>
              <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px] py-4">Engagement</TableHead>
              <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px] py-4">Schedule</TableHead>
              <TableHead className="font-black text-gray-400 uppercase tracking-widest text-[10px] py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours.map((tour) => (
              <TableRow key={tour.id} className="hover:bg-gray-50/50 transition-colors duration-300 group border-gray-50">
                <TableCell className="py-5">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-20 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0">
                      {tour.images && tour.images.length > 0 ? (
                        <Image
                          src={tour.images[0]}
                          alt={tour.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 line-clamp-1 group-hover:text-[#138bc9] transition-colors">
                          {tour.title}
                        </h4>
                        {tour.isFeatured && (
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        <MapPin className="h-3 w-3 text-[#138bc9]" />
                        <span className="truncate">
                          {tour.destination}, {tour.city}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    <Badge
                      className={cn(
                        "w-fit rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest border-none shadow-none",
                        tour.isActive ? "bg-blue-50 text-[#138bc9]" : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {tour.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {isTourActiveAndNotEnded(tour) && (
                      <Badge className="w-fit rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border-none">
                        Ongoing
                      </Badge>
                    )}
                    {canCompleteTour(tour) && (
                      <Badge className="w-fit rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border-none">
                        Ended
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-black text-gray-900">
                    {formatCurrency(tour.price)}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                    {tour.duration} Day{tour.duration > 1 ? 's' : ''} Expedition
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#138bc9]" />
                      <span className="text-[11px] font-black text-gray-700">
                        {tour.currentGroupSize || 0}/{tour.maxGroupSize} Filled
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-purple-500" />
                      <span className="text-[11px] font-black text-gray-700">
                        {tour.views || 0} Views
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-900 uppercase tracking-tighter">
                      <Calendar className="h-3 w-3 text-blue-500" />
                      {formatDate(tour.startDate)}
                    </div>
                    <div className="text-[9px] font-bold text-gray-400 flex items-center gap-1.5 px-4">
                      to {formatDate(tour.endDate)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-[#138bc9]/10 hover:text-[#138bc9] transition-colors duration-300">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl border-gray-100 shadow-xl p-2">
                      <DropdownMenuLabel className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 py-2">Management</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-50" />
                      <DropdownMenuItem onClick={() => handleView(tour)} className="rounded-xl cursor-pointer py-2.5 transition-colors focus:bg-[#138bc9]/10 focus:text-[#138bc9]">
                        <Eye className="h-4 w-4 mr-3" />
                        <span className="text-sm font-bold">Public View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(tour)} className="rounded-xl cursor-pointer py-2.5 transition-colors focus:bg-[#138bc9]/10 focus:text-[#138bc9]">
                        <Edit className="h-4 w-4 mr-3" />
                        <span className="text-sm font-bold">Edit Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-50" />
                      <DropdownMenuItem
                        onClick={() => handleStatusToggle(tour)}
                        disabled={isDeactivating}
                        className={cn(
                          "rounded-xl cursor-pointer py-2.5 transition-colors",
                          tour.isActive
                            ? "focus:bg-red-50 focus:text-red-500"
                            : "focus:bg-[#138bc9]/10 focus:text-[#138bc9]"
                        )}
                      >
                        {tour.isActive ? (
                          <>
                            <XCircle className="h-4 w-4 mr-3" />
                            <span className="text-sm font-bold">Deactivate</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-3" />
                            <span className="text-sm font-bold">Activate</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-50" />
                      <DropdownMenuItem
                        onClick={() => handleDelete(tour)}
                        className="rounded-xl cursor-pointer py-2.5 text-red-500 focus:bg-red-50 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-3" />
                        <span className="text-sm font-bold">Delete permanently</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {updatingTour && (
        <UpdateTourModal
          tour={updatingTour}
          open={!!updatingTour}
          onClose={() => {
            setUpdatingTour(null);
            router.refresh();
          }}
        />
      )}

      {deletingTour && (
        <DeleteTourDialog
          tour={deletingTour}
          open={!!deletingTour}
          onClose={() => {
            setDeletingTour(null);
            router.refresh();
          }}
        />
      )}

      {completingTour && (
        <CompleteTourDialog
          tour={completingTour}
          open={!!completingTour}
          onClose={() => setCompletingTour(null)}
          onConfirm={(option) => confirmCompleteTour(completingTour, option)}
          isCompleting={isCompleting}
        />
      )}
    </>
  );
}
