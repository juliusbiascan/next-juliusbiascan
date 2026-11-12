import { getPortfolio } from "@repo/db"

import { getGitHubActivity } from "@/features/home/services/get-github-activity"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const portfolio = await getPortfolio()
    return Response.json(await getGitHubActivity(portfolio.github.username))
  } catch {
    return Response.json(
      { message: "GitHub activity is unavailable" },
      { status: 502 }
    )
  }
}
