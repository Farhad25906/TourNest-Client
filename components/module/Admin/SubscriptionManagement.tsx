"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Pencil,
  Trash2,
  Plus,
  Package,
  CheckCircle,
  Calendar,
  Loader2,
  ShieldCheck,
  Zap,
  Globe,
  Star,
  RefreshCw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import {
  getAllSubscriptionPlans,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  createSubscriptionPlan
} from '@/services/subscription.service';
import SubscriptionPlanModal from './SubscriptionPlanModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function SubscriptionManagement() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await getAllSubscriptionPlans();
      if (res.success) setPlans(res.data || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadPlans(); }, []);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const res = selectedPlan ? await updateSubscriptionPlan(selectedPlan.id, formData) : await createSubscriptionPlan(formData);
      if (res.success) { toast.success("Monetization protocol updated"); setIsModalOpen(false); loadPlans(); }
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Redact plan: ${name}?`)) return;
    setIsDeleting(true);
    try {
      const res = await deleteSubscriptionPlan(id);
      if (res.success) { toast.success("Tier redacted"); loadPlans(); }
    } finally { setIsDeleting(false); }
  };

  if (loading) return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2"><div className="h-10 w-64 bg-gray-100 animate-pulse rounded-2xl" /><div className="h-5 w-96 bg-gray-50 animate-pulse rounded-xl" /></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{[1, 2, 3].map(i => <div key={i} className="h-[500px] bg-gray-50 animate-pulse rounded-[40px]" />)}</div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 italic">Monetization Engine</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#138bc9]" />
            Manage expedition guide tiers and service privileges
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadPlans} variant="outline" className="rounded-2xl border-gray-100 font-bold text-gray-400 gap-2 hover:bg-gray-50 h-12 px-6">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Sync Tiers
          </Button>
          <Button onClick={() => { setSelectedPlan(null); setIsModalOpen(true); }} className="rounded-2xl bg-[#138bc9] hover:bg-[#138bc9]/90 font-black gap-2 shadow-lg shadow-[#138bc9]/20 uppercase tracking-widest text-[10px] h-12 px-8">
            <Plus className="h-4 w-4" />
            Forge New Tier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-white rounded-[40px] border border-gray-100 border-dashed">
            <Package className="h-16 w-16 mx-auto text-gray-200 mb-4" />
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No tiers defined in the registry</p>
          </div>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="relative group perspective-1000">
              <div className="bg-white rounded-[45px] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 flex flex-col h-full">
                {/* Visual Header */}
                <div className={cn(
                  "p-10 text-white relative overflow-hidden shrink-0",
                  plan.name.toLowerCase().includes('premium') ? "bg-gray-900" : plan.name.toLowerCase().includes('standard') ? "bg-[#138bc9]" : "bg-gray-500"
                )}>
                  <Sparkles className="absolute top-[-20px] right-[-20px] h-40 w-40 opacity-10 rotate-12" />
                  <div className="relative z-10 space-y-4">
                    <div className="flex justify-between items-start">
                      <Badge className="bg-white/20 text-white border-none py-1 px-3 rounded-full font-black text-[9px] uppercase tracking-widest">{plan.isActive ? 'Active Node' : 'Suspended'}</Badge>
                      {plan.name.toLowerCase().includes('premium') && <Star className="h-5 w-5 text-amber-400 fill-amber-400" />}
                    </div>
                    <div>
                      <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{plan.name}</h3>
                      <p className="text-white/60 font-medium text-xs mt-2 line-clamp-1">{plan.description}</p>
                    </div>
                    <div className="pt-2">
                      <span className="text-5xl font-black tracking-tighter">${plan.price}</span>
                      <span className="text-white/50 font-black text-[10px] uppercase tracking-widest ml-2">/ {plan.duration} Month Protocol</span>
                    </div>
                  </div>
                </div>

                {/* Features & Metrics */}
                <div className="p-10 space-y-8 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-3xl space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Expeditions</p>
                      <p className="text-xl font-black text-gray-900 leading-none">{plan.tourLimit}</p>
                      <p className="text-[8px] font-bold text-gray-400 uppercase leading-none">Global Nodes</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-3xl space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Manifests</p>
                      <p className="text-xl font-black text-gray-900 leading-none">{plan.blogLimit === null ? 'UNLTD' : plan.blogLimit}</p>
                      <p className="text-[8px] font-bold text-gray-400 uppercase leading-none">Chronicled</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 pb-2">Enabled Privileges</p>
                    <ul className="space-y-3">
                      {plan.features.map((f: string, i: number) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                          </div>
                          <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tight">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Orchestration Controls */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-50 grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => { setSelectedPlan(plan); setIsModalOpen(true); }}
                    variant="ghost"
                    className="h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#138bc9]/10 hover:text-[#138bc9]"
                  >
                    <Pencil className="h-3 w-3 mr-2" />
                    Optimize
                  </Button>
                  <Button
                    onClick={() => handleDelete(plan.id, plan.name)}
                    disabled={isDeleting}
                    variant="ghost"
                    className="h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest text-red-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Redact
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <SubscriptionPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        selectedPlan={selectedPlan}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}