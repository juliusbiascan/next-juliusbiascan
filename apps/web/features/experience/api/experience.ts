"use client"

import { useQuery } from "@tanstack/react-query"

import { portfolioQueryOptions } from "@/features/site/api/portfolio"
import { getExperience } from "../services/get-experience"

export function useExperience() {
  const query = useQuery(portfolioQueryOptions)
  return {
    ...query,
    data: query.data ? getExperience(query.data) : undefined,
  }
}
