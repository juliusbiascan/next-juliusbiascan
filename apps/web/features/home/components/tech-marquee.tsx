import { TechIcon } from "@/features/experience/components/tech-icon"

import type { Profile } from "../services/get-profile"

export function TechMarquee({ skills }: { skills: Profile["skills"] }) {
  const techStack = skills.flatMap((group) => group.items)

  return (
    <section
      aria-label="Tech stack"
      className="tech-marquee overflow-hidden border-y border-border bg-border"
    >
      <style>{`
        @keyframes tech-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% - 1px)); }
        }
        .tech-marquee-track {
          animation: tech-marquee 40s linear infinite;
        }
        .tech-marquee:hover .tech-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .tech-marquee-track { animation: none; }
          .tech-marquee { overflow-x: auto; }
        }
      `}</style>
      <div className="flex gap-px">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="tech-marquee-track flex shrink-0 gap-px"
          >
            {techStack.map((name) => (
              <li
                key={`${copy}-${name}`}
                className="flex w-48 shrink-0 items-center justify-center gap-2.5 bg-background px-6 py-6 text-sm font-medium sm:w-56"
              >
                <TechIcon name={name} />
                {name}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
