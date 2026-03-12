'use client'
import React, { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, MapPin, Star, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getAllDestinations, IDestination } from '@/services/destination.service'
import { cn } from '@/lib/utils'

export function Destinations() {
  const [destinations, setDestinations] = useState<IDestination[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    async function load() {
      try {
        const res = await getAllDestinations()
        if (res.success) setDestinations(res.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (!loading && destinations.length === 0) return null

  return (
    <section ref={ref} className="py-16 bg-white relative overflow-hidden">
      {/* Same background blobs as original */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50/50 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-50/50 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-[11px] font-bold tracking-widest text-[#128bc8] uppercase mb-5 shadow-sm">
              <Sparkles className="w-3 h-3" />
              Popular Destinations
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-950 leading-tight">
              Explore Amazing <span className="text-[#128bc8]">Places</span>
            </h2>
          </div>
          <p className="text-gray-400 text-xs font-medium max-w-[200px] leading-relaxed md:text-right">
            Expert-hosted tours curated from around the world
          </p>
        </motion.div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl bg-gray-100 animate-pulse"
                style={{ height: 280 }}
              />
            ))
            : destinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-blue-200/40 transition-shadow duration-500"
                style={{ height: 280 }}
                onMouseEnter={() => setActiveIdx(index)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                {/* Image — fixed 280px height, object-cover preserves quality */}
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className={cn(
                    'object-cover transition-transform duration-[1000ms] ease-out will-change-transform',
                    activeIdx === index ? 'scale-[1.08]' : 'scale-100'
                  )}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/15 to-transparent" />

                {/* Hover blue tint */}
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(18,139,200,0.35) 0%, transparent 55%)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeIdx === index ? 1 : 0 }}
                  transition={{ duration: 0.35 }}
                />

                {/* Featured badge */}
                {dest.isFeatured && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: index * 0.08 + 0.3 }}
                    className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] font-bold tracking-widest uppercase"
                  >
                    <Star className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
                    Trending
                  </motion.div>
                )}

                {/* Index chip */}
                <div className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-black/20 backdrop-blur-sm border border-white/15 flex items-center justify-center">
                  <span className="text-[9px] font-black text-white/60 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                  <motion.h3
                    className="text-lg font-black text-white tracking-tight leading-tight line-clamp-1"
                    animate={{ y: activeIdx === index ? -4 : 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    {dest.name}
                  </motion.h3>

                  <div className="flex items-center gap-1 mt-1.5">
                    <MapPin className="w-3 h-3 text-[#5bbfee] shrink-0" />
                    <span className="text-[11px] text-white/55 font-medium line-clamp-1">
                      {dest.description || 'Explorer Choice'}
                    </span>
                  </div>

                  {/* Animated underline */}
                  <motion.div
                    className="mt-3 h-px bg-white/30 origin-left"
                    animate={{ scaleX: activeIdx === index ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />

                  {/* Explore CTA — slides up on hover */}
                  <motion.div
                    className="flex items-center gap-1.5 mt-2"
                    animate={{
                      opacity: activeIdx === index ? 1 : 0,
                      y: activeIdx === index ? 0 : 8,
                    }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                      style={{
                        background: 'rgba(18,139,200,0.3)',
                        color: '#7dd3f8',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      Explore
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#7dd3f8]" />
                  </motion.div>
                </div>

                {/* Hover border glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border pointer-events-none"
                  animate={{
                    borderColor: activeIdx === index
                      ? 'rgba(18,139,200,0.5)'
                      : 'rgba(255,255,255,0.0)',
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
        </div>

        {/* CTA footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 text-center"
        >
          <Link href="/destinations" className="group relative px-10 py-5 bg-[#128bc8] text-white font-bold rounded-full transition-all duration-300 shadow-xl overflow-hidden inline-block">
            <span className="relative z-10 flex items-center gap-2">
              Explore All Destinations
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-[#128bc8] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}