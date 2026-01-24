"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createHost } from "@/services/auth/auth.services";
import Link from "next/link";
import { toast } from "sonner";
import {
  UserPlus,
  Image as ImageIcon,
  Mail,
  Lock,
  Phone,
  Home,
  FileText,
  Sparkles,
  X,
  ShieldCheck,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateHostForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createHost, null);
  const [profilePreview, setProfilePreview] = useState<string>("");

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (state?.success) {
      toast.success("Host authorized successfully!");
      router.push("/admin/dashboard/users-management");
    }
  }, [state, router]);

  return (
    <div className="container mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Link href="/admin/dashboard/users-management" className="text-xs font-black text-[#138bc9] uppercase tracking-widest flex items-center gap-1 hover:underline mb-2">
              <ChevronLeft className="h-3 w-3" />
              Back to Registry
            </Link>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Authorize New Host</h1>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#138bc9]" />
              Initialize guide credentials for the global network
            </p>
          </div>
        </div>

        <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center space-y-6">
              <div className="relative group">
                <div className="h-32 w-32 rounded-[40px] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#138bc9]/50">
                  {profilePreview ? (
                    <img src={profilePreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-gray-300" />
                  )}
                </div>
                <input
                  type="file"
                  name="file"
                  id="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                />
                <label
                  htmlFor="file"
                  className="absolute -bottom-2 -right-2 h-10 w-10 bg-white shadow-lg border border-gray-100 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all active:scale-95"
                >
                  <Sparkles className="h-4 w-4 text-[#138bc9]" />
                </label>
              </div>
              <div>
                <h3 className="font-black text-gray-900 uppercase text-[10px] tracking-widest">Guide Identity</h3>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Recommended dimensions 500x500px</p>
              </div>

              <div className="w-full pt-4 border-t border-gray-50 flex flex-col gap-3">
                <div className="flex items-center gap-3 px-4 py-3 bg-blue-50/50 rounded-2xl border border-blue-100/30">
                  <Lock className="h-3 w-3 text-[#138bc9]" />
                  <span className="text-[9px] font-black text-[#138bc9] uppercase tracking-widest text-left">Encrypted Storage</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/30">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest text-left">Official Credentials</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fields Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8">
              {state?.errors && (
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 space-y-1">
                  {state.errors.map((err, i) => (
                    <p key={i} className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                      <X className="h-3 w-3" />
                      {err.message}
                    </p>
                  ))}
                </div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Identity Name</Label>
                    <div className="relative">
                      <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input name="name" placeholder="Protocol Name" className="pl-12 h-12 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-[#138bc9]/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Active Email Sync</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input name="email" type="email" placeholder="guide@tournest.io" className="pl-12 h-12 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-[#138bc9]/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Access Passcode</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input name="password" type="password" placeholder="At least 6 characters" className="pl-12 h-12 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-[#138bc9]/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Telecom Sync</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input name="phone" placeholder="+1 (000) 000-0000" className="pl-12 h-12 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-[#138bc9]/20" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hometown Node</Label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input name="hometown" placeholder="City, Country" className="pl-12 h-12 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-[#138bc9]/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Professional Narrative</Label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                    <Textarea name="bio" placeholder="Brief chronicle of professional travel expertise..." className="pl-12 min-h-[120px] rounded-[30px] border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-[#138bc9]/20 resize-none py-4" />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                <Link href="/admin/dashboard/users-management">
                  <Button type="button" variant="ghost" className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-gray-900 transition-colors">Terminate Operation</Button>
                </Link>
                <Button
                  disabled={isPending}
                  className="h-14 px-10 rounded-2xl bg-[#138bc9] hover:bg-[#138bc9]/90 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-[#138bc9]/20 transition-all active:scale-95"
                >
                  {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authorize Host Registry"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}