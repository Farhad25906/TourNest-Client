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
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import {
  Users,
  Search,
  UserPlus,
  Filter,
  MoreHorizontal,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Eye,
  RefreshCw,
  UserCircle,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export default function UsersManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
      }
    } catch (error) {
      toast.error("Failed to sync identity registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [currentPage, statusFilter, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => { if (currentPage === 1) fetchUsers(); else setCurrentPage(1); }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDeleteUser = async (user: UserInfo) => {
    if (!confirm(`Redact user identity: ${user.name}? This protocol is irreversible.`)) return;
    try {
      const res = await deleteUser(user.id);
      if (res.success) { toast.success("Identity purged"); fetchUsers(); }
    } catch (error) { toast.error("Purge failure"); }
  };

  const handleStatusChange = async (user: UserInfo, newStatus: string) => {
    try {
      const res = await updateUserStatus(user.id, newStatus);
      if (res.success) { toast.success(`Protocol updated to ${newStatus}`); fetchUsers(); }
    } catch (error) { toast.error("Status update failure"); }
  };

  const formatDate = (d: any) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A";

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Badge className="bg-purple-50 text-purple-600 border-none px-2 rounded-lg font-black text-[9px] uppercase tracking-tighter">System Admin</Badge>;
      case 'HOST': return <Badge className="bg-blue-50 text-[#138bc9] border-none px-2 rounded-lg font-black text-[9px] uppercase tracking-tighter">Certified Host</Badge>;
      default: return <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 rounded-lg font-black text-[9px] uppercase tracking-tighter">Tourist</Badge>;
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col gap-2">
          <div className="h-10 w-64 bg-gray-100 animate-pulse rounded-2xl" />
          <div className="h-5 w-96 bg-gray-50 animate-pulse rounded-xl" />
        </div>
        <TableSkeleton columnCount={6} rowCount={10} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Identity Control</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Users className="h-4 w-4 text-[#138bc9]" />
            Manage permissions and access for global explorers
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchUsers} variant="outline" className="rounded-2xl border-gray-100 font-bold text-gray-500 gap-2 hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" />
            Sync
          </Button>
          <Link href="/admin/dashboard/hosts-management">
            <Button className="rounded-2xl bg-[#138bc9] hover:bg-[#138bc9]/90 font-black gap-2 shadow-lg shadow-[#138bc9]/20 uppercase tracking-widest text-[10px] h-11 px-6">
              <UserPlus className="h-4 w-4" />
              Authorize Host
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Hub */}
      <div className="bg-white rounded-[30px] border border-gray-100 p-2 shadow-sm flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Identify by name, email or hash..."
            className="pl-12 rounded-2xl border-none bg-gray-50/50 h-14 font-medium focus-visible:ring-[#138bc9]/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-1">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="bg-gray-50 border-none rounded-2xl px-4 text-xs font-black uppercase tracking-widest text-gray-500 appearance-none focus:ring-2 focus:ring-[#138bc9]/20"
          >
            <option value="">All Ranks</option>
            <option value="ADMIN">Admins</option>
            <option value="HOST">Hosts</option>
            <option value="TOURIST">Tourists</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-gray-50 border-none rounded-2xl px-4 text-xs font-black uppercase tracking-widest text-gray-500 appearance-none focus:ring-2 focus:ring-[#138bc9]/20"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-[40px] border border-gray-100 overflow-hidden bg-white shadow-xl shadow-gray-200/40">
        <table className="w-full">
          <thead className="bg-gray-50/50 border-b border-gray-50">
            <tr>
              <th className="px-8 py-5 text-left font-black text-[10px] text-gray-400 uppercase tracking-widest">Global Explorer</th>
              <th className="px-6 py-5 text-left font-black text-[10px] text-gray-400 uppercase tracking-widest">Rank</th>
              <th className="px-6 py-5 text-left font-black text-[10px] text-gray-400 uppercase tracking-widest">Status Protocol</th>
              <th className="px-6 py-5 text-left font-black text-[10px] text-gray-400 uppercase tracking-widest">Registered</th>
              <th className="px-8 py-5 text-right font-black text-[10px] text-gray-400 uppercase tracking-widest">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/30 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-[18px] bg-gray-100 border border-gray-100 overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
                        {user.profilePhoto ? (
                          <Image src={user.profilePhoto} alt={user.name || ""} fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <UserCircle className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-gray-900 text-sm group-hover:text-[#138bc9] transition-colors">{user.name || "UNIDENTIFIED"}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-gray-400">
                          <Mail className="h-3 w-3" />
                          <span className="text-[10px] font-bold lowercase truncate max-w-[150px]">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Badge className={cn(
                        "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none shadow-none",
                        user.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                        {user.status || 'ACTIVE'}
                      </Badge>
                      <select
                        value={user.status || 'ACTIVE'}
                        onChange={e => handleStatusChange(user, e.target.value)}
                        className="text-[10px] font-black uppercase tracking-widest text-[#138bc9] border-none bg-transparent focus:ring-0 cursor-pointer hover:underline"
                      >
                        <option value="ACTIVE text-black">ACTIVATE</option>
                        <option value="SUSPENDED text-black">SUSPEND</option>
                        <option value="INACTIVE text-black">DEACTIVATE</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-600 uppercase tracking-tighter">
                      <Calendar className="h-3.5 w-3.5 text-[#138bc9]" />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-[#138bc9]/10 hover:text-[#138bc9] transition-all">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-2xl border-gray-100 shadow-2xl p-2 font-bold">
                        <DropdownMenuLabel className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2">Rank: {user.role}</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-50" />
                        <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/users/${user.id}`)} className="rounded-xl cursor-pointer py-3 transition-colors focus:bg-[#138bc9]/10 focus:text-[#138bc9]">
                          <Eye className="h-4 w-4 mr-3" />
                          <span>Identity Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/users/${user.id}/edit`)} className="rounded-xl cursor-pointer py-3 transition-colors focus:bg-[#138bc9]/10 focus:text-[#138bc9]">
                          <ShieldAlert className="h-4 w-4 mr-3" />
                          <span>Modify Permissions</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-50" />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user)}
                          className="rounded-xl cursor-pointer py-3 transition-colors focus:bg-red-50 focus:text-red-600 text-red-500"
                        >
                          <Trash2 className="h-4 w-4 mr-3" />
                          <span>Purge Identity</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-20 w-20 rounded-[35px] bg-gray-50 flex items-center justify-center text-gray-200">
                      <Users className="h-10 w-10" />
                    </div>
                    <div className="max-w-xs mx-auto">
                      <p className="text-base font-black text-gray-900 uppercase tracking-widest">No Explorers Identified</p>
                      <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-tighter">Your current search protocol yields no identity matching these parameters.</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Population", value: users.length, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Active Nodes", value: users.filter(u => u.status === 'ACTIVE').length, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Certified Guides", value: users.filter(u => u.role === 'HOST').length, icon: UserCircle, color: "text-[#138bc9]", bg: "bg-blue-50/50" },
          { label: "Admin Core", value: users.filter(u => u.role === 'ADMIN').length, icon: ShieldAlert, color: "text-purple-500", bg: "bg-purple-50" }
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
}
