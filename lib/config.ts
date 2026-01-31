export const siteConfig = {
  name: "Bytemines",
  description: "Mining precious knowledge, one byte at a time.",
  tagline: "Exploring DIY, BioTech, AI, Quantum Computing, and more.",
  url: "https://bytemines.io",
  email: "hello@bytemines.io",

  // Social links
  socials: {
    twitter: "https://twitter.com/bytemines",
    youtube: "https://youtube.com/@lab.bytemines",
    github: "https://github.com/bytemines",
    linkedin: "https://linkedin.com/company/bytemines",
  },

  // Navigation links
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Projects", href: "/projects" },
  ],

  // Content categories/topics
  categories: [
    "DIY",
    "BioTech",
    "Longevity",
    "AI",
    "Quantum",
    "Electronics",
    "Interviews",
    "Parametric Design",
    "3D Printing",
    "Engineering",
  ],

  // Featured GitHub repos (manually curated)
  featuredRepos: [
    // Add repos like: "bytemines/repo-name"
  ],

  // Author info
  author: {
    name: "Bytemines",
    twitter: "@bytemines",
  },
} as const

export type SiteConfig = typeof siteConfig
