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
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-20">
      {/* Header Section */}
      <div className="container mx-auto px-4 lg:px-8 mb-16">
        <div className="relative rounded-[3rem] overflow-hidden bg-white p-12 md:p-20 shadow-2xl shadow-blue-100/50 border border-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#138bc9]/5 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/50 rounded-full blur-2xl -ml-32 -mb-32" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="px-5 py-2 bg-[#138bc9]/10 text-[#138bc9] rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">
              Travel Journal
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter">
              Stories from <br /><span className="text-[#138bc9]">Every Corner</span>
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search inspirations, guides, tips..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-16 pl-14 pr-6 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all text-lg font-medium shadow-inner"
                />
              </div>
              <Button type="submit" className="h-16 px-10 rounded-2xl bg-[#138bc9] hover:bg-[#0e6ba3] text-white font-black text-lg transition-all shadow-lg shadow-blue-200">
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Blog List */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10 px-4">
          <h2 className="text-2xl font-black text-gray-900 italic">Latest Stories</h2>
          <div className="flex gap-2">
            <Button variant="ghost" className="rounded-xl font-bold text-gray-400 hover:text-[#138bc9]">Featured</Button>
            <Button variant="ghost" className="rounded-xl font-bold text-gray-400 hover:text-[#138bc9]">Recent</Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white p-8 animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="w-14 h-14 rounded-2xl bg-gray-100" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40 bg-gray-100" />
                    <Skeleton className="h-3 w-28 bg-gray-100" />
                  </div>
                </div>
                <Skeleton className="h-8 w-3/4 mb-4 bg-gray-100" />
                <Skeleton className="h-20 w-full mb-6 bg-gray-100 rounded-xl" />
                <Skeleton className="h-80 w-full rounded-[2rem] bg-gray-100" />
              </div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="space-y-12">
            {blogs.map((blog) => (
              <div key={blog.id} className="transform transition-all duration-500 hover:translate-y-[-4px]">
                <BlogCardPublic blog={blog} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No stories found</h3>
            <p className="text-gray-500 font-medium">
              {searchTerm ? "Maybe try different keywords?" : "We're currently writing new adventures. Check back soon!"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}