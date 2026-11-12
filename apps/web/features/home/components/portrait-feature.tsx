import Image from "next/image"

import { cn } from "@workspace/ui/lib/utils"

import type { Profile } from "../services/get-profile"

export function PortraitFeature({
  name,
  roles,
}: {
  name: string
  roles: Profile["experience"]
}) {
  const count = roles.length

  return (
    <div className="relative mx-auto w-full max-w-[17rem] sm:max-w-[19rem]">
      <style>{`
        @keyframes portrait-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .portrait-float {
          animation: portrait-float 5.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .portrait-float { animation: none; }
        }
      `}</style>

      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-muted">
        <Image
          src="/julius-biascan.jpg"
          alt={name}
          fill
          priority
          sizes="(min-width: 640px) 304px, 272px"
          className="object-cover object-[center_18%]"
        />
      </div>

      <div
        className={cn(
          "portrait-float absolute top-10 left-0 z-10 -translate-x-1/4 rounded-xl border border-border bg-background/95 px-3.5 py-3 shadow-[0_16px_40px_-18px_rgba(0,0,0,0.55)] backdrop-blur-sm",
          "sm:-left-2"
        )}
      >
        <p className="text-3xl font-medium leading-none tabular-nums">{count}</p>
        <p className="mt-1 text-xs text-muted-foreground">Experience</p>
      </div>

      {roles.map((role, index) => (
        <div
          key={role.id}
          className={cn(
            "portrait-float absolute z-10 max-w-[11rem] rounded-xl border border-border bg-background/95 px-3 py-2.5 shadow-[0_16px_40px_-18px_rgba(0,0,0,0.55)] backdrop-blur-sm",
            index === 0
              ? "top-6 right-0 translate-x-1/4 [animation-delay:0.8s]"
              : "right-3 bottom-8 [animation-delay:1.6s] sm:-right-2"
          )}
        >
          <p className="text-sm leading-tight font-medium">{role.role}</p>
          <p className="mt-1 text-xs text-muted-foreground">{role.dates}</p>
        </div>
      ))}
    </div>
  )
}
