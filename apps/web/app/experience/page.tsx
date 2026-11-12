import type { Metadata } from "next"
import { getPortfolio } from "@repo/db"

import { ExperiencePage } from "@/features/experience/components/experience-page"

export async function generateMetadata(): Promise<Metadata> {
  const portfolio = await getPortfolio()

  return {
    title: "Experience",
    description: `Work history and skills of ${portfolio.name}.`,
  }
}

export default function Page() {
  return <ExperiencePage />
}
