import { cn } from "@/lib/utils"
import { PostCard } from "./post-card"
import { RepoCard } from "./repo-card"

// Placeholder data - will be replaced with real data
const placeholderPosts = [
  {
    slug: "getting-started-with-ai",
    title: "Getting Started with AI Development",
    excerpt:
      "A comprehensive guide to starting your journey in artificial intelligence development.",
    date: "2026-01-30",
  },
  {
    slug: "biotech-revolution",
    title: "The BioTech Revolution",
    excerpt:
      "Exploring the latest advancements in biotechnology and their impact on longevity.",
    date: "2026-01-28",
  },
]

const placeholderRepos = [
  {
    name: "quantum-simulator",
    description: "A lightweight quantum circuit simulator for learning quantum computing concepts.",
    url: "https://github.com/bytemines/quantum-simulator",
    stars: 128,
    language: "Python",
  },
]

export function ContentFeed() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {placeholderPosts.map((post, index) => (
        <PostCard
          key={post.slug}
          {...post}
          className={cn("opacity-0 animate-fade-in-up", `stagger-${index + 1}`)}
        />
      ))}

      {placeholderRepos.map((repo, index) => (
        <RepoCard
          key={repo.name}
          {...repo}
          className={cn(
            "opacity-0 animate-fade-in-up",
            `stagger-${placeholderPosts.length + index + 1}`
          )}
        />
      ))}
    </div>
  )
}
