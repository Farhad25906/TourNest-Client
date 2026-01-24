"use client";

import React from 'react';
import {
    Heart,
    Sparkles,
    Compass,
    ChevronRight,
    MapPin,
    Briefcase,
    Globe,
    Activity,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const FavoritesPage = () => {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tight text-gray-900 italic">Expedition Wishlist</h1>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                    Teleported destinations awaiting your command
                </p>
            </div>

            {/* Filter Hub */}
            <div className="bg-white rounded-[30px] border border-gray-100 p-2 shadow-sm flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search your saved horizons..."
                        className="pl-12 rounded-2xl border-none bg-gray-50/50 h-14 font-medium focus-visible:ring-[#138bc9]/20"
                    />
                </div>
                <div className="flex gap-2 p-1">
                    <Badge variant="outline" className="h-10 px-4 rounded-xl border-gray-100 font-bold text-gray-400 uppercase text-[10px] tracking-widest">
                        0 Collections
                    </Badge>
                </div>
            </div>

            {/* Empty State / Upcoming Feature */}
            <div className="relative overflow-hidden bg-white border border-gray-100 rounded-[50px] shadow-xl shadow-gray-200/40 p-20 text-center space-y-8 group">
                {/* Decorative Elements */}
                <div className="absolute top-[-100px] left-[-100px] h-64 w-64 bg-blue-50/50 rounded-full blur-3xl group-hover:bg-blue-100/50 transition-colors duration-1000" />
                <div className="absolute bottom-[-100px] right-[-100px] h-64 w-64 bg-purple-50/50 rounded-full blur-3xl group-hover:bg-purple-100/50 transition-colors duration-1000" />

                <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto space-y-6">
                    <div className="h-24 w-24 rounded-[40px] bg-gray-50 flex items-center justify-center text-gray-200 border-2 border-dashed border-gray-200 mb-4 animate-bounce duration-3000">
                        <Compass className="h-12 w-12" />
                    </div>

                    <div className="space-y-3">
                        <Badge className="bg-blue-50 text-[#138bc9] border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest mb-4">Upcoming Protocol</Badge>
                        <h2 className="text-4xl font-black text-gray-900 leading-tight tracking-tighter uppercase italic">Your Personal Horizon Board</h2>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed uppercase tracking-tighter">We are initializing the wishlist synchronization protocol. Soon you will be able to bookmark global expeditions and curate your own journey manifest.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 w-full pt-10">
                        <div className="space-y-2">
                            <div className="mx-auto h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-[#138bc9]"><Globe className="h-5 w-5" /></div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Global Reach</p>
                        </div>
                        <div className="space-y-2">
                            <div className="mx-auto h-10 w-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500"><Heart className="h-5 w-5" /></div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Favorites</p>
                        </div>
                        <div className="space-y-2">
                            <div className="mx-auto h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500"><Activity className="h-5 w-5" /></div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Real-time Stats</p>
                        </div>
                    </div>

                    <div className="pt-10">
                        <Button className="h-14 px-10 rounded-3xl bg-[#138bc9] hover:bg-[#138bc9]/90 text-white font-black uppercase text-[11px] tracking-widest shadow-xl shadow-[#138bc9]/20 transition-all active:scale-95 group">
                            Explore Current Deployments
                            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* System Intelligence Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900 p-10 rounded-[45px] text-white flex items-center justify-between group overflow-hidden relative">
                    <Sparkles className="absolute top-[-20px] right-[-20px] h-32 w-32 opacity-10 rotate-12" />
                    <div className="relative z-10 space-y-4">
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter">AI Discovery</h4>
                        <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Based on your recent telemetry</p>
                        <Button variant="outline" className="h-10 border-white/20 text-white bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10">Initialize Analysis</Button>
                    </div>
                    <div className="relative z-10 h-20 w-20 rounded-[30px] bg-white/10 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                        <Briefcase className="h-10 w-10 text-[#138bc9]" />
                    </div>
                </div>

                <div className="bg-[#138bc9] p-10 rounded-[45px] text-white flex items-center justify-between group overflow-hidden relative">
                    <Globe className="absolute top-[-20px] right-[-20px] h-32 w-32 opacity-10 rotate-12" />
                    <div className="relative z-10 space-y-4">
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter">Global Hub</h4>
                        <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">View Trending Expeditions</p>
                        <Button variant="outline" className="h-10 border-white/20 text-white bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10">View Network</Button>
                    </div>
                    <div className="relative z-10 h-20 w-20 rounded-[30px] bg-white/10 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                        <MapPin className="h-10 w-10 text-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FavoritesPage;