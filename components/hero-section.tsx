"use client"

import { useEffect, useState } from "react"
import { Github, Twitter } from "lucide-react"
import { siteConfig } from "@/lib/config"
import { ThemeToggle } from "@/components/theme-toggle"

const words = [
  "Exploring",
  "Synthesizing",
  "Wandering",
  "Contemplating",
  "Excavating",
  "Dreaming",
  "Tinkering",
  "Brewing",
  "Forging",
  "Decoding",
  "Unraveling",
  "Sculpting",
  "Navigating",
  "Pondering",
  "Assembling",
  "Distilling",
  "Weaving",
  "Transmuting",
  "Orchestrating",
  "Illuminating",
  "Architecting",
  "Calibrating",
  "Fermenting",
  "Conjuring",
  "Simmering",
  "Crystallizing",
  "Composing",
  "Incubating",
  "Refining",
  "Germinating",
]

const socials = [
  { icon: Twitter, href: siteConfig.socials.twitter, label: "Twitter", color: "hover:text-[#1DA1F2]" },
  { icon: Github, href: siteConfig.socials.github, label: "GitHub", color: "hover:text-white" },
]


export function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const target = words[currentWord]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < target.length) {
            setDisplayText(target.slice(0, displayText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 2500)
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setCurrentWord((prev) => (prev + 1) % words.length)
          }
        }
      },
      isDeleting ? 80 : 150
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentWord])

  return (
    <div className="mb-12 py-8">
      <div className="flex flex-col items-center text-center">
        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-[family-name:var(--font-space-grotesk)] opacity-0 animate-fade-in-down stagger-1">
          <span className="text-primary">BYTE</span>
          <span className="text-foreground">MINES</span>
        </h1>

        {/* Typing animation */}
        <div className="mt-4 h-7 opacity-0 animate-fade-in stagger-2">
          <span className="text-lg font-medium text-primary typing-cursor">
            {displayText}
          </span>
        </div>

        {/* Social links + Theme toggle */}
        <div className="mt-6 flex items-center gap-4 opacity-0 animate-fade-in-up stagger-3">
          {socials.map(({ icon: Icon, href, label, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-muted-foreground transition-colors duration-300 ${color}`}
              aria-label={label}
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
