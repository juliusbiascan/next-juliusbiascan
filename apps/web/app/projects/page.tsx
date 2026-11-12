import type { Metadata } from "next"
import { getPortfolio } from "@repo/db"

import { ProjectsPage } from "@/features/projects/components/projects-page"

export async function generateMetadata(): Promise<Metadata> {
  const portfolio = await getPortfolio()

  return {
    title: "Projects",
    description: `Selected work by ${portfolio.name}.`,
  }
}

export default function Page() {
  return <ProjectsPage />
}
