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

    console.log(tours);
    
    return (
      <div className="flex flex-col gap-4 mb-8">
        {/* New Hero Section from HTML */}
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">Explore Our World Tours</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl font-normal leading-relaxed">
            Discover handcrafted experiences at unbeatable prices. From tropical escapes to mountain expeditions, find your next journey here.
          </p>
        </div>

        {/* Filters Section from HTML */}
        {/* <div className="flex flex-wrap gap-3 mb-10">
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary text-white px-5 shadow-sm">
            <span className="text-sm font-medium">All Tours</span>
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 hover:bg-slate-50 transition-colors">
            <span className="text-slate-700 dark:text-slate-200 text-sm font-medium">Adventure</span>
            <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 hover:bg-slate-50 transition-colors">
            <span className="text-slate-700 dark:text-slate-200 text-sm font-medium">Cultural</span>
            <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 hover:bg-slate-50 transition-colors">
            <span className="text-slate-700 dark:text-slate-200 text-sm font-medium">Beach</span>
            <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
          </button>
          <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-5 hover:bg-slate-50 transition-colors">
            <span className="text-slate-700 dark:text-slate-200 text-sm font-medium">Budget</span>
            <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
          </button>
        </div> */}

        {/* Tours Grid */}
        <div className="flex-1 space-y-8">
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
            <div className="flex items-center justify-center mt-16 gap-2">
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
    );
  } catch (error) {
    console.error("Error loading tours:", error);
    return <div className="py-20 text-center">Failed to load tours. Please try again.</div>;
  }
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pt-28 pb-20">
      <main className="flex-1 max-w-[1280px] mx-auto w-full px-6 lg:px-20 py-8">
        <Suspense fallback={<GridSkeleton count={9} />}>
          <ToursContent searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}