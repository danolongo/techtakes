'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroSection({ isLoggedIn }: { isLoggedIn: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative py-8 sm:py-16"
        >
            {/* Decorative line accent */}
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: '60px' }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-[2px] bg-gradient-to-r from-[#ff0050] to-[#00c8ff] mb-8"
            />

            {/* Main heading — oversized, broken grid */}
            <div className="space-y-2">
                <motion.div
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className="mono-label block mb-3">// PLATFORM v2.0</span>
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.85]">
                        <span
                            className="glitch-text text-white"
                            data-text="HOT"
                        >
                            HOT
                        </span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.85]">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0050] via-[#7000ff] to-[#00c8ff]">
                            TAKES
                        </span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.85] text-white/10">
                        ON AI
                    </h1>
                </motion.div>
            </div>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="mt-8 text-sm text-white/40 font-mono leading-relaxed max-w-md"
            >
                The unfiltered arena for artificial intelligence discourse.
                <br />
                <span className="text-white/20">Post your perspective. Let the community decide.</span>
            </motion.p>

            {!isLoggedIn && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                    className="mt-8 flex items-center gap-6"
                >
                    <Link
                        href="/login"
                        className="group relative inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.2em] text-white px-6 py-3 border border-white/20 hover:border-[#ff0050] transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,0,80,0.2)]"
                    >
                        <span className="relative z-10">Begin</span>
                        <motion.span
                            className="text-[#ff0050]"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            →
                        </motion.span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#ff0050]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>
                    <span className="mono-label">FREE ACCESS</span>
                </motion.div>
            )}

            {/* Data points */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="mt-12 flex items-center gap-8"
            >
                {[
                    { value: '280', label: 'CHAR LIMIT' },
                    { value: '∞', label: 'TAKES' },
                    { value: '▲', label: 'VOTE SYSTEM' },
                ].map(({ value, label }, i) => (
                    <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4 + i * 0.1, duration: 0.3 }}
                        className="flex items-baseline gap-2"
                    >
                        <span className="text-xl font-bold text-white/60">{value}</span>
                        <span className="mono-label">{label}</span>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}
