// components/module/Review/ReviewCard.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Calendar, User } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    tourist?: {
      name: string;
      profilePhoto?: string;
    };
    tour?: {
      title: string;
    };
  };
  showTour?: boolean;
  showStatus?: boolean;
  isApproved?: boolean;
}

export function ReviewCard({ review, showTour = false, showStatus = false, isApproved = true }: ReviewCardProps) {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={review.tourist?.profilePhoto} />
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">
                  {review.tourist?.name || "Anonymous"}
                </h4>
                {showStatus && (
                  <Badge
                    variant={isApproved ? "default" : "outline"}
                    className={isApproved ? "bg-green-500" : ""}
                  >
                    {isApproved ? "Approved" : "Pending"}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {formatDate(review.createdAt)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{review.rating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {showTour && review.tour && (
          <div className="mb-3">
            <Badge variant="secondary" className="mb-2">
              Tour: {review.tour.title}
            </Badge>
          </div>
        )}
        
        <p className="text-gray-700 whitespace-pre-line">{review.comment}</p>
        
        <div className="flex gap-2 mt-4">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}