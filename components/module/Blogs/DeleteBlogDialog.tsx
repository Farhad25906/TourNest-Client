/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, Trash2 } from "lucide-react"
import { deleteBlog } from "@/services/blog.service"
import { toast } from "sonner"

interface DeleteBlogDialogProps {
  blogId: string
  blogTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteBlogDialog({ blogId, blogTitle, open, onOpenChange }: DeleteBlogDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    
    try {
      const result = await deleteBlog(blogId)
      
      if (result.success) {
        toast.success("Success!Blog created successfully.");
        onOpenChange(false)
        router.refresh()
      } else {
        toast.error(`Error ${result.message}`);
      }
    } catch (error: any) {
      toast.error(`Error `);
      console.error("Error deleting blog:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Blog
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the blog post &quot;{blogTitle}&quot;? 
            This action cannot be undone. All comments and likes associated with this blog will also be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Blog
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}