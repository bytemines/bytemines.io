import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface PostCardProps {
  slug: string
  title: string
  excerpt: string
  date: string
  className?: string
}

export function PostCard({
  slug,
  title,
  excerpt,
  date,
  className,
}: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <Card
        className={cn(
          "group relative h-full overflow-hidden border-border/60 bg-card",
          "hover:border-primary/40 hover-lift glow-border",
          className
        )}
      >
        <CardContent className="flex h-full flex-col p-5">
          {/* Title */}
          <h3 className="mb-2 font-semibold leading-tight transition-colors group-hover:text-primary">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2">
            {excerpt}
          </p>

          {/* Date */}
          <time dateTime={date} className="text-xs text-muted-foreground">
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </CardContent>
      </Card>
    </Link>
  )
}
