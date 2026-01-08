/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { UploadCloud, Loader2, Pencil } from "lucide-react";
import { updateBlog, IBlog } from "@/services/blog.service";
import { toast } from "sonner";

const BLOG_CATEGORIES = [
  "TRAVEL_TIPS",
  "DESTINATION_GUIDES",
  "TOUR_STORIES",
  "LOCAL_CULTURE",
  "FOOD_EXPERIENCES",
  "ADVENTURE_TALES",
];

interface UpdateBlogDialogProps {
  blog: IBlog;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateBlogDialog({
  blog,
  open,
  onOpenChange,
}: UpdateBlogDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    blog.coverImage || null
  );

  useEffect(() => {
    if (blog.coverImage) {
      setPreviewUrl(blog.coverImage);
    }
  }, [blog.coverImage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const result = await updateBlog(blog.id, formData);

      if (result.success) {
        toast.success("Success!Blog created successfully.");
        onOpenChange(false);
        router.refresh();

        // Reset file selection
        setSelectedFile(null);
      } else {
        toast.error(`Error ${result.message}`);
      }
    } catch (error: any) {
      toast.error(`Error `);
      console.error("Error updating blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Edit Blog
          </DialogTitle>
          <DialogDescription>Update your blog post details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Blog Title *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={blog.title}
                placeholder="Enter blog title"
                required
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt (Brief Summary)</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                defaultValue={blog.excerpt || ""}
                placeholder="Write a brief summary"
                maxLength={500}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Blog Content *</Label>
              <Textarea
                id="content"
                name="content"
                defaultValue={blog.content}
                placeholder="Write your blog content..."
                required
                rows={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select name="category" defaultValue={blog.category} required>
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

            {blog.coverImage && (
              <div className="space-y-2">
                <Label>Current Cover Image</Label>
                <div className="mt-2">
                  <img
                    src={blog.coverImage}
                    alt="Current cover"
                    className="w-48 h-32 object-cover rounded-lg"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="file">Upload New Cover Image</Label>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="file-upload-update"
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  <UploadCloud className="h-5 w-5" />
                  <span>Choose new file</span>
                  <Input
                    id="file-upload-update"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Label>
                {selectedFile && (
                  <span className="text-sm text-muted-foreground">
                    {selectedFile.name}
                  </span>
                )}
              </div>
              {previewUrl && !blog.coverImage?.includes(previewUrl) && (
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    alt="New preview"
                    className="w-48 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select name="status" defaultValue={blog.status} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Blog
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
