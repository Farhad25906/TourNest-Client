
// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Eye,
//   Heart,
//   MessageCircle,
//   Calendar,
//   User,
//   Tag,
//   Edit,
//   Trash2,
//   ArrowLeft,
//   Share2,
//   Bookmark,
//   MoreVertical,
//   ThumbsUp,
//   Send,
//   Clock
// } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { getBlogById, getBlogComments, addComment, likeBlog, IBlog, IComment } from "@/services/blog.service"
// import { format } from "date-fns"
// // import { useToast } from "@/hooks/use-toast"
// import { DeleteBlogDialog } from "@/components/module/Blogs/DeleteBlogDialog"
// import { UpdateBlogDialog } from "@/components/module/Blogs/UpdateBlogDialog"

// export default function BlogDetailsPage() {
//   const params = useParams()
//   const router = useRouter()
//   const blogId = params.id as string

//   const [blog, setBlog] = useState<IBlog | null>(null)
//   const [comments, setComments] = useState<IComment[]>([])
//   const [loading, setLoading] = useState(true)
//   const [commentLoading, setCommentLoading] = useState(false)
//   const [newComment, setNewComment] = useState("")
//   const [likeLoading, setLikeLoading] = useState(false)
//   const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

//   useEffect(() => {
//     fetchBlogDetails()
//     fetchComments()
//   }, [blogId])

//   const fetchBlogDetails = async () => {
//     try {
//       setLoading(true)
//       const response = await getBlogById(blogId)
//       if (response.success) {
//         setBlog(response.data)
//       } else {
//         toast({
//           title: "Error",
//           description: "Failed to load blog details",
//           variant: "destructive",
//         })
//         router.push("/dashboard/blogs")
//       }
//     } catch (error) {
//       console.error("Error fetching blog:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load blog details",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchComments = async () => {
//     try {
//       const response = await getBlogComments(blogId)
//       if (response.success) {
//         setComments(response.data)
//       }
//     } catch (error) {
//       console.error("Error fetching comments:", error)
//     }
//   }

//   const handleLike = async () => {
//     if (!blog || likeLoading) return

//     try {
//       setLikeLoading(true)
//       const response = await likeBlog(blogId)
//       if (response.success) {
//         setBlog(prev => prev ? {
//           ...prev,
//           likesCount: response.data.likesCount,
//           isLiked: response.data.isLiked
//         } : null)
//         toast({
//           title: response.data.isLiked ? "Liked!" : "Like removed",
//           description: response.data.isLiked ? "You liked this blog" : "You removed your like",
//         })
//       }
//     } catch (error) {
//       console.error("Error liking blog:", error)
//       toast({
//         title: "Error",
//         description: "Failed to like blog",
//         variant: "destructive",
//       })
//     } finally {
//       setLikeLoading(false)
//     }
//   }

//   const handleAddComment = async () => {
//     if (!newComment.trim() || commentLoading) return

//     try {
//       setCommentLoading(true)
//       const response = await addComment(blogId, newComment)
//       if (response.success) {
//         setComments(prev => [response.data, ...prev])
//         setNewComment("")
//         toast({
//           title: "Success",
//           description: "Comment added successfully",
//         })
//       }
//     } catch (error) {
//       console.error("Error adding comment:", error)
//       toast({
//         title: "Error",
//         description: "Failed to add comment",
//         variant: "destructive",
//       })
//     } finally {
//       setCommentLoading(false)
//     }
//   }

//   const handleDeleteSuccess = () => {
//     router.push("/dashboard/blogs")
//   }

//   const handleUpdateSuccess = () => {
//     fetchBlogDetails()
//   }

//   const handleShare = () => {
//     if (navigator.share && blog) {
//       navigator.share({
//         title: blog.title,
//         text: blog.excerpt,
//         url: window.location.href,
//       })
//     } else {
//       navigator.clipboard.writeText(window.location.href)
//       toast({
//         title: "Link copied",
//         description: "Blog link copied to clipboard",
//       })
//     }
//   }

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <Button
//           variant="ghost"
//           className="mb-4"
//           onClick={() => router.back()}
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Blogs
//         </Button>

