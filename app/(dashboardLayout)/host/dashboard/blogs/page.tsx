"use client"

import { useState, useEffect } from "react"
// import { DashboardHeader } from "@/components/dashboard-header"
// import { DashboardShell } from "@/components/dashboard-shell"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Eye, Heart, MessageCircle, FileText, Search, Filter } from "lucide-react"
import { getMyBlogs, IBlog } from "@/services/blog.service"
import { CreateBlogDialog } from "@/components/module/Blogs/CreateBlogModal"
import { BlogCard } from "@/components/module/Blogs/BlogCard"
import { UpdateBlogDialog } from "@/components/module/Blogs/UpdateBlogDialog"
import { DeleteBlogDialog } from "@/components/module/Blogs/DeleteBlogDialog"

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

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(blog => blog.category === categoryFilter)
    }

    // Apply status filter
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

  const handleDeleteSuccess = () => {
    fetchMyBlogs()
  }

  const handleUpdateSuccess = () => {
    fetchMyBlogs()
  }

  // Calculate statistics
  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.status === "PUBLISHED").length,
    drafts: blogs.filter(b => b.status === "DRAFT").length,
    totalViews: blogs.reduce((sum, blog) => sum + blog.views, 0),
    totalLikes: blogs.reduce((sum, blog) => sum + blog.likesCount, 0),
    totalComments: blogs.reduce((sum, blog) => sum + (blog._count?.comments || 0), 0),
  }

  const categories = Array.from(new Set(blogs.map(b => b.category)))

  return (
    <div>
      {/* <DashboardHeader
        heading="My Blogs"
        text="Manage your blog posts and track performance"
      >
        
      </DashboardHeader> */}
      

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.published} published, {stats.drafts} drafts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              All-time views across all blogs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLikes}</div>
            <p className="text-xs text-muted-foreground">
              Total likes received
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <p className="text-xs text-muted-foreground">
              Total comments received
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search blogs..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>
              <CreateBlogDialog />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Blogs ({blogs.length})</TabsTrigger>
          <TabsTrigger value="published">Published ({stats.published})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({stats.drafts})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-48 w-full" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
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
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No blogs found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                    ? "No blogs match your filters. Try adjusting your search criteria."
                    : "You haven't created any blogs yet. Start sharing your travel experiences!"}
                </p>
                <CreateBlogDialog />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="published" className="space-y-4">
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
        
        <TabsContent value="drafts" className="space-y-4">
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

      {/* Update Dialog */}
      {selectedBlog && (
        <UpdateBlogDialog
          blog={selectedBlog}
          open={updateDialogOpen}
          onOpenChange={setUpdateDialogOpen}
        />
      )}

      {/* Delete Dialog */}
      {blogToDelete && (
        <DeleteBlogDialog
          blogId={blogToDelete.id}
          blogTitle={blogToDelete.title}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
    </div>
  )
}