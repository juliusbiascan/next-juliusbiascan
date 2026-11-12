import {
  buildWeeks,
  type ContributionDay,
  type GitHubActivity,
} from "../utils/contributions"

type ContributionResponse = {
  total?: { lastYear?: number }
  contributions?: ContributionDay[]
}

type GitHubUser = {
  public_repos?: number
  followers?: number
}

type GitHubRepo = {
  stargazers_count?: number
}

const fetchOptions = {
  headers: {
    Accept: "application/vnd.github+json",
    "User-Agent": "juliusbiascan-portfolio",
  },
  next: { revalidate: 3600 },
} as const

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
  }
}