//         <Card>
//           <CardHeader>
//             <Skeleton className="h-8 w-3/4" />
//             <Skeleton className="h-4 w-1/2 mt-2" />
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Skeleton className="h-64 w-full" />
//             <div className="flex gap-4">
//               <Skeleton className="h-4 w-24" />
//               <Skeleton className="h-4 w-24" />
//               <Skeleton className="h-4 w-24" />
//             </div>
//             <Skeleton className="h-32 w-full" />
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   if (!blog) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-2xl font-bold mb-4">Blog not found</h2>
//         <p className="text-muted-foreground mb-6">The blog you're looking for doesn't exist.</p>
//         <Button onClick={() => router.push("/dashboard/blogs")}>
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Blogs
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header with Back Button */}
//       <div className="flex items-center justify-between">
//         <Button
//           variant="ghost"
//           onClick={() => router.back()}
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Blogs
//         </Button>

//         <div className="flex items-center gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setUpdateDialogOpen(true)}
//           >
//             <Edit className="mr-2 h-4 w-4" />
//             Edit
//           </Button>
          
//           <DeleteBlogDialog
//             blogId={blog.id}
//             blogTitle={blog.title}
//             open={deleteDialogOpen}
//             onOpenChange={setDeleteDialogOpen}
//             onSuccess={handleDeleteSuccess}
//           />
          
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon">
//                 <MoreVertical className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={handleShare}>
//                 <Share2 className="mr-2 h-4 w-4" />
//                 Share
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <Bookmark className="mr-2 h-4 w-4" />
//                 Save
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       {/* Blog Content */}
//       <div className="grid gap-6 lg:grid-cols-3">
//         {/* Main Content */}
//         <div className="lg:col-span-2 space-y-6">
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <Badge variant={blog.status === "PUBLISHED" ? "default" : "secondary"}>
//                   {blog.status}
//                 </Badge>
//                 <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                   <span className="flex items-center">
//                     <Calendar className="mr-1 h-3 w-3" />
//                     {format(new Date(blog.createdAt), "MMM dd, yyyy")}
//                   </span>
//                   <span className="flex items-center">
//                     <Clock className="mr-1 h-3 w-3" />
//                     {format(new Date(blog.updatedAt), "MMM dd, yyyy")}
//                   </span>
//                 </div>
//               </div>
              
//               <CardTitle className="text-3xl mt-4">{blog.title}</CardTitle>
//               <CardDescription className="text-lg">{blog.excerpt}</CardDescription>
              
//               <div className="flex items-center gap-4 mt-4">
//                 <div className="flex items-center gap-2">
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage src={blog.author?.avatar || ""} />
//                     <AvatarFallback>
//                       {blog.author?.name?.[0] || "U"}
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="text-sm font-medium">{blog.author?.name || "Unknown Author"}</span>
//                 </div>
                
//                 <div className="flex items-center gap-4 ml-auto">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={handleLike}
//                     disabled={likeLoading}
//                   >
//                     <Heart className={`mr-2 h-4 w-4 ${blog.isLiked ? "fill-red-500 text-red-500" : ""}`} />
//                     {blog.likesCount}
//                   </Button>
                  
//                   <Button variant="ghost" size="sm">
//                     <MessageCircle className="mr-2 h-4 w-4" />
//                     {blog._count?.comments || 0}
//                   </Button>
                  
//                   <Button variant="ghost" size="sm">
//                     <Eye className="mr-2 h-4 w-4" />
//                     {blog.views}
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
            
