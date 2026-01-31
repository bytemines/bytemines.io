import type { MDXComponents } from "mdx/types"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Custom components for MDX
function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "tip" | "danger"
  children: React.ReactNode
}) {
  const styles = {
    info: "border-blue-500/50 bg-blue-500/10 text-blue-200",
    warning: "border-yellow-500/50 bg-yellow-500/10 text-yellow-200",
    tip: "border-green-500/50 bg-green-500/10 text-green-200",
    danger: "border-red-500/50 bg-red-500/10 text-red-200",
  }

  const icons = {
    info: "ℹ️",
    warning: "⚠️",
    tip: "💡",
    danger: "🚨",
  }

  return (
    <div
      className={cn(
        "my-6 rounded-lg border-l-4 p-4",
        styles[type]
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">{icons[type]}</span>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

export function getMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    // Headings
    h1: ({ children, ...props }) => (
      <h1
        className="mt-10 mb-4 text-3xl font-bold tracking-tight scroll-mt-20"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="mt-10 mb-4 text-2xl font-semibold tracking-tight scroll-mt-20 border-b border-border/40 pb-2"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="mt-8 mb-3 text-xl font-semibold tracking-tight scroll-mt-20"
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4
        className="mt-6 mb-2 text-lg font-semibold tracking-tight"
        {...props}
      >
        {children}
      </h4>
    ),

    // Paragraph
    p: ({ children, ...props }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-4" {...props}>
        {children}
      </p>
    ),

    // Links
    a: ({ href, children, ...props }) => {
      const isExternal = href?.startsWith("http")

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
            {...props}
          >
            {children}
          </a>
        )
      }

      return (
        <Link
          href={href || "#"}
          className="text-primary underline-offset-4 hover:underline"
          {...props}
        >
          {children}
        </Link>
      )
    },

    // Lists
    ul: ({ children, ...props }) => (
      <ul className="my-4 ml-6 list-disc [&>li]:mt-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="my-4 ml-6 list-decimal [&>li]:mt-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-7" {...props}>
        {children}
      </li>
    ),

    // Blockquote
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="my-6 border-l-4 border-primary/50 pl-4 italic text-muted-foreground"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Code
    code: ({ children, ...props }) => (
      <code
        className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm text-primary"
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre
        className="my-6 overflow-x-auto rounded-lg border bg-muted/50 p-4"
        {...props}
      >
        {children}
      </pre>
    ),

    // Table
    table: ({ children, ...props }) => (
      <div className="my-6 w-full overflow-x-auto">
        <table className="w-full border-collapse" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className="border border-border/60 bg-muted/50 px-4 py-2 text-left font-semibold"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-border/60 px-4 py-2" {...props}>
        {children}
      </td>
    ),

    // Horizontal rule
    hr: (props) => <hr className="my-8 border-border/60" {...props} />,

    // Images
    img: ({ src, alt, ...props }) => (
      <figure className="my-6">
        <img
          src={src}
          alt={alt}
          className="rounded-lg border border-border/40"
          {...props}
        />
        {alt && (
          <figcaption className="mt-2 text-center text-sm text-muted-foreground">
            {alt}
          </figcaption>
        )}
      </figure>
    ),

    // Custom components
    Callout,

    ...components,
  }
}
