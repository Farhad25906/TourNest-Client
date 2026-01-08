"use client";

import { useState, useEffect } from "react";
import {
  ApiResponse,
  getHostEarnings,
  type IEarningsData,
  type IPayment,
} from "@/services/payment.service";
import {
  Download,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatCurrency } from "@/lib/date-utils";

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

export default function HostEarningsDashboard() {
  const [earningsData, setEarningsData] = useState<IEarningsData>({
    payments: [],
    summary: {
      totalEarnings: 0,
      totalTransactions: 0,
      pendingBalance: 0,
      totalEarningsToDate: 0,
    },
    earningsByMonth: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response: ApiResponse<IEarningsData> = await getHostEarnings();

      if (response.success && response.data) {
        setEarningsData(response.data);
      } else if (response.success && !response.data) {
        setEarningsData({
          payments: [],
          summary: {
            totalEarnings: 0,
            totalTransactions: 0,
            pendingBalance: 0,
            totalEarningsToDate: 0,
          },
          earningsByMonth: [],
        });
        toast.error("No earnings data found");
      } else {
        toast.error(response.message || "Failed to fetch earnings");
      }
    } catch (error) {
      toast.error("Failed to load earnings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchEarnings();
  };

  const exportToCSV = () => {
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

  const formatDate = (dateInput: string | Date | undefined): string => {
    if (!dateInput) return "N/A";

    try {
      const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Prepare chart data
  const chartData = earningsData.earningsByMonth.map((item) => ({
    name: item.month,
    earnings: item.earnings,
  }));

  const paymentMethodData = earningsData.payments.reduce((acc, payment) => {
    const method =
      PAYMENT_METHOD_OPTIONS.find((m) => m.value === payment.paymentMethod)
        ?.label || payment.paymentMethod;
    acc[method] = (acc[method] || 0) + payment.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(paymentMethodData).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Earnings Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Track your earnings and payment history
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            Export Report
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
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Earnings</p>
              <h3 className="text-3xl font-bold mt-2">
                {formatCurrency(earningsData.summary.totalEarnings)}
              </h3>
              <p className="text-blue-200 text-sm mt-1">
                From {earningsData.summary.totalTransactions} transactions
              </p>
            </div>
            <DollarSign size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Balance</p>
              <h3 className="text-2xl font-bold mt-2">
                {formatCurrency(earningsData.summary.pendingBalance)}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Available for withdrawal
              </p>
            </div>
            <Target className="text-yellow-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Earnings (All Time)</p>
              <h3 className="text-2xl font-bold mt-2">
                {formatCurrency(earningsData.summary.totalEarningsToDate)}
              </h3>
              <p className="text-gray-400 text-sm mt-1">Lifetime earnings</p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg. per Booking</p>
              <h3 className="text-2xl font-bold mt-2">
                {earningsData.summary.totalTransactions > 0
                  ? formatCurrency(
                      earningsData.summary.totalEarnings /
                        earningsData.summary.totalTransactions
                    )
                  : formatCurrency(0)}
              </h3>
              <p className="text-gray-400 text-sm mt-1">Average transaction</p>
            </div>
            <Users className="text-purple-500" size={32} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Earnings Trend</h3>
            <div className="text-sm text-gray-500">
              Last {earningsData.earningsByMonth.length} months
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number | undefined) => [
                    `$${value || 0}`,
                    "Earnings",
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Monthly Earnings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-6">
            Payment Methods Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value: number | undefined) => [
                    `$${value || 0}`,
                    "Amount",
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Payments</h3>
            <div className="text-sm text-gray-500">
              {earningsData.payments.length} total payments
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : earningsData.payments.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No payments found
            </h3>
            <p className="mt-2 text-gray-500">
              Your completed payments will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {earningsData.payments.slice(0, 10).map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-gray-900">
                            {payment.user?.tourist?.name || "Guest"}
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
                          {payment.booking?.numberOfPeople} traveler(s)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-green-600">
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
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(payment.paidAt)}
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
                  </tr>
                ))}
              </tbody>
            </table>

            {earningsData.payments.length > 10 && (
              <div className="px-6 py-4 text-center border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing 10 of {earningsData.payments.length} payments
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
