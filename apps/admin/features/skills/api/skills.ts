"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { PortfolioContent } from "@repo/db/portfolio"

import {
  portfolioQueryKey,
  portfolioQueryOptions,
} from "@/features/site/api/portfolio"
import { saveSkills } from "@/lib/portfolio-actions"

import { getSkills } from "../services/get-skills"

export function useSkills() {
  const query = useQuery(portfolioQueryOptions)
  return {
    ...query,
    data: query.data ? getSkills(query.data) : undefined,
  }
}

export function useSaveSkills() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveSkills,
    onSuccess: (result) => {
      if (!result.ok) return
      queryClient.setQueryData<PortfolioContent>(portfolioQueryKey, (current) =>
        current ? { ...current, skills: result.data.skills } : current
      )
    },
  })
}
