import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface RepoCardProps {
  name: string
  description: string
  url: string
  stars: number
  language: string
  className?: string
}

export function RepoCard({
  name,
  description,
  url,
  stars,
  language,
  className,
}: RepoCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Card
        className={cn(
          "group relative h-full overflow-hidden border-border/60 bg-card transition-all duration-300",
          "hover:border-primary/40 hover:bg-card hover-lift glow-border",
          className
        )}
      >
        <CardContent className="flex h-full flex-col p-5">
          {/* Name */}
          <h3 className="mb-2 font-semibold leading-tight transition-colors group-hover:text-primary">
            {name}
          </h3>

          {/* Description */}
          <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>

          {/* Footer: Language + Stars */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{language}</span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              {stars.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
