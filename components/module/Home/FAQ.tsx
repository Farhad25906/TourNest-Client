'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const faqs = [
    {
        question: 'How do I book a tour?',
        answer: 'Simply browse our available tours, select your preferred dates, and click Book Now. You\'ll be guided through a secure checkout process.',
    },
    {
        question: 'Can I cancel my booking?',
        answer: 'Yes, you can cancel through your dashboard. Cancellation policies vary by tour — check the specific terms in your confirmation email.',
    },
    {
        question: 'Are flights included in the tour price?',
        answer: 'Flights are not included unless explicitly stated in the tour description. This lets you choose the best flight options for your needs.',
    },
    {
        question: 'Do I need travel insurance?',
        answer: 'While not mandatory, we highly recommend travel insurance to protect against unexpected changes or emergencies.',
    },
    {
        question: 'Is the platform secure?',
        answer: 'Absolutely. We use industry-standard encryption and secure payment gateways to keep your data and transactions safe.',
    },
]

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section className="py-16 px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl border border-gray-100 shadow-sm min-h-[560px]">

                    {/* Image Column */}
                    <div className="relative min-h-[280px] lg:min-h-full order-2 lg:order-1">
                        <Image
                            src="/Faq.webp"
                            alt="Swiss Alps mountain landscape"
                            fill
                            className="object-cover"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#138bc9]/40 to-[#042c53]/60" />

                        {/* Caption */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-xs font-medium px-3 py-1.5 rounded-full tracking-wide mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#5dcaa5]" />
                                Explore the world
                            </div>
                            <h3 className="text-white text-2xl font-medium leading-snug mb-1">
                                Your next adventure<br />starts here
                            </h3>
                            <p className="text-white/60 text-xs">
                                Swiss Alps, Europe — one of 500+ destinations
                            </p>
                        </div>
                    </div>

                    {/* FAQ Column */}
                    <div className="bg-white flex flex-col justify-center px-8 py-12 order-1 lg:order-2">
                        <span className="inline-block bg-[#e6f4fb] text-[#138bc9] text-xs font-medium px-3.5 py-1.5 rounded-full tracking-wide mb-3 self-start">
                            Got questions?
                        </span>
                        <div className="w-8 h-0.5 bg-[#138bc9] rounded-full mb-3" />
                        <h2 className="text-[22px] font-medium text-gray-900 mb-2 leading-snug">
                            Frequently asked questions
                        </h2>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            Everything you need to know about TourNest and how we work.
                        </p>

                        <div className="divide-y divide-gray-100 border-t border-gray-100">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 6 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.07 }}
                                    viewport={{ once: true }}
                                >
                                    <button
                                        onClick={() =>
                                            setOpenIndex(openIndex === index ? null : index)
                                        }
                                        className="w-full flex items-center gap-3 py-3.5 px-0.5 text-left focus:outline-none group"
                                    >
                                        <span className="text-[11px] font-medium text-[#138bc9] opacity-60 min-w-[24px] tabular-nums">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>

                                        <span className={`flex-1 text-sm font-medium leading-snug transition-colors duration-200 ${openIndex === index ? 'text-[#138bc9]' : 'text-gray-900 group-hover:text-[#138bc9]'}`}>
                                            {faq.question}
                                        </span>

                                        <span
                                            className={`w-[26px] h-[26px] rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${openIndex === index
                                                ? 'bg-[#138bc9] border-[#138bc9]'
                                                : 'border-gray-300 group-hover:bg-[#138bc9] group-hover:border-[#138bc9]'
                                                }`}
                                        >
                                            <motion.svg
                                                width="12"
                                                height="12"
                                                viewBox="0 0 12 12"
                                                fill="none"
                                                animate={{ rotate: openIndex === index ? 45 : 0 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                <line x1="6" y1="1" x2="6" y2="11" stroke="white" strokeWidth="1.6" strokeLinecap="round"
                                                    className={openIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                                                <line x1="6" y1="1" x2="6" y2="11" stroke="#138bc9" strokeWidth="1.6" strokeLinecap="round"
                                                    className={openIndex === index ? 'hidden' : 'group-hover:hidden'} />
                                                <line x1="1" y1="6" x2="11" y2="6"
                                                    stroke={openIndex === index ? 'white' : '#138bc9'}
                                                    strokeWidth="1.6" strokeLinecap="round"
                                                    className="group-hover:stroke-white" />
                                            </motion.svg>
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {openIndex === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.28, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <p className="pl-9 pb-4 text-sm text-gray-500 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}