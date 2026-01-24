"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInitials } from "@/lib/formatters";
import { updateProfile } from "@/services/auth/user.services";
import { UserInfo } from "@/types/user.interface";
import {
  Camera,
  Loader2,
  Save,
  ShieldCheck,
  Mail,
  User,
  MapPin,
  Phone,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  DollarSign,
  Briefcase
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MyProfileProps {
  userInfo: UserInfo;
}

const MyProfile = ({ userInfo }: MyProfileProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const roleData = userInfo.role === "HOST" ? userInfo.host : userInfo.role === "ADMIN" ? userInfo.admin : userInfo.tourist;
  const userName = roleData?.name || userInfo.name || "User";
  const userEmail = roleData?.email || userInfo.email || "";
  const profilePhoto = roleData?.profilePhoto || "";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileInput = document.getElementById("file") as HTMLInputElement;
    if (fileInput?.files?.[0]) formData.append("file", fileInput.files[0]);

    startTransition(async () => {
      const res = await updateProfile(formData);
      if (res.success) { toast.success("Identity updated"); setPreviewImage(null); router.refresh(); }
      else { toast.error(res.message); }
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 italic">Identity Profile</h1>
        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#138bc9]" />
          Manage your global explorer credentials and preferences
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Essential Identity */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="h-32 w-32 rounded-[40px] border-4 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <Avatar className="h-full w-full rounded-none">
                  <AvatarImage src={previewImage || profilePhoto} className="object-cover" />
                  <AvatarFallback className="bg-[#138bc9] text-white text-3xl font-black">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <label htmlFor="file" className="absolute -bottom-2 -right-2 h-10 w-10 bg-[#138bc9] text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all">
                <Camera className="h-4 w-4" />
                <Input type="file" id="file" name="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">{userName}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{userEmail}</p>
              <div className="pt-4">
                <Badge className={cn(
                  "rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest border-none shadow-none",
                  userInfo.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' : userInfo.role === 'HOST' ? 'bg-blue-50 text-[#138bc9]' : 'bg-emerald-50 text-emerald-600'
                )}>
                  {userInfo.role} Registry
                </Badge>
              </div>
            </div>

            <div className="w-full pt-6 border-t border-gray-50 space-y-3">
              <div className="flex items-center justify-between px-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol Status</span>
                <Badge variant="outline" className="border-emerald-100 text-emerald-500 bg-emerald-50 px-2 rounded-lg font-black text-[9px] uppercase tracking-tighter">Verified Node</Badge>
              </div>
              <div className="flex items-center justify-between px-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Encrypted Auth</span>
                <Badge variant="outline" className="border-blue-100 text-[#138bc9] bg-blue-50 px-2 rounded-lg font-black text-[9px] uppercase tracking-tighter">Active Sync</Badge>
              </div>
            </div>
          </div>

          {/* Role Specific Stats Card */}
          {userInfo.role === 'HOST' && (
            <div className="bg-gray-900 p-8 rounded-[40px] text-white space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl"><Briefcase className="h-4 w-4 text-[#138bc9]" /></div>
                <h4 className="text-sm font-black uppercase tracking-widest">Guide Metrics</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-white/50">Total Earnings</span>
                  <span className="text-lg font-black text-[#138bc9]">${(roleData as any).totalEarnings || 0}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-white/50">Network Deployments</span>
                  <span className="text-lg font-black text-white">{(roleData as any).currentTourCount || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Information Manifest */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-10">
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <Sparkles className="h-5 w-5 text-[#138bc9]" />
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Personal Declaration</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identity Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input name="name" defaultValue={userName} className="pl-12 h-12 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-[#138bc9]/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Communication Channel</Label>
                  <div className="relative opacity-60">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input value={userEmail} disabled className="pl-12 h-12 rounded-2xl border-gray-100 bg-gray-100 cursor-not-allowed font-bold" />
                  </div>
                </div>

                {userInfo.role === 'HOST' && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Telecom Link</Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input name="phone" defaultValue={(roleData as any).phone || ""} className="pl-12 h-12 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-[#138bc9]/20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hometown Node</Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input name="hometown" defaultValue={(roleData as any)?.hometown || ""} className="pl-12 h-12 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-[#138bc9]/20" />
                      </div>
                    </div>
                  </>
                )}

                {userInfo.role === 'TOURIST' && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Coordinates</Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input name="location" defaultValue={(roleData as any)?.location || ""} className="pl-12 h-12 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-[#138bc9]/20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Expedition Investment</Label>
                      <div className="relative opacity-60">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input value={`$${(roleData as any)?.totalSpent || 0}`} disabled className="pl-12 h-12 rounded-2xl border-gray-100 bg-gray-100 font-bold" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Professional / Personal Narrative</Label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                  <textarea name="bio" defaultValue={(roleData as any)?.bio || ""} className="w-full min-h-[120px] pl-12 pr-6 py-4 rounded-[30px] border-gray-50 bg-gray-50/50 font-bold focus:ring-2 focus:ring-[#138bc9]/20 outline-none resize-none" placeholder="Describe your professional journey..." />
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-gray-50 flex items-center justify-between">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                Last Synchronization: {new Date().toLocaleDateString()}
              </div>
              <Button
                disabled={isPending}
                className="h-14 px-12 rounded-2xl bg-[#138bc9] hover:bg-[#138bc9]/90 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-[#138bc9]/20 transition-all active:scale-95 flex items-center gap-3"
              >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                Commit Changes
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;