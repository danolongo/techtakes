import Link from 'next/link'

export default function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] gap-8">
            {/* Glitched error display */}
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-extrabold tracking-tighter">
                    <span className="glitch-text text-white" data-text="ERR">
                        ERR
                    </span>
                </h1>
                <p className="mono-label text-[#ff0050]">// SYSTEM FAULT DETECTED</p>
                <p className="font-mono text-sm text-white/30 max-w-xs mx-auto">
                    An unexpected error occurred in the transmission pipeline.
                </p>
            </div>
            <Link
                href="/"
                className="font-mono text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white px-6 py-3 border border-white/10 hover:border-[#ff0050] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,80,0.15)]"
            >
                RETURN HOME →
            </Link>
        </div>
    )
}
