"use client";

import { useState, useEffect } from "react";
import { getUserPaymentHistory } from "@/services/payment.service";
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  CreditCard,
  Calendar,
  Briefcase,
  Sparkles,
  DollarSign,
  History,
  ShieldCheck,
  ArrowUpRight,
  MapPin
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { format } from "date-fns";

const PAYMENT_STATUS_OPTIONS = [
  { value: "COMPLETED", label: "Success", color: "bg-emerald-50 text-emerald-600" },
  { value: "PENDING", label: "Pending", color: "bg-amber-50 text-amber-600" },
  { value: "FAILED", label: "Failed", color: "bg-rose-50 text-rose-600" },
  { value: "REFUNDED", label: "Refunded", color: "bg-purple-50 text-purple-600" },
];

export default function UserPaymentHistory() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalSpent: 0,
    completedPayments: 0,
    pendingPayments: 0,
    refundedAmount: 0,
  });

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getUserPaymentHistory();
      if (res.success) {
        setPayments(res.data || []);
        const calculated = { totalSpent: 0, completedPayments: 0, pendingPayments: 0, refundedAmount: 0 };
        res.data?.forEach((p: any) => {
          if (p.status === "COMPLETED") { calculated.totalSpent += p.amount; calculated.completedPayments++; }
          else if (p.status === "PENDING") calculated.pendingPayments++;
          else if (p.status === "REFUNDED") calculated.refundedAmount += p.amount;
        });
        setStats(calculated);
      }
    } catch (error) {
      toast.error("Failed to sync financial ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const formatDate = (d: any) => {
    try { return format(new Date(d), "MMM dd, yyyy"); }
    catch { return "N/A"; }
  };

  const filteredPayments = payments.filter(p =>
    p.booking?.tour?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col gap-2">
          <div className="h-10 w-64 bg-gray-100 animate-pulse rounded-2xl" />
          <div className="h-5 w-96 bg-gray-50 animate-pulse rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-gray-50 animate-pulse rounded-[30px]" />)}
        </div>
        <TableSkeleton columnCount={6} rowCount={8} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Financial Ledger</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#138bc9]" />
            Audit trail for all your expedition settlements
          </p>
        </div>
        <Button onClick={fetchHistory} variant="outline" className="rounded-2xl border-gray-100 font-bold text-gray-500 gap-2 hover:bg-[#138bc9]/5 hover:text-[#138bc9] transition-all">
          <RefreshCw className="h-4 w-4" />
          Sync Ledger
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total Invested", value: formatCurrency(stats.totalSpent), sub: `Across ${stats.completedPayments} journeys`, icon: DollarSign, color: "text-white", bg: "bg-[#138bc9]", primary: true },
          { label: "Awaiting Clearance", value: stats.pendingPayments, sub: "Pending processing", icon: History, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Success Rate", value: "100%", sub: "Zero failed settlements", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Refunds Issued", value: formatCurrency(stats.refundedAmount), sub: "Total balance returned", icon: ArrowUpRight, color: "text-purple-600", bg: "bg-purple-50" }
        ].map((stat, i) => (
          <Card key={i} className={cn("border-none shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-md", stat.primary ? stat.bg : "bg-white")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", stat.primary ? "text-white/70" : "text-gray-400")}>{stat.label}</p>
                  <h3 className={cn("text-3xl font-black leading-none", stat.primary ? "text-white" : "text-gray-900")}>{stat.value}</h3>
                  <p className={cn("text-[9px] font-bold uppercase tracking-tighter mt-2", stat.primary ? "text-white/60" : "text-gray-400")}>{stat.sub}</p>
                </div>
                <div className={cn("p-3 rounded-[20px] transition-all duration-300 group-hover:scale-110", stat.primary ? "bg-white/20 text-white" : cn(stat.bg, stat.color))}>
                  <stat.icon className="h-6 w-6" />
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
              placeholder="Search by expedition or transaction ID..."
              className="pl-12 rounded-2xl border-gray-50 bg-gray-50/50 h-12 font-medium focus-visible:ring-[#138bc9]/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="h-10 px-4 rounded-xl border-gray-100 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
              {filteredPayments.length} Entries
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-y border-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-black text-[10px] text-gray-400 uppercase tracking-widest">Expedition Journey</th>
                <th className="px-6 py-4 text-left font-black text-[10px] text-gray-400 uppercase tracking-widest">Transaction Details</th>
                <th className="px-6 py-4 text-left font-black text-[10px] text-gray-400 uppercase tracking-widest">Settled Amount</th>
                <th className="px-6 py-4 text-left font-black text-[10px] text-gray-400 uppercase tracking-widest">Cleared Date</th>
                <th className="px-6 py-4 text-right font-black text-[10px] text-gray-400 uppercase tracking-widest pr-8">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/30 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#138bc9] shrink-0 group-hover:scale-110 transition-transform">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate max-w-[200px]">{p.booking?.tour?.title || "Tour Settlement"}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <MapPin className="h-3 w-3 text-gray-300" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase truncate">{p.booking?.tour?.destination || "Horizon"}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[11px] font-mono text-gray-500 uppercase">{p.transactionId || "INTERNAL_XFER"}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Badge variant="outline" className="px-1.5 py-0 rounded-md text-[8px] font-black uppercase bg-gray-50 border-gray-100 text-gray-400">{p.paymentMethod || "GATEWAY"}</Badge>
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">ID: {p.id.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-black text-gray-900 text-base">{formatCurrency(p.amount, p.currency)}</div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">Standard Currency</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-black text-gray-600 uppercase tracking-tighter">
                        <Calendar className="h-3.5 w-3.5 text-[#138bc9]" />
                        {formatDate(p.paidAt || p.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right pr-8">
                      <Badge className={cn(
                        "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none shadow-none",
                        PAYMENT_STATUS_OPTIONS.find(s => s.value === p.status)?.color || "bg-gray-100 text-gray-500"
                      )}>
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 rounded-[25px] bg-gray-50 flex items-center justify-center text-gray-200">
                        <CreditCard className="h-8 w-8" />
                      </div>
                      <div className="max-w-xs mx-auto">
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest leading-none">No clear records</p>
                        <p className="text-[10px] font-bold text-gray-300 mt-2 uppercase tracking-tighter">Adjust your search protocol or synchronize the ledger.</p>
                      </div>
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