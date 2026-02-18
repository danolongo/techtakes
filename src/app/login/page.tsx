'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginPage() {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        setError(null)
        try {
            if (mode === 'signin') {
                await login(formData)
            } else {
                await signup(formData)
            }
        } catch (e: any) {
            setError(e?.message || 'SYSTEM ERROR')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-sm"
            >
                {/* Geometric logo */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <div className="relative w-6 h-6">
                        <div className="absolute inset-0 border border-white/40 rotate-45" />
                        <div className="absolute inset-1.5 bg-gradient-to-br from-[#ff0050] to-[#00c8ff] rotate-45 opacity-60" />
                    </div>
                    <span className="font-mono text-sm font-bold tracking-[0.3em] uppercase text-white/60">
                        TECHTAKES
                    </span>
                </div>

                {/* Card */}
                <div className="card-avant rounded-none p-8 space-y-8">
                    {/* Mode Tabs — brutalist toggle */}
                    <div className="flex border-b border-white/[0.06]">
                        {(['signin', 'signup'] as const).map((m) => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => { setMode(m); setError(null) }}
                                className={`relative flex-1 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${mode === m ? 'text-white' : 'text-white/20 hover:text-white/40'
                                    }`}
                            >
                                {m === 'signin' ? 'ACCESS' : 'REGISTER'}
                                {mode === m && (
                                    <motion.div
                                        layoutId="tab-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#ff0050] to-[#00c8ff]"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            {mode === 'signin' ? 'Welcome back' : 'Create identity'}
                        </h1>
                        <p className="mono-label">
                            {mode === 'signin'
                                ? '// AUTHENTICATE TO CONTINUE'
                                : '// JOIN THE DISCOURSE'}
                        </p>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border border-[#ff0050]/20 bg-[#ff0050]/5 px-4 py-3 font-mono text-xs text-[#ff0050]"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form action={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {mode === 'signup' && (
                                <motion.div
                                    key="username-field"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-2"
                                >
                                    <label htmlFor="username" className="mono-label">
                                        HANDLE
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="your_alias"
                                        required={mode === 'signup'}
                                        className="w-full h-11 px-4 bg-transparent border border-white/[0.06] font-mono text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-[#ff0050]/40 transition-all duration-300"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label htmlFor="email" className="mono-label">
                                EMAIL
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="user@domain.com"
                                required
                                className="w-full h-11 px-4 bg-transparent border border-white/[0.06] font-mono text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-[#ff0050]/40 transition-all duration-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="mono-label">
                                PASSWORD
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="w-full h-11 px-4 bg-transparent border border-white/[0.06] font-mono text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-[#ff0050]/40 transition-all duration-300"
                            />
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full h-11 font-mono text-xs uppercase tracking-[0.2em] text-white border border-white/10 hover:border-[#ff0050] transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,0,80,0.15)] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="animate-pulse">PROCESSING...</span>
                            ) : (
                                mode === 'signin' ? 'AUTHENTICATE →' : 'INITIALIZE →'
                            )}
                        </motion.button>
                    </form>
                </div>

                <p className="text-center mono-label mt-6">
                    {mode === 'signin' ? 'NEW HERE? ' : 'ALREADY REGISTERED? '}
                    <button
                        type="button"
                        onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null) }}
                        className="text-[#ff0050] hover:text-white transition-colors duration-300"
                    >
                        {mode === 'signin' ? 'REGISTER' : 'ACCESS'}
                    </button>
                </p>
            </motion.div>
        </div>
    )
}
