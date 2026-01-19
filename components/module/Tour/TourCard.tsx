"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ITour } from "@/types/tour.interface";
import { MapPin, Calendar, Users, Star, Clock, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/date-utils";
import { toast } from "sonner";

interface TourCardProps {
  tour: ITour;
}

export function TourCard({ tour }: TourCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculateAvailableSpots = () => {
    return tour.maxGroupSize - (tour.currentGroupSize || 0);
  };

  const availableSpots = calculateAvailableSpots();
  const isAvailable = tour.isActive && availableSpots > 0;

  const handleFavoriteToggle = async () => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      setIsFavorite(!isFavorite);

      toast.success(
        isFavorite ? "Removed from favorites" : "Added to favorites",
        {
          description: isFavorite
            ? `${tour.title} removed from your favorites`
            : `${tour.title} added to your favorites`,
        },
      );
    } catch (error) {
      toast.error("Failed to update favorites", {
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickBook = () => {
    if (!isAvailable) {
      toast.error("Cannot book this tour", {
        description: "This tour is fully booked or unavailable",
      });
      return;
    }

    toast.info("Redirecting to booking", {
      description: `Starting booking process for ${tour.title}`,
    });
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Tour Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {tour.images?.length > 0 ? (
          <Image
            src={tour.images[0]}
            alt={tour.title}
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <MapPin className="h-12 w-12 text-primary/30" />
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {tour.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">
                {tour.destination}, {tour.city}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {tour.description}
        </p>

        {/* Tour Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Dates</div>
              <div className="font-medium">{formatDate(tour.startDate)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Duration</div>
              <div className="font-medium">{tour.duration} days</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Group Size</div>
              <div className="font-medium">{tour.maxGroupSize} max</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 flex items-center justify-center text-muted-foreground">
              $
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Price</div>
              <div className="font-medium">{formatCurrency(tour.price)}</div>
            </div>
          </div>
        </div>

        {/* Difficulty */}
        <div className="mt-4">
          <Badge
            variant="outline"
            className={`
              ${tour.difficulty === "EASY" ? "border-green-200 text-green-700 bg-green-50" : ""}
              ${tour.difficulty === "MODERATE" ? "border-amber-200 text-amber-700 bg-amber-50" : ""}
              ${tour.difficulty === "DIFFICULT" ? "border-orange-200 text-orange-700 bg-orange-50" : ""}
              ${tour.difficulty === "EXTREME" ? "border-red-200 text-red-700 bg-red-50" : ""}
            `}
          >
            {tour.difficulty}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t">
        <div className="flex gap-2 w-full">
          <Button variant="outline" className="flex-1" asChild>
            <Link href={`/tours/${tour.id}`}>View Details</Link>
          </Button>

          <Button
            className="flex-1"
            disabled={!isAvailable}
            onClick={handleQuickBook}
            asChild
          >
            <Link href={`/tours/${tour.id}/book`}>Book Now</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
