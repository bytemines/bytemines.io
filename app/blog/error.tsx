"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-3xl font-bold">Failed to load blog</h1>
        <p className="mb-8 text-muted-foreground">
          There was a problem loading the blog posts.
        </p>
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-border px-4 py-2 transition-colors hover:bg-muted"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
