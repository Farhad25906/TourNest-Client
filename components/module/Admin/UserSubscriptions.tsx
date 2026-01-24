"use client";

import React, { useState, useEffect } from 'react';
import {
    Users,
    Calendar,
    CreditCard,
    Clock,
    ShieldCheck,
    XCircle,
    CheckCircle,
    RefreshCw,
    Search,
    Filter,
    ArrowUpDown
} from 'lucide-react';
import { getAllSubscriptions } from '@/services/subscription.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function UserSubscriptions() {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const loadSubscriptions = async () => {
        try {
            setLoading(true);
            const res = await getAllSubscriptions();
            if (res.success) {
                setSubscriptions(res.data || []);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubscriptions();
    }, []);

    const filteredSubscriptions = subscriptions.filter(sub =>
        sub.host?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.host?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.plan?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col gap-2">
                    <div className="h-10 w-64 bg-gray-100 animate-pulse rounded-2xl" />
                    <div className="h-5 w-96 bg-gray-50 animate-pulse rounded-xl" />
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-[30px]" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 italic">Subscription Registry</h1>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-[#138bc9]" />
                        Active Monetization Nodes & Host Protocols
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={loadSubscriptions} variant="outline" className="rounded-2xl border-gray-100 font-bold text-gray-400 gap-2 hover:bg-gray-50 h-12 px-6">
                        <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                        Refresh Registry
                    </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search Host Identification or Protocol Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-14 rounded-[20px] border-none bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-[#138bc9]/20"
                    />
                </div>
                <Button variant="outline" className="h-14 px-6 rounded-[20px] border-none bg-white shadow-sm text-gray-500 font-bold gap-2">
                    <Filter className="h-4 w-4" />
                    Protocol Filter
                </Button>
            </div>

            {/* Catalog */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="text-left p-6 font-black uppercase tracking-widest text-[10px] text-gray-400">Host Identity</th>
                                <th className="text-left p-6 font-black uppercase tracking-widest text-[10px] text-gray-400">Protocol Tier</th>
                                <th className="text-left p-6 font-black uppercase tracking-widest text-[10px] text-gray-400">Status</th>
                                <th className="text-left p-6 font-black uppercase tracking-widest text-[10px] text-gray-400">Temporal Range</th>
                                <th className="text-left p-6 font-black uppercase tracking-widest text-[10px] text-gray-400">Transactions</th>
                                <th className="text-right p-6 font-black uppercase tracking-widest text-[10px] text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredSubscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-20 text-center">
                                        <Users className="h-12 w-12 mx-auto text-gray-200 mb-4" />
                                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No active signatures identified in the registry</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredSubscriptions.map((sub) => (
                                    <tr key={sub.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-[18px] bg-blue-50 flex items-center justify-center text-[#138bc9] font-black text-xs shrink-0 overflow-hidden border-2 border-white shadow-sm">
                                                    {sub.host?.profilePhoto ? (
                                                        <img src={sub.host.profilePhoto} alt="" className="h-full w-full object-cover" />
                                                    ) : (
                                                        sub.host?.name?.[0]?.toUpperCase() || 'H'
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 leading-none mb-1">{sub.host?.name || "Anonymous Host"}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{sub.host?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-gray-800 uppercase tracking-tighter">{sub.plan?.name}</p>
                                                <p className="text-[10px] font-bold text-[#138bc9] uppercase tracking-widest">${sub.plan?.price || 0} Tier</p>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <Badge className={cn(
                                                "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest",
                                                sub.status === 'ACTIVE' ? "bg-emerald-50 text-emerald-600 border-none shadow-sm shadow-emerald-100" :
                                                    sub.status === 'PENDING' ? "bg-amber-50 text-amber-600 border-none" :
                                                        "bg-red-50 text-red-600 border-none"
                                            )}>
                                                {sub.status === 'ACTIVE' ? <CheckCircle className="h-3 w-3 mr-1 inline" /> : <Clock className="h-3 w-3 mr-1 inline" />}
                                                {sub.status}
                                            </Badge>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                                                    <Calendar className="h-3 w-3 text-gray-300" />
                                                    {format(new Date(sub.startDate), 'MMM dd, yyyy')}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                    <Clock className="h-3 w-3 text-gray-200" />
                                                    {format(new Date(sub.endDate), 'MMM dd, yyyy')}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="h-4 w-4 text-gray-300" />
                                                <span className="text-xs font-black text-gray-700">{sub.payments?.length || 0}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-[#138bc9] transition-all">
                                                <ArrowUpDown className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
