import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import { MDXRemote } from "next-mdx-remote/rsc"
import { getPostBySlug, getPostSlugs } from "@/lib/posts"
import { getMDXComponents } from "@/mdx-components"
import { Badge } from "@/components/ui/badge"
import { siteConfig } from "@/lib/config"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      authors: [siteConfig.author.name],
      tags: post.frontmatter.tags,
      images: post.frontmatter.image
        ? [post.frontmatter.image]
        : ["/og/default.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: post.frontmatter.image
        ? [post.frontmatter.image]
        : ["/og/default.png"],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const components = getMDXComponents()

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      {/* Back link */}
      <Link
        href="/blog"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to articles
      </Link>

      {/* Header */}
      <header className="mb-10">
        {/* Emoji/Image */}
        {post.frontmatter.emoji && (
          <div className="mb-6 text-6xl">{post.frontmatter.emoji}</div>
        )}
        {post.frontmatter.image && !post.frontmatter.emoji && (
          <img
            src={post.frontmatter.image}
            alt={post.frontmatter.title}
            className="mb-6 aspect-video w-full rounded-xl border border-border/40 object-cover"
          />
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {post.frontmatter.title}
        </h1>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {post.readingTime}
          </span>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {post.frontmatter.tags.map((tag) => (
            <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-invert max-w-none">
        <MDXRemote source={post.content} components={components} />
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-border/40 pt-8">
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            ← More articles
          </Link>
          <div className="flex items-center gap-4">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.frontmatter.title)}&url=${encodeURIComponent(`${siteConfig.url}/blog/${slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Share on Twitter
            </a>
          </div>
        </div>
      </footer>
    </article>
  )
}
