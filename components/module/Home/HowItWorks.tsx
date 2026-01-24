'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { SearchIcon, CalendarCheckIcon, MapPinIcon, PlaneIcon } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'

const steps = [
  {
    icon: SearchIcon,
    title: 'Browse Tours',
    description:
      'Explore hundreds of curated tours created by experienced hosts from around the world.',
    color: '#128bc8',
  },
  {
    icon: CalendarCheckIcon,
    title: 'Book Your Adventure',
    description:
      'Select your preferred dates, review itinerary details, and securely book your spot.',
    color: '#3B82F6',
  },
  {
    icon: MapPinIcon,
    title: 'Meet Your Host',
    description:
      'Connect with your expert tour host who will guide you through an unforgettable journey.',
    color: '#128bc8',
  },
  {
    icon: PlaneIcon,
    title: 'Travel & Explore',
    description:
      'Embark on your adventure with confidence, knowing every detail is planned.',
    color: '#3B82F6',
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px',
  })

  return (
    <section ref={ref} className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Decorative SVG Path - Background */}
      <div className="absolute top-[40%] left-0 w-full px-20 hidden lg:block pointer-events-none opacity-20">
        <svg width="100%" height="100" viewBox="0 0 1000 100" fill="none" preserveAspectRatio="none">
          <motion.path
            d="M0 50 C 250 50, 250 50, 500 50 S 750 50, 1000 50"
            stroke="#128bc8"
            strokeWidth="4"
            strokeDasharray="10 10"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <SectionHeading
          badge="Simple Process"
          title="How It Works"
          subtitle="From browsing to booking in four simple steps"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mt-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group pt-10"
            >
              {/* Floating Number Background */}
              <motion.span
                className="absolute top-0 right-0 text-8xl font-black text-slate-200/50 -z-10 select-none group-hover:text-[#128bc8]/10 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.2 + 0.3 }}
              >
                0{index + 1}
              </motion.span>

              <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 h-full shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-500 border border-white hover:-translate-y-2">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 relative"
                >
                  <div className="absolute inset-0 bg-[#128bc8] opacity-10 rounded-2xl group-hover:scale-110 transition-transform duration-500"></div>
                  <step.icon
                    className="w-10 h-10 relative z-10 group-hover:rotate-12 transition-transform duration-500"
                    style={{ color: step.color }}
                  />
                  {/* Subtle Glow */}
                  <div className="absolute inset-0 bg-[#128bc8] blur-xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full"></div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="h-1 w-6 bg-[#128bc8] rounded-full group-hover:w-12 transition-all duration-500"></span>
                  <span className="text-xs font-black text-[#128bc8] uppercase tracking-widest">Phase {index + 1}</span>
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
                  {step.title}
                </h3>

                <p className="text-gray-600 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}