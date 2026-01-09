'use client'
import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { CheckIcon, StarIcon, ClockIcon, SparklesIcon } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    period: '/year',
    description: 'Perfect for getting started as a tour host',
    features: [
      'Create up to 4 tours per year',
      'Basic tour listing',
      'Standard support',
      'Payment processing',
      'Tour calendar management',
      '5 blog posts per year',
      'Host dashboard access',
    ],
    cta: 'Get Started',
    highlighted: false,
    available: true,
  },
  {
    name: 'Standard',
    price: '$99',
    period: '/year',
    description: 'Great for active tour hosts',
    features: [
      'Create up to 8 tours per year',
      'Featured tour listings',
      'Priority support',
      'Advanced analytics',
      'Payment processing',
      'Tour calendar management',
      'Custom branding options',
      'Photo gallery (up to 20 images)',
      '10 blog posts per year',
      'Social media integration',
    ],
    cta: 'Start Now',
    highlighted: true,
    available: false, // Temporarily unavailable
  },
  {
    name: 'Premium',
    price: '$199',
    period: '/year',
    description: 'For professional tour hosts',
    features: [
      'Create up to 12 tours per year',
      'Premium featured listings',
      'Dedicated support manager',
      'Advanced analytics & insights',
      'Payment processing',
      'Tour calendar management',
      'Full custom branding',
      'Unlimited photo gallery',
      'Video tour previews',
      'Multi-language support',
      'API access',
      'Unlimited blog posts',
    ],
    cta: 'Go Premium',
    highlighted: false,
    available: false, // Temporarily unavailable
  },
]

export function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px',
  })

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-blue-600 text-sm font-medium mb-4 shadow-sm border border-blue-100">
            <SparklesIcon className="w-4 h-4" />
            Host Pricing Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start hosting tours with flexible annual plans designed for your needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-2xl scale-105 border-4 border-blue-400'
                  : plan.available
                  ? 'bg-white shadow-lg border border-blue-100 hover:shadow-xl transition-shadow'
                  : 'bg-white/50 shadow-lg border border-blue-100/50 backdrop-blur-sm'
              }`}
            >
              {/* Coming Soon Overlay for Premium Plans */}
              {!plan.available && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-blue-50/80 backdrop-blur-sm rounded-2xl z-10 flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 p-3 rounded-full bg-blue-100/80">
                    <ClockIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Feature Coming Soon
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We're working hard to bring you more amazing features!
                  </p>
                  <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-4 w-full">
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      For now, enjoy:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-500" />
                        5 blog posts per year
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-500" />
                        4 tour creations per year
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium shadow-lg z-20">
                  <StarIcon className="w-4 h-4" />
                  Most Popular
                </div>
              )}

              <div className="mb-6 relative z-0">
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    plan.highlighted ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-bold ${
                      plan.highlighted ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={
                      plan.highlighted ? 'text-white/80' : 'text-gray-600'
                    }
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  className={`mt-2 text-sm ${
                    plan.highlighted ? 'text-white/90' : 'text-gray-600'
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1 relative z-0">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckIcon
                      className={`w-5 h-5 shrink-0 ${
                        plan.highlighted
                          ? 'text-blue-200'
                          : plan.available
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.highlighted
                          ? 'text-white/95'
                          : plan.available
                          ? 'text-gray-700'
                          : 'text-gray-500'
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-full font-semibold transition-all duration-300 relative z-0 ${
                  plan.highlighted
                    ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl'
                    : plan.available
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed shadow-sm'
                }`}
                disabled={!plan.available}
              >
                {plan.available ? plan.cta : 'Coming Soon'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Current Feature Highlight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-12 max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Current Available Features
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-100">
                      <CheckIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">5 Blog Posts</p>
                      <p className="text-sm text-gray-600">Per year included</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-100">
                      <CheckIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">4 Tour Creations</p>
                      <p className="text-sm text-gray-600">Per year included</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 mb-2">
                Enjoy these features right now
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
                Start Free Today
              </button>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-8 text-gray-600 flex items-center justify-center gap-2"
        >
          <ClockIcon className="w-4 h-4" />
          All plans are billed annually. More features coming soon!
        </motion.p>
      </div>
    </section>
  )
}