"use client";

import React, { useState } from 'react';
import { ITour } from '@/types/tour.interface';
import { deleteTour, updateTourStatus } from '@/services/tour/tour.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  CheckCircle,
  XCircle,
  Star,
  Sparkles,
  Briefcase,
  Activity,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TourTableProps {
  tours: ITour[];
  meta?: any;
  currentPage: number;
  searchTerm: string;
  statusFilter: string;
}

const TourTable: React.FC<TourTableProps> = ({ tours, meta, currentPage, searchTerm, statusFilter }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(searchTerm);

  const handleDeleteTour = async (tourId: string) => {
    if (!confirm('Redact this expedition from the global registry?')) return;
    setDeletingId(tourId);
    try {
      const res = await deleteTour(tourId);
      if (res.success) { toast.success('Expedition purged'); router.refresh(); }
    } finally { setDeletingId(null); }
  };

  const handleToggleStatus = async (tourId: string, currentStatus: boolean) => {
    setUpdatingStatus(tourId);
    try {
      const res = await updateTourStatus(tourId, !currentStatus);
      if (res.success) { toast.success(`Deployment ${!currentStatus ? 'activated' : 'deactivated'}`); router.refresh(); }
    } finally { setUpdatingStatus(null); }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (localSearch) params.set('search', localSearch);
    router.push(`/admin/dashboard/tours-management?${params.toString()}`);
  };

  const formatDate = (date: any) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Filters Hub */}
      <div className="bg-white rounded-[30px] border border-gray-100 p-2 shadow-sm flex flex-col md:flex-row gap-2">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Identify by expedition title or destination..."
            className="pl-12 rounded-2xl border-none bg-gray-50/50 h-14 font-medium focus-visible:ring-[#138bc9]/20"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </form>
        <div className="flex gap-2 p-1">
          <Badge variant="outline" className="h-10 px-4 rounded-xl border-gray-100 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
            {meta?.total || tours.length} Deployments
          </Badge>
        </div>
      </div>

      <div className="rounded-[40px] border border-gray-100 overflow-hidden bg-white shadow-xl shadow-gray-200/40">
        <table className="w-full">
          <thead className="bg-gray-50/50 border-b border-gray-50">
            <tr>
              <th className="px-8 py-5 text-left font-black text-[10px] text-gray-400 uppercase tracking-widest pl-10">Expedition Detail</th>
              <th className="px-6 py-5 text-left font-black text-[10px] text-gray-400 uppercase tracking-widest">Geography</th>
              <th className="px-6 py-5 text-left font-black text-[10px] text-gray-400 uppercase tracking-widest">Capacities</th>
              <th className="px-6 py-5 text-left font-black text-[10px] text-gray-400 uppercase tracking-widest">Status Protocol</th>
              <th className="px-8 py-5 text-right font-black text-[10px] text-gray-400 uppercase tracking-widest pr-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tours.length > 0 ? (
              tours.map((tour) => (
                <tr key={tour.id} className="hover:bg-gray-50/30 transition-all group">
                  <td className="px-8 py-5 pl-10">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-20 rounded-2xl bg-gray-100 border border-gray-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {tour.images?.length ? (
                          <img src={tour.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-300">
                            <Briefcase className="h-5 w-5" />
                          </div>
                        )}
                        {tour.isFeatured && (
                          <div className="absolute inset-0 bg-amber-500/10 flex items-center justify-center">
                            <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-gray-900 text-sm group-hover:text-[#138bc9] transition-colors line-clamp-1">{tour.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge variant="outline" className="px-1.5 py-0 rounded-md text-[8px] font-black uppercase bg-blue-50 border-blue-100 text-[#138bc9]">{tour.category}</Badge>
                          <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter italic">{tour.difficulty} Intensity</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-black text-gray-800 uppercase tracking-tighter">
                        <MapPin className="h-3.5 w-3.5 text-[#138bc9]" />
                        {tour.destination}
                      </div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{tour.city}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-black text-gray-800 uppercase tracking-tighter">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        {tour.currentGroupSize}/{tour.maxGroupSize}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-black text-[#10b981] uppercase tracking-tighter">
                        <DollarSign className="h-3.5 w-3.5" />
                        {tour.price}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Badge className={cn(
                        "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none shadow-none",
                        tour.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                        {tour.isActive ? 'Active Node' : 'Suspended'}
                      </Badge>
                      <Button
                        variant="ghost"
                        className="h-8 px-3 rounded-xl font-black text-[9px] uppercase tracking-widest text-[#138bc9] hover:bg-blue-50"
                        onClick={() => handleToggleStatus(tour.id, tour.isActive)}
                        disabled={updatingStatus === tour.id}
                      >
                        {updatingStatus === tour.id ? <Loader2 className="h-3 w-3 animate-spin" /> : tour.isActive ? 'DEACTIVATE' : 'ACTIVATE'}
                      </Button>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right pr-10">
                    <div className="flex justify-end gap-1">
                      <Link href={`/tours/${tour.id}`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-[#138bc9]/10 hover:text-[#138bc9] transition-all">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/dashboard/tours/edit/${tour.id}`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-[#138bc9]/10 hover:text-[#138bc9] transition-all">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all text-gray-300"
                        onClick={() => handleDeleteTour(tour.id)}
                        disabled={deletingId === tour.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-20 w-20 rounded-[35px] bg-gray-50 flex items-center justify-center text-gray-200">
                      <Briefcase className="h-10 w-10" />
                    </div>
                    <div className="max-w-xs mx-auto">
                      <p className="text-base font-black text-gray-900 uppercase tracking-widest">Expedition Void</p>
                      <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-tighter">No deployments found matching these telemetry parameters.</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Deployments", value: meta?.total || tours.length, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Active Channels", value: tours.filter(t => t.isActive).length, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Featured Spotlight", value: tours.filter(t => t.isFeatured).length, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Global Reach", value: new Set(tours.map(t => t.country)).size + " Regions", icon: MapPin, color: "text-purple-500", bg: "bg-purple-50" }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[30px] border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0", item.bg, item.color)}>
              <item.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
              <p className="text-xl font-black text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourTable;