import type { LanguageStat } from "./contributions"

const LANGUAGE_COLORS: Record<string, string> = {
  Assembly: "#6e4c13",
  Astro: "#ff5a03",
  Batchfile: "#c1f12e",
  C: "#555555",
  "C#": "#178600",
  "C++": "#f34b7d",
  CMake: "#da3434",
  CSS: "#663399",
  Dart: "#00b4ab",
  Dockerfile: "#384d54",
  Go: "#00add8",
  HTML: "#e34c26",
  Java: "#b07219",
  JavaScript: "#f1e05a",
  Kotlin: "#a97bff",
  MDX: "#fcb32c",
  "Objective-C": "#438eff",
  PHP: "#4f5d95",
  Python: "#3572a5",
  Ruby: "#701516",
  Rust: "#dea584",
  SCSS: "#c6538c",
  Shell: "#89e051",
  Swift: "#f05138",
  TypeScript: "#3178c6",
  "Visual Basic 6.0": "#2c6353",
  Vue: "#41b883",
}

const FALLBACK_COLOR = "#8b949e"
const TOP_LANGUAGE_LIMIT = 5

export function languageColor(name: string) {
  return LANGUAGE_COLORS[name] ?? FALLBACK_COLOR
}

export function formatShare(share: number) {
  return `${share.toFixed(1)}%`
}

export function favoriteLanguage(languages: LanguageStat[]) {
  return languages.find((language) => language.name !== "Other") ?? null
}

export function summarizeLanguages(
  totals: Iterable<[string, number]>,
  limit = TOP_LANGUAGE_LIMIT
): LanguageStat[] {
  const sorted = [...totals]
    .filter(([, bytes]) => bytes > 0)
    .sort((left, right) => right[1] - left[1])
  const total = sorted.reduce((sum, [, bytes]) => sum + bytes, 0)
  if (!total) return []

  const top = sorted.slice(0, limit)
  const remainder = sorted.slice(limit).reduce((sum, [, bytes]) => sum + bytes, 0)
  const rows = remainder > 0 ? [...top, ["Other", remainder] as const] : top

  return rows.map(([name, bytes]) => ({
    name,
    share: (bytes / total) * 100,
    color: name === "Other" ? FALLBACK_COLOR : languageColor(name),
  }))
}