//             <CardContent className="space-y-6">
//               <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
//                 {blog.image ? (
//                   <img
//                     src={blog.image}
//                     alt={blog.title}
//                     className="h-full w-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex h-full items-center justify-center">
//                     <Tag className="h-12 w-12 text-muted-foreground" />
//                   </div>
//                 )}
//               </div>
              
//               <div className="prose max-w-none dark:prose-invert">
//                 <div dangerouslySetInnerHTML={{ __html: blog.content }} />
//               </div>
              
//               <div className="flex flex-wrap gap-2">
//                 {blog.tags?.map((tag) => (
//                   <Badge key={tag} variant="secondary">
//                     {tag}
//                   </Badge>
//                 ))}
//               </div>
//             </CardContent>
            
//             <CardFooter className="flex justify-between border-t pt-6">
//               <div className="flex items-center gap-4">
//                 <Button
//                   variant={blog.isLiked ? "default" : "outline"}
//                   size="sm"
//                   onClick={handleLike}
//                   disabled={likeLoading}
//                 >
//                   <ThumbsUp className="mr-2 h-4 w-4" />
//                   {blog.isLiked ? "Liked" : "Like"}
//                 </Button>
                
//                 <Button variant="outline" size="sm" onClick={handleShare}>
//                   <Share2 className="mr-2 h-4 w-4" />
//                   Share
//                 </Button>
//               </div>
              
//               <Badge variant="outline" className="capitalize">
//                 <Tag className="mr-2 h-3 w-3" />
//                 {blog.category.replace(/_/g, " ")}
//               </Badge>
//             </CardFooter>
//           </Card>

//           {/* Comments Section */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Comments ({comments.length})</CardTitle>
//               <CardDescription>
//                 Join the discussion and share your thoughts
//               </CardDescription>
//             </CardHeader>
            
//             <CardContent className="space-y-4">
//               {/* Add Comment */}
//               <div className="space-y-2">
//                 <Textarea
//                   placeholder="Write your comment..."
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                   rows={3}
//                 />
//                 <div className="flex justify-end">
//                   <Button
//                     onClick={handleAddComment}
//                     disabled={!newComment.trim() || commentLoading}
//                   >
//                     {commentLoading ? "Posting..." : (
//                       <>
//                         <Send className="mr-2 h-4 w-4" />
//                         Post Comment
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </div>

//               <Separator />

//               {/* Comments List */}
//               {comments.length > 0 ? (
//                 <div className="space-y-4">
//                   {comments.map((comment) => (
//                     <div key={comment.id} className="space-y-2 p-4 rounded-lg border">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                           <Avatar className="h-8 w-8">
//                             <AvatarImage src={comment.user?.avatar || ""} />
//                             <AvatarFallback>
//                               {comment.user?.name?.[0] || "U"}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <p className="text-sm font-medium">{comment.user?.name || "Anonymous"}</p>
//                             <p className="text-xs text-muted-foreground">
//                               {format(new Date(comment.createdAt), "MMM dd, yyyy 'at' h:mm a")}
//                             </p>
//                           </div>
//                         </div>
                        
//                         {comment.userId === blog.authorId && (
//                           <Badge variant="outline" className="text-xs">
//                             Author
//                           </Badge>
//                         )}
//                       </div>
                      
//                       <p className="text-sm mt-2">{comment.content}</p>
                      
