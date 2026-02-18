'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { LogOut } from 'lucide-react'

export default function Navbar({ user }: { user: User | null }) {
    const supabase = createClient()
    const router = useRouter()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="border-b border-white/[0.04] bg-black/40 backdrop-blur-xl sticky top-0 z-50"
        >
            <div className="max-w-4xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-3">
                    {/* Geometric logo mark */}
                    <div className="relative w-8 h-8">
                        <motion.div
                            className="absolute inset-0 border border-white/40 rotate-45"
                            whileHover={{ rotate: 135, scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        />
                        <div className="absolute inset-1.5 bg-gradient-to-br from-[#ff0050] to-[#00c8ff] rotate-45 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="font-mono text-sm font-bold tracking-[0.3em] uppercase text-white/80 group-hover:text-white transition-colors">
                        TECHTAKES
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                {/* Abstract avatar — angular shape */}
                                <div className="w-7 h-7 corner-cut bg-gradient-to-br from-[#ff0050] to-[#7000ff] flex items-center justify-center text-[10px] font-mono font-bold text-white uppercase">
                                    {user.email?.[0] || '?'}
                                </div>
                                <span className="mono-label hidden sm:block tracking-[0.1em]">
                                    {user.email?.split('@')[0]}
                                </span>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-1.5 text-xs text-white/30 hover:text-[#ff0050] transition-colors duration-300 font-mono uppercase tracking-wider"
                            >
                                <LogOut className="w-3 h-3" />
                                <span className="hidden sm:inline">Exit</span>
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="relative font-mono text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white px-4 py-2 border border-white/10 hover:border-[#ff0050]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,80,0.15)]"
                        >
                            Enter
                        </Link>
                    )}
                </div>
            </div>
        </motion.nav>
    )
}
