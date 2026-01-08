// app/(dashboardLayout)/admin/dashboard/users-management/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAllUsers,
  deleteUser,
  updateUserStatus,
} from "@/services/auth/user.services";
import Link from "next/link";
import { toast } from "sonner";
import { UserInfo } from "@/types/user.interface";
import Image from "next/image";

export default function UsersManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers({
        searchTerm: searchTerm || undefined,
        status: statusFilter || undefined,
        role: roleFilter || undefined,
        page: currentPage,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (response.success && response.data) {
        setUsers(response.data);
        // Note: You might need to adjust this based on your API response structure
        if (response.data.meta) {
          setTotalPages(
            Math.ceil(response.data.meta.total / response.data.meta.limit)
          );
        }
      } else {
        toast.error(response.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [currentPage, statusFilter, roleFilter]);

  // Handle search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (currentPage === 1) {
        fetchUsers();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Handle delete user
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete ${userName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await deleteUser(userId);

      if (response.success) {
        toast.success(response.message || "User deleted successfully!");
        fetchUsers(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  // Handle status change
  const handleStatusChange = async (
    userId: string,
    newStatus: string,
    userName: string
  ) => {
    try {
      const response = await updateUserStatus(userId, newStatus);

      if (response.success) {
        toast.success(`${userName}'s status updated to ${newStatus}`);
        fetchUsers(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "SUSPENDED":
        return "bg-yellow-100 text-yellow-800";
      case "INACTIVE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get role badge color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "HOST":
        return "bg-blue-100 text-blue-800";
      case "TOURIST":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Users Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage all users, hosts, and administrators in the system.
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/admin/dashboard/hosts-management"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Host
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Users
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Search by email or name..."
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="HOST">Host</option>
                <option value="TOURIST">Tourist</option>
              </select>
            </div>

            {/* Refresh Button */}
            <div className="flex items-end">
              <button
                onClick={fetchUsers}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No users found.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => {
                      const profilePhoto =
                        user.host?.profilePhoto ??
                        user.admin?.profilePhoto ??
                        user.tourist?.profilePhoto ??
                        undefined;

                      const createdAt =
                        user.host?.createdAt ??
                        user.admin?.createdAt ??
                        user.tourist?.createdAt ??
                        undefined;

                      return (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                  {profilePhoto ? (
                                    <Image
                                      src={profilePhoto}
                                      alt={user.name ?? "User"}
                                      width={40}
                                      height={40}
                                      className="rounded-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-gray-500 font-medium">
                                      {user.name?.charAt(0).toUpperCase() ||
                                        "U"}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name || "N/A"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                  user.status || "ACTIVE"
                                )}`}
                              >
                                {user.status || "ACTIVE"}
                              </span>

                              <select
                                value={user.status || "ACTIVE"}
                                onChange={(e) =>
                                  handleStatusChange(
                                    user.id,
                                    e.target.value,
                                    user.name || "User"
                                  )
                                }
                                className="text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="ACTIVE">Active</option>
                                <option value="SUSPENDED">Suspended</option>
                                <option value="INACTIVE">Inactive</option>
                              </select>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {createdAt ? formatDate(createdAt) : "N/A"}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  router.push(
                                    `/admin/dashboard/users/${user.id}`
                                  )
                                }
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View
                              </button>

                              <button
                                onClick={() =>
                                  router.push(
                                    `/admin/dashboard/users/${user.id}/edit`
                                  )
                                }
                                className="text-green-600 hover:text-green-900"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteUser(user.id, user.name || "User")
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}

              <div className="md:hidden">
                <div className="divide-y divide-gray-200">
                  {users.map((user) => {
                    // ✅ normalize profile photo (no null)
                    const profilePhoto =
                      user.host?.profilePhoto ??
                      user.admin?.profilePhoto ??
                      user.tourist?.profilePhoto ??
                      undefined;

                    const createdAt =
                      user.host?.createdAt ??
                      user.admin?.createdAt ??
                      user.tourist?.createdAt ??
                      undefined;

                    return (
                      <div key={user.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {profilePhoto ? (
                                  <Image
                                    src={profilePhoto}
                                    alt={user.name ?? "User"}
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-gray-500 font-medium text-lg">
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>

                              <div className="flex space-x-2 mt-1">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(
                                    user.role
                                  )}`}
                                >
                                  {user.role}
                                </span>

                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                    user.status || "ACTIVE"
                                  )}`}
                                >
                                  {user.status || "ACTIVE"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-between text-sm">
                          <div>
                            <span className="text-gray-500">Created: </span>
                            <span>
                              {createdAt ? formatDate(createdAt) : "N/A"}
                            </span>
                          </div>

                          <div className="flex space-x-3">
                            <button
                              onClick={() =>
                                router.push(`/admin/dashboard/users/${user.id}`)
                              }
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteUser(user.id, user.name || "User")
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="mt-3">
                          <select
                            value={user.status || "ACTIVE"}
                            onChange={(e) =>
                              handleStatusChange(
                                user.id,
                                e.target.value,
                                user.name || "User"
                              )
                            }
                            className="w-full text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="ACTIVE">Active</option>
                            <option value="SUSPENDED">Suspended</option>
                            <option value="INACTIVE">Inactive</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm font-medium text-gray-500">Total Users</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {users.length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm font-medium text-gray-500">
              Active Users
            </div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              {users.filter((u) => u.status === "ACTIVE").length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm font-medium text-gray-500">Hosts</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">
              {users.filter((u) => u.role === "HOST").length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm font-medium text-gray-500">Admins</div>
            <div className="mt-2 text-3xl font-bold text-purple-600">
              {users.filter((u) => u.role === "ADMIN").length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
