import { createClient } from '@/utils/supabase/server'
import TakeCard from './take-card'

export default async function Feed() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: posts, error } = await supabase
        .from('posts_with_stats')
        .select('*')
        .order('vote_count', { ascending: false })

    if (error) {
        return (
            <div className="card-avant rounded-none p-8 text-center">
                <span className="mono-label text-[#ff0050]">// ERROR: FEED OFFLINE</span>
                <p className="text-sm text-white/40 font-mono mt-2">
                    Unable to load transmissions. Try again later.
                </p>
            </div>
        )
    }

    let userVotes = new Set<string>()
    if (user) {
        const { data: votes } = await supabase
            .from('votes')
            .select('post_id')
            .eq('user_id', user.id)
        if (votes) {
            votes.forEach((v: { post_id: string }) => userVotes.add(v.post_id))
        }
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
                {/* Empty state — minimal geometric */}
                <div className="w-16 h-16 border border-white/[0.06] rotate-45 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white/5 rotate-45" />
                </div>
                <div className="text-center space-y-2">
                    <p className="font-mono text-sm text-white/40 uppercase tracking-wider">
                        NO TRANSMISSIONS YET
                    </p>
                    <p className="mono-label">
                        Be the first to break the silence
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-[1px]">
            {posts.map((post: any, index: number) => (
                <TakeCard
                    key={post.id}
                    post={post}
                    currentUserId={user?.id}
                    hasUpvoted={userVotes.has(post.id)}
                    index={index}
                />
            ))}
        </div>
    )
}
