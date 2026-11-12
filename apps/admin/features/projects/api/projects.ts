"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { PortfolioContent } from "@repo/db/portfolio"

import {
  portfolioQueryKey,
  portfolioQueryOptions,
} from "@/features/site/api/portfolio"
import { saveProjects } from "@/lib/portfolio-actions"

import { getProjects } from "../services/get-projects"

export function useProjects() {
  const query = useQuery(portfolioQueryOptions)
  return {
    ...query,
    data: query.data ? getProjects(query.data) : undefined,
  }
}

export function useSaveProjects() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveProjects,
    onSuccess: (result) => {
      if (!result.ok) return
      queryClient.setQueryData<PortfolioContent>(portfolioQueryKey, (current) =>
        current ? { ...current, projects: result.data.projects } : current
      )
    },
  })
}
