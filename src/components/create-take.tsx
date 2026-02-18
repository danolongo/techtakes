'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function CreateTake({ user }: { user: any }) {
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const charCount = content.length
    const charPercent = (charCount / 280) * 100

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || !user) return

        setIsSubmitting(true)
        try {
            const { error } = await supabase.from('posts').insert({
                content: content.trim(),
                user_id: user.id,
            })
            if (error) throw error
            setContent('')
            router.refresh()
        } catch (error) {
            console.error('Error creating post:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!user) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
        >
            <form
                onSubmit={handleSubmit}
                className={cn(
                    'card-avant rounded-none p-6 transition-all duration-500',
                    isFocused && 'border-white/15'
                )}
            >
                {/* Header label */}
                <div className="flex items-center justify-between mb-4">
                    <span className="mono-label">// NEW TRANSMISSION</span>
                    <span className="mono-label">
                        {user.email?.split('@')[0]}
                    </span>
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="DECLARE YOUR POSITION ON AI..."
                    className="w-full bg-transparent text-sm font-mono text-white/90 placeholder:text-white/15 placeholder:tracking-wider resize-none outline-none min-h-[100px] leading-relaxed border-none"
                    maxLength={280}
                />

                {/* Bottom bar */}
                <AnimatePresence>
                    {(content.length > 0 || isFocused) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="pt-4 space-y-4"
                        >
                            {/* Progress bar — full width thin line */}
                            <div className="relative w-full h-[2px] bg-white/5 overflow-hidden">
                                <motion.div
                                    className={cn(
                                        'absolute left-0 top-0 h-full',
                                        charPercent > 90
                                            ? 'bg-[#ff0050]'
                                            : charPercent > 75
                                                ? 'bg-[#ff6b00]'
                                                : 'bg-gradient-to-r from-[#ff0050] to-[#00c8ff]'
                                    )}
                                    animate={{ width: `${charPercent}%` }}
                                    transition={{ duration: 0.2 }}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={cn(
                                    'font-mono text-xs tabular-nums',
                                    charCount > 260 ? 'char-danger' : charCount > 220 ? 'char-warning' : 'text-white/20'
                                )}>
                                    {charCount}
                                    <span className="text-white/10">/280</span>
                                </span>

                                <motion.button
                                    type="submit"
                                    disabled={!content.trim() || isSubmitting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="font-mono text-xs uppercase tracking-[0.2em] px-6 py-2 border border-white/10 text-white/60 hover:text-white hover:border-[#ff0050] disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,80,0.15)]"
                                >
                                    {isSubmitting ? (
                                        <span className="animate-pulse">TRANSMITTING...</span>
                                    ) : (
                                        'TRANSMIT →'
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </motion.div>
    )
}
