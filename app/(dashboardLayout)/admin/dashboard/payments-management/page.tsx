"use client";

import { useState, useEffect } from "react";
import { getAllPayments } from "@/services/payment.service";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  DollarSign,
  TrendingUp,
  Activity,
  CreditCard,
  Briefcase,
  ShieldCheck,
  UserCircle,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/date-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { cn } from "@/lib/utils";

const PAYMENT_STATUS_OPTIONS = [
  { value: "COMPLETED", label: "Settled", color: "bg-emerald-50 text-emerald-600" },
  { value: "PENDING", label: "In Pipeline", color: "bg-amber-50 text-amber-600" },
  { value: "FAILED", label: "Rejected", color: "bg-rose-50 text-rose-600" },
  { value: "REFUNDED", label: "Returned", color: "bg-purple-50 text-purple-600" },
];

export default function AdminPaymentsManagement() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalAmount: 0, totalTransactions: 0, statusCounts: {} as any });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await getAllPayments();
      if (res.success) {
        setPayments(res.data?.payments || []);
        setStats(res.data?.stats || { totalAmount: 0, totalTransactions: 0, statusCounts: {} });
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchPayments(); }, []);

  const formatCurrency = (amt: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amt);

  const filteredPayments = payments.filter(p =>
    p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.booking?.tour?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && payments.length === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-gray-50 animate-pulse rounded-[30px]" />)}
        </div>
        <TableSkeleton columnCount={8} rowCount={10} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Financial Terminal</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#138bc9]" />
            Global settlement oversight and revenue analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchPayments} variant="outline" className="rounded-2xl border-gray-100 font-bold text-gray-500 gap-2 hover:bg-gray-50">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Sync Pipeline
          </Button>
          <Button variant="outline" className="rounded-2xl border-gray-100 font-bold text-gray-500 gap-2 hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export Ledger
          </Button>
        </div>
      </div>

      {/* Finance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Gross Settlement", value: formatCurrency(stats.totalAmount), sub: "Total network revenue", icon: DollarSign, color: "text-white", bg: "bg-[#138bc9]", primary: true },
          { label: "Clearing volume", value: stats.totalTransactions, sub: "Processed transactions", icon: Activity, iconRef: Activity, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Protocol Integrity", value: `${Math.round(((stats.statusCounts?.COMPLETED || 0) / (stats.totalTransactions || 1)) * 100)}%`, sub: "Success velocity", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Median Payload", value: formatCurrency(stats.totalTransactions > 0 ? stats.totalAmount / stats.totalTransactions : 0), sub: "Avg. ticket value", icon: Sparkles, color: "text-purple-600", bg: "bg-purple-50" }
        ].map((item, i) => (
          <Card key={i} className={cn("border-none shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-md", item.primary ? item.bg : "bg-white")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", item.primary ? "text-white/70" : "text-gray-400")}>{item.label}</p>
                  <h3 className={cn("text-2xl font-black leading-none", item.primary ? "text-white" : "text-gray-900")}>{item.value}</h3>
                  <p className={cn("text-[9px] font-bold uppercase tracking-tighter mt-2", item.primary ? "text-white/60" : "text-gray-400")}>{item.sub}</p>
                </div>
                <div className={cn("p-3 rounded-xl transition-all duration-300 group-hover:scale-110", item.primary ? "bg-white/20 text-white" : cn(item.bg, item.color))}>
                  {(item.iconRef ? <item.iconRef className="h-5 w-5" /> : <item.icon className="h-5 w-5" />)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white rounded-[30px] border border-gray-100 p-2 shadow-sm">
        <div className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Audit by transaction HASH, email or tour..."
              className="pl-12 rounded-2xl border-none bg-gray-50/50 h-14 font-medium focus-visible:ring-[#138bc9]/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="h-10 px-4 rounded-xl border-gray-100 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
              {filteredPayments.length} Transactions Registry
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-y border-gray-50 text-gray-400">
              <tr>
                <th className="px-8 py-5 text-left font-black text-[10px] uppercase tracking-widest pl-10">Settlement Identifier</th>
                <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Global Scout</th>
                <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Expedition Journey</th>
                <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Payload</th>
                <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Gateway</th>
                <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-right font-black text-[10px] uppercase tracking-widest pr-10">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/30 transition-all group">
                    <td className="px-8 py-5 pl-10">
                      <p className="text-[11px] font-mono font-black text-gray-400 uppercase">{p.transactionId || "INTERNAL"}</p>
                      <p className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter mt-0.5">UID_{p.id.slice(0, 8)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <UserCircle className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-gray-800 uppercase tracking-tighter truncate max-w-[120px]">{p.user?.tourist?.name || "Member"}</p>
                          <p className="text-[8px] font-bold text-gray-400 lowercase">{p.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="min-w-0">
                        <p className="text-xs font-black text-gray-900 line-clamp-1 group-hover:text-[#138bc9] transition-colors">{p.booking?.tour?.title || "Registry Sync"}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">Host: {p.booking?.tour?.host?.name || "System"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-gray-900">{formatCurrency(p.amount)}</p>
                      <p className="text-[8px] font-bold text-gray-400 uppercase">Settled</p>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="outline" className="px-2 py-0 rounded-md text-[8px] font-black uppercase bg-blue-50 border-blue-100 text-[#138bc9]">
                        {p.paymentMethod}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <Badge className={cn(
                        "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none shadow-none",
                        PAYMENT_STATUS_OPTIONS.find(s => s.value === p.status)?.color || "bg-gray-100 text-gray-500"
                      )}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-5 text-right pr-10">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-[#138bc9]/10 transition-all text-gray-400 hover:text-[#138bc9]">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 rounded-[25px] bg-gray-50 flex items-center justify-center text-gray-200">
                        <DollarSign className="h-8 w-8" />
                      </div>
                      <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No matching payloads identified</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
