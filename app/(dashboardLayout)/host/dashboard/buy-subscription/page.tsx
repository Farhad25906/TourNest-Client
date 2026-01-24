"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Loader2,
  CreditCard,
  Shield,
  Zap,
  Users,
  FileText,
  Calendar,
  Star,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Infinity
} from "lucide-react";
import {
  getPublicSubscriptions,
  getCurrentSubscription,
  createSubscription,
  initiateSubscriptionPayment,
} from "@/services/subscription.service";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  tourLimit: number;
  blogLimit: number | null;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CurrentSubscription {
  id?: string;
  plan?: SubscriptionPlan;
  status?: string;
  isActive?: boolean;
  isFree?: boolean;
  tourLimit?: number;
  remainingTours?: number;
  blogLimit?: number | null;
  remainingBlogs?: number | null;
  startDate?: string;
  endDate?: string;
  message?: string;
  requiresPayment?: boolean;
  paymentId?: string;
  subscriptionId?: string;
}

export default function BuySubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansRes, subsRes] = await Promise.all([
        getPublicSubscriptions(),
        getCurrentSubscription()
      ]);

      if (plansRes.success) setPlans(plansRes.data);
      if (subsRes.success) {
        setCurrentSubscription(subsRes.data);
        if (subsRes.data.plan?.id) setSelectedPlan(subsRes.data.plan.id);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to synchronize subscription metadata");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubscribe = async (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    setProcessing(true);
    try {
      const result = await createSubscription(planId);
      if (!result.success) throw new Error(result.message);

      if (plan.price === 0) {
        toast.success("Internal membership activated!");
        await loadData();
      } else if (result.data?.subscriptionId) {
        const paymentRes = await initiateSubscriptionPayment(result.data.subscriptionId);
        if (paymentRes.success && paymentRes.data?.paymentUrl) {
          window.location.href = paymentRes.data.paymentUrl;
        } else {
          throw new Error("Payment gateway unreachable");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Checkout failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="relative h-20 w-20 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-[#138bc9]/10" />
          <div className="absolute inset-0 rounded-full border-4 border-[#138bc9] border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing Plans...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center space-y-6">
          <Badge className="bg-[#138bc9]/5 text-[#138bc9] border-none font-bold px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
            Membership tiers
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Scale your expedition empire.</h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
            Choose the membership that aligns with your growth trajectory. Unlock premium placement, extended listing capacity, and deep analytics.
          </p>

          {currentSubscription?.isActive && (
            <div className="inline-flex items-center gap-4 p-2 pl-6 pr-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-full shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#138bc9]" />
                <span className="text-xs font-black text-gray-700 uppercase tracking-tight">
                  Current: {currentSubscription.plan?.name}
                </span>
              </div>
              <Badge className="bg-emerald-500 text-white border-none text-[9px] font-black uppercase">Active</Badge>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12">
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {plans.filter(p => p.isActive).map((plan) => {
            const isCurrent = currentSubscription?.plan?.id === plan.id;
            const isFeatured = plan.name.toLowerCase().includes('gold') || plan.name.toLowerCase().includes('pro');

            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-[40px] border transition-all duration-500 overflow-hidden group",
                  isFeatured
                    ? "bg-[#138bc9] border-[#138bc9] text-white shadow-2xl shadow-[#138bc9]/20 -translate-y-4"
                    : "bg-white border-gray-100 text-gray-900 shadow-xl shadow-gray-200/50 hover:-translate-y-2"
                )}
              >
                {isFeatured && (
                  <div className="absolute top-6 right-8">
                    <Badge className="bg-white/20 text-white border-none backdrop-blur-md px-3 font-black text-[9px] uppercase tracking-widest">Recommended</Badge>
                  </div>
                )}

                <div className="p-10 space-y-8">
                  <div>
                    <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                    <p className={cn("text-sm font-medium", isFeatured ? "text-blue-100/80" : "text-gray-400")}>{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black">${plan.price}</span>
                    <span className={cn("text-xs font-bold uppercase tracking-widest", isFeatured ? "text-blue-100/60" : "text-gray-400")}>
                      /{plan.duration} Month{plan.duration > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className={cn("p-4 rounded-2xl flex items-center justify-between", isFeatured ? "bg-white/10" : "bg-gray-50")}>
                      <div className="flex items-center gap-2">
                        <Zap className={cn("h-4 w-4", isFeatured ? "text-amber-400" : "text-[#138bc9]")} />
                        <span className="text-[11px] font-black uppercase tracking-widest">Listing Capacity</span>
                      </div>
                      <span className="text-lg font-black">{plan.tourLimit}</span>
                    </div>
                    <div className={cn("p-4 rounded-2xl flex items-center justify-between", isFeatured ? "bg-white/10" : "bg-gray-50")}>
                      <div className="flex items-center gap-2">
                        <FileText className={cn("h-4 w-4", isFeatured ? "text-amber-400" : "text-[#138bc9]")} />
                        <span className="text-[11px] font-black uppercase tracking-widest">Storytelling</span>
                      </div>
                      <span className="text-lg font-black">{plan.blogLimit === null ? <Infinity className="h-5 w-5" /> : plan.blogLimit}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isFeatured ? "text-blue-100/50" : "text-gray-400")}>Everything Included:</p>
                    <ul className="space-y-3">
                      {plan.features.slice(0, 5).map((f, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className={cn("h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5", isFeatured ? "bg-white/20" : "bg-emerald-50 text-emerald-500")}>
                            <Check className="h-3 w-3" />
                          </div>
                          <span className={cn("text-xs font-bold", isFeatured ? "text-blue-50" : "text-gray-600")}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={processing || isCurrent}
                    className={cn(
                      "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all duration-300 shadow-lg",
                      isFeatured
                        ? "bg-white text-[#138bc9] hover:bg-blue-50 hover:scale-[1.02] shadow-black/10"
                        : "bg-gray-900 text-white hover:bg-black hover:scale-[1.02]"
                    )}
                  >
                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : isCurrent ? "Active Position" : "Secure Placement"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Rapid Growth", desc: "Accelerate your tour revenue with premium search priority.", icon: TrendingUp, color: "text-[#138bc9]", bg: "bg-blue-50" },
            { title: "Direct Settlements", desc: "Fast payouts directly to your connected bank through Stripe.", icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-50" },
            { title: "Secure Protocol", desc: "Every transaction is shielded with enterprise-grade encryption.", icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-50" },
            { title: "Global Network", desc: "Connect with tens of thousands of travelers every month.", icon: Users, color: "text-amber-500", bg: "bg-amber-50" }
          ].map((benefit, i) => (
            <div key={i} className="space-y-4 p-8 rounded-[30px] border border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500">
              <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center", benefit.bg, benefit.color)}>
                <benefit.icon className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-gray-900 uppercase text-[11px] tracking-widest">{benefit.title}</h4>
                <p className="text-xs font-medium text-gray-500 leading-relaxed">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ - Specialized */}
        <div className="mt-32 max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-gray-900">Information Center</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Everything you need to know about membership</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {[
              { q: "Membership versatility?", a: "Transition between tiers at any phase. Enhancements apply instantaneously while downgrades synchronize at the next interval." },
              { q: "Currency & Settlements?", a: "All transactions are denominated in USD. Settlements clear our gateway within 48-72 business hours after expedition completion." },
              { q: "Refund Protocols?", a: "Membership fees are final once processed. However, we offer prorated credits for internal tier upgrades." },
              { q: "Global Accessibility?", a: "Memberships are available to certified hosts globally. Some regional processor restrictions may apply depending on your location." }
            ].map((faq, i) => (
              <div key={i} className="space-y-3">
                <h4 className="font-black text-gray-900 text-sm">{faq.q}</h4>
                <p className="text-xs font-medium text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-32 pt-16 border-t border-gray-100 flex flex-col items-center gap-8 opacity-50">
          <div className="flex items-center gap-8 grayscale opacity-70">
            <Shield className="h-6 w-6" />
            <CreditCard className="h-6 w-6" />
            <LockIcon className="h-5 w-5" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Institutional Grade Security Shielding</p>
        </div>
      </div>
    </div>
  );
}

function LockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}