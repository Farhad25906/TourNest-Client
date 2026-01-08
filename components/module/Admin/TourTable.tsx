// app/admin/tours/_components/TourTable.tsx
'use client';

import React, { useState } from 'react';
import { ITour } from '@/types/tour.interface';
import { deleteTour, updateTourStatus } from '@/services/tour/tour.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Search, Filter, Eye, Edit, Trash2, Plus, Calendar, Users, DollarSign, MapPin, CheckCircle, XCircle, Star } from 'lucide-react';

interface TourTableProps {
  tours: ITour[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  currentPage: number;
  searchTerm: string;
  statusFilter: string;
}

const TourTable: React.FC<TourTableProps> = ({ 
  tours, 
  meta, 
  currentPage, 
  searchTerm, 
  statusFilter 
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [localStatus, setLocalStatus] = useState(statusFilter);

  const handleDeleteTour = async (tourId: string) => {
    if (!confirm('Are you sure you want to delete this tour? This action cannot be undone.')) return;

    setDeletingId(tourId);
    try {
      const result = await deleteTour(tourId);
      if (result.success) {
        toast.success('Tour deleted successfully');
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to delete tour');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the tour');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (tourId: string, currentStatus: boolean) => {
    setUpdatingStatus(tourId);
    try {
      const result = await updateTourStatus(tourId, !currentStatus);
      if (result.success) {
        toast.success(`Tour ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        router.refresh();
      } else {
        toast.error(result.message || 'Failed to update tour status');
      }
    } catch (error) {
      toast.error('An error occurred while updating tour status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (localSearch) params.set('search', localSearch);
    if (localStatus) params.set('status', localStatus);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    router.push(`/admin/tours?${params.toString()}`);
  };

  const handleStatusChange = (status: string) => {
    setLocalStatus(status);
    const params = new URLSearchParams();
    if (localSearch) params.set('search', localSearch);
    if (status) params.set('status', status);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    router.push(`/admin/tours?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (localSearch) params.set('search', localSearch);
    if (localStatus) params.set('status', localStatus);
    params.set('page', page.toString());
    
    router.push(`/admin/tours?${params.toString()}`);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (isActive: boolean, isFeatured: boolean) => {
    if (isFeatured) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Star className="w-3 h-3 mr-1" />
          Featured
        </span>
      );
    }
    
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </span>
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      ADVENTURE: 'bg-purple-100 text-purple-800',
      CULTURE: 'bg-blue-100 text-blue-800',
      CULTURAL: 'bg-blue-100 text-blue-800',
      FOOD: 'bg-red-100 text-red-800',
      NATURE: 'bg-green-100 text-green-800',
      RELAXATION: 'bg-teal-100 text-teal-800',
      URBAN: 'bg-gray-100 text-gray-800',
      BEACH: 'bg-cyan-100 text-cyan-800',
      MOUNTAIN: 'bg-amber-100 text-amber-800',
      HISTORICAL: 'bg-orange-100 text-orange-800',
      RELIGIOUS: 'bg-indigo-100 text-indigo-800',
      LUXURY: 'bg-pink-100 text-pink-800',
    };
    
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">All Tours</h2>
            <p className="text-gray-600 text-sm mt-1">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, meta?.total || 0)} of {meta?.total || 0} tours
            </p>
          </div>
          
          <Link
            href="/admin/tours/create"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Tour
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search tours by title, destination, city..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={localStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none appearance-none bg-white"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Search
            </button>
            
            {(localSearch || localStatus) && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('');
                  setLocalStatus('');
                  router.push('/admin/tours');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tours Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tour Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tours.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    <Search className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-lg font-medium">No tours found</p>
                    <p className="mt-1">
                      {searchTerm || statusFilter 
                        ? 'Try adjusting your search or filter criteria'
                        : 'No tours have been created yet'
                      }
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              tours.map((tour) => (
                <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {tour.images && tour.images.length > 0 ? (
                        <div className="flex-shrink-0 h-16 w-24 rounded-lg overflow-hidden mr-4">
                          <img
                            className="h-full w-full object-cover"
                            src={tour.images[0]}
                            alt={tour.title}
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-16 w-24 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                          <MapPin className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <Link
                          href={`/tours/${tour.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-indigo-600 line-clamp-1"
                        >
                          {tour.title}
                        </Link>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {tour.description.substring(0, 100)}...
                        </p>
                        <div className="flex items-center mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(tour.category)}`}>
                            {tour.category}
                          </span>
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            {tour.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        {tour.destination}
                      </div>
                      <div className="text-gray-500">
                        {tour.city}, {tour.country}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {formatDate(tour.startDate)} - {formatDate(tour.endDate)}
                        <span className="ml-2 text-gray-500">({tour.duration} days)</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        {tour.currentGroupSize}/{tour.maxGroupSize} people
                      </div>
                      <div className="flex items-center text-sm text-gray-900">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                        {formatCurrency(tour.price)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Views: {tour.views} • Created: {formatDate(tour.createdAt)}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      {getStatusBadge(tour.isActive, tour.isFeatured)}
                      <button
                        onClick={() => handleToggleStatus(tour.id, tour.isActive)}
                        disabled={updatingStatus === tour.id}
                        className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium transition-colors ${
                          tour.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        } ${updatingStatus === tour.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {updatingStatus === tour.id ? (
                          'Updating...'
                        ) : tour.isActive ? (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Activate
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/tours/${tour.id}`}
                        className="inline-flex items-center p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Tour"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      
                      <Link
                        href={`/admin/tours/edit/${tour.id}`}
                        className="inline-flex items-center p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Tour"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      
                      <button
                        onClick={() => handleDeleteTour(tour.id)}
                        disabled={deletingId === tour.id}
                        className="inline-flex items-center p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Tour"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mt-3">
                      <Link
                        href={`/admin/bookings?tourId=${tour.id}`}
                        className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        View Bookings ({tour.bookingCount || 0})
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {meta.totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
              let pageNum;
              if (meta.totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= meta.totalPages - 2) {
                pageNum = meta.totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 border rounded text-sm font-medium ${
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= meta.totalPages}
              className="px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      {tours.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Total Tours</div>
            <div className="text-2xl font-semibold text-gray-900">{meta?.total || 0}</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Active Tours</div>
            <div className="text-2xl font-semibold text-green-600">
              {tours.filter(t => t.isActive).length}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Featured Tours</div>
            <div className="text-2xl font-semibold text-yellow-600">
              {tours.filter(t => t.isFeatured).length}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Total Views</div>
            <div className="text-2xl font-semibold text-blue-600">
              {tours.reduce((sum, tour) => sum + tour.views, 0)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourTable;