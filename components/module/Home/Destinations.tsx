'use client'
import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { UsersIcon, TrendingUpIcon, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getAllDestinations, IDestination } from '@/services/destination.service'
import { cn } from '@/lib/utils'

export function Destinations() {
  const [destinations, setDestinations] = useState<IDestination[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px',
  })

  useEffect(() => {
    async function load() {
      try {
        const res = await getAllDestinations()
        if (res.success) {
          setDestinations(res.data || [])
        }
      } catch (error) {
        console.error("Failed to load orbital data", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (!loading && destinations.length === 0) return null

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Background Decorative patterns */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50/50 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-50/50 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeading
          badge="Popular Destinations"
          title="Explore Amazing Places"
          subtitle="Discover trending destinations with expert-hosted tours from around the world"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 min-h-[400px]">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={cn(
                "bg-gray-50 animate-pulse rounded-3xl",
                i % 3 === 0 ? "md:col-span-2 md:row-span-2" : "md:col-span-2 md:row-span-1"
              )} />
            ))
          ) : (
            destinations.map((destination, index) => {
              // Logic for dynamic grid sizing: Featured or specifically indexed cards are large
              const isLarge = destination.isFeatured || index === 0 || index === 3;

              return (
                <motion.div
                  key={destination.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 
                    ${isLarge ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
                    min-h-[300px]
                  `}
                >
                  <div className="w-full h-full relative">
                    <Image
                      width={isLarge ? 800 : 600}
                      height={isLarge ? 600 : 400}
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                    {destination.isFeatured && (
                      <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg uppercase tracking-wider">
                        <TrendingUpIcon className="w-3 h-3 text-[#128bc8]" />
                        Trending
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-8 transform group-hover:-translate-y-2 transition-transform duration-500">
                      <div className="flex flex-col gap-2">
                        <h3 className={`font-black text-white drop-shadow-md tracking-tight ${isLarge ? 'text-4xl' : 'text-2xl'}`}>
                          {destination.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
                            <UsersIcon className="w-4 h-4" />
                            <span>Explorer Choice</span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                            <ArrowRight className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <button className="group relative px-10 py-5 bg-[#128bc8] text-white font-bold rounded-full transition-all duration-300 shadow-xl overflow-hidden">
            <span className="relative z-10">Explore All Destinations</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-[#128bc8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </motion.div>
      </div>
    </section>
  )
}