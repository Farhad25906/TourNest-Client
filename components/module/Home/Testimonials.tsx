'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'framer-motion'
import { StarIcon, QuoteIcon, ShieldCheck } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useEffect, useState } from 'react'
import { getRecentReviews, Review } from '@/services/review.service'
import { getInitials } from '@/lib/formatters'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, {
    once: true,
    margin: '-100px',
  })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50])

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
    <section ref={sectionRef} className="py-32 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-blue-50/50 blur-xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-40 right-10 w-32 h-32 rounded-full bg-blue-50/50 blur-2xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeading
          badge="Traveler Chronicles"
          title="Voice of the Global Network"
          subtitle="Real-time expedition memoirs from explorers who bridged horizons with our expert guides"
        />

        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 bg-slate-50 animate-pulse rounded-[40px] border border-slate-100" />
            ))
            : reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 50, rotate: index % 2 === 0 ? -2 : 2 }}
                animate={isInView ? { opacity: 1, y: 0, rotate: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                whileHover={{ y: -10, rotate: index % 2 === 0 ? 1 : -1, zIndex: 10 }}
                className={cn(
                  "flex flex-col bg-white rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 relative group transition-all duration-500",
                  index % 3 === 1 ? "lg:mt-12" : "" // Staggered visual effect
                )}
              >
                {/* Unique Quote Handle */}
                <div className="absolute -top-6 -left-2 w-16 h-16 bg-[#128bc8] rounded-3xl flex items-center justify-center shadow-xl shadow-[#128bc8]/30 group-hover:scale-110 transition-transform duration-500">
                  <QuoteIcon className="w-8 h-8 text-white fill-current" />
                </div>

                <div className="flex items-center gap-4 mb-8 pt-4">
                  <Avatar className="h-16 w-16 rounded-2xl ring-4 ring-blue-50/50 transition-all duration-500 group-hover:rounded-full group-hover:ring-[#128bc8]/20">
                    <AvatarImage src={review.tourist?.profilePhoto} className="object-cover" />
                    <AvatarFallback className="bg-[#128bc8] text-white font-black text-xl">
                      {getInitials(review.tourist?.name || "??")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 uppercase tracking-tighter text-lg leading-tight">
                      {review.tourist?.name || "Anonymous Scout"}
                    </h3>
                    <div className="flex items-center gap-1 mt-1 text-[#128bc8]">
                      <ShieldCheck className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Verified Traveler</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={cn("w-4 h-4 transition-colors duration-300",
                        i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-100",
                        "group-hover:scale-110"
                      )}
                    />
                  ))}
                </div>

                <p className="text-slate-600 font-medium leading-relaxed italic mb-8 flex-grow group-hover:text-slate-900 transition-colors duration-500 line-clamp-4">
                  "{review.comment}"
                </p>

                <div className="pt-8 border-t border-slate-50 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-[#128bc8] uppercase tracking-[0.2em] mb-1">
                        Expedition
                      </span>
                      <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[150px]">
                        {review.tour?.title || "Classified Adventure"}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase bg-slate-50 px-3 py-1 rounded-full">
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