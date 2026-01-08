/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { getUserPaymentHistory, } from "@/services/payment.service";
import { Search, Filter, RefreshCw, Eye, Receipt, CreditCard, Calendar, Users, MapPin } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/date-utils";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  transactionId?: string;
  description?: string;
  paidAt?: Date;
  createdAt: Date;
  booking?: {
    id: string;
    status: string;
    paymentStatus: string;
    numberOfPeople: number;
    totalAmount: number;
    tour?: {
      id: string;
      title: string;
      destination: string;
      startDate?: Date;
      endDate?: Date;
      host?: {
        name: string;
      };
    };
  };
}
const PAYMENT_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending", color: "yellow" },
  { value: "PROCESSING", label: "Processing", color: "blue" },
  { value: "COMPLETED", label: "Completed", color: "green" },
  { value: "FAILED", label: "Failed", color: "red" },
  { value: "CANCELLED", label: "Cancelled", color: "gray" },
  { value: "REFUNDED", label: "Refunded", color: "orange" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "card", label: "Card" },
  { value: "cash", label: "Cash" },
  { value: "bkash", label: "Bkash" },
];

export default function UserPaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    searchTerm: "",
    status: "",
    paymentMethod: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [stats, setStats] = useState({
    totalSpent: 0,
    completedPayments: 0,
    pendingPayments: 0,
    refundedAmount: 0,
  });

  useEffect(() => {
    fetchPaymentHistory();
  }, [filters]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await getUserPaymentHistory();
      
      if (response.success) {
        setPayments(response.data || []);
        // setMeta(response.meta || { page: 1, limit: 10, total: 0, totalPages: 0 });
        
        // Calculate stats
        const stats = {
          totalSpent: 0,
          completedPayments: 0,
          pendingPayments: 0,
          refundedAmount: 0,
        };
        
        response.data?.forEach(payment => {
          if (payment.status === "COMPLETED") {
            stats.totalSpent += payment.amount;
            stats.completedPayments++;
          } else if (payment.status === "PENDING" || payment.status === "PROCESSING") {
            stats.pendingPayments++;
          } else if (payment.status === "REFUNDED") {
            stats.refundedAmount += payment.amount;
          }
        });
        
        setStats(stats);
      } else {
        toast.error(response.message || "Failed to fetch payment history");
      }
    } catch (error) {
      toast.error("Failed to load payment history");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleRefresh = () => {
    fetchPaymentHistory();
  };

  const getStatusColor = (status: string) => {
    const statusOption = PAYMENT_STATUS_OPTIONS.find(s => s.value === status);
    switch (statusOption?.color) {
      case "green": return "bg-green-100 text-green-800";
      case "red": return "bg-red-100 text-red-800";
      case "yellow": return "bg-yellow-100 text-yellow-800";
      case "blue": return "bg-blue-100 text-blue-800";
      case "orange": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const viewReceipt = (paymentId: string) => {
    toast.info("Receipt view feature coming soon");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600 mt-1">Track all your payment transactions</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Spent</p>
              <h3 className="text-3xl font-bold mt-2">
                {formatCurrency(stats.totalSpent)}
              </h3>
              <p className="text-blue-200 text-sm mt-1">Across {stats.completedPayments} payments</p>
            </div>
            <CreditCard size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed Payments</p>
              <h3 className="text-2xl font-bold mt-2">{stats.completedPayments}</h3>
              <p className="text-gray-400 text-sm mt-1">Successful transactions</p>
            </div>
            <Receipt className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Payments</p>
              <h3 className="text-2xl font-bold mt-2">{stats.pendingPayments}</h3>
              <p className="text-gray-400 text-sm mt-1">Awaiting processing</p>
            </div>
            <Calendar className="text-yellow-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Refunded</p>
              <h3 className="text-2xl font-bold mt-2">
                {formatCurrency(stats.refundedAmount)}
              </h3>
              <p className="text-gray-400 text-sm mt-1">Total refunds received</p>
            </div>
            <Receipt className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by tour name, transaction ID, or amount..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                {PAYMENT_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
              <select
                value={filters.paymentMethod}
                onChange={(e) => handleFilterChange("paymentMethod", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Methods</option>
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt">Date Created</option>
                <option value="paidAt">Date Paid</option>
                <option value="amount">Amount</option>
              </select>
            </div>

            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Filter size={18} />
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <CreditCard className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No payment history</h3>
            <p className="mt-2 text-gray-500">Your payments will appear here after you make bookings.</p>
          </div>
        ) : (
          payments.map((payment) => (
            <div key={payment.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Section: Tour Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MapPin className="text-blue-600" size={24} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {payment.booking?.tour?.title || "Tour Booking"}
                        </h3>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>{payment.booking?.numberOfPeople} travelers</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>
                              {payment.booking?.tour?.startDate 
                                ? formatDate(payment.booking.tour.startDate)
                                : "Date not set"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Host:</span>{" "}
                            {payment.booking?.tour?.host?.name || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section: Payment Details */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <div className="font-bold text-2xl text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Paid on {payment.paidAt ? formatDate(payment.paidAt) : formatDate(payment.createdAt)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                        {PAYMENT_STATUS_OPTIONS.find(s => s.value === payment.status)?.label || payment.status}
                      </span>
                      
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {PAYMENT_METHOD_OPTIONS.find(m => m.value === payment.paymentMethod)?.label || payment.paymentMethod}
                      </span>
                      
                      <button
                        onClick={() => viewReceipt(payment.id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye size={16} />
                        View Receipt
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Transaction ID</p>
                      <p className="font-mono text-gray-900">{payment.transactionId || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Booking Status</p>
                      <p className="font-medium text-gray-900">
                        {payment.booking?.status || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Payment ID</p>
                      <p className="font-mono text-gray-900">{payment.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Booking ID</p>
                      <p className="font-mono text-gray-900">{payment.booking?.id || "N/A"}</p>
                    </div>
                  </div>
                  
                  {payment.description && (
                    <div className="mt-3">
                      <p className="text-gray-500 text-sm">Description</p>
                      <p className="text-gray-700">{payment.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(meta.page - 1) * meta.limit + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(meta.page * meta.limit, meta.total)}
              </span>{" "}
              of <span className="font-medium">{meta.total}</span> payments
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange("page", meta.page - 1)}
                disabled={meta.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center">
                <span className="px-4 py-2">Page {meta.page} of {meta.totalPages}</span>
              </div>
              <button
                onClick={() => handleFilterChange("page", meta.page + 1)}
                disabled={meta.page === meta.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}