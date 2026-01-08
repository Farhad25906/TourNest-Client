/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  getAllPayments,
} from "@/services/payment.service";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  DollarSign,
  TrendingUp,
  BarChart3,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/date-utils";

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
  user?: {
    id: string;
    email: string;
    tourist?: {
      name: string;
      profilePhoto?: string;
    };
  };
  booking?: {
    id: string;
    tour?: {
      title: string;
      destination: string;
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
export default function AdminPaymentsManagement() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalTransactions: 0,
    statusCounts: {} as Record<string, number>,
  });
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

  useEffect(() => {
    fetchPayments();
  }, [filters]);
  function formatCurrency(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  }
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await getAllPayments();

      if (response.success) {
        setPayments(response.data?.payments || []);
        setStats(
          response.data?.stats || {
            totalAmount: 0,
            totalTransactions: 0,
            statusCounts: {},
          }
        );
        // setMeta(
        //   response.meta || { page: 1, limit: 10, total: 0, totalPages: 0 }
        // );
      } else {
        toast.error(response.message || "Failed to fetch payments");
      }
    } catch (error) {
      toast.error("Failed to load payments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments();
  };

  const handleRefresh = () => {
    fetchPayments();
  };

  const exportToCSV = () => {
    // Implement CSV export logic
    toast.info("Export feature coming soon");
  };

  const getStatusColor = (status: string) => {
    const statusOption = PAYMENT_STATUS_OPTIONS.find((s) => s.value === status);
    switch (statusOption?.color) {
      case "green":
        return "bg-green-100 text-green-800";
      case "red":
        return "bg-red-100 text-red-800";
      case "yellow":
        return "bg-yellow-100 text-yellow-800";
      case "blue":
        return "bg-blue-100 text-blue-800";
      case "orange":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payments Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all payment transactions
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-2">
                {formatCurrency(stats.totalAmount)}
              </h3>
            </div>
            <DollarSign className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Transactions</p>
              <h3 className="text-2xl font-bold mt-2">
                {stats.totalTransactions}
              </h3>
            </div>
            <CreditCard className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Success Rate</p>
              <h3 className="text-2xl font-bold mt-2">
                {stats.totalTransactions > 0
                  ? `${Math.round(
                      ((stats.statusCounts?.COMPLETED || 0) /
                        stats.totalTransactions) *
                        100
                    )}%`
                  : "0%"}
              </h3>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg. Transaction</p>
              <h3 className="text-2xl font-bold mt-2">
                {stats.totalTransactions > 0
                  ? formatCurrency(stats.totalAmount / stats.totalTransactions)
                  : "$0.00"}
              </h3>
            </div>
            <BarChart3 className="text-purple-500" size={32} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search payments by transaction ID, user email, or tour..."
                value={filters.searchTerm}
                onChange={(e) =>
                  handleFilterChange("searchTerm", e.target.value)
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          <div className="flex gap-4">
            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Method
              </label>
              <select
                value={filters.paymentMethod}
                onChange={(e) =>
                  handleFilterChange("paymentMethod", e.target.value)
                }
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
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

            <div className="min-w-[100px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange("sortOrder", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <button
              type="submit"
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Filter size={18} />
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No payments found
            </h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tour & Host
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {payment.transactionId || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-gray-900">
                              {payment.user?.tourist?.name || "Unknown User"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.user?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {payment.booking?.tour?.title || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            Host:{" "}
                            {payment.booking?.tour?.host?.name || "Unknown"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">
                          {formatCurrency(payment.amount, payment.currency)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {PAYMENT_METHOD_OPTIONS.find(
                            (m) => m.value === payment.paymentMethod
                          )?.label || payment.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {PAYMENT_STATUS_OPTIONS.find(
                            (s) => s.value === payment.status
                          )?.label || payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {payment.paidAt ? (
                          <div>
                            <div>Paid: {formatDate(payment.paidAt)}</div>
                            <div>Created: {formatDate(payment.createdAt)}</div>
                          </div>
                        ) : (
                          formatDate(payment.createdAt)
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            toast.info("View details feature coming soon")
                          }
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(meta.page - 1) * meta.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(meta.page * meta.limit, meta.total)}
                    </span>{" "}
                    of <span className="font-medium">{meta.total}</span> results
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFilterChange("page", meta.page - 1)}
                      disabled={meta.page === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <div className="flex items-center">
                      <span className="px-3 py-1">
                        Page {meta.page} of {meta.totalPages}
                      </span>
                    </div>
                    <button
                      onClick={() => handleFilterChange("page", meta.page + 1)}
                      disabled={meta.page === meta.totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
