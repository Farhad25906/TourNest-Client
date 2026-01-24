"use client";

import { useState, useEffect } from "react";
import {
  ApiResponse,
  getHostEarnings,
  type IEarningsData,
} from "@/services/payment.service";
import {
  Download,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Sparkles,
  CreditCard,
  History,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  PieChart as PieIcon,
  Calendar,
  Clock,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { formatCurrency } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { format } from "date-fns";

const PAYMENT_STATUS_OPTIONS = [
  { value: "COMPLETED", label: "Settled", color: "bg-emerald-50 text-emerald-600" },
  { value: "PENDING", label: "In Pipeline", color: "bg-amber-50 text-amber-600" },
  { value: "FAILED", label: "Rejected", color: "bg-rose-50 text-rose-600" },
  { value: "REFUNDED", label: "Returned", color: "bg-purple-50 text-purple-600" },
];

export default function HostEarningsDashboard() {
  const [earningsData, setEarningsData] = useState<IEarningsData>({
    payments: [],
    summary: { totalEarnings: 0, totalTransactions: 0, pendingBalance: 0, totalEarningsToDate: 0 },
    earningsByMonth: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const res = await getHostEarnings();
      if (res.success && res.data) setEarningsData(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchEarnings(); }, []);

  const formatDate = (d: any) => d ? format(new Date(d), "MMM dd, yyyy") : "N/A";

  const chartData = earningsData.earningsByMonth.map(m => ({ name: m.month, earnings: m.earnings }));
  const COLORS = ["#138bc9", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

  if (loading) return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2"><div className="h-10 w-64 bg-gray-100 animate-pulse rounded-2xl" /><div className="h-5 w-96 bg-gray-50 animate-pulse rounded-xl" /></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">{[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-gray-50 animate-pulse rounded-[30px]" />)}</div>
      <TableSkeleton columnCount={7} rowCount={10} />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 italic">Financial Manifest</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#138bc9]" />
            Official guide settlement oversight and revenue telemetry
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchEarnings} variant="outline" className="rounded-2xl border-gray-100 font-bold text-gray-400 gap-2 hover:bg-gray-50 h-12 px-6">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Sync Ledger
          </Button>
          <Button variant="outline" className="rounded-2xl border-gray-100 font-bold text-gray-400 gap-2 hover:bg-gray-50 h-12 px-6">
            <Download className="h-4 w-4" />
            Audit Report
          </Button>
        </div>
      </div>

      {/* Finance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Net Earnings", value: formatCurrency(earningsData.summary.totalEarnings), sub: "Total guide paycheck", icon: DollarSign, color: "text-white", bg: "bg-[#138bc9]", primary: true },
          { label: "Awaiting Clearance", value: formatCurrency(earningsData.summary.pendingBalance), sub: "On-hold pipeline", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Success Velocity", value: earningsData.summary.totalTransactions, sub: "Cleared expeditions", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Lifetime Payload", value: formatCurrency(earningsData.summary.totalEarningsToDate), sub: "Total generated value", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" }
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
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        {/* Area Chart */}
        <Card className="lg:col-span-4 border-none shadow-sm bg-white overflow-hidden rounded-[40px]">
          <CardHeader className="p-10 pb-0">
            <CardTitle className="text-xl font-black text-gray-800 uppercase tracking-tighter">Monetization Velocity</CardTitle>
            <CardDescription className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Guide revenue trajectory across intervals</CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#138bc9" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#138bc9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '20px',
                      border: 'none',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                      padding: '15px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#138bc9"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorEar)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Action Panel */}
        <div className="lg:col-span-3 space-y-8">
          <Card className="border-none shadow-sm bg-[#138bc9] text-white rounded-[40px] overflow-hidden flex flex-col justify-center p-10 space-y-6">
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black italic tracking-tighter leading-tight uppercase">Ready for Withdrawal?</h3>
              <p className="text-white/60 text-xs font-medium leading-relaxed">Your settled funds are available for clearance. Standard bank processing timeframe applies.</p>
            </div>
            <Button className="w-full h-14 rounded-3xl bg-white text-gray-900 font-black uppercase text-[11px] tracking-widest shadow-xl shadow-black/10 hover:bg-gray-50 transition-all">Command Payout</Button>
          </Card>

          <div className="bg-white p-6 rounded-[40px] border border-gray-100 flex items-center justify-between group cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#138bc9] flex items-center justify-center">
                <PieIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tax Documents</p>
                <p className="text-sm font-black text-gray-900">Annual Manifest 2024</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-[40px] border border-gray-100 overflow-hidden bg-white shadow-xl shadow-gray-200/40">
        <table className="w-full">
          <thead className="bg-gray-50/50 border-b border-gray-50 text-gray-400">
            <tr>
              <th className="px-8 py-5 text-left font-black text-[10px] uppercase tracking-widest pl-10">Settlement Identifier</th>
              <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Expedition Node</th>
              <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Payload</th>
              <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Cleared Date</th>
              <th className="px-6 py-5 text-left font-black text-[10px] uppercase tracking-widest">Protocol Status</th>
              <th className="px-8 py-5 text-right font-black text-[10px] uppercase tracking-widest pr-10">Ops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {earningsData.payments.length > 0 ? (
              earningsData.payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/30 transition-all group">
                  <td className="px-8 py-5 pl-10">
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono font-black text-gray-400 uppercase">HASH_{p.id.slice(0, 8).toUpperCase()}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="outline" className="px-1.5 py-0 rounded-md text-[8px] font-black uppercase bg-blue-50 border-blue-100 text-[#138bc9]">{p.paymentMethod}</Badge>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-black text-gray-900 text-sm line-clamp-1 group-hover:text-[#138bc9] transition-colors">{p.booking?.tour?.title || "Manual Payout"}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Expedition Clearance</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-base font-black text-gray-900">{formatCurrency(p.amount)}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-600 uppercase tracking-tighter">
                      <Calendar className="h-3.5 w-3.5 text-[#138bc9]" />
                      {formatDate(p.paidAt || p.createdAt)}
                    </div>
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
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-[#138bc9]/10 transition-all text-gray-300 hover:text-[#138bc9]">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-32 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-20 w-20 rounded-[35px] bg-gray-50 flex items-center justify-center text-gray-200">
                      <DollarSign className="h-10 w-10" />
                    </div>
                    <p className="text-sm font-black uppercase tracking-widest">Ledger Empty</p>
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
