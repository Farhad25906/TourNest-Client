"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Send,
  Eye,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { likeBlog, commentOnBlog, IBlog } from "@/services/blog.service";
import { useAuthClient } from "@/hooks/use-auth-client";
import { toast } from "sonner";

interface BlogCardProps {
  blog: IBlog;
}

export function BlogCardPublic({ blog }: BlogCardProps) {
  const router = useRouter();
  const { isAuthenticated, login, user } = useAuthClient();

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(blog.likesCount);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error(`Login Required!! Please login to like this blog`);
      login();
      return;
    }

    try {
      setLiking(true);
      const result = await likeBlog(blog.id);

      if (result.success) {
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      toast.error(`Error liking blog`);
    } finally {
      setLiking(false);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - posted.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <article className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
      {/* Author Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-full bg-cover bg-center border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            <Image
              src={blog.host?.profilePhoto || "https://lh3.googleusercontent.com/a/default-user=s120-c-no"}
              alt={blog.host?.name || "Host"}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-slate-900 dark:text-slate-100 font-bold text-[15px] leading-tight hover:underline cursor-pointer">
              {blog.host?.name || "Travel Host"}
            </h3>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[13px]">
              <span>{getTimeAgo(blog.createdAt)}</span>
              <span>•</span>
              <span className="material-symbols-outlined text-[14px]">public</span>
            </div>
          </div>
        </div>
        <button className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      {/* Post Content Text */}
      <div className="px-4 pb-3">
        <h2 className="text-slate-900 dark:text-slate-100 font-bold mb-1">{blog.title}</h2>
        <p className="text-slate-800 dark:text-slate-200 text-[15px] leading-normal line-clamp-3">
          {blog.content}
        </p>
        <div className="mt-2 flex gap-2">
          <span className="text-primary hover:underline cursor-pointer text-sm font-medium">#{blog.category.toLowerCase().replace(/_/g, "")}</span>
        </div>
      </div>

      {/* Featured Image */}
      {blog.coverImage && (
        <div className="w-full bg-slate-100 dark:bg-slate-800 min-h-[300px] relative">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            width={800}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Social Stats */}
      <div className="px-4 py-3 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            <span className="z-20 bg-primary text-white size-5 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
              <span className="material-symbols-outlined text-[12px] fill-1">thumb_up</span>
            </span>
          </div>
          <span className="text-slate-500 dark:text-slate-400 text-[14px]">{likesCount}</span>
        </div>
        <div className="flex gap-3 text-slate-500 dark:text-slate-400 text-[14px]">
          <span>{blog._count?.comments || 0} comments</span>
        </div>
      </div>

      {/* Interaction Buttons */}
      <div className="flex p-1">
        <button
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-lg ${isLiked ? "text-primary" : "text-slate-600 dark:text-slate-400"}`}
          onClick={handleLike}
          disabled={liking}
        >
          <span className={`material-symbols-outlined ${isLiked ? "fill-1" : ""}`}>thumb_up</span> Like
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-lg">
          <span className="material-symbols-outlined">chat_bubble</span> Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-lg">
          <span className="material-symbols-outlined">share</span> Share
        </button>
      </div>
    </article>
  );
}
