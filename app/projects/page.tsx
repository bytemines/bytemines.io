import { Metadata } from "next"
import { getFeaturedRepos } from "@/lib/github"
import { RepoCard } from "@/components/content/repo-card"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "Projects",
  description: "Open-source projects and code repositories.",
}

export default async function ProjectsPage() {
  const repos = await getFeaturedRepos()

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Projects
        </h1>
        <p className="mt-2 text-muted-foreground">
          Open-source tools and experiments.
        </p>
      </div>

      {/* Repos grid */}
      {repos.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo, index) => (
            <RepoCard
              key={repo.fullName}
              name={repo.name}
              description={repo.description}
              url={repo.url}
              stars={repo.stars}
              language={repo.language}
              className={`opacity-0 animate-fade-in-up stagger-${Math.min(index + 1, 8)}`}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No projects configured yet. Check out our{" "}
            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub
            </a>{" "}
            for our latest work!
          </p>
        </div>
      )}
    </div>
  )
}
