'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  badge?: string
  center?: boolean
  light?: boolean
}

export function SectionHeading({
  title,
  subtitle,
  badge,
  center = true,
  light = false,
}: SectionHeadingProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Split title into words for better animation
  const words = title.split(' ')

  return (
    <motion.div
      ref={ref}
      className={`${center ? 'text-center' : 'text-left'} mb-20`}
    >
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-block mb-4"
        >
          <span className="px-5 py-2 rounded-full bg-[#128bc8]/15 text-[#128bc8] text-sm font-semibold tracking-widest uppercase border border-[#128bc8]/20">
            {badge}
          </span>
        </motion.div>
      )}

      <div className="relative">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block">
              <motion.span
                initial={{ opacity: 0, y: 30, rotateX: -90 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: wordIndex * 0.15,
                  ease: [0.25, 0.4, 0.25, 1]
                }}
                className={`inline-block ${wordIndex === 0
                  ? 'text-[#128bc8]'
                  : light ? 'text-white' : 'text-gray-900'
                  }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {word}
              </motion.span>
              {wordIndex < words.length - 1 && <span className="inline-block w-3" />}
            </span>
          ))}
        </h2>

        {/* Simple elegant line */}
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: center ? '80px' : '100px' } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className={`h-1 bg-[#128bc8] rounded-full ${center ? 'mx-auto' : ''}`}
        />
      </div>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`text-lg md:text-xl max-w-2xl mt-6 leading-relaxed ${center ? 'mx-auto' : ''
            } ${light ? 'text-white/70' : 'text-gray-600'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}

// Demo Component
// export default function Demo() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 py-20 px-6">
//       <div className="max-w-6xl mx-auto space-y-32">
//         {/* Example 1 */}
//         <SectionHeading
//           badge="Explore"
//           title="Discover Amazing Destinations"
//           subtitle="Embark on unforgettable journeys to breathtaking locations around the world."
//           light
//         />

//         {/* Example 2 */}
//         <SectionHeading
//           badge="Premium Tours"
//           title="Your Adventure Awaits"
//           subtitle="Experience luxury travel with expert guides and carefully curated itineraries."
//           light
//         />

//         {/* Example 3 - Left aligned */}
//         <SectionHeading
//           badge="Our Services"
//           title="Tailored Travel Experiences"
//           subtitle="Personalized tours designed to create memories that last a lifetime."
//           center={false}
//           light
//         />
//       </div>
//     </div>
//   )
// }