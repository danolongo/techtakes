import { createClient } from '@/utils/supabase/server'
import { Newspaper } from 'lucide-react'

export default async function TrendingAiNews() {
    const supabase = await createClient()

    const { data: news } = await supabase
        .from('daily_ai_news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (!news) return null

    const { sources } = news
    // Parse sources if it's stored as a string, otherwise use directly
    const content = typeof sources === 'string' ? JSON.parse(sources) : sources

    return (
        <div className="mb-12 relative group rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <div className="p-6 md:p-8 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Newspaper className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h2 className="text-sm font-mono uppercase tracking-wider text-indigo-300">
                        Todays Trending AI News
                    </h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-indigo-500/20 to-transparent" />
                    <span className="text-xs text-white/40 font-mono">
                        {new Date(news.created_at).toLocaleDateString()}
                    </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    {content.headline || "Daily AI Digest"}
                </h3>

                <p className="text-white/70 leading-relaxed mb-6 max-w-3xl">
                    {content.summary}
                </p>

                {content.key_points && (
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                        {content.key_points.map((point: string, i: number) => (
                            <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5 text-sm text-white/60">
                                • {point}
                            </div>
                        ))}
                    </div>
                )}

                {content.sources && (
                    <div className="flex gap-4 text-xs text-indigo-300/60 font-mono">
                        <span>SOURCES:</span>
                        {/* We just show source names, could be links */}
                        {content.sources.map((s: any, i: number) => (
                            <span key={i}>{s.source || "Unknown"}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
