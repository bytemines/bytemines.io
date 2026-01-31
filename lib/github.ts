import { siteConfig } from "./config"

export interface GitHubRepo {
  name: string
  fullName: string
  description: string
  url: string
  stars: number
  language: string
}

export async function getFeaturedRepos(): Promise<GitHubRepo[]> {
  const repos = siteConfig.featuredRepos

  // Return placeholder if no repos configured
  if (!repos || repos.length === 0) {
    return getPlaceholderRepos()
  }

  try {
    const repoData = await Promise.all(
      repos.map(async (repoPath) => {
        const response = await fetch(
          `https://api.github.com/repos/${repoPath}`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
              ...(process.env.GITHUB_TOKEN && {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
              }),
            },
            next: { revalidate: 3600 },
          }
        )

        if (!response.ok) {
          console.warn(`Failed to fetch repo: ${repoPath}`)
          return null
        }

        const data = await response.json()

        return {
          name: data.name,
          fullName: data.full_name,
          description: data.description || "No description provided",
          url: data.html_url,
          stars: data.stargazers_count,
          language: data.language || "Unknown",
        }
      })
    )

    return repoData.filter((repo): repo is GitHubRepo => repo !== null)
  } catch (error) {
    console.error("Error fetching GitHub repos:", error)
    return getPlaceholderRepos()
  }
}

// Placeholder repos for development/demo
function getPlaceholderRepos(): GitHubRepo[] {
  return [
    {
      name: "quantum-simulator",
      fullName: "bytemines/quantum-simulator",
      description: "A lightweight quantum circuit simulator for learning quantum computing concepts",
      url: "https://github.com/bytemines/quantum-simulator",
      stars: 128,
      language: "Python",
    },
    {
      name: "bio-tracker",
      fullName: "bytemines/bio-tracker",
      description: "Open-source biometrics tracking and analysis platform",
      url: "https://github.com/bytemines/bio-tracker",
      stars: 89,
      language: "TypeScript",
    },
    {
      name: "parametric-lib",
      fullName: "bytemines/parametric-lib",
      description: "Parametric design library for generative 3D models",
      url: "https://github.com/bytemines/parametric-lib",
      stars: 256,
      language: "Rust",
    },
  ]
}
