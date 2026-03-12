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
    MoreHorizontal,
    Edit,
    Trash2,
    Star,
    Loader2,
    Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
        description: "",
        isFeatured: false
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
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
                description: destination.description,
                isFeatured: destination.isFeatured
            });
            setImagePreview(destination.image);
            setSelectedFile(null);
        } else {
            setSelectedDestination(null);
            setFormData({ name: "", description: "", isFeatured: false });
            setImagePreview("");
            setSelectedFile(null);
        }
        setIsDialogOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setImagePreview("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const submitData = new FormData();
            const jsonData = {
                name: formData.name,
                description: formData.description,
                isFeatured: formData.isFeatured,
            };
            submitData.append('data', JSON.stringify(jsonData));
            if (selectedFile) {
                submitData.append('file', selectedFile);
            }

            let res;
            if (selectedDestination?.id) {
                res = await updateDestination(selectedDestination.id, submitData);
            } else {
                res = await createDestination(submitData);
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
            const toggleData = new FormData();
            toggleData.append('data', JSON.stringify({ isFeatured: !destination.isFeatured }));
            const res = await updateDestination(destination.id, toggleData);
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
                <Button
                    onClick={() => handleOpenDialog()}
                    className="rounded-2xl bg-[#138bc9] hover:bg-[#138bc9]/90 font-black gap-2 shadow-lg shadow-[#138bc9]/20 uppercase tracking-widest text-[10px] h-11 px-6 text-white"
                >
                    <Plus className="h-4 w-4" />
                    Add New Sector
                </Button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-[30px] border border-gray-100 p-2 shadow-sm">
                <div className="relative">
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

            {/* Upsert Dialog — fully responsive */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="
                    w-[calc(100vw-32px)] max-w-lg
                    rounded-[28px] sm:rounded-[40px]
                    border-none p-0 overflow-hidden shadow-2xl
                    max-h-[92dvh] flex flex-col
                ">
                    <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
                        {/* Scrollable body */}
                        <div className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-5 sm:space-y-6">
                            <DialogHeader>
                                <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 uppercase italic">
                                    {selectedDestination ? "Optimize Sector" : "Initialize Mapping"}
                                </DialogTitle>
                                <DialogDescription className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Configure orbital coordinates and visual data
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                {/* Sector Name */}
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

                                {/* Image Upload */}
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Visual Feed</Label>

                                    {imagePreview ? (
                                        /* Preview with remove button */
                                        <div className="relative rounded-2xl overflow-hidden border-2 border-gray-100">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-40 sm:h-48 object-cover"
                                            />
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="destructive"
                                                className="absolute top-2 right-2 h-8 w-8 rounded-xl"
                                                onClick={handleRemoveImage}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        /* Upload drop-zone */
                                        <label
                                            htmlFor="file-upload"
                                            className="flex flex-col items-center justify-center gap-3 w-full h-36 sm:h-44 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 cursor-pointer hover:border-[#138bc9]/40 hover:bg-[#138bc9]/5 transition-colors"
                                        >
                                            <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400">
                                                <Upload className="h-5 w-5" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-black text-gray-600 uppercase tracking-wider">Click to upload image</p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-0.5">PNG, JPG, WEBP accepted</p>
                                            </div>
                                            <Input
                                                id="file-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sector Brief</Label>
                                    <Textarea
                                        placeholder="Provide mission details..."
                                        className="rounded-2xl border-gray-100 min-h-[90px] sm:min-h-[100px] font-bold py-4 focus:ring-[#138bc9]/20 resize-none"
                                        value={formData.description || ""}
                                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>

                                {/* Featured toggle */}
                                <div className="flex items-center gap-2 pt-1">
                                    <input
                                        type="checkbox"
                                        id="isFeatured"
                                        className="h-5 w-5 rounded-md border-gray-100 text-[#138bc9] focus:ring-[#138bc9]/20"
                                        checked={formData.isFeatured}
                                        onChange={e => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                                    />
                                    <Label
                                        htmlFor="isFeatured"
                                        className="text-[10px] font-black uppercase tracking-widest text-gray-600 cursor-pointer"
                                    >
                                        Set as High Priority Sector
                                    </Label>
                                </div>
                            </div>
                        </div>

                        {/* Sticky footer */}
                        <DialogFooter className="bg-gray-50/70 border-t border-gray-100 p-4 sm:p-6 flex flex-row gap-2 shrink-0">
                            <Button
                                type="button"
                                variant="ghost"
                                className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-11 sm:h-12 flex-1"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Abort
                            </Button>
                            <Button
                                disabled={submitting}
                                className="rounded-2xl bg-[#138bc9] hover:bg-[#138bc9]/90 font-black uppercase tracking-widest text-[10px] h-11 sm:h-12 flex-1 text-white shadow-lg shadow-[#138bc9]/20"
                            >
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize Operation"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="
                    w-[calc(100vw-32px)] max-w-sm
                    rounded-[28px] sm:rounded-[40px]
                    border-none p-6 sm:p-8 shadow-2xl
                ">
                    <div className="text-center space-y-5 sm:space-y-6">
                        <div className="h-14 w-14 sm:h-16 sm:w-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto">
                            <Trash2 className="h-7 w-7 sm:h-8 sm:w-8" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-lg sm:text-xl font-black text-gray-900 uppercase">Redact Sector?</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter leading-relaxed">
                                You are about to purge{" "}
                                <span className="text-gray-900">"{selectedDestination?.name}"</span>{" "}
                                from the global registry. This protocol is irreversible.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                className="rounded-2xl h-11 sm:h-12 flex-1 font-black uppercase tracking-widest text-[10px]"
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                Abort
                            </Button>
                            <Button
                                disabled={submitting}
                                variant="destructive"
                                className="rounded-2xl h-11 sm:h-12 flex-1 font-black uppercase tracking-widest text-[10px] bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200"
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