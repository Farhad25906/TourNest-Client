"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInitials } from "@/lib/formatters";
import { updateProfile } from "@/services/auth/user.services";
import { UserInfo, SocialLinks, EmergencyContact, PreferenceSettings } from "@/types/user.interface";
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
  Briefcase,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Globe,
  Languages,
  Trophy,
  Users,
  Bell,
  Moon,
  Sun,
  Star,
  ShieldAlert,
  Heart
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface MyProfileProps {
  userInfo: UserInfo;
}

const MyProfile = ({ userInfo }: MyProfileProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const roleData = userInfo.role === "HOST" ? userInfo.host : userInfo.role === "ADMIN" ? userInfo.admin : (userInfo.tourist || userInfo.user);
  const userName = roleData?.name || userInfo.name || "User";
  const userEmail = roleData?.email || userInfo.email || "";
  const profilePhoto = roleData?.profilePhoto || userInfo.profilePhoto || "";

  // State for complex fields
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(roleData?.socialLinks || {});
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>((roleData as any)?.emergencyContact || { name: "", phone: "", relation: "" });
  const [preferences, setPreferences] = useState<PreferenceSettings>(roleData?.preferenceSettings || { theme: "light", notifications: true });

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

    // Append complex fields as JSON strings
    formData.append("socialLinks", JSON.stringify(socialLinks));
    formData.append("emergencyContact", JSON.stringify(emergencyContact));
    formData.append("preferenceSettings", JSON.stringify(preferences));

    startTransition(async () => {
      const res = await updateProfile(formData);
      if (res.success) {
        toast.success("Identity updated successfully");
        setPreviewImage(null);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 italic">Identity Command</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#138bc9]" />
            Manage your global explorer credentials and preferences
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Master Auth</span>
            <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-lg px-2 py-0.5 text-[9px] font-black">ENCRYPTED</Badge>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Left Sidebar: Profile Summary */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col items-center text-center space-y-6 sticky top-24">
            <div className="relative group">
              <div className="h-40 w-40 rounded-[50px] border-8 border-gray-50 shadow-inner overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                <Avatar className="h-full w-full rounded-none">
                  <AvatarImage src={previewImage || profilePhoto} className="object-cover" />
                  <AvatarFallback className="bg-[#138bc9] text-white text-4xl font-black">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <label htmlFor="file" className="absolute -bottom-2 -right-2 h-12 w-12 bg-[#138bc9] text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-xl hover:scale-110 active:scale-95 transition-all ring-4 ring-white">
                <Camera className="h-5 w-5" />
                <Input type="file" id="file" name="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">{userName}</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{userEmail}</p>

              {userInfo.role === 'HOST' && (
                <div className="flex items-center justify-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-3 w-3",
                        star <= (userInfo.host?.averageRating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                      )}
                    />
                  ))}
                  <span className="text-[10px] font-black text-gray-600 ml-1">{(userInfo.host?.averageRating || 0).toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="w-full space-y-4 pt-4 border-t border-gray-50">
              <Badge className={cn(
                "w-full justify-center rounded-xl py-2 text-[10px] font-black uppercase tracking-widest border-none shadow-none",
                userInfo.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : userInfo.role === 'HOST' ? 'bg-blue-100 text-[#138bc9]' : 'bg-emerald-100 text-emerald-700'
              )}>
                {userInfo.role} Registry
              </Badge>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50/50 p-3 rounded-2xl text-center">
                  <span className="block text-[8px] font-black text-gray-400 uppercase tracking-tighter mb-1">Status</span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase">Active</span>
                </div>
                <div className="bg-gray-50/50 p-3 rounded-2xl text-center">
                  <span className="block text-[8px] font-black text-gray-400 uppercase tracking-tighter mb-1">Verify</span>
                  <span className="text-[10px] font-black text-[#138bc9] uppercase">Level 1</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="w-full space-y-3">
              {userInfo.role === 'HOST' && (
                <>
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Network Score</span>
                    <span className="text-[10px] font-black text-gray-900">98%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#138bc9] w-[98%] rounded-full" />
                  </div>
                </>
              )}
              {userInfo.role === 'TOURIST' && (
                <>
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Explorer XP</span>
                    <span className="text-[10px] font-black text-gray-900">Level 12</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[70%] rounded-full" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Main Content: Tabs */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="manifest" className="w-full">
            <TabsList className="bg-transparent border-b border-gray-100 w-full justify-start rounded-none h-auto p-0 mb-8 overflow-x-auto scrollbar-hide">
              <TabsTrigger value="manifest" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#138bc9] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400 data-[state=active]:text-[#138bc9]">
                Core Manifest
              </TabsTrigger>
              <TabsTrigger value="social" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#138bc9] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400 data-[state=active]:text-[#138bc9]">
                Social & Intel
              </TabsTrigger>
              <TabsTrigger value="travel" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#138bc9] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400 data-[state=active]:text-[#138bc9]">
                Network Logs
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#138bc9] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-400 data-[state=active]:text-[#138bc9]">
                Protocols
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manifest" className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-500 mt-0">
              <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identity Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input name="name" defaultValue={userName} className="pl-12 h-14 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-[#138bc9]/20 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Communication</Label>
                    <div className="relative opacity-60">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input value={userEmail} disabled className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-100 cursor-not-allowed font-bold" />
                    </div>
                  </div>

                  {userInfo.role === 'HOST' && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Telecom Link</Label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input name="phone" defaultValue={(roleData as any).phone || ""} className="pl-12 h-14 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-[#138bc9]/20" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hometown Node</Label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input name="hometown" defaultValue={(roleData as any)?.hometown || ""} className="pl-12 h-14 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-[#138bc9]/20" />
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
                          <Input name="location" defaultValue={(roleData as any)?.location || ""} className="pl-12 h-14 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-[#138bc9]/20" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Link</Label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input name="contactNumber" defaultValue={(roleData as any)?.contactNumber || ""} className="pl-12 h-14 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-[#138bc9]/20" />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Personal Narrative</Label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-5 h-4 w-4 text-gray-400" />
                    <textarea name="bio" defaultValue={(roleData as any)?.bio || ""} className="w-full min-h-[160px] pl-12 pr-6 py-5 rounded-[35px] border-gray-50 bg-gray-50/50 font-bold focus:ring-4 focus:ring-[#138bc9]/10 outline-none resize-none transition-all placeholder:text-gray-300" placeholder="Tell the network about your journey..." />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-500 mt-0">
              <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-10">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                  <Globe className="h-5 w-5 text-[#138bc9]" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Digital Footprint</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Instagram Proxy</Label>
                    <div className="relative">
                      <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-500" />
                      <Input value={socialLinks.instagram || ""} onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })} placeholder="https://instagram.com/..." className="pl-12 h-14 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-pink-500/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Facebook Gateway</Label>
                    <div className="relative">
                      <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                      <Input value={socialLinks.facebook || ""} onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })} placeholder="https://facebook.com/..." className="pl-12 h-14 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-blue-600/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">X / Twitter Node</Label>
                    <div className="relative">
                      <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-400" />
                      <Input value={socialLinks.twitter || ""} onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })} placeholder="https://twitter.com/..." className="pl-12 h-14 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-sky-400/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">LinkedIn Signal</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-700" />
                      <Input value={socialLinks.linkedin || ""} onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." className="pl-12 h-14 rounded-2xl border-gray-50 bg-gray-50/50 font-bold focus-visible:ring-blue-700/10" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 space-y-6">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-[#138bc9]" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Achievements & Recognition</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {["Early Adopter", "Verified Guide", "Top Earner", "Community Leader"].map((badge) => (
                      <Badge key={badge} className="bg-gray-50 text-gray-600 border border-gray-100 hover:bg-[#138bc9] hover:text-white transition-colors duration-300 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider cursor-default">
                        {badge}
                      </Badge>
                    ))}
                    <Badge className="bg-[#138bc9]/10 text-[#138bc9] border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-wider italic">
                      + Add Discovery
                    </Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="travel" className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-500 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-900 p-8 rounded-[40px] text-white flex flex-col justify-between aspect-square">
                  <div className="p-4 bg-white/10 w-fit rounded-2xl"><DollarSign className="h-6 w-6 text-[#138bc9]" /></div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Total Liquidity</span>
                    <h4 className="text-3xl font-black italic">
                      ${userInfo.role === 'HOST' ? (userInfo.host?.totalEarnings || 0) : (userInfo.tourist?.totalSpent || 0)}
                    </h4>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl flex flex-col justify-between aspect-square">
                  <div className="p-4 bg-blue-50 w-fit rounded-2xl"><Briefcase className="h-6 w-6 text-[#138bc9]" /></div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Engagements</span>
                    <h4 className="text-3xl font-black text-gray-900 italic">
                      {userInfo.role === 'HOST' ? (userInfo.host?.currentTourCount || 0) : (userInfo.tourist?.visitedCountries?.split(',').length || 0)}
                    </h4>
                  </div>
                </div>
                <div className="bg-[#138bc9] p-8 rounded-[40px] text-white flex flex-col justify-between aspect-square">
                  <div className="p-4 bg-white/20 w-fit rounded-2xl"><Star className="h-6 w-6 text-white" /></div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em]">Network Trust</span>
                    <h4 className="text-3xl font-black italic">
                      {userInfo.role === 'HOST' ? (userInfo.host?.averageRating || 0).toFixed(1) : "Elite"}
                    </h4>
                  </div>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                  <Heart className="h-5 w-5 text-red-500" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Favorite Coordinates</h4>
                </div>
                <div className="flex flex-wrap gap-4">
                  {((roleData as any)?.favorites || ["Tokyo, Japan", "Swiss Alps", "Santorini"]).map((place: string) => (
                    <div key={place} className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 hover:border-[#138bc9]/30 transition-all">
                      <MapPin className="h-3 w-3 text-[#138bc9]" />
                      <span className="text-[11px] font-bold text-gray-700">{place}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-500 mt-0">
              <div className="bg-white p-10 rounded-[50px] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-10">
                <div className="space-y-8">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                    <ShieldAlert className="h-5 w-5 text-amber-500" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Security & Recovery</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Emergency Alias</Label>
                      <Input
                        value={emergencyContact.name}
                        onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                        className="h-14 rounded-2xl border-gray-50 bg-gray-50/50 font-bold"
                        placeholder="Contact Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Emergency Signal Path</Label>
                      <Input
                        value={emergencyContact.phone}
                        onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                        className="h-14 rounded-2xl border-gray-50 bg-gray-50/50 font-bold"
                        placeholder="+1-000-000-0000"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-50 space-y-8">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-[#138bc9]" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Protocol Preferences</h4>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[30px]">
                      <div className="space-y-1">
                        <h5 className="text-[11px] font-black uppercase tracking-wider text-gray-900">Network Alerts</h5>
                        <p className="text-[10px] font-bold text-gray-400">Receive real-time push signals for activity</p>
                      </div>
                      <Switch
                        checked={preferences.notifications}
                        onCheckedChange={(val) => setPreferences({ ...preferences, notifications: val })}
                        className="data-[state=checked]:bg-[#138bc9]"
                      />
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[30px]">
                      <div className="space-y-1">
                        <h5 className="text-[11px] font-black uppercase tracking-wider text-gray-900">Interface Mode</h5>
                        <p className="text-[10px] font-bold text-gray-400">Switch between Solar and Lunar visualization</p>
                      </div>
                      <div className="flex bg-white p-1 rounded-xl gap-1">
                        <button
                          type="button"
                          onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                          className={cn("p-2 rounded-lg transition-all", preferences.theme === 'light' ? "bg-amber-50 text-amber-600" : "text-gray-300")}
                        >
                          <Sun className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                          className={cn("p-2 rounded-lg transition-all", preferences.theme === 'dark' ? "bg-slate-900 text-slate-100" : "text-gray-300")}
                        >
                          <Moon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Dock */}
          <div className="mt-10 bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl flex items-center justify-between">
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">
              Last Registry Sync: {new Date(userInfo.updatedAt).toLocaleDateString()}
            </div>
            <Button
              disabled={isPending}
              className="h-16 px-12 rounded-[500px] bg-[#138bc9] hover:bg-[#138bc9]/90 text-white font-black uppercase tracking-widest text-[12px] shadow-2xl shadow-[#138bc9]/30 transition-all active:scale-95 flex items-center gap-4 group"
            >
              {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 group-hover:rotate-12 transition-transform" />}
              Synchronize Manifest
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;