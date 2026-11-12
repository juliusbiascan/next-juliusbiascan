export type ContributionDay = {
  date: string
  count: number
  level: number
}

export type ContributionWeek = Array<ContributionDay | null>

export type LanguageStat = {
  name: string
  share: number
  color: string
}

export type GitHubActivity = {
  repositories: number
  stars: number
  followers: number
  total: number
  weeks: ContributionWeek[]
  languages: LanguageStat[]
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  if (!year || !month || !day) return iso

  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

export function buildWeeks(days: ContributionDay[]) {
  const first = days[0]
  if (!first) return []

  const [year, month, day] = first.date.split("-").map(Number)
  if (!year || !month || !day) return []

  const firstWeekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  const cells: ContributionWeek = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...days,
  ]
  const weeks: ContributionWeek[] = []

  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }

  return weeks
}

export function monthLabels(weeks: ContributionWeek[]) {
  let previousMonth = -1
  let lastLabeledWeek = -4

  return weeks.map((week, index) => {
    const dated = week.find((day) => day)
    if (!dated) return ""

    const month = Number(dated.date.slice(5, 7)) - 1
    if (month === previousMonth || index - lastLabeledWeek < 3) {
      previousMonth = month
      return ""
    }

    previousMonth = month
    lastLabeledWeek = index
    return MONTHS[month] ?? ""
  })
}
