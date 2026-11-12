export function externalLinkProps(external: boolean) {
  if (!external) return {}

  return {
    target: "_blank" as const,
    rel: "noreferrer",
  }
}
