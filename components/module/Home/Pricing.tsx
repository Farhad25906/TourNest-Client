'use client'
import React, { useEffect, useState } from 'react'
import { CheckIcon, StarIcon, ClockIcon, SparklesIcon, Loader2, User } from 'lucide-react'
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
      if (response?.success && Array.isArray(response.data) && response.data.length > 0) {
        const transformed = response.data.map((plan: any, index: number) => {
          let features = []
          if (Array.isArray(plan.features)) {
            features = plan.features
          } else if (typeof plan.features === 'string') {
            try { features = JSON.parse(plan.features) } catch { features = plan.features ? [plan.features] : [] }
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
        setPlans(transformed)
      } else {
        setError(true)
      }
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <PricingSkeleton />

  return (
    <section className="py-24 bg-gray-50/50 pt-32 pb-32 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#138bc9]/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] -ml-40 -mb-40" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="px-5 py-2 bg-[#138bc9]/10 text-[#138bc9] rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">
            Host Packages
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter">
            Grow Your <span className="text-[#138bc9]">Hosting Business</span>
          </h2>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
            Simple, transparent pricing to help you scale your tour hosting experience with expert tools and insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-[2.5rem] p-10 flex flex-col transition-all duration-500 hover:translate-y-[-10px] ${plan.isPopular
                ? 'bg-gradient-to-br from-[#138bc9] to-[#0e6ba3] text-white shadow-2xl scale-105 z-10'
                : 'bg-white shadow-xl shadow-blue-100/50 border border-white hover:shadow-2xl'
                }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-2 rounded-full bg-white text-[#138bc9] text-xs font-black shadow-xl z-20 uppercase tracking-widest">
                  <StarIcon className="w-4 h-4 fill-[#138bc9]" />
                  Most Recommended
                </div>
              )}

              <div className="mb-10">
                <h3 className={`text-2xl font-black mb-4 ${plan.isPopular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-black ${plan.isPopular ? 'text-white' : 'text-[#138bc9]'}`}>
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  <span className={`text-sm font-bold uppercase tracking-widest ${plan.isPopular ? 'text-white/70' : 'text-gray-400'}`}>
                    {plan.duration}
                  </span>
                </div>
                <p className={`mt-4 text-base leading-relaxed ${plan.isPopular ? 'text-white/80' : 'text-gray-500 font-medium'}`}>
                  {plan.description}
                </p>
              </div>

              <div className={`h-px w-full mb-10 ${plan.isPopular ? 'bg-white/20' : 'bg-gray-100'}`} />

              <ul className="space-y-4 mb-12 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${plan.isPopular ? 'bg-white/20' : 'bg-[#138bc9]/10'
                      }`}>
                      <CheckIcon className={`w-3.5 h-3.5 ${plan.isPopular ? 'text-white' : 'text-[#138bc9]'}`} />
                    </div>
                    <span className={`text-sm font-semibold italic ${plan.isPopular ? 'text-white/90' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-5 rounded-[1.5rem] font-black transition-all text-lg shadow-xl ${!plan.isActive
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : plan.isPopular
                    ? 'bg-white text-[#138bc9] hover:bg-gray-50'
                    : 'bg-[#138bc9] text-white hover:bg-[#0e6ba3]'
                  }`}
                disabled={!plan.isActive}
                onClick={() => router.push('/login')}
              >
                {!plan.isActive ? 'Waitlist' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-6 px-10 py-6 bg-white rounded-3xl shadow-lg border border-gray-50">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 overflow-hidden">
                  <User className="w-6 h-6 opacity-20" />
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-gray-600">
              Joined by <span className="text-[#138bc9]">500+ local hosts</span> worldwide
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}