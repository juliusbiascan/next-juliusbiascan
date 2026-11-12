import { Separator } from "@workspace/ui/components/separator"

export function SectionRule({
  variant = "solid",
}: {
  variant?: "solid" | "dotted"
}) {
  if (variant === "dotted") {
    return (
      <div
        role="separator"
        className="relative h-4 overflow-hidden border-y border-border bg-background"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, currentColor 1px, transparent 0)",
            backgroundSize: "12px 12px",
            backgroundPosition: "6px 6px",
            color: "var(--foreground)",
            opacity: 0.25,
            maskImage:
              "linear-gradient(to right, transparent, black 2%, black 98%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 2%, black 98%, transparent)",
          }}
        />
      </div>
    )
  }

  return <Separator />
}
