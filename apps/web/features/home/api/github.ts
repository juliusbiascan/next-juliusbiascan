"use client"

import { useQuery } from "@tanstack/react-query"

import type { GitHubActivity } from "../utils/contributions"

export function useGitHubActivity(username: string) {
  return useQuery({
    queryKey: ["github", "activity", username],
    queryFn: async (): Promise<GitHubActivity | null> => {
      const response = await fetch("/api/github")
      if (!response.ok) return null
      return response.json()
    },
    staleTime: 60 * 60 * 1000,
  })
}
