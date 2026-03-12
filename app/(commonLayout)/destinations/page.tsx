'use client'
import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, MapPin, Star, Sparkles, Search } from 'lucide-react'
import Image from 'next/image'
import { getAllDestinations, IDestination } from '@/services/destination.service'
import { cn } from '@/lib/utils'

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<IDestination[]>([])
    const [loading, setLoading] = useState(true)
    const [activeIdx, setActiveIdx] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

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

    const filteredDestinations = destinations.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-white pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Section */}
                <div className="mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-bold tracking-widest text-[#128bc8] uppercase mb-6 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        Our World
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-950 leading-tight mb-6">
                                All <span className="text-[#128bc8]">Destinations</span>
                            </h1>
                            <p className="text-gray-500 text-lg font-medium leading-relaxed">
                                Discover breathtaking places hand-picked for your next adventure. From hidden gems to world-famous landmarks.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search destinations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#128bc8]/20 focus:bg-white transition-all font-medium text-gray-900"
                            />
                        </div>
                    </div>
                </div>

                {/* destinations Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-[300px] rounded-3xl bg-gray-100 animate-pulse" />
                        ))
                    ) : filteredDestinations.length > 0 ? (
                        filteredDestinations.map((dest, index) => (
                            <motion.div
                                key={dest.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                whileHover={{ y: -8 }}
                                className="group relative h-[320px] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500"
                                onMouseEnter={() => setActiveIdx(index)}
                                onMouseLeave={() => setActiveIdx(null)}
                            >
                                <Image
                                    src={dest.image}
                                    alt={dest.name}
                                    fill
                                    className={cn(
                                        'object-cover transition-transform duration-[1000ms] ease-out',
                                        activeIdx === index ? 'scale-110' : 'scale-100'
                                    )}
                                />

                                {/* Overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                                <motion.div
                                    className="absolute inset-0"
                                    style={{ background: 'linear-gradient(to top, rgba(18,139,200,0.4) 0%, transparent 60%)' }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: activeIdx === index ? 1 : 0 }}
                                />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    {dest.isFeatured && (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[9px] font-bold tracking-widest uppercase mb-3 text-white">
                                            <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                                            Featured
                                        </div>
                                    )}
                                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-blue-200 transition-colors">
                                        {dest.name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 opacity-70">
                                        <MapPin className="w-3.5 h-3.5 text-blue-300" />
                                        <span className="text-xs text-white font-medium line-clamp-1">
                                            {dest.description || 'Global Explorer Choice'}
                                        </span>
                                    </div>

                                    {/* Explore Button on Hover */}
                                    <motion.div
                                        className="mt-4 flex items-center gap-2"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: activeIdx === index ? 1 : 0, x: activeIdx === index ? 0 : -10 }}
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#7dd3f8]">Explore Now</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-[#7dd3f8]" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No destinations found</h3>
                            <p className="text-gray-500">Try adjusting your search criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
