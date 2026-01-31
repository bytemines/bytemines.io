import { HeroSection } from "@/components/hero-section"
import { ContentFeed } from "@/components/content/content-feed"

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <HeroSection />
      <ContentFeed />
    </div>
  )
}
