'use client'
import React, { useEffect, useState } from 'react'
import { CheckIcon, StarIcon, ClockIcon, SparklesIcon, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getPublicSubscriptions } from '@/services/subscription.service'
import { SectionHeading } from '@/components/ui/SectionHeading'

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  isPopular?: boolean;
  isActive?: boolean;
}

const PricingSkeleton = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="h-8 w-48 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
          <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((index) => (
            <div key={index} className="relative rounded-2xl p-8 bg-white shadow-lg border border-blue-100">
              <div className="mb-6">
                <div className="h-7 bg-gray-200 rounded w-1/4 mb-3 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
              <div className="space-y-3 mb-8">
                {[1, 2, 3, 4].map((f) => (
                  <div key={f} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="h-12 bg-gray-200 rounded-full w-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Pricing() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    setLoading(true)
    setError(false)

    try {
      const response = await getPublicSubscriptions()
      console.log('API Response:', response)

      if (response?.success && Array.isArray(response.data) && response.data.length > 0) {
        const transformed = response.data.map((plan: any, index: number) => {
          let features = []

          if (Array.isArray(plan.features)) {
            features = plan.features
          } else if (typeof plan.features === 'string') {
            try {
              features = JSON.parse(plan.features)
            } catch {
              features = plan.features ? [plan.features] : []
            }
          }

          return {
            id: plan.id || `plan-${index}`,
            name: plan.name || 'Plan',
            description: plan.description || '',
            price: Number(plan.price) || 0,
            duration: plan.duration === 12 ? '/year' : `/${plan.duration} months`,
            features: features,
            isPopular: index === 1,
            isActive: plan.isActive ?? true,
          }
        })

        console.log('Transformed Plans:', transformed)
        setPlans(transformed)
      } else {
        console.warn('No data received')
        setError(true)
      }
    } catch (err) {
      console.error('Error loading plans:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <PricingSkeleton />
  }

  if (error || plans.length === 0) {
    return (
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClockIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Plans Coming Soon
          </h2>
          <p className="text-gray-600 mb-8">
            We're setting up our subscription plans. Check back soon!
          </p>
          <button
            onClick={loadPlans}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Retry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          badge="Host Pricing Plans"
          title="Choose Your Plan"
          subtitle="Start hosting tours with flexible annual plans designed for your needs"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 flex flex-col transition-all duration-500 hover:translate-y-[-8px] ${plan.isPopular
                  ? 'bg-gradient-to-br from-[#138bc9] to-[#0e6ba3] text-white shadow-2xl scale-105 border-0'
                  : 'bg-white shadow-xl border border-blue-100 hover:shadow-2xl'
                }`}
            >
              {!plan.isActive && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl z-10 flex flex-col items-center justify-center p-6">
                  <div className="p-3 rounded-full bg-blue-100 mb-4">
                    <ClockIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-gray-600 text-center">
                    This plan will be available soon!
                  </p>
                </div>
              )}

              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-to-r from-[#138bc9] to-[#0e6ba3] text-white text-sm font-medium shadow-lg z-20">
                  <StarIcon className="w-4 h-4" />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-semibold mb-2 ${plan.isPopular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.isPopular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  <span className={plan.isPopular ? 'text-white/80' : 'text-gray-600'}>
                    {plan.duration}
                  </span>
                </div>
                <p className={`mt-2 text-sm ${plan.isPopular ? 'text-white/90' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckIcon className={`w-5 h-5 shrink-0 ${plan.isPopular ? 'text-blue-200' : 'text-[#138bc9]'}`} />
                    <span className={`text-sm ${plan.isPopular ? 'text-white/95' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-full font-semibold transition-all ${!plan.isActive
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : plan.isPopular
                      ? 'bg-white text-[#138bc9] hover:bg-blue-50 shadow-lg'
                      : 'bg-[#138bc9] text-white hover:bg-[#138bc9]/90 shadow-md'
                  }`}
                disabled={!plan.isActive}
                onClick={() => router.push('/login')}
              >
                {!plan.isActive ? 'Coming Soon' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>


        <p className="text-center mt-8 text-gray-600 flex items-center justify-center gap-2">
          <ClockIcon className="w-4 h-4" />
          All plans are billed annually
        </p>
      </div>
    </section>
  )
}