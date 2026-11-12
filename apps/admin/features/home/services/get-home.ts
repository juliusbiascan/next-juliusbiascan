import type { PortfolioContent } from "@repo/db/portfolio"

export function getHome(portfolio: PortfolioContent) {
  return {
    name: portfolio.name,
    role: portfolio.role,
    intro: portfolio.intro,
    github: portfolio.github,
    navigation: portfolio.navigation,
    skills: portfolio.skills,
  }
}

export type HomeData = ReturnType<typeof getHome>
