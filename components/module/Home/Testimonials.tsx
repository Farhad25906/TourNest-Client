'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { StarIcon, QuoteIcon } from 'lucide-react'
import Image from 'next/image'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useEffect, useState } from 'react'
import { getRecentReviews, Review } from '@/services/review.service'
import { getInitials } from '@/lib/formatters'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    name: 'Sarah Thompson',
    location: 'New York, USA',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    trip: 'Bali Cultural Tour',
    quote:
      'The host was incredibly knowledgeable and made our Bali experience truly authentic. Every detail was perfectly planned, and we got to explore hidden gems we would never have found on our own.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    location: 'Singapore',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    trip: 'Japan Adventure',
    quote:
      'TourNest connected us with an amazing host who brought Japan to life. From traditional tea ceremonies to modern Tokyo, every moment was memorable. Best tour experience ever!',
    rating: 5,
  },
  {
    name: 'Emma Rodriguez',
    location: 'Barcelona, Spain',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    trip: 'Peru Expedition',
    quote:
      'As a solo traveler, I felt completely safe and welcomed. The host took care of everything and the small group size made it feel personal. Already planning my next TourNest adventure!',
    rating: 5,
  },
]

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px',
  })

  useEffect(() => {
    async function fetchReviews() {
      const res = await getRecentReviews(6)
      if (res.success && res.data) {
        setReviews(res.data)
      }
      setLoading(false)
    }
    fetchReviews()
  }, [])

  if (!loading && reviews.length === 0) return null

  return (
    <section ref={ref} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="Live traveler chronicles"
          title="Voice of the Global Network"
          subtitle="Real-time expedition memoirs from explorers who bridged horizons with our expert guides"
        />

        <div className="grid md:grid-cols-3 gap-10">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-[40px] border border-gray-100" />
            ))
            : reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white rounded-[40px] p-10 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500 relative border border-gray-50 group hover:-translate-y-2"
              >
                <QuoteIcon className="absolute top-8 right-10 w-10 h-10 text-blue-50 group-hover:text-blue-100 transition-colors" />

                <div className="flex items-center gap-4 mb-8">
                  <Avatar className="h-14 w-14 rounded-2xl ring-4 ring-blue-50 transition-transform group-hover:scale-110">
                    <AvatarImage src={review.tourist?.profilePhoto} className="object-cover" />
                    <AvatarFallback className="bg-[#138bc9] text-white font-black">
                      {getInitials(review.tourist?.name || "??")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="font-black text-gray-900 uppercase tracking-tighter truncate">
                      {review.tourist?.name || "Scout Identity"}
                    </h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      Verified Explorer
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={cn("w-4 h-4", i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-100")}
                    />
                  ))}
                </div>

                <p className="text-gray-600 font-medium leading-relaxed mb-6 italic line-clamp-4 group-hover:text-gray-900 transition-colors">
                  "{review.comment}"
                </p>

                <div className="pt-6 border-t border-gray-50 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#138bc9] uppercase tracking-[0.2em]">
                      {review.tour?.title || "Classified Expedition"}
                    </span>
                    <span className="text-[9px] font-bold text-gray-300 uppercase">
                      {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  )
}