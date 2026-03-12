"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
  const { isAuthenticated, isHost, user } = useAuthClient()

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

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen pt-20">
      <main className="flex flex-1 justify-center py-6 px-4">
        <div className="layout-content-container flex flex-col max-w-[680px] flex-1 gap-6">
          {/* Create Post Placeholder - Only for Hosts */}
          {isHost && (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex gap-4">
                <div className="size-10 rounded-full bg-cover bg-center shrink-0 relative overflow-hidden">
                  <Image
                    src={user?.profilePhoto || "https://lh3.googleusercontent.com/a/default-user=s120-c-no"}
                    alt="User"
                    fill
                    className="object-cover"
                  />
                </div>
                <button className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full px-5 text-left text-slate-500 dark:text-slate-400 text-sm transition-colors">
                  What's on your travel mind, {user?.name?.split(' ')[0] || 'Traveler'}?
                </button>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-around">
                <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-medium px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                  <span className="material-symbols-outlined text-red-500">videocam</span> Live
                </button>
                <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-medium px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                  <span className="material-symbols-outlined text-green-500">photo_library</span> Photo
                </button>
                <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-medium px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
                  <span className="material-symbols-outlined text-yellow-500">mood</span> Activity
                </button>
              </div>
            </div>
          )}

          {/* Blog Feed */}
          {loading ? (
            <div className="flex flex-col items-center py-8">
              <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-slate-500 text-sm mt-3 font-medium">Checking for more adventures...</p>
            </div>
          ) : blogs.length > 0 ? (
            <div className="flex flex-col gap-6">
              {blogs.map((blog) => (
                <BlogCardPublic key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">search_off</span>
              <h3 className="text-xl font-bold">No stories found</h3>
              <p className="text-slate-500">Check back later for new adventures.</p>
            </div>
          )}

          {/* Loading Indicator for More */}
          {!loading && blogs.length > 0 && (
            <div className="flex flex-col items-center py-8">
              <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-slate-500 text-sm mt-3 font-medium">Checking for more adventures...</p>
            </div>
          )}
        </div>

        {/* Right Sidebar (Desktop Only) */}
        <aside className="hidden xl:flex flex-col w-[300px] gap-6 sticky top-24 self-start ml-8">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-slate-900 dark:text-slate-100 font-bold mb-4 uppercase text-xs tracking-widest">Trending Locations</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                </div>
                <div>
                  <p className="text-sm font-bold group-hover:text-primary transition-colors">Banff, Canada</p>
                  <p className="text-xs text-slate-500">12.5k posts this week</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                </div>
                <div>
                  <p className="text-sm font-bold group-hover:text-primary transition-colors">Agra, India</p>
                  <p className="text-xs text-slate-500">8.2k posts this week</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}