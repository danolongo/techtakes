'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface PostProps {
    post: {
        id: string
        content: string
        created_at: string
        vote_count: number
        username: string
        avatar_url?: string
    }
    currentUserId?: string
    hasUpvoted: boolean
    index: number
}

export default function TakeCard({
    post,
    currentUserId,
    hasUpvoted: initialHasUpvoted,
    index,
}: PostProps) {
    const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted)
    const [voteCount, setVoteCount] = useState(Number(post.vote_count))
    const [isVoting, setIsVoting] = useState(false)
    const [showFlash, setShowFlash] = useState(false)
    const supabase = createClient()

    const handleVote = async () => {
        if (!currentUserId || isVoting) return
        setIsVoting(true)

        const newHasUpvoted = !hasUpvoted
        setHasUpvoted(newHasUpvoted)
        setVoteCount((prev) => (newHasUpvoted ? prev + 1 : prev - 1))

        if (newHasUpvoted) {
            setShowFlash(true)
            setTimeout(() => setShowFlash(false), 400)
        }

        try {
            if (newHasUpvoted) {
                await supabase.from('votes').insert({
                    post_id: post.id,
                    user_id: currentUserId,
                })
            } else {
                await supabase.from('votes').delete().match({
                    post_id: post.id,
                    user_id: currentUserId,
                })
            }
        } catch {
            setHasUpvoted(!newHasUpvoted)
            setVoteCount((prev) => (!newHasUpvoted ? prev + 1 : prev - 1))
        } finally {
            setIsVoting(false)
        }
    }

    const displayName = post.username || 'ANON'
    const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

    return (
        <motion.article
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="card-avant rounded-none p-0 overflow-hidden"
        >
            <div className="flex">
                {/* Vote strip — vertical sidebar */}
                <div className="relative flex flex-col items-center justify-center gap-1 px-4 py-5 border-r border-white/[0.04] min-w-[56px]">
                    <motion.button
                        whileTap={{ scale: 0.7 }}
                        onClick={handleVote}
                        disabled={!currentUserId}
                        className={cn(
                            'relative w-8 h-8 flex items-center justify-center transition-all duration-300',
                            hasUpvoted
                                ? 'text-[#ff0050]'
                                : 'text-white/20 hover:text-white/50',
                            !currentUserId && 'opacity-30 cursor-not-allowed'
                        )}
                    >
                        {/* Custom triangle arrow */}
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor">
                            <path d="M8 0L16 14H0L8 0Z" />
                        </svg>

                        {/* Vote flash */}
                        <AnimatePresence>
                            {showFlash && (
                                <motion.div
                                    initial={{ opacity: 1, scale: 0.5 }}
                                    animate={{ opacity: 0, scale: 3 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 bg-[#ff0050]/20 pointer-events-none"
                                />
                            )}
                        </AnimatePresence>
                    </motion.button>

                    <motion.span
                        key={voteCount}
                        initial={{ scale: 1.5 }}
                        animate={{ scale: 1 }}
                        className={cn(
                            'font-mono text-xs font-bold tabular-nums',
                            hasUpvoted ? 'text-[#ff0050]' : 'text-white/30'
                        )}
                    >
                        {voteCount}
                    </motion.span>

                    {/* Rank indicator for top 3 */}
                    {index < 3 && (
                        <div className={cn(
                            'absolute top-1 right-1 font-mono text-[8px] font-bold',
                            index === 0 && 'text-[#ff0050]',
                            index === 1 && 'text-[#00c8ff]',
                            index === 2 && 'text-[#7000ff]'
                        )}>
                            #{index + 1}
                        </div>
                    )}
                </div>

                {/* Content area */}
                <div className="flex-1 p-5 space-y-3">
                    {/* Meta line */}
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] font-bold text-white/50 uppercase tracking-wider">
                            @{displayName}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="mono-label">
                            {timeAgo}
                        </span>
                        {index === 0 && (
                            <span className="mono-label text-[#ff0050] ml-auto">
                                ★ TOP TAKE
                            </span>
                        )}
                    </div>

                    {/* Post content */}
                    <p className="text-[15px] text-white/80 leading-relaxed font-light tracking-wide break-words">
                        {post.content}
                    </p>

                    {/* Bottom accent line */}
                    <div className="pt-2">
                        <div
                            className="h-[1px] opacity-20"
                            style={{
                                width: `${Math.min(100, (voteCount / 10) * 100)}%`,
                                background: index === 0
                                    ? 'linear-gradient(90deg, #ff0050, transparent)'
                                    : index === 1
                                        ? 'linear-gradient(90deg, #00c8ff, transparent)'
                                        : 'linear-gradient(90deg, rgba(255,255,255,0.3), transparent)',
                            }}
                        />
                    </div>
                </div>
            </div>
        </motion.article>
    )
}
