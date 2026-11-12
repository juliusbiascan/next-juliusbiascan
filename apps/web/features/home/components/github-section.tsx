"use client"

import { cn } from "@workspace/ui/lib/utils"

import { useGitHubActivity } from "../api/github"
import { formatCount, formatDate, monthLabels } from "../utils/contributions"
import { formatShare } from "../utils/languages"

const LEVEL_CLASS = [
  "bg-muted",
  "bg-[#9be9a8] dark:bg-[#0e4429]",
  "bg-[#40c463] dark:bg-[#006d32]",
  "bg-[#30a14e] dark:bg-[#26a641]",
  "bg-[#216e39] dark:bg-[#39d353]",
] as const

export function GithubSectionFallback() {
  return (
    <section className="border-b border-border px-6 py-16 sm:px-10" aria-hidden="true">
      <div className="h-3 w-40 rounded-full bg-muted" />
      <div className="mt-4 h-8 w-72 max-w-full rounded-full bg-muted" />
      <div className="mt-4 h-4 w-96 max-w-full rounded-full bg-muted" />
      <div className="mt-10 h-28 rounded-md bg-muted" />
      <div className="mt-8 h-36 rounded-md bg-muted" />
    </section>
  )
}

export function GithubSection({
  profileUrl,
  username,
}: {
  profileUrl: string
  username: string
}) {
  const { data, isPending } = useGitHubActivity(username)

  if (isPending) {
    return <GithubSectionFallback />
  }

  const activity = data ?? null
  const labels = activity ? monthLabels(activity.weeks) : []
  const languages = activity?.languages ?? []
  const stats = activity
    ? [
        { label: "Repositories", value: activity.repositories },
        { label: "Stars", value: activity.stars },
        { label: "Followers", value: activity.followers },
      ]
    : []

  return (
    <section className="github-section border-b border-border px-6 py-16 sm:px-10">
      <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
        Open source & activity
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-medium md:text-3xl">GitHub Contributions</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            My coding activity, projects, and contributions throughout the year.
          </p>
        </div>
        <a
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          View GitHub ↗
        </a>
      </div>

      <div className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-foreground">
            Contribution activity
            {activity ? (
              <span className="text-muted-foreground">
                {" "}
                · {formatCount(activity.total)} in the last year
              </span>
            ) : null}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Less</span>
            {LEVEL_CLASS.map((levelClass) => (
              <span
                key={levelClass}
                className={cn("size-2.5 rounded-[2px]", levelClass)}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        {activity && activity.weeks.length > 0 ? (
          <div className="mt-4 overflow-x-auto pb-1">
            <div
              className="grid w-max gap-[3px]"
              style={{ gridTemplateColumns: `repeat(${activity.weeks.length}, 11px)` }}
            >
              {labels.map((label, index) => (
                <span
                  key={`${label}-${index}`}
                  className="h-4 text-[10px] leading-none text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>
            <div
              className="grid w-max gap-[3px]"
              style={{
                gridTemplateRows: "repeat(7, 11px)",
                gridAutoFlow: "column",
                gridAutoColumns: "11px",
              }}
              role="img"
              aria-label={`${formatCount(activity.total)} GitHub contributions in the last year`}
            >
              {activity.weeks.flat().map((day, index) =>
                day ? (
                  <span
                    key={day.date}
                    title={`${formatCount(day.count)} contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                    className={cn(
                      "size-[11px] rounded-[2px]",
                      LEVEL_CLASS[day.level] ?? LEVEL_CLASS[0]
                    )}
                  />
                ) : (
                  <span key={`empty-${index}`} className="size-[11px]" />
                )
              )}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Contribution activity is unavailable right now.
          </p>
        )}
      </div>

      {stats.length > 0 || languages.length > 0 ? (
        <div className="mt-8 border border-border">
          {stats.length > 0 ? (
            <dl className="grid grid-cols-3 gap-px bg-border">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-background px-4 py-5 sm:px-6">
                  <dd className="text-2xl font-medium tabular-nums">
                    {formatCount(stat.value)}
                  </dd>
                  <dt className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          ) : null}

          {languages.length > 0 ? (
            <div className="border-t border-border bg-background px-4 py-5 sm:px-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="text-sm text-foreground">Top languages</p>
                <p className="text-xs text-muted-foreground">
                  Share of code in public repositories
                </p>
              </div>
              <div className="mt-4 flex h-2 overflow-hidden rounded-[2px]" aria-hidden="true">
                {languages.map((language) => (
                  <span
                    key={language.name}
                    className="h-full"
                    style={{
                      width: `${language.share}%`,
                      backgroundColor: language.color,
                    }}
                  />
                ))}
              </div>
              <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {languages.map((language) => (
                  <li key={language.name} className="flex items-center gap-2 text-sm">
                    <span
                      className="size-2.5 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: language.color }}
                      aria-hidden="true"
                    />
                    <span className="truncate">{language.name}</span>
                    <span className="ml-auto tabular-nums text-muted-foreground">
                      {formatShare(language.share)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
