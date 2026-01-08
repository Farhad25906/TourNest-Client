/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { UploadCloud, Loader2 } from "lucide-react";
import { createBlog } from "@/services/blog.service";
import { toast } from "sonner";

const BLOG_CATEGORIES = [
  "TRAVEL_TIPS",
  "DESTINATION_GUIDES",
  "TOUR_STORIES",
  "LOCAL_CULTURE",
  "FOOD_EXPERIENCES",
  "ADVENTURE_TALES",
];

export function CreateBlogDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    status: "DRAFT",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formDataObj = new FormData();

    // Create data object from state (EXACTLY like tour form)
    const blogData = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      status: formData.status,
    };

    console.log("Blog data being sent:", blogData); // Debug

    // Append as JSON string in "data" field (EXACTLY like tour)
    formDataObj.append("data", JSON.stringify(blogData));

    // Append file if selected
    if (selectedFile) {
      formDataObj.append("file", selectedFile);
    }

    // Debug: Log what's in FormData
    console.log("FormData contents:");
    for (const [key, value] of formDataObj.entries()) {
      console.log(
        key,
        value instanceof File ? `File: ${value.name}` : `Value: ${value}`
      );
    }

    try {
      const result = await createBlog(formDataObj);

      if (result.success) {
        toast.success("Success! Blog created successfully.");
        setOpen(false);
        router.refresh();

        // Reset everything
        setFormData({
          title: "",
          excerpt: "",
          content: "",
          category: "",
          status: "DRAFT",
        });
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
      } else {
        console.error("Create blog error:", result);
        toast.error(result.message || "Failed to create blog");
      }
    } catch (error: any) {
      console.error("Error creating blog:", error);
      toast.error(`Error: ${error.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Revoke previous URL to prevent memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDialogClose = () => {
    // Clean up preview URL when dialog closes
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      status: "DRAFT",
    });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleDialogClose();
        } else {
          setOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>Create New Blog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Blog Post</DialogTitle>
          <DialogDescription>
            Share your travel experiences and insights with the community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Blog Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a catchy title for your blog"
                required
                maxLength={200}
                disabled={loading}
                value={formData.title}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Maximum 200 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt (Brief Summary)</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                placeholder="Write a brief summary of your blog post"
                maxLength={500}
                rows={3}
                disabled={loading}
                value={formData.excerpt}
                onChange={handleInputChange}
              />
              <p className="text-xs text-muted-foreground">
                Maximum 500 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Blog Content *</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your blog content here..."
                required
                rows={8}
                disabled={loading}
                value={formData.content}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                required
                disabled={loading}
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {BLOG_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Upload Cover Image</Label>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="file-upload"
                  className={`cursor-pointer flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg transition-colors ${
                    loading
                      ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <UploadCloud className="h-5 w-5" />
                  <span>Choose file</span>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                </Label>
                {selectedFile && (
                  <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {selectedFile.name}
                  </span>
                )}
              </div>
              {previewUrl && (
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Recommended size: 1200x630px. Max file size: 5MB.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                disabled={loading}
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Save as Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Publish Now</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleDialogClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create Blog"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
