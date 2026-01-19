"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChanging, setIsChanging] = useState(false);

  const updatePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    setIsChanging(true);
    
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', newPage.toString());
      router.push(`?${params.toString()}`);
      
      // Show toast for page change
      if (newPage !== currentPage) {
        toast.info(`Page ${newPage}`, {
          description: `Viewing tours on page ${newPage}`,
        });
      }
    } catch (error) {
      toast.error('Failed to change page', {
        description: 'Please try again',
      });
    } finally {
      setIsChanging(false);
    }
  };

  const updateItemsPerPage = (newLimit: number) => {
    setIsChanging(true);
    
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('limit', newLimit.toString());
      params.set('page', '1'); // Reset to first page when changing limit
      router.push(`?${params.toString()}`);
      
      toast.success('Items per page updated', {
        description: `Now showing ${newLimit} tours per page`,
      });
    } catch (error) {
      toast.error('Failed to update items per page', {
        description: 'Please try again',
      });
    } finally {
      setIsChanging(false);
    }
  };

  // Calculate start and end items
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Items per page selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Show</span>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => updateItemsPerPage(parseInt(value))}
          disabled={isChanging}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">6</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="24">24</SelectItem>
            <SelectItem value="48">48</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">per page</span>
      </div>

      {/* Page info */}
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-semibold">{startItem}</span> to{" "}
        <span className="font-semibold">{endItem}</span> of{" "}
        <span className="font-semibold">{totalItems}</span> tours
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => updatePage(1)}
          disabled={currentPage === 1 || isChanging}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updatePage(currentPage - 1)}
          disabled={currentPage === 1 || isChanging}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => updatePage(pageNum)}
              className="w-9"
              disabled={isChanging}
            >
              {pageNum}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => updatePage(currentPage + 1)}
          disabled={currentPage === totalPages || isChanging}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updatePage(totalPages)}
          disabled={currentPage === totalPages || isChanging}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}