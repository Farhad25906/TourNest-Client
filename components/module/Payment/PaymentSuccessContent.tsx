"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Home, ArrowRight, Sparkles, Receipt, PartyPopper } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (sessionId) {
      setTimeout(() => {
        setStatus("success");
      }, 1500);
    } else {
      setStatus("error");
    }
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#138bc9]/20 border-t-[#138bc9] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center font-black text-[10px] text-[#138bc9]">TN</div>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-gray-400 animate-pulse text-center">Encrypting Manifest...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="border-none shadow-2xl shadow-rose-200/50 rounded-[40px] overflow-hidden bg-white">
            <div className="p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
                <CheckCircle2 className="h-10 w-10 text-rose-500 rotate-180" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black italic tracking-tighter text-gray-900 uppercase">Registry Error</h1>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-tight leading-relaxed px-4">
                  Unable to authorize the transaction payload. Please check your dashboard for manual verification.
                </p>
              </div>
              <div className="pt-4 space-y-3">
                <Button asChild className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-black uppercase tracking-widest text-xs shadow-lg transition-all">
                  <Link href="/user/dashboard/my-bookings">Sync Reservations</Link>
                </Button>
                <Link href="/" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#138bc9] transition-colors">Abort & Return Home</Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/30 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[50px] overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20">
          {/* Header Accent */}
          <div className="h-3 bg-gradient-to-r from-[#138bc9] to-emerald-400" />

          <CardContent className="p-12 text-center space-y-8">
            {/* Success Icon Animation */}
            <div className="relative mx-auto w-24 h-24">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                className="w-24 h-24 bg-emerald-500 rounded-[32px] flex items-center justify-center shadow-xl shadow-emerald-200 relative z-20"
              >
                <CheckCircle2 className="h-12 w-12 text-white" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-x-0 bottom-0 top-0 bg-emerald-500/20 rounded-[32px] z-10"
              />
              <Sparkles className="absolute -top-4 -right-4 h-8 w-8 text-amber-400 hidden sm:block" />
              <PartyPopper className="absolute -bottom-4 -left-4 h-8 w-8 text-blue-400 hidden sm:block" />
            </div>

            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-black italic tracking-tighter text-gray-900 uppercase leading-none"
              >
                Manifest Signed
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm font-bold text-gray-400 uppercase tracking-widest"
              >
                Expedition protocol fully authorized
              </motion.p>
            </div>

            {/* Transaction Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-50/50 border border-gray-100 rounded-[32px] p-8 space-y-4"
            >
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-4 mb-2">
                <div className="flex items-center gap-2">
                  <Receipt className="h-3 w-3" />
                  Registry Audit
                </div>
                <div className="text-emerald-500">Verified Node</div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Cipher Key</span>
                  <span className="font-mono text-[11px] font-black text-gray-900 bg-white px-3 py-1 rounded-full shadow-sm">
                    {sessionId?.slice(0, 16)}...
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-500 uppercase tracking-tighter">Temporal Stamp</span>
                  <span className="font-black text-gray-900 uppercase">{new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-4 space-y-4"
            >
              <Button asChild className="w-full h-16 rounded-[22px] bg-[#138bc9] hover:bg-[#138bc9]/90 text-white font-black uppercase tracking-[0.15em] text-xs shadow-2xl shadow-blue-200/50 group">
                <Link href="/user/dashboard/my-bookings" className="flex items-center justify-center gap-3">
                  Check Reservations
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <div className="flex items-center gap-4">
                <Button variant="outline" asChild className="flex-1 h-14 rounded-[22px] border-gray-100 hover:bg-gray-50 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                  <Link href="/">
                    <Home className="mr-2 h-3.5 w-3.5" />
                    Back Hub
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="flex-1 h-14 rounded-[22px] text-gray-400 hover:text-gray-900 font-black uppercase tracking-widest text-[10px]">
                  <Link href="/tours">
                    New Journey
                  </Link>
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Support Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]"
        >
          Having discrepancies? <span className="text-[#138bc9] cursor-pointer hover:underline">Contact Ground Control</span>
        </motion.p>
      </motion.div>
    </div>
  );
}