import { execFile } from "node:child_process"

import {
  buildWeeks,
  type ContributionDay,
  type GitHubActivity,
} from "../utils/contributions"
import { summarizeLanguages } from "../utils/languages"

type ContributionResponse = {
  total?: { lastYear?: number }
  contributions?: ContributionDay[]
}

type GitHubUser = {
  public_repos?: number
  followers?: number
}

type GitHubRepo = {
  name?: string
  fork?: boolean
  size?: number
  language?: string | null
  stargazers_count?: number
}

type LanguageBytes = Record<string, number>

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "juliusbiascan-portfolio",
}

const fetchOptions = {
  headers,
  next: { revalidate: 3600 },
} as const

const LANGUAGE_CACHE_MS = 60 * 60 * 1000

const languageQuery = `
  query($login: String!, $after: String) {
    user(login: $login) {
      repositories(
        first: 100
        after: $after
        ownerAffiliations: OWNER
        isFork: false
        privacy: PUBLIC
      ) {
        nodes {
          languages(first: 20, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node { name }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`

let githubTokenCache: string | null | undefined
let languageCache: {
  username: string
  totals: Map<string, number>
  at: number
} | null = null

export async function getGitHubActivity(
  username: string
): Promise<GitHubActivity> {
  const [userResponse, repoResponse, contributionResponse] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, fetchOptions),
    fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&type=owner`,
      fetchOptions
    ),
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
      next: { revalidate: 3600 },
    }),
  ])

  if (!userResponse.ok || !repoResponse.ok || !contributionResponse.ok) {
    throw new Error("GitHub activity is unavailable")
  }

  const user = (await userResponse.json()) as GitHubUser
  const repos = (await repoResponse.json()) as GitHubRepo[]
  const contributions = (await contributionResponse.json()) as ContributionResponse
  const days = contributions.contributions ?? []

  return {
    repositories: user.public_repos ?? 0,
    stars: repos.reduce((total, repo) => total + (repo.stargazers_count ?? 0), 0),
    followers: user.followers ?? 0,
    total:
      contributions.total?.lastYear ??
      days.reduce((sum, day) => sum + day.count, 0),
    weeks: buildWeeks(days),
    languages: summarizeLanguages(await languageTotals(username, repos)),
  }
}

async function languageTotals(username: string, repos: GitHubRepo[]) {
  if (
    languageCache?.username === username &&
    Date.now() - languageCache.at < LANGUAGE_CACHE_MS
  ) {
    return languageCache.totals
  }

  const counted = (await languagesFromGraphQL(username)) ?? (await languagesFromRest(username, repos))
  if (counted) {
    languageCache = { username, totals: counted, at: Date.now() }
    return counted
  }

  return sizeWeightedLanguages(repos)
}

async function languagesFromGraphQL(username: string) {
  const token = await githubToken()
  if (!token) return null

  const totals = new Map<string, number>()
  let after: string | null = null

  for (let page = 0; page < 5; page += 1) {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: languageQuery,
        variables: { login: username, after },
      }),
    })
    if (!response.ok) return null

    const payload = (await response.json()) as {
      errors?: unknown[]
      data?: {
        user?: {
          repositories?: {
            nodes?: Array<{
              languages?: {
                edges?: Array<{ size?: number; node?: { name?: string } } | null> | null
              } | null
            } | null> | null
            pageInfo?: { hasNextPage?: boolean; endCursor?: string | null }
          } | null
        } | null
      }
    }
    if (payload.errors?.length) return totals.size > 0 ? totals : null

    const connection = payload.data?.user?.repositories
    if (!connection) return totals.size > 0 ? totals : null

    for (const repo of connection.nodes ?? []) {
      for (const edge of repo?.languages?.edges ?? []) {
        const name = edge?.node?.name
        if (!name || typeof edge?.size !== "number" || edge.size <= 0) continue
        totals.set(name, (totals.get(name) ?? 0) + edge.size)
      }
    }

    if (!connection.pageInfo?.hasNextPage || !connection.pageInfo.endCursor) break
    after = connection.pageInfo.endCursor
  }

  return totals.size > 0 ? totals : null
}

async function languagesFromRest(username: string, repos: GitHubRepo[]) {
  const owned = repos.filter((repo) => repo.name && !repo.fork)
  const breakdowns = await mapWithConcurrency(owned, 6, (repo) =>
    fetchLanguages(username, repo.name ?? "")
  )
  const successful = breakdowns.filter((languages) => languages !== null)
  if (successful.length === 0 || successful.length < owned.length / 2) return null

  const totals = new Map<string, number>()
  for (const languages of successful) addBytes(totals, languages)
  return totals.size > 0 ? totals : null
}

function sizeWeightedLanguages(repos: GitHubRepo[]) {
  const totals = new Map<string, number>()
  for (const repo of repos) {
    if (repo.fork || !repo.language || !repo.size) continue
    totals.set(repo.language, (totals.get(repo.language) ?? 0) + repo.size)
  }
  return totals
}

async function fetchLanguages(username: string, repo: string) {
  if (!repo) return null

  const response = await fetch(
    `https://api.github.com/repos/${username}/${repo}/languages`,
    { headers }
  )
  if (!response.ok) return null

  const languages = (await response.json()) as LanguageBytes
  return languages && typeof languages === "object" ? languages : null
}

async function githubToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN
  if (githubTokenCache !== undefined) return githubTokenCache

  githubTokenCache = await new Promise<string | null>((resolve) => {
    execFile(
      "gh",
      ["auth", "token"],
      { timeout: 4000, windowsHide: true, encoding: "utf8" },
      (error, stdout) => {
        resolve(error ? null : stdout.trim() || null)
      }
    )
  })

  return githubTokenCache
}

function addBytes(totals: Map<string, number>, languages: LanguageBytes) {
  for (const [name, bytes] of Object.entries(languages)) {
    if (typeof bytes !== "number" || bytes <= 0) continue
    totals.set(name, (totals.get(name) ?? 0) + bytes)
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T) => Promise<R>
) {
  const results = new Array<R>(items.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex
      nextIndex += 1
      const item = items[index]
      if (item === undefined) continue
      results[index] = await mapper(item)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  )

  return results
}
