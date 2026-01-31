import fs from "fs"
import path from "path"
import matter from "gray-matter"
import readingTime from "reading-time"

const postsDirectory = path.join(process.cwd(), "content/posts")

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  tags: string[]
  image?: string
  emoji?: string
  featured?: boolean
  draft?: boolean
}

export interface Post {
  slug: string
  frontmatter: PostFrontmatter
  content: string
  readingTime: string
}

export interface PostMeta {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  image?: string
  emoji?: string
  featured: boolean
  readingTime: string
}

export function getPostSlugs(): string[] {
  // Ensure the directory exists
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
    return []
  }

  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, "utf8")
  const { data, content } = matter(fileContents)

  const frontmatter = data as PostFrontmatter
  const stats = readingTime(content)

  return {
    slug,
    frontmatter,
    content,
    readingTime: stats.text,
  }
}

export function getAllPosts(): PostMeta[] {
  const slugs = getPostSlugs()

  const posts = slugs
    .map((slug): PostMeta | null => {
      const post = getPostBySlug(slug)
      if (!post) return null
      if (post.frontmatter.draft) return null

      return {
        slug,
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        date: post.frontmatter.date,
        tags: post.frontmatter.tags || [],
        image: post.frontmatter.image,
        emoji: post.frontmatter.emoji,
        featured: post.frontmatter.featured || false,
        readingTime: post.readingTime,
      }
    })
    .filter((post): post is PostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  )
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tagsSet = new Set<string>()

  posts.forEach((post) => {
    post.tags.forEach((tag) => tagsSet.add(tag))
  })

  return Array.from(tagsSet).sort()
}
