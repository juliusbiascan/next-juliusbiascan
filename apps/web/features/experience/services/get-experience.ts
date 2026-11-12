import type { PortfolioContent } from "@repo/db/portfolio"

export function getExperience(portfolio: PortfolioContent) {
  return {
    jobs: portfolio.experience,
    skills: portfolio.skills,
  }
}

export type ExperienceData = ReturnType<typeof getExperience>
