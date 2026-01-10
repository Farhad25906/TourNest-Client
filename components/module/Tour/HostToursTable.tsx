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
  Copy,
  CheckCircle,
  XCircle,
  CheckCheck,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import UpdateTourModal from "./UpdateTourModal";
import DeleteTourDialog from "./DeleteTourDialog";
import { formatCurrency, formatDate } from "@/lib/date-utils";
import { ITour } from "@/types/tour.interface";
import CompleteTourDialog from "./CompleteTourDialog";
import { completeTour, updateTourStatus } from "@/services/tour/tour.service"; // Add updateTourStatus

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

  // Handle Deactivate button click
  const handleDeactivate = (tour: ITour) => {
    setCompletingTour(tour);
  };

  const confirmCompleteTour = async (
    tour: ITour,
    option: "complete" | "deactivate"
  ) => {
    if (!tour || tour.isActive === false) return;

    try {
      setIsCompleting(true);

      if (option === "complete") {
        // Complete tour with booking updates
        const result = await completeTour(tour.id);
        if (result.success) {
          toast.success(
            result.message || "Tour marked as completed! All bookings updated."
          );
        } else {
          throw new Error(result.message || "Failed to complete tour");
        }
      } else {
        // Just deactivate without updating bookings
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
      console.error(error);
    } finally {
      setIsCompleting(false);
      setCompletingTour(null);
    }
  };

  // Simple deactivate without updating bookings
  const handleSimpleDeactivate = async (tour: ITour) => {
    try {
      setIsDeactivating(true);
      const result = await updateTourStatus(tour.id, false);

      if (result.success) {
        toast.success("Tour deactivated successfully!");
        router.refresh();
      } else {
        throw new Error(result.message || "Failed to deactivate tour");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to deactivate tour");
      console.error(error);
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleDuplicate = async (tour: ITour) => {
    try {
      const response = await fetch(`/api/host/tours/${tour.id}/duplicate`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Tour duplicated successfully!");
        router.refresh();
      } else {
        throw new Error("Failed to duplicate tour");
      }
    } catch (error) {
      toast.error("Failed to duplicate tour");
      console.error(error);
    }
  };

  const handleStatusToggle = async (tour: ITour) => {
    if (tour.isActive) {
      // For active tours, show the complete dialog when clicking "Deactivate"
      setCompletingTour(tour);
    } else {
      // For inactive tours, just activate normally
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
        console.error(error);
      }
    }
  };

  const handleFeaturedToggle = async (tour: ITour) => {
    try {
      const response = await fetch(`/api/host/tours/${tour.id}/featured`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFeatured: !tour.isFeatured }),
      });

      if (response.ok) {
        toast.success(
          `Tour ${
            !tour.isFeatured ? "marked as featured" : "removed from featured"
          }!`
        );
        router.refresh();
      } else {
        throw new Error("Failed to update featured status");
      }
    } catch (error) {
      toast.error("Failed to update featured status");
      console.error(error);
    }
  };

  // Check if a tour can be completed (tour has ended)
  const canCompleteTour = (tour: ITour) => {
    if (!tour.isActive) return false;
    const tourEndDate = new Date(tour.endDate);
    const currentDate = new Date();
    return tourEndDate <= currentDate;
  };

  // Check if tour hasn't ended yet
  const isTourActiveAndNotEnded = (tour: ITour) => {
    if (!tour.isActive) return false;
    const tourEndDate = new Date(tour.endDate);
    const currentDate = new Date();
    return tourEndDate > currentDate;
  };

  if (tours.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No tours yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Start by creating your first tour to showcase your expertise
              </p>
            </div>
            <Button>Create Your First Tour</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Tour</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-24 rounded-md overflow-hidden">
                      {tour.images && tour.images.length > 0 ? (
                        <Image
                          src={tour.images[0]}
                          alt={tour.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium line-clamp-1">
                          {tour.title}
                        </h4>
                        {tour.isFeatured && (
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">
                          {tour.destination}, {tour.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{tour.category}</Badge>
                        <Badge variant="outline">{tour.difficulty}</Badge>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge
                      variant={tour.isActive ? "default" : "secondary"}
                      className="w-fit"
                    >
                      {tour.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {tour.isFeatured && (
                      <Badge variant="outline" className="w-fit">
                        Featured
                      </Badge>
                    )}
                    {canCompleteTour(tour) && (
                      <Badge
                        variant="outline"
                        className="w-fit bg-amber-50 text-amber-700 border-amber-200"
                      >
                        Ready to Complete
                      </Badge>
                    )}
                    {isTourActiveAndNotEnded(tour) && (
                      <Badge
                        variant="outline"
                        className="w-fit bg-blue-50 text-blue-700 border-blue-200"
                      >
                        Ongoing
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {formatCurrency(tour.price)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tour.duration} days
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {tour.currentGroupSize || 0}/{tour.maxGroupSize}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tour.bookingCount || 0} bookings
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{tour.views || 0}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(tour.startDate)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      to {formatDate(tour.endDate)}
                    </div>
                    {canCompleteTour(tour) && (
                      <div className="text-xs text-amber-600 mt-1">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        Tour has ended
                      </div>
                    )}
                    {isTourActiveAndNotEnded(tour) && (
                      <div className="text-xs text-blue-600 mt-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Still ongoing
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleView(tour)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Public Page
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(tour)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Tour
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem onClick={() => handleDuplicate(tour)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem> */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusToggle(tour)}
                        disabled={isDeactivating}
                      >
                        {tour.isActive ? (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem onClick={() => handleFeaturedToggle(tour)}>
                        <Star className="h-4 w-4 mr-2" />
                        {tour.isFeatured ? "Remove Featured" : "Mark as Featured"}
                      </DropdownMenuItem> */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(tour)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Tour
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
