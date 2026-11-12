import Pusher from "pusher"

import type { PortfolioContent } from "@repo/db/portfolio"

export async function publishPortfolio(content: PortfolioContent) {
  const appId = process.env.PUSHER_APP_ID
  const key = process.env.PUSHER_APP_KEY
  const secret = process.env.PUSHER_APP_SECRET
  const cluster = process.env.PUSHER_APP_CLUSTER

  if (!appId || !key || !secret || !cluster) {
    throw new Error("Pusher is not configured")
  }

  const pusher = new Pusher({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  })

  await pusher.trigger("portfolio", "content.updated", content)
}
