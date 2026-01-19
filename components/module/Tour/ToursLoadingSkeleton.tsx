import { Card, CardContent } from "@/components/ui/card";

interface ToursLoadingSkeletonProps {
  cardCount?: number;
}

export function ToursLoadingSkeleton({ cardCount = 6 }: ToursLoadingSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <div className="h-10 w-64 bg-muted rounded animate-pulse" />
        <div className="h-4 w-96 bg-muted rounded animate-pulse mt-2" />
      </div>

      {/* Filters Skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="h-10 w-full bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>

      {/* Results Count Skeleton */}
      <div className="h-4 w-48 bg-muted rounded animate-pulse" />

      {/* Tours Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(cardCount)].map((_, i) => (
          <Card key={i}>
            <div className="h-48 bg-muted animate-pulse rounded-t-lg" />
            <CardContent className="pt-4 space-y-3">
              <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
              <div className="h-20 bg-muted rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-8 bg-muted rounded animate-pulse" />
                <div className="h-8 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}