//                       <div className="flex items-center gap-4 text-xs text-muted-foreground">
//                         <Button variant="ghost" size="sm" className="h-6 px-2">
//                           <ThumbsUp className="mr-1 h-3 w-3" />
//                           {comment.likes || 0}
//                         </Button>
//                         <Button variant="ghost" size="sm" className="h-6 px-2">
//                           Reply
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold mb-2">No comments yet</h3>
//                   <p className="text-muted-foreground">
//                     Be the first to share your thoughts!
//                   </p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Blog Stats */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Blog Statistics</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium text-muted-foreground">Views</p>
//                   <div className="flex items-center">
//                     <Eye className="mr-2 h-4 w-4" />
//                     <span className="text-2xl font-bold">{blog.views}</span>
//                   </div>
//                 </div>
                
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium text-muted-foreground">Likes</p>
//                   <div className="flex items-center">
//                     <Heart className="mr-2 h-4 w-4" />
//                     <span className="text-2xl font-bold">{blog.likesCount}</span>
//                   </div>
//                 </div>
                
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium text-muted-foreground">Comments</p>
//                   <div className="flex items-center">
//                     <MessageCircle className="mr-2 h-4 w-4" />
//                     <span className="text-2xl font-bold">{blog._count?.comments || 0}</span>
//                   </div>
//                 </div>
                
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium text-muted-foreground">Category</p>
//                   <Badge className="capitalize">
//                     {blog.category.replace(/_/g, " ")}
//                   </Badge>
//                 </div>
//               </div>
              
//               <Separator />
              
//               <div className="space-y-2">
//                 <p className="text-sm font-medium text-muted-foreground">Created</p>
//                 <p className="text-sm">
//                   {format(new Date(blog.createdAt), "PPPP 'at' p")}
//                 </p>
//               </div>
              
//               <div className="space-y-2">
//                 <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
//                 <p className="text-sm">
//                   {format(new Date(blog.updatedAt), "PPPP 'at' p")}
//                 </p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Author Info */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Author Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <Avatar className="h-12 w-12">
//                   <AvatarImage src={blog.author?.avatar || ""} />
//                   <AvatarFallback className="text-lg">
//                     {blog.author?.name?.[0] || "U"}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-semibold">{blog.author?.name || "Unknown Author"}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {blog.author?.email || "No email provided"}
//                   </p>
//                 </div>
//               </div>
              
//               <Separator />
              
//               <div className="space-y-2">
//                 <p className="text-sm font-medium text-muted-foreground">Author ID</p>
//                 <p className="text-sm font-mono bg-muted p-2 rounded">
//                   {blog.authorId}
//                 </p>
//               </div>
              
//               <div className="space-y-2">
//                 <p className="text-sm font-medium text-muted-foreground">Blog ID</p>
//                 <p className="text-sm font-mono bg-muted p-2 rounded">
//                   {blog.id}
//                 </p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Actions */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Quick Actions</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <Button
//                 variant="outline"
//                 className="w-full justify-start"
//                 onClick={() => setUpdateDialogOpen(true)}
//               >
//                 <Edit className="mr-2 h-4 w-4" />
//                 Edit Blog
//               </Button>
              
//               <DeleteBlogDialog
//                 blogId={blog.id}
//                 blogTitle={blog.title}
//                 open={deleteDialogOpen}
//                 onOpenChange={setDeleteDialogOpen}
//                 onSuccess={handleDeleteSuccess}
//                 trigger={
//                   <Button
//                     variant="outline"
//                     className="w-full justify-start text-destructive hover:text-destructive"
//                   >
//                     <Trash2 className="mr-2 h-4 w-4" />
//                     Delete Blog
//                   </Button>
//                 }
//               />
              
//               <Button
//                 variant="outline"
//                 className="w-full justify-start"
//                 onClick={handleShare}
//               >
//                 <Share2 className="mr-2 h-4 w-4" />
//                 Share Blog
//               </Button>
              
//               <Button
//                 variant="outline"
//                 className="w-full justify-start"
//                 onClick={() => router.push(`/blog/${blog.slug || blog.id}`)}
//               >
//                 <Eye className="mr-2 h-4 w-4" />
//                 View Public Page
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Update Dialog */}
//       {blog && (
//         <UpdateBlogDialog
//           blog={blog}
//           open={updateDialogOpen}
//           onOpenChange={setUpdateDialogOpen}
//           onSuccess={handleUpdateSuccess}
//         />
//       )}
//     </div>
//   )
// }
import React from 'react';

const page = () => {
    return (
        <div>
            Hello
        </div>
    );
};

export default page;