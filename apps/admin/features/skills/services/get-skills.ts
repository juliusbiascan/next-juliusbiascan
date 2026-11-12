import type { PortfolioContent } from "@repo/db/portfolio"

export function getSkills(portfolio: PortfolioContent) {
  return portfolio.skills
}

export type SkillsData = ReturnType<typeof getSkills>
