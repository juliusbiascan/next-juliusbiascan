"use client"

import { useQuery } from "@tanstack/react-query"

import { getProjects } from "../services/get-projects"
import { portfolioQueryOptions } from "@/features/site/api/portfolio"

export function useProjects() {
  const query = useQuery(portfolioQueryOptions)
  return {
    ...query,
    data: query.data ? getProjects(query.data) : undefined,
  }
}
