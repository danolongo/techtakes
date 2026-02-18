import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/ui/navbar'
import { createClient } from '@/utils/supabase/server'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'TECHTAKES — Unfiltered AI Discourse',
  description: 'The avant-garde arena for AI hot takes. Post. Vote. Disrupt.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Background layers */}
        <div className="bg-grid" />
        <div className="bg-noise" />

        {/* Floating geometric shapes */}
        <svg className="geo-float" style={{ top: '10%', left: '5%' }} width="120" height="120" viewBox="0 0 120 120">
          <polygon points="60,0 120,120 0,120" fill="none" stroke="white" strokeWidth="0.5" />
        </svg>
        <svg className="geo-float" style={{ top: '60%', right: '8%' }} width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="39" fill="none" stroke="white" strokeWidth="0.5" />
        </svg>
        <svg className="geo-float" style={{ top: '30%', right: '20%' }} width="60" height="60" viewBox="0 0 60 60">
          <rect x="5" y="5" width="50" height="50" fill="none" stroke="white" strokeWidth="0.5" transform="rotate(45,30,30)" />
        </svg>

        <Navbar user={user} />
        <main className="flex-1 w-full max-w-4xl mx-auto px-6 sm:px-8 py-12">
          {children}
        </main>

        <footer className="border-t border-white/[0.04] py-8">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 flex items-center justify-between">
            <span className="mono-label">© 2026 TECHTAKES</span>
            <span className="mono-label">BUILT DIFFERENT</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
