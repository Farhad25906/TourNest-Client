'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'

const faqs = [
    {
        question: 'How do I book a tour?',
        answer: 'Booking a tour is easy! Simply browse our available tours, select your preferred dates, and click the "Book Now" button. You will be guided through a secure checkout process.',
    },
    {
        question: 'Can I cancel my booking?',
        answer: 'Yes, you can cancel your booking through your dashboard. Cancellation policies vary by tour, so please check the specific terms during booking or in your confirmation email.',
    },
    {
        question: 'Are flights included in the tour price?',
        answer: 'Generally, flights are not included in the tour price unless explicitly stated in the tour description. This allows you to choose the best flight options for your needs.',
    },
    {
        question: 'Do I need travel insurance?',
        answer: 'While not mandatory for all tours, we highly recommend purchasing travel insurance to protect yourself against unexpected changes or emergencies.',
    },
    {
        question: 'Is the platform secure?',
        answer: 'Absolutely. We use industry-standard encryption and secure payment gateways to ensure your personal information and transactions are always protected.',
    },
]

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">
                <SectionHeading
                    badge="Got Questions?"
                    title="Frequently Asked Questions"
                    subtitle="Everything you need to know about TourNest and how we work."
                />

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left focus:outline-none"
                            >
                                <span className="text-lg font-semibold text-gray-900 line-clamp-1">
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ChevronDown className="w-5 h-5 text-[#138bc9]" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="px-8 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
