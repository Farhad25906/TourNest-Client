"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Eye, Heart, MessageCircle, FileText, Search, Filter, Sparkles, PlusCircle } from "lucide-react"
import { getMyBlogs, IBlog } from "@/services/blog.service"
import { CreateBlogDialog } from "@/components/module/Blogs/CreateBlogModal"
import { BlogCard } from "@/components/module/Blogs/BlogCard"
import { UpdateBlogDialog } from "@/components/module/Blogs/UpdateBlogDialog"
import { DeleteBlogDialog } from "@/components/module/Blogs/DeleteBlogDialog"
import { cn } from "@/lib/utils"

export default function MyBlogsPage() {
  const [blogs, setBlogs] = useState<IBlog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<IBlog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<IBlog | null>(null)
  const [blogToDelete, setBlogToDelete] = useState<{ id: string; title: string } | null>(null)

  useEffect(() => {
    fetchMyBlogs()
  }, [])

  useEffect(() => {
    filterBlogs()
  }, [blogs, searchQuery, categoryFilter, statusFilter])

  const fetchMyBlogs = async () => {
    try {
      setLoading(true)
      const response = await getMyBlogs()

      if (response.success) {
        setBlogs(response.data)
        setFilteredBlogs(response.data)
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterBlogs = () => {
    let filtered = [...blogs]

    if (searchQuery) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(blog => blog.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(blog => blog.status === statusFilter)
    }

    setFilteredBlogs(filtered)
  }

  const handleEdit = (blog: IBlog) => {
    setSelectedBlog(blog)
    setUpdateDialogOpen(true)
  }

  const handleDeleteClick = (blogId: string, blogTitle: string) => {
    setBlogToDelete({ id: blogId, title: blogTitle })
    setDeleteDialogOpen(true)
  }

  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.status === "PUBLISHED").length,
    drafts: blogs.filter(b => b.status === "DRAFT").length,
    totalViews: blogs.reduce((sum, blog) => sum + blog.views, 0),
    totalLikes: blogs.reduce((sum, blog) => sum + blog.likesCount, 0),
    totalComments: blogs.reduce((sum, blog) => sum + (blog._count?.comments || 0), 0),
  }

  const categories = Array.from(new Set(blogs.map(b => b.category)))

  const statCards = [
    { title: "Total Blogs", value: stats.total, sub: `${stats.published} live posts`, icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Engagement", value: stats.totalViews.toLocaleString(), sub: "Total views reached", icon: Eye, color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Community", value: stats.totalLikes, sub: "Likes from readers", icon: Heart, color: "text-rose-600", bgColor: "bg-rose-50" },
    { title: "Discussions", value: stats.totalComments, sub: "Total comments", icon: MessageCircle, color: "text-emerald-600", bgColor: "bg-emerald-50" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Content Studio</h1>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#138bc9]" />
            Craft and manage your travel stories
          </p>
        </div>
        <CreateBlogDialog />
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden group">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-2">
                    {card.title}
                  </p>
                  <h3 className="text-3xl font-black text-gray-900 leading-tight">{card.value}</h3>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                    {card.sub}
                  </p>
                </div>
                <div className={cn("p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3", card.bgColor, card.color)}>
                  <card.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-1.5 flex items-center shadow-sm">
          <Search className="ml-3 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search articles by title or keywords..."
            className="border-none focus-visible:ring-0 w-full h-10 font-bold text-sm text-gray-600 placeholder:text-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] rounded-2xl border-gray-100 h-13 shadow-sm font-bold text-xs uppercase tracking-widest text-gray-500">
              <Filter className="h-3 w-3 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-gray-100 shadow-xl font-bold">
              <SelectItem value="all">Every Category</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] rounded-2xl border-gray-100 h-13 shadow-sm font-bold text-xs uppercase tracking-widest text-gray-500">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-gray-100 shadow-xl font-bold">
              <SelectItem value="all">Total Status</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Internal Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Blog List Content */}
      <Tabs defaultValue="all" className="space-y-6">
        <div className="bg-white p-1.5 rounded-[20px] border border-gray-100 shadow-sm w-fit">
          <TabsList className="bg-transparent h-auto p-0 gap-1 font-black">
            {[
              { label: "All Stories", value: "all", count: blogs.length },
              { label: "Live", value: "published", count: stats.published },
              { label: "Drafts", value: "drafts", count: stats.drafts }
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "rounded-2xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                  "data-[state=active]:bg-[#138bc9] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#138bc9]/20",
                  "text-gray-400 hover:text-gray-600"
                )}
              >
                {tab.label} <span className="ml-2 opacity-50 text-[9px]">{tab.count}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="all" className="focus-visible:ring-0 mt-0">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                  <div className="h-48 bg-gray-100 animate-pulse" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full rounded-full" />
                      <Skeleton className="h-3 w-full rounded-full" />
                      <Skeleton className="h-3 w-2/3 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[40px] border border-gray-50 text-center shadow-sm">
              <div className="h-20 w-20 rounded-[30px] bg-gray-50 flex items-center justify-center text-gray-200 mb-6">
                <FileText className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">No stories found</h3>
              <p className="text-sm font-bold text-gray-400 mt-2 max-w-xs mx-auto uppercase tracking-tight">
                {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters to find what you're looking for."
                  : "Ready to become a travel expert? Start by sharing your first journey."}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="published" className="focus-visible:ring-0 mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs
              .filter(blog => blog.status === "PUBLISHED")
              .map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="focus-visible:ring-0 mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs
              .filter(blog => blog.status === "DRAFT")
              .map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {selectedBlog && (
        <UpdateBlogDialog
          blog={selectedBlog}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
          onSuccess={() => fetchMyBlogs()}
        />
      )}

      {blogToDelete && (
        <DeleteBlogDialog
          blogId={blogToDelete.id}
          blogTitle={blogToDelete.title}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onSuccess={() => fetchMyBlogs()}
        />
      )}
    </div>
  )
}