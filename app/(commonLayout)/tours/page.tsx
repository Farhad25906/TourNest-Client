import { Suspense } from "react";
import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { ToursGrid } from "@/components/module/Tour/ToursGrid";
import { ToursFilters } from "@/components/module/Tour/ToursFilters";
import PaginationControls from "@/components/shared/PaginationControls";
import { getAllTours } from "@/services/tour/tour.service";
import { TourFilters } from "@/types/tour.interface";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GridSkeleton } from "@/components/shared/CardSkeleton";

export const metadata: Metadata = {
  title: "Explore Tours | TourNest",
  description: "Discover amazing tours and adventures around the world",
};

interface ToursPageProps {
  searchParams: Promise<{
    searchTerm?: string;
    category?: string;
    difficulty?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  }>;
}

async function ToursContent({ searchParams }: { searchParams: any }) {
  try {
    const params = await searchParams;

    const filters: TourFilters = {
      searchTerm: params.searchTerm,
      category: params.category,
      difficulty: params.difficulty,
      minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc',
      page: params.page ? parseInt(params.page) : 1,
      limit: params.limit ? parseInt(params.limit) : 12,
    };

    const response = await getAllTours(filters);

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch tours');
    }

    const tours = response.data || [];
    const meta = response.meta || { page: 1, limit: 12, total: 0 };

    return (
      <div className="space-y-6">
        <SectionHeading
          center={false}
          badge="Adventures"
          title="Explore Tours"
          subtitle="Discover amazing adventures and experiences around the world"
        />

        {/* Filters */}
        <ToursFilters />

        {/* Results Count */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {tours.length} of {meta.total} tours
          </p>
        </div>

        {/* Tours Grid */}
        {tours.length > 0 ? (
          <ToursGrid tours={tours} />
        ) : (
          <Card className="rounded-2xl border-blue-50">
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                <svg
                  className="h-12 w-12 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold">No tours found</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Try adjusting your search filters or check back later for new tours
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {meta.total > meta.limit && (
          <PaginationControls
            currentPage={meta.page}
            totalPages={Math.ceil(meta.total / meta.limit)}
            totalItems={meta.total}
            itemsPerPage={meta.limit}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading tours:", error);

    return (
      <div className="space-y-6">
        <SectionHeading
          center={false}
          badge="Adventures"
          title="Explore Tours"
          subtitle="Discover amazing adventures and experiences around the world"
        />
        <ToursFilters />
        <Card className="border-destructive/20 bg-destructive/5 rounded-2xl overflow-hidden">
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
              <svg
                className="h-10 w-10 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.961-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
              We couldn't load the tours. This might be a temporary issue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-[#138bc9] text-white font-black rounded-full hover:bg-[#138bc9]/90 transition-all shadow-lg hover:shadow-xl"
            >
              Retry Loading
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<GridSkeleton count={9} />}>
        <ToursContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}