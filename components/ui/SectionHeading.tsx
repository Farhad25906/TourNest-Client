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
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={`${center ? 'text-center' : 'text-left'} mb-12`}
    >
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#138bc915] text-[#138bc9] text-sm font-semibold mb-4 tracking-wide uppercase">
          {badge}
        </span>
      )}
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 ${
          light ? 'text-white' : 'text-gray-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg md:text-xl max-w-2xl ${
            center ? 'mx-auto' : ''
          } ${light ? 'text-blue-100' : 'text-gray-600'}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
