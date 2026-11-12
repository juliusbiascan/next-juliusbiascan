import type { PortfolioContent } from "@repo/db/portfolio"

export function getProfile(portfolio: PortfolioContent) {
  return {
    name: portfolio.name,
    role: portfolio.role,
    intro: portfolio.intro,
    contacts: portfolio.contacts,
    experience: portfolio.experience,
    skills: portfolio.skills,
    githubHref: portfolio.github.href,
  }
}

export type Profile = ReturnType<typeof getProfile>
