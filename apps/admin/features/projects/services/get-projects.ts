import type { PortfolioContent } from "@repo/db/portfolio"

export function getProjects(portfolio: PortfolioContent) {
  return portfolio.projects
}

export type ProjectsData = ReturnType<typeof getProjects>
