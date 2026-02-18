import CreateTake from '@/components/create-take'
import Feed from '@/components/feed'
import HeroSection from '@/components/hero-section'
import { createClient } from '@/utils/supabase/server'
import { Suspense } from 'react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-16">
      <HeroSection isLoggedIn={!!user} />

      <CreateTake user={user} />

      <div>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-2 h-2 bg-[#ff0050] animate-pulse" />
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">
            LIVE FEED
          </h2>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
          <span className="mono-label">SORTED BY ▲</span>
        </div>

        <Suspense
          fallback={
            <div className="space-y-[1px]">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 bg-white/[0.015] border border-white/[0.04] animate-pulse"
                />
              ))}
            </div>
          }
        >
          <Feed />
        </Suspense>
      </div>
    </div>
  )
}
