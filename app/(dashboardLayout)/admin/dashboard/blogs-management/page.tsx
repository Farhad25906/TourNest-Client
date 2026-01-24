"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    getAllBlogs,
    updateBlogStatus,
    IBlog
} from "@/services/blog.service";
import {
    FileText,
    Search,
    RefreshCw,
    MoreHorizontal,
    Eye,
    Trash2,
    CheckCircle,
    XCircle,
    User,
    Calendar,
    MessageSquare,
    Activity,
    UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { format } from "date-fns";
import { deleteBlog } from "@/services/blog.service";

export default function BlogsManagementPage() {
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [meta, setMeta] = useState<any>(null);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await getAllBlogs({
                searchTerm: searchTerm || undefined,
                status: statusFilter || undefined,
                page: currentPage,
                limit: 10,
                isAdminView: "true" as any
            });
            if (res.success) {
                setBlogs(res.data);
                setMeta(res.meta);
            }
        } catch (error) {
            toast.error("Failed to fetch community tales");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [currentPage, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) fetchBlogs();
            else setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleToggleApproval = async (blog: IBlog) => {
        try {
            const res = await updateBlogStatus(blog.id, !blog.isApproved);
            if (res.success) {
                toast.success(`Protocol ${!blog.isApproved ? 'verified' : 'obfuscated'}`);
                fetchBlogs();
            }
        } catch (error) {
            toast.error("Status update failure");
        }
    };

    const handleDelete = async (blog: IBlog) => {
        if (!confirm(`Permanently redact "${blog.title}"? This protocol is irreversible.`)) return;
        try {
            const res = await deleteBlog(blog.id);
            if (res.success) {
                toast.success("Entry purged from records");
                fetchBlogs();
            }
        } catch (error) {
            toast.error("Purge failure");
        }
    };

    const formatDate = (d: string) => format(new Date(d), "MMM dd, yyyy");

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Archive Audit</h1>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#138bc9]" />
                        Moderate and curate global explorer chronicles
                    </p>
                </div>
                <Button onClick={fetchBlogs} variant="outline" className="rounded-2xl border-gray-100 font-bold text-gray-500 gap-2 hover:bg-gray-50">
                    <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    Sync Core
                </Button>
            </div>

            {/* Stats Hub */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Chronicles", value: meta?.total || blogs.length, icon: FileText, color: "text-[#138bc9]", bg: "bg-blue-50" },
                    { label: "Public Feeds", value: blogs.filter(b => b.isApproved).length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Awaiting Audit", value: blogs.filter(b => !b.isApproved).length, icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Total Impact", value: blogs.reduce((s, b) => s + b.views, 0), icon: Eye, color: "text-purple-600", bg: "bg-purple-50" }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-[30px] border border-gray-100 flex items-center justify-between hover:shadow-lg transition-all duration-300">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                            <h3 className="text-2xl font-black text-gray-900">{item.value}</h3>
                        </div>
                        <div className={cn("p-3 rounded-xl", item.bg, item.color)}>
                            <item.icon className="h-5 w-5" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters Hub */}
            <div className="bg-white rounded-[30px] border border-gray-100 p-2 shadow-sm flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search chronicles by title or host..."
                        className="pl-12 rounded-2xl border-none bg-gray-50/50 h-14 font-medium focus-visible:ring-[#138bc9]/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-[40px] border border-gray-100 overflow-hidden bg-white shadow-xl shadow-gray-200/40">
                <table className="w-full">
                    <thead className="bg-gray-50/50 border-b border-gray-50 text-gray-400">
                        <tr>
                            <th className="px-8 py-5 text-left font-black text-[10px] uppercase tracking-widest pl-10">Chronicle Entry</th>
                            <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Oracle / Host</th>
                            <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Protocol Status</th>
                            <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Telemetry</th>
                            <th className="px-8 py-5 text-right font-black text-[10px] uppercase tracking-widest pr-10">Management</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {blogs.length > 0 ? (
                            blogs.map((blog) => (
                                <tr key={blog.id} className="hover:bg-gray-50/30 transition-all group">
                                    <td className="px-8 py-5 pl-10">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-12 w-16 rounded-2xl bg-gray-100 border border-gray-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
                                                {blog.coverImage ? (
                                                    <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-300">
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-black text-gray-900 text-sm group-hover:text-[#138bc9] transition-colors line-clamp-1">{blog.title}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Badge variant="outline" className="px-1.5 py-0 rounded-md text-[8px] font-black uppercase text-[#138bc9] border-blue-100 bg-blue-50">{blog.category}</Badge>
                                                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{formatDate(blog.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-bold">
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 rounded-full bg-gray-50 border flex items-center justify-center text-gray-400 overflow-hidden">
                                                {blog.host?.profilePhoto ? <Image src={blog.host.profilePhoto} alt="" width={28} height={28} /> : <UserCircle className="h-4 w-4" />}
                                            </div>
                                            <span className="text-xs uppercase tracking-tighter text-gray-700">{blog.host?.name || "Unknown Oracle"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge className={cn(
                                            "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none shadow-none",
                                            blog.isApproved ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                        )}>
                                            {blog.isApproved ? "Public Feed" : "Quarantined"}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex gap-4 items-center">
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <Eye className="h-3 w-3" />
                                                <span className="text-[10px] font-black">{blog.views}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <MessageSquare className="h-3 w-3" />
                                                <span className="text-[10px] font-black">{blog._count?.comments || 0}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right pr-10">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-gray-50 transition-all">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-2xl border-gray-100 shadow-2xl p-2 font-bold">
                                                <DropdownMenuLabel className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2">Mission Control</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-gray-50" />
                                                <DropdownMenuItem onClick={() => window.open(`/blogs/${blog.id}`, '_blank')} className="rounded-xl cursor-pointer py-3 transition-colors focus:bg-[#138bc9]/10 focus:text-[#138bc9]">
                                                    <Eye className="h-4 w-4 mr-3" />
                                                    <span>Preview Entry</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-gray-50" />
                                                <DropdownMenuItem
                                                    onClick={() => handleToggleApproval(blog)}
                                                    className={cn("rounded-xl cursor-pointer py-3 transition-colors", blog.isApproved ? "focus:bg-rose-50 focus:text-rose-600 text-rose-500" : "focus:bg-emerald-50 focus:text-emerald-600 text-emerald-500")}
                                                >
                                                    {blog.isApproved ? <XCircle className="h-4 w-4 mr-3" /> : <CheckCircle className="h-4 w-4 mr-3" />}
                                                    <span>{blog.isApproved ? "Deauthorize" : "Authorize"}</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(blog)}
                                                    className="rounded-xl cursor-pointer py-3 transition-colors focus:bg-red-50 focus:text-red-600 text-red-500"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-3" />
                                                    <span>Purge Chronicle</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-32 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="h-20 w-20 rounded-[35px] bg-gray-50 flex items-center justify-center text-gray-200">
                                            <FileText className="h-10 w-10" />
                                        </div>
                                        <p className="text-sm font-black uppercase tracking-widest">No chronicles matching protocol</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
