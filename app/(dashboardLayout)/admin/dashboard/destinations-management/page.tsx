"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    getAllDestinations,
    createDestination,
    updateDestination,
    deleteDestination,
    IDestination
} from "@/services/destination.service";
import {
    MapPin,
    Search,
    Plus,
    RefreshCw,
    MoreHorizontal,
    Edit,
    Trash2,
    Star,
    Image as ImageIcon,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function DestinationsManagementPage() {
    const [destinations, setDestinations] = useState<IDestination[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState<IDestination | null>(null);
    const [formData, setFormData] = useState<Partial<IDestination>>({
        name: "",
        image: "",
        description: "",
        isFeatured: false
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchDestinations = async () => {
        try {
            setLoading(true);
            const res = await getAllDestinations({ searchTerm });
            if (res.success) {
                setDestinations(res.data || []);
            }
        } catch (error) {
            toast.error("Failed to sync destination records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchDestinations(), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleOpenDialog = (destination?: IDestination) => {
        if (destination) {
            setSelectedDestination(destination);
            setFormData({
                name: destination.name,
                image: destination.image,
                description: destination.description,
                isFeatured: destination.isFeatured
            });
        } else {
            setSelectedDestination(null);
            setFormData({
                name: "",
                image: "",
                description: "",
                isFeatured: false
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let res;
            if (selectedDestination?.id) {
                res = await updateDestination(selectedDestination.id, formData);
            } else {
                res = await createDestination(formData as IDestination);
            }

            if (res.success) {
                toast.success(selectedDestination ? "Registry updated" : "New sector mapped");
                setIsDialogOpen(false);
                fetchDestinations();
            } else {
                toast.error(res.message || "Protocol failure");
            }
        } catch (error: any) {
            toast.error(error.message || "Operation failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleFeatured = async (destination: IDestination) => {
        try {
            if (!destination.id) return;
            const res = await updateDestination(destination.id, { isFeatured: !destination.isFeatured });
            if (res.success) {
                toast.success(`Priority protocol ${!destination.isFeatured ? 'activated' : 'deactivated'}`);
                fetchDestinations();
            }
        } catch (error) {
            toast.error("Status adjustment failed");
        }
    };

    const handleDelete = async () => {
        if (!selectedDestination?.id) return;
        setSubmitting(true);
        try {
            const res = await deleteDestination(selectedDestination.id);
            if (res.success) {
                toast.success("Sector redacted from records");
                setIsDeleteDialogOpen(false);
                fetchDestinations();
            }
        } catch (error) {
            toast.error("Redaction failure");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Orbital Mapping</h1>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#138bc9]" />
                        Manage global sectors and high-priority destinations
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleOpenDialog()}
                        className="rounded-2xl bg-[#138bc9] hover:bg-[#138bc9]/90 font-black gap-2 shadow-lg shadow-[#138bc9]/20 uppercase tracking-widest text-[10px] h-11 px-6 text-white"
                    >
                        <Plus className="h-4 w-4" />
                        Add New Sector
                    </Button>
                </div>
            </div>

            {/* Filters Hub */}
            <div className="bg-white rounded-[30px] border border-gray-100 p-2 shadow-sm flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Scan for sector names or coordinates..."
                        className="pl-12 rounded-2xl border-none bg-gray-50/50 h-14 font-medium focus-visible:ring-[#138bc9]/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-[40px] border border-gray-100" />
                    ))
                ) : (
                    destinations.map((dest) => (
                        <div
                            key={dest.id}
                            className="group bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500 relative"
                        >
                            <div className="absolute top-6 right-6 z-10 flex gap-2">
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className={cn(
                                        "rounded-xl h-9 w-9 backdrop-blur-md transition-all duration-300",
                                        dest.isFeatured ? "bg-amber-100 text-amber-600 border-amber-200" : "bg-white/80 text-gray-400 border-white/20"
                                    )}
                                    onClick={(e) => { e.preventDefault(); handleToggleFeatured(dest); }}
                                >
                                    <Star className={cn("h-4 w-4", dest.isFeatured && "fill-amber-600")} />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="secondary" className="rounded-xl h-9 w-9 bg-white/80 border-white/20 backdrop-blur-md">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-2xl border-gray-100 p-2 font-bold">
                                        <DropdownMenuItem
                                            className="rounded-xl cursor-pointer py-2.5"
                                            onClick={() => handleOpenDialog(dest)}
                                        >
                                            <Edit className="h-4 w-4 mr-2" /> Modify Sector
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="rounded-xl cursor-pointer py-2.5 text-red-500 focus:bg-red-50 focus:text-red-600"
                                            onClick={() => { setSelectedDestination(dest); setIsDeleteDialogOpen(true); }}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" /> Redact Record
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={dest.image}
                                    alt={dest.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                            </div>

                            <div className="p-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter line-clamp-1">{dest.name}</h3>
                                    {dest.isFeatured && (
                                        <Badge className="bg-amber-50 text-amber-600 border-none text-[8px] font-black uppercase px-2 rounded-md">Priority</Badge>
                                    )}
                                </div>
                                <p className="text-gray-500 text-xs font-medium leading-relaxed line-clamp-2 h-8">{dest.description || "No sector brief available."}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Empty State */}
            {!loading && destinations.length === 0 && (
                <div className="py-20 text-center bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100">
                    <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-200">
                        <MapPin className="h-10 w-10" />
                    </div>
                    <p className="text-lg font-black text-gray-900 tracking-tight">No Sectors Identified</p>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-tighter">Initiate "Add New Sector" protocol to populate mapping</p>
                </div>
            )}

            {/* Upsert Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md rounded-[40px] border-none p-0 overflow-hidden shadow-2xl">
                    <form onSubmit={handleSubmit}>
                        <div className="p-8 space-y-6">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black tracking-tight text-gray-900 uppercase italic">
                                    {selectedDestination ? "Optimize Sector" : "Initialize Mapping"}
                                </DialogTitle>
                                <DialogDescription className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                    Configure orbital coordinates and visual data
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sector Identity</Label>
                                    <Input
                                        required
                                        placeholder="Enter designation (e.g., Kyoto, Japan)"
                                        className="rounded-2xl border-gray-100 h-12 font-bold focus:ring-[#138bc9]/20"
                                        value={formData.name}
                                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visual Feed (URL)</Label>
                                    <Input
                                        required
                                        placeholder="Enter image protocol URL"
                                        className="rounded-2xl border-gray-100 h-12 font-bold focus:ring-[#138bc9]/20"
                                        value={formData.image}
                                        onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sector Brief</Label>
                                    <Textarea
                                        placeholder="Provide mission details..."
                                        className="rounded-2xl border-gray-100 min-h-[100px] font-bold py-4 focus:ring-[#138bc9]/20"
                                        value={formData.description || ""}
                                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="isFeatured"
                                        className="h-5 w-5 rounded-md border-gray-100 text-[#138bc9] focus:ring-[#138bc9]/20"
                                        checked={formData.isFeatured}
                                        onChange={e => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                                    />
                                    <Label htmlFor="isFeatured" className="text-[10px] font-black uppercase tracking-widest text-gray-600 cursor-pointer">Set as High Priority Sector</Label>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="bg-gray-50/50 p-6 flex gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 flex-1"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Abort
                            </Button>
                            <Button
                                disabled={submitting}
                                className="rounded-2xl bg-[#138bc9] hover:bg-[#138bc9]/90 font-black uppercase tracking-widest text-[10px] h-12 flex-1 text-white shadow-lg shadow-[#138bc9]/20"
                            >
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize Operation"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-sm rounded-[40px] border-none p-8 shadow-2xl">
                    <div className="text-center space-y-6">
                        <div className="h-16 w-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto">
                            <Trash2 className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-gray-900 uppercase">Redact Sector?</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter leading-relaxed">
                                You are about to purge <span className="text-gray-900">"{selectedDestination?.name}"</span> from the global registry. This protocol is irreversible.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                className="rounded-2xl h-12 flex-1 font-black uppercase tracking-widest text-[10px]"
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                Abort
                            </Button>
                            <Button
                                disabled={submitting}
                                variant="destructive"
                                className="rounded-2xl h-12 flex-1 font-black uppercase tracking-widest text-[10px] bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200"
                                onClick={handleDelete}
                            >
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Redaction"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
