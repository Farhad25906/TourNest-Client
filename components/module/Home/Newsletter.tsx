'use client'
import { motion } from 'framer-motion'
import { SendIcon } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function Newsletter() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-60" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="bg-[#138bc9] rounded-3xl p-12 md:p-20 shadow-2xl overflow-hidden relative">
                    {/* Internal decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -translate-x-1/3 translate-y-1/3" />

                    <div className="max-w-3xl mx-auto text-center">
                        <SectionHeading
                            light
                            badge="Stay Updated"
                            title="Join Our Newsletter"
                            subtitle="Subscribe to receive exclusive travel deals, destination guides, and the latest adventures right in your inbox."
                        />

                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                            className="mt-10 flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-md transition-all h-14"
                            />
                            <button
                                type="submit"
                                className="px-8 py-4 bg-white text-[#138bc9] font-bold rounded-full hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-lg h-14"
                            >
                                <SendIcon className="w-5 h-5" />
                                Subscribe
                            </button>
                        </motion.form>

                        <p className="mt-6 text-blue-100 text-sm opacity-80">
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
