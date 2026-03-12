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
import { MapPin, Calendar, Users, Star, Clock, Heart, CalendarCheck } from "lucide-react";
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
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateAvailableSpots = () => {
    return tour.maxGroupSize - (tour.currentGroupSize || 0);
  };

  const availableSpots = calculateAvailableSpots();
  const isAvailable = tour.isActive && availableSpots > 0;

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        {tour.images?.length > 0 ? (
          <Image
            src={tour.images[0]}
            alt={tour.title}
            fill
            className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-slate-300">image</span>
          </div>
        )}

        {tour.currentGroupSize > 10 && (
          <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary">
            MOST POPULAR
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-2 line-clamp-1">{tour.title}</h3>

        <div className="flex items-center gap-4 mb-4 text-slate-500 dark:text-slate-400 text-sm">
          <div className="flex items-center gap-1">
            <CalendarCheck />
            <span>{tour.duration} Days</span>
          </div>
          <div className="flex items-center gap-1">
            <Users />
            <span>Max {tour.maxGroupSize}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">From</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(tour.price)}</span>
          </div>
          <Button asChild className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity h-auto">
            <Link href={`/tours/${tour.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
