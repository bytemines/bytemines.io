import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getPostsByTag, getAllTags } from "@/lib/posts"
import { PostCard } from "@/components/content/post-card"
import { capitalize } from "@/lib/utils"

interface PageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((tag) => ({ tag: tag.toLowerCase() }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params
  const formattedTag = capitalize(tag)

  return {
    title: `${formattedTag} Articles`,
    description: `Articles tagged with ${formattedTag}`,
  }
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params
  const posts = getPostsByTag(tag)

  if (posts.length === 0) {
    notFound()
  }

  const formattedTag = capitalize(tag)

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      {/* Back link */}
      <Link
        href="/blog"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        All articles
      </Link>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="text-primary">#</span> {formattedTag}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {posts.length} article{posts.length === 1 ? "" : "s"} tagged with{" "}
          <span className="text-foreground">{formattedTag}</span>
        </p>
      </div>

      {/* Posts grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <PostCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            excerpt={post.description}
            date={post.date}
            className={`opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}
          />
        ))}
      </div>
    </div>
  )
}
