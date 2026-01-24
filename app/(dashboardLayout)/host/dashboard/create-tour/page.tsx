import CreateTourForm from "@/components/module/Tour/create-tour-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Sparkles, MapPin } from "lucide-react";

export default function CreateTourPage() {
    return (
        <div className="container mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Blueprint Expedition</h1>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#138bc9]" />
                        Architect a new experience for global travelers
                    </p>
                </div>

                <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white">
                    <div className="bg-[#138bc9] p-8 text-white">
                        <CardHeader className="p-0">
                            <div className="flex items-center gap-2 mb-2 opacity-80">
                                <MapPin className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Expedition details</span>
                            </div>
                            <CardTitle className="text-2xl font-black">Tour Configuration</CardTitle>
                            <CardDescription className="text-blue-100 font-medium opacity-90 text-sm">
                                Provide comprehensive details to showcase your expertise. High-quality descriptions and images lead to 40% higher conversion rates.
                            </CardDescription>
                        </CardHeader>
                    </div>
                    <CardContent className="p-8 md:p-12">
                        <CreateTourForm />
                    </CardContent>
                </Card>

                <div className="p-8 bg-blue-50/50 rounded-[30px] border border-blue-100/50 flex items-start gap-4">
                    <div className="h-8 w-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                        <Sparkles className="h-4 w-4 text-[#138bc9]" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Pro Tip: Media Matters</h4>
                        <p className="text-xs font-medium text-gray-500 mt-1 leading-relaxed">
                            Upload high-resolution images of the destination to capture imagination. Be specific with your itinerary to manage travelers' expectations effectively.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}