import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getPublicData } from '@/server/aerous.functions'
import type { PublicData } from '@/lib/types'
import { ToastProvider } from '@/components/site/Toast'
import { Navbar } from '@/components/site/Navbar'
import { AnnouncementBanner, StatusRow } from '@/components/site/AnnouncementBanner'
import { Hero } from '@/components/site/Hero'
import { AppsShowcase } from '@/components/site/AppsShowcase'
import { TransparencyMatrix } from '@/components/site/TransparencyMatrix'
import { Roadmap } from '@/components/site/Roadmap'
import { ContactSection } from '@/components/site/ContactSection'
import { Footer } from '@/components/site/Footer'

export const Route = createFileRoute('/')({
  loader: async () => {
    const data = await getPublicData()
    return { data }
  },
  head: () => ({
    meta: [{ title: 'Aerous Labs — Engineering the Future of Local Intelligence' }],
  }),
  component: HomePage,
})

function HomePage() {
  const { data: initialData } = Route.useLoaderData()
  const [data, setData] = useState<PublicData>(initialData)

  useEffect(() => {
    const poll = async () => {
      try {
        const fresh = await getPublicData()
        setData(fresh)
      } catch {
        /* keep last known good state */
      }
    }
    const interval = setInterval(poll, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#030712]">
        <AnnouncementBanner text={data.settings.bannerText} link={data.settings.bannerLink} enabled={data.settings.bannerEnabled} />
        <StatusRow label={data.settings.statusLabel} />
        <Navbar />
        <Hero title={data.settings.heroTitle} subtitle={data.settings.heroSubtitle} />
        <AppsShowcase apps={data.apps} tools={data.tools} />
        <TransparencyMatrix matrix={data.matrix} />
        <Roadmap items={data.roadmap} />
        <ContactSection />
        <Footer />
      </div>
    </ToastProvider>
  )
}
