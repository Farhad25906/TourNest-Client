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
import { Filter, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="space-y-12">
        {/* Modern Header Section */}
        <div className="relative rounded-[3rem] overflow-hidden bg-[#138bc9] p-12 md:p-20 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-24 -mb-24" />

          <div className="relative z-10 max-w-2xl">
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">
              Discover the world
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
              Epic Adventures <br /><span className="text-blue-200">Wait for You</span>
            </h1>
            <p className="text-lg text-blue-50/80 font-medium">
              From mountain peaks to hidden beaches, find and book your next unforgettable journey with expert local hosts.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-28 bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#138bc9]" />
                Filters
              </h2>
              <ToursFilters />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-gray-900">Recommended Tours</h3>
                <p className="text-sm text-gray-500 font-medium">Found {meta.total} unique experiences</p>
              </div>
            </div>

            {/* Tours Grid */}
            {tours.length > 0 ? (
              <ToursGrid tours={tours} />
            ) : (
              <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200 py-20 text-center">
                <div className="mx-auto w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                  <MapPin className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">No adventures found</h3>
                <p className="text-gray-500 max-w-xs mx-auto mb-8 font-medium">
                  We couldn't find any tours matching your current filters. Try broadening your search!
                </p>
                <Button onClick={() => window.location.href = '/tours'} className="rounded-full px-8 py-6 h-auto font-black bg-[#138bc9]">
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {meta.total > meta.limit && (
              <div className="pt-10 border-t border-gray-100">
                <PaginationControls
                  currentPage={meta.page}
                  totalPages={Math.ceil(meta.total / meta.limit)}
                  totalItems={meta.total}
                  itemsPerPage={meta.limit}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading tours:", error);
    return <div className="py-20 text-center">Failed to load tours. Please try again.</div>;
  }
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        <Suspense fallback={<GridSkeleton count={9} />}>
          <ToursContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}