// app/(dashboardLayout)/admin/dashboard/tours-management/page.tsx
import React from 'react';
import { getAllToursForAdmin } from '@/services/tour/tour.service';
import TourTable from '@/components/module/Admin/TourTable';

// Correct way to handle searchParams in Next.js 15+
export default async function AdminToursPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}) {
  // Await the searchParams Promise
  const params = await searchParams;
  
  const page = Number(params?.page) || 1;
  const searchTerm = params?.search || '';
  const status = params?.status || '';

  const filters = {
    page,
    limit: 10,
    searchTerm: searchTerm || undefined,
    // isActive: status === 'active' ? true : status === 'inactive' ? false : undefined,
    // sortBy: 'createdAt',
    // sortOrder: 'desc',
  };

  const toursResponse = await getAllToursForAdmin();
  console.log('Tours response:', toursResponse);
  
  const tours = toursResponse.data || [];
  const meta = toursResponse.meta;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tour Management</h1>
        <p className="text-gray-600 mt-2">Manage all tours in the system</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <TourTable 
          tours={tours} 
          meta={meta} 
          currentPage={page}
          searchTerm={searchTerm}
          statusFilter={status}
        />
      </div>
    </div>
  );
}