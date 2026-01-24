"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter } from 'lucide-react'
import { BlogCardPublic } from '@/components/module/Blogs/BlogCardPublic'
import { getAllBlogs, IBlog } from '@/services/blog.service'
import { useAuthClient } from '@/hooks/use-auth-client'
import { SectionHeading } from '@/components/ui/SectionHeading'

export default function PublicBlogsPage() {
  const router = useRouter()
  const { isAuthenticated, login } = useAuthClient()

  const [blogs, setBlogs] = useState<IBlog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const result = await getAllBlogs({
        searchTerm,
        category: category || undefined,
        status: 'PUBLISHED'
      })

      if (result.success) {
        setBlogs(result.data)
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchBlogs()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="mb-8">
            <SectionHeading
              center={false}
              badge="Stories"
              title="Travel Blogs"
              subtitle="Discover amazing travel experiences from around the world"
            />
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="bg-[#138bc9] hover:bg-[#138bc9]/90 text-white font-bold h-12 px-8 rounded-xl shadow-md transition-all">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Blog List */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-[#138bc9]/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-3/4 mb-3" />
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogCardPublic key={blog.id} blog={blog} />
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No blogs found</h3>
            <p className="text-gray-600">
              {searchTerm ? "No blogs match your search" : "No blogs have been published yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}