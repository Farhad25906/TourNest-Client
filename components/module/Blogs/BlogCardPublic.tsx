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
  console.log(isAuthenticated,login,user);
  

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
        toast.success("Success!Blog created successfully.");
      }
    } catch (error) {
      toast.error(`Error `);
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async () => {
    if (!isAuthenticated) {
      toast.error(`Login Required!! Please login to comment on this blog`);
      login();
      return;
    }

    if (!newComment.trim()) {
      toast.error(`Error `);
      return;
    }

    try {
      setCommenting(true);
      const result = await commentOnBlog(blog.id, newComment);

      if (result.success) {
        toast.success("Success!Blog created successfully.");
        setNewComment("");
      }
    } catch (error) {
      toast.error(`Error `);
    } finally {
      setCommenting(false);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - posted.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const formatCategory = (category: string) => {
    return category.toLowerCase().replace(/_/g, " ");
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-6 overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={blog.host?.profilePhoto} alt={blog.host?.name} />
            <AvatarFallback>{blog.host?.name?.[0] || "H"}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">
              {blog.host?.name || "Travel Host"}
            </h3>
            <p className="text-sm text-gray-500">
              {getTimeAgo(blog.createdAt)}
            </p>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Login to interact</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{blog.title}</h2>
        <p className="text-gray-700 mb-3">
          {blog.content.substring(0, 200)}...
        </p>
        {blog.excerpt && (
          <p className="text-gray-600 text-sm italic">{blog.excerpt}</p>
        )}
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full mt-2">
          {formatCategory(blog.category)}
        </span>
      </div>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="w-full">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            width={800}
            height={400}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-3 flex items-center justify-between text-sm text-gray-600 border-t">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {blog.views} views
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {likesCount} likes
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {blog._count?.comments || 0} comments
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 border-t border-gray-200 flex items-center gap-2">
        <Button
          variant="ghost"
          className={`flex-1 gap-2 ${
            isLiked ? "text-red-600" : "text-gray-600"
          }`}
          onClick={handleLike}
          disabled={liking}
        >
          <Heart className={`w-5 h-5 ${isLiked ? "fill-red-600" : ""}`} />
          {liking ? "..." : "Like"}
        </Button>

        <Button
          variant="ghost"
          className="flex-1 gap-2 text-gray-600"
          onClick={() => {
            if (!isAuthenticated) {
              toast.error(
                `Login Required!! Please login to comment on this blog`
              );
              login();
              return;
            }
            setShowComments(!showComments);
          }}
        >
          <MessageCircle className="w-5 h-5" />
          Comment
        </Button>

        <Button
          variant="ghost"
          className="flex-1 gap-2 text-gray-600"
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.origin}/blogs/${blog.id}`
            );
            toast.success("Link Copied!Blog link copied to clipboard.");
          }}
        >
          <Share2 className="w-5 h-5" />
          Share
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-200">
          <div className="px-4 py-3">
            <h4 className="font-semibold text-gray-900 mb-4">Comments</h4>

            {/* Add Comment */}
            <div className="mt-4 pt-4 border-t">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    {/* <AvatarImage src={user?.profilePhoto} /> */}
                    <AvatarFallback>{user?.name?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleComment()}
                      disabled={commenting}
                      className="border-gray-300 rounded-full"
                    />
                    <Button
                      size="icon"
                      onClick={handleComment}
                      disabled={commenting || !newComment.trim()}
                      className="rounded-full bg-blue-600 hover:bg-blue-700"
                    >
                      {commenting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Lock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600 mb-3">
                    Login to join the conversation
                  </p>
                  <Button onClick={login} size="sm">
                    Login to Comment
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
