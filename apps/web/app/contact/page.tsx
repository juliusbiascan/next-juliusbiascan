import type { Metadata } from "next"
import { getPortfolio } from "@repo/db"

import { ContactPage } from "@/features/contact/components/contact-page"

export async function generateMetadata(): Promise<Metadata> {
  const portfolio = await getPortfolio()

  return {
    title: "Contact",
    description: `How to reach ${portfolio.name}.`,
  }
}

export default function Page() {
  return <ContactPage />
}